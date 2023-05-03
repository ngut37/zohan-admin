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
import { MdInfo } from 'react-icons/md';
import { setHours } from 'date-fns';

import {
  BusinessHoursInterval,
  Day,
  DAYS,
  WeeklyBusinessHours,
} from '@api/types';
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
import { TimeOnlyInput } from '@molecules/time-only-input';
import { CollapsibleCheckbox } from '@molecules/collapsible-checkbox';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Divider,
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

const now = new Date();

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
  const businessHoursErrorMessageRef = useRef<HTMLDivElement>(null);

  const [suggestion, setSuggestion] = useState<
    SuggestionFormData | undefined
  >();
  const [submitting, setSubmitting] = useState(false);
  const [weeklyBusinessHours, setWeeklyBusinessHours] =
    useState<WeeklyBusinessHours>({});

  const { requestComplete, fetch, requestResult } = useApi(async () => {
    return await getVenueByIdOrFail(venueId as string);
  });

  useEffect(() => {
    if (venueId) {
      fetch(venueId as string);
    }
  }, [venueId]);

  const businessHoursSchema = yup
    .object()
    .nullable(true)
    .test(
      'defined-business-hours',
      'Opening and closing times are required',
      function (value) {
        if (!value) {
          // Return true if the value is null, undefined or empty
          return true;
        }

        const openingTimeSchema = yup.object({
          hour: yup.number().integer().max(23).required(),
          minute: yup.number().integer().max(59).required(),
        });

        const closingTimeSchema = yup.object({
          hour: yup.number().integer().max(23).required(),
          minute: yup.number().integer().max(59).required(),
        });

        const schema = yup.object({
          openingTime: openingTimeSchema.required(),
          closingTime: closingTimeSchema
            .required()
            .test(
              'is-after-opening-time',
              'Closing time must be after opening time',
              function (closingTime) {
                const { openingTime } = this.parent;
                if (!openingTime || !closingTime) {
                  // Return true if the values are null, undefined or empty
                  return true;
                }
                const openingTimeDate = new Date(
                  0,
                  0,
                  0,
                  openingTime.hour,
                  openingTime.minute,
                );
                const closingTimeDate = new Date(
                  0,
                  0,
                  0,
                  closingTime.hour,
                  closingTime.minute,
                );
                return closingTimeDate > openingTimeDate;
              },
            ),
        });

        try {
          schema.validateSync(value);
          return true;
        } catch (err) {
          return false;
        }
      },
    );

  const schema = yup.object().shape({
    stringAddress: yup
      .string()
      .required(messageToString({ id: m('input.address.required') }, intl)),
    regionString: yup.string().required(),
    districtString: yup.string().required(),
    quarterString: yup.string(),
    coordinates: yup.array(yup.number()).length(2),
    businessHours: yup.object().shape({
      [DAYS.mon]: businessHoursSchema,
      [DAYS.tue]: businessHoursSchema,
      [DAYS.wed]: businessHoursSchema,
      [DAYS.thu]: businessHoursSchema,
      [DAYS.fri]: businessHoursSchema,
      [DAYS.sat]: businessHoursSchema,
      [DAYS.sun]: businessHoursSchema,
    }),
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<EditVenueBody>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (Object.keys(errors.businessHours ?? {}).length) {
      businessHoursErrorMessageRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [errors.businessHours]);

  // set default string address and business hours on venue fetched
  useEffect(() => {
    if (requestResult) {
      setValue('stringAddress', requestResult.stringAddress);
      setValue('regionString', requestResult.region);
      setValue('districtString', requestResult.district);
      setValue('quarterString', requestResult.momc);
      setValue('coordinates', requestResult.coordinates);

      setValue('businessHours', requestResult.businessHours);
      setWeeklyBusinessHours(requestResult.businessHours);
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
    [intl, toast, venueId],
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

  const businessHoursForm = useMemo(() => {
    return (
      <VStack spacing="20px" alignItems="flex-start">
        {Object.keys(DAYS).map((day, i) => {
          const openingTime = weeklyBusinessHours[day as Day]?.openingTime;
          const closingTime = weeklyBusinessHours[day as Day]?.closingTime;

          const openingTimeDate = openingTime
            ? new Date(
                setHours(now, openingTime.hour).setMinutes(openingTime.minute),
              )
            : undefined;
          const closingTimeDate = closingTime
            ? new Date(
                setHours(now, closingTime.hour).setMinutes(closingTime.minute),
              )
            : undefined;

          return (
            <CollapsibleCheckbox
              key={i}
              message={{ id: `day.${day}` }}
              onOpen={() => {
                setValue(`businessHours.${day as Day}`, {} as any);
              }}
              onClose={() => {
                setWeeklyBusinessHours((prev) => {
                  const currentWeeklyBusinessHours = {
                    ...prev,
                  };

                  currentWeeklyBusinessHours[day as Day] = undefined;

                  return currentWeeklyBusinessHours;
                });
                setValue(`businessHours.${day as Day}`, undefined as any);
              }}
              isOpen={Boolean(weeklyBusinessHours[day as Day])}
            >
              <VStack width="100%" justifyContent="center">
                <HStack width="100%">
                  <InputLabel message={{ id: m('input.opening_time.label') }} />
                  <TimeOnlyInput
                    overrideDate={openingTimeDate}
                    onChange={(date) => {
                      if (!date) {
                        return;
                      }

                      const openingTime: BusinessHoursInterval['openingTime'] =
                        {
                          hour: date.getHours(),
                          minute: date.getMinutes(),
                        };

                      setWeeklyBusinessHours((prev) => {
                        const currentWeeklyBusinessHours = {
                          ...prev,
                        };

                        currentWeeklyBusinessHours[day as Day] = {
                          ...currentWeeklyBusinessHours[day as Day],
                          openingTime,
                        } as BusinessHoursInterval;

                        return currentWeeklyBusinessHours;
                      });

                      setValue(
                        `businessHours.${day as Day}.openingTime`,
                        openingTime,
                      );
                    }}
                  />
                </HStack>
                <HStack width="100%">
                  <InputLabel message={{ id: m('input.closing_time.label') }} />
                  <TimeOnlyInput
                    overrideDate={closingTimeDate}
                    onChange={(date) => {
                      if (!date) {
                        return;
                      }

                      const closingTime: BusinessHoursInterval['closingTime'] =
                        {
                          hour: date.getHours(),
                          minute: date.getMinutes(),
                        };

                      setWeeklyBusinessHours((prev) => {
                        const currentWeeklyBusinessHours = {
                          ...prev,
                        };

                        currentWeeklyBusinessHours[day as Day] = {
                          ...currentWeeklyBusinessHours[day as Day],
                          closingTime,
                        } as BusinessHoursInterval;

                        return currentWeeklyBusinessHours;
                      });

                      setValue(
                        `businessHours.${day as Day}.closingTime`,
                        closingTime,
                      );
                    }}
                  />
                </HStack>
              </VStack>
            </CollapsibleCheckbox>
          );
        })}
      </VStack>
    );
  }, [errors, weeklyBusinessHours, setValue, getValues, resetField]);

  const businessHoursErrorMessage = useMemo(() => {
    if (
      !Object.keys(errors.businessHours ?? {}).length ||
      !errors.businessHours
    ) {
      return null;
    }

    return (
      <VStack color="red" justifyContent="flex-start" alignItems="flex-start">
        <HStack ref={businessHoursErrorMessageRef}>
          <Box marginRight="5px">
            <MdInfo fontSize="17px" />
          </Box>
          <Text
            message={{ id: m('input.business_hours.error') }}
            fontSize="lg"
          />
        </HStack>
        {Object.keys(errors.businessHours).map((day, i) => (
          <Text key={i} message={{ id: `day.${day}` }} fontSize="md" />
        ))}
      </VStack>
    );
  }, [errors.businessHours, businessHoursErrorMessageRef]);

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
        {/* ADDRESS */}
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

        <Divider />

        {/* BUSINESS HOURS */}
        <Text message={{ id: m('input.business_hours.title') }} fontSize="lg" />
        <InputLabel
          message={{ id: m('input.business_hours.label') }}
          paddingBottom="10px"
        />
        {businessHoursForm}
        {businessHoursErrorMessage}

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
