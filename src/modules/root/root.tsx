import React, { PropsWithChildren } from 'react';

import { Navbar } from '@organisms/navbar';

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
        <Content hidden={hidden}>{children}</Content>
      </MessagesProvider>
    </AuthProvider>
  );
};
