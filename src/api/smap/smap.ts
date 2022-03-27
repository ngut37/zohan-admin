import Axios from 'axios';

import { RawSuggestion } from './types';
import { formatSuggestion } from './utils/format-suggestion';

const SMAP_API_URL = 'https://pro.mapy.cz';

export const suggest = async (phrase: string) => {
  const response = await Axios.get(
    `${SMAP_API_URL}/suggest/?count=5&phrase=${phrase}`,
  );

  if (response) {
    const formattedSuggestions = (response.data.result as RawSuggestion[]).map(
      (rawSuggestion) => formatSuggestion(rawSuggestion),
    );

    return formattedSuggestions;
  } else {
    return [];
  }
};
