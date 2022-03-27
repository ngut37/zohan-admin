/**
 * ! NOT USED SINCE JWT IS HANDLED WITH BACKEND
 * ! HTTP ONLY
 */

import Cookies from 'universal-cookie';

type TokenType = 'access' | 'refresh';

const tokenNameMap: Record<TokenType, string> = {
  access: 'access_token',
  refresh: 'refresh_token',
};

const cookies = new Cookies();

export const saveToken = (type: TokenType, token: string) => {
  if (typeof window === 'undefined') return;

  cookies.set(tokenNameMap[type], token, { path: '/' });
};

export const getToken = (type: TokenType) => {
  const token = cookies.get(tokenNameMap[type]);
  if (!token) return undefined;
  return token;
};

export const removeToken = (type: TokenType) => {
  cookies.remove(tokenNameMap[type]);
};
