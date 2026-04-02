export interface Task {
  id: number;
  userId: number; // ID del usuario propietario
  title: string;
  description?: string;
  date: string; // ISO format: YYYY-MM-DD
  status: 'Pendiente' | 'Completada';
  priority: 'Alta' | 'Media' | 'Baja';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // Para papelera (soft delete)
}

export interface TaskHistory {
  id: number;
  taskId: number;
  userId: number;
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'restored';
  oldValue?: any;
  newValue?: any;
  timestamp: string;
}