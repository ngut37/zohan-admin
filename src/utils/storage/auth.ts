import { config } from '@config';

import { verify, VerifyOptions } from 'jsonwebtoken';
import Cookies from 'universal-cookie';

import { enumerate } from '@utils/enumerate';

export type AccessTokenPayload = {};

const cookies = new Cookies();

export const STAFF_ROLES_ENUM = enumerate('reader', 'editor', 'admin');

export type StaffRole = keyof typeof STAFF_ROLES_ENUM;

export type Staff = {
  staffId: string;
  name: string;
  email: string;
  role: StaffRole;
  exp: number;
  iat: number;
};

export const saveAccessTokenToken = (token: string) => {
  if (typeof window === 'undefined') return;

  cookies.set('access_token', token, { path: '/' });
};

export const getAccessToken = () => {
  const token = cookies.get('access_token');
  if (!token) return undefined;
  return token;
};

export const removeAccessToken = () => {
  cookies.remove('access_token');
};

export const parseAccessToken = (
  token: string,
  verifyOptions: VerifyOptions,
): Staff | undefined => {
  try {
    const payload = verify(
      token,
      config.NEXT_PUBLIC_ACCESS_TOKEN_SECRET || '',
      verifyOptions,
    ) as Staff;
    return payload;
  } catch {
    return undefined;
  }
};
