import { SchemaFieldString } from '../../models/schema';
import React, { FC } from 'react';
import { StringField } from './StringField';

export default {
  title: 'StringField',
  component: StringField,
};

export const Default: FC = () => {
  const schema = new SchemaFieldString();
  return <StringField label="Field string" schema={schema} value={'test'} config={{ i18n: [] }} />;
};

export const Multiline: FC = () => {
  const schema = new SchemaFieldString();
  schema.config.type = 'multiline';
  return <StringField label="Field string" schema={schema} value={'test'} config={{ i18n: [] }} />;
};
