import { Environments, Config, EnvironmentName } from './types';

export const createConfig = (envs: Environments, defaultConfig: Config) => {
  // ENVIRONMENT ENV VARIABLE
  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as EnvironmentName;

  // MERGE DEFAULT CONFIG
  let defaults: Config = {
    APP_ENV,
    ...defaultConfig,
  };

  // INCLUDE APP ENV RELATED CONFIG
  if (envs[APP_ENV]) {
    defaults = { ...defaults, ...envs[APP_ENV] };
  }

  return defaults;
};
