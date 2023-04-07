import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { HiArrowSmLeft } from 'react-icons/hi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';

import {
  EditVenueBody,
  editVenueOrFail,
  getVenueByIdOrFail,
} from '@api/venues';
import { SuggestionFormData } from '@api/address';

import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';
import { yup } from '@utils/yup';

import { useApi } from '@hooks/use-api';

import { Button, Text } from '@atoms';

import { InputLabel } from '@molecules/input-label';
import { AddressSuggestionInput } from '@molecules/address-suggestion-input';

import { Flex, VStack, HStack, Image, useToast, Box } from '@chakra-ui/react';

const m = messageIdConcat('venue.edit');

export const VenueEditForm = () => {
  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();

  const [suggestion, setSuggestion] = useState<
    SuggestionFormData | undefined
  >();
  const [submitting, setSubmitting] = useState(false);

  const { id: venueId } = router.query;

  const { requestComplete, fetch, requestResult } = useApi(async () => {
    return await getVenueByIdOrFail(venueId as string);
  });

  useEffect(() => {
    if (venueId) {
      fetch(venueId as string);
    }
  }, [venueId]);

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
  } = useForm<EditVenueBody>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    // set default string address on load
    if (requestResult) {
      setValue('stringAddress', requestResult.stringAddress);
    }
  }, [requestResult]);

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
      setSuggestion(suggestion);
    },
    [setValue],
  );

  const onSubmit: SubmitHandler<EditVenueBody> = useCallback(
    async (data) => {
      setSubmitting(true);

      try {
        if (!venueId) {
          throw new Error('Venue ID is not defined');
        }
        await editVenueOrFail(venueId as string, data);

        toast({
          description: messageToString(
            {
              id: m('toast.success'),
              values: {
                address: `${data.districtString}, ${data.stringAddress}`,
              },
            },
            intl,
          ),
          status: 'info',
          duration: 10000,
          isClosable: true,
        });
      } catch (e) {
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

  if (!requestComplete) {
    return <div>Loading...</div>;
  }

  return (
    <VStack w="100%" justifyContent="center" my="70px">
      <HStack
        w="100%"
        px="50px"
        maxWidth="1200px"
        justifyContent="center"
        spacing="20px"
        alignItems="flex-start"
      >
        <Flex w="30%" h="300px" direction="column" justifyContent="flex-start">
          <Button
            leftIcon={<HiArrowSmLeft width="20px" />}
            message={{ id: m('button.back') }}
            mb="20px"
            width="30px"
            variant="link"
            onClick={() => router.back()}
          />
          <Flex>
            <Image
              width="100%"
              objectFit="cover"
              src="https://www.businessanimals.cz/wp-content/uploads/2017/05/fff.jpg"
              alt="placeholder"
            />
          </Flex>
        </Flex>
        <VStack w="70%" h="600px" paddingLeft="20px" alignItems="flex-start">
          <VStack
            alignItems="flex-start"
            spacing="10px"
            paddingTop="37px"
            width="450px"
          >
            <InputLabel message={{ id: m('input.address.label') }} />
            <AddressSuggestionInput
              defaultAddress={requestResult?.stringAddress}
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
            <Text
              message={{
                text: suggestion?.regionString || requestResult?.region || '',
              }}
              fontSize="md"
              color="gray.600"
            />
            <Text
              marginTop="0px !important"
              message={{
                text:
                  suggestion?.quarterString ||
                  suggestion?.districtString ||
                  requestResult?.momc ||
                  requestResult?.district ||
                  '',
              }}
              fontSize="sm"
              color="gray.500"
            />
          </VStack>
          <Box marginTop="50px"></Box>
        </VStack>
      </HStack>
      <Button
        marginTop="60px"
        width="200px"
        size="lg"
        message={{ id: m('button.submit') }}
        onClick={handleSubmit(onSubmit)}
        isLoading={submitting}
      />
    </VStack>
  );
};
