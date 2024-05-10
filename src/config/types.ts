export type Config = {
  // TODO: remove after auth is overhauled to use http-only access token (https://zohan-app.atlassian.net/browse/ZOH-129)
  NEXT_PUBLIC_ACCESS_TOKEN_SECRET: string;

  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_URL: string;

  // auth constrains
  MIN_NAME_LENGTH: number;
  MAX_NAME_LENGTH: number;

  MIN_PASSWORD_LENGTH: number;
  MAX_PASSWORD_LENGTH: number;

  SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES: number;
};

export type ConfigKeys = keyof Config;

export type EnvironmentName = 'development' | 'preview' | 'test' | 'production';

export type Environments = { [key in EnvironmentName]: Partial<Config> } & {
  [key: string]: Record<string, any>;
};
