import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useIntl } from 'react-intl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HiArrowSmLeft } from 'react-icons/hi';
import { MdInfo, MdInfoOutline } from 'react-icons/md';
import { Select, SingleValue } from 'chakra-react-select';

import { config } from '@config';

import { EditStaffBody, editStaffOrFail, Staff } from '@api/staff';
import { getAllVenuesOrFail, Venue } from '@api/venues';
import { HttpStatusCode } from '@api/utils';

import { messageIdConcat } from '@utils/message-id-concat';
import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';
import { StaffRole, STAFF_ROLES_ENUM } from '@utils/storage/auth';

import { Button, Input, Text, Tooltip } from '@atoms';

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
  FormControl,
  RadioGroup,
  Radio,
  FormErrorMessage,
  Box,
  VStack,
  HStack,
} from '@chakra-ui/react';

import { InputLabel } from '../input-label';

import classes from './staff-list-item.module.scss';

const m = messageIdConcat('staff-list.item');

type Option = SingleValue<{ value: string; label: string }>;

type Props = Staff & { onAfterSubmit?: () => Promise<void> };

export const StaffListItem = ({
  _id,
  email,
  name,
  role,
  venue: initialVenue,
  onAfterSubmit,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [submitting, setSubmitting] = useState(false);
  const [venueOptions, setVenueOptions] = useState<Venue[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { venues } = await getAllVenuesOrFail();
        setVenueOptions(venues);
      } catch (error) {
        toast({
          description: messageToString({ id: 'error.api' }, intl),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    })();
  }, []);

  const intl = useIntl();
  const toast = useToast();

  const rolesRadioOptions: { value: string; label: string; tooltip: string }[] =
    Object.keys(STAFF_ROLES_ENUM).map((role) => ({
      value: role,
      label: messageToString({ id: `role.${role}` }, intl),
      tooltip: messageToString({ id: `role.${role}.tooltip` }, intl),
    }));

  const schema = yup.object().shape({
    name: yup
      .string()
      .strict()
      .min(
        config.MIN_NAME_LENGTH,
        messageToString(
          {
            id: m('input.name.error.min'),
            values: { length: config.MIN_NAME_LENGTH },
          },
          intl,
        ),
      )
      .max(
        config.MAX_NAME_LENGTH,
        messageToString(
          {
            id: m('input.name.error.max'),
            values: { length: config.MAX_NAME_LENGTH },
          },
          intl,
        ),
      )
      .required(messageToString({ id: m('input.name.error.required') }, intl)),
    email: yup
      .string()
      .email(messageToString({ id: m('input.email.error.format') }, intl))
      .required(messageToString({ id: m('input.email.error.required') }, intl)),
    role: yup
      .string()
      .oneOf(Object.keys(STAFF_ROLES_ENUM))
      .required(messageToString({ id: m('input.role.error.required') }, intl)),
    venue: yup.string(),
  });

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EditStaffBody>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      name,
      email,
      role,
      venue: initialVenue._id,
    },
  });

  const onRoleChange = (role: StaffRole) => {
    setValue('role', role);
  };

  const onSubmit: SubmitHandler<EditStaffBody> = useCallback(
    async (data) => {
      setSubmitting(true);

      try {
        await editStaffOrFail(_id, data);

        toast({
          description: messageToString({ id: m('toast.success') }, intl),
          status: 'info',
          duration: 10000,
          isClosable: true,
        });
        onClose();
        onAfterSubmit && (await onAfterSubmit());
      } catch (e) {
        if (e?.response?.status === HttpStatusCode.CONFLICT) {
          setError(
            'email',
            {
              message: messageToString(
                { id: m('input.email.error.conflict') },
                intl,
              ),
            },
            { shouldFocus: false },
          );
        } else {
          toast({
            description: messageToString({ id: 'error.api' }, intl),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [intl, toast],
  );

  const options = useMemo<Option[]>(
    () =>
      venueOptions.map((venue) => ({
        value: venue._id,
        label: venue.stringAddress,
      })),
    [venueOptions],
  );

  const onVenueMultiSelectChange = (option: Option) => {
    if (option?.value) {
      setValue('venue', option.value);
    }
  };

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
            src="https://100k-faces.glitch.me/random-image"
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
              text: name,
            }}
            fontSize="xl"
            fontWeight="600"
          />

          <Text message={{ text: email }} fontSize="md" color="gray.600" />
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
              <VStack spacing="10px">
                <InputLabel message={{ id: m('drawer.input.name.label') }} />
                <Input
                  inputProps={{
                    id: 'staffName',
                    placeholder: messageToString(
                      { id: m('drawer.input.staff_name.placeholder') },
                      intl,
                    ),
                    ...register('name'),
                  }}
                  formControlProps={{
                    isInvalid: Boolean(errors.name),
                  }}
                  error={errors?.name}
                />
                <InputLabel message={{ id: m('drawer.input.email.label') }} />
                <Input
                  inputProps={{
                    id: 'email',
                    autoComplete: 'email',
                    placeholder: messageToString(
                      { id: m('drawer.input.email.placeholder') },
                      intl,
                    ),

                    ...register('email'),
                  }}
                  formControlProps={{
                    isInvalid: Boolean(errors.email),
                  }}
                  error={errors?.email}
                />
                <InputLabel message={{ id: m('drawer.input.role.label') }} />
                <FormControl
                  id="role"
                  isInvalid={Boolean(errors.role)}
                  {...register('role')}
                >
                  <RadioGroup
                    defaultValue={role}
                    onChange={(value) => onRoleChange(value as StaffRole)}
                    width="100%"
                  >
                    <Stack
                      direction="column"
                      alignItems="flex-start"
                      width="100%"
                    >
                      {rolesRadioOptions.map(
                        ({ value, label, tooltip }, index) => {
                          return (
                            <Radio key={index} value={value}>
                              <Tooltip
                                label={tooltip}
                                placement="right"
                                position="absolute"
                                display="initial"
                              >
                                <HStack spacing="5px">
                                  <Text message={{ text: label }} />
                                  <MdInfoOutline fontSize="17px" />
                                </HStack>
                              </Tooltip>
                            </Radio>
                          );
                        },
                      )}
                    </Stack>
                  </RadioGroup>
                  {errors.role && (
                    <FormErrorMessage overflowWrap="anywhere">
                      <Box marginRight="5px">
                        <MdInfo fontSize="17px" />
                      </Box>
                      {errors.role.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <InputLabel message={{ id: m('drawer.input.venue.label') }} />
                <Select
                  className={classes.multiSelectContainer}
                  options={options as { label: string; value: string }[]} // type hack
                  defaultValue={{
                    label: initialVenue.stringAddress,
                    value: initialVenue._id,
                  }}
                  placeholder={messageToString(
                    {
                      id: m('drawer.input.venue.placeholder'),
                    },
                    intl,
                  )}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  onChange={onVenueMultiSelectChange}
                  colorScheme="teal"
                />
              </VStack>
            </form>
          </DrawerBody>

          <DrawerFooter
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              leftIcon={<HiArrowSmLeft width="20px" />}
              message={{
                id: m('drawer.button.close'),
              }}
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

type StaffListItemSkeletonProps = {
  color?: 'dark' | 'light-dark' | 'light';
};

export const StaffListItemSkeleton = ({
  color,
}: StaffListItemSkeletonProps) => {
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
        width="33%"
        overflow="hidden"
        boxShadow="lg"
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
        width="33%"
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
