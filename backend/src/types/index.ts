export interface ITask {
  id?: string;
  title: string;
  description: string;
  status?: 'pending' | 'ongoing' | 'completed';
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}
