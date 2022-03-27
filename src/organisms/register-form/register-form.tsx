import React, { useMemo, useState } from 'react';

import { useCallback } from 'react';

import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { SubmitHandler, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { register as authRegister } from '@api/auth/auth';
import { fetchAndFormatCompany } from '@api/company';
import { suggest } from '@api/smap';

import { Message, messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';
import { yup } from '@utils/yup';

import { useDebouncedCallback } from '@hooks/use-debounce-callback';

import { Button, Input, Link, Text } from '@atoms';

import { InputLabel } from '@molecules/input-label';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Divider,
  Flex,
  VStack,
} from '@chakra-ui/react';

import { colors } from '@styles';

import classes from './register-form.module.scss';
import { SuggestionInput } from '@molecules/address-suggestion-input';

type Inputs = {
  ico: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type IcoInputs = {
  ico: string;
};

const minNameLength = 2;
const maxNameLength = 64;
const minPasswordLength = 6;
const maxPasswordLength = 256;

const m = messageIdConcat('register');

export const RegisterForm = () => {
  const intl = useIntl();
  const router = useRouter();

  const schema = yup.object().shape({
    ico: yup
      .string()
      .ico(messageToString({ id: m('input.ico.error.format') }, intl)),
    name: yup
      .string()
      .strict()
      .min(
        minNameLength,
        messageToString(
          {
            id: m('input.name.error.min'),
            values: { length: minNameLength },
          },
          intl,
        ),
      )
      .max(
        maxNameLength,
        messageToString(
          {
            id: m('input.name.error.max'),
            values: { length: maxNameLength },
          },
          intl,
        ),
      )
      .required(messageToString({ id: m('input.name.error.required') }, intl)),
    address: yup.object().shape({
      district: yup.string(),
      municipality: yup.string(),
      municipalityPart: yup.string(),
      momc: yup.string(),
      street: yup.string(),
      houseNumber: yup.string(),
      streetNumber: yup.string(),
    }),
    email: yup
      .string()
      .email(messageToString({ id: m('input.email.error.format') }, intl))
      .required(messageToString({ id: m('input.email.error.required') }, intl)),
    password: yup
      .string()
      .min(
        minPasswordLength,
        messageToString({ id: m('input.password.error.min') }, intl),
      )
      .max(
        maxPasswordLength,
        messageToString({ id: m('input.password.error.max') }, intl),
      )
      .required(
        messageToString({ id: m('input.password.error.required') }, intl),
      ),
    passwordConfirm: yup
      .string()
      .oneOf(
        [yup.ref('password'), null],
        messageToString({ id: m('input.password_confirm.error.match') }, intl),
      )
      .required(
        messageToString({ id: m('input.password_confirm.error.match') }, intl),
      ),
  });

  const icoSchema = yup.object().shape({
    ico: yup
      .string()
      .ico(messageToString({ id: m('input.ico.error.format') }, intl)),
  });

  const [submitting, setSubmitting] = useState(false);
  const [icoSubmitting, setIcoSubmitting] = useState(false);
  const [showAuthError, setShowAuthError] = useState<
    { statusCode?: number; errorMessage: Message } | undefined
  >(undefined);

  // DEFAULT REGISTER
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  // ICO REGISTER
  const {
    register: icoRegister,
    handleSubmit: icoHandleSubmit,
    formState: { errors: icoErrors },
  } = useForm<IcoInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(icoSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSubmitting(true);
    const { passwordConfirm: _pc, ...restData } = data;

    console.log(restData);
    try {
      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      if (e?.response?.status === 409) {
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
        setShowAuthError({
          statusCode: e?.response?.status,
          errorMessage: { id: m('error.general') },
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const icoOnSubmit: SubmitHandler<IcoInputs> = async (data) => {
    setIcoSubmitting(true);

    try {
      const result = await fetchAndFormatCompany(data.ico);
      console.log(result);
      setIcoSubmitting(false);
    } catch (e) {
      console.log(e);
    }

    console.log(data);
  };

  const debouncedSuggestionChange = useDebouncedCallback(
    async (element: any) => {
      const results = await suggest(element.target.value);

      const addresses = results.filter(
        (result) => result.category === 'address_cz',
      );

      console.log(addresses);
    },
    500,
  );

  const form = useMemo(() => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formWrapper}>
        <VStack spacing={5}>
          {/* ICO */}
          <InputLabel message={{ id: m('input.ico.label') }} />
          <Input
            inputProps={{
              id: 'name',
              placeholder: messageToString(
                { id: m('input.ico.placeholder') },
                intl,
              ),
              variant: 'flushed',
              ...register('ico'),
            }}
            formControlProps={{
              isInvalid: Boolean(errors.ico),
            }}
            error={errors?.ico}
          />

          {/* NAME */}
          <InputLabel message={{ id: m('input.name.label') }} />
          <Input
            inputProps={{
              id: 'name',
              placeholder: messageToString(
                { id: m('input.name.placeholder') },
                intl,
              ),
              variant: 'flushed',
              ...register('name'),
            }}
            formControlProps={{
              isInvalid: Boolean(errors.name),
            }}
            error={errors?.name}
          />

          {/* ADDRESS */}
          <InputLabel message={{ id: m('input.address.label') }} />
          <Input
            inputProps={{
              id: 'name',
              placeholder: messageToString(
                { id: m('input.address.placeholder') },
                intl,
              ),
              variant: 'flushed',
              onChange: debouncedSuggestionChange,
            }}
          />

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <InputLabel message={{ id: m('input.password.label') }} />
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
            formControlProps={{
              isInvalid: Boolean(errors.password),
            }}
            error={errors?.password}
          />
          <Input
            inputProps={{
              id: 'passwordConfirm',
              type: 'password',
              placeholder: messageToString(
                { id: m('input.password_confirm.placeholder') },
                intl,
              ),
              ...register('passwordConfirm'),
            }}
            formControlProps={{
              isInvalid: Boolean(errors.passwordConfirm),
            }}
            error={errors?.passwordConfirm}
          />

          <Button
            size="lg"
            type="submit"
            width="100%"
            message={{ id: m('button.submit') }}
            isLoading={submitting}
          />
        </VStack>
      </form>
    );
  }, [
    errors.ico,
    errors.name,
    errors.email,
    errors.password,
    errors.passwordConfirm,
    submitting,
  ]);

  const icoForm = useMemo(() => {
    return (
      <form
        onSubmit={icoHandleSubmit(icoOnSubmit)}
        className={classes.formWrapper}
      >
        {/* ICO */}
        <VStack spacing="10px">
          <Input
            inputProps={{
              id: 'ico',
              placeholder: messageToString(
                { id: m('input.ico.placeholder') },
                intl,
              ),
              ...icoRegister('ico'),
            }}
            formControlProps={{
              isInvalid: Boolean(icoErrors.ico),
            }}
            error={icoErrors?.ico}
          />
          <Button
            size="lg"
            type="submit"
            width="100%"
            message={{ id: m('button.look_up_ico') }}
            isLoading={icoSubmitting}
          />
        </VStack>
      </form>
    );
  }, [icoErrors.ico, icoSubmitting]);

  const loginError = useMemo(() => {
    if (showAuthError?.errorMessage)
      return (
        <Alert my={5} pr={8} status="error" borderRadius={4} maxWidth="100%">
          <AlertIcon />
          <AlertTitle mr={2}>
            <Text message={showAuthError.errorMessage} color="gray.600"></Text>
          </AlertTitle>
          <CloseButton
            onClick={() => setShowAuthError(undefined)}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      );
  }, [showAuthError?.errorMessage, intl, setShowAuthError]);

  return (
    <Flex
      width="100%"
      minH="80vh"
      p="70px"
      justify="space-evenly"
      align="center"
    >
      <Flex>
        <SuggestionInput
          inputProps={{
            id: 'email',
            placeholder: messageToString(
              { id: m('input.email.placeholder') },
              intl,
            ),
          }}
        />
      </Flex>
      <Flex width="100%" maxW="1200px" justify="center" align="flex-start">
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
          <VStack mb="40px" spacing="5px">
            <Text type="heading" message={{ id: m('heading') }} size="lg" />
            <Text
              type="text"
              message={{ id: m('sub_heading') }}
              fontSize="sm"
            />
          </VStack>
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
          <Link href="/login">
            <Button
              variant="link"
              type="submit"
              message={{ id: m('link.login') }}
            />
          </Link>
        </Flex>
        <Divider orientation="vertical" mx="30px" height="200px" />
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
          <VStack mb="40px" spacing="5px">
            <Text type="heading" message={{ id: m('heading_ico') }} size="lg" />
          </VStack>
          {icoForm}
        </Flex>
      </Flex>
    </Flex>
  );
};
