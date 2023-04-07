/* eslint-disable filenames/match-regex */
import React from 'react';

import { VenueEditForm } from '@organisms/venue-edit-form';

import { Root } from '@modules/root';

export default function VenuePage() {
  return (
    <Root>
      <VenueEditForm />
    </Root>
  );
}
