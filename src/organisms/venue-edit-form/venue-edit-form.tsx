import React from 'react';

import { useRouter } from 'next/router';
import { HiArrowSmLeft } from 'react-icons/hi';
import { useIntl } from 'react-intl';

import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';

import { Button } from '@atoms';

import {
  Flex,
  VStack,
  HStack,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';

import { InformationTab } from './tabs/information-tab';
import { StaffTab } from './tabs/staff-tab';
import { ServicesTab } from './tabs/services-tab';

const m = messageIdConcat('venue.edit');

export const VenueEditForm = () => {
  const intl = useIntl();
  const router = useRouter();

  const { id: venueId } = router.query;

  return (
    <VStack w="100%" justifyContent="center" my="70px">
      <HStack
        w="100%"
        px="50px"
        maxWidth="1200px"
        justifyContent="center"
        spacing="20px"
        alignItems="flex-start"
      >
        <Flex w="30%" h="300px" direction="column" justifyContent="flex-start">
          <Button
            leftIcon={<HiArrowSmLeft width="20px" />}
            message={{ id: 'button.back' }}
            mb="20px"
            width="30px"
            variant="link"
            onClick={() => router.back()}
          />
          <Flex borderRadius="md" overflow="hidden">
            <Image
              width="100%"
              objectFit="cover"
              src="https://www.businessanimals.cz/wp-content/uploads/2017/05/fff.jpg"
              alt="placeholder"
            />
          </Flex>
        </Flex>
        <VStack w="70%" h="600px" paddingLeft="20px" alignItems="flex-start">
          <Tabs variant="enclosed" colorScheme="teal">
            <TabList>
              <Tab _focus={{ outline: 'none' }}>
                {messageToString({ id: m('tab.information') }, intl)}
              </Tab>
              <Tab _focus={{ outline: 'none' }}>
                {messageToString({ id: m('tab.staff') }, intl)}
              </Tab>
              <Tab _focus={{ outline: 'none' }}>
                {messageToString({ id: m('tab.services') }, intl)}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <InformationTab venueId={venueId as string} />
              </TabPanel>
              <TabPanel>
                <StaffTab />
              </TabPanel>
              <TabPanel>
                <ServicesTab venueId={venueId as string} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </HStack>
    </VStack>
  );
};
