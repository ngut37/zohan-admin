import React from 'react';

import { ImWarning } from 'react-icons/im';

import { Text } from '@atoms';

import { VStack } from '@chakra-ui/react';

export const NotSupportedDevice = () => {
  return (
    <VStack
      height="80vh"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      marginX="30px"
      spacing="20px"
    >
      <ImWarning fontSize="60px" color="orange" />
      <Text
        message={{ id: 'device_not_supported.title' }}
        fontSize="4xl"
        fontWeight="bold"
      />
      <Text
        message={{ id: 'device_not_supported.description' }}
        fontSize="2xl"
      />
    </VStack>
  );
};
