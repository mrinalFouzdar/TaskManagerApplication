import { Request, Response } from 'express';
import TaskModel from '../models/Task';


class TaskController {
  static async createTask(req: Request, res: Response): Promise<any> {
    try {
      const task = await TaskModel.create(req.body);
      res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getTasks(req: Request, res: Response): Promise<any> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const search = (req.query.search as string) || '';

      const tasks = await TaskModel.findAll(page, limit, search);
      res.status(200).json({ message: 'Tasks retrieved successfully', ...tasks });
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getTaskById(req: Request<{ id: string }>, res: Response): Promise<any> {
    try {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.status(200).json({ message: 'Task retrieved successfully', task });
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateTask(req: Request<{ id: string }>, res: Response): Promise<any> {
    try {
      const task = await TaskModel.update(req.params.id, req.body);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteTask(req: Request<{ id: string }>, res: Response): Promise<any> {
    try {
      const success = await TaskModel.delete(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default TaskController;
