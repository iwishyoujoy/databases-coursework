import { logger } from '@/app/redux/middleware/logger';
import { gameApi } from '@/app/redux/services/api';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';

// interface FiltersState {
  
// }

// const filtersSlice = createSlice({
//   name: 'filters',
//   initialState: {
//     platform: 'all',
//     genre: 'all',
//     sortBy: 'relevance'
//   } as FiltersState,
//   reducers: {
//     setPlatform: (state, action: PayloadAction<string>) => {
//       state.platform = action.payload;
//     },
//     setGenre: (state, action: PayloadAction<string>) => {
//       state.genre = action.payload;
//     },
//     setSortBy: (state, action: PayloadAction<string>) => {
//       state.sortBy = action.payload;
//     }
//   }
// });

// export const { setPlatform, setGenre, setSortBy } = filtersSlice.actions;

interface LoginState {
  isLogged: boolean;
  login: string;
}

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogged: false,
    login: undefined
  } as LoginState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
  }
});

export const { setLogin, setIsLogged } = loginSlice.actions;

export const store = configureStore({
  reducer: {
    [gameApi.reducerPath]: gameApi.reducer,
    login: loginSlice.reducer,
    
    // filters: filtersSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([gameApi.middleware, logger]),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
