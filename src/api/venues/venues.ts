import { protectedApiClient } from '@api/api-client';
import { ResponseResult } from '@api/types';

export type Venue = {
  _id: string;
  stringAddress: string;
  region: string;
  district: string;
  momc: string;
};

type GetAllVenuesData = {
  venues: Venue[];
};

export const getAllVenuesOrFail = async () => {
  const response = await protectedApiClient.request<
    ResponseResult<GetAllVenuesData>
  >({
    url: '/venues',
    method: 'get',
  });

  return response.data.data;
};

export const getVenueByIdOrFail = async (venueId: string) => {
  const response = await protectedApiClient.request<ResponseResult<Venue>>({
    url: `/venues/${venueId}`,
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
  const response = await protectedApiClient.request<
    ResponseResult<GetAllVenuesData>
  >({
    url: '/venues/create',
    method: 'post',
    data: body,
  });

  return response.data.data;
};

export type EditVenueBody = CreateVenueBody;

export const editVenueOrFail = async (id: string, body: EditVenueBody) => {
  const response = await protectedApiClient.request<
    ResponseResult<GetAllVenuesData>
  >({
    url: `/venues/${id}/edit`,
    method: 'post',
    data: body,
  });

  return response.data.data;
};
