import React from 'react';

import { useRouter } from 'next/router';

import { Venue } from '@api/venues';

import { messageIdConcat } from '@utils/message-id-concat';

import { Button, Text } from '@atoms';

import { Flex, Skeleton, Stack, Image } from '@chakra-ui/react';

const m = messageIdConcat('venues-list.item');

type Props = Venue & { onAfterSubmit?: () => Promise<void> };

export const VenueListItem = ({
  _id: id,
  stringAddress,
  region,
  district,
  momc,
}: Props) => {
  const router = useRouter();

  return (
    <>
      <Flex
        width="100%"
        minWidth="780px"
        height="170px"
        justifyContent="space-between"
        alignItems="center"
        boxShadow="md"
        border="1px"
        borderColor="gray.100"
        borderRadius="md"
        overflow="hidden"
      >
        <Flex
          justifySelf="flex-start"
          width="33%"
          overflow="hidden"
          boxShadow="lg"
          overflowX="hidden"
          overflowY="hidden"
        >
          <Image
            width="100%"
            objectFit="cover"
            src="https://www.businessanimals.cz/wp-content/uploads/2017/05/fff.jpg"
            alt="placeholder"
          />
        </Flex>
        <Stack
          spacing="5px"
          width="33%"
          paddingY="20px"
          direction="column"
          justifyContent="space-between"
        >
          <Text
            message={{
              text: stringAddress,
            }}
            fontSize="xl"
            fontWeight="600"
          />

          <Text message={{ text: region }} fontSize="md" color="gray.600" />
          <Text
            marginTop="0px !important"
            message={{ text: momc || district }}
            fontSize="sm"
            color="gray.500"
          />
        </Stack>
        <Button
          message={{ id: m('button.edit') }}
          onClick={() => {
            router.push(`/venues/${id}`, undefined, { shallow: true });
          }}
          marginRight="40px"
        />
      </Flex>
    </>
  );
};

type VenueListItemSkeletonProps = {
  color?: 'dark' | 'light-dark' | 'light';
};

export const VenueListItemSkeleton = ({
  color,
}: VenueListItemSkeletonProps) => {
  const getStartColor = () => {
    switch (color) {
      case 'dark':
        return 'gray.400';
      case 'light-dark':
        return 'gray.300';
      case 'light':
        return 'gray.200';

      default:
        return 'gray.500';
    }
  };

  const getEndColor = () => {
    switch (color) {
      case 'dark':
        return 'gray.300';
      case 'light-dark':
        return 'gray.200';
      case 'light':
        return 'gray.50';

      default:
        return 'gray.200';
    }
  };
  return (
    <Flex
      width="100%"
      height="170px"
      justifyContent="space-between"
      alignItems="center"
      boxShadow="sm"
      borderColor="gray.100"
      borderRadius="md"
      overflow="hidden"
    >
      <Flex
        justifySelf="flex-start"
        width="320px"
        overflow="hidden"
        overflowX="hidden"
        overflowY="hidden"
      >
        <Skeleton
          width="100%"
          height="170px"
          startColor={getStartColor()}
          endColor={getEndColor()}
        />
      </Flex>
      <Stack
        spacing="5px"
        width="200px"
        paddingY="20px"
        direction="column"
        justifyContent="space-between"
      >
        <Skeleton
          height="30px"
          width="170px"
          startColor={getStartColor()}
          endColor={getEndColor()}
        />
        <Skeleton
          height="24px"
          width="190px"
          startColor={getStartColor()}
          endColor={getEndColor()}
        />
        <Skeleton
          height="21px"
          width="140px"
          startColor={getStartColor()}
          endColor={getEndColor()}
        />
      </Stack>
      <Skeleton
        marginRight="40px"
        height="40px"
        width="90px"
        startColor={getStartColor()}
        endColor={getEndColor()}
      />
    </Flex>
  );
};
