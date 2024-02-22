import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';

import { logger } from './middleware/logger';
import { api } from '../utils/api';

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
  id: number;
  login: string;
  password: string;
  name: string;
  email: string;
  contact: string;
}

interface CategoryState {
  productCategoryId: number;
  procedureCategoryId: number;
}

interface CartState {
  orderId: number;
  timestamp: string;
}

interface ProductState {
  deletedProductId: number;
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
    id: undefined,
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
    setIdBusiness: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
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
    productCategoryId: -1,
    procedureCategoryId: -1,
  } as CategoryState,
  reducers: {
    setProductCategoryId: (state, action: PayloadAction<number>) => {
      state.productCategoryId = action.payload;
    },
    setProcedureCategoryId: (state, action: PayloadAction<number>) => {
      state.procedureCategoryId = action.payload;
    },
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    orderId: undefined,
    timestamp: undefined,
  } as CartState,
  reducers: {
    setOrderId: (state, action: PayloadAction<number>) => {
      state.orderId = action.payload;
    },
    setTimestamp: (state, action: PayloadAction<string>) => {
      state.timestamp = action.payload;
    },
  }
});

// productSlice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    deletedProductId: null,
  } as ProductState,
  reducers: {
    productDeleted: (state, action: PayloadAction<number>) => {
      state.deletedProductId = action.payload;
    },
  }
 });
 

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    login: loginSlice.reducer,
    business: businessSlice.reducer,
    category: categorySlice.reducer,
    cart: cartSlice.reducer,
    product: productSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([api.middleware, logger]),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const { setLogin, setPassword, setName, setSurname, setBirthday, setPhoneNumber, setIsLogged } = loginSlice.actions;
export const { setLoginBusiness, setPasswordBusiness, setIdBusiness, setNameBusiness, setEmailBusiness, setContactBusiness, setIsSellerBusiness, setIsLoggedBusiness } = businessSlice.actions;
export const { setProcedureCategoryId, setProductCategoryId } = categorySlice.actions;
export const { setOrderId, setTimestamp } = cartSlice.actions;
export const { productDeleted } = productSlice.actions;

