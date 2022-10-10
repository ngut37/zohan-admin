import React, { useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import { suggest, SuggestionFormData } from '@api/address';

import { useDebouncedCallback } from '@hooks/use-debounce-callback';

import { Input, InputProps, Text } from '@atoms';

import { Divider, Flex, InputLeftElement } from '@chakra-ui/react';

import { colors } from '@styles';

import classes from './address-suggestion-input.module.scss';

type Props = InputProps & {
  onInputChange?: () => void;
  onDropdownClick?: (suggestion: SuggestionFormData) => void;
  defaultAddress?: string;
};

export const AddressSuggestionInput = ({
  onDropdownClick,
  onInputChange,
  defaultAddress,
  ...inputProps
}: Props) => {
  const [suggestions, setSuggestions] = useState<SuggestionFormData[]>([]);
  const [open, setOpen] = useState(true);
  const [inputValue, setInputValue] = useState<string>(defaultAddress || '');

  const debouncedSuggestionChange = useDebouncedCallback(
    async (element: any) => {
      const resultAddresses = await suggest(element.target.value);

      setSuggestions(resultAddresses);
    },
    500,
  );

  const onDropdownItemClickHandler = useCallback(
    (suggestion: SuggestionFormData) => {
      onDropdownClick && onDropdownClick(suggestion);
      setInputValue(suggestion.stringAddress);
      setOpen(false);
    },
    [onDropdownClick, setInputValue, setOpen],
  );

  const dropDown = useMemo(() => {
    if (open && suggestions.length) {
      return (
        <Flex
          className={clsx(classes.dropDownWrapper, open && classes.open)}
          direction="column"
          borderBottomRadius="4px"
          overflow="hidden"
          position="absolute"
          top="40px"
          width="100%"
          zIndex={2}
        >
          {suggestions
            .map((suggestion, i) => {
              const { stringAddress, regionString, districtString } =
                suggestion;

              return (
                <Flex
                  className={classes.item}
                  key={i}
                  height="54px"
                  paddingX="10px"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={() => {
                    onDropdownItemClickHandler(suggestion);
                  }}
                >
                  <Text message={{ text: stringAddress }} fontSize="sm" />
                  <Text
                    message={{ text: `${regionString}, ${districtString}` }}
                    fontSize="xs"
                    color="gray.600"
                  />
                </Flex>
              );
            })
            .map((suggestionDiv, i) => (
              <>
                {suggestionDiv}
                {i !== suggestions.length - 1 ? <Divider opacity={1} /> : null}
              </>
            ))}
        </Flex>
      );
    } else {
      return null;
    }
  }, [suggestions, open]);

  const onInputFocus = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const onInputBlur = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const input = useMemo(() => {
    return (
      <Input
        {...inputProps}
        error={inputProps.error}
        inputProps={{
          ...inputProps.inputProps,
          onChange: (e) => {
            setInputValue(e.target.value);
            setSuggestions([]);
            onInputChange && onInputChange();
            debouncedSuggestionChange(e);
          },
          value: inputValue,
          onClick: onInputFocus,
          onFocus: onInputFocus,
          onBlur: onInputBlur,
          borderBottomRadius: open && suggestions.length ? '0px' : '4px',
          autoFocus: true,
          autoComplete: 'off',
        }}
        inputGroupPropsWithChildren={{
          children: (
            <InputLeftElement pointerEvents="none">
              <HiOutlineLocationMarker color={colors.gray_400.hex()} />
            </InputLeftElement>
          ),
        }}
      />
    );
  }, [
    inputProps,
    suggestions,
    setSuggestions,
    onInputChange,
    debouncedSuggestionChange,
    onInputFocus,
    onInputBlur,
  ]);

  return (
    <Flex direction="column" position="relative" transition="2s" width="100%">
      {input}
      {dropDown}
    </Flex>
  );
};
