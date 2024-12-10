import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  text: string;
  label?: string;
}

interface DropdownProps {
  id?: string;
  options: DropdownOption[];
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>)=> void;
  className?: string;
}

const Dropdown = ({ id, options, value, onChange, className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={'relative w-full'}>
      <select
        id={id}
        onChange={onChange}
        value={value}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
        className={`min-h-8 w-full appearance-none rounded-md border border-gray4 px-2 text-[13px] focus:outline-blue ${ className }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label || option.text}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 transition-transform duration-300
          ${ isOpen ? 'rotate-180' : '' }`}
      />
    </div>
  );
};

export default Dropdown;
