import React, { PropsWithChildren, useMemo } from 'react';

import { Flex, Spinner } from '@chakra-ui/react';

import { colors } from '@styles';

import { useAuth } from './context/auth';

type Props = PropsWithChildren<{ hidden?: boolean }>;

export const Content = ({ hidden, children }: Props) => {
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

  return <>{content}</>;
};
