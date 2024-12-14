interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean)=> void;
  disabled?: boolean;
  className?: string;
  color?: 'blue' | 'orange';
}

export default function Toggle(props: ToggleProps) {
  const {
    checked = false,
    onChange,
    disabled = false,
    className = '',
    color = 'blue',
  } = props;

  const colorStyle = {
    blue: 'peer-checked:bg-blue',
    orange: 'peer-checked:bg-orange',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label className={'relative inline-flex cursor-pointer items-center'}>
      <input
        type={'checkbox'}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={'peer sr-only'}
      />
      <div className={`
        h-6 w-11 rounded-full bg-gray4
        after:absolute after:start-[2px] after:top-[2px]
        after:size-5 after:rounded-full after:bg-white
        after:transition-all peer-checked:after:translate-x-full
        ${ colorStyle[color] }
        ${ disabled ? 'cursor-not-allowed opacity-50' : '' }
        ${ className }
      `}
      />
    </label>
  );
}