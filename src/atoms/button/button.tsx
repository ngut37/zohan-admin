import React, { PropsWithChildren, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Message, messageToString } from '@utils/message';

import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

export type ButtonProps = PropsWithChildren<
  ChakraButtonProps & {
    message?: Message;
    ref?: React.Ref<HTMLButtonElement>;
  }
>;

export const Button = ({
  message,
  ref,
  children,
  ...buttonProps
}: ButtonProps) => {
  const intl = useIntl();
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    return message ? messageToString(message, intl) : null;
  }, [intl, message, children]);

  return (
    <ChakraButton colorScheme="teal" ref={ref} {...buttonProps}>
      {content}
    </ChakraButton>
  );
};
