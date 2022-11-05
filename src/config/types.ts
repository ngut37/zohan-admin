export type Config = Partial<{
  APP_ENV: EnvironmentName;
  PORT: number;

  API_URL: string;
  APP_URL: string;

  ACCESS_TOKEN_SECRET: string;
}>;

export type ConfigKeys = keyof Config;

export type EnvironmentName = 'development' | 'preview' | 'test' | 'production';

export type Environments = { [key in EnvironmentName]: Config } & {
  [key: string]: Record<string, any>;
};
