import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { Staff, StaffRole } from '@utils/storage/auth';

export type AuthContextType = {
  auth: Staff | undefined;
  hasOneOfRoles: (roles: StaffRole[]) => boolean;
  authenticate: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

/**
 * Custom React hook that provides user's authentication and authorization information.
 * Provider needs to be in parent/ancestor component.
 */
export const useAuth = () => useContext(AuthContext);

// set defaults here
export const AuthContext = createContext<AuthContextType>({
  auth: undefined,
  hasOneOfRoles: () => false,
  authenticate: async () => {},
  logout: async () => {},
  loading: true,
  setLoading: () => {},
});
