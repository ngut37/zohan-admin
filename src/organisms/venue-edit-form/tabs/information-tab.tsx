import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { HiOutlineTrash } from 'react-icons/hi';

import {
  deleteVenueByIdOrFail,
  EditVenueBody,
  editVenueOrFail,
  getVenueByIdOrFail,
} from '@api/venues';
import { SuggestionFormData } from '@api/address';

import { messageIdConcat } from '@utils/message-id-concat';
import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';

import { useApi } from '@hooks/use-api';

import { Text, Button } from '@atoms';

import { InputLabel } from '@molecules/input-label';
import { AddressSuggestionInput } from '@molecules/address-suggestion-input';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Flex,
  HStack,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { colors } from '@styles';

const m = messageIdConcat('venue.edit.information_tab');

type Props = {
  venueId: string;
};

export const InformationTab = ({ venueId }: Props) => {
  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();
  const {
    isOpen: isDisclosureOpen,
    onOpen: onDisclosureOpen,
    onClose: onDisclosureClose,
  } = useDisclosure();

  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  const [suggestion, setSuggestion] = useState<
    SuggestionFormData | undefined
  >();
  const [submitting, setSubmitting] = useState(false);

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
              id: 'venue.edit.toast.success',
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
      } catch (error) {
        console.error(error);
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
      setSuggestion(suggestion);
    },
    [setValue],
  );

  const deleteVenueAlertDialog = useMemo(() => {
    return (
      <AlertDialog
        isCentered
        isOpen={isDisclosureOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={onDisclosureClose}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {messageToString({ id: m('delete_confirmation.title') }, intl)}
            </AlertDialogHeader>

            <AlertDialogBody>
              {messageToString({ id: m('delete_confirmation.subtitle') }, intl)}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelDeleteRef}
                onClick={onDisclosureClose}
                message={{ id: 'button.cancel' }}
                variant="outline"
              />
              <Button
                colorScheme="red"
                onClick={async () => {
                  await deleteVenueByIdOrFail(venueId);
                  onDisclosureClose();

                  router.push('/venues', undefined, { shallow: true });

                  toast({
                    description: messageToString(
                      { id: m('delete_confirmation.toast.success') },
                      intl,
                    ),
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                  });
                }}
                ml={3}
                message={{ id: 'button.confirm_delete' }}
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }, [isDisclosureOpen, onDisclosureClose, intl, venueId]);

  if (!requestComplete) {
    return (
      <Flex width="100%" height="200px" justify="center" align="center">
        <Spinner
          thickness="4px"
          speed="0.85s"
          emptyColor={colors.white.hex()}
          color={colors.teal_500.hex()}
          size="xl"
        />
      </Flex>
    );
  }

  return (
    <>
      {deleteVenueAlertDialog}
      <VStack alignItems="flex-start" spacing="10px" width="450px">
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
        <InputLabel
          message={{ id: m('input.address_region_district.label') }}
          paddingTop="10px"
        />
        <Text
          message={{
            text: suggestion?.regionString || requestResult?.region || '',
          }}
          fontSize="md"
          color="gray.800"
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
          color="gray.700"
        />
        <HStack justifyContent="space-between">
          <Button
            leftIcon={<HiOutlineTrash width="20px" />}
            marginTop="50px !important"
            variant="outline"
            size="lg"
            colorScheme="red"
            message={{ id: 'button.delete' }}
            onClick={onDisclosureOpen}
            isLoading={submitting}
          />
          <Button
            width="150px"
            marginTop="50px !important"
            size="lg"
            message={{ id: 'button.save' }}
            onClick={handleSubmit(onSubmit)}
            isLoading={submitting}
          />
        </HStack>
      </VStack>
    </>
  );
};
