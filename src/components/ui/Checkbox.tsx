import React from 'react';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean)=> void;
  disabled?: boolean;
  className?: string;
  color?: 'blue' | 'orange';
}

export default function Checkbox(props: CheckboxProps) {
  const {
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
          type={'checkbox'}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={'peer sr-only'}
        />
        <div className={`
          flex size-4 items-center
          justify-center rounded border-2
          border-gray4
          ${ colorStyle[color] }
          ${ disabled ? 'cursor-not-allowed opacity-50' : '' }
          ${ className }
        `}
        >
          {checked && (
            <svg
              className={'size-3 text-white'}
              fill={'none'}
              viewBox={'0 0 24 24'}
              stroke={'currentColor'}
            >
              <path
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
                strokeWidth={3}
                d={'M5 13l4 4L19 7'}
              />
            </svg>
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
