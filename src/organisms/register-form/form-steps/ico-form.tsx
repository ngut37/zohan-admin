import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CompanyFormData, fetchCompanyByIco } from '@api/company';
import { HttpStatusCode, getResponseStatusCode } from '@api/utils';

import { messageIdConcat } from '@utils/message-id-concat';
import { messageToString } from '@utils/message';
import { yup } from '@utils/yup';

import { Button, Input, Text } from '@atoms';

import { VStack } from '@chakra-ui/react';

const m = messageIdConcat('register.ico');

type IcoInputs = {
  ico: string;
};

type Props = {
  afterSubmit?: (companyFormData: CompanyFormData) => void;
};

export const IcoForm = ({ afterSubmit }: Props) => {
  const intl = useIntl();

  const [icoSubmitting, setIcoSubmitting] = useState(false);

  const icoSchema = yup.object().shape({
    ico: yup
      .string()
      .required(messageToString({ id: m('input.error.required') }, intl))
      .ico(messageToString({ id: m('input.error.format') }, intl)),
  });

  // ICO REGISTER
  const {
    register: icoRegister,
    handleSubmit: icoHandleSubmit,
    formState: { errors },
    setError,
  } = useForm<IcoInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(icoSchema),
  });

  const icoOnSubmit: SubmitHandler<IcoInputs> = useCallback(
    async (data) => {
      setIcoSubmitting(true);

      let companyFormData: CompanyFormData | undefined;

      try {
        companyFormData = await fetchCompanyByIco(data.ico);

        if (companyFormData.complete) {
          setError('ico', {
            message: messageToString({ id: m('input.error.conflict') }, intl),
          });
          return;
        }

        afterSubmit && afterSubmit(companyFormData);
      } catch (e) {
        console.error(e);

        if (getResponseStatusCode(e.response) === HttpStatusCode.NOT_FOUND) {
          setError('ico', {
            message: messageToString({ id: m('input.error.not_found') }, intl),
          });
          return;
        }
      } finally {
        setIcoSubmitting(false);
      }
    },
    [intl],
  );

  return (
    <>
      <VStack mb="40px" spacing="5px">
        <Text type="heading" message={{ id: m('heading') }} size="lg" />
      </VStack>
      <form onSubmit={icoHandleSubmit(icoOnSubmit)}>
        <VStack spacing="10px">
          <Input
            inputProps={{
              id: 'ico',
              placeholder: messageToString(
                { id: m('input.placeholder') },
                intl,
              ),
              ...icoRegister('ico'),
            }}
            formControlProps={{
              isInvalid: Boolean(errors.ico),
            }}
            error={errors?.ico}
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
    </>
  );
};
