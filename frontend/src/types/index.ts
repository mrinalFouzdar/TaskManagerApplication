export interface ITask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
