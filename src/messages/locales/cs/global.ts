import { MessageObject } from '../../types';

export const globalMessages: MessageObject = {
  brand_name: 'ZOHAN - administrace',
  lorem: 'The quick brown fox jumps over the lazy dog.',

  // UNITS
  'unit.price_with_currency': '{price} {currency}',
  'unit.duration_with_minutes': '{duration} min',

  // GENDERS
  'gender.male': 'Muž',
  'gender.female': 'Žena',
  'gender.other': 'Jiné',

  // ROLES
  'role.admin': 'admin',
  'role.editor': 'editor',
  'role.reader': 'čtenář',
  'role.admin.tooltip': 'Administrátor s právem upravovat vše.',
  'role.editor.tooltip': 'Editor s právem upravovat rezervace.',
  'role.reader.tooltip': 'Čtenář nemá právo nic upravovat.',

  google: 'Google',
  facebook: 'Facebook',

  // ERRORS
  'error.api': 'Došlo k chybě, zkuste to prosím později.',

  'countable.next': `{count} {count, plural, 
    one {další}
    few {další}
    other {dalších}
  }`,

  // BUTTONS
  'button.back': 'zpět',
  'button.close': 'zavřít',
  'button.save': 'uložit',
  'button.create': 'vytvořit',
  'button.cancel': 'zrušit',
  'button.delete': 'smazat',
  'button.edit': 'upravit',
  'button.prev': 'předchozí',
  'button.next': 'další',
  'button.today': 'dnes',
  'button.more': 'více',
  'button.view': 'zobrazit',
  'button.understood': 'rozumím',
  'button.confirm_delete': 'potvrdit smazání',
  'button.create_booking': 'vytvořit rezervaci',
  'button.open_onboarding_modal': 'JAK ZAČÍT?',

  // input label
  'input.label.optional': 'nepovinné',

  // misc
  no_content: 'Nic tu bohužel není...',
  'device_not_supported.title': 'Váše zařízení není podporováno',
  'device_not_supported.description':
    'Zkuste to prosím na tabletu, počítači nebo notebooku.',

  // months
  'month.january': 'Leden',
  'month.february': 'Únor',
  'month.march': 'Březen',
  'month.april': 'Duben',
  'month.may': 'Květen',
  'month.june': 'Červen',
  'month.july': 'Červenec',
  'month.august': 'Srpen',
  'month.september': 'Září',
  'month.october': 'Říjen',
  'month.november': 'Listopad',
  'month.december': 'Prosinec',
  'month.0': 'Leden',
  'month.1': 'Únor',
  'month.2': 'Březen',
  'month.3': 'Duben',
  'month.4': 'Květen',
  'month.5': 'Červen',
  'month.6': 'Červenec',
  'month.7': 'Srpen',
  'month.8': 'Září',
  'month.9': 'Říjen',
  'month.10': 'Listopad',
  'month.11': 'Prosinec',

  // days
  'day.monday': 'Pondělí',
  'day.tuesday': 'Úterý',
  'day.wednesday': 'Středa',
  'day.thursday': 'Čtvrtek',
  'day.friday': 'Pátek',
  'day.saturday': 'Sobota',
  'day.sunday': 'Neděle',
  'day.mon': 'Pondělí',
  'day.tue': 'Úterý',
  'day.wed': 'Středa',
  'day.thu': 'Čtvrtek',
  'day.fri': 'Pátek',
  'day.sat': 'Sobota',
  'day.sun': 'Neděle',
  'day.0': 'Pondělí',
  'day.1': 'Úterý',
  'day.2': 'Středa',
  'day.3': 'Čtvrtek',
  'day.4': 'Pátek',
  'day.5': 'Sobota',
  'day.6': 'Neděle',
};
