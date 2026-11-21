/**
 * Định nghĩa kiểu dữ liệu cho tầng API Client của Dịp Xinh
 * Ánh xạ chuẩn Spring Boot RFC-7807 ErrorResponse DTO
 */

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}

export class ApiClientError extends Error {
  status: number;
  error: string;
  path: string;
  fieldErrors?: Record<string, string>;
  isNetworkError: boolean;

  constructor(params: {
    message: string;
    status?: number;
    error?: string;
    path?: string;
    fieldErrors?: Record<string, string>;
    isNetworkError?: boolean;
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.status = params.status ?? 500;
    this.error = params.error ?? 'INTERNAL_SERVER_ERROR';
    this.path = params.path ?? '';
    this.fieldErrors = params.fieldErrors;
    this.isNetworkError = params.isNetworkError ?? false;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}
