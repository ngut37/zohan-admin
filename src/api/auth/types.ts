import { enumerate } from '@utils/enumerate';

type FactoryToken = {
  iat: number;
  exp: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  oAuth?: {
    userId: string;
    type: OAuthType;
  };
} & FactoryToken;

export const O_AUTH_TYPES = enumerate('google', 'facebook');

export type OAuthType = keyof typeof O_AUTH_TYPES;
