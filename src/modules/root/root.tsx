import React, { PropsWithChildren } from 'react';

import { NotSupportedDevice } from '@molecules/not-supported-device';

import { Navbar } from '@organisms/navbar';

import { Show } from '@chakra-ui/react';

import { Content } from './content';
import { MessagesProvider } from './context/message-provider';
import { AuthProvider } from './context/auth';

export type RootProps = { protectedPage?: boolean; hidden?: boolean };

type Props = PropsWithChildren<RootProps>;

export const Root = ({ protectedPage = false, hidden, children }: Props) => {
  return (
    <AuthProvider protectedPage={protectedPage}>
      <MessagesProvider>
        <Navbar />
        <Show above="lg">
          <Content hidden={hidden}>{children}</Content>
        </Show>
        <Show below="lg">
          <NotSupportedDevice />
        </Show>
      </MessagesProvider>
    </AuthProvider>
  );
};
