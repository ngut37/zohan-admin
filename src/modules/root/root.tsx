import React, { PropsWithChildren } from 'react';

import { Navbar } from '@organisms/navbar';

import { MessagesProvider } from './context/message-provider';
import { AuthProvider } from './context/auth';

export type RootProps = { protectedPage?: boolean; hidden?: boolean };

type Props = PropsWithChildren<RootProps>;

export const Root = ({ protectedPage = false, hidden, children }: Props) => {
  if (hidden) return null;

  return (
    <>
      <AuthProvider protectedPage={protectedPage}>
        <MessagesProvider>
          <Navbar />
          {children}
        </MessagesProvider>
      </AuthProvider>
    </>
  );
};
