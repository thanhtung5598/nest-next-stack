import { type ReactNode } from 'react';
import { Control, FieldError, FieldValues, Path } from 'react-hook-form';
import { Input } from './Input';
import { Autocomplete } from './Autocomplete';

type Form = {
  children: ReactNode;
  onSubmit: () => void;
  className?: string;
};

type Option = {
  value: string | number;
  label: string;
};

type FieldProps<T extends FieldValues> = {
  id: string;
  control: Control<T>;
  name: Path<T>;
  label?: string;
  type?: string;
  options?: Option[];
  placeholder?: string;
  className?: string;
  error?: FieldError;
};

export type TextFieldProps<T extends FieldValues> = FieldProps<T>;

const Form = ({ children, onSubmit, ...props }: Form) => {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
};

Form.Input = Input;

Form.Autocomplete = Autocomplete;

export default Form;
