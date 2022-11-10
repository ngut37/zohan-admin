import { createConfig } from './create-config';
import { Config } from './types';

const defaultConfig: Config = {
  ACCESS_TOKEN_SECRET: '6b7ed16ab0131207b609a2b25f0ff2e3',
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
