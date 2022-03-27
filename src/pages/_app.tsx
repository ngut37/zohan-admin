import React from 'react';

import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

import { ChakraProvider, CSSReset } from '@chakra-ui/react';

import '@styles/global.scss';
import '@styles/normalize.scss';

import { theme } from '@styles';

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
