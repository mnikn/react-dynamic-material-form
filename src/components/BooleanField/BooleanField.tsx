import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useState } from 'react';
import { SchemaFieldBoolean } from '../../models/schema';

export const BooleanField = ({
  label,
  schema,
  value,
  onValueChange,
}: {
  label?: string;
  schema: SchemaFieldBoolean;
  value: boolean;
  onValueChange?: (value: boolean) => void;
}) => {
  const [fieldValue, setFieldValue] = useState(value);
  const onChange = (e: any) => {
    setFieldValue(e.target.checked);
    if (onValueChange) {
      onValueChange(e.target.checked);
    }
    console.log(schema);
  };
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={fieldValue} value={fieldValue} />}
        label={label || ''}
        onChange={onChange}
      />
    </FormGroup>
  );
};
