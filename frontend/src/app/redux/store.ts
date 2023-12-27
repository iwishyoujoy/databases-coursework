import { logger } from './middleware/logger';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';

interface LoginState {
  isLogged: boolean;
  login: string;
  password: string;
}

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogged: false,
    login: undefined,
    password: undefined,
  } as LoginState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
  }
});

export const { setLogin, setPassword, setIsLogged } = loginSlice.actions;

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

