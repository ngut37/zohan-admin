import { apiClient } from '@api/api-client';

import { Company, CompanyFormData, CompleteCompanyFormData } from './types';

export const fetchCompanyByIco = async (ico: string) => {
  try {
    const response = await apiClient.request<{
      success: boolean;
      data: CompanyFormData;
    }>({
      url: '/admin/companies/fetch-by-ico',
      method: 'POST',
      data: {
        ico,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCompany = async (payload: CompleteCompanyFormData) => {
  try {
    const response = await apiClient.request<{
      success: boolean;
      data: Company;
    }>({
      url: '/admin/companies/create',
      method: 'PUT',
      data: payload,
    });

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
