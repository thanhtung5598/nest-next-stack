import { Controller } from 'react-hook-form';
import { Textarea as TextareaJoy } from '@mui/joy';

export const TextArea = (props: any) => {
  const { id, label, control, error, ...innerProps } = props;

  return (
    <>
      <Controller
        name={innerProps.name}
        control={control}
        render={({ field }) => (
          <TextareaJoy
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
