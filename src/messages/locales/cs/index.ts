import { globalMessages } from './global';
import { navbarMessages } from './modules/navbar';
import { registerMessages } from './modules/register';
import { loginMessages } from './modules/login';
import { registerDoneMessages } from './modules/register-done';
import { venueListMessages } from './modules/venue-list';
import { venueCreateMessages } from './modules/venue-create';
import { staffListMessages } from './modules/staff-list';
import { staffCreateMessages } from './modules/create-staff';

export const cs = {
  ...globalMessages,
  ...navbarMessages,
  ...registerMessages,
  ...registerDoneMessages,
  ...loginMessages,
  ...venueListMessages,
  ...venueCreateMessages,
  ...staffListMessages,
  ...staffCreateMessages,
};
