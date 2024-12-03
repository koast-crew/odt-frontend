import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetFeatureInfoOptions } from '../consts/mapConstants';

interface wmsPointInfo {
  features: Array<{ properties: {
    predicted_catch: number
  } }>
}

export const wmsPointInfoApi = createApi({
  reducerPath: 'wmsPointInfoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://183.101.208.30:58888/geoserver/mdtwin/wms' }),
  endpoints: (builder) => ({
    getPointInfo: builder.query<wmsPointInfo, { lon: number, lat: number, time: string }>({
      query: ({ lon, lat, time }) => {
        return {
          url: '',
          method: 'GET',
          params: {
            ...GetFeatureInfoOptions,
            BBOX: `${ lon - 0.05 },${ lat - 0.05 },${ lon + 0.05 },${ lat + 0.05 }`,
            viewparams: 'ctsh_rprt_ymd:' + time,
          },
        };
      },
    }),
  }),
});