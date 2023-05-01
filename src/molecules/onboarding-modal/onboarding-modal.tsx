import React from 'react';

import { useIntl } from 'react-intl';

import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { Button, Text } from '@atoms';

import {
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const m = messageIdConcat('dashboard.onboarding_modal');

export const OnboardingModal = ({ isOpen, onClose }: Props) => {
  const intl = useIntl();

  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{messageToString({ id: m('title') }, intl)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="40px">
          <Text
            message={{ id: m('subtitle') }}
            fontSize="lg"
            marginBottom="10px"
          />
          <OrderedList>
            <ListItem>{messageToString({ id: m('step.1') }, intl)}</ListItem>
            <ListItem>{messageToString({ id: m('step.2') }, intl)}</ListItem>
            <ListItem>{messageToString({ id: m('step.3') }, intl)}</ListItem>
            <ListItem>{messageToString({ id: m('step.4') }, intl)}</ListItem>
          </OrderedList>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} size="lg">
            {messageToString({ id: 'button.understood' }, intl)}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
