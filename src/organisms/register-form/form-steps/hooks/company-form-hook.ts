import {} from 'react';

import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';

import { SuggestionFormData } from '@api/address';
import {
  CompanyFormData,
  CompleteCompanyFormData,
  createCompany,
} from '@api/company';

import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';
import { messageIdConcat } from '@utils/message-id-concat';

import { useToast } from '@chakra-ui/react';

type Inputs = CompleteCompanyFormData & {
  passwordConfirm: string;
};

type HookParams = {
  defaultData?: CompanyFormData;
};

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 256;

const m = messageIdConcat('register.company');

export const useCompanyFormHook = ({ defaultData }: HookParams) => {
  const intl = useIntl();
  const toast = useToast();
  const router = useRouter();

  const schema = yup.object().shape({
    ico: yup
      .string()
      .ico(messageToString({ id: m('input.ico.error.format') }, intl)),
    name: yup
      .string()
      .strict()
      .min(
        MIN_NAME_LENGTH,
        messageToString(
          {
            id: m('input.name.error.min'),
            values: { length: MIN_NAME_LENGTH },
          },
          intl,
        ),
      )
      .max(
        MAX_NAME_LENGTH,
        messageToString(
          {
            id: m('input.name.error.max'),
            values: { length: MAX_NAME_LENGTH },
          },
          intl,
        ),
      )
      .required(messageToString({ id: m('input.name.error.required') }, intl)),
    stringAddress: yup.string().required(),
    regionString: yup.string().required(),
    districtString: yup.string().required(),
    quarterString: yup.string(),
    staffName: yup
      .string()
      .strict()
      .min(
        MIN_NAME_LENGTH,
        messageToString(
          {
            id: m('input.name.error.min'),
            values: { length: MIN_NAME_LENGTH },
          },
          intl,
        ),
      )
      .max(
        MAX_NAME_LENGTH,
        messageToString(
          {
            id: m('input.name.error.max'),
            values: { length: MAX_NAME_LENGTH },
          },
          intl,
        ),
      )
      .required(messageToString({ id: m('input.name.error.required') }, intl)),
    email: yup
      .string()
      .email(messageToString({ id: m('input.email.error.format') }, intl))
      .required(messageToString({ id: m('input.email.error.required') }, intl)),
    password: yup
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        messageToString({ id: m('input.password.error.min') }, intl),
      )
      .max(
        MAX_PASSWORD_LENGTH,
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

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<Inputs>({
    mode: 'onSubmit',
    defaultValues: defaultData,
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      setSubmitting(true);
      const { passwordConfirm: _pc, ...restData } = data;

      try {
        const result = await createCompany(restData);

        if (!result.complete) throw new Error();

        toast({
          description: messageToString(
            { id: m('toast.success'), values: { companyName: restData.name } },
            intl,
          ),
          status: 'info',
          duration: 10000,
          isClosable: true,
        });

        router.push(`/register-done?email=${restData.email}`);
      } catch (e) {
        if (e?.response?.status === 409) {
          setError(
            'ico',
            {
              message: messageToString(
                { id: m('input.ico.error.conflict') },
                intl,
              ),
            },
            { shouldFocus: true },
          );
        } else {
          toast({
            description: messageToString({ id: m('toast.error') }, intl),
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

  const onAddressInputChangeHandler = useCallback(() => {
    setValue('stringAddress', '');
    setValue('regionString', '');
    setValue('districtString', '');
    setValue('quarterString', undefined);
  }, [setValue]);

  const onAddressDropdownItemClickHandler = useCallback(
    (suggestion: SuggestionFormData) => {
      const { stringAddress, regionString, districtString, quarterString } =
        suggestion;
      setValue('stringAddress', stringAddress);
      setValue('regionString', regionString);
      setValue('districtString', districtString);
      setValue('quarterString', quarterString);
    },
    [setValue],
  );

  return {
    register,
    handleSubmit: () => handleSubmit(onSubmit),
    errors,
    onAddressInputChangeHandler,
    onAddressDropdownItemClickHandler,
    submitting,
  };
};
