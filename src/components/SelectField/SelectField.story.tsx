import { SchemaFieldSelect } from '../../models/schema';
import React, { FC } from 'react';
import { SelectField } from './SelectField';

export default {
  title: 'SelectField',
  component: SelectField,
};

export const Default: FC = () => {
  const schema = new SchemaFieldSelect();
  schema.config.options = [
    {
      value: 'test1',
      name: 'Test1',
    },
    {
      value: 'test2',
      name: 'Test2',
    },
  ] as any;
  return <SelectField label="Field boolean" schema={schema} value={'test1'} />;
};
