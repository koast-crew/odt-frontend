import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResultResponse } from './types';

export interface MaxFishInfo {
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

export interface PointFishInfo {
  analysDate: string
  predictCatch: number
  species: string
  gridId: string
  geom: string
  sst: number
  ssh: number
  chl: number
  pp: number
  wave: number
}

export interface ReanalysisInfo {
  labelMonths: string[]
  labelYears: string[]
  dataList: number[][]
  locationList: Array<{
    totalCatch: number
    species: string
    gridId: string
    latitude: number
    longitude: number
    latDms: string
    lonDms: string
    region: string
  }>
}

export const fishInfoApi = createApi({
  reducerPath: 'fishInfoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/catch' }),
  endpoints: (builder) => ({
    getMaxFishPointInfo: builder.query<ResultResponse<Array<MaxFishInfo>>, { species: string, analysDate: string, sea: string }>({
      query: ({ species, analysDate, sea }) => {
        return {
          url: '/max',
          method: 'GET',
          params: { species, analysDate, sea },
        };
      },
    }),
    getPointInfo: builder.query<ResultResponse<PointFishInfo>, { lon: number, lat: number, analysDate: string, species: string }>({
      query: ({ lon, lat, analysDate, species }) => {
        return {
          url: '/latlon',
          method: 'GET',
          params: { lon, lat, analysDate, species },
        };
      },
    }),
    getReanalysisInfo: builder.query<ResultResponse<ReanalysisInfo>, { species: string, analysDate: string }>({
      query: ({ species, analysDate }) => {
        return {
          url: '/reanal',
          method: 'GET',
          params: { species, analysDate },
        };
      },
    }),
  }),
});