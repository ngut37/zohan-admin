import React from 'react';

import { BoxProps, Flex } from '@chakra-ui/react';

import { colors } from '@styles';

type Props = BoxProps;

export const Card = ({
  children,
  padding = '40px',
  flexDirection = 'column',
  justifyContent = 'center',
  alignItems = 'center',
  bgColor = colors.white.hex(),
  boxShadow = 'md',
  border = '1px',
  borderColor = 'gray.100',
  borderRadius = 'md',
  ...restProps
}: Props) => {
  return (
    <Flex
      padding={padding}
      flexDirection={flexDirection}
      justify={justifyContent}
      align={alignItems}
      bgColor={bgColor}
      boxShadow={boxShadow}
      border={border}
      borderColor={borderColor}
      borderRadius={borderRadius}
      {...restProps}
    >
      {children}
    </Flex>
  );
};
