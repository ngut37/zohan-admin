import React from 'react';

import { StaffList } from '@organisms/staff-list';

import { Root } from '@modules/root';

export default function StaffPage() {
  return (
    <Root protectedPage>
      <StaffList />
    </Root>
  );
}
