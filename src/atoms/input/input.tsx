import React, { PropsWithChildren } from 'react';

import { FieldError } from 'react-hook-form';
import { MdInfo } from 'react-icons/md';

import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  InputGroup,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputGroupProps,
  Box,
} from '@chakra-ui/react';

import { colors } from '@styles';

export type InputProps = {
  inputProps: ChakraInputProps;
  formControlProps?: FormControlProps;
  inputGroupPropsWithChildren?: PropsWithChildren<InputGroupProps>;
  error?: FieldError;
};

export const Input = React.forwardRef(
  ({
    inputProps,
    inputGroupPropsWithChildren,
    formControlProps,
    error,
  }: InputProps) => {
    const inputGroupChildren = inputGroupPropsWithChildren?.children;
    return (
      <FormControl {...formControlProps} width="100%">
        <InputGroup {...inputGroupPropsWithChildren} width="100%">
          {inputGroupChildren}
          <ChakraInput
            focusBorderColor={colors.teal_500.hex()}
            bg={colors.white.hex()}
            {...inputProps}
            width="100%"
          />
        </InputGroup>
        {error && (
          <FormErrorMessage overflowWrap="anywhere">
            <Box marginRight="5px">
              <MdInfo fontSize="17px" />
            </Box>
            {error.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  },
);
