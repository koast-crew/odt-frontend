import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResultResponse } from './types';

export interface FishInfo {
  analysDate: string
  chl: number
  gridId: string
  latDms: string
  lonDms: string
  predictCatch: number
  species: string
  ssh: number
  sst: number
  wave: number
}

export const fishInfoApi = createApi({
  reducerPath: 'fishInfoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/catch/max' }),
  endpoints: (builder) => ({
    getMaxFishPointInfo: builder.query<ResultResponse<FishInfo>, { species: string, analysDate: string, sea: string }>({
      query: ({ species, analysDate, sea }) => {
        return {
          url: '',
          method: 'GET',
          params: { species, analysDate, sea },
        };
      },
    }),
  }),
});