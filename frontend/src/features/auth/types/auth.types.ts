export type UserRole =
  | 'ROLE_PLATFORM_ADMIN'
  | 'ROLE_SHOP_OWNER'
  | 'ROLE_SHOP_STAFF'
  | 'ROLE_CUSTOMER';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  shopIds: string[];
  currentShopSlug: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role?: UserRole;
  };
}

export interface RegisterOwnerRequestDto {
  fullName: string;
  email: string;
  password: string;
  shopName: string;
  shopSlug?: string;
  phone?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
