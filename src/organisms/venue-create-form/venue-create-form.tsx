import React, { useCallback, useState } from 'react';

import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { HiArrowSmLeft, HiPlus } from 'react-icons/hi';
import { yupResolver } from '@hookform/resolvers/yup';

import { createVenueOrFail, CreateVenueBody } from '@api/venues';
import { SuggestionFormData } from '@api/address';

import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { Button, Card, Text } from '@atoms';

import { AddressSuggestionInput } from '@molecules/address-suggestion-input';
import { InputLabel } from '@molecules/input-label';

import { FormControl, Divider, Flex, useToast, VStack } from '@chakra-ui/react';

const m = messageIdConcat('venue.create');

export const VenueCreateForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();

  const schema = yup.object().shape({
    stringAddress: yup
      .string()
      .required(messageToString({ id: m('input.address.required') }, intl)),
    regionString: yup.string().required(),
    districtString: yup.string().required(),
    quarterString: yup.string(),
    coordinates: yup.array(yup.number()).length(2),
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateVenueBody>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateVenueBody> = useCallback(
    async (data) => {
      setSubmitting(true);

      try {
        const createdVenue = await createVenueOrFail(data);

        router.push(`/venues/${createdVenue._id}`, undefined, {
          shallow: true,
        });

        toast({
          description: messageToString(
            {
              id: m('toast.success'),
              values: { address: data.stringAddress },
            },
            intl,
          ),
          status: 'info',
          duration: 10000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          description: messageToString({ id: 'error.api' }, intl),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [intl, toast],
  );

  const onAddressInputChangeHandler = useCallback(() => {
    setValue('stringAddress', '');
    setValue('regionString', '');
    setValue('districtString', '');
    setValue('quarterString', undefined);
    setValue('coordinates', [0, 0]);
  }, [setValue]);

  const onAddressDropdownItemClickHandler = useCallback(
    (suggestion: SuggestionFormData) => {
      const {
        stringAddress,
        regionString,
        districtString,
        quarterString,
        coordinates,
      } = suggestion;
      setValue('stringAddress', stringAddress);
      setValue('regionString', regionString);
      setValue('districtString', districtString);
      setValue('quarterString', quarterString);
      setValue('coordinates', coordinates);
    },
    [setValue],
  );

  return (
    <Flex
      my="40px"
      px="10px"
      width="100%"
      minH="80vh"
      flexDirection="column"
      justify="center"
      align="center"
    >
      <Card padding="40px">
        <VStack mb="40px" spacing="5px">
          <Text type="heading" message={{ id: m('heading') }} size="lg" />
          <Text type="text" message={{ id: m('sub_heading') }} fontSize="sm" />
        </VStack>
        <FormControl width="400px">
          <InputLabel message={{ id: m('input.ico.label') }} />
          <AddressSuggestionInput
            inputProps={{
              id: 'address',
              autoComplete: 'off',
            }}
            formControlProps={{
              isInvalid: Boolean(errors.stringAddress),
            }}
            error={errors.stringAddress}
            onDropdownClick={onAddressDropdownItemClickHandler}
            onInputChange={onAddressInputChangeHandler}
          />
          <Button
            leftIcon={<HiPlus />}
            size="lg"
            type="submit"
            marginTop="20px"
            width="100%"
            message={{ id: m('button.submit') }}
            isLoading={submitting}
            onClick={handleSubmit(onSubmit)}
          />
        </FormControl>
        <Divider orientation="horizontal" my="10px" />
        <Button
          leftIcon={<HiArrowSmLeft width="20px" />}
          variant="link"
          onClick={() => router.push('/venues', undefined, { shallow: true })}
          message={{ id: m('button.back') }}
        />
      </Card>
    </Flex>
  );
};
