import { createConfig } from './create-config';
import { Config } from './types';

const defaultConfig: Config = {
  APP_ENV: 'development',
  PORT: 3000,
  API_URL: 'http://localhost:4000/',
  APP_URL: 'http://localhost:3000/',
  ACCESS_TOKEN_SECRET: '6b7ed16ab0131207b609a2b25f0ff2e3',
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 64,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 256,
};

export const config = createConfig(
  {
    development: {
      API_URL: 'http://localhost:4000/',
      APP_URL: 'http://localhost:3000/',
    },
    preview: {},
    test: {},
    production: {
      API_URL: 'https://zohan-services.oa.r.appspot.com/',
      APP_URL: 'https://zohan-website.vercel.app/',
    },
  },
  defaultConfig,
);
