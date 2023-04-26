import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { GroupBase, MultiValue, OptionBase, Select } from 'chakra-react-select';

import { config } from '@config';

import {
  ServiceName,
  ServiceType,
  ServiceUpsertPayload,
  serviceVariants,
  SERVICE_NAMES,
  upsertManyServices,
  UpsertManyServicesPayload,
} from '@api/services';
import { getServices, getStaff } from '@api/venues';
import { Staff } from '@api/staff';

import { messageIdConcat } from '@utils/message-id-concat';
import { yup } from '@utils/yup';
import { messageToString } from '@utils/message';

import { useApi } from '@hooks/use-api';

import { Button, Input, Text } from '@atoms';

import { InputLabel } from '@molecules/input-label';
import { ServiceDropdown } from '@molecules/service-dropdown';

import {
  Divider,
  Flex,
  HStack,
  Spinner,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { colors } from '@styles';

import classes from './services-tab.module.scss';

interface Option extends OptionBase {
  label: string;
  value: string;
}

const m = messageIdConcat('venue.edit.services_tab');

type Props = {
  venueId: string;
};

export const ServicesTab = ({ venueId }: Props) => {
  const intl = useIntl();
  const toast = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);

  const schema = yup.object().shape(
    Object.keys(SERVICE_NAMES).reduce<Record<ServiceName, any>>((acc, curr) => {
      acc[curr as ServiceName] = yup
        .object()
        .shape({
          id: yup.string(),
          type: yup.string(),
          name: yup.string(),
          venue: yup.string(),
          staff: yup.array(yup.string()),
          length: yup
            .number()
            .typeError(
              messageToString({ id: m('input.length.required') }, intl),
            )
            .positive(messageToString({ id: m('input.length.required') }, intl))
            .test(
              `is-divisible-by-${config.SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES}`,
              messageToString({ id: m('input.length.divisible') }, intl),
              (value: number | undefined) => {
                if (value) {
                  return (
                    value % config.SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES === 0
                  );
                }
                return true;
              },
            ),
          price: yup
            .number()
            .typeError(messageToString({ id: m('input.price.required') }, intl))
            .positive(messageToString({ id: m('input.price.required') }, intl)),
        })
        .optional()
        .nullable();
      return acc;
    }, {} as Record<ServiceName, any>),
  );

  const onSubmit = useCallback(
    async (data: Record<ServiceName, any>) => {
      const payload: UpsertManyServicesPayload = Object.keys(
        data,
      ).reduce<UpsertManyServicesPayload>(
        (acc, curr) => {
          const service = data[curr as ServiceName];
          if (service && service.name) {
            acc.services.push(service);
          }
          return acc;
        },
        { services: [] },
      );

      setSubmitting(true);
      try {
        await upsertManyServices(payload);
        toast({
          description: messageToString({ id: m('toast.success') }, intl),
          status: 'info',
          duration: 10000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    },
    [setSubmitting],
  );

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
    getValues,
    trigger,
  } = useForm<Record<ServiceName, ServiceUpsertPayload>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  // fetch existing services and set them to form values
  const { fetch: fetchServices, requestComplete: requestCompleteServices } =
    useApi(async () => {
      try {
        const services = await getServices(venueId);
        services.forEach(({ _id, type, name, venue, length, price, staff }) => {
          setValue(`${name}.id`, _id);
          setValue(`${name}.type`, type as ServiceType);
          setValue(`${name}.name`, name);
          setValue(`${name}.venue`, venue);
          setValue(`${name}.length`, length);
          setValue(`${name}.price`, price);
          setValue(`${name}.staff`, staff);
        });
      } catch (error) {
        toast({
          description: messageToString({ id: 'error.api' }, intl),
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      }
    });

  const { fetch: fetchStaff, requestComplete: requestCompleteStaff } = useApi(
    async () => {
      const staff = await getStaff(venueId);
      setStaff(staff);
    },
  );

  useEffect(() => {
    if (venueId) {
      fetchServices(venueId as string);
      fetchStaff(venueId as string);
    }
  }, [venueId]);

  const servicesComponents = useMemo(() => {
    return Object.keys(serviceVariants).map((serviceType, index) => {
      return (
        <VStack key={index} alignItems="flex-start" w="100%">
          <Text message={{ id: `service_type.${serviceType}` }} />
          {serviceVariants[serviceType as ServiceType].map((service, index) => {
            const dotifiedService = `${serviceType}.${service}`;

            const staffOptions = staff.map((staffMember) => ({
              value: staffMember._id,
              label: staffMember.name,
            }));

            return (
              <ServiceDropdown
                key={index}
                message={{ id: `service_name.${service}` }}
                onOpen={() => {
                  setValue(`${service}.type`, serviceType as ServiceType);
                  setValue(`${service}.name`, service);
                  setValue(`${service}.venue`, venueId);
                }}
                onClose={() => {
                  setValue(service, null as any);
                  trigger(service); // trigger validation to remove errors
                }}
                isOpen={Boolean(getValues(`${service}.name`))}
              >
                <VStack marginBottom="10px" zIndex="dropdown">
                  {/* LENGTH */}
                  <HStack
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <InputLabel
                      w="500px"
                      message={{ id: m('input.length.label') }}
                    />
                    <Input
                      inputProps={{
                        id: dotifiedService,
                        placeholder: messageToString(
                          {
                            id: m(`input.length.placeholder`),
                          },
                          intl,
                        ),

                        ...register(`${service}.length`),
                      }}
                      formControlProps={{
                        isInvalid: Boolean(errors[service]?.length?.message),
                      }}
                      error={errors[service]?.length}
                    />
                  </HStack>

                  {/* PRICE */}
                  <HStack
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <InputLabel
                      w="500px"
                      message={{ id: m('input.price.label') }}
                    />
                    <Input
                      inputProps={{
                        id: dotifiedService,
                        placeholder: messageToString(
                          {
                            id: m(`input.price.placeholder`),
                          },
                          intl,
                        ),

                        ...register(`${service}.price`),
                      }}
                      formControlProps={{
                        isInvalid: Boolean(errors[service]?.price?.message),
                      }}
                      error={errors[service]?.price}
                    />
                  </HStack>

                  {/* STAFF */}
                  <HStack
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <InputLabel
                      w="500px"
                      message={{ id: m('input.staff.label') }}
                      optional
                    />
                    <Select<Option, true, GroupBase<Option>>
                      className={classes.multiSelectContainer}
                      options={staffOptions}
                      placeholder=""
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      onChange={(options: MultiValue<Option>) => {
                        setValue(
                          `${service}.staff`,
                          options.map((option) => option.value),
                        );
                      }}
                      defaultValue={
                        getValues(`${service}.staff`)
                          ?.map((staffId: string) => {
                            const staffMember = staff.find(
                              (staffMember) => staffMember._id === staffId,
                            );

                            return staffMember
                              ? {
                                  value: staffMember._id,
                                  label: staffMember.name,
                                }
                              : undefined;
                          })
                          .filter(Boolean) as Option[]
                      }
                      menuPosition="fixed"
                      isMulti
                    />
                  </HStack>
                </VStack>
              </ServiceDropdown>
            );
          })}
        </VStack>
      );
    });
  }, [
    serviceVariants,
    errors,
    getValues,
    setValue,
    trigger,
    register,
    staff,
    intl,
    requestCompleteServices,
    requestCompleteStaff,
  ]);

  if (!requestCompleteServices || !requestCompleteStaff) {
    return (
      <Flex width="100%" height="200px" justify="center" align="center">
        <Spinner
          thickness="4px"
          speed="0.85s"
          emptyColor={colors.white.hex()}
          color={colors.teal_500.hex()}
          size="xl"
        />
      </Flex>
    );
  }

  return (
    <>
      <InputLabel
        message={{ id: m('input.services.label') }}
        marginBottom="30px"
      />
      <VStack
        alignItems="flex-start"
        spacing="15px"
        divider={<Divider orientation="horizontal" borderColor="gray.100" />}
      >
        {servicesComponents}
        <Button
          width="100px"
          marginTop="15px !important"
          size="md"
          message={{ id: 'button.save' }}
          onClick={handleSubmit(onSubmit)}
          isLoading={submitting}
        />
      </VStack>
    </>
  );
};
