import React from 'react';

import { VenueCreateForm } from '@organisms/venue-create-form';

import { Root } from '@modules/root';

export default function CreateVenuePage() {
  return (
    <Root protectedPage>
      <VenueCreateForm />
    </Root>
  );
}
