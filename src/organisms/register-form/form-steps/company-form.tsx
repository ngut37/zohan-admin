import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { CompanyFormData } from '@api/company';

import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { Button, Input, Text } from '@atoms';

import { AddressSuggestionInput } from '@molecules/address-suggestion-input';
import { InputLabel } from '@molecules/input-label';

import { Divider, VStack } from '@chakra-ui/react';

import { useCompanyFormHook } from './hooks/company-form-hook';

const m = messageIdConcat('register.company');

type Props = {
  defaultData?: CompanyFormData;
  onBackButtonClick?: () => void;
};

export const CompanyForm = ({ defaultData, onBackButtonClick }: Props) => {
  const intl = useIntl();

  const {
    register,
    handleSubmit,
    errors,
    onAddressInputChangeHandler,
    onAddressDropdownItemClickHandler,
    submitting,
  } = useCompanyFormHook({ defaultData });

  const onBackButtonClickHandler = useCallback(() => {
    onBackButtonClick && onBackButtonClick();
  }, [onBackButtonClick]);

  return (
    <>
      <VStack mb="40px" spacing="5px">
        <Text type="heading" message={{ id: m('heading') }} size="lg" />
        <Text type="text" message={{ id: m('sub_heading') }} fontSize="sm" />
      </VStack>
      <VStack direction="column" justify="center" align="center" width="100%">
        <form onSubmit={handleSubmit()}>
          <VStack spacing={6}>
            {/* ICO */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.ico.label') }} />
              <Input
                inputProps={{
                  id: 'name',
                  placeholder: messageToString(
                    { id: m('input.ico.placeholder') },
                    intl,
                  ),
                  variant: 'flushed',
                  isDisabled: true,
                  cursor: 'not-allowed',
                  textColor: 'gray',
                  ...register('ico'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.ico),
                }}
                error={errors?.ico}
              />
            </VStack>

            {/* NAME */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.name.label') }} />
              <Input
                inputProps={{
                  id: 'name',
                  placeholder: messageToString(
                    { id: m('input.name.placeholder') },
                    intl,
                  ),
                  variant: 'flushed',
                  ...register('name'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.name),
                }}
                error={errors?.name}
              />
            </VStack>
            <VStack spacing="5px" width="100%">
              {/* ADDRESS */}
              <InputLabel message={{ id: m('input.address.label') }} />
              <AddressSuggestionInput
                inputProps={{
                  id: 'address',
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.stringAddress),
                }}
                defaultAddress={defaultData?.stringAddress}
                error={errors.stringAddress}
                onDropdownClick={onAddressDropdownItemClickHandler}
                onInputChange={onAddressInputChangeHandler}
              />
            </VStack>

            {/* STAFF NAME */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.staff_name.label') }} />
              <Input
                inputProps={{
                  id: 'staffName',
                  placeholder: messageToString(
                    { id: m('input.staff_name.placeholder') },
                    intl,
                  ),
                  ...register('staffName'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.staffName),
                }}
                error={errors?.staffName}
              />
            </VStack>

            {/* EMAIL */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.email.label') }} />
              <Input
                inputProps={{
                  id: 'email',
                  autoComplete: 'email',
                  placeholder: messageToString(
                    { id: m('input.email.placeholder') },
                    intl,
                  ),
                  ...register('email'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.email),
                }}
                error={errors?.email}
              />
            </VStack>

            {/* PASSWORD */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.password.label') }} />
              <Input
                inputProps={{
                  id: 'password',
                  type: 'password',
                  placeholder: messageToString(
                    { id: m('input.password.placeholder') },
                    intl,
                  ),
                  ...register('password'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.password),
                }}
                error={errors?.password}
              />
              <Input
                inputProps={{
                  id: 'passwordConfirm',
                  type: 'password',
                  placeholder: messageToString(
                    { id: m('input.password_confirm.placeholder') },
                    intl,
                  ),
                  ...register('passwordConfirm'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.passwordConfirm),
                }}
                error={errors?.passwordConfirm}
              />
            </VStack>

            <Button
              size="lg"
              type="submit"
              width="100%"
              message={{ id: m('button.submit') }}
              isLoading={submitting}
            />
          </VStack>
        </form>
      </VStack>
      {onBackButtonClick && (
        <>
          <Divider orientation="horizontal" my="10px" />
          <Button
            variant="link"
            onClick={onBackButtonClickHandler}
            message={{ id: m('button.back') }}
          />
        </>
      )}
    </>
  );
};
