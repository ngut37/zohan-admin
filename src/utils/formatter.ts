export const camelCaseToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, '_$&').toLowerCase();

export const snakeCaseToCamelCase = (str: string) =>
  str.replace(/[A-Z]/g, '_$&').toLowerCase();
