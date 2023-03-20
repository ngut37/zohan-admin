import React from 'react';

import { StaffCreateForm } from '@organisms/staff-create-form';

import { Root } from '@modules/root';

export default function CreateStaffPage() {
  return (
    <Root protectedPage>
      <StaffCreateForm />
    </Root>
  );
}
