import React, { FC } from 'react';
import { CollapseCard } from './CollapseCard';

export default {
  title: 'Collapse Card',
  component: CollapseCard,
};

export const Default: FC = () => {
  return <CollapseCard title={'Test'}>test</CollapseCard>;
};
