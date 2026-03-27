export interface Task {
  id: string;
  title: string;
  description?: string | null;
  is_completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}
