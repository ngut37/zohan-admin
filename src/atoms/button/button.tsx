import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Message, messageToString } from '@utils/message';

import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

export type ButtonProps = ChakraButtonProps & {
  message: Message;
  ref?: React.Ref<HTMLButtonElement>;
};

export const Button = ({ message, ref, ...buttonProps }: ButtonProps) => {
  const intl = useIntl();
  const content = useMemo(
    () => messageToString(message, intl),
    [intl, message],
  );

  return (
    <ChakraButton colorScheme="teal" ref={ref} {...buttonProps}>
      {content}
    </ChakraButton>
  );
};
