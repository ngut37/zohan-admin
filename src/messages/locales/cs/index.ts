import { globalMessages } from './global';
import { navbarMessages } from './modules/navbar';
import { registerMessages } from './modules/register';
import { loginMessages } from './modules/login';

export const cs = {
  ...globalMessages,
  ...navbarMessages,
  ...registerMessages,
  ...loginMessages,
};
