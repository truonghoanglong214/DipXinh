import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient, tokenManager, ApiClientError, shopApi, type BackendShopResponse } from '@/shared/api';
import type { AuthUser, UserRole, LoginResponseDto } from '../types/auth.types';
import { demoStore } from '@/shared/demo/demo-store';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  switchShop: (shopSlug: string) => void;
  setDemoRole: (role: UserRole, shopSlug?: string) => void;
  refreshShops: () => Promise<BackendShopResponse[]>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_ACCOUNTS: Record<string, { email: string; role: UserRole; displayName: string; shopSlug: string; shopIds: string[] }> = {
  'admin@dipxinh.vn': {
    email: 'admin@dipxinh.vn',
    role: 'ROLE_PLATFORM_ADMIN',
    displayName: 'Quản Trị Viên Sàn',
    shopSlug: 'aurora-boutique',
    shopIds: ['aurora-boutique', 'shop-1', 'shop-2'],
  },
  'owner@dipxinh.vn': {
    email: 'owner@dipxinh.vn',
    role: 'ROLE_SHOP_OWNER',
    displayName: 'Bà Lê Thu Thảo (Chủ Shop)',
    shopSlug: 'aurora-boutique',
    shopIds: ['aurora-boutique'],
  },
  'staff@dipxinh.vn': {
    email: 'staff@dipxinh.vn',
    role: 'ROLE_SHOP_STAFF',
    displayName: 'Nguyễn Thùy Linh (Nhân Viên Quầy)',
    shopSlug: 'aurora-boutique',
    shopIds: ['aurora-boutique'],
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserShops = async (): Promise<BackendShopResponse[]> => {
    try {
      const backendShops = await shopApi.getMyShops();
      if (backendShops && backendShops.length > 0) {
        demoStore.syncBackendShops(backendShops);
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            shopIds: backendShops.map((s) => s.id),
            currentShopSlug: prev.currentShopSlug || backendShops[0].slug,
          };
        });
      }
      return backendShops || [];
    } catch (err) {
      console.warn('Failed to fetch user shops from backend', err);
      return [];
    }
  };

  useEffect(() => {
    // 1. Thử khôi phục session khi tải lại trang (silent refresh qua HttpOnly Cookie)
    const restoreSession = async () => {
      try {
        const data = await apiClient.post<LoginResponseDto>(
          '/v1/auth/refresh',
          {},
          { skipAuth: true }
        );

        if (data?.accessToken && data?.user) {
          tokenManager.setAccessToken(data.accessToken);

          let userRole: UserRole = 'ROLE_SHOP_OWNER';
          const trimmedEmail = data.user.email.toLowerCase();
          if (trimmedEmail.includes('admin')) {
            userRole = 'ROLE_PLATFORM_ADMIN';
          } else if (trimmedEmail.includes('staff')) {
            userRole = 'ROLE_SHOP_STAFF';
          }

          const authenticatedUser: AuthUser = {
            id: String(data.user.id),
            email: data.user.email,
            displayName: data.user.displayName || data.user.email,
            role: data.user.role || userRole,
            shopIds: ['aurora-boutique'],
            currentShopSlug: 'aurora-boutique',
          };

          try {
            const backendShops = await shopApi.getMyShops();
            if (backendShops && backendShops.length > 0) {
              demoStore.syncBackendShops(backendShops);
              authenticatedUser.shopIds = backendShops.map((s) => s.id);
              authenticatedUser.currentShopSlug = backendShops[0].slug;
              demoStore.setShop(backendShops[0].id);
            }
          } catch {
            // fallback gracefully
          }

          setUser(authenticatedUser);
          demoStore.setRole(
            userRole === 'ROLE_PLATFORM_ADMIN'
              ? 'PLATFORM_ADMIN'
              : userRole === 'ROLE_SHOP_STAFF'
              ? 'SHOP_STAFF'
              : 'SHOP_OWNER'
          );
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    // 2. Lắng nghe sự kiện hết hạn token từ HTTP client
    const handleUnauthorized = () => {
      setUser(null);
      tokenManager.clearAccessToken();
    };

    window.addEventListener('dipxinh_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('dipxinh_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    try {
      // 1. Thử gọi API thực tế tới Spring Boot Backend
      let loginData: LoginResponseDto | null = null;
      try {
        loginData = await apiClient.post<LoginResponseDto>('/v1/auth/login', {
          email: trimmedEmail,
          password,
        }, { skipAuth: true });
      } catch (err) {
        // Nếu là lỗi mạng do Backend chưa chạy, kiểm tra xem có phải tài khoản Demo không
        if (err instanceof ApiClientError && err.isNetworkError) {
          const demoMatch = DEMO_ACCOUNTS[trimmedEmail];
          if (demoMatch && (password === '123456' || password === 'Demo@123' || password === 'Owner@123456')) {
            const fallbackUser: AuthUser = {
              id: `demo-${demoMatch.role.toLowerCase()}`,
              email: trimmedEmail,
              displayName: demoMatch.displayName,
              role: demoMatch.role,
              shopIds: demoMatch.shopIds,
              currentShopSlug: demoMatch.shopSlug,
            };
            tokenManager.setAccessToken(`mock-jwt-token-for-${demoMatch.role}`);
            setUser(fallbackUser);
            demoStore.setRole(
              demoMatch.role === 'ROLE_PLATFORM_ADMIN'
                ? 'PLATFORM_ADMIN'
                : demoMatch.role === 'ROLE_SHOP_STAFF'
                ? 'SHOP_STAFF'
                : 'SHOP_OWNER'
            );
            return fallbackUser;
          }
        }
        throw err;
      }

      if (loginData && loginData.accessToken) {
        tokenManager.setAccessToken(loginData.accessToken);

        // Suy diễn vai trò nếu backend profile chưa có role claim
        let userRole: UserRole = 'ROLE_SHOP_OWNER';
        if (trimmedEmail.includes('admin')) {
          userRole = 'ROLE_PLATFORM_ADMIN';
        } else if (trimmedEmail.includes('staff')) {
          userRole = 'ROLE_SHOP_STAFF';
        }

        const authenticatedUser: AuthUser = {
          id: String(loginData.user.id),
          email: loginData.user.email,
          displayName: loginData.user.displayName || trimmedEmail,
          role: loginData.user.role || userRole,
          shopIds: ['aurora-boutique'],
          currentShopSlug: 'aurora-boutique',
        };

        try {
          const backendShops = await shopApi.getMyShops();
          if (backendShops && backendShops.length > 0) {
            demoStore.syncBackendShops(backendShops);
            authenticatedUser.shopIds = backendShops.map((s) => s.id);
            authenticatedUser.currentShopSlug = backendShops[0].slug;
            demoStore.setShop(backendShops[0].id);
          }
        } catch {
          // fallback gracefully
        }

        setUser(authenticatedUser);
        demoStore.setRole(
          authenticatedUser.role === 'ROLE_PLATFORM_ADMIN'
            ? 'PLATFORM_ADMIN'
            : authenticatedUser.role === 'ROLE_SHOP_STAFF'
            ? 'SHOP_STAFF'
            : 'SHOP_OWNER'
        );
        return authenticatedUser;
      }

      throw new ApiClientError({ message: 'Phản hồi từ máy chủ không hợp lệ' });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post('/v1/auth/logout', {}).catch(() => {});
    } finally {
      tokenManager.clearAccessToken();
      setUser(null);
    }
  };

  const switchShop = (shopSlug: string): void => {
    if (!user) return;
    setUser({ ...user, currentShopSlug: shopSlug });
    demoStore.setShop(shopSlug);
  };

  const setDemoRole = (role: UserRole, shopSlug: string = 'aurora-boutique'): void => {
    const demoInfo = Object.values(DEMO_ACCOUNTS).find((acc) => acc.role === role);
    const updatedUser: AuthUser = {
      id: `user-${role.toLowerCase()}`,
      email: demoInfo?.email || `${role.toLowerCase()}@dipxinh.vn`,
      displayName: demoInfo?.displayName || `Người dùng ${role}`,
      role,
      shopIds: ['aurora-boutique', 'shop-1', 'shop-2'],
      currentShopSlug: shopSlug,
    };
    setUser(updatedUser);
    demoStore.setRole(
      role === 'ROLE_PLATFORM_ADMIN'
        ? 'PLATFORM_ADMIN'
        : role === 'ROLE_SHOP_STAFF'
        ? 'SHOP_STAFF'
        : 'SHOP_OWNER'
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchShop,
        setDemoRole,
        refreshShops: fetchUserShops,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
