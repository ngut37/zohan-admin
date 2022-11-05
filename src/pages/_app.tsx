import React from 'react';

import { AppProps } from 'next/app';

import { ChakraProvider, CSSReset } from '@chakra-ui/react';

import '@styles/global.scss';
import '@styles/normalize.scss';

import { theme } from '@styles';

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
