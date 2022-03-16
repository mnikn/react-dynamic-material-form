import { SchemaFieldString, SchemaFieldObject, SchemaFieldArray } from '../../models/schema';
import React, { FC } from 'react';
import { FieldWrapper } from './FieldWrapper';

export default {
  title: 'Field Wrapper',
  component: FieldWrapper,
};

export const Default: FC = () => {
  const schema = new SchemaFieldObject();
  schema.fields.push(
    {
      id: 'id',
      name: 'id',
      data: new SchemaFieldString(),
    },
    {
      id: 'name',
      name: 'name',
      data: new SchemaFieldString(),
    },
    {
      id: 'data',
      name: 'data',
      data: new SchemaFieldArray(new SchemaFieldString()),
    },
  );
  return (
    <FieldWrapper
      schema={schema}
      value={{
        id: '',
        name: '',
        data: [],
      }}
      config={{ i18n: [] }}
    />
  );
};
