import { MessageObject } from '../../../types';

export const staffListMessages: MessageObject = {
  // LIST
  // buttons
  'staff-list.button.create_venue': 'Vytvořit',

  'staff-list.item.button.edit': 'Upravit',

  // toasts
  'staff-list.item.toast.success': 'Zaměstnanec byl úspěsně upraven.',

  /* ITEM DRAWER */
  // headings
  'staff-list.item.drawer.heading': 'Upravit zaměstnance',

  // labels
  'staff-list.item.drawer.input.name.label': 'Celé jméno',
  'staff-list.item.drawer.input.email.label': 'Email',
  'staff-list.item.drawer.input.role.label': 'Role',
  'staff-list.item.drawer.input.venue.label': 'Pobočka',

  // placeholders
  'staff-list.item.drawer.input.venue.placeholder': 'Vyberte pobočku',
  'staff-list.item.drawer.input.staff_name.placeholder': 'Jan Srna',
  'staff-list.item.drawer.input.email.placeholder': 'jan.srna@email.cz',

  // errors
  'staff-list.item.input.name.error.required': 'Jméno nemůže být prázdné',
  'staff-list.item.input.name.error.min': `Jméno musí obsahovat nejméně {length} {length, plural, 
      one {znak}
      few {znaky}
      other {znaků}
    }`,
  'staff-list.item.input.name.error.max': `Jméno přesahuje maximální délku {length} {length, plural, 
    one {znak}
    few {znaky}
    other {znaků}
  }`,
  'staff-list.item.input.email.error.required':
    'Emailová adresa nemůže být prázdná',
  'staff-list.item.input.email.error.format':
    'Emailová adresa není ve správném tvaru',
  'staff-list.item.input.email.error.conflict':
    'Zaměstnanec s touto emailovou adresou již existuje',
  'staff-list.item.input.role.error.required':
    'Vyberte prosím oprávnění zaměstnance',
};
