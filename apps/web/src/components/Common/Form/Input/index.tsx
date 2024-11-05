import { Controller, FieldValues } from 'react-hook-form';
import { TextFieldProps } from '..';
import { TextField } from '@mui/material';

export const Input = <T extends FieldValues>(props: TextFieldProps<T>) => {
  const { id, label, control, error, ...innerProps } = props;

  return (
    <>
      <Controller
        name={innerProps.name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            {...innerProps}
            fullWidth
            size="small"
            margin="normal"
            id={id}
            label={label}
            error={!!error}
            value={field.value}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        )}
      />
      {error?.message && <p className="text-error text-sm">{error.message}</p>}
    </>
  );
};
