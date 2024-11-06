import { Controller, FieldValues } from 'react-hook-form';
import { TextFieldProps } from '..';
import { Autocomplete as MUIAutocomplete, Box, TextField } from '@mui/material';

export const Autocomplete = <T extends FieldValues>(props: TextFieldProps<T>) => {
  const { id, label, control, error, options = [], ...innerProps } = props;

  return (
    <>
      <Controller
        name={innerProps.name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <MUIAutocomplete
            id={id}
            size="small"
            value={value?.value}
            options={options}
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => onChange(newValue.value)}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;

              return (
                <Box key={key} component="li" {...optionProps}>
                  {option.label}
                </Box>
              );
            }}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label={label}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />
        )}
      />
      {error?.message && <p className="text-error text-sm">{error.message}</p>}
    </>
  );
};
