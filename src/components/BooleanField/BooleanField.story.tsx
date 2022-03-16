import { SchemaFieldBoolean } from '../../models/schema';
import React, { FC } from 'react';
import { BooleanField } from './BooleanField';

export default {
  title: 'BooleanField',
  component: BooleanField,
};

export const Default: FC = () => {
  const schema = new SchemaFieldBoolean();
  return <BooleanField label="Field boolean" schema={schema} value={false} />;
};
