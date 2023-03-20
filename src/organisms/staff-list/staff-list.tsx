import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { HiPlus } from 'react-icons/hi';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import { getAllStaffOrFail, Staff } from '@api/staff';

import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { Button } from '@atoms';

import { NoContentInfo } from '@molecules/no-content-info';
import {
  StaffListItem,
  StaffListItemSkeleton,
} from '@molecules/staff-list-item/staff-list-item';

import { Flex, Stack, useToast } from '@chakra-ui/react';

const m = messageIdConcat('staff-list');

export const StaffList = () => {
  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    (async () => {
      await fetchAndSetStaff();
    })();
  }, []);

  const fetchAndSetStaff = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedVenuesResult = await getAllStaffOrFail();

      setStaff(fetchedVenuesResult.staff);
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
  }, [setStaff, toast, setLoading]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <>
          <StaffListItemSkeleton color="dark" />
          <StaffListItemSkeleton color="light-dark" />
          <StaffListItemSkeleton color="light" />
        </>
      );
    }

    if (!staff.length) {
      return <NoContentInfo />;
    }

    return staff.map((staff) => (
      <>
        <StaffListItem
          key={staff._id}
          {...staff}
          onAfterSubmit={fetchAndSetStaff}
        />
      </>
    ));
  }, [loading, staff]);

  const onCreateButtonClick = () => {
    router.push('/staff/create', undefined, { shallow: true });
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
