import React, { useCallback, useMemo } from 'react';

import { useState } from 'react';

// import { Suggestion } from '@api/smap/types';

import { Input, InputProps } from '@atoms';

type Props = InputProps;

export const AddressSuggestionInput = (inputProps: Props) => {
  // const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestions, _setSuggestions] = useState<{ ruianAddressId: number }[]>(
    [{ ruianAddressId: 1 }, { ruianAddressId: 2 }, { ruianAddressId: 3 }],
  );
  const [open, setOpen] = useState(false);

  const dropDown = useMemo(() => {
    if (!suggestions.length || !open) return null;

    return (
      <>
        {suggestions.map((suggestion, i) => {
          return <div key={i}>{suggestion.ruianAddressId}</div>;
        })}
      </>
    );
  }, [suggestions, open]);

  const onInputChange = useCallback(() => {
    setOpen(true);
  }, []);

  const onInputBlur = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Input
        {...inputProps}
        inputProps={{ onChange: onInputChange, onBlur: onInputBlur }}
      />
      {dropDown}
    </>
  );
};
