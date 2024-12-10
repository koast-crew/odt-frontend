import dayjs from 'dayjs';

interface DateInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>)=> void;
  className?: string;
}

function DateInput({ id, value, onChange, className = '' }: DateInputProps) {
  return (
    <>
      <input
        id={id}
        value={dayjs(value).format('YYYY-MM-DD')}
        onChange={onChange}
        type={'date'}
        className={`h-8 w-full appearance-none rounded-md border border-gray4 pl-2 pr-1.5 text-[13px] ${ className }`}
      />
    </>
  );
}

export default DateInput;
