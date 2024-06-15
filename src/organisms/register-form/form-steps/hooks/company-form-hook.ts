import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';

import { config } from '@config';

import { SuggestionFormData } from '@api/address';
import {
  CompanyFormData,
  CompleteCompanyFormData,
  createCompany,
} from '@api/companies';
import { HttpStatusCode } from '@api/utils';

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
    legalForm: yup.number().optional(),
    stringAddress: yup
      .string()
      .required(
        messageToString({ id: m('input.string_address.error.required') }, intl),
      ),
    regionString: yup
      .string()
      .required(
        messageToString({ id: m('input.region_string.error.required') }, intl),
      ),
    districtString: yup
      .string()
      .required(
        messageToString(
          { id: m('input.district_string.error.required') },
          intl,
        ),
      ),
    quarterString: yup.string(),
    staffName: yup
      .string()
      .strict()
      .min(
        config.MIN_NAME_LENGTH,
        messageToString(
          {
            id: m('input.staff_name.error.min'),
            values: { length: config.MIN_NAME_LENGTH },
          },
          intl,
        ),
      )
      .max(
        config.MAX_NAME_LENGTH,
        messageToString(
          {
            id: m('input.staff_name.error.max'),
            values: { length: config.MAX_NAME_LENGTH },
          },
          intl,
        ),
      )
      .required(
        messageToString({ id: m('input.staff_name.error.required') }, intl),
      ),
    email: yup
      .string()
      .email(messageToString({ id: m('input.email.error.format') }, intl))
      .required(messageToString({ id: m('input.email.error.required') }, intl)),
    password: yup
      .string()
      .min(
        config.MIN_PASSWORD_LENGTH,
        messageToString({ id: m('input.password.error.min') }, intl),
      )
      .max(
        config.MAX_PASSWORD_LENGTH,
        messageToString({ id: m('input.password.error.max') }, intl),
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        messageToString({ id: m('input.password.error.format') }, intl),
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
    clearErrors,
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

        // TODO: route to success - validate email page (https://zohan-app.atlassian.net/browse/ZOH-124)
        // router.push(`/register-done?email=${restData.email}`);
        router.push(`/login`);
      } catch (error) {
        if (error?.response?.status === HttpStatusCode.CONFLICT) {
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
    setValue('coordinates', [0, 0]);
  }, [setValue]);

  const onAddressDropdownItemClickHandler = useCallback(
    (suggestion: SuggestionFormData) => {
      clearErrors('stringAddress');
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

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    onAddressInputChangeHandler,
    onAddressDropdownItemClickHandler,
    submitting,
  };
};
