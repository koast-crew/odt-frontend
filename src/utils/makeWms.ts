import { baseWMS } from '@/utils/consts/mapConstants';

export const makeWms = (layer: string, time?: string, species?: string) => {
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
      viewparams: layer === 'grid' ? '' : time && species ? `ctsh_rprt_ymd:${ time };species:${ species }` : time ? `ctsh_rprt_ymd:${ time }` : species ? `species:${ species }` : '',
    },
  };
};
