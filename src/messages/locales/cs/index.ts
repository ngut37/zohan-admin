import { globalMessages } from './global';
import { navbarMessages } from './modules/navbar';
import { registerMessages } from './modules/register';
import { loginMessages } from './modules/login';
import { registerDoneMessages } from './modules/register-done';

export const cs = {
  ...globalMessages,
  ...navbarMessages,
  ...registerMessages,
  ...registerDoneMessages,
  ...loginMessages,
};
