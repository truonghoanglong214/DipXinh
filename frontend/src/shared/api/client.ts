import { ApiClientError, type ApiErrorResponse, type RequestOptions } from './types';
import { tokenManager } from './token-manager';

const BASE_URL = (import.meta.env.VITE_API_URL as string) || '';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: { endpoint: string; options?: RequestOptions };
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      // Retry request với token mới
      promise.resolve(rawRequest(promise.config.endpoint, promise.config.options));
    }
  });
  failedQueue = [];
};

/**
 * Thực hiện refresh token xoay vòng (Single-flight logic)
 * Gọi endpoint Spring Boot: POST /api/v1/auth/refresh với HttpOnly Cookie
 */
async function refreshAccessToken(): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Bắt buộc để gửi cookie refresh_token
    });

    if (!res.ok) {
      throw new Error('Refresh token expired or invalid');
    }

    const data = (await res.json()) as { accessToken: string };
    tokenManager.setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (err) {
    tokenManager.clearAccessToken();
    window.dispatchEvent(new CustomEvent('dipxinh_unauthorized'));
    throw err;
  }
}

/**
 * Hàm gửi HTTP Request cơ sở
 */
async function rawRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, skipAuth = false, headers = {}, ...rest } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  const currentToken = tokenManager.getAccessToken();
  if (!skipAuth && currentToken) {
    requestHeaders['Authorization'] = `Bearer ${currentToken}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiClientError({
      message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
      isNetworkError: true,
    });
  }

  // Xử lý khi mã phản hồi 401 Unauthorized
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({
          resolve: resolve as (value: unknown) => void,
          reject,
          config: { endpoint, options },
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      return rawRequest<T>(endpoint, options);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      throw new ApiClientError({
        message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
        status: 401,
      });
    } finally {
      isRefreshing = false;
    }
  }

  // Xử lý mã lỗi HTTP trả về từ Spring Boot
  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = (await response.json()) as ApiErrorResponse;
    } catch {
      // Trường hợp phản hồi không phải JSON
    }

    throw new ApiClientError({
      message: errorData?.message || `Yêu cầu thất bại với mã lỗi HTTP ${response.status}`,
      status: response.status,
      error: errorData?.error,
      path: errorData?.path,
      fieldErrors: errorData?.fieldErrors,
    });
  }

  // Trường hợp phản hồi 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    rawRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    rawRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    rawRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    rawRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    rawRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
