import api from '@/lib/axios';
import { RegisterData, LoginData, UpdateProfileData } from '@/lib/validator';

export const authService = {
  register: (data: RegisterData) => api.post('/users', data),
  login: (data: LoginData) => api.post('/users/login', data),
};

export const userService = {
  getUser: (id: string) => api.get(`/users/${id}`),
  updateProfile: (id: string, data: UpdateProfileData) => api.put(`/users/${id}`, data),
  deleteAccount: (id: string) => api.delete(`/users/${id}`),
};

export const taskService = {
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getAllTasks: () => api.get('/tasks'),
  createTask: (data: { title: string; description?: string | null }) => api.post('/tasks', data),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};