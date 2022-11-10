import { apiClient } from '@api/api-client';
import { ResponseResult } from '@api/types';

type LoginBody = {
  email: string;
  password: string;
};

type AuthorizationData = {
  accessToken: string;
};

export const loginOrFail = async (body: LoginBody) => {
  const response = await apiClient.request<ResponseResult<AuthorizationData>>({
    url: '/staff/login',
    method: 'POST',
    data: body,
    withCredentials: true,
  });

  return response.data.data;
};

export const logoutOrFail = async () => {
  const response = await apiClient.request<ResponseResult>({
    url: '/staff/logout',
    method: 'POST',
    withCredentials: true,
  });

  return response.data.data;
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.request<ResponseResult<AuthorizationData>>(
      {
        url: '/staff/refresh-token',
        method: 'GET',
        withCredentials: true,
      },
    );

    return response.data.data;
  } catch {
    return undefined;
  }
};
