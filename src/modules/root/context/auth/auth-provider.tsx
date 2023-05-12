import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { logoutOrFail, refreshToken } from '@api/staff';

import {
  getAccessToken,
  parseAccessToken,
  removeAccessToken,
  saveAccessTokenToken,
  Staff,
  StaffRole,
} from '@utils/storage/auth';

import { AuthContext } from './auth-context';

type Props = PropsWithChildren<{ protectedPage?: boolean }>;

export const AuthProvider = ({ protectedPage = false, children }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [auth, setAuthState] = useState<Staff | undefined>();

  const authenticate = useCallback(async () => {
    setLoading(true);
    if (!protectedPage) {
      // A not a protected page -> no need to authenticate
      setLoading(false);
      return;
    }

    // check if access token is expired
    const accessToken = getAccessToken();
    let data = parseAccessToken(accessToken, {});

    // B access token not present or invalid -> get new access token using refresh token
    if (!data) {
      const { accessToken: refreshedAccessToken } =
        (await refreshToken()) || {};

      if (!refreshedAccessToken) {
        // B_1 refresh token is not valid/expired -> reroute to login page
        removeAccessToken();
        await logoutOrFail();
        setAuthState(undefined);
        router.push('/login');
        return;
      } else {
        // B_2 persist new access token in localstorage
        saveAccessTokenToken(refreshedAccessToken);
        data = parseAccessToken(refreshedAccessToken, {});
        router.reload();
      }
    }

    // C access token is valid -> set auth state
    if (data) {
      setAuthState(data);
    }

    setLoading(false);
    return;
  }, [setAuthState, router]);

  const hasOneOfRoles = useCallback(
    (roles: StaffRole[]) => {
      if (!auth) {
        return false;
      }
      return roles.includes(auth.role);
    },
    [auth],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      removeAccessToken();
      await logoutOrFail();
      setAuthState(undefined);
      router.push('/login');
    } catch {
      console.error('Logout API failed.');
    }
  }, [setAuthState, router, setLoading]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await authenticate();
      } catch {
        console.error('Authentication failed.');
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, hasOneOfRoles, authenticate, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
