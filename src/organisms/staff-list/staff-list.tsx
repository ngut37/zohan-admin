import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { HiPlus } from 'react-icons/hi';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import { deleteStaffOrFail, getAllStaffOrFail, Staff } from '@api/staff';

import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { Button } from '@atoms';

import { NoContentInfo } from '@molecules/no-content-info';
import {
  StaffListItem,
  StaffListItemSkeleton,
} from '@molecules/staff-list-item/staff-list-item';

import { useAuth } from '@modules/root/context/auth';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Flex,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

const m = messageIdConcat('staff-list');

export const StaffList = () => {
  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const {
    isOpen: isDisclosureOpen,
    onOpen: onDisclosureOpen,
    onClose: onDisclosureClose,
  } = useDisclosure();

  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [dialogStaffId, setDialogStaffId] = useState<string>('');

  const extendedOnDisclosureOpen = useCallback(
    (staffId: string) => {
      setDialogStaffId(staffId);
      onDisclosureOpen();
    },
    [onDisclosureOpen, setDialogStaffId],
  );

  useEffect(() => {
    (async () => {
      await fetchAndSetStaff();
    })();
  }, []);

  const fetchAndSetStaff = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedVenuesResult = await getAllStaffOrFail();

      setStaff(fetchedVenuesResult);
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
      <StaffListItem
        key={staff._id}
        {...staff}
        onAfterSubmit={fetchAndSetStaff}
        onDelete={extendedOnDisclosureOpen}
      />
    ));
  }, [loading, staff]);

  const onCreateButtonClick = () => {
    router.push('/staff/create', undefined, { shallow: true });
  };

  const deleteStaffAlertDialog = useMemo(() => {
    return (
      <AlertDialog
        isCentered
        isOpen={isDisclosureOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={onDisclosureClose}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {messageToString({ id: m('delete_confirmation.title') }, intl)}
            </AlertDialogHeader>

            <AlertDialogBody>
              {messageToString({ id: m('delete_confirmation.subtitle') }, intl)}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelDeleteRef}
                onClick={onDisclosureClose}
                message={{ id: 'button.cancel' }}
                variant="outline"
              />
              <Button
                colorScheme="red"
                onClick={async () => {
                  await deleteStaffOrFail(dialogStaffId);
                  await fetchAndSetStaff();
                  onDisclosureClose();

                  toast({
                    description: messageToString(
                      { id: m('delete_confirmation.toast.success') },
                      intl,
                    ),
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                  });
                }}
                ml={3}
                message={{ id: 'button.confirm_delete' }}
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }, [isDisclosureOpen, onDisclosureClose, intl, dialogStaffId]);

  return (
    <Flex
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      width="100%"
      paddingX="300px"
      paddingY="50px"
    >
      {deleteStaffAlertDialog}
      <Stack width="100%" maxWidth="780px" minWidth="780px" spacing="30px">
        <Flex width="100%" height="60px" direction="row-reverse">
          <Button
            disabled={auth?.role !== 'admin'}
            size="lg"
            leftIcon={<HiPlus />}
            message={{ id: 'button.create' }}
            onClick={onCreateButtonClick}
          />
        </Flex>
        {content}
      </Stack>
    </Flex>
  );
};
