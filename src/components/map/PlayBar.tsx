import React from 'react';

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
              <div style={{ width: `${ (timeList.length - 1) / timeList.length * 100 }%` }} className={'relative h-full rounded-full bg-slate-900/75 shadow-sm shadow-zinc-300/50'}>
                <div style={{ width: `${ (index) / (timeList.length - 1) * 100 }%` }} className={'h-full rounded-full ' + (hoverIndex > 0 && hoverIndex < index ? 'bg-orange-400/50' : 'bg-orange-400')} />
                {
                  hoverIndex > 0
                  && <div style={{ width: `${ (hoverIndex) / (timeList.length - 1) * 100 }%` }} className={'left-0 -mt-1.5 h-full rounded-full ' + (hoverIndex > 0 && hoverIndex < index ? 'bg-orange-400' : 'bg-orange-400/50')} />
                }
              </div>
              <div className={'flex items-center justify-center'}>
                <button onClick={() => onChange?.(index - 1 >= 0 ? index - 1 : 0)} className={'mx-0.5 flex size-8 items-center justify-center rounded-full bg-slate-900/75 shadow-sm shadow-zinc-300/50'}>
                  <svg className={'size-5 fill-zinc-50'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 320 512'}>
                    <path d={'M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z'} />
                  </svg>
                </button>
                <button onClick={() => {setIsPlaying((ip) => !ip);}} className={'mx-0.5 flex size-10 items-center justify-center rounded-full bg-slate-900/75 shadow-sm shadow-zinc-300/50'}>
                  {!isPlaying ? (
                    <svg className={'size-5 fill-zinc-50'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 384 512'}>
                      <path d={'M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z'} />
                    </svg>
                  ) : (
                    <svg className={'size-5 fill-zinc-50'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 320 512'}>
                      <path d={'M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z'} />
                    </svg>
                  )}
                </button>
                <button onClick={() => onChange?.(index + 1 <= timeList.length - 1 ? index + 1 : index)} className={'mx-0.5 flex size-8 items-center justify-center rounded-full bg-slate-900/75 shadow-sm shadow-zinc-300/50'}>
                  <svg className={'size-5 fill-zinc-50'} xmlns={'http://www.w3.org/2000/svg'} viewBox={'0 0 320 512'}>
                    <path d={'M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z'} />
                  </svg>
                </button>
              </div>
              <div className={'flex size-full rounded-full bg-slate-900/75 shadow-sm shadow-zinc-300/50'}>
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
                        <div className={'py-1 font-bold'}>
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