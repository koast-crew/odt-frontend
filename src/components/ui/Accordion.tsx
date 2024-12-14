import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemType {
  id: string;
  label: string;
  children?: AccordionItemType[];
}

interface AccordionProps {
  items: AccordionItemType[];
  className?: string;
  color?: 'blue' | 'orange';
  onSelect?: (id: string)=> void;
  selectedId?: string;
}

interface AccordionItemProps extends AccordionItemType {
  depth?: number;
  color?: 'blue' | 'orange';
  selectedId?: string;
  onSelect?: (id: string)=> void;
}

function AccordionItem(props: AccordionItemProps) {
  const {
    id,
    label,
    children,
    depth = 0,
    color = 'blue',
    selectedId,
    onSelect,
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = children && children.length > 0;
  const isSelected = selectedId === id;

  const colorStyle = {
    blue: {
      hover: 'hover:bg-blue hover:bg-opacity-10 hover:text-light',
      selected: 'bg-blue bg-opacity-20 text-light',
    },
    orange: {
      hover: 'hover:bg-orange hover:bg-opacity-10 hover:text-light',
      selected: 'bg-orange bg-opacity-20 text-light',
    },
  };

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            onSelect?.(id);
          }
        }}
        className={`
          flex w-full items-center justify-between
          rounded-md px-4 py-2 text-left text-sm
          ${ hasChildren ? 'cursor-pointer' : 'cursor-pointer' }
          ${ colorStyle[color].hover }
          ${ isSelected ? colorStyle[color].selected : '' }
        `}
        style={{ paddingLeft: `${ depth * 1 + 1 }rem` }}
      >
        <span>{label}</span>
        {hasChildren && (
          <ChevronDown
            className={`size-4 transition-transform ${ isOpen ? 'rotate-180' : '' }`}
          />
        )}
      </button>
      {isOpen && hasChildren && (
        <div className={'overflow-hidden'}>
          {children.map((item) => (
            <AccordionItem
              key={item.id}
              {...item}
              depth={depth + 1}
              color={color}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Accordion(props: AccordionProps) {
  const {
    items,
    className = '',
    color = 'blue',
    onSelect,
    selectedId,
  } = props;

  return (
    <div className={`rounded-lg border border-gray4 p-2 ${ className }`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          {...item}
          color={color}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}