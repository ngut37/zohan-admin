import React from 'react';

import { Text, TextProps } from '@atoms';

type Props = TextProps;

export const InputLabel = ({
  fontSize = 'sm',
  w = '100%',
  ...restProps
}: Props) => {
  return <Text fontSize={fontSize} w={w} {...restProps} />;
};
