import React, { forwardRef } from 'react';
import { Input } from './Input';
import { Label } from './Label';
import { Div } from './Div';

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
  ({ label, error, containerClassName, ...props }, ref) => {
    return (
      <Div vitri="col_none" className={`w-full gap-1.5 ${containerClassName || ''}`}>
        {label && <Label className="text-sm font-medium text-gray-700">{label}</Label>}
        <Input ref={ref} {...props} className={`w-full ${error ? 'border-red-500 focus-visible:ring-red-500' : ''} ${props.className || ''}`} />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </Div>
    );
  }
);

InputBox.displayName = 'InputBox';
