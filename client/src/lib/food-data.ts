import { apiRequest } from './queryClient';
import { InsertFoodEntry } from '@shared/schema';

export const foodApi = {
  getFoodEntries: async () => {
    const response = await apiRequest('GET', '/api/food-entries');
    return response.json();
  },

  getTodayEntries: async (token: string) => {
    const res = await fetch('/api/food-entries/today', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  createFoodEntry: async (data: Omit<InsertFoodEntry, 'userId'>) => {
    const response = await apiRequest('POST', '/api/food-entries', data);
    return response.json();
  },

  deleteFoodEntry: async (id: number) => {
    const response = await apiRequest('DELETE', `/api/food-entries/${id}`);
    return response.json();
  },

  analyzeFood: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('/api/ai/analyze-food', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze food');
    }
    
    return response.json();
  },

  getDashboardStats: async (token: string) => {
    const res = await fetch('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  getWeeklyData: async (token: string) => {
    const res = await fetch('/api/dashboard/weekly', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },
};
