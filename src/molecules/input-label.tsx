import React from 'react';

import { Text, TextProps } from '@atoms';

import { HStack } from '@chakra-ui/react';

type Props = TextProps & { optional?: boolean };

export const InputLabel = ({
  fontSize = 'sm',
  w = '100%',
  optional = false,
  ...restProps
}: Props) => {
  return (
    <HStack w={w}>
      <Text fontSize={fontSize} align="left" color="gray.600" {...restProps} />
      {optional && (
        <Text
          message={{ id: 'input.label.optional' }}
          fontSize="xs"
          color="gray.300"
        />
      )}
    </HStack>
  );
};
