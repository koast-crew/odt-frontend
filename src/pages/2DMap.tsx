import React from 'react';
import Checkbox from '@/components/ui/Checkbox';
import Radio from '@/components/ui/Radio';
import Toggle from '@/components/ui/Toggle';

function Main2DMap() {
  const [selectedCheckbox, setSelectedCheckbox] = React.useState<string[]>([]);
  const [selectedRadio, setSelectedRadio] = React.useState<string>('');
  const [isEnabled, setIsEnabled] = React.useState(false);

  const checkboxOptions = [
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3', disabled: true },
    { value: 'option4', label: '옵션 4' },
  ];

  const radioOptions = [
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3' },
  ];

  const handleRadioChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedRadio(value);
    }
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedCheckbox((prev) => [...prev, value]);
    } else {
      setSelectedCheckbox((prev) => prev.filter((v) => v !== value));
    }
  };

  return (
    <div className={'flex size-full flex-col p-4'}>
      {'체크박스 컴포넌트 선택된 값: \r'}{selectedCheckbox.join(', ')}
      <div className={'flex flex-col gap-2'}>
        {checkboxOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selectedCheckbox.includes(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
            disabled={option.disabled}
          />
        ))}
      </div>
      <div className={'mt-10 flex flex-col gap-2'}>
        {'라디오 컴포넌트 선택된 값: '}{selectedRadio}
        {radioOptions.map((option) => (
          <Radio
            key={option.value}
            name={'radio-group'}
            value={option.value}
            label={option.label}
            checked={selectedRadio === option.value}
            color={'orange'}
            onChange={(checked) => handleRadioChange(option.value, checked)}
          />
        ))}
      </div>
      <div className={'mt-10 flex flex-col gap-2'}>
        <Toggle
          checked={isEnabled}
          onChange={setIsEnabled}
          color={'orange'}
        />
      </div>
    </div>
  );
}

export default Main2DMap;
