import React from 'react';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';

export interface PlayBarProps {
  timeList?: Array<string>
  index?: number
  onChange?: (id: number)=> void
}

export default function PlayBar(props: PlayBarProps) {
  const {
    timeList,
    index = 0,
    onChange,
  } = props;

  const [hoverIndex, setHoverIndex] = React.useState(-1);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!timeList?.length) return;
    if (isPlaying && (index <= (timeList.length - 1))) {
      setTimeout(() => {
        onChange?.(index + 1);
      }, 500);
    } else if (index > (timeList.length - 1)) {
      onChange?.(0);
      setIsPlaying(false);
    } else {
      return;
    }
  }, [isPlaying, index, onChange, timeList?.length]);

  return (
    <>
      {
        timeList
        && (
          <div className={'mb-8 size-full p-2'}>
            <div className={'relative grid size-full grid-cols-[8rem,_1fr] grid-rows-[6px,_1fr] place-items-center gap-1'}>
              <div />
              <div style={{ width: `${ (timeList.length - 1) / timeList.length * 100 }%` }} className={'relative h-full rounded-full bg-zinc-700 shadow-md shadow-zinc-900'}>
                <div style={{ width: `${ (index) / (timeList.length - 1) * 100 }%` }} className={'h-full rounded-full ' + (hoverIndex > 0 && hoverIndex < index ? 'bg-orange-400/50' : 'bg-orange-400')} />
                {
                  hoverIndex > 0
                  && <div style={{ width: `${ (hoverIndex) / (timeList.length - 1) * 100 }%` }} className={'left-0 -mt-1.5 h-full rounded-full ' + (hoverIndex > 0 && hoverIndex < index ? 'bg-orange-400' : 'bg-orange-400/50')} />
                }
              </div>
              <div className={'flex items-center justify-center'}>
                <button onClick={() => onChange?.(index - 1 >= 0 ? index - 1 : 0)} className={'mx-0.5 flex size-8 items-center justify-center rounded-full bg-zinc-700 shadow-md shadow-zinc-900'}>
                  <ChevronLeft className={'text-zinc-50'} width={'20'} height={'20'} />
                </button>
                <button onClick={() => {setIsPlaying((ip) => !ip);}} className={'mx-0.5 flex size-10 items-center justify-center rounded-full bg-zinc-700 shadow-md shadow-zinc-900'}>
                  {!isPlaying ? (
                    <Play className={'fill-current text-zinc-50'} width={'20'} height={'20'} />
                  ) : (
                    <Pause className={'fill-current text-zinc-50'} width={'20'} height={'20'} />
                  )}
                </button>
                <button onClick={() => onChange?.(index + 1 <= timeList.length - 1 ? index + 1 : index)} className={'mx-0.5 flex size-8 items-center justify-center rounded-full bg-zinc-700 shadow-md shadow-zinc-900'}>
                  <ChevronRight className={'text-zinc-50'} width={'20'} height={'20'} />
                </button>
              </div>
              <div className={'flex size-full rounded-full bg-zinc-700 shadow-md shadow-zinc-900'}>
                {
                  timeList.map((time, index) => {
                    return (
                      <button
                        key={time}
                        onClick={() => onChange?.(index)}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(-1)}
                        style={{ width: `${ 100 / timeList.length }%` }}
                        className={'flex flex-col items-center justify-between text-sm text-zinc-50'}
                      >
                        <div className={'h-3 w-[4px] rounded-full bg-zinc-50'} />
                        <div className={'py-1 text-[13px] font-bold'}>
                          {time}
                        </div>
                      </button>
                    );
                  })
                }
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}