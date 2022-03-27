import { RawSuggestion, Suggestion } from '../types';

export const formatSuggestion = (rawSuggestion: RawSuggestion): Suggestion => {
  return {
    category: rawSuggestion.category,
    point: [rawSuggestion.userData.latitude, rawSuggestion.userData.longitude],
    ruianAddressId: rawSuggestion.userData.ruianId,
    region: rawSuggestion.userData.region,
    district: rawSuggestion.userData.district,
    municipality: rawSuggestion.userData.municipality,
    quarter: rawSuggestion.userData.quarter,
    ward: rawSuggestion.userData.ward,
    street: rawSuggestion.userData.street,
    houseNumber: rawSuggestion.userData.houseNumber,
    streetNumber: rawSuggestion.userData.streetNumber,
  };
};
