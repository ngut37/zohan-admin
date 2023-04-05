import React, { PropsWithChildren } from 'react';

import { Tooltip as ChakraTooltip, TooltipProps } from '@chakra-ui/react';

type Props = PropsWithChildren<TooltipProps>;

export const Tooltip = ({ children, ...tooltipProps }: Props) => {
  return (
    <ChakraTooltip backgroundColor="gray.500" {...tooltipProps}>
      {children}
    </ChakraTooltip>
  );
};
