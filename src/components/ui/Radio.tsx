interface RadioProps {
  name: string;
  value: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean)=> void;
  disabled?: boolean;
  className?: string;
  color?: 'blue' | 'orange';
}

export default function Radio(props: RadioProps) {
  const {
    name,
    value,
    label,
    checked = false,
    onChange,
    disabled = false,
    className = '',
    color = 'blue',
  } = props;

  const colorStyle = {
    blue: 'peer-checked:border-blue peer-checked:bg-blue',
    orange: 'peer-checked:border-orange peer-checked:bg-orange',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label className={'flex cursor-pointer items-center gap-2'}>
      <div className={'relative'}>
        <input
          type={'radio'}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={'peer sr-only'}
        />
        <div className={`
          flex size-4 items-center justify-center 
          rounded-full border-2 border-gray4
          ${ colorStyle[color] }
          ${ disabled ? 'cursor-not-allowed opacity-50' : '' }
          ${ className }
        `}
        >
          {checked && (
            <div className={'size-2 rounded-full bg-white'} />
          )}
        </div>
      </div>
      {label && (
        <span className={`text-sm text-dark ${ disabled ? 'opacity-50' : '' }`}>
          {label}
        </span>
      )}
    </label>
  );
}
