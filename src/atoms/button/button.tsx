import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Message, messageToString } from '@utils/message';

import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

export type ButtonProps = ChakraButtonProps & {
  message: Message;
};

export const Button = ({ message, ...buttonProps }: ButtonProps) => {
  const intl = useIntl();
  const content = useMemo(
    () => messageToString(message, intl),
    [intl, message],
  );

  return (
    <ChakraButton colorScheme="teal" {...buttonProps}>
      {content}
    </ChakraButton>
  );
};
