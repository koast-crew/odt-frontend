export interface TableProps {
  leftHeader?: Array<Array<string | number> | undefined>
  tableContent?: Array<Array<Array<string | number> | undefined> | undefined>
  isFirstRowHeader?: boolean
}

export default function Table(props: TableProps) {
  const {
    leftHeader,
    tableContent,
    isFirstRowHeader = false,
  } = props;
  const cols = tableContent?.[0]?.length ?? 0;
  const table = tableContent?.map((tc, index) => {
    const contents = tc?.map((item) => {
      return { text: item, type: (isFirstRowHeader && index === 0) ? 'header' : 'content' };
    }) ?? [];
    if (leftHeader) {
      return [
        { text: leftHeader?.[index], type: 'header' },
        ...contents,
      ];
    } else {
      return contents;
    }
  }).flat();

  const headerStyle = 'flex size-full items-center justify-center bg-zinc-100 py-[3px] font-bold text-[13px] flex-col';
  const contentStyle = 'flex size-full items-center justify-center bg-white py-[3px] text-[13px] flex-col';

  return (
    <div style={{ gridTemplateColumns: `75px repeat(${ cols }, 1fr)` }} className={'grid place-items-center gap-px border-y border-zinc-300 bg-zinc-300 text-[14px]'}>
      {
        table?.map((t, index) => {
          return <div key={index} className={t.type === 'header' ? headerStyle : contentStyle}>{t.text?.map((t, i) => <div key={i}>{t}</div>)}</div>;
        })
      }
    </div>
  );
}