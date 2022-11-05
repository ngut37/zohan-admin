import React from 'react';

import { MainDashboard } from '@organisms/main-dashboard';

import { Root } from '@modules/root';

export default function Home() {
  return (
    <Root protectedPage>
      <MainDashboard />
    </Root>
  );
}
