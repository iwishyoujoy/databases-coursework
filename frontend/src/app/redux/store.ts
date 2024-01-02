import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';

import { logger } from './middleware/logger';

interface LoginState {
  isLogged: boolean;
  login: string;
  password: string;
  name: string;
  surname: string;
  birthday: string;
  phoneNumber: string;
}

interface BusinessState {
  isLogged: boolean;
  isSeller: boolean;
  login: string;
  password: string;
  name: string;
  email: string;
  contact: string;
}

interface CategoryState {
  productCategory: string;
  procedureCategory: string;
}

interface CartState {
  orderId: number;
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

const businessSlice = createSlice({
  name: 'business',
  initialState: {
    isLogged: false,
    isSeller: true,
    name: undefined,
    email: undefined,
    contact: undefined,
    login: undefined,
    password: undefined,
  } as BusinessState,
  reducers: {
    setLoginBusiness: (state, action: PayloadAction<string>) => { 
      state.login = action.payload;
    },
    setPasswordBusiness: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setNameBusiness: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEmailBusiness: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setContactBusiness: (state, action: PayloadAction<string>) => {
      state.contact = action.payload;
    },
    setIsLoggedBusiness: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
    setIsSellerBusiness: (state, action: PayloadAction<boolean>) => {
      state.isSeller = action.payload;
    },
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    productCategory: '-1',
    procedureCategory: '-1',
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

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    orderId: undefined,
  } as CartState,
  reducers: {
    setOrderId: (state, action: PayloadAction<number>) => {
      state.orderId = action.payload;
    },
  }
});

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    business: businessSlice.reducer,
    category: categorySlice.reducer,
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const { setLogin, setPassword, setName, setSurname, setBirthday, setPhoneNumber, setIsLogged } = loginSlice.actions;
export const { setLoginBusiness, setPasswordBusiness, setNameBusiness, setEmailBusiness, setContactBusiness, setIsSellerBusiness, setIsLoggedBusiness } = businessSlice.actions;
export const { setProcedureCategory, setProductCategory } = categorySlice.actions;
export const { setOrderId } = cartSlice.actions;

