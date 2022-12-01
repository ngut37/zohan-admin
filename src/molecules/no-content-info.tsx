import React from 'react';

import { Text } from '@atoms';

import { Flex } from '@chakra-ui/react';

export const NoContentInfo = () => {
  return (
    <Flex direction="column" justify="center" align="center" opacity="50%">
      <Text message={{ id: 'no_content' }} fontSize="24" />
      <Text message={{ text: '💁' }} fontSize="48" />
    </Flex>
  );
};
