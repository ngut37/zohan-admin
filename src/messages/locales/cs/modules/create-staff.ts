import { MessageObject } from '../../../types';

export const staffCreateMessages: MessageObject = {
  // headings
  'create.staff.heading': 'Vytvořte zaměstnance',
  'create.staff.sub_heading': 'Doplňte prosím údaje',

  // labels
  'create.staff.input.staff_name.label': 'Jméno',
  'create.staff.input.email.label': 'Email',
  'create.staff.input.role.label': 'Oprávnění',
  'create.staff.input.venues.label': 'Pobočky',

  // placeholders
  'create.staff.input.staff_name.placeholder': 'Jan Srna',
  'create.staff.input.email.placeholder': 'jan.srna@email.cz',

  // buttons
  'create.staff.button.submit': 'Vytvořit',
  'create.staff.button.back': 'zpět',

  // errors
  'create.staff.input.name.error.min': `Jméno musí obsahovat nejméně {length} {length, plural, 
    one {znak}
    few {znaky}
    other {znaků}
  }`,
  'create.staff.input.name.error.max': `Jméno přesahuje maximální délku {length} {length, plural, 
    one {znak}
    few {znaky}
    other {znaků}
  }`,
  'create.staff.input.email.error.required':
    'Emailová adresa nemůže být prázdná',
  'create.staff.input.email.error.format':
    'Emailová adresa není ve správném tvaru',
  'create.staff.input.email.error.conflict':
    'Učet s touto emailovou adresou již existuje',
  'create.staff.input.role.error.required':
    'Vyberte prosím oprávnění zaměstnance',

  // toasts
  'create.staff.toast.success': 'Uživatel {name} byl úspěšně vytvořen.',
};
