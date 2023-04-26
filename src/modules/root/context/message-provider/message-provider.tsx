import React, { PropsWithChildren, useState } from 'react';

import { IntlProvider } from 'react-intl';

import { cs } from '@messages';

import { isServer } from '@utils/is-client';

// intl polyfill
if (isServer) {
  const IntlPolyfill = require('intl');
  Intl.NumberFormat = IntlPolyfill.NumberFormat;
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  if (IntlPolyfill.__disableRegExpRestore)
    IntlPolyfill.__disableRegExpRestore();
}

type Props = PropsWithChildren<{}>;

export const MessagesProvider = ({ children }: Props) => {
  const [locale, _setLocale] = useState<string>('cs');

  return (
    <IntlProvider locale={locale} messages={cs}>
      {children}
    </IntlProvider>
  );
};
