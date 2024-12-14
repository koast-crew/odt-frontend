import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'orange';
  className?: string;
}

export default function Button(props: ButtonProps) {
  const {
    isSelected = false,
    fullWidth = false,
    fullHeight = false,
    size = 'md',
    color = 'blue',
    className = '',
    children,
  } = props;

  const sizeStyle = {
    sm: 'h-6 text-[13px]',
    md: 'h-8 text-[14px]',
    lg: 'h-10 text-[15px]',
  };

  const colorStyle = {
    blue: 'bg-blue',
    orange: 'bg-orange',
  };

  const baseStyle = 'rounded-md flex items-center justify-center';
  const widthStyle = fullWidth ? 'w-full' : '';
  const heightStyle = fullHeight ? 'h-full' : '';
  const variantStyle = isSelected
    ? `${ colorStyle[color] } text-light`
    : 'bg-gray2 text-dark';

  return (
    <button
      className={`${ baseStyle } ${ sizeStyle[size] } ${ widthStyle } ${ heightStyle } ${ variantStyle } ${ className }`}
      {...props}
    >
      {children}
    </button>
  );
}