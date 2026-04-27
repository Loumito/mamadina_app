import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Task, TaskFilter, TaskStatus} from '../../types';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filter: TaskFilter;
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  filter: {},
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null;
      }
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setTaskFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = action.payload;
    },
    clearTaskFilter: state => {
      state.filter = {};
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{taskId: string; status: TaskStatus}>,
    ) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        if (action.payload.status === 'completed') {
          task.completedAt = new Date();
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  setTaskFilter,
  clearTaskFilter,
  updateTaskStatus,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;

// Selectors
export const selectTasks = (state: {tasks: TaskState}) => state.tasks.tasks;
export const selectSelectedTask = (state: {tasks: TaskState}) =>
  state.tasks.selectedTask;
export const selectTaskFilter = (state: {tasks: TaskState}) =>
  state.tasks.filter;
export const selectTasksLoading = (state: {tasks: TaskState}) =>
  state.tasks.isLoading;
export const selectTasksError = (state: {tasks: TaskState}) =>
  state.tasks.error;

// Filtered tasks selector
export const selectFilteredTasks = (state: {tasks: TaskState}) => {
  const {tasks, filter} = state.tasks;
  return tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.assignedTo && !task.assignedTo.includes(filter.assignedTo))
      return false;
    if (filter.departmentId && task.departmentId !== filter.departmentId)
      return false;
    return true;
  });
};
