import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import { endOfDay, startOfDay } from 'date-fns';
import { EventObject } from '@toast-ui/calendar';

import { getManyBookings, GetManyBookingsParams } from '@api/bookings';
import { getAllVenuesOrFail, Venue } from '@api/venues';
import { getAllStaffOrFail, Staff } from '@api/staff';

import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { useDebouncedEffect } from '@hooks/use-debounce-effect';

import { useToast } from '@chakra-ui/react';

import {
  DashboardContext,
  BookingModalFormValues,
  ModalData,
  BookingDateRange,
} from './dashboard-context';

type Props = PropsWithChildren<{}>;

const m = messageIdConcat('dashboard');

export const UNASSIGNED_BOOKING_CALENDAR_ID = 'unassigned';

export const DashboardProvider = ({ children }: Props) => {
  const toast = useToast();
  const intl = useIntl();

  const schema = useMemo(() => {
    return yup.object().shape({
      venueId: yup.string().required(),
      staffId: yup.string(),
      serviceId: yup.string().required(),
      start: yup.date().required(),
      end: yup.date().required(),
      customCustomer: yup.object().shape({
        name: yup.string(),
        email: yup
          .string()
          .email(
            messageToString(
              { id: m('input.custom_customer.email.invalid') },
              intl,
            ),
          ),
        phone: yup
          .string()
          .phoneNumber(
            ['cs-CZ', 'sk-SK'],
            true,
            messageToString(
              { id: m('input.custom_customer.phone.invalid') },
              intl,
            ),
          ),
      }),
      existingCustomer: yup.string(),
    });
  }, [intl]);

  const hookform = useForm<BookingModalFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  // used for booking date range
  const todaysDate = new Date();

  const [loading, setLoading] = useState<boolean>(true);
  const [availableVenues, setAvailableVenues] = useState<Venue[]>([]);
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>();
  const [bookingDateRange, setBookingDateRange] = useState<BookingDateRange>({
    start: startOfDay(todaysDate),
    end: endOfDay(todaysDate),
  });
  const [bookings, setBookings] = useState<EventObject[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData | undefined>();

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [assignStaffModalOpen, setAssignStaffModalOpen] =
    useState<boolean>(false);

  const extendedSetModalData = (data: ModalData) => {
    setModalData(data);
    hookform.setValue('venueId', data.venue);
    hookform.setValue('staffId', data.staff);
    hookform.setValue('serviceId', data.service);
    hookform.setValue('start', new Date(data.start));
    hookform.setValue('end', new Date(data.end));
  };

  const fetchVenueAndStaff = useCallback(async () => {
    setLoading(true);

    // get venues
    const fetchVenues = async () => {
      const venues = await getAllVenuesOrFail();
      return venues;
    };
    fetchVenues()
      .then((venues) => {
        setAvailableVenues(venues);
        if (venues.length) {
          setSelectedVenue(venues[0]);
        }
      })
      .catch((_error) => {});

    // get staff
    const fetchStaff = async () => {
      const staff = await getAllStaffOrFail();
      return staff;
    };
    fetchStaff()
      .then((staff) => {
        setAvailableStaff(staff);
      })
      .catch((_error) => {});
  }, [setLoading]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchVenueAndStaff();
      } catch {
        setLoading(false);
      }
      // setting venues happends after setting loading to false for some reason
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLoading(false);
    })();
  }, []);

  const refetchBookings = useCallback(async () => {
    if (!selectedVenue) {
      return console.error(`No venue selected! Should not happen.`);
    }

    const fetchBookings = async () => {
      const params: GetManyBookingsParams = {
        venueId: selectedVenue._id,
        start: bookingDateRange.start.toISOString(),
        end: bookingDateRange.end.toISOString(),
      };
      const bookings = await getManyBookings(params);

      return bookings;
    };
    fetchBookings()
      .then((bookings) => {
        const mappedBookingsToEvents: EventObject[] = bookings.map(
          (booking) => {
            const serviceName = messageToString(
              {
                id: `service_name.${booking.service.name}`,
              },
              intl,
            );

            const serviceType = messageToString(
              {
                id: `service_type.${booking.service.type}`,
              },
              intl,
            );

            const customerName =
              booking.existingCustomer?.name || booking.customCustomer?.name;

            const concatenatedTitle = `[${serviceType}] ${serviceName} - ${customerName}`;

            return {
              id: booking._id,
              calendarId: booking.staff ?? UNASSIGNED_BOOKING_CALENDAR_ID,
              title: concatenatedTitle,
              category: 'time',
              start: booking.start,
              end: booking.end,
              raw: {
                service: booking.service,
                staff: booking.staff,
                existingCustomerData: booking.existingCustomer,
                customCustomer: booking.customCustomer,
              },
            };
          },
        );
        setBookings(mappedBookingsToEvents);
      })
      .catch((_error) => {});
  }, [selectedVenue, bookingDateRange]);

  useDebouncedEffect(
    () => {
      refetchBookings().then(() => {});
    },
    [selectedVenue, bookingDateRange],
    500,
  );

  return (
    <DashboardContext.Provider
      value={{
        loading,
        availableVenues,
        setAvailableVenues,
        availableStaff,
        setAvailableStaff,
        selectedVenue,
        setSelectedVenue,
        bookingDateRange,
        setBookingDateRange,
        bookings,
        setBookings,
        refetchBookings,
        modalOpen,
        setModalOpen,
        createModalOpen,
        setCreateModalOpen,
        assignStaffModalOpen,
        setAssignStaffModalOpen,
        modalData,
        setModalData: extendedSetModalData,
        clearModalData: () => setModalData(undefined),
        hookform,
        toast,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
