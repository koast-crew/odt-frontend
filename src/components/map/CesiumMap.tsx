import React from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import Overlay from './Overlays';
import { CurrentAnimation } from '../../utils/streamline';
import { currentData } from '@/utils/streamlinetest';

export interface CesiumMapProps {
  baseUrlLayers?: Array<Cesium.UrlTemplateImageryProvider.ConstructorOptions>
  baseWMSLayers?: Array<Cesium.WebMapServiceImageryProvider.ConstructorOptions>
  wmsLayers?: Array<Cesium.WebMapServiceImageryProvider.ConstructorOptions>
  streamlineLayers?: Array<string>
  onClick?: (viewer: Cesium.Viewer, clickPosition: { lon: number, lat: number })=> void;
  overlays?: Array<{ id: string, position: { lon: number, lat: number }, displayValue?: number, gridId?: string, species?: string, time?: string, entity?: Cesium.Entity.ConstructorOptions }>
  onCloseOverlay?: (id: string)=> void
  zoomLevel?: number
  onZoomLevelChange?: (level: number)=> void
}

class CustomViewer extends Cesium.Viewer {
  constructor(id: string | Element, options?: Cesium.Viewer.ConstructorOptions) {
    super(id, options);
  }
  customImageryLayers: Array<CustomImageryLayer> = [];
  addCustomLayer(layer: CustomImageryLayer) {
    this.customImageryLayers.push(layer);
    this.imageryLayers.add(layer);
  }
  removeCustomLayer(layer: CustomImageryLayer) {
    this.customImageryLayers = this.customImageryLayers.filter((l) => l !== layer);
    this.imageryLayers.remove(layer);
  }
}

class CustomImageryLayer extends Cesium.ImageryLayer {
  constructor(provider?: Cesium.ImageryProvider, options?: Cesium.ImageryLayer.ConstructorOptions, value?: { id: string, time: string }) {
    super(provider, options);
    this.value = value;
  }
  value?: {
    id: string;
    time: string;
  };
}

const mapViewerOptions = {
  // terrain: Cesium.Terrain.fromWorldTerrain(),
  animation: false, // Disable the animation widget
  timeline: false, // Disable the timeline widget
  fullscreenButton: false, // Disable the fullscreen button
  homeButton: false, // Disable the home button
  sceneModePicker: false, // Disable the scene mode picker
  baseLayerPicker: false, // Disable the base layer picker
  geocoder: false, // Disable the geocoder (search bar)
  navigationHelpButton: false, // Disable the navigation help button
  infoBox: false, // Disable the info box
  selectionIndicator: false, // Disable the selection indicator
  navigationInstructionsInitiallyVisible: false, // Prevent navigation help overlay from appearing initially
  creditContainer: 'customCreditContainer',
};

const customUrlOptions = {
  tilingScheme: new Cesium.WebMercatorTilingScheme(),
  rectangle : Cesium.Rectangle.fromDegrees(120, 30, 138, 45),
};

const entityOptions = {
  name: 'arbit_marker',
  point: {
    pixelSize: 6,
    color: Cesium.Color.STEELBLUE,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  },
};

function CesiumMap(props: CesiumMapProps) {
  const {
    baseUrlLayers = [],
    baseWMSLayers = [],
    wmsLayers = [],
    streamlineLayers = [],
    onClick,
    overlays = [],
    onCloseOverlay,
    zoomLevel = 50,
    onZoomLevelChange,
  } = props;
  const viewer = React.useRef<CustomViewer>();
  const currentAnimation = React.useRef<CurrentAnimation>();

  const baseUrlLayerProviders = React.useMemo(
    () => baseUrlLayers.map((layerOptions) => new Cesium.UrlTemplateImageryProvider({ ...layerOptions, ...customUrlOptions })),
    [baseUrlLayers],
  );
  const baseWMSLayerProviders = React.useMemo(
    () => baseWMSLayers.map((layerOptions) => new Cesium.WebMapServiceImageryProvider(layerOptions)),
    [baseWMSLayers],
  );

  const heightToZoomLevel = (height: number) => {
    return Number(((100 - ((height - 50010) / (3450000 - 50010) * 100)).toPrecision(2)));
  };

  const zoomLevelToHeight = (zoomLevel: number) => {
    return ((100 - zoomLevel) * (3450000 - 50010) / 100) + 50010;
  };

  const setZoomWithForce = (height: number) => {
    if (!viewer.current) return;
    const { longitude, latitude } = viewer.current.camera.positionCartographic;
    viewer.current.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height), // 경도, 위도, 높이
    });
  };

  React.useEffect(() => {
    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN ?? '';

    viewer.current = new CustomViewer('cesiumContainer', { ...mapViewerOptions });
    if (!viewer.current) return;

    viewer.current.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(126.43916, 37.4625, 2000000), // 경도, 위도, 높이
    });

    return () => {
      viewer.current?.destroy();
      viewer.current = undefined;
    };
  }, []);

  React.useEffect(() => {
    if (!viewer.current) return;
    streamlineLayers.map((layer) => {
      if (layer === 'current') {
        currentAnimation.current = new CurrentAnimation({ map: viewer.current }, currentData);
        currentAnimation.current.start();
      }
    });
    return () => {
      currentAnimation.current?.clear();
    };
  }, [streamlineLayers]);

  React.useEffect(() => {
    console.log('overlay & zoom effect');

    const overlayIds = overlays.map((ol) => ol.id);
    viewer.current?.entities.values.map((entity) => {
      if (!overlayIds.includes(entity.id)) {
        viewer.current?.entities.removeById(entity.id);
      }
    });

    overlays.map(({ id, position, entity }) => {
      if (!viewer.current) return;
      if (viewer.current.entities.getById(id)) return;

      console.log(viewer.current.entities.values.map((x) => x.id));

      viewer.current.entities.add({
        ...entityOptions, ...entity,
        id,
        position: Cesium.Cartesian3.fromDegrees(position.lon, position.lat),
      });
    });

    const postRenderListener = () => {
      if (!viewer.current) return;

      console.log(heightToZoomLevel(viewer.current.camera.positionCartographic.height));
      // setZoomWithForce(zoomLevelToHeight(zoomLevel));
      // if (zoomLevel !== heightToZoomLevel(viewer.current.camera.positionCartographic.height)) {
      //   onZoomLevelChange?.(heightToZoomLevel(viewer.current.camera.positionCartographic.height));
      // }

      overlays.map(({ id, position: { lon, lat } }) => {
        if (!viewer.current) return;
        const overlayElement = document.querySelector(`#${ id }`) as HTMLDivElement | null;
        if (!overlayElement) return;

        const { width, height } = overlayElement.getBoundingClientRect();

        overlayElement.style.top = `calc(${ Cesium.SceneTransforms.worldToWindowCoordinates(viewer.current.scene, Cesium.Cartesian3.fromDegrees(lon, lat))?.y }px - ${ height + 20 }px)`;
        overlayElement.style.left = `calc(${ Cesium.SceneTransforms.worldToWindowCoordinates(viewer.current.scene, Cesium.Cartesian3.fromDegrees(lon, lat))?.x }px - ${ width / 2 }px)`;
      });
    };

    if (!viewer.current) return;
    viewer.current.scene.postRender.addEventListener(postRenderListener);

    return () => {
      viewer.current?.scene.postRender.removeEventListener(postRenderListener);
      console.log('overlay effect cleanup', viewer.current?.scene.postRender.numberOfListeners);
    };
  }, [overlays, zoomLevel, onZoomLevelChange]);

  React.useEffect(() => {
    if (!viewer.current) return;
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.current.scene.canvas);

    handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      if (!viewer.current) return;
      const ray = viewer.current.camera.getPickRay(click.position);
      const globeIntersection = ray && viewer.current.scene.globe.pick(ray, viewer.current.scene);
      const cartographic = globeIntersection && Cesium.Cartographic.fromCartesian(globeIntersection);

      if (!cartographic) return;
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);

      onClick?.(viewer.current, { lon, lat });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
  }, [onClick]);

  React.useEffect(() => {
    const layers = baseUrlLayerProviders.map((provider) => viewer.current?.imageryLayers.addImageryProvider(provider));
    return () => { layers.map((layer) => layer && viewer.current?.imageryLayers.remove(layer, false)); };
  }, [baseUrlLayerProviders]);

  React.useEffect(() => {
    const layers = baseWMSLayerProviders.map((provider) => viewer.current?.imageryLayers.addImageryProvider(provider));
    return () => { layers.map((layer) => layer && viewer.current?.imageryLayers.remove(layer, false)); };
  }, [baseWMSLayerProviders]);

  React.useEffect(() => {
    const layersToAdd = wmsLayers.filter((layerOptions) => !viewer.current?.customImageryLayers.some((layer) => layer.value?.id === layerOptions.layers && layer.value?.time === layerOptions.parameters.viewparams));
    const layersToRemove = viewer.current?.customImageryLayers.filter((layer) => !wmsLayers.some((layerOptions) => layerOptions.layers === layer.value?.id && layerOptions.parameters.viewparams === layer.value?.time));
    layersToAdd.map((layerOptions) => viewer.current?.addCustomLayer(new CustomImageryLayer(new Cesium.WebMapServiceImageryProvider(layerOptions), undefined, { id: layerOptions.layers, time: layerOptions.parameters.viewparams })));
    layersToRemove?.map((layer) => viewer.current?.removeCustomLayer(layer));
  }, [wmsLayers]);

  return (
    <>
      <div id={'cesiumContainer'} className={'size-full'}>
        <Overlay overlays={overlays} onCloseOverlay={onCloseOverlay} />
      </div>
      <div id={'customCreditContainer'} className={'invisible'} />
    </>
  );
}

export default CesiumMap;
