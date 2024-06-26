import axios, { AxiosRequestConfig } from 'axios';

import { config } from '@config';

import { getAccessToken } from '@utils/storage/auth';

export const apiClient = axios.create({
  baseURL: config.NEXT_PUBLIC_API_URL?.toString(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const protectedApiClient = axios.create({
  baseURL: config.NEXT_PUBLIC_API_URL?.toString(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const originalRequest = protectedApiClient.request;

protectedApiClient.request = async (
  requestConfig: AxiosRequestConfig,
): Promise<any | undefined> => {
  try {
    // auth token inject
    const token = getAccessToken();
    if (token) {
      if (!requestConfig.headers) requestConfig.headers = {};
      requestConfig.headers.authorization = `Bearer ${token}`;
    }

    const result = await originalRequest(requestConfig);

    return result;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
