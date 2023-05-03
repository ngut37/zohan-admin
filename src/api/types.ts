import { enumerate } from '@utils/enumerate';

export type ResponseResult<T = never> = {
  success: boolean;
  data: T;
};

export type Time = {
  hour: number;
  minute: number;
};

export type BusinessHoursInterval = {
  openingTime: Time;
  closingTime: Time;
};

export type WeeklyBusinessHours = Partial<
  { [x in Day]: BusinessHoursInterval }
>;

export const DAYS = enumerate('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

export type Day = keyof typeof DAYS;
