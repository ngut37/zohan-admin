import React, { PropsWithChildren, useMemo } from 'react';

import { Navbar } from '@organisms/navbar';

import { Flex, Spinner } from '@chakra-ui/react';

import { colors } from '@styles';

import { MessagesProvider } from './context/message-provider';
import { AuthProvider, useAuth } from './context/auth';

export type RootProps = { protectedPage?: boolean; hidden?: boolean };

type Props = PropsWithChildren<RootProps>;

export const Root = ({ protectedPage = false, hidden, children }: Props) => {
  const { loading } = useAuth();

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
    [loading, children],
  );

  if (hidden) return null;

  return (
    <AuthProvider protectedPage={protectedPage}>
      <MessagesProvider>
        <Navbar />
        {content}
      </MessagesProvider>
    </AuthProvider>
  );
};
