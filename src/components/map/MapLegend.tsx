import { X } from 'lucide-react';
import { ToolbarButton } from '@/components/types';

interface LegendBarProps {
  lastSelected: string;
  legendConst: Record<string, {
    colors: readonly string[];
    values: readonly string[];
    opacity: number;
  }>;
}

function LegendBar({ lastSelected, legendConst }: LegendBarProps) {
  return (
    <>
      <div className={'flex w-full px-[18px]'}>
        {legendConst[lastSelected]?.colors.map((color) => (
          <span
            key={color}
            className={'size-4 w-9 first:rounded-l-full last:rounded-r-full'}
            style={{
              backgroundColor: color,
              opacity: legendConst[lastSelected].opacity,
            }}
          />
        ))}
      </div>
      <div className={'flex w-full justify-between'}>
        {legendConst[lastSelected]?.values.map((value) => (
          <span key={value} className={'w-9 text-center text-[12px]'}>{value}</span>
        ))}
      </div>
    </>
  );
}

interface MapLegendProps {
  legend: boolean;
  onCloseLegend: ()=> void;
  lastSelected: string;
  setLastSelected: (id: string)=> void;
  toolbarButtons: ToolbarButton[][];
  legendConst: Record<string, {
    colors: readonly string[];
    values: readonly string[];
    opacity: number;
  }>;
}

function MapLegend({ legend, onCloseLegend, lastSelected, setLastSelected, toolbarButtons, legendConst }: MapLegendProps) {
  if (!legend) return null;

  return (
    <div className={'z-10 mb-9 flex h-auto w-[420px] flex-col justify-center rounded-lg bg-white px-3 py-2 shadow-lg'}>
      <div className={'flex h-8 w-full items-center justify-between font-bold'}>
        <span>{'범례'}</span>
        <button type={'button'} onClick={onCloseLegend}>
          <X className={'size-4'} />
        </button>
      </div>
      <div className={'flex flex-col gap-2 pt-2 text-sm'}>
        <div className={'flex flex-wrap gap-2'}>
          {toolbarButtons.flat()
            .filter((btn) => btn.id !== 'grid' && btn.id !== 'current')
            .map((btn) => (
              <button
                key={btn.id}
                className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                  lastSelected === btn.id
                    ? 'bg-orange text-white'
                    : 'bg-gray2 text-gray10'
                }`}
                onClick={() => setLastSelected(btn.id)}
              >
                <span>{btn.label}</span>
              </button>
            ))}
        </div>
        <div className={'mt-2 flex w-full flex-col gap-2'}>
          {legendConst[lastSelected] && <LegendBar lastSelected={lastSelected} legendConst={legendConst} />}
        </div>
      </div>
    </div>
  );
}

export default MapLegend;
