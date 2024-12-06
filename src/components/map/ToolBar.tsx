import React from 'react';
import { Grid, Fish, Thermometer, Waves, ArrowUpFromDot, Leaf, Plus, Minus, WindArrowDown } from 'lucide-react';

export interface ToolBarProps {
  selectedLayers: string[]
  selectedStreamline?: string[]
  onChangeSelectedLayers: (layers: string[])=> void
  onChangeSelectedStreamline?: (layers: string[])=> void
  zoomLevel?: number
  onChangeZoomLevel?: (level: number)=> void
}

const sliderOffset = 10;

function ToolBar(props: ToolBarProps) {
  const { selectedLayers, selectedStreamline = [], onChangeSelectedLayers, onChangeSelectedStreamline, zoomLevel = 50, onChangeZoomLevel } = props;
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const processedZoomLevel = Math.min(Math.max(Number(zoomLevel.toPrecision(2)), 0), 100);

  const handleOnClickLayer = (layer: string) => {
    onChangeSelectedLayers(selectedLayers.includes(layer) ? selectedLayers.filter((l) => l !== layer) : [...selectedLayers, layer]);
  };

  const handleOnClickStreamline = (layer: string) => {
    onChangeSelectedStreamline?.(selectedStreamline.includes(layer) ? selectedStreamline.filter((l) => l !== layer) : [...selectedStreamline, layer]);
  };

  const handleOnMouseClickZoomLevel = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { clientY } = e;
    const { clientHeight } = e.currentTarget;
    const { y = 0, height = 0 } = sliderRef.current?.getBoundingClientRect() ?? {};
    const ratio = 100 - ((clientY - clientHeight - (y - height + sliderOffset)) / (clientHeight) * 100);
    onChangeZoomLevel?.(Math.min(Math.max(ratio, 0), 100));
  };

  const handleOnDragZoomLevel = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isMouseDown) {
      const { clientY } = e;
      const { clientHeight } = e.currentTarget;
      const { y = 0, height = 0 } = sliderRef.current?.getBoundingClientRect() ?? {};
      const ratio = 100 - ((clientY - clientHeight - (y - height + sliderOffset)) / (clientHeight) * 100);
      onChangeZoomLevel?.(Math.min(Math.max(ratio, 0), 100));
    }
  };

  return (
    <div className={'absolute right-0 flex h-full w-16 select-none flex-col p-3'}>
      <div className={'flex flex-col rounded-md bg-zinc-700 shadow-md shadow-zinc-900'}>
        <button
          onClick={() => handleOnClickLayer('grid')}
          className={
            'flex h-11 w-full flex-col items-center justify-center rounded-t-md border-b border-zinc-400 text-[11px] text-light'
            + (selectedLayers.includes('grid') ? ' bg-orange' : ' bg-zinc-500')
          }
        >
          <Grid className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'격자'}</div>
        </button>
        <button
          onClick={() => handleOnClickLayer('fish')}
          className={
            'flex h-11 w-full flex-col items-center justify-center rounded-b-md text-[11px] text-light'
            + (selectedLayers.includes('fish') ? ' bg-orange' : ' bg-zinc-500')
          }
        >
          <Fish className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'어획량'}</div>
        </button>
      </div>
      <div className={'mt-2 flex flex-col rounded-md bg-zinc-700 shadow-md shadow-zinc-900'}>
        <button onClick={() => handleOnClickStreamline('current')} className={
          'flex h-11 w-full flex-col items-center justify-center rounded-t-md border-b border-zinc-400 text-[11px] text-light'
          + (selectedStreamline.includes('current') ? ' bg-orange' : ' bg-zinc-500')
        }
        >
          <WindArrowDown className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'해류'}</div>
        </button>
        <button onClick={() => handleOnClickLayer('sst')} className={
          'flex h-11 w-full flex-col items-center justify-center border-b border-zinc-400 text-[11px] text-light'
          + (selectedLayers.includes('sst') ? ' bg-orange' : ' bg-zinc-500')
        }
        >
          <Thermometer className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'수온'}</div>
        </button>
        <button onClick={() => handleOnClickLayer('wave')} className={
          'flex h-11 w-full flex-col items-center justify-center border-b border-zinc-400 text-[11px] text-light'
          + (selectedLayers.includes('wave') ? ' bg-orange' : ' bg-zinc-500')
        }
        >
          <Waves className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'파고'}</div>
        </button>
        <button onClick={() => handleOnClickLayer('ssh')} className={
          'flex h-11 w-full flex-col items-center justify-center border-b border-zinc-400 text-[11px] text-light'
          + (selectedLayers.includes('ssh') ? ' bg-orange' : ' bg-zinc-500')
        }
        >
          <ArrowUpFromDot className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'수위'}</div>
        </button>
        <button onClick={() => handleOnClickLayer('chl')} className={
          'flex h-11 w-full flex-col items-center justify-center rounded-b-md text-[9px] text-light'
          + (selectedLayers.includes('chl') ? ' bg-orange' : ' bg-zinc-500')
        }
        >
          <Leaf className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'클로로필'}</div>
        </button>
      </div>
      <div className={'mt-2 flex flex-col rounded-md bg-zinc-700 shadow-md shadow-zinc-900'}>
        <button onClick={() => onChangeZoomLevel?.(processedZoomLevel >= 100 ? 100 : Number((processedZoomLevel + 10).toPrecision(1)))} className={'flex h-11 w-full select-none flex-col items-center justify-center rounded-t-md border-b border-zinc-400 text-[11px] text-zinc-50'}>
          <Plus className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'확대'}</div>
        </button>
        <div className={'flex w-full cursor-pointer flex-col items-center justify-center border-b border-zinc-400 py-3'}>
          <div
            ref={sliderRef}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            onMouseMove={handleOnDragZoomLevel}
            onClick={handleOnMouseClickZoomLevel}
            className={'relative flex h-32 w-full'}
          >
            <div className={'absolute bottom-0 left-[calc(50%_-_0.125rem)] h-full w-1 rounded-full bg-zinc-500'} />
            <div style={{ height: `${ 100 - (100 - processedZoomLevel) }%` }} className={'absolute bottom-0 left-[calc(50%_-_0.125rem)] h-full w-1 rounded-full bg-orange'} />
            <div style={{ top: `calc(${ 100 - processedZoomLevel }% - 1rem)` }} className={'absolute left-[calc(50%_-_1.25rem)] flex size-10 cursor-pointer items-center justify-center'}>
              <div className={'h-2 w-5 rounded-full bg-zinc-200'} />
            </div>
          </div>
          <div className={'mt-2 flex w-full select-none items-center justify-center text-[11px] font-bold text-zinc-50'}>{`${ processedZoomLevel }%`}</div>
        </div>
        <button onClick={() => onChangeZoomLevel?.(processedZoomLevel <= 10 ? 0 : Number((processedZoomLevel - 10).toPrecision(1)))} className={'flex h-11 w-full select-none flex-col items-center justify-center rounded-b-md border-zinc-400 text-[11px] text-zinc-50'}>
          <Minus className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'축소'}</div>
        </button>
      </div>
    </div>
  );
}

export default ToolBar;
