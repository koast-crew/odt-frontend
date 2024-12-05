import React from 'react';
import { Grid, Fish, Thermometer, Waves, ArrowUpFromDot, Leaf, Plus, Minus } from 'lucide-react';

export interface ToolBarProps {
  selectedLayers: string[]
  onChangeSelectedLayers: (layers: string[])=> void
  zoomLevel?: number
  onChangeZoomLevel?: (level: number)=> void
}

function ToolBar(props: ToolBarProps) {
  const { selectedLayers, onChangeSelectedLayers, zoomLevel = 50, onChangeZoomLevel } = props;
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  const handleOnClickLayer = (layer: string) => {
    onChangeSelectedLayers(selectedLayers.includes(layer) ? selectedLayers.filter((l) => l !== layer) : [...selectedLayers, layer]);
  };

  const handleOnMouseClickZoomLevel = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { clientY } = e;
    const { clientHeight } = e.currentTarget;
    const ratio = 100 - ((clientY - clientHeight - 275) / (clientHeight) * 100);
    onChangeZoomLevel?.(Math.min(Math.max(Number(ratio.toPrecision(2)), 0), 100));
  };

  const handleOnDragZoomLevel = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isMouseDown) {
      const { clientY } = e;
      const { clientHeight } = e.currentTarget;
      const ratio = 100 - ((clientY - clientHeight - 275) / (clientHeight) * 100);
      onChangeZoomLevel?.(Math.min(Math.max(Number(ratio.toPrecision(2)), 0), 100));
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
        <button onClick={() => handleOnClickLayer('sst')} className={
          'flex h-11 w-full flex-col items-center justify-center rounded-t-md border-b border-zinc-400 text-[11px] text-light'
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
        <button onClick={() => onChangeZoomLevel?.(zoomLevel >= 100 ? 100 : Number((zoomLevel + 10).toPrecision(1)))} className={'flex h-11 w-full select-none flex-col items-center justify-center rounded-t-md border-b border-zinc-400 text-[11px] text-zinc-50'}>
          <Plus className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'확대'}</div>
        </button>
        <div className={'flex w-full cursor-pointer flex-col items-center justify-center border-b border-zinc-400 py-3'}>
          <div
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            onMouseMove={handleOnDragZoomLevel}
            onClick={handleOnMouseClickZoomLevel}
            className={'relative flex h-32 w-full'}
          >
            <div className={'absolute bottom-0 left-[calc(50%_-_0.125rem)] h-full w-1 rounded-full bg-zinc-500'} />
            <div style={{ height: `${ 100 - (100 - zoomLevel) }%` }} className={'absolute bottom-0 left-[calc(50%_-_0.125rem)] h-full w-1 rounded-full bg-orange-500'} />
            <div style={{ top: `${ 100 - zoomLevel }%` }} className={'absolute left-[calc(50%_-_0.6rem)] top-0 h-2 w-5 cursor-pointer rounded-full bg-zinc-200'} />
          </div>
          <div className={'mt-2 flex w-full select-none items-center justify-center text-[11px] font-bold text-zinc-50'}>{`${ zoomLevel }%`}</div>
        </div>
        <button onClick={() => onChangeZoomLevel?.(zoomLevel <= 10 ? 10 : Number((zoomLevel - 10).toPrecision(1)))} className={'flex h-11 w-full select-none flex-col items-center justify-center rounded-b-md border-zinc-400 text-[11px] text-zinc-50'}>
          <Minus className={'size-4'} />
          <div className={'flex items-center justify-center'}>{'축소'}</div>
        </button>
      </div>
    </div>
  );
}

export default ToolBar;
