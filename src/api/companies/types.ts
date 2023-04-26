import { SuggestionFormData } from '@api/address';

export type CompanyFormData = {
  ico: string;
  name: string;
  complete?: boolean;
} & SuggestionFormData;

export type CompleteCompanyFormData = CompanyFormData & {
  staffName: string;
  email: string;
  password: string;
};

export type Company = {
  ico: string;
  name: string;

  stringAddress: string;

  regionString: string;
  districtString: string;
  mopString?: string;
  momcString?: string;

  complete?: boolean;
};
