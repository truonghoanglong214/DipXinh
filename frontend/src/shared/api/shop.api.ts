import { apiClient } from './client';

export interface BackendShopResponse {
  id: string;
  slug: string;
  name: string;
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
  ownerUserId: string;
  createdAt: string;
}

export interface CreateShopDto {
  name: string;
  slug: string;
}

export const shopApi = {
  /**
   * Lấy danh sách boutique thuộc sở hữu của tài khoản hiện tại
   */
  getMyShops: async (): Promise<BackendShopResponse[]> => {
    return apiClient.get<BackendShopResponse[]>('/v1/me/shops');
  },

  /**
   * Khởi tạo một boutique mới
   */
  createShop: async (data: CreateShopDto): Promise<BackendShopResponse> => {
    return apiClient.post<BackendShopResponse>('/v1/shops', data);
  },

  /**
   * Truy vấn thông tin công khai của Storefront theo slug
   */
  getBySlug: async (slug: string): Promise<BackendShopResponse> => {
    return apiClient.get<BackendShopResponse>(`/v1/storefront/shops/${encodeURIComponent(slug)}`, {
      skipAuth: true,
    });
  },
};
