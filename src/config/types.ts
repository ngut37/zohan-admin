export type Config = {
  APP_ENV: EnvironmentName;
  PORT: number;

  API_URL: string;
  APP_URL: string;

  ACCESS_TOKEN_SECRET: string;

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
