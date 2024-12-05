export const baseMapURL = {
  url : '/geo-proxy/tile/DL_USR3857/{customZ}/{x}/{y}',
  customTags : {
    customZ: function(imageryProvider: string, x: number, y: number, level: number) {
      return 'L' + level.toString().padStart(2, '0');
    },
  },
  maximumLevel: 16,
  minimumLevel: 5,
  credit: 'khoa',
};

export const baseGridWMS = {
  url: '/geo-proxy',
  layers: 'mdtwin:grid2',
  parameters: {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    styles: '',
    format: 'image/png',
    transparent: true,
  },
};

export const baseWMS = {
  url: '/geo-proxy',
  layers: 'mdtwin:catch_predict_view',
  parameters: {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    styles: '',
    format: 'image/png',
    transparent: true,
    viewparams: 'ctsh_rprt_ymd:' + '2024-11-28',
  },
};

export const GetFeatureInfoOptions = {
  SERVICE: 'WMS',
  VERSION: '1.1.1',
  REQUEST: 'GetFeatureInfo',
  FORMAT: 'image/png',
  TRANSPARENT: 'true',
  QUERY_LAYERS: 'mdtwin:catch_predict_view',
  LAYERS: 'mdtwin:catch_predict_view',
  exceptions: 'application/vnd.ogc.se_inimage',
  INFO_FORMAT: 'application/json',
  FEATURE_COUNT: '50',
  X: '50',
  Y: '50',
  SRS: 'EPSG:4326',
  WIDTH: '101',
  HEIGHT: '101',
};