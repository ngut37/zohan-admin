import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiOutlineAtSymbol, HiOutlineLockClosed } from 'react-icons/hi';

import { yupResolver } from '@hookform/resolvers/yup';

import { useIntl } from 'react-intl';

import { login } from '@api/auth/auth';

import { messageToString } from '@utils/message';
import { yup } from '@utils/yup';
import { messageIdConcat } from '@utils/message-id-concat';

import { Button, Input, Link, Text } from '@atoms';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Divider,
  Flex,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react';

import { colors } from '@styles';

import classes from './login-form.module.scss';

type Inputs = {
  email: string;
  password: string;
};

const m = messageIdConcat('login');

export const LoginForm = () => {
  const intl = useIntl();
  const router = useRouter();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(messageToString({ id: m('input.email.error.format') }, intl))
      .required(messageToString({ id: m('input.email.error.required') }, intl)),
    password: yup
      .string()
      .required(
        messageToString({ id: m('input.password.error.required') }, intl)
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
      const { success } = await login(data);
      if (success) {
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
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formWrapper}>
        <VStack spacing={5} width="100%">
          <Input
            inputProps={{
              id: 'email',
              autoComplete: 'email',
              placeholder: messageToString(
                { id: m('input.email.placeholder') },
                intl
              ),
              ...register('email'),
            }}
            formControlProps={{
              isInvalid: Boolean(errors.email),
            }}
            inputGroupPropsWithChildren={{
              children: (
                <InputLeftElement pointerEvents="none">
                  <HiOutlineAtSymbol color={colors.gray_400.hex()} />
                </InputLeftElement>
              ),
            }}
            error={errors?.email}
          />
          <Input
            inputProps={{
              id: 'password',
              type: 'password',
              placeholder: messageToString(
                { id: m('input.password.placeholder') },
                intl
              ),
              ...register('password'),
            }}
            inputGroupPropsWithChildren={{
              children: (
                <InputLeftElement pointerEvents="none">
                  <HiOutlineLockClosed color={colors.gray_400.hex()} />
                </InputLeftElement>
              ),
            }}
            formControlProps={{
              isInvalid: Boolean(errors.password),
            }}
            error={errors?.password}
          />
          <Button
            size="lg"
            type="submit"
            width="100%"
            message={{ id: m('input.button') }}
            isLoading={submitting}
          />
        </VStack>
      </form>
    );
  }, [errors.email, errors.password, submitting]);

  const loginError = useMemo(() => {
    if (showAuthError)
      return (
        <Alert my={5} pr={8} status="error" borderRadius={4} maxWidth="300px">
          <AlertIcon />
          <AlertTitle mr={2}>
            <Text message={{ id: m('error') }} color="gray.600"></Text>
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
      <Flex w="100%" maxW="1200px" justify="center" align="center">
        <Flex
          minW="400px"
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
          <VStack
            direction="column"
            justify="center"
            align="center"
            width="100%"
          >
            {form}
            {loginError}
          </VStack>
          <Divider orientation="horizontal" my="10px" />
          <Link href="/register">
            <Button
              variant="ghost"
              type="submit"
              message={{ id: m('link.register') }}
            />
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};
