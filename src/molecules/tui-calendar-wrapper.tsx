import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useIntl } from 'react-intl';
import ToastUIReactCalendar from '@toast-ui/react-calendar';
import { ExternalEventTypes, Options } from '@toast-ui/calendar';
import { HiArrowNarrowLeft, HiArrowNarrowRight, HiPlus } from 'react-icons/hi';

import { Service } from '@api/services';

import { getColorCombinationByIndex } from '@utils/text-background-color-combinations';
import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';

import { Button, Text } from '@atoms';

import { useDashboard } from '@organisms/main-dashboard/context/dashboard-context';

import { Box, Divider, HStack, Select, VStack } from '@chakra-ui/react';

import { InputLabel } from './input-label';

const m = messageIdConcat('dashboard');

const VIEW_TYPES: Options['defaultView'][] = ['day', 'week', 'month'];

const TUICalendarWrapper = () => {
  const intl = useIntl();
  const {
    availableVenues,
    availableStaff,
    setBookingDateRange,
    bookings,
    setModalOpen,
    setCreateModalOpen,
    setSelectedVenue,
    setModalData,
  } = useDashboard();

  const todaysDate = new Date();

  const [currentDate, setCurrentDate] = useState<Date>(todaysDate);

  const calendarRef = createRef<ToastUIReactCalendar>();
  const getCalendarRefInstance = useCallback(() => {
    const calendarRefInstance = calendarRef.current?.getInstance();

    if (!calendarRefInstance) {
      console.warn(
        `Calendar ref instance is undefined after calendar control action!`,
      );
      throw new Error('Calendar ref instance is undefined!');
    }

    return calendarRefInstance;
  }, [calendarRef]);

  useEffect(() => {
    if (!availableStaff.length) {
      return;
    }

    const calendars: Options['calendars'] = availableStaff.map(
      (staff, index) => {
        const staffName = messageToString(
          { id: `staff_name.${staff.name}` },
          intl,
        );

        const { text, background } = getColorCombinationByIndex(index);

        return {
          id: staff._id,
          name: staffName,
          color: text,
          backgroundColor: background,
        };
      },
    );

    const calendarRefInstance = getCalendarRefInstance();
    calendarRefInstance.setCalendars(calendars);
  }, [calendarRef, availableStaff]);

  useEffect(() => {
    if (!availableStaff.length || !availableVenues.length) {
      return;
    }

    const clickEventHandler: ExternalEventTypes['clickEvent'] = (event) => {
      const staffData = availableStaff.find(
        (staff) => staff._id === event.event.raw.staff,
      );
      if (!staffData) {
        console.error(
          `Could not find staff data for staff id: ${event.event.raw.staff}`,
        );
        return;
      }

      const venueData = availableVenues.find(
        (venue) => venue._id === event.event.raw.service.venue,
      );
      if (!venueData) {
        console.error(
          `Could not find venue data for venue id: ${event.event.raw.service.venue}`,
        );
        return;
      }

      setModalData({
        _id: event.event.id,
        service: event.event.raw.service._id,
        serviceData: event.event.raw.service as Service,
        staff: event.event.calendarId,
        staffData,
        venue: venueData._id,
        venueData,
        start: event.event.start.toDate(),
        end: event.event.end.toDate(),
        existingCustomerData: event.event.raw.existingCustomerData,
        customCustomer: event.event.raw.customCustomer,
      });
      setModalOpen(true);
    };

    calendarRef.current?.getInstance()?.on('clickEvent', clickEventHandler);

    return () => {
      // component lifecycle cleanup
      calendarRef.current?.getInstance()?.off('clickEvent', clickEventHandler);
    };
  }, [availableStaff, availableVenues]);

  const venueSelect = useMemo(() => {
    if (!availableVenues.length) {
      return null;
    }

    return (
      <HStack
        width="100%"
        paddingX="200px"
        paddingY="15px"
        justifyContent="space-between"
      >
        <VStack width="500px">
          <InputLabel message={{ id: m('input.venue.label') }} />
          <Select
            onChange={(e) => {
              const selectedVenue = availableVenues.find(
                (venue) => venue._id === e.target.value,
              );
              if (selectedVenue) {
                setSelectedVenue(selectedVenue);
              }
            }}
          >
            {availableVenues.map((venue) => (
              <option key={venue._id} value={venue._id}>
                {venue.stringAddress}
              </option>
            ))}
          </Select>
        </VStack>
        <VStack>
          <InputLabel
            message={{ id: m('input.view_type.label') }}
            width="140px"
          />
          <Select
            onChange={(e) => {
              getCalendarRefInstance().changeView(
                e.target.value as NonNullable<Options['defaultView']>,
              );

              setBookingDateRange({
                start: getCalendarRefInstance().getDateRangeStart().toDate(),
                end: getCalendarRefInstance().getDateRangeEnd().toDate(),
              });
            }}
          >
            {VIEW_TYPES.map((viewType) => {
              return (
                <option key={viewType} value={viewType}>
                  {intl.formatMessage({
                    id: m(`input.view_type.${viewType}`),
                  })}
                </option>
              );
            })}
          </Select>
        </VStack>
      </HStack>
    );
  }, [
    calendarRef,
    availableVenues,
    setBookingDateRange,
    getCalendarRefInstance,
  ]);

  const calendarControls = useMemo(() => {
    return (
      <HStack
        width="100%"
        paddingX="200px"
        paddingY="15px"
        justifyContent="space-between"
      >
        <Button
          message={{ id: 'button.create_booking' }}
          leftIcon={<HiPlus />}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        />
        <HStack>
          <Text
            message={{
              id: `month.${currentDate.getMonth()}`,
            }}
          />
          <Text
            message={{
              text: currentDate.getFullYear().toString(),
            }}
          />
        </HStack>
        <HStack>
          <Button
            width="140px"
            message={{ id: 'button.prev' }}
            leftIcon={<HiArrowNarrowLeft />}
            variant="outline"
            onClick={() => {
              getCalendarRefInstance().prev();

              setBookingDateRange({
                start: getCalendarRefInstance().getDateRangeStart().toDate(),
                end: getCalendarRefInstance().getDateRangeEnd().toDate(),
              });
              setCurrentDate(getCalendarRefInstance().getDate().toDate());
            }}
          />
          <Button
            width="140px"
            message={{ id: 'button.next' }}
            rightIcon={<HiArrowNarrowRight />}
            variant="outline"
            onClick={() => {
              getCalendarRefInstance().next();

              setBookingDateRange({
                start: getCalendarRefInstance().getDateRangeStart().toDate(),
                end: getCalendarRefInstance().getDateRangeEnd().toDate(),
              });
              setCurrentDate(getCalendarRefInstance().getDate().toDate());
            }}
          />
          <Divider orientation="vertical" width="1px" minHeight="35px" />
          <Button
            message={{ id: 'button.today' }}
            variant="outline"
            onClick={() => {
              getCalendarRefInstance().today();
              setBookingDateRange({
                start:
                  getCalendarRefInstance().getDateRangeStart().toDate() ||
                  new Date(),
                end:
                  getCalendarRefInstance().getDateRangeEnd().toDate() ||
                  new Date(),
              });
              setCurrentDate(getCalendarRefInstance().getDate().toDate());
            }}
          />
        </HStack>
      </HStack>
    );
  }, [
    calendarRef,
    currentDate,
    setCurrentDate,
    setBookingDateRange,
    getCalendarRefInstance,
  ]);

  return (
    <VStack width="100%">
      {venueSelect}
      {calendarControls}
      <Box width="100%" paddingX="100px" paddingTop="30px">
        <ToastUIReactCalendar
          ref={calendarRef}
          usageStatistics={false}
          week={{
            startDayOfWeek: 1,
            taskView: [],
            dayNames: [
              messageToString({ id: 'day.sunday' }, intl),
              messageToString({ id: 'day.monday' }, intl),
              messageToString({ id: 'day.tuesday' }, intl),
              messageToString({ id: 'day.wednesday' }, intl),
              messageToString({ id: 'day.thursday' }, intl),
              messageToString({ id: 'day.friday' }, intl),
              messageToString({ id: 'day.saturday' }, intl),
            ],
          }}
          month={{
            startDayOfWeek: 1,
            dayNames: [
              messageToString({ id: 'day.sunday' }, intl),
              messageToString({ id: 'day.monday' }, intl),
              messageToString({ id: 'day.tuesday' }, intl),
              messageToString({ id: 'day.wednesday' }, intl),
              messageToString({ id: 'day.thursday' }, intl),
              messageToString({ id: 'day.friday' }, intl),
              messageToString({ id: 'day.saturday' }, intl),
            ],
          }}
          events={bookings}
          gridSelection={false}
          isReadOnly={true}
          view="day"
        />
      </Box>
    </VStack>
  );
};

export default TUICalendarWrapper;
