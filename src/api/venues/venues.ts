import { protectedApiClient } from '@api/api-client';
import { Service } from '@api/services';
import { Staff } from '@api/staff';
import { ResponseResult, WeeklyBusinessHours } from '@api/types';

export type Venue = {
  _id: string;
  stringAddress: string;
  region: string;
  district: string;
  momc: string;
  coordinates: [number, number];
  businessHours: WeeklyBusinessHours;
};

export const getAllVenuesOrFail = async () => {
  const response = await protectedApiClient.request<ResponseResult<Venue[]>>({
    url: '/admin/venues',
    method: 'get',
  });

  return response.data.data;
};

export const getVenueByIdOrFail = async (venueId: string) => {
  const response = await protectedApiClient.request<ResponseResult<Venue>>({
    url: `/admin/venues/${venueId}`,
    method: 'get',
  });

  return response.data.data;
};

export type CreateVenueBody = {
  stringAddress: string;
  regionString: string;
  districtString: string;
  quarterString?: string;
  coordinates: [number, number];
};

export const createVenueOrFail = async (body: CreateVenueBody) => {
  const response = await protectedApiClient.request<ResponseResult<Venue>>({
    url: '/admin/venues/create',
    method: 'post',
    data: body,
  });

  return response.data.data;
};

export type EditVenueBody = CreateVenueBody & {
  businessHours: WeeklyBusinessHours;
};

export const editVenueOrFail = async (id: string, body: EditVenueBody) => {
  const response = await protectedApiClient.request<ResponseResult<Venue>>({
    url: `/admin/venues/${id}/edit`,
    method: 'post',
    data: body,
  });

  return response.data.data;
};

export type GetServicesData = Service[];

export const getServices = async (venueId: string) => {
  const response = await protectedApiClient.request<
    ResponseResult<GetServicesData>
  >({
    url: `/admin/venues/${venueId}/services`,
    method: 'get',
  });

  return response.data.data;
};

export type GetStaffData = Staff[];

export const getStaff = async (venueId: string) => {
  const response = await protectedApiClient.request<
    ResponseResult<GetStaffData>
  >({
    url: `/admin/venues/${venueId}/staff`,
    method: 'get',
  });

  return response.data.data;
};

export const deleteVenueByIdOrFail = async (id: string) => {
  try {
    await protectedApiClient.request({
      url: `/admin/venues/${id}`,
      method: 'delete',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
