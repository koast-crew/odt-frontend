import React from 'react';
import Checkbox from '@/components/ui/Checkbox';

function Main2DMap() {
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const options = [
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3', disabled: true },
  ];

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedValues((prev) => [...prev, value]);
    } else {
      setSelectedValues((prev) => prev.filter((v) => v !== value));
    }
  };

  return (
    <div className={'flex size-full flex-col p-4'}>
      {'체크박스 컴포넌트 SelectedValue: \r'}{selectedValues.join(', ')}
      <div className={'flex flex-col gap-2'}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selectedValues.includes(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
            disabled={option.disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default Main2DMap;