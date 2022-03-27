import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';
import { FieldError } from 'react-hook-form';

import { Message, messageToString } from '@utils/message';

import {
  Radio,
  RadioGroup,
  Stack,
  RadioGroupProps,
  StackProps,
  RadioProps,
  FormControlProps,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';

export type RadioItem = {
  message: Message;
  radioProps?: RadioProps;
};

type Props = {
  stackDirection?: StackProps['direction'];
  formControlProps?: FormControlProps;
  radioGroupProps?: Omit<RadioGroupProps, 'children'>;
  stackProps?: StackProps;
  items?: RadioItem[];
  error?: FieldError;
};

export const RadioSelect = ({
  stackDirection = 'row',
  formControlProps,
  radioGroupProps,
  stackProps,
  items,
  error,
}: Props) => {
  const intl = useIntl();
  const radioItems = useMemo(
    () =>
      items?.map(({ message, radioProps }, i) => (
        <Radio key={i} {...radioProps}>
          {messageToString(message, intl)}
        </Radio>
      )),
    [items, intl],
  );

  if (!items?.length) return null;
  return (
    <FormControl {...formControlProps}>
      <RadioGroup {...radioGroupProps}>
        <Stack {...stackProps} direction={stackDirection}>
          {radioItems}
        </Stack>
      </RadioGroup>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
