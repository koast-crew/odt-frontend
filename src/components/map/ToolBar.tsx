import { Grid, Fish, Thermometer, Waves, ArrowUpFromDot, Leaf } from 'lucide-react';

export interface ToolBarProps {
  selectedLayers: string[]
  onChangeSelectedLayers: (layers: string[])=> void
}

function ToolBar(props: ToolBarProps) {
  const { selectedLayers, onChangeSelectedLayers } = props;

  const handleOnClickLayer = (layer: string) => {
    onChangeSelectedLayers(selectedLayers.includes(layer) ? selectedLayers.filter((l) => l !== layer) : [...selectedLayers, layer]);
  };

  return (
    <div className={'absolute right-0 flex h-full w-16 flex-col p-3'}>
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
    </div>
  );
}

export default ToolBar;
