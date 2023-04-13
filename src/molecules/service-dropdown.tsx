import React, { PropsWithChildren, useEffect } from 'react';

import { Message } from '@utils/message';

import { Text } from '@atoms';

import {
  Checkbox,
  Collapse,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

type Props = PropsWithChildren<{
  message: Message;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}>;

export const ServiceDropdown = ({
  message,
  isOpen,
  onOpen,
  onClose,
  children,
}: Props) => {
  const {
    isOpen: isOpenDisclosure,
    onOpen: onOpenDisclosure,
    onClose: onCloseDisclosure,
  } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      onOpenDisclosure();
    }
  }, []);

  return (
    <VStack>
      <HStack alignItems="center" w="100%">
        <Checkbox
          size="lg"
          colorScheme="teal"
          isChecked={isOpenDisclosure}
          onChange={(e) => {
            if (e.target.checked) {
              onOpenDisclosure();
              onOpen && onOpen();
            } else {
              onCloseDisclosure();
              onClose && onClose();
            }
          }}
        />
        <Text message={message} />
      </HStack>
      <Collapse in={isOpenDisclosure} animateOpacity unmountOnExit>
        {children}
      </Collapse>
    </VStack>
  );
};
