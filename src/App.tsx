import React from 'react';
import { Viewer } from 'cesium';
import CesiumMap, { CesiumMapProps } from './components/map/CesiumMap';
import PlayBar from './components/map/PlayBar';
import { baseGridWMS, testWMS, GetFeatureInfoOptions } from './consts/mapConstants';
import dayjs from 'dayjs';
import { fishInfoApi } from './api';

const baseWMSLayers = [baseGridWMS];

const testTimeList = [0, 1, 2, 3].map((d) => dayjs().add(d, 'day').format('YYYY-MM-DD'));

function App() {
  const [overlays, setOverlays] = React.useState<NonNullable<CesiumMapProps['overlays']>>([]);
  const [playbarIndex, setPlayBarIndex] = React.useState(0);
  const [maxFishQuery, setMaxFishQuery] = React.useState({ species: 'squid', analysDate: dayjs().format('YYYYMMDD'), sea: 'west' });

  const { data, error, isLoading } = fishInfoApi.endpoints.getMaxFishPointInfo.useQuery(maxFishQuery);
  console.log(data, error, isLoading);

  const handleMapOnClick = async (viewer: Viewer, position: { lon: number, lat: number }) => {
    const { lon, lat } = position;
    let displayValue = null;
    let gridId = null;
    const wmsUrl = 'http://183.101.208.30:58888/geoserver/mdtwin/wms';
    const params = new URLSearchParams({
      ...GetFeatureInfoOptions,
      BBOX: `${ lon - 0.02 },${ lat - 0.02 },${ lon + 0.02 },${ lat + 0.02 }`,
      viewparams: 'ctsh_rprt_ymd:' + testTimeList[playbarIndex],
    });
    const response = await fetch(`${ wmsUrl }?${ params.toString() }`);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const { predicted_catch, grid_id } = feature.properties;
      displayValue = predicted_catch;
      gridId = grid_id;
    }
    setOverlays((ol) => {
      return [...ol, {
        id: `overlay_${ (Number(ol.at(-1)?.id.replace('overlay_', '') ?? 0)) + 1 }`,
        position,
        displayValue,
        gridId,
      }];
    });
  };
  const handleOnCloseOverlay = (id: string) => {
    setOverlays((ol) => {
      return ol.filter((item) => item.id !== id);
    });
  };
  const handleOnChangePlayBar = (index: number) => {
    setPlayBarIndex(index);
    setOverlays([]);
  };
  const handleOnChangeFishSelect = (e: React.ChangeEvent) => {
    const selectElement = e.target as HTMLSelectElement;
    setMaxFishQuery((mfq) => {
      return {
        ...mfq,
        species: selectElement.value,
      };
    });
  };
  const handleOnDateChange = (e: React.ChangeEvent) => {
    const inputElement = e.target as HTMLInputElement;
    setMaxFishQuery((mfq) => {
      return {
        ...mfq,
        analysDate: inputElement.value,
      };
    });
  };
  const handleOnSelectSea = (sea: string) => {
    setMaxFishQuery((mfq) => {
      return {
        ...mfq,
        sea,
      };
    });
  };
  const wmsLayers = React.useMemo(() => {
    return [{ ...testWMS, ...{ parameters: { ...testWMS.parameters, viewparams: 'ctsh_rprt_ymd:' + testTimeList[playbarIndex] } } }];
  }, [playbarIndex]);

  return (
    <div id={'app'} className={'relative grid h-screen w-screen grid-cols-[60px,_350px,_1fr] grid-rows-[55px,_1fr] overflow-hidden'}>
      <div className={'col-span-3 grid size-full grid-cols-[55px,_180px,_1fr] bg-slate-800'}>
        <div className={'m-1'}>
          <img src={'/ci_koast.png'} className={'size-full'} />
        </div>
        <div className={'flex items-center justify-center text-[20px] font-bold text-zinc-50'}>{'한국해양기상기술'}</div>
      </div>
      <div className={'box-border flex size-full flex-col border-t border-zinc-500 bg-slate-800'}>
        <a href={'/'} className={'box-border flex h-[65px] w-full flex-col items-center justify-center border-b border-zinc-500'}>
          <svg className={'fill-zinc-100'} width={'24'} height={'24'} viewBox={'0 0 24 24'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
            <path d={'M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z'} />
          </svg>
          <div className={'m-[2px] text-[12px] font-bold text-zinc-100'}>{'홈'}</div>
        </a>
      </div>
      <div className={'flex size-full flex-col p-4'}>
        <div className={'flex h-8 w-full'}>
          <div className={'flex h-full w-36 items-center justify-center rounded-t-md bg-blue-500 text-[14px] text-zinc-50'}>{'일별 어획량 예측(AI)'}</div>
          <div className={'ml-1 flex h-full w-36 items-center justify-center rounded-t-md bg-zinc-500 text-[14px] text-zinc-50'}>{'연도별 어획량 관측'}</div>
        </div>
        <div className={'grid w-full grid-cols-[75px,_1fr] grid-rows-3 place-items-center gap-1 border-y border-zinc-300 p-2 py-4'}>
          <div className={'justify-self-start text-[13px] font-bold'}>{'어종 선택'}</div>
          <select onChange={handleOnChangeFishSelect} className={'h-8 w-full border border-zinc-300 p-1 text-[13px]'}>
            <option value={'squid'}>{'살오징어 (금어기 4/1 ~ 5/31)'}</option>
            <option value={'salmon'}>{'연어 (금어기 9/1 ~ 12/31)'}</option>
          </select>
          <div className={'justify-self-start text-[13px] font-bold'}>{'날짜 선택'}</div>
          <input value={dayjs(maxFishQuery.analysDate).format('YYYY-MM-DD')} onChange={handleOnDateChange} type={'date'} className={'h-8 w-full border border-zinc-300 p-1 text-[13px]'} />
          <div className={'justify-self-start text-[13px] font-bold'}>{'해역 선택'}</div>
          <div className={'grid h-8 w-full grid-cols-3 place-items-center gap-1'}>
            <button onClick={() => handleOnSelectSea('west')} className={'h-6 w-full rounded-md text-[13px] text-zinc-50' + (maxFishQuery.sea === 'west' ? ' bg-orange-500' : ' bg-zinc-500')}>{'서해'}</button>
            <button onClick={() => handleOnSelectSea('south')} className={'h-6 w-full rounded-md text-[13px] text-zinc-50' + (maxFishQuery.sea === 'south' ? ' bg-orange-500' : ' bg-zinc-500')}>{'남해'}</button>
            <button onClick={() => handleOnSelectSea('east')} className={'h-6 w-full rounded-md text-[13px] text-zinc-50' + (maxFishQuery.sea === 'east' ? ' bg-orange-500' : ' bg-zinc-500')}>{'동해'}</button>
          </div>
        </div>
      </div>
      <div className={'relative flex size-full max-h-full min-w-[720px]'}>
        <CesiumMap
          baseWMSLayers={baseWMSLayers}
          wmsLayers={wmsLayers}
          onClick={handleMapOnClick}
          overlays={overlays}
          onCloseOverlay={handleOnCloseOverlay}
        />
        <div className={'absolute bottom-0 flex h-14 w-full items-center justify-center px-[10%]'}>
          {React.useMemo(() => <PlayBar timeList={testTimeList} index={playbarIndex} onChange={handleOnChangePlayBar} />, [playbarIndex])}
        </div>
      </div>
    </div>
  );
}

export default App;
