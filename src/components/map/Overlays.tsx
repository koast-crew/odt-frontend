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
  if (typeof value !== 'number') return '#3a3a3a';
  if (value >= 300) return '#C62828';
  if (value >= 90) return '#F44336';
  if (value >= 80) return '#FF8A65';
  if (value >= 70) return '#FFB74D';
  if (value >= 60) return '#FFD54F';
  if (value >= 50) return '#FFF176';
  if (value >= 40) return '#66BB6A';
  if (value >= 30) return '#81C784';
  if (value >= 20) return '#4FC3F7';
  if (value >= 10) return '#81D4FA';
  if (value >= 0) return '#B3E5FC90';
  return '#3a3a3a';
};

const commonStyle = {
  dataCell: 'text-[12px] font-bold text-gray6',
  valueCell: 'flex w-full items-center justify-start font-bold',
  unit: 'pl-1 text-[10px] font-bold text-gray6',
} as const;

interface PointData {
  label: string;
  value: number | null | undefined;
  unit: string;
}

function DataRow({ label, value, unit }: PointData) {
  const formattedValue = value?.toFixed(2) ?? '-';

  return (
    <>
      <div className={commonStyle.dataCell}>{label}</div>
      <div className={commonStyle.valueCell}>
        {label === '어획량' && (
          <svg className={'mr-1 size-3'} fill={getFishCatchColor(value)}>
            <circle cx={6} cy={6} r={6} />
          </svg>
        )}
        <span>
          <span>{label === '어획량' ? Math.round(value ?? 0) : formattedValue}</span>
          <span className={commonStyle.unit}>{unit}</span>
        </span>
      </div>
    </>
  );
}

function Overlay(props: NonNullable<OverlayProps['overlays']>[number] & { onCloseOverlay: OverlayProps['onCloseOverlay'] }) {
  const { id, position: { lon, lat }, time, species, onCloseOverlay } = props;
  const { data, error, isLoading } = fishInfoApi.endpoints.getPointInfo.useQuery({
    lon, lat,
    analysDate: dayjs(time ?? '').format('YYYYMMDD'),
    species: species ?? '',
  });

  const { payload } = data ?? { payload: null };
  const { gridId, predictCatch, ssh, sst, wave, chl } = payload ?? {};

  const pointDatas: PointData[] = [
    { label: '어획량', value: predictCatch, unit: 'kg' },
    { label: '파고', value: wave, unit: 'm' },
    { label: '수위', value: ssh, unit: 'm' },
    { label: '수온', value: sst, unit: '℃' },
    { label: '클로로필', value: chl, unit: '㎎/㎥' },
  ];

  return (
    <div id={id} key={id} className={'absolute z-10 flex h-56 min-w-36 justify-center rounded-sm bg-zinc-50 px-2 py-1 text-sm shadow-lg shadow-zinc-600 after:absolute after:-bottom-3 after:h-3 after:w-4 after:border-x-[1rem] after:border-t-[0.75rem] after:border-x-transparent after:border-t-zinc-50'}>
      <div className={'grid size-full text-xs'}>
        {/* 헤더 */}
        <div className={'flex items-center text-sm font-bold'}>
          <MapPin className={'size-5 fill-gray4 stroke-gray1'} />
          <span className={'flex-1'}>{gridId ?? '임의 지점'}</span>
        </div>

        {/* 위도/경도 정보 */}
        <div className={'grid size-full grid-cols-[2rem,_1fr] grid-rows-2 place-items-center border border-gray2 px-2.5'}>
          <span className={'font-bold text-gray6'}>{'위도'}</span>
          <span className={'flex w-full justify-end'}>{convertDMS(lon, lat).lat}</span>
          <span className={'font-bold text-gray6'}>{'경도'}</span>
          <span className={'flex w-full justify-end'}>{convertDMS(lon, lat).lon}</span>
        </div>

        {/* 데이터 표시 영역 */}
        <div className={'mb-2 mt-1 flex w-full justify-center'}>
          {payload && !error && !isLoading ? (
            <div className={'grid size-full grid-cols-[3rem_1fr] grid-rows-6 place-items-center border border-gray2 p-1'}>
              <div className={'col-span-2 text-xs font-bold'}>{'예측정보'}</div>
              {pointDatas.map((point, index) => (
                <DataRow key={index} {...point} />
              ))}
            </div>
          ) : isLoading ? (
            <Spinner className={'col-span-2 h-[100px] w-[30px] p-1 text-[13px] font-bold'} />
          ) : (
            <div className={'col-span-2 flex h-[100px] w-full items-center justify-center border border-gray2 p-1 text-[13px] font-bold'}>
              {'데이터가 없습니다.'}
            </div>
          )}
        </div>

        <button
          onClick={() => onCloseOverlay?.(id)}
          className={'mb-1 flex h-6 w-full items-center justify-center rounded-sm bg-zinc-500 text-xs text-light'}
        >
          {'닫기'}
        </button>
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
          <Overlay key={props.id} {...props} onCloseOverlay={onCloseOverlay} />
        );
      })}
    </>
  );
}