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

const TOOLBAR_BUTTONS: ToolbarButton[][] = [
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

function ToolBar(props: ToolBarProps) {
  const { selectedLayers, selectedStreamline = [], onChangeSelectedLayers, onChangeSelectedStreamline, zoomLevel = 50, onChangeZoomLevel } = props;
  const [isMouseDown, setIsMouseDown] = React.useState(false);

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
      {TOOLBAR_BUTTONS.map((buttonGroup, groupIndex) => (
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
    </div>
  );
}

export default ToolBar;
