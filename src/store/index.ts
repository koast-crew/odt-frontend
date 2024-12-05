import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { wmsPointInfoApi, fishInfoApi } from '../api';
import navigationReducer from './navigationSlice';

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    [wmsPointInfoApi.reducerPath]: wmsPointInfoApi.reducer,
    [fishInfoApi.reducerPath]: fishInfoApi.reducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wmsPointInfoApi.middleware, fishInfoApi.middleware),
});

setupListeners(store.dispatch);