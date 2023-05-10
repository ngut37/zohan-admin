import { addMinutes, differenceInMinutes, getDay, setHours } from 'date-fns';

import { Booking } from '@api/bookings';
import { Service } from '@api/services';
import { BusinessHoursInterval } from '@api/types';
import { Venue } from '@api/venues';

import { getDayName } from '@utils/map-day-index-to-day';
import {
  looseIsDateAfter,
  looseIsDateBefore,
  looseIsDateEqual,
} from '@utils/non-strict-date-comparator';

export const isDateBookingCollision = ({
  date,
  service,
  venue,
  bookings,
}: {
  date: Date;
  service: Service;
  venue: Venue;
  bookings: Booking[];
}): boolean => {
  const dayName = getDayName(getDay(date));

  if (!venue.businessHours[dayName]) return true;

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

  const businessOpeningTimeInMinutes = differenceInMinutes(
    closingDateTime,
    openingDateTime,
  );

  if (serviceLength > businessOpeningTimeInMinutes) {
    return true;
  }

  const closingDateTimeWithBookingLength = addMinutes(
    closingDateTime,
    -serviceLength,
  );

  const dateIsBeforeOpeningTime = looseIsDateBefore(date, openingDateTime);

  const dateIsAfterClosingTimeWithBookingLength = looseIsDateAfter(
    date,
    closingDateTimeWithBookingLength,
  );

  if (dateIsBeforeOpeningTime || dateIsAfterClosingTimeWithBookingLength) {
    return true;
  }

  if (!bookings.length) {
    return false;
  }

  // validate existing bookings collision
  return bookings.some((booking) => {
    const bookingStartDateTime = new Date(booking.start);
    const bookingEndDateTime = new Date(booking.end);

    const dateIsAfterBooking = looseIsDateAfter(date, bookingStartDateTime);
    const dateIsEqualBooking = looseIsDateEqual(date, bookingStartDateTime);
    const dateIsBeforeBooking = looseIsDateBefore(date, bookingEndDateTime);

    if ((dateIsAfterBooking || dateIsEqualBooking) && dateIsBeforeBooking) {
      return true;
    }

    const dateWithServiceLength = addMinutes(date, serviceLength);

    const dateIsEqualBookingWithServiceLength = looseIsDateEqual(
      dateWithServiceLength,
      bookingStartDateTime,
    );

    if (dateIsEqualBookingWithServiceLength) {
      return false;
    }

    const dateIsAfterBookingWithServiceLength = looseIsDateAfter(
      dateWithServiceLength,
      bookingStartDateTime,
    );

    const dateIsBeforeBookingWithServiceLength = looseIsDateBefore(
      dateWithServiceLength,
      bookingEndDateTime,
    );

    if (
      dateIsAfterBookingWithServiceLength &&
      dateIsBeforeBookingWithServiceLength
    ) {
      return true;
    }

    if (dateIsBeforeBooking && dateIsAfterBookingWithServiceLength) {
      return true;
    }

    return false;
  });
};
