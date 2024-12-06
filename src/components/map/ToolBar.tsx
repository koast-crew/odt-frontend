import React from 'react';
import { Grid, FishSymbol, Thermometer, Waves, ArrowUpFromDot, Leaf, Plus, Minus, WindArrowDown } from 'lucide-react';

export interface ToolBarProps {
  selectedLayers: string[]
  selectedStreamline?: string[]
  onChangeSelectedLayers: (layers: string[])=> void
  onChangeSelectedStreamline?: (layers: string[])=> void
  zoomLevel?: number
  onChangeZoomLevel?: (level: number)=> void
}

interface ToolbarButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'layer' | 'streamline';
}

const toolbarButtons: ToolbarButton[][] = [
  [
    { id: 'grid', label: '격자', icon: <Grid className={'size-4'} />, type: 'layer' },
    { id: 'fish', label: '어획량', icon: <FishSymbol className={'size-4'} />, type: 'layer' },
  ],
  [
    { id: 'current', label: '해류', icon: <WindArrowDown className={'size-4'} />, type: 'streamline' },
    { id: 'sst', label: '수온', icon: <Thermometer className={'size-4'} />, type: 'layer' },
    { id: 'wave', label: '파고', icon: <Waves className={'size-4'} />, type: 'layer' },
    { id: 'ssh', label: '수위', icon: <ArrowUpFromDot className={'size-4'} />, type: 'layer' },
    { id: 'chl', label: '클로로필', icon: <Leaf className={'size-4'} />, type: 'layer' },
  ],
];

const ToolbarButton = ({
  button,
  isFirst,
  isLast,
  isSelected,
  onClick,
}: {
  button: ToolbarButton;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onClick: ()=> void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex h-11 w-full flex-col items-center justify-center text-[11px] text-light
      ${ isFirst ? 'rounded-t-md' : '' } 
      ${ isLast ? 'rounded-b-md' : 'border-b border-zinc-400' }
      ${ isSelected ? 'bg-orange' : 'bg-gray6' }
    `}
  >
    {button.icon}
    <div className={'flex items-center justify-center text-[10px]'}>{button.label}</div>
  </button>
);

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
      {toolbarButtons.map((buttonGroup, groupIndex) => (
        <div
          key={groupIndex}
          className={`${ groupIndex > 0 ? 'mt-2' : '' } flex flex-col rounded-md bg-gray6 shadow-md shadow-zinc-900`}
        >
          {buttonGroup.map((button, index) => (
            <ToolbarButton
              key={button.id}
              button={button}
              isFirst={index === 0}
              isLast={index === buttonGroup.length - 1}
              isSelected={
                button.type === 'layer'
                  ? selectedLayers.includes(button.id)
                  : selectedStreamline.includes(button.id)
              }
              onClick={() =>
                button.type === 'layer'
                  ? handleOnClickLayer(button.id)
                  : handleOnClickStreamline(button.id)
              }
            />
          ))}
        </div>
      ))}
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
