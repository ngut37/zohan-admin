type Coordinates = [number, number];

export type SuggestionFormData = {
  stringAddress: string;

  regionString: string;
  districtString: string;
  /** momc */
  quarterString?: string;

  coordinates: Coordinates;
};
