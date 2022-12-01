import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { HiPlus } from 'react-icons/hi';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import { getAllVenuesOrFail, Venue } from '@api/venues';

import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { Button } from '@atoms';

import {
  VenueListItem,
  VenueListItemSkeleton,
} from '@molecules/venue-list-item';
import { NoContentInfo } from '@molecules/no-content-info';

import { Flex, Stack, useToast } from '@chakra-ui/react';

const m = messageIdConcat('venues-list');

export const VenueList = () => {
  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    (async () => {
      await fetchAndSetVenues();
    })();
  }, []);

  const fetchAndSetVenues = useCallback(async () => {
    try {
      const fetchedVenuesResult = await getAllVenuesOrFail();

      setVenues(fetchedVenuesResult.venues);
    } catch (error) {
      toast({
        description: messageToString({ id: 'error.api' }, intl),
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [setVenues, toast, setLoading]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <>
          <VenueListItemSkeleton color="dark" />
          <VenueListItemSkeleton color="light-dark" />
          <VenueListItemSkeleton color="light" />
        </>
      );
    }

    if (!venues.length) {
      return <NoContentInfo />;
    }

    return venues.map((venue) => (
      <VenueListItem
        key={venue.id}
        {...venue}
        onAfterSubmit={fetchAndSetVenues}
      />
    ));
  }, [loading, venues]);

  const onCreateButtonClick = () => {
    router.push('/create-venue', undefined, { shallow: true });
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      width="100%"
      paddingX="300px"
      paddingY="50px"
    >
      <Stack width="100%" maxWidth="780px" minWidth="780px" spacing="30px">
        <Flex width="100%" height="60px" direction="row-reverse">
          <Button
            leftIcon={<HiPlus />}
            message={{ id: m('button.create_venue') }}
            onClick={onCreateButtonClick}
          />
        </Flex>
        {content}
      </Stack>
    </Flex>
  );
};
