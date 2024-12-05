import { CesiumMapProps } from './CesiumMap';
import { fishInfoApi } from '@/api';
import { MapPin } from 'lucide-react';
import Spinner from '../Spinner';
import dayjs from 'dayjs';

interface OverlayProps {
  overlays: CesiumMapProps['overlays']
  onCloseOverlay: CesiumMapProps['onCloseOverlay']
}

const convertDMS = (lon: number, lat: number) => {
  const toDegreesMinutesAndSeconds = (coordinate: number) => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + '° ' + minutes + '′ ' + seconds + '″';
  };
  const latitude = toDegreesMinutesAndSeconds(lat);
  const latitudeCardinal = lat >= 0 ? 'N' : 'S';

  const longitude = toDegreesMinutesAndSeconds(lon);
  const longitudeCardinal = lon >= 0 ? 'E' : 'W';

  return { lon: longitude + ' ' + longitudeCardinal, lat: latitude + ' ' + latitudeCardinal };
};

const getFishCatchColor = (value?: number | null) => {
  if (typeof value !== 'number') return '#cccccc';
  if (value >= 90) return '#ff0000';
  if (value >= 80) return '#f78d26';
  if (value >= 70) return '#c2dafd';
  if (value >= 60) return '#a3b8fd';
  if (value >= 50) return '#8595fd';
  if (value >= 40) return '#6673fe';
  if (value >= 30) return '#4750fe';
  if (value >= 20) return '#292eff';
  if (value >= 10) return '#0a0cff';
  if (value >= 0) return '#0000ff';
  return '#cccccc';
};

function Overlay(props: NonNullable<OverlayProps['overlays']>[number] & { onCloseOverlay: OverlayProps['onCloseOverlay'] }) {
  const {
    id, position: { lon, lat }, time, species, onCloseOverlay,
  } = props;

  const { data, error, isLoading } = fishInfoApi.endpoints.getPointInfo.useQuery({ lon, lat, analysDate: dayjs(time ?? '').format('YYYYMMDD'), species: species ?? '' });
  const { payload } = data ?? { payload: null };
  const { gridId, predictCatch, ssh, sst, wave, chl } = payload ?? { gridId: null, predictCatch: null, wave: null, ssh: null, sst: null, chl: null };
  return (
    <div
      id={id}
      key={id}
      className={(payload && !error && !isLoading ? 'h-56 ' : 'h-36 ') + 'absolute z-10 flex min-w-36 items-center justify-center rounded-sm bg-zinc-50 py-1 px-2 text-sm shadow-md shadow-zinc-600 after:absolute after:-bottom-3 after:h-3 after:w-4 after:border-x-[1rem] after:border-t-[0.75rem] after:border-x-transparent after:border-t-zinc-50'}
    >
      <div className={'grid size-full text-xs'}>
        <div className={'flex items-center text-sm font-bold'}>
          <MapPin className={'size-5 fill-gray4 stroke-gray1'} />
          <span className={'flex-1'}>{gridId ?? '임의 지점'}</span>
        </div>
        <div className={'grid size-full grid-cols-[2rem,_1fr] grid-rows-2 place-items-center pl-3 pr-0.5'}>
          <span>{'위도'}</span>
          <span className={'flex w-full justify-end'}>{convertDMS(lon, lat).lat}</span>
          <span>{'경도'}</span>
          <span className={'flex w-full justify-end'}>{convertDMS(lon, lat).lon}</span>
        </div>
        <div className={'my-2'}>
          {payload && !error && !isLoading ? (
            <div className={'grid size-full grid-cols-[3rem,_1fr] grid-rows-4 place-items-center border border-gray2 p-1'}>
              <div className={'text-[12px] font-bold text-gray6'}>{'어획량'}</div>
              <div className={'flex w-full items-center justify-start font-bold'}>
                <svg className={'mr-1 size-3'} fill={getFishCatchColor(predictCatch)}>
                  <circle cx={6} cy={6} r={6} />
                </svg>
                <span className={'font-bold'} style={{ color: getFishCatchColor(predictCatch) }}>
                  {predictCatch ?? '-'}
                  <span className={'text-gray6'}>{' ton'}</span>
                </span>
              </div>
              <div className={'text-[12px] font-bold text-gray6'}>{'파고'}</div>
              <div className={'flex w-full items-center justify-start font-bold'}>
                {wave?.toFixed(2) ?? '-'}
                <div className={'pl-1 text-[10px] font-bold text-gray6'}>{'m'}</div>
              </div>
              <div className={'text-[12px] font-bold text-gray6'}>{'수위'}</div>
              <div className={'flex w-full items-center justify-start font-bold'}>
                {ssh?.toFixed(2) ?? '-'}
                <div className={'pl-1 text-[10px] font-bold text-gray6'}>{'m'}</div>
              </div>
              <div className={'text-[12px] font-bold text-gray6'}>{'수온'}</div>
              <div className={'flex w-full items-center justify-start font-bold'}>
                {sst?.toFixed(2) ?? '-'}
                <div className={'pl-1 text-[10px] font-bold text-gray6'}>{'℃'}</div>
              </div>
              <div className={'text-[12px] font-bold text-gray6'}>{'클로로필'}</div>
              <div className={'flex w-full items-center justify-start font-bold'}>
                {chl?.toFixed(2) ?? '-'}
                <div className={'pl-1 text-[10px] font-bold text-gray6'}>{'㎎/㎥'}</div>
              </div>
            </div>
          ) : isLoading ? <Spinner className={'col-span-2 flex w-[25px] justify-center text-[13px] font-bold'} /> : <div className={'col-span-2 flex w-full justify-center text-[13px] font-bold'}>{'데이터가 없습니다.'}</div>}
        </div>
        <button onClick={() => onCloseOverlay?.(id)} className={'mb-1 flex w-full items-center justify-center rounded-sm bg-zinc-500 pb-1 text-xs text-light'}>{'닫기'}</button>
      </div>
    </div>
  );
}

export default function Overlays(props: OverlayProps) {
  const {
    overlays = [],
    onCloseOverlay,
  } = props;

  return (
    <>
      {overlays.map((props) => {
        return (
          <Overlay {...props} onCloseOverlay={onCloseOverlay} />
        );
      })}
    </>
  );
}