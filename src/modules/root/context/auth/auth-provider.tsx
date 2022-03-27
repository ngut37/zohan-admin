import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/router';
import { session } from 'next-auth/client';

import { me } from '@api/auth/auth';
import { User } from '@api/auth/types';

import { Flex, Spinner } from '@chakra-ui/react';

import { colors } from '@styles';

import { AuthContext } from './auth-context';

type Props = PropsWithChildren<{ protectedPage?: boolean }>;

export const AuthProvider = ({ protectedPage = false, children }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [auth, setAuthState] = useState<User | undefined>();

  const authenticate = useCallback(async () => {
    const data = await me();
    if (data?.user) {
      // try custom auth
      setAuthState(data.user);
    }

    if (protectedPage && !data) {
      // re-route user to login page if not authenticated
      // ! This reroute is too sudden. Display error toast for clarity.
      router.push('./login');
    }

    setLoading(false);
  }, [session]);

  useEffect(() => {
    (async () => {
      await authenticate();
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
    <AuthContext.Provider value={{ auth, authenticate }}>
      {content}
    </AuthContext.Provider>
  );
};
