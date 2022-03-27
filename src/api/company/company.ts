import { apiClient } from '@api/api-client';

export const fetchAndFormatCompany = async (ico: string) => {
  try {
    const response = await apiClient.request({
      url: `/company/fetch-and-process?ico=${ico}`,
      method: 'POST',
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
