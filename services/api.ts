import api from '@/lib/axios';
import { RegisterData, LoginData } from '@/lib/validator';

export const authService = {
  register: (data: RegisterData) => api.post('/users', data),
  login: (data: LoginData) => api.post('/users/login', data),
};

export const taskService = {
  getMyTasks: () => api.get('/tasks/my-tasks'),
  createTask: (data: { title: string; description?: string }) => api.post('/tasks', data),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};