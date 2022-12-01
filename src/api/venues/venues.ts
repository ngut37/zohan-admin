import { protectedApiClient } from '@api/api-client';
import { ResponseResult } from '@api/types';

export type Venue = {
  id: string;
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

export type CreateVenuePayload = {
  stringAddress: string;
  regionString: string;
  districtString: string;
  quarterString?: string;
  coordinates: [number, number];
};

export const createVenueOrFail = async (payload: CreateVenuePayload) => {
  const response = await protectedApiClient.request<
    ResponseResult<GetAllVenuesData>
  >({
    url: '/venues/create',
    method: 'post',
    data: payload,
  });

  return response.data.data;
};

export type EditVenuePayload = CreateVenuePayload;

export const editVenueOrFail = async (
  id: string,
  payload: EditVenuePayload,
) => {
  const response = await protectedApiClient.request<
    ResponseResult<GetAllVenuesData>
  >({
    url: `/venues/${id}/edit`,
    method: 'post',
    data: payload,
  });

  return response.data.data;
};
