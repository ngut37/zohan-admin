import { createContext, useContext } from 'react';

import { Staff } from '@utils/storage/auth';

export type AuthContextType = {
  auth: Staff | undefined;
  authenticate: () => Promise<void>;
  logout: () => Promise<void>;
};

/**
 * Custom React hook that provides user's authentication and authorization information.
 * Provider needs to be in parent/ancestor component.
 */
export const useAuth = () => useContext(AuthContext);

// set defaults here
export const AuthContext = createContext<AuthContextType>({
  auth: undefined,
  authenticate: async () => {},
  logout: async () => {},
});
