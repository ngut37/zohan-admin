import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { UseFormReturn } from 'react-hook-form';
import { endOfDay, startOfDay } from 'date-fns';
import { EventObject } from '@toast-ui/calendar';

import { Booking } from '@api/bookings';
import { Venue } from '@api/venues';
import { Staff } from '@api/staff';
import { Service } from '@api/services';

import { useToast } from '@chakra-ui/react';

export type ModalData = Pick<
  Booking,
  '_id' | 'venue' | 'staff' | 'service' | 'start' | 'end' | 'customCustomer'
> & {
  venueData: Venue;
  staffData?: Staff;
  serviceData: Service;
  existingCustomerData: {
    id: string;
    name: string;
    email: string;
    phone?: string; // not implemented yet
  };
};

export type BookingModalFormValues = {
  venueId: string;
  staffId?: string;
  serviceId?: string;
  start?: Date;
  end?: Date;
  customCustomer?: {
    name: string;
    email: string;
    phone: string;
  };
  existingCustomer?: string;
};

export type BookingDateRange = {
  start: Date;
  end: Date;
};

export type DashboardContextType = {
  loading: boolean;
  availableVenues: Venue[];
  setAvailableVenues: Dispatch<SetStateAction<Venue[]>>;
  availableStaff: Staff[];
  setAvailableStaff: Dispatch<SetStateAction<Staff[]>>;
  selectedVenue: Venue | undefined;
  setSelectedVenue: Dispatch<SetStateAction<Venue | undefined>>;
  bookingDateRange: BookingDateRange;
  setBookingDateRange: Dispatch<SetStateAction<BookingDateRange>>;
  bookings: EventObject[];
  setBookings: Dispatch<SetStateAction<EventObject[]>>;
  refetchBookings: () => Promise<void>;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  createModalOpen: boolean;
  setCreateModalOpen: Dispatch<SetStateAction<boolean>>;
  assignStaffModalOpen: boolean;
  setAssignStaffModalOpen: Dispatch<SetStateAction<boolean>>;
  modalData: ModalData | undefined;
  setModalData: (modalDate: ModalData) => void;
  clearModalData: () => void;
  hookform: UseFormReturn<BookingModalFormValues, {}>;
  toast: ReturnType<typeof useToast>;
};

// used for booking date range
const todaysDate = new Date();

export const DashboardContext = createContext<DashboardContextType>({
  loading: true,
  availableVenues: [],
  setAvailableVenues: () => {},
  availableStaff: [],
  setAvailableStaff: () => {},
  selectedVenue: undefined,
  setSelectedVenue: () => {},
  bookingDateRange: {
    start: startOfDay(todaysDate),
    end: endOfDay(todaysDate),
  },
  setBookingDateRange: () => {},
  bookings: [],
  setBookings: () => {},
  refetchBookings: () => Promise.resolve(),
  modalOpen: false,
  setModalOpen: () => {},
  createModalOpen: false,
  setCreateModalOpen: () => {},
  assignStaffModalOpen: false,
  setAssignStaffModalOpen: () => {},
  modalData: undefined,
  setModalData: () => {},
  clearModalData: () => {},
  hookform: {} as UseFormReturn<BookingModalFormValues, {}>,
  toast: {} as ReturnType<typeof useToast>,
});

export const useDashboard = () => useContext(DashboardContext);
