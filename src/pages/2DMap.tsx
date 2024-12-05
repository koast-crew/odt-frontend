import React from 'react';
import { Viewer } from 'cesium';
import CesiumMap, { CesiumMapProps } from '@/components/map/CesiumMap';
import PlayBar from '@/components/map/PlayBar';
import LeftHeaderTable from '@/components/LeftHeaderTable';
import { baseGridWMS } from '@/utils/consts/mapConstants';
import dayjs from 'dayjs';
import { fishInfoApi } from '@/api';

const baseWMSLayers = [baseGridWMS];

function Main() {
  const [overlays, setOverlays] = React.useState<NonNullable<CesiumMapProps['overlays']>>([]);
  const [playbarIndex, setPlayBarIndex] = React.useState(0);
  const [maxFishQuery, setMaxFishQuery] = React.useState({ species: 'squid', analysDate: dayjs().format('YYYYMMDD'), sea: 'west' });

  const timeList = React.useMemo(() => [0, 1, 2, 3].map((d) => dayjs(maxFishQuery.analysDate).add(d, 'day').format('YYYY-MM-DD')), [maxFishQuery]);
  const {
    data: maxFishInfo,
  } = fishInfoApi.endpoints.getMaxFishPointInfo.useQuery(maxFishQuery);

  const maxFishTableContent = React.useMemo(() => maxFishInfo?.payload ? [
    maxFishInfo.payload.map((mfi) => [dayjs(mfi.analysDate).format('MM-DD')]),
    maxFishInfo.payload.map((mfi) => [mfi.predictCatch]),
    maxFishInfo.payload.map((mfi) => [mfi.sst]),
    maxFishInfo.payload.map((mfi) => [mfi.wave]),
    maxFishInfo.payload.map((mfi) => [mfi.ssh]),
    maxFishInfo.payload.map((mfi) => [mfi.chl]),
  ] : [], [maxFishInfo]);

  const handleMapOnClick = async (viewer: Viewer, position: { lon: number, lat: number }) => {
    setOverlays((ol) => {
      return [...ol, {
        id: `overlay_${ (Number(ol.at(-1)?.id.replace('overlay_', '') ?? 0)) + 1 }`,
        position,
        time: timeList[playbarIndex],
        species: maxFishQuery.species,
      }];
    });
  };
  const handleOnCloseOverlay = (id: string) => {
    setOverlays((ol) => {
      return ol.filter((item) => item.id !== id);
    });
  };
  const handleOnChangePlayBar = React.useCallback((index: number) => {setPlayBarIndex(index);}, []);
  const handleOnChangeFishSelect = (e: React.ChangeEvent) => {
    const selectElement = e.target as HTMLSelectElement;
    setMaxFishQuery((mfq) => ({ ...mfq, species: selectElement.value }));
  };
  const handleOnDateChange = (e: React.ChangeEvent) => {
    const inputElement = e.target as HTMLInputElement;
    setMaxFishQuery((mfq) => ({ ...mfq, analysDate: inputElement.value }));
  };
  const handleOnSelectSea = (sea: string) => {
    setMaxFishQuery((mfq) => ({ ...mfq, sea }));
  };
  const wmsLayers = React.useMemo(() => {
    return [{ ...baseGridWMS, ...{ parameters: { ...baseGridWMS.parameters, viewparams: 'ctsh_rprt_ymd:' + timeList[playbarIndex] } } }];
  }, [playbarIndex, timeList]);

  React.useEffect(() => {
    setOverlays((ol) => ol.map((item) => ({ ...item, time: timeList[playbarIndex] })));
  }, [timeList, playbarIndex]);

  return (
    <>
      <div className={'flex h-full w-[350px] flex-col p-4'}>
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
        <div className={'flex h-8 w-full items-center justify-center text-[14px] font-bold'}>{'예측 어획량 최대 지점'}</div>
        <div className={'grid h-28 w-full grid-cols-[100px,_1fr] place-items-center gap-px border-y border-zinc-300 bg-zinc-300 text-[13px]'}>
          <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'날짜'}</div>
          <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].analysDate}</div>
          <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'격자 아이디'}</div>
          <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].gridId}</div>
          <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'위경도'}</div>
          <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].latDms}{', '}{maxFishInfo?.payload?.[0].lonDms}</div>
          <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'예측 어획량'}</div>
          <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].predictCatch}</div>
        </div>
        <div className={'flex h-8 w-full items-center justify-center text-[14px] font-bold'}>{'향후 3일 조회'}</div>
        {React.useMemo(() => (
          <LeftHeaderTable
            leftHeader={[['날짜'], ['어획량(t)'], ['수온(℃)'], ['파고(m)'], ['수위(m)'], ['클로로필', '(㎎/㎥)']]}
            tableContent={maxFishTableContent}
            isFirstRowHeader
          />
        ), [maxFishTableContent])}
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
          {React.useMemo(() => <PlayBar timeList={timeList} index={playbarIndex} onChange={handleOnChangePlayBar} />, [playbarIndex, timeList, handleOnChangePlayBar])}
        </div>
      </div>
    </>
  );
}

export default Main;
