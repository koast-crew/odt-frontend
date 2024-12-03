import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { wmsPointInfoApi, fishInfoApi } from '../api';

export const store = configureStore({
  reducer: {
    [wmsPointInfoApi.reducerPath]: wmsPointInfoApi.reducer,
    [fishInfoApi.reducerPath]: fishInfoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wmsPointInfoApi.middleware, fishInfoApi.middleware),
});
setupListeners(store.dispatch);