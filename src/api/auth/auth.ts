import { apiClient } from '../api-client';

import { OAuthType, User } from './types';

type LoginBody = {
  email: string;
  password: string;
};

type LoginResult = {
  success: boolean;
};

export const login = async (body: LoginBody) => {
  const response = await apiClient.request<LoginResult>({
    url: '/auth/login',
    method: 'POST',
    data: body,
    withCredentials: true,
  });

  return response.data;
};

type EmptyResult = {
  success: boolean;
};

export const logout = async () => {
  const response = await apiClient.request<EmptyResult>({
    url: '/auth/logout',
    method: 'POST',
    withCredentials: true,
  });
  return response.data;
};

type RegisterBody = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};

type OAuthRegisterBody = {
  name: string;
  email: string;
  oAuth: {
    userId: string;
    type: OAuthType | string;
  };
};

export async function register(body: RegisterBody): Promise<EmptyResult>;
export async function register(body: OAuthRegisterBody): Promise<EmptyResult>;
export async function register(
  body: RegisterBody | OAuthRegisterBody,
): Promise<EmptyResult> {
  const response = await apiClient.request<EmptyResult>({
    url: '/auth/register',
    method: 'POST',
    data: body,
    withCredentials: true,
  });
  return response.data;
}

type MeResult = {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
};

export const me = async () => {
  try {
    const response = await apiClient.request<MeResult>({
      url: '/auth/me',
      method: 'GET',
      withCredentials: true,
    });
    if (response?.data) return response.data.data;
  } catch {
    return undefined;
  }
};

type EmailExitsResult = {
  success: boolean;
  data: boolean;
};

export const emailExists = async (email: string) => {
  const response = await apiClient.request<EmailExitsResult>({
    url: `/auth/email-exists/${email}`,
    method: 'GET',
  });
  if (response?.data) return response.data.data;
};

type UpdateUserBody = {
  email?: string;
  name?: string;
  password?: string;
  phoneNumber?: string;
};

type UpdateUserResult = {
  success: boolean;
  data: User;
};

export const updateUser = async (body: UpdateUserBody) => {
  try {
    const response = await apiClient.request<UpdateUserResult>({
      url: `/auth/update`,
      method: 'POST',
      data: body,
      withCredentials: true,
    });
    if (response?.data) return response.data.data;
  } catch {
    return undefined;
  }
};
