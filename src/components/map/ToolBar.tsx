import React from 'react';
import { Grid, FishSymbol, Thermometer, Waves, ArrowUpFromDot, Leaf, Plus, Minus, WindArrowDown } from 'lucide-react';

export interface ToolBarProps {
  selectedLayers: string[]
  selectedStreamline?: string[]
  onChangeSelectedLayers: (layers: string[])=> void
  onChangeSelectedStreamline?: (layers: string[])=> void
  zoomLevel?: number
  onChangeZoomLevel?: (level: number)=> void
  onLastSelectedChange?: (id: string)=> void
}

interface ToolbarButton {
  id: 'grid' | 'fish' | 'current' | 'sst' | 'wave' | 'ssh' | 'chl';
  label: string;
  type: 'layer' | 'streamline';
}

const toolbarButtons: ToolbarButton[][] = [
  [
    { id: 'grid', label: '격자', type: 'layer' },
    { id: 'fish', label: '어획량', type: 'layer' },
  ],
  [
    { id: 'current', label: '해류', type: 'streamline' },
    { id: 'sst', label: '수온', type: 'layer' },
    { id: 'wave', label: '파고', type: 'layer' },
    { id: 'ssh', label: '수위', type: 'layer' },
    { id: 'chl', label: '클로로필', type: 'layer' },
  ],
];

const Tooltip = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={'group relative'}>
      {children}
      <div className={'absolute right-[calc(100%+8px)] top-1/2 z-20 hidden -translate-y-1/2 animate-slideInFromRight whitespace-nowrap rounded-md bg-gray9 px-2 py-1 text-xs text-white group-hover:block '}>
        {label}
        <div className={' animation-slideInFromRight absolute right-[-4px] top-1/2 size-0 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-gray9 '} />
      </div>
    </div>
  );
};

const ToolbarButton = ({
  children,
  label,
  isFirst,
  isLast,
  isSelected,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onClick: ()=> void;
}) => (
  <Tooltip label={label}>
    <button
      onClick={onClick}
      className={`
        flex h-11 w-full flex-col items-center justify-center text-[11px] text-light
        ${ isFirst ? 'rounded-t-md' : '' } 
        ${ isLast ? 'rounded-b-md' : 'border-b border-gray2' }
        ${ isSelected ? 'bg-orange' : 'bg-gray8' }
        transition-colors duration-200
      `}
    >
      {children}
      <div className={'flex items-center justify-center text-[10px]'}>{label}</div>
    </button>
  </Tooltip>
);

const sliderOffset = 10;

function ToolBar(props: ToolBarProps) {
  const { selectedLayers, selectedStreamline = [], onChangeSelectedLayers, onChangeSelectedStreamline, zoomLevel = 50, onChangeZoomLevel, onLastSelectedChange } = props;
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const processedZoomLevel = Math.min(Math.max(Number(zoomLevel.toPrecision(2)), 0), 100);

  const handleOnClickLayer = (layer: string) => {
    onChangeSelectedLayers(selectedLayers.includes(layer) ? selectedLayers.filter((l) => l !== layer) : [...selectedLayers, layer]);
    if (layer !== 'grid') {
      onLastSelectedChange?.(layer);
    }
  };

  const handleOnClickStreamline = (layer: string) => {
    onChangeSelectedStreamline?.(selectedStreamline.includes(layer) ? selectedStreamline.filter((l) => l !== layer) : [...selectedStreamline, layer]);
    // if current가 아닐 때
    if (layer !== 'current') {
      onLastSelectedChange?.(layer);
    }
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

  const handleOnWheelZoomLevel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    onChangeZoomLevel?.(Math.min(Math.max(processedZoomLevel - (e.deltaY / 100), 0), 100));
  };

  const getIconByType = (id: string) => {
    switch (id) {
      case 'grid':
        return <Grid className={'size-4'} />;
      case 'fish':
        return <FishSymbol className={'size-4'} />;
      case 'current':
        return <WindArrowDown className={'size-4'} />;
      case 'sst':
        return <Thermometer className={'size-4'} />;
      case 'wave':
        return <Waves className={'size-4'} />;
      case 'ssh':
        return <ArrowUpFromDot className={'size-4'} />;
      case 'chl':
        return <Leaf className={'size-4'} />;
      default:
        return null;
    }
  };

  return (
    <div className={'absolute right-0 flex h-full w-16 select-none flex-col p-3'}>
      {toolbarButtons.map((buttonGroup, groupIndex) => (
        <div
          key={groupIndex}
          className={`${ groupIndex > 0 ? 'mt-2' : '' } flex flex-col rounded-md bg-gray6 shadow-md shadow-zinc-900`}
        >
          {buttonGroup.map((button, index) => {
            return (
              <ToolbarButton
                key={button.id}
                label={button.label}
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
              >
                {getIconByType(button.id)}
              </ToolbarButton>
            );
          })}
        </div>
      ))}
      <div className={'mt-2 flex flex-col rounded-md bg-gray8 shadow-md shadow-zinc-900'}>
        <div className={'group relative'}>
          <Tooltip label={'확대'} >
            <button onClick={() => onChangeZoomLevel?.(processedZoomLevel >= 100 ? 100 : Number((processedZoomLevel + 10).toPrecision(1)))} className={'flex h-11 w-full select-none flex-col items-center justify-center rounded-t-md border-b border-gray2 text-[11px] text-light'}>
              <Plus className={'size-4'} />
            </button>
          </Tooltip>
        </div>
        <div className={'flex w-full cursor-pointer flex-col items-center justify-center border-b border-gray2 py-3'}>
          <div
            ref={sliderRef}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            onMouseMove={handleOnDragZoomLevel}
            onWheel={handleOnWheelZoomLevel}
            onClick={handleOnMouseClickZoomLevel}
            className={'relative flex h-32 w-full'}
          >
            <div className={'absolute bottom-0 left-[calc(50%_-_0.125rem)] h-full w-1 rounded-full bg-gray4'} />
            <div style={{ height: `${ 100 - (100 - processedZoomLevel) }%` }} className={'absolute bottom-0 left-[calc(50%_-_0.125rem)] h-full w-1 rounded-full bg-orange'} />
            <div style={{ top: `calc(${ 100 - processedZoomLevel }% - 1rem)` }} className={'absolute left-[calc(50%_-_1.25rem)] flex size-10 cursor-pointer items-center justify-center'}>
              <div className={'h-2 w-5 rounded-full bg-zinc-200'} />
            </div>
          </div>
          <div className={'mt-2 flex w-full select-none items-center justify-center text-[11px] font-bold text-light'}>{`${ processedZoomLevel }%`}</div>
        </div>
        <div className={'group relative'}>
          <Tooltip label={'축소'} >
            <button onClick={() => onChangeZoomLevel?.(processedZoomLevel <= 10 ? 0 : Number((processedZoomLevel - 10).toPrecision(1)))} className={'flex h-11 w-full select-none flex-col items-center justify-center rounded-b-md border-gray2 text-[11px] text-light'}>
              <Minus className={'size-4'} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default ToolBar;
