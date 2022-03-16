import { SchemaFieldNumber } from '../../models/schema';
import React, { FC } from 'react';
import { NumberField } from './NumberField';

export default {
  title: 'NumberField',
  component: NumberField,
};

export const Interger: FC = () => {
  const schema = new SchemaFieldNumber();
  schema.config.type = 'int';
  return <NumberField label="Field number" schema={schema} value={2} />;
};

export const Float: FC = () => {
  const schema = new SchemaFieldNumber();
  schema.config.type = 'float';
  return <NumberField label="Field number" schema={schema} value={2} />;
};
