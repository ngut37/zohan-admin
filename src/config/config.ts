import { createConfig } from './create-config';
import { Config } from './types';

const defaultConfig: Config = {
  GOOGLE_ID:
    '1133750197-ram3lpoeeujf5rs8gmh6faa900c899pi.apps.googleusercontent.com',
  GOOGLE_SECRET: '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',
  FACEBOOK_CLIENT_ID: '639559107099698',
  FACEBOOK_CLIENT_SECRET: '431cf026df2dd012b54d85ae26831fd0',
};

export const config = createConfig(
  {
    development: {
      API_URL: 'http://localhost:4000/',
      APP_URL: 'http://localhost:3000/',
      NEXTAUTH_URL: 'http://localhost:3000',
    },
    preview: {},
    test: {},
    production: {
      API_URL: 'https://zohan-services.oa.r.appspot.com/',
      APP_URL: 'https://zohan-website.vercel.app/',
      NEXTAUTH_URL: 'https://zohan-website.vercel.app/',
    },
  },
  defaultConfig,
);
