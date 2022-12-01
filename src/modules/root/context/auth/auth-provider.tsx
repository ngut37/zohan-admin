import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
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
} from '@utils/storage/auth';

import { Flex, Spinner } from '@chakra-ui/react';

import { colors } from '@styles';

import { AuthContext } from './auth-context';

type Props = PropsWithChildren<{ protectedPage?: boolean }>;

export const AuthProvider = ({ protectedPage = false, children }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [auth, setAuthState] = useState<Staff | undefined>();

  const authenticate = useCallback(async () => {
    if (!protectedPage) {
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
        setAuthState(undefined);
        router.push('./login');
      } else {
        // B_2 persist new access token in localstorage
        saveAccessTokenToken(refreshedAccessToken);
        data = parseAccessToken(refreshedAccessToken, {});
      }
    }

    // A access token is valid or was revalidated -> use it
    if (data) {
      setAuthState(data);
    }
    return;
  }, [setAuthState, router]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutOrFail();
      removeAccessToken();
      setAuthState(undefined);
      router.push('./login');
    } catch {
      console.error('Logout API failed.');
    } finally {
      setLoading(false);
    }
  }, [setAuthState, router]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await authenticate();
        setLoading(false);
      } catch {
        console.error('Authentication failed.');
      }
    })();
  }, []);

  const content = useMemo(
    () =>
      loading ? (
        <Flex width="100%" height="100vh" justify="center" align="center">
          <Spinner
            thickness="4px"
            speed="0.85s"
            emptyColor={colors.white.hex()}
            color={colors.teal_500.hex()}
            size="xl"
          />
        </Flex>
      ) : (
        children
      ),
    [loading],
  );

  return (
    <AuthContext.Provider
      value={{ auth, authenticate, logout, loading, setLoading }}
    >
      {content}
    </AuthContext.Provider>
  );
};
