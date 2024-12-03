import { CesiumMapProps } from './CesiumMap';

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

const getFishCatchColor = (value?: number) => {
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

export default function Overlays(props: OverlayProps) {
  const {
    overlays = [],
    onCloseOverlay,
  } = props;

  return (
    <>
      {overlays.map(({ id, position: { lon, lat }, displayValue, gridId }) => {
        return (
          <div
            id={id}
            key={id}
            className={'absolute z-10 flex size-32 items-center justify-center rounded-sm bg-zinc-50 p-1 text-sm text-zinc-600 shadow-md shadow-zinc-600 after:absolute after:-bottom-3 after:h-3 after:w-4 after:border-x-[1rem] after:border-t-[0.75rem] after:border-x-transparent after:border-t-zinc-50'}
          >
            <div className={'grid size-full grid-cols-1 grid-rows-[1rem,_2.5rem,_1fr,_1.5rem] place-items-center text-xs'}>
              <div className={'font-bold'}>{gridId}</div>
              <div className={'grid size-full grid-cols-[2rem,_1fr] grid-rows-2 place-items-center'}>
                <svg className={'row-span-2 size-4 fill-zinc-600'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 384 512'}>
                  <path d={'M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'} />
                </svg>
                <div className={'self-end justify-self-start'}>{convertDMS(lon, lat).lon}</div>
                <div className={'self-start justify-self-start'}>{convertDMS(lon, lat).lat}</div>
              </div>
              <div className={'grid size-full grid-cols-[1fr,_1fr] grid-rows-1 place-items-center px-[3px]'}>
                <div className={'text-[13px] font-bold'}>{'어획량'}</div>
                <div style={{ backgroundColor: getFishCatchColor(displayValue) }} className={'rounded-full bg-slate-600 px-4 py-1 font-bold text-zinc-50'}>{displayValue ?? '-'}</div>
              </div>
              <button onClick={() => onCloseOverlay?.(id)} className={'flex h-5 w-16 items-center justify-center rounded-sm bg-zinc-500 text-xs text-zinc-50'}>{'닫기'}</button>
            </div>
          </div>
        );
      })}
    </>
  );
}