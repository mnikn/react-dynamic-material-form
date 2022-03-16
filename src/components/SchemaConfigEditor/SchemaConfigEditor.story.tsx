import React, { FC } from 'react';
import { SchemaConfigEditor } from './SchemaConfigEditor';

export default {
  title: 'Schema Config Editor',
  component: SchemaConfigEditor,
};

export const Default: FC = () => {
  return <SchemaConfigEditor width={'500px'} height={'700px'} />;
};
