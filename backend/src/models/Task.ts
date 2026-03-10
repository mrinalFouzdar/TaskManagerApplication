import pool from '../config/db';
import { ITask } from '../types';

class TaskModel {
  static async create(task: ITask): Promise<ITask> {
    const { title, description, status } = task;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *`,
      [title, description, status || 'pending']
    );
    return result.rows[0];
  }

  static async findAll(page: number, limit: number, search: string): Promise<{ data: ITask[], total: number }> {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM tasks WHERE deleted_at IS NULL`;
    let countQuery = `SELECT COUNT(*) FROM tasks WHERE deleted_at IS NULL`;
    const params: any[] = [];
    const countParams: any[] = [];

    if (search) {
      query += ` AND title ILIKE $1`;
      countQuery += ` AND title ILIKE $1`;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [dataResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, countParams)
    ]);

    return {
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10)
    };
  }

  static async findById(id: string): Promise<ITask | null> {
    const result = await pool.query(`SELECT * FROM tasks WHERE id = $1 AND deleted_at IS NULL`, [id]);
    return result.rows[0] || null;
  }

  static async update(id: string, task: Partial<ITask>): Promise<ITask | null> {
    const fields = [];
    const values: any[] = [];
    let idx = 1;

    if (task.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(task.title);
    }
    if (task.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(task.description);
    }
    if (task.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(task.status);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query(`UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default TaskModel;
