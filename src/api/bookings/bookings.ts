import { protectedApiClient } from '@api/api-client';
import { Service } from '@api/services';
import { ResponseResult } from '@api/types';

import { Booking } from './types';

export type GetManyBookingsParams = {
  venueId: string;
  start: string;
  end: string;
};

export const getManyBookings = async ({
  venueId,
  start,
  end,
}: GetManyBookingsParams) => {
  const response = await protectedApiClient.request<
    ResponseResult<
      (Omit<Booking, 'service' | 'existingCustomer'> & {
        service: Service;
        existingCustomer?: {
          id: string;
          name: string;
          email: string;
        };
      })[]
    >
  >({
    url: '/bookings',
    params: {
      venueId,
      start,
      end,
    },
    method: 'get',
  });

  return response.data.data;
};

export type CreateBookingParams = {
  customCustomer: {
    name: string;
    email: string;
    phone: string;
  };
  venueId: string;
  staffId: string;
  serviceId: string;
  start: string;
  end: string;
};

export const createBooking = async (data: CreateBookingParams) => {
  const response = await protectedApiClient.request<ResponseResult<Booking>>({
    url: '/bookings',
    method: 'post',
    data,
  });

  return response.data.data;
};

type EditBookingByIdParams = {
  customCustomer?: {
    name: string;
    email: string;
    phone: string;
  };
  existingCustomer?: string;
  venueId?: string;
  staffId?: string;
  serviceId?: string;
  start?: string;
  end?: string;
};

export const editBookingById = async (
  bookingId: string,
  data: EditBookingByIdParams,
) => {
  const response = await protectedApiClient.request<ResponseResult<Booking>>({
    url: `/bookings/${bookingId}`,
    method: 'put',
    data,
  });

  return response.data.data;
};

export const deleteBookingById = async (bookingId: string) => {
  await protectedApiClient.request({
    url: `/bookings/${bookingId}`,
    method: 'delete',
  });
};
