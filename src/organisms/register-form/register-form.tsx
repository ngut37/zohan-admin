import React, { useCallback, useMemo, useState } from 'react';

import { CompanyFormData } from '@api/company';

import { Card } from '@atoms';

import { Flex } from '@chakra-ui/react';

import { IcoForm } from './form-steps';
import { CompanyForm } from './form-steps/company-form';

type FormStep = 'ico' | 'company';

export const RegisterForm = () => {
  const [formStep, setFormStep] = useState<FormStep>('ico');

  const [companyFormData, setCompanyFormData] = useState<
    CompanyFormData | undefined
  >();

  const afterSubmitIcoForm = useCallback(
    (companyFormData: CompanyFormData) => {
      setCompanyFormData(companyFormData);
      setFormStep('company');
    },
    [setFormStep, setCompanyFormData],
  );

  const onCompanyFormBackButtonClick = useCallback(() => {
    setCompanyFormData(undefined);
    setFormStep('ico');
  }, [setFormStep, setCompanyFormData]);

  const currentForm = useMemo(() => {
    switch (formStep) {
      case 'ico': {
        return <IcoForm afterSubmit={afterSubmitIcoForm} />;
      }
      case 'company': {
        return (
          <CompanyForm
            defaultData={companyFormData}
            onBackButtonClick={onCompanyFormBackButtonClick}
          />
        );
      }
      default:
        return null;
    }
  }, [formStep]);

  return (
    <Flex
      width="100%"
      minH="80vh"
      p="70px"
      justify="space-evenly"
      align="center"
    >
      <Flex width="100%" maxW="1200px" justify="center" align="flex-start">
        <Card minW="450px" maxW="450px">
          {currentForm}
        </Card>
      </Flex>
    </Flex>
  );
};
