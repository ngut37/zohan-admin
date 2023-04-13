import React from 'react';

import { messageIdConcat } from '@utils/message-id-concat';

import { Text } from '@atoms';

const m = messageIdConcat('venue.edit.staff_tab');

export const StaffTab = () => {
  return (
    <Text
      paddingTop="20px"
      message={{ id: m('work_in_progress') }}
      fontSize="xl"
      color="gray.700"
      fontWeight="semibold"
    />
  );
};
