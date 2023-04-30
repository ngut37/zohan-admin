import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiOutlineAtSymbol, HiOutlineLockClosed } from 'react-icons/hi';

import { yupResolver } from '@hookform/resolvers/yup';

import { useIntl } from 'react-intl';

import { loginOrFail } from '@api/staff';

import { HttpStatusCode, getResponseStatusCode } from '@api/utils';

import { messageToString } from '@utils/message';
import { yup } from '@utils/yup';
import { messageIdConcat } from '@utils/message-id-concat';
import { saveAccessTokenToken } from '@utils/storage/auth';

import { Button, Card, Input, Link } from '@atoms';

import {
  Divider,
  Flex,
  InputLeftElement,
  useToast,
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
  const toast = useToast();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(messageToString({ id: m('input.email.error.format') }, intl))
      .required(messageToString({ id: m('input.email.error.required') }, intl)),
    password: yup
      .string()
      .required(
        messageToString({ id: m('input.password.error.required') }, intl),
      ),
  });

  const [submitting, setSubmitting] = useState(false);

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
      const { accessToken } = await loginOrFail(data);

      saveAccessTokenToken(accessToken);
      router.push('/');
    } catch (error) {
      if (
        error.response &&
        getResponseStatusCode(error.response) === HttpStatusCode.UNAUTHORIZED
      ) {
        toast({
          description: messageToString({ id: m('toast.login_error') }, intl),
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          description: messageToString({ id: 'error.api' }, intl),
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      }
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
                intl,
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
                intl,
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
        <Card minW="400px">
          <VStack
            direction="column"
            justify="center"
            align="center"
            width="100%"
          >
            {form}
          </VStack>
          <Divider orientation="horizontal" my="10px" />
          <Link href="/register">
            <Button
              variant="ghost"
              type="submit"
              message={{ id: m('link.register') }}
            />
          </Link>
        </Card>
      </Flex>
    </Flex>
  );
};
