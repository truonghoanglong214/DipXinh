/**
 * Quản lý vòng đời Access Token trong bộ nhớ (In-memory storage)
 * Tuân thủ bảo mật OWASP: Không lưu trữ Access Token trong localStorage để chống rò rỉ XSS.
 * Refresh Token được trình duyệt tự động gửi qua HttpOnly Cookie.
 */

let inMemoryAccessToken: string | null = null;
const authListeners = new Set<(token: string | null) => void>();

export const tokenManager = {
  getAccessToken: (): string | null => inMemoryAccessToken,

  setAccessToken: (token: string | null): void => {
    inMemoryAccessToken = token;
    authListeners.forEach((listener) => listener(token));
  },

  clearAccessToken: (): void => {
    inMemoryAccessToken = null;
    authListeners.forEach((listener) => listener(null));
  },

  subscribe: (listener: (token: string | null) => void): (() => void) => {
    authListeners.add(listener);
    return () => {
      authListeners.delete(listener);
    };
  },
};
