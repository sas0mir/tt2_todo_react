import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userData } from '../lib/types';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: '',
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<userData>) {
        let userData = action.payload;
      state.isAuthenticated = true;
      state.token = userData.token;
      state.username = userData.username;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.username = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;