import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { useIntl } from 'react-intl';

import { updateUser } from '@api/auth/auth';

import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';
import { yup } from '@utils/yup';

import { Button, Input, Text } from '@atoms';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Container,
  Divider,
  Flex,
  VStack,
} from '@chakra-ui/react';

import { colors } from '@styles';

type Inputs = {
  phoneNumber: string;
};

const m = messageIdConcat('phone_number');

export const PhoneNumberForm = () => {
  const intl = useIntl();
  const router = useRouter();

  const schema = yup.object().shape({
    phoneNumber: yup.string().phoneNumber(
      ['cs-CZ', 'sk-SK'],
      messageToString(
        {
          id: m('input.phone_number.error.format'),
        },
        intl,
      ),
    ),
  });

  const [submitting, setSubmitting] = useState(false);
  const [showAuthError, setShowAuthError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSubmitting(true);
    try {
      const user = await updateUser(data);
      if (user) {
        router.push('/component-pallette');
      }
    } catch (e) {
      setShowAuthError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const form = useMemo(() => {
    return (
      <Container width="300px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            spacing="20px"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            {/* PHONE NUMBER */}
            <Input
              inputProps={{
                id: 'phoneNumber',
                autoComplete: 'tel',
                ...register('phoneNumber'),
              }}
              formControlProps={{
                isInvalid: Boolean(errors.phoneNumber),
              }}
              error={errors?.phoneNumber}
            />
            <Divider />
            <Button
              size="lg"
              type="submit"
              message={{ id: m('button.submit') }}
            />
          </VStack>
        </form>
      </Container>
    );
  }, [errors.phoneNumber, submitting]);

  const loginError = useMemo(() => {
    if (showAuthError)
      return (
        <Alert my={5} pr={8} status="error" borderRadius={4} maxWidth="300px">
          <AlertIcon />
          <AlertTitle mr={2}>
            <Text message={{ id: 'error.api' }} color="gray.600"></Text>
          </AlertTitle>
          <CloseButton
            onClick={() => setShowAuthError(false)}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      );
  }, [showAuthError, intl, setShowAuthError]);

  return (
    <Flex
      my="40px"
      px="10px"
      width="100%"
      minH="80vh"
      justify="center"
      align="center"
    >
      <Flex
        w="100%"
        maxW="1200px"
        direction={['column', 'row-reverse']}
        justify={['center', 'space-evenly']}
        align={['center', 'flex-start']}
      >
        <Flex
          py="40px"
          px={['20px', '40px']}
          direction="column"
          justify="center"
          align="center"
          bgColor={colors.white.hex()}
          boxShadow="md"
          border="1px"
          borderColor="gray.100"
          borderRadius="md"
        >
          <Text
            type="heading"
            message={{ id: m('heading') }}
            size="lg"
            mb="40px"
          />
          <VStack
            direction="column"
            justify="center"
            align="center"
            width="100%"
          >
            {form}
            {loginError}
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
};
