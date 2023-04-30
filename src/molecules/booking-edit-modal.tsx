import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useIntl } from 'react-intl';
import { addMinutes } from 'date-fns';

import { Service } from '@api/services';
import { Staff } from '@api/staff';
import {
  createBooking,
  CreateBookingParams,
  deleteBookingById,
  editBookingById,
} from '@api/bookings';
import { getServices } from '@api/venues';

import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';

import { Text, Input, Button } from '@atoms';

import {
  useDashboard,
  BookingModalFormValues,
} from '@organisms/main-dashboard/context/dashboard-context';

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
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

import { DateTimeInput } from './date-time-input';
import { InputLabel } from './input-label';

const m = messageIdConcat('dashboard.booking_edit_modal');

export const BookingEditModal = () => {
  const intl = useIntl();
  const toast = useToast();

  const { isOpen, onOpen, onClose: onDisclosureClose } = useDisclosure();
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  const {
    availableVenues,
    availableStaff,
    modalData,
    modalOpen,
    clearModalData,
    setModalOpen,
    refetchBookings,
    hookform,
  } = useDashboard();

  const serviceSelectRef = useRef<HTMLSelectElement>(null);

  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(
    modalData?.venue,
  );
  const [selectedService, setSelectedService] = useState<Service | undefined>(
    modalData?.serviceData,
  );
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>(
    modalData?.staffData,
  );

  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    modalData?.start ? new Date(modalData.start) : undefined,
  );

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
  }, [selectedVenueId, setAvailableServices]);

  const onClose = useCallback(() => {
    clearModalData();
    setModalOpen(false);
  }, [clearModalData, setModalOpen]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data: BookingModalFormValues) => {
      setSubmitting(true);
      try {
        if (modalData?._id) {
          await editBookingById(modalData?._id as string, {
            ...data,
            start: data.start ? data.start.toISOString() : undefined,
            end: data.end ? data.end.toISOString() : undefined,
          });
        } else {
          await createBooking({
            ...data,
            start: data.start
              ? data.start.toISOString()
              : new Date().toISOString(),
            end: data.end ? data.end.toISOString() : new Date().toISOString(),
          } as CreateBookingParams);
        }

        await refetchBookings();
        onClose();
        toast({
          description: messageToString({ id: m('toast.edit.success') }, intl),
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

  const onDelete = useCallback(async () => {
    setSubmitting(true);
    try {
      await deleteBookingById(modalData?._id as string);
      await refetchBookings();
      onClose();
      toast({
        description: messageToString({ id: m('toast.delete.success') }, intl),
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
  }, [modalData, toast, intl, setSubmitting]);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    watch,
  } = hookform;

  const watchedEndDateTime = watch('end');

  useEffect(() => {
    if (modalData?.start) {
      setSelectedStartDate(new Date(modalData.start));
    }
    if (modalData?.venue) {
      setSelectedVenueId(modalData.venue);
    }
    if (modalData?.staffData) {
      setSelectedStaff(modalData.staffData);
    }
    if (modalData?.serviceData) {
      setSelectedService(modalData.serviceData);
    }
    if (modalData?.existingCustomerData) {
      setValue('existingCustomer', modalData.existingCustomerData.id);
    }
    if (modalData?.customCustomer) {
      setValue('customCustomer', modalData.customCustomer);
    }
  }, [modalData]);

  const deleteBookingAlertDialog = useMemo(() => {
    return (
      <>
        <Button
          colorScheme="red"
          onClick={onOpen}
          size="lg"
          message={{ id: 'button.delete' }}
          variant="outline"
        />

        <AlertDialog
          isCentered
          isOpen={isOpen}
          leastDestructiveRef={cancelDeleteRef}
          onClose={onClose}
          closeOnOverlayClick={false}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {messageToString({ id: m('delete_confirmation.title') }, intl)}
              </AlertDialogHeader>

              <AlertDialogBody>
                {messageToString(
                  { id: m('delete_confirmation.subtitle') },
                  intl,
                )}
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
                    await onDelete();
                    onDisclosureClose();
                  }}
                  ml={3}
                  message={{ id: 'button.confirm_delete' }}
                />
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }, [isOpen, onClose, onOpen, onDisclosureClose, onDelete]);

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
        isOpen={modalOpen}
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
                {modalData?.existingCustomerData ? (
                  <VStack width="100%">
                    <InputLabel message={{ id: m('input.customer.label') }} />
                    <Input
                      inputProps={{
                        isDisabled: true,
                        value: modalData?.existingCustomerData.name,
                      }}
                    />
                    <Input
                      inputProps={{
                        isDisabled: true,
                        value: modalData?.existingCustomerData.email,
                      }}
                    />
                    <Input
                      inputProps={{
                        isDisabled: true,
                        value: modalData?.existingCustomerData.phone,
                        placeholder: messageToString(
                          { id: m('input.customer.phone.empty.placeholder') },
                          intl,
                        ),
                      }}
                    />
                  </VStack>
                ) : (
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
                )}
                {/* VENUE SELECT */}
                <VStack width="100%">
                  <InputLabel message={{ id: m('input.venue.label') }} />
                  <Select
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
                      setValue('start', undefined);
                      setValue('end', undefined);
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
                      setValue('start', undefined);
                      setValue('end', undefined);
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
                        setValue('start', undefined);
                        setValue('end', undefined);
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
                    defaultValue={selectedService?._id || modalData?.service}
                    value={selectedService?._id || modalData?.service}
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
            <HStack>
              {deleteBookingAlertDialog}
              <Button
                message={{ id: 'button.save' }}
                onClick={handleSubmit(onSubmit)}
                isLoading={submitting}
                size="lg"
              />
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};