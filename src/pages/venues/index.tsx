import React from 'react';

import { VenueList } from '@organisms/venue-list';

import { Root } from '@modules/root';

export default function VenuesPage() {
  return (
    <Root protectedPage>
      <VenueList />
    </Root>
  );
}
