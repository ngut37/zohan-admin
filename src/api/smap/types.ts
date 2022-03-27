import { enumerate } from '@utils/enumerate';

type FactoryToken = {
  iat: number;
  exp: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  oAuth?: {
    userId: string;
    type: OAuthType;
  };
} & FactoryToken;

export const O_AUTH_TYPES = enumerate('google', 'facebook');

export type OAuthType = keyof typeof O_AUTH_TYPES;

export type SMapSuggestion = {};

export type UserData = {
  bbox: number[];
  correctedResult: boolean;
  country: string;
  district: string;
  enabled: boolean;
  evidenceNumber: string;
  hasAddress: boolean;
  highlight: number[];
  highlightSecond: any[];
  houseNumber: string;
  iconType: string;
  id: number;
  img: string;
  importance: number;
  latitude: number;
  longitude: number;
  mmid: string;
  mmsource: string;
  mmtype: string;
  muniId: string;
  municipality: string;
  nuts: string;
  poiType: string;
  poiTypeId: number;
  popularity: number;
  premiseIds: any[];
  quarter: string;
  region: string;
  relevance: number;
  ruianId: number;
  source: string;
  street: string;
  streetNumber: string;
  suggestFirstRow: string;
  suggestSecondRow: string;
  suggestThirdRow: string;
  ward: string;
  wikiId: string;
  zipCode: string;
};

export type RawSuggestion = {
  category: string;
  highlight: any[];
  sentence: string;
  userData: UserData;
};

export type RawSMapSuggestionResult = {
  deletedFromBack: number;
  hasCategory: number;
  hasGeo: number;
  hasService: number;
  id: string;
  result: RawSuggestion[];
  sortToUserOnCategory: boolean;
};

export type Suggestion = {
  category: string;
  point: [number, number];
  ruianAddressId: number;
  region: string;
  district: string;
  municipality: string;
  quarter?: string;
  ward: string;
  street: string;
  houseNumber: string;
  streetNumber?: string;
};
