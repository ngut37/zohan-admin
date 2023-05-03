import { globalMessages } from './global';
import { navbarMessages } from './organisms/navbar';
import { registerMessages } from './organisms/register';
import { loginMessages } from './organisms/login';
import { registerDoneMessages } from './organisms/register-done';
import { venueListMessages } from './organisms/venue-list';
import { venueCreateMessages } from './organisms/venue-create';
import { staffListMessages } from './organisms/staff-list';
import { staffCreateMessages } from './organisms/create-staff';
import { venueEditMessages } from './organisms/venue-edit';
import { dashboardMessages } from './organisms/dashboard';
import { dateTimePicker } from './molecules/date-time-picker';
import { timeOnlyPicker } from './molecules/time-only-picker';

export const cs = {
  ...globalMessages,

  // molecules
  ...dateTimePicker,
  ...timeOnlyPicker,

  // organisms
  ...navbarMessages,
  ...registerMessages,
  ...registerDoneMessages,
  ...loginMessages,
  ...venueListMessages,
  ...venueCreateMessages,
  ...venueEditMessages,
  ...staffListMessages,
  ...staffCreateMessages,
  ...dashboardMessages,
};
