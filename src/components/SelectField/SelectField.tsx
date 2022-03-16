import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { SchemaFieldSelect } from '../../models/schema';

export const SelectField = ({
  label,
  schema,
  value,
  onValueChange,
}: {
  label?: string;
  schema: SchemaFieldSelect;
  value: string;
  onValueChange?: (value: boolean) => void;
}) => {
  const [fieldValue, setFieldValue] = useState(value);
  const onChange = (e: any) => {
    setFieldValue(e.target.value);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={fieldValue}
        label={label || ''}
        onChange={onChange}
        size="small"
      >
        {schema.config.options.map((item: any, i) => {
          return (
            <MenuItem key={i} value={typeof item === 'object' ? item.value : item}>
              {typeof item === 'object' ? item.name : item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectField;
