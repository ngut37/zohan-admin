import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HiArrowSmLeft } from 'react-icons/hi';

import { editVenueOrFail, EditVenuePayload, Venue } from '@api/venues';
import { SuggestionFormData } from '@api/address';

import { messageIdConcat } from '@utils/message-id-concat';
import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';

import { Button, Text } from '@atoms';

import {
  Flex,
  Skeleton,
  Stack,
  Image,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useToast,
} from '@chakra-ui/react';

import { AddressSuggestionInput } from './address-suggestion-input';
import { InputLabel } from './input-label';

const m = messageIdConcat('venues-list.item');

type Props = Venue & { onAfterSubmit?: () => Promise<void> };

export const VenueListItem = ({
  id,
  stringAddress,
  region,
  district,
  momc,
  onAfterSubmit,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [submitting, setSubmitting] = useState(false);

  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();

  const schema = yup.object().shape({
    stringAddress: yup
      .string()
      .required(messageToString({ id: m('input.address.required') }, intl)),
    regionString: yup.string().required(),
    districtString: yup.string().required(),
    quarterString: yup.string(),
    coordinates: yup.array(yup.number()).length(2),
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditVenuePayload>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<EditVenuePayload> = useCallback(
    async (data) => {
      setSubmitting(true);

      try {
        await editVenueOrFail(id, data);

        router.push('/venues', undefined, { shallow: true });

        toast({
          description: messageToString({ id: m('toast.success') }, intl),
          status: 'info',
          duration: 10000,
          isClosable: true,
        });
        onClose();
        onAfterSubmit && (await onAfterSubmit());
      } catch (e) {
        toast({
          description: messageToString({ id: 'error.api' }, intl),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [intl, toast],
  );

  const onAddressInputChangeHandler = useCallback(() => {
    setValue('stringAddress', '');
    setValue('regionString', '');
    setValue('districtString', '');
    setValue('quarterString', undefined);
    setValue('coordinates', [0, 0]);
  }, [setValue]);

  const onAddressDropdownItemClickHandler = useCallback(
    (suggestion: SuggestionFormData) => {
      const {
        stringAddress,
        regionString,
        districtString,
        quarterString,
        coordinates,
      } = suggestion;
      setValue('stringAddress', stringAddress);
      setValue('regionString', regionString);
      setValue('districtString', districtString);
      setValue('quarterString', quarterString);
      setValue('coordinates', coordinates);
    },
    [setValue],
  );

  const onButtonClick = () => {
    onOpen();
  };

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
          onClick={onButtonClick}
          marginRight="40px"
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="right"
        size="sm"
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text message={{ id: m('drawer.heading') }} />
          </DrawerHeader>

          <DrawerBody>
            <form>
              <InputLabel message={{ id: m('drawer.input.ico.label') }} />
              <AddressSuggestionInput
                inputProps={{
                  id: 'address',
                  autoComplete: 'off',
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.stringAddress),
                }}
                error={errors.stringAddress}
                onDropdownClick={onAddressDropdownItemClickHandler}
                onInputChange={onAddressInputChangeHandler}
              />
            </form>
          </DrawerBody>

          <DrawerFooter
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              leftIcon={<HiArrowSmLeft width="20px" />}
              message={{ id: m('drawer.button.close') }}
              variant="link"
              onClick={onClose}
            ></Button>
            <Button
              width="200px"
              size="lg"
              message={{ id: m('drawer.button.submit') }}
              onClick={handleSubmit(onSubmit)}
              isLoading={submitting}
            ></Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
