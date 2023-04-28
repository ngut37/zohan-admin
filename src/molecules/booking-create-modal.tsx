import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addMinutes } from 'date-fns';

import { Service } from '@api/services';
import { Staff } from '@api/staff';
import { createBooking } from '@api/bookings';
import { getServices } from '@api/venues';

import { yup } from '@utils/yup';
import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';

import { Text, Input, Button } from '@atoms';

import { useDashboard } from '@organisms/main-dashboard/context/dashboard-context';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  FormControl,
  VStack,
  Select,
  HStack,
  useToast,
} from '@chakra-ui/react';

import { DateTimeInput } from './date-time-input';
import { InputLabel } from './input-label';

type CreateBookingModalFormValues = {
  venueId: string;
  staffId: string;
  serviceId: string;
  start: Date;
  end: Date;
  customCustomer: {
    name: string;
    email: string;
    phone: string;
  };
};

const m = messageIdConcat('dashboard.booking_create_modal');

export const BookingCreateModal = () => {
  const intl = useIntl();
  const toast = useToast();

  const schema = useMemo(() => {
    return yup.object().shape({
      venueId: yup.string().required(),
      staffId: yup.string().required(),
      serviceId: yup.string().required(),
      start: yup.date().required(),
      end: yup.date().required(),
      customCustomer: yup
        .object()
        .shape({
          name: yup
            .string()
            .required(
              messageToString(
                { id: m('input.custom_customer.name.required') },
                intl,
              ),
            ),
          email: yup
            .string()
            .email(
              messageToString(
                { id: m('input.custom_customer.email.invalid') },
                intl,
              ),
            )
            .nullable()
            .optional(),
          phone: yup
            .string()
            .nullable()
            .optional()
            .phoneNumber(
              undefined,
              true,
              messageToString(
                { id: m('input.custom_customer.phone.invalid') },
                intl,
              ),
            ),
        })
        .required(),
    });
  }, [intl]);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset: resetHookForm,
    formState: { errors },
  } = useForm<CreateBookingModalFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const watchedEndDateTime = watch('end');

  const {
    availableVenues,
    availableStaff,
    createModalOpen,
    selectedVenue,
    setCreateModalOpen,
    refetchBookings,
    modalData,
  } = useDashboard();

  const serviceSelectRef = useRef<HTMLSelectElement>(null);

  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(
    selectedVenue?._id,
  );
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();

  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();

  useEffect(() => {
    if (selectedVenue) {
      setSelectedVenueId(selectedVenue._id);
      setValue('venueId', selectedVenue._id);
    }
  }, [selectedVenue]);

  // fetch services for venue on venue change
  useEffect(() => {
    if (!selectedVenueId) {
      return;
    }
    const fetchServicesForVenue = async () => {
      const services = await getServices(selectedVenueId);
      return services;
    };
    fetchServicesForVenue()
      .then((services) => {
        setAvailableServices(services);
      })
      .catch((_error) => {
        toast({
          description: messageToString({ id: 'error.api' }, intl),
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      });
  }, [selectedVenueId]);

  const onClose = useCallback(() => {
    setCreateModalOpen(false);

    // reset modal values
    resetHookForm();

    setSelectedService(undefined);
    setSelectedStaff(undefined);
    setSelectedStartDate(undefined);

    // keep venue selected for further booking creation
    if (selectedVenue) {
      setValue('venueId', selectedVenue._id);
    }
  }, [selectedVenue, setCreateModalOpen, resetHookForm, setValue]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data: CreateBookingModalFormValues) => {
      setSubmitting(true);
      try {
        await createBooking({
          ...data,
          start: data.start.toISOString(),
          end: data.end.toISOString(),
        });

        await refetchBookings();
        onClose();
        toast({
          description: messageToString({ id: m('toast.create.success') }, intl),
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          description: messageToString({ id: 'error.api' }, intl),
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [modalData, toast, intl, setSubmitting, onClose],
  );

  useEffect(() => {
    if (selectedVenue) {
      setSelectedVenueId(selectedVenue._id);
      setValue('venueId', selectedVenue._id);
    }
  }, [selectedVenue]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast({
        description: messageToString({ id: m('toast.form_error') }, intl),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [intl, errors]);

  return (
    <Flex>
      <Modal
        size="xl"
        closeOnOverlayClick={false}
        isOpen={createModalOpen}
        onClose={onClose}
      >
        <ModalOverlay backdropFilter="blur(1px)" />
        <ModalContent>
          <ModalHeader>
            {messageToString({ id: m('heading') }, intl)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl padding="10px">
              <VStack spacing="12px" width="66%" marginY="10px">
                {/* CUSTOMER */}
                <VStack width="100%">
                  <InputLabel message={{ id: m('input.customer.label') }} />
                  <Input
                    inputProps={{
                      id: 'staffName',
                      placeholder: messageToString(
                        { id: m('input.customer.name.placeholder') },
                        intl,
                      ),
                      ...register('customCustomer.name'),
                    }}
                    formControlProps={{
                      isInvalid: Boolean(errors.customCustomer?.name),
                    }}
                    error={errors.customCustomer?.name}
                  />
                  <Input
                    inputProps={{
                      id: 'email',
                      placeholder: messageToString(
                        { id: m('input.customer.email.placeholder') },
                        intl,
                      ),
                      ...register('customCustomer.email'),
                    }}
                    formControlProps={{
                      isInvalid: Boolean(errors.customCustomer?.email),
                    }}
                    error={errors.customCustomer?.email}
                  />
                  <Input
                    inputProps={{
                      id: 'phone',
                      placeholder: messageToString(
                        { id: m('input.customer.phone.placeholder') },
                        intl,
                      ),
                      ...register('customCustomer.phone'),
                    }}
                    formControlProps={{
                      isInvalid: Boolean(errors.customCustomer?.phone),
                    }}
                    error={errors.customCustomer?.phone}
                  />
                </VStack>
                {/* VENUE SELECT */}
                <VStack width="100%">
                  <InputLabel message={{ id: m('input.venue.label') }} />
                  <Select
                    defaultValue={selectedVenueId}
                    onChange={(e) => {
                      setValue('venueId', e.target.value);
                      setSelectedVenueId(e.target.value);

                      // reset selected staff
                      setValue('staffId', '');
                      setSelectedStaff(undefined);

                      // reset selected service
                      setValue('serviceId', '');
                      setSelectedService(undefined);
                      if (serviceSelectRef.current) {
                        serviceSelectRef.current.value = '';
                      }

                      // reset start and end date time
                      setSelectedStartDate(undefined);
                      setValue('start', undefined as unknown as Date);
                      setValue('end', undefined as unknown as Date);
                    }}
                  >
                    {availableVenues.map((venue) => (
                      <option key={venue._id} value={venue._id}>
                        {venue.stringAddress}
                      </option>
                    ))}
                  </Select>
                </VStack>
                {/* STAFF SELECT */}
                <VStack width="100%">
                  <InputLabel message={{ id: m('input.staff.label') }} />
                  <Select
                    defaultValue={selectedStaff?._id}
                    placeholder={messageToString(
                      { id: m('input.staff.placeholder') },
                      intl,
                    )}
                    onChange={(e) => {
                      setValue('staffId', e.target.value);
                      setSelectedStaff(
                        availableStaff.find(
                          (staff) => staff._id === e.target.value,
                        ),
                      );

                      // reset selected service
                      setValue('serviceId', '');
                      setSelectedService(undefined);
                      if (serviceSelectRef.current) {
                        serviceSelectRef.current.value = '';
                      }

                      // reset start and end date time
                      setSelectedStartDate(undefined);
                      setValue('start', undefined as unknown as Date);
                      setValue('end', undefined as unknown as Date);
                    }}
                  >
                    {availableStaff.map((staff) => {
                      if (staff.venue?._id !== selectedVenueId) {
                        return null;
                      }

                      return (
                        <option key={staff._id} value={staff._id}>
                          {staff.name}
                        </option>
                      );
                    })}
                  </Select>
                </VStack>
                {/* SERVICE SELECT WITH PRICE AND DURATION INFO */}
                <VStack alignItems="flex-start" width="100%">
                  <InputLabel message={{ id: m('input.service.label') }} />
                  <Select
                    ref={serviceSelectRef}
                    placeholder={messageToString(
                      { id: m('input.service.placeholder') },
                      intl,
                    )}
                    onChange={(e) => {
                      const start = selectedStartDate;

                      const selectedService = availableServices.find(
                        (service) => service._id === e.target.value,
                      );

                      if (!selectedService) {
                        setSelectedStartDate(undefined);
                        setValue('start', undefined as unknown as Date);
                        setValue('end', undefined as unknown as Date);
                        return;
                      }

                      setValue('serviceId', e.target.value);
                      setSelectedService(selectedService);

                      if (!start) {
                        return;
                      }

                      // reset start and end date time
                      setValue(
                        'end',
                        addMinutes(start, selectedService.length),
                      );
                    }}
                    defaultValue={selectedService?._id}
                  >
                    {availableServices.map((service) => {
                      if (
                        !selectedStaff ||
                        !service.staff.includes(selectedStaff._id)
                      ) {
                        return null;
                      }

                      return (
                        <option key={service._id} value={service._id}>
                          {messageToString(
                            { id: `service_name.${service.name}` },
                            intl,
                          )}
                        </option>
                      );
                    })}
                  </Select>
                  <HStack width="100%" justifyContent="space-between">
                    <InputLabel
                      message={{ id: m('input.service.price') }}
                      w="auto"
                    />
                    <Text
                      message={{
                        id: 'unit.price_with_currency',
                        values: {
                          price: selectedService?.price || '---',
                          currency: 'Kč', // refactor this when implementing multi-currency service prices
                        },
                      }}
                    />
                    <InputLabel
                      message={{ id: m('input.service.duration') }}
                      w="auto"
                    />
                    <Text
                      message={{
                        id: 'unit.duration_with_minutes',
                        values: {
                          duration: selectedService?.length || '---',
                        },
                      }}
                    />
                  </HStack>
                </VStack>
                {/* START AND END TIME PICKERS */}
                <VStack height="85px" width="100%">
                  <InputLabel message={{ id: m('input.start.label') }} />
                  <DateTimeInput
                    placeholder={messageToString(
                      {
                        id: m(
                          `input.${
                            selectedService ? 'start' : 'start.pick_service'
                          }.placeholder`,
                        ),
                      },
                      intl,
                    )}
                    overrideDate={selectedStartDate}
                    onChange={(date) => {
                      if (!date) return;
                      if (!selectedService) return;

                      const serviceLength = selectedService.length;
                      const startDateTime = date;
                      const endDateTime = addMinutes(date, serviceLength);

                      setSelectedStartDate(startDateTime);
                      setValue('start', startDateTime);
                      setValue('end', endDateTime);
                    }}
                  />
                </VStack>
                <VStack height="85px" width="100%">
                  <InputLabel message={{ id: m('input.end.label') }} />
                  <DateTimeInput
                    disabled
                    overrideDate={watchedEndDateTime}
                    placeholder={messageToString(
                      { id: m('input.end.placeholder') },
                      intl,
                    )}
                  />
                </VStack>
              </VStack>
            </FormControl>
          </ModalBody>

          <ModalFooter width="100%" justifyContent="space-between">
            <Button
              message={{ id: 'button.close' }}
              size="lg"
              variant="ghost"
              marginRight="20px"
              onClick={onClose}
            />
            <Button
              message={{ id: 'button.create' }}
              onClick={handleSubmit(onSubmit)}
              isLoading={submitting}
              size="lg"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
