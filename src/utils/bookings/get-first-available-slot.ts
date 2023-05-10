import { addMinutes, getDay, isSameDay, setHours } from 'date-fns';

import { Booking } from '@api/bookings';
import { Service } from '@api/services';
import { Venue } from '@api/venues';
import { BusinessHoursInterval } from '@api/types';

import { getDayName } from '@utils/map-day-index-to-day';
import { looseIsDateAfter } from '@utils/non-strict-date-comparator';

import { isDateBookingCollision } from './is-date-booking-collision';

export const getFirstAvailableBookingTime = ({
  date,
  service,
  venue,
  bookings,
}: {
  date: Date;
  service: Service;
  venue: Venue;
  bookings: Booking[];
}): Date | null => {
  const dayName = getDayName(getDay(date));

  if (!venue.businessHours[dayName]) {
    return null;
  }

  const serviceLength = service.length;

  const openingDateTime = new Date(
    setHours(
      date,
      (venue.businessHours[dayName] as BusinessHoursInterval).openingTime.hour,
    ).setMinutes(
      (venue.businessHours[dayName] as BusinessHoursInterval).openingTime
        .minute,
    ),
  );
  const closingDateTime = new Date(
    setHours(
      date,
      (venue.businessHours[dayName] as BusinessHoursInterval).closingTime.hour,
    ).setMinutes(
      (venue.businessHours[dayName] as BusinessHoursInterval).closingTime
        .minute,
    ),
  );

  const bookingsForGivenDate = bookings.filter((booking) => {
    return isSameDay(new Date(booking.start), date);
  });

  let potentialBookingStart = new Date(openingDateTime);
  let bookingStartFound = false;

  do {
    // add booking length in minutes to opening time
    const potentialBookingEnd = new Date(
      addMinutes(potentialBookingStart, serviceLength),
    );

    // is booking end after closing time
    const isBookingEndAfterClosingTime = looseIsDateAfter(
      potentialBookingEnd,
      closingDateTime,
    );
    if (isBookingEndAfterClosingTime) {
      return null;
    }

    // do potential booking start and end times collide with existing bookings
    const isBookingCollision = isDateBookingCollision({
      date: potentialBookingStart,
      service,
      venue,
      bookings: bookingsForGivenDate,
    });

    if (!isBookingCollision) {
      bookingStartFound = true;
      return potentialBookingStart;
    }

    // add 15 minute to potential booking start time
    potentialBookingStart = addMinutes(potentialBookingStart, 15);
  } while (!bookingStartFound);

  return null;
};
