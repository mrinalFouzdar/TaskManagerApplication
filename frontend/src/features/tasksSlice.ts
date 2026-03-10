import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import type { ITask } from '../types';

interface TasksState {
  tasks: ITask[];
  currentTask: ITask | null;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  total: 0,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get(`/tasks?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  }
);

export const createTask = createAsyncThunk('tasks/createTask', async (task: Partial<ITask>) => {
  const response = await api.post('/tasks', task);
  return response.data.task;
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: string; task: Partial<ITask> }) => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data.task;
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setCurrentTask, clearCurrentTask } = tasksSlice.actions;
export default tasksSlice.reducer;
