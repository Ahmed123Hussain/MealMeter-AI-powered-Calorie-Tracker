import { apiRequest } from './queryClient';
import { LoginData, InsertUser } from '@shared/schema';

export const authApi = {
  login: async (data: LoginData) => {
    const response = await apiRequest('POST', '/api/auth/login', data);
    return response.json();
  },

  register: async (data: InsertUser) => {
    const response = await apiRequest('POST', '/api/auth/register', data);
    return response.json();
  },

  getProfile: async () => {
    const response = await apiRequest('GET', '/api/auth/me');
    return response.json();
  },

  updateProfile: async (data: any) => {
    const response = await apiRequest('PUT', '/api/auth/profile', data);
    return response.json();
  },
};
