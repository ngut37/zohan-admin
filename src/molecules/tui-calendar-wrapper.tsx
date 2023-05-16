import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useIntl } from 'react-intl';
import { format } from 'date-fns';
import ToastUIReactCalendar from '@toast-ui/react-calendar';
import { ExternalEventTypes, Options } from '@toast-ui/calendar';
import { HiArrowNarrowLeft, HiArrowNarrowRight, HiPlus } from 'react-icons/hi';

import { Service } from '@api/services';

import { getColorCombinationByIndex } from '@utils/text-background-color-combinations';
import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';
import {
  getDisableOnboardingPopup,
  saveDisableOnboardingPopup,
} from '@utils/storage/disable-onboarding-popup';

import { Button, Text } from '@atoms';

import { useDashboard } from '@organisms/main-dashboard/context/dashboard-context';

import { useAuth } from '@modules/root/context/auth';

import {
  Box,
  Divider,
  Flex,
  HStack,
  Select,
  Spinner,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { colors } from '@styles';

import { InputLabel } from './input-label';
import { OnboardingModal } from './onboarding-modal';

const m = messageIdConcat('dashboard');

const VIEW_TYPES: Options['defaultView'][] = ['day', 'week', 'month'];

const TUICalendarWrapper = () => {
  const intl = useIntl();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { auth } = useAuth();

  const {
    loading,
    availableVenues,
    availableStaff,
    setBookingDateRange,
    bookings,
    setModalOpen,
    setCreateModalOpen,
    selectedVenue,
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

  // open onboarding modal based on local storage value
  useEffect(() => {
    const disableOnboardingModal = getDisableOnboardingPopup();

    if (!disableOnboardingModal) {
      onOpen();
    }
  }, [localStorage, onOpen]);

  // set calendar options
  useEffect(() => {
    const calendarRefInstance = getCalendarRefInstance();

    calendarRefInstance.setOptions({
      template: {
        alldayTitle() {
          return `
                <span class="toastui-calendar-left-content toastui-calendar-template-alldayTitle" style="width: 70px;text-align: right;height: 60px;">
                ${messageToString({ id: m('calendar.all_day.title') }, intl)}
                </span>`;
        },
        timegridDisplayPrimaryTime({ time }) {
          const date = time.getTime();
          const formattedTime = format(date, 'HH:mm');

          return formattedTime;
        },
        monthMoreTitleDate(moreTitle) {
          const date = new Date(moreTitle.ymd);
          const formattedDate = format(date, 'dd.MM.yyyy');
          const dayOfWeek = messageToString(
            { id: `day.${date.getDay() - 1}` },
            intl,
          );

          return `<span>${formattedDate} - ${dayOfWeek}</span>`;
        },
        monthGridHeaderExceed(hiddenEvents) {
          return `<span>${messageToString(
            { id: 'countable.next', values: { count: hiddenEvents } },
            intl,
          )}</span>`;
        },
      },
    });
  }, [calendarRef, intl]);

  useEffect(() => {
    if (!availableStaff.length) {
      return;
    }

    const calendars: Options['calendars'] = availableStaff.map(
      (staff, index) => {
        const staffName = messageToString({ text: staff.name }, intl);

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
    const venueSelect = availableVenues.length ? (
      <>
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
      </>
    ) : (
      <>
        <Button
          size="lg"
          width="200px"
          colorScheme="orange"
          message={{ id: 'button.open_onboarding_modal' }}
          onClick={() => {
            onOpen();
          }}
        />
      </>
    );

    return (
      <HStack
        width="100%"
        paddingX="200px"
        paddingY="15px"
        justifyContent="space-between"
      >
        <VStack width="500px" alignItems="flex-start">
          {loading ? (
            <Flex width="200px" justifyContent="center">
              <Spinner
                thickness="4px"
                speed="0.85s"
                emptyColor={colors.white.hex()}
                color={colors.teal_500.hex()}
                size="xl"
              />
            </Flex>
          ) : (
            venueSelect
          )}
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
    loading,
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
          disabled={auth?.role === 'reader' || !selectedVenue}
          message={{ id: 'button.create_booking' }}
          leftIcon={<HiPlus />}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        />
        <HStack>
          <Text
            fontSize="2xl"
            message={{
              id: `month.${currentDate.getMonth()}`,
            }}
          />
          <Text
            fontSize="2xl"
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
    selectedVenue,
    calendarRef,
    currentDate,
    setCurrentDate,
    setBookingDateRange,
    getCalendarRefInstance,
    onOpen,
  ]);

  return (
    <VStack width="100%">
      <OnboardingModal
        isOpen={isOpen}
        onClose={() => {
          saveDisableOnboardingPopup(true);
          onClose();
        }}
      />
      {venueSelect}
      {calendarControls}
      <Box width="100%" paddingX="100px" paddingTop="30px">
        <ToastUIReactCalendar
          height="700px"
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
