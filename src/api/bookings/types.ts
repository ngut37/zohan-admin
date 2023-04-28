export type Booking = {
  _id: string;
  venue: string;
  staff: string;
  service: string;
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
} & (
  | {
      // booking created from administration
      customCustomer?: {
        name: string;
        email: string;
        phone: string;
      };
      existingCustomer?: never;
    }
  | {
      // booking created from website
      existingCustomer?: string;
      customCustomer?: never;
    }
);
