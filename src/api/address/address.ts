import { apiClient } from '../api-client';

import { SuggestionFormData } from '.';

const MAX_COUNT = 20;

export const suggest = async (phrase: string, count?: number) => {
  let validCount = count;
  if (validCount && validCount > MAX_COUNT) validCount = MAX_COUNT;

  try {
    const response = await apiClient.request<{
      success: boolean;
      data: SuggestionFormData[];
    }>({
      url: '/address/suggest',
      method: 'GET',
      params: {
        phrase,
        count: validCount,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
