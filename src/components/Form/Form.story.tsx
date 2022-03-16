import { SchemaFieldObject, SchemaFieldString, SchemaFieldArray } from '../../models/schema';
import React, { FC } from 'react';
import { Form } from './Form';

export default {
  title: 'Form',
  component: Form,
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
    <Form
      schemaConfig={{
        i18n: [],
        summary: '{{$$__index}} {{name}}',
        schema: schema,
      }}
      value={[]}
    />
  );
};
