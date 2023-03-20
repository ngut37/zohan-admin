import { MessageObject } from '../../../types';

export const staffListMessages: MessageObject = {
  // LIST
  // buttons
  'staff-list.button.create_venue': 'Vytvořit',

  'staff-list.item.button.edit': 'Upravit',

  // toasts
  'staff-list.item.toast.success': 'Zaměstnanec byl úspěsně upraven.',

  // DRAWER
  // headings
  'staff-list.item.drawer.heading': 'Upravit zaměstnance',

  // labels
  'staff-list.item.drawer.input.name.label': 'Celé jméno',
  'staff-list.item.drawer.input.email.label': 'Email',
  'staff-list.item.drawer.input.role.label': 'Role',
  'staff-list.item.drawer.input.venues.label': 'Pobočky',

  // placeholders
  'staff-list.item.drawer.input.venues.placeholder': 'Vyberte pobočky',
  'staff-list.item.drawer.input.staff_name.placeholder': 'Jan Srna',
  'staff-list.item.drawer.input.email.placeholder': 'jan.srna@email.cz',

  // buttons
  'staff-list.item.drawer.button.submit': 'Uložit',
  'staff-list.item.drawer.button.close': 'zavřít',

  // errors
  'staff-list.item.input.email.error.conflict':
    'Učet s touto emailovou adresou již existuje',
};
