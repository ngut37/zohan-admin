import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';
import { HiArrowLeft, HiCheck } from 'react-icons/hi';

import { Service } from '@api/services';
import { editBookingById } from '@api/bookings';

import { Staff } from '@api/staff';

import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';

import { Text, Input, Button } from '@atoms';

import {
  useDashboard,
  BookingModalFormValues,
} from '@organisms/main-dashboard/context/dashboard-context';

import { useAuth } from '@modules/root/context/auth';

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

const m = messageIdConcat('dashboard.booking_edit_modal');

export const AssignStaffModal = () => {
  const intl = useIntl();
  const toast = useToast();
  const { auth } = useAuth();

  const {
    availableStaff,
    modalData,
    setModalData,
    clearModalData,
    assignStaffModalOpen,
    selectedVenue,
    setAssignStaffModalOpen,
    setModalOpen,
    refetchBookings,
    hookform,
  } = useDashboard();

  const serviceSelectRef = useRef<HTMLSelectElement>(null);

  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(
    modalData?.venue,
  );
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>(
    modalData?.staffData,
  );
  const [selectedService, setSelectedService] = useState<Service | undefined>(
    modalData?.serviceData,
  );

  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    modalData?.start ? new Date(modalData.start) : undefined,
  );

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = hookform;

  const watchedEndDateTime = watch('end');

  const onClose = useCallback(() => {
    clearModalData();
    setAssignStaffModalOpen(false);
  }, [clearModalData, setAssignStaffModalOpen]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data: BookingModalFormValues) => {
      if (!modalData?._id) {
        return;
      }

      setSubmitting(true);
      try {
        await editBookingById(modalData._id as string, {
          staffId: data.staffId,
        });

        setModalData({ ...modalData, staffData: selectedStaff });

        await refetchBookings();
        toast({
          description: messageToString({ id: m('toast.edit.success') }, intl),
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
        setAssignStaffModalOpen(false);
        setModalOpen(true);
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
    [
      modalData,
      selectedStaff,
      toast,
      intl,
      setSubmitting,
      setAssignStaffModalOpen,
      setModalOpen,
      refetchBookings,
    ],
  );

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

  if (!selectedService) {
    return null;
  }

  return (
    <Flex>
      <Modal
        size="xl"
        closeOnOverlayClick={false}
        isOpen={assignStaffModalOpen}
        onClose={onClose}
      >
        <ModalOverlay backdropFilter="blur(1px)" />
        <ModalContent>
          <ModalHeader>
            {messageToString(
              { id: 'dashboard.assign_staff_modal.heading' },
              intl,
            )}
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
                      isDisabled: true,
                      value: modalData?.existingCustomerData?.name,
                    }}
                  />
                  <Input
                    inputProps={{
                      isDisabled: true,
                      value: modalData?.existingCustomerData?.email,
                    }}
                  />
                  <Input
                    inputProps={{
                      isDisabled: true,
                      value: modalData?.existingCustomerData?.phone,
                      placeholder: messageToString(
                        { id: m('input.customer.phone.empty.placeholder') },
                        intl,
                      ),
                    }}
                  />
                </VStack>
                {/* VENUE SELECT */}
                <VStack width="100%">
                  <InputLabel message={{ id: m('input.venue.label') }} />
                  <Select disabled>
                    <option value={selectedVenueId}>
                      {selectedVenue?.stringAddress}
                    </option>
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
                    }}
                  >
                    {selectedService?.staff
                      ?.map((staffId) =>
                        availableStaff.find((staff) => staff._id === staffId),
                      )
                      .map((staff) => {
                        if (staff?.venue?._id !== selectedVenueId) {
                          return null;
                        }

                        return (
                          <option key={staff?._id} value={staff?._id}>
                            {staff?.name}
                          </option>
                        );
                      })}
                  </Select>
                </VStack>
                {/* SERVICE SELECT WITH PRICE AND DURATION INFO */}
                <VStack alignItems="flex-start" width="100%">
                  <InputLabel message={{ id: m('input.service.label') }} />
                  <Select
                    disabled
                    defaultValue={selectedService?._id || modalData?.service}
                    value={selectedService?._id || modalData?.service}
                    placeholder={messageToString(
                      { id: m('input.service.placeholder') },
                      intl,
                    )}
                    ref={serviceSelectRef}
                  >
                    <option value={selectedService._id}>
                      {`[${messageToString(
                        { id: `service_type.${selectedService.type}` },
                        intl,
                      )}] ${messageToString(
                        { id: `service_name.${selectedService.name}` },
                        intl,
                      )}`}
                    </option>
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
                    disabled
                    overrideDate={selectedStartDate}
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
              leftIcon={<HiArrowLeft />}
              message={{ id: 'button.close' }}
              size="lg"
              variant="ghost"
              marginRight="20px"
              onClick={onClose}
            />
            <HStack>
              <Button
                leftIcon={<HiCheck />}
                disabled={auth?.role === 'reader'}
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
