export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  created_at: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskFilters {
  status?: 'all' | 'active' | 'completed';
  searchTerm?: string;
}