import { MessageObject } from '../../types';

export const globalMessages: MessageObject = {
  brand_name: 'ZOHAN - administrace',
  lorem: 'The quick brown fox jumps over the lazy dog.',

  // GENDERS
  'gender.male': 'Muž',
  'gender.female': 'Žena',
  'gender.other': 'Jiné',

  // ROLES
  'role.admin': 'Admin',
  'role.editor': 'Editor',
  'role.reader': 'Čtenář',
  'role.admin.tooltip': 'Administrátor s právem upravovat vše.',
  'role.editor.tooltip': 'Editor s právem upravovat rezervace.',
  'role.reader.tooltip': 'Čtenář nemá právo nic upravovat.',

  google: 'Google',
  facebook: 'Facebook',

  // ERRORS
  'error.api': 'Došlo k chybě, zkuste to prosím později.',

  // input label
  'input.label.optional': 'nepovinné',

  // misc
  no_content: 'Nic tu bohužel není',
};
