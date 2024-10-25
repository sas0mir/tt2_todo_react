import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id?: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  dueDate: string;
}

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
    },
    updateTodo(state, action: PayloadAction<Todo>) {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    updateTodos(state, action: PayloadAction<Todo[]>) {
        //можно добавить разные проверки
        state.todos = action.payload;
    },
    deleteTodo(state, action: PayloadAction<Todo>) {
        //можно оптимизировать, для тестового думаю достаточно
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
            state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
        }
    },
    toggleTodoCompletion(state, action: PayloadAction<string>) {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
      }
    },
  },
});

export const { setTodos, addTodo, updateTodo, updateTodos, deleteTodo, toggleTodoCompletion } = todoSlice.actions;
export default todoSlice.reducer;