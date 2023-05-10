import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { HiArrowSmLeft, HiPlus } from 'react-icons/hi';
import { yupResolver } from '@hookform/resolvers/yup';
import { Select, SingleValue } from 'chakra-react-select';
import { MdInfo, MdInfoOutline } from 'react-icons/md';

import { config } from '@config';

import { getAllVenuesOrFail, Venue } from '@api/venues';
import { CreateStaffBody, createStaffOrFail } from '@api/staff';
import { HttpStatusCode } from '@api/utils';

import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';
import { StaffRole, STAFF_ROLES_ENUM } from '@utils/storage/auth';

import { Button, Card, Input, Text, Tooltip } from '@atoms';

import { InputLabel } from '@molecules/input-label';

import { useAuth } from '@modules/root/context/auth';

import {
  Divider,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  VStack,
  FormControl,
  FormErrorMessage,
  Box,
  HStack,
} from '@chakra-ui/react';

import classes from './staff-create-form.module.scss';

type Option = SingleValue<{ value: string; label: string }>;

const m = messageIdConcat('create.staff');

export const StaffCreateForm = () => {
  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();
  const { auth } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [venueOptions, setVenueOptions] = useState<Venue[]>([]);

  const rolesRadioOptions: { value: string; label: string; tooltip: string }[] =
    Object.keys(STAFF_ROLES_ENUM).map((role) => ({
      value: role,
      label: messageToString({ id: `role.${role}` }, intl),
      tooltip: messageToString({ id: `role.${role}.tooltip` }, intl),
    }));

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(messageToString({ id: m('input.email.error.format') }, intl))
      .required(messageToString({ id: m('input.email.error.required') }, intl)),
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
    role: yup
      .string()
      .nullable()
      .oneOf(
        Object.keys(STAFF_ROLES_ENUM),
        messageToString({ id: m('input.role.error.required') }, intl),
      )
      .required(messageToString({ id: m('input.role.error.required') }, intl)),
    venue: yup.string(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    formState: { errors },
  } = useForm<CreateStaffBody>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    (async () => {
      try {
        const venues = await getAllVenuesOrFail();
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

  const onSubmit: SubmitHandler<CreateStaffBody> = useCallback(
    async (data) => {
      setSubmitting(true);

      try {
        await createStaffOrFail(data);
        router.push('/staff', undefined, { shallow: true });

        toast({
          description: messageToString(
            {
              id: m('toast.success'),
              values: { name: data.name },
            },
            intl,
          ),
          status: 'info',
          duration: 10000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        if (error?.response?.status === HttpStatusCode.CONFLICT) {
          setError(
            'email',
            {
              message: messageToString(
                { id: m('input.email.error.conflict') },
                intl,
              ),
            },
            { shouldFocus: true },
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

  const onRoleChange = (role: StaffRole) => {
    setValue('role', role);
    trigger('role');
  };

  const onVenueMultiSelectChange = (option: Option) => {
    if (option?.value) {
      setValue('venue', option.value);
    }
  };

  const options = useMemo<Option[]>(
    () =>
      venueOptions.map((venue) => ({
        value: venue._id,
        label: venue.stringAddress,
      })),
    [venueOptions],
  );

  return (
    <Flex minH="80vh" flexDirection="column" justify="center" align="center">
      <Card maxWidth="500px" minWidth="500px">
        <VStack mb="40px" spacing="5px">
          <Text type="heading" message={{ id: m('heading') }} size="lg" />
          <Text type="text" message={{ id: m('sub_heading') }} fontSize="sm" />
        </VStack>
        <FormControl width="100%" justifyContent="center" alignItems="center">
          <VStack direction="column" alignItems="center" spacing="30px">
            {/* STAFF NAME */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.staff_name.label') }} />
              <Input
                inputProps={{
                  id: 'staffName',
                  placeholder: messageToString(
                    { id: m('input.staff_name.placeholder') },
                    intl,
                  ),
                  ...register('name'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.name),
                }}
                error={errors?.name}
              />
            </VStack>

            {/* EMAIL */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.email.label') }} />
              <Input
                inputProps={{
                  id: 'email',
                  autoComplete: 'email',
                  placeholder: messageToString(
                    { id: m('input.email.placeholder') },
                    intl,
                  ),

                  ...register('email'),
                }}
                formControlProps={{
                  isInvalid: Boolean(errors.email),
                }}
                error={errors?.email}
              />
            </VStack>

            {/* ROLE */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.role.label') }} />
              <FormControl
                id="role"
                isInvalid={Boolean(errors.role)}
                {...register('role')}
              >
                <RadioGroup
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
            </VStack>

            {/* VENUE */}
            <VStack spacing="5px" width="100%">
              <InputLabel message={{ id: m('input.venue.label') }} optional />
              <Select
                className={classes.multiSelectContainer}
                options={options}
                placeholder=""
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                onChange={onVenueMultiSelectChange}
                colorScheme="teal"
              />
            </VStack>
            <Button
              disabled={auth?.role !== 'admin'}
              leftIcon={<HiPlus />}
              size="lg"
              onClick={handleSubmit(onSubmit)}
              marginTop="20px"
              width="150px"
              message={{ id: 'button.create' }}
              isLoading={submitting}
            />
          </VStack>
        </FormControl>
        <Divider orientation="horizontal" my="20px" />
        <Button
          leftIcon={<HiArrowSmLeft width="20px" />}
          variant="link"
          onClick={() => router.push('/staff', undefined, { shallow: true })}
          message={{ id: 'button.back' }}
        />
      </Card>
    </Flex>
  );
};
