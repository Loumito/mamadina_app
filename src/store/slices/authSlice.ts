import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User, UserRole} from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fcmToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  fcmToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFCMToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
    },
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.fcmToken = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
      }
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  setFCMToken,
  logout,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state: {auth: AuthState}) => state.auth.user;
export const selectIsAuthenticated = (state: {auth: AuthState}) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: {auth: AuthState}) =>
  state.auth.isLoading;
export const selectAuthError = (state: {auth: AuthState}) => state.auth.error;
export const selectUserRole = (state: {auth: AuthState}): UserRole | null =>
  state.auth.user?.role || null;
export const selectFCMToken = (state: {auth: AuthState}) => state.auth.fcmToken;
