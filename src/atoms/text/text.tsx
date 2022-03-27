import React from 'react';

import { useIntl } from 'react-intl';

import { enumerate } from '@utils/enumerate';
import { Message, messageToString } from '@utils/message';

import {
  Heading as ChakraHeading,
  Text as ChakraText,
  TextProps as ChakraTextProps,
} from '@chakra-ui/react';

// ELEMENTS
export const textTypes = enumerate('heading', 'text');
export type TextType = keyof typeof textTypes;

type TextBaseProps = {
  type?: TextType;
  message: Message;
};

export type TextProps = TextBaseProps & ChakraTextProps;

export const Text = ({ type = 'text', message, ...textProps }: TextProps) => {
  const intl = useIntl();

  const content = messageToString(message, intl);

  if (type === 'heading')
    return <ChakraHeading {...textProps}>{content}</ChakraHeading>;
  else return <ChakraText {...textProps}>{content}</ChakraText>;
};
