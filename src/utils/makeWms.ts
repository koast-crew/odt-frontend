import { baseWMS } from '@/utils/consts/mapConstants';

export const makeWms = (layer: string, time?: string) => {
  const layerName = layer === 'grid'
    ? 'grid2'
    : layer === 'fish'
      ? 'catch_predict_view'
      : `catch_predict_${ layer }`;

  return {
    ...baseWMS,
    layers: `mdtwin:${ layerName }`,
    parameters: {
      ...baseWMS.parameters,
      viewparams: time ? `ctsh_rprt_ymd:${ time }` : '',
    },
  };
};
