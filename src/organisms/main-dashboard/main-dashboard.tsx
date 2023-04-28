import React from 'react';

import dynamic from 'next/dynamic';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

import { BookingEditModal } from '@molecules/booking-edit-modal';

import { BookingCreateModal } from '@molecules/booking-create-modal';

import { DashboardProvider } from './context/dashboard-provider';

// dynamic import to prevent SSR which is not supported by ToastUI Calendar
const Calendar = dynamic(() => import('@molecules/tui-calendar-wrapper'), {
  ssr: false,
});

export const MainDashboard = () => {
  return (
    <DashboardProvider>
      <BookingEditModal />
      <BookingCreateModal />
      <Calendar />
    </DashboardProvider>
  );
};
