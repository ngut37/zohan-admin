import { protectedApiClient } from '@api/api-client';

import { ServiceName, ServiceType } from './types';

export type ServiceUpsertPayload = {
  id?: string;
  type: ServiceType;
  name: ServiceName;
  venue: string;
  staff: string[];
  length: number;
  price: number;
};

export type UpsertManyServicesPayload = {
  venue: string;
  services: ServiceUpsertPayload[];
};

export const upsertManyServices = async (
  payload: UpsertManyServicesPayload,
) => {
  try {
    const response = await protectedApiClient.request<{
      success: boolean;
    }>({
      url: '/services/upsert-many',
      method: 'POST',
      data: payload,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
