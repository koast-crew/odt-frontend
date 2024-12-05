import React from 'react';
import { Viewer } from 'cesium';
import CesiumMap, { CesiumMapProps } from '@/components/map/CesiumMap';
import PlayBar from '@/components/map/PlayBar';
import LeftHeaderTable from '@/components/LeftHeaderTable';
import dayjs from 'dayjs';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { fishInfoApi } from '@/api';
import Spinner from '@/components/Spinner';
import { FishSymbol, MapPin, Award } from 'lucide-react';
import ToolBar from '@/components/map/ToolBar';
import { makeWms } from '@/utils/makeWms';

ChartJS.register(...registerables);

interface MaxFishQuery {
  species: string
  analysDate: string
  sea: string
}

interface ReanalysisQuery {
  species: string
  analysDate: string
}

interface DailyFishProps {
  maxFishQuery: MaxFishQuery
  setMaxFishQuery: React.Dispatch<React.SetStateAction<MaxFishQuery>>
}

function DailyFish(props: DailyFishProps) {
  const { maxFishQuery, setMaxFishQuery } = props;
  const { data: maxFishInfo, error, isLoading } = fishInfoApi.endpoints.getMaxFishPointInfo.useQuery(maxFishQuery);
  const { payload } = maxFishInfo ?? {};

  const maxFishTableContent = React.useMemo(() => payload ? [
    payload.map((mfi) => [dayjs(mfi.analysDate).format('MM-DD')]),
    payload.map((mfi) => [mfi.predictCatch]),
    payload.map((mfi) => [mfi.sst]),
    payload.map((mfi) => [mfi.wave]),
    payload.map((mfi) => [mfi.ssh]),
    payload.map((mfi) => [mfi.chl]),
  ] : [], [payload]);

  const maxFishTable = React.useMemo(() => (
    <LeftHeaderTable
      leftHeader={[['날짜'], ['어획량(t)'], ['수온(℃)'], ['파고(m)'], ['수위(m)'], ['클로로필', '(㎎/㎥)']]}
      tableContent={maxFishTableContent}
      isFirstRowHeader
    />
  ), [maxFishTableContent]);
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
  return (
    <>
      <div className={'my-2 grid w-full grid-cols-[75px,_1fr] grid-rows-3 place-items-center gap-1 rounded-lg border border-gray2 p-2 py-4'}>
        <label htmlFor={'daily-fish-species'} className={'justify-self-center text-[13px] font-bold'}>{'어종'}</label>
        <select id={'daily-fish-species'} onChange={handleOnChangeFishSelect} className={'h-8 w-full border border-gray4 p-1 text-[13px]'}>
          <option value={'squid'}>{'살오징어 (금어기 4/1 ~ 5/31)'}</option>
          <option value={'salmon'}>{'연어 (금어기 9/1 ~ 12/31)'}</option>
        </select>
        <label htmlFor={'daily-fish-date'} className={'justify-self-center text-[13px] font-bold'}>{'날짜'}</label>
        <input id={'daily-fish-date'} value={dayjs(maxFishQuery.analysDate).format('YYYY-MM-DD')} onChange={handleOnDateChange} type={'date'} className={'h-8 w-full border border-gray4 p-1 text-[13px]'} />
        <div className={'justify-self-center text-[13px] font-bold'}>{'해역'}</div>
        <div className={'grid h-8 w-full grid-cols-3 place-items-center gap-1'}>
          <button onClick={() => handleOnSelectSea('west')} className={'h-6 w-full rounded-md text-[13px]' + (maxFishQuery.sea === 'west' ? ' bg-orange text-light' : ' bg-gray2 text-dark')}>
            {'서해'}
          </button>
          <button onClick={() => handleOnSelectSea('south')} className={'h-6 w-full rounded-md text-[13px]' + (maxFishQuery.sea === 'south' ? ' bg-orange text-light' : ' bg-gray2 text-dark')}>
            {'남해'}
          </button>
          <button onClick={() => handleOnSelectSea('east')} className={'h-6 w-full rounded-md text-[13px]' + (maxFishQuery.sea === 'east' ? ' bg-orange text-light' : ' bg-gray2 text-dark')}>
            {'동해'}
          </button>
        </div>
      </div>
      {maxFishInfo && !error && !isLoading ? (
        <>
          <div className={'my-2'}>
            <div className={'flex h-8 w-full items-center justify-start pl-1 text-[14px] font-bold'}>
              {'예측 어획량 최대 지점'}
            </div>
            <div className={'grid h-28 w-full grid-cols-[100px,_1fr] place-items-center gap-px border-y border-gray4 bg-zinc-300 text-[13px]'}>
              <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'날짜'}</div>
              <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].analysDate}</div>
              <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'격자 아이디'}</div>
              <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].gridId}</div>
              <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'위경도'}</div>
              <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].latDms}{', '}{maxFishInfo?.payload?.[0].lonDms}</div>
              <div className={'flex size-full items-center justify-center bg-zinc-100 font-bold'}>{'예측 어획량'}</div>
              <div className={'flex size-full items-center justify-center bg-white'}>{maxFishInfo?.payload?.[0].predictCatch}</div>
            </div>
          </div>
          <div className={'flex h-8 w-full items-center justify-start pl-1 text-[14px] font-bold'}>{'향후 3일 조회'}</div>
          {maxFishTable}
        </>
      ) : isLoading ? (
        <div className={'flex h-28 w-full items-center justify-center text-[14px] font-bold'}><Spinner /></div>
      ) : (
        <div className={'flex h-28 w-full items-center justify-center text-[14px] font-bold'}>{'데이터가 없습니다.'}</div>
      )}
    </>
  );
}

interface ReanalysisProps {
  reanalysisQuery: ReanalysisQuery
  setReanalysisQuery: React.Dispatch<React.SetStateAction<ReanalysisQuery>>
}

function Reanalysis(props: ReanalysisProps) {
  const { reanalysisQuery, setReanalysisQuery } = props;
  const { data, error, isLoading } = fishInfoApi.endpoints.getReanalysisInfo.useQuery(reanalysisQuery);
  const { payload } = data ?? {};

  const chartData = React.useMemo(() => {
    const years = payload?.labelYears;
    const colors = ['#8884d8', '#82ca9d', '#ffc658'];
    const labels = payload?.labelMonths;

    const datasets = years?.map((y, i) => ({
      label: y,
      data: payload?.dataList.map((d) => d[i] / 1000000),
      borderColor: colors[i],
      fill: false,
      tension: 0.4,
    })) ?? [];

    return {
      labels,
      datasets,
    };
  }, [payload]);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { pointStyle: 'circle', usePointStyle: true, boxWidth: 5, boxHeight: 5, useBorderRadius: true, borderRadius: 100000 } } },
  };

  const locations = payload?.locationList;
  const handleOnChangeFishSelect = (e: React.ChangeEvent) => {
    const selectElement = e.target as HTMLSelectElement;
    setReanalysisQuery((mfq) => ({ ...mfq, species: selectElement.value }));
  };
  const handleOnDateChange = (e: React.ChangeEvent) => {
    const inputElement = e.target as HTMLInputElement;
    setReanalysisQuery((mfq) => ({ ...mfq, analysDate: inputElement.value }));
  };
  return (
    <>
      <div className={'my-2 grid w-full grid-cols-[75px,_1fr] grid-rows-2 place-items-center gap-1 rounded-lg border border-gray2 p-2 py-4'}>
        <label htmlFor={'reanalysis-species'} className={'justify-self-center text-[13px] font-bold'}>{'어종'}</label>
        <select id={'reanalysis-species'} onChange={handleOnChangeFishSelect} className={'h-8 w-full border border-gray4 p-1 text-[13px]'}>
          <option value={'squid'}>{'살오징어 (금어기 4/1 ~ 5/31)'}</option>
          <option value={'salmon'}>{'연어 (금어기 9/1 ~ 12/31)'}</option>
        </select>
        <label htmlFor={'reanalysis-date'} className={'justify-self-center text-[13px] font-bold'}>{'날짜'}</label>
        <input id={'reanalysis-date'} value={dayjs(reanalysisQuery.analysDate).format('YYYY-MM-DD')} onChange={handleOnDateChange} type={'date'} className={'h-8 w-full border border-gray4 p-1 text-[13px]'} />
      </div>
      {data && !error && !isLoading ? (
        <>
          <div className={'mt-2 flex h-8 w-full items-center justify-start pl-1 text-[14px] font-bold'}>{'과거 관측 재분석 자료'}</div>
          <Chart height={200} type={'line'} options={chartOptions} data={chartData} />
          <div className={'flex w-full items-center justify-end pr-4 text-[11px] font-bold text-gray5'}>{'단위: 100만 톤'}</div>
          <div className={'mt-2 flex h-8 w-full items-center justify-start pl-1 text-[14px] font-bold'}>{dayjs(reanalysisQuery.analysDate).format('YYYY년 MM월') + ' 최대 어획량 예측 지점 순위'}</div>
          {
            locations?.map((l, index) => (
              <div key={l.gridId} className={'mt-2 flex w-full flex-col items-start rounded-md border border-gray3 p-1 text-[12px] shadow-sm shadow-zinc-200'}>
                <div className={'flex w-full items-center justify-between text-[13px] text-dark'}>
                  <div className={'flex w-full items-center'}>
                    <Award className={`size-5 stroke-none ${ index === 0 ? 'fill-yellow-500' : index === 1 ? 'fill-zinc-400' : index === 2 ? 'fill-amber-700' : 'fill-gray2' }`} />
                    <span className={'text-bold text-base text-main'}>
                      {`${ l.totalCatch.toFixed(1) }`}
                      <span className={'text-sm text-gray7'}>{' 톤'}</span>
                    </span>
                  </div>
                  <div className={'mr-2 flex items-center justify-center'}>
                    <MapPin className={'size-4 fill-gray4 stroke-gray1'} />
                    <div className={'flex items-center justify-center'}>{l.gridId}</div>
                  </div>
                </div>
                <div className={'ml-5 flex w-full items-center justify-between text-[13px] text-gray7'}>
                  {`${ l.latDms }, ${ l.lonDms }`}
                </div>
              </div>
            ))
          }
        </>
      ) : isLoading ? (
        <div className={'flex h-28 w-full items-center justify-center text-[14px] font-bold'}><Spinner className={'size-6'} /></div>
      ) : (
        <div className={'flex h-28 w-full items-center justify-center text-[14px] font-bold'}>{'데이터가 없습니다.'}</div>
      )}
    </>
  );
}

function Main() {
  const [overlays, setOverlays] = React.useState<NonNullable<CesiumMapProps['overlays']>>([]);
  const [playbarIndex, setPlayBarIndex] = React.useState(0);
  const [maxFishQuery, setMaxFishQuery] = React.useState({ species: 'squid', analysDate: dayjs().format('YYYYMMDD'), sea: 'west' });
  const [reanalysisQuery, setReanalysisQuery] = React.useState({ species: 'squid', analysDate: dayjs().format('YYYYMMDD') });
  const [tab, setTab] = React.useState<'dailyFish' | 'reanalysis'>('dailyFish');
  const [selectedLayers, setSelectedLayers] = React.useState<string[]>(['grid', 'fish']);
  const [zoomLevel, setZoomLevel] = React.useState(50);

  const timeList = React.useMemo(
    () => [0, 1, 2, 3].map((d) => dayjs(tab === 'dailyFish' ? maxFishQuery.analysDate : reanalysisQuery.analysDate).add(d, 'day').format('YYYY-MM-DD')),
    [tab, maxFishQuery, reanalysisQuery],
  );

  const handleMapOnClick = async (viewer: Viewer, position: { lon: number, lat: number }) => {
    setOverlays((ol) => {
      return [...ol, {
        id: `overlay_${ (Number(ol.at(-1)?.id.replace('overlay_', '') ?? 0)) + 1 }`,
        position,
        time: timeList[playbarIndex],
        species: tab === 'dailyFish' ? maxFishQuery.species : reanalysisQuery.species,
      }];
    });
  };
  const handleOnCloseOverlay = (id: string) => {
    setOverlays((ol) => {
      return ol.filter((item) => item.id !== id);
    });
  };
  const handleOnChangePlayBar = React.useCallback((index: number) => {setPlayBarIndex(index);}, []);
  const handleOnChangeSelectedLayers = React.useCallback((layers: string[]) => {setSelectedLayers(layers);}, []);
  const wmsLayers = React.useMemo(() => {
    return selectedLayers.map((layer) => makeWms(layer, timeList[playbarIndex]));
  }, [playbarIndex, timeList, selectedLayers]);

  React.useEffect(() => {
    setOverlays((ol) => ol.map((item) => ({ ...item, time: timeList[playbarIndex] })));
  }, [timeList, playbarIndex]);

  return (
    <>
      <div className={'flex h-full w-[350px] flex-col p-4'}>
        <div className={'grid grid-cols-[75px,_1fr] gap-1 py-1'}>
          <div className={'flex items-center gap-1'}>
            <FishSymbol className={'text-main'} width={'20'} height={'20'} />
            <span className={'shrink-0 font-bold text-main'}>{'어획량'}</span>
          </div>
          <div className={'flex h-8 w-full gap-0.5 rounded-lg border border-gray2 p-0.5'}>
            <button onClick={() => setTab('dailyFish')} className={'flex flex-1 items-center justify-center rounded-md text-[14px]' + (tab === 'dailyFish' ? ' bg-blue text-light' : ' bg-gray2 text-dark')}>{'일별 예측(AI)'}</button>
            <button onClick={() => setTab('reanalysis')} className={'flex flex-1 items-center justify-center rounded-md text-[14px]' + (tab === 'reanalysis' ? ' bg-blue text-light' : ' bg-gray2 text-dark')}>{'과거 관측 재분석'}</button>
          </div>
        </div>
        {tab === 'dailyFish' ? <DailyFish maxFishQuery={maxFishQuery} setMaxFishQuery={setMaxFishQuery} /> : <Reanalysis reanalysisQuery={reanalysisQuery} setReanalysisQuery={setReanalysisQuery} />}
      </div>
      <div className={'relative flex size-full max-h-full min-w-[720px]'}>
        <CesiumMap
          wmsLayers={wmsLayers}
          onClick={handleMapOnClick}
          overlays={overlays}
          onCloseOverlay={handleOnCloseOverlay}
        />
        <div className={'absolute bottom-0 flex h-14 w-full items-center justify-center px-[10%]'}>
          {React.useMemo(() => <PlayBar timeList={timeList} index={playbarIndex} onChange={handleOnChangePlayBar} />, [playbarIndex, timeList, handleOnChangePlayBar])}
        </div>
        <ToolBar selectedLayers={selectedLayers} onChangeSelectedLayers={handleOnChangeSelectedLayers} zoomLevel={zoomLevel} onChangeZoomLevel={setZoomLevel} />
      </div>
    </>
  );
}

export default Main;
