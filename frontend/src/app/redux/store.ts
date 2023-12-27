import { logger } from './middleware/logger';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';

interface LoginState {
  isLogged: boolean;
  login: string;
  password: string;
  name: string;
  surname: string;
  birthday: string;
  phoneNumber: string;
}

interface CategoryState {
  productCategory: string;
  procedureCategory: string;
}

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogged: false,
    login: undefined,
    password: undefined,
    name: undefined,
    surname: undefined,
    birthday: undefined,
    phoneNumber: undefined,
  } as LoginState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setSurname: (state, action: PayloadAction<string>) => {
      state.surname = action.payload;
    },
    setBirthday: (state, action: PayloadAction<string>) => {
      state.birthday = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    productCategory: undefined,
    procedureCategory: undefined,
  } as CategoryState,
  reducers: {
    setProductCategory: (state, action: PayloadAction<string>) => {
      state.productCategory = action.payload;
    },
    setProcedureCategory: (state, action: PayloadAction<string>) => {
      state.procedureCategory = action.payload;
    },
  }
});

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    category: categorySlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const { setLogin, setPassword, setName, setSurname, setBirthday, setPhoneNumber, setIsLogged } = loginSlice.actions;
export const { setProcedureCategory, setProductCategory } = categorySlice.actions;

