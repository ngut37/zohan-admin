import { MessageObject } from '../../../types';

export const venueEditMessages: MessageObject = {
  // toasts
  'venue.edit.toast.success':
    'Pobočka na adrese "{address}" byla úspěsně uložena.',

  // tabs
  'venue.edit.tab.information': 'Základní informace',
  'venue.edit.tab.staff': 'Zaměstnanci',
  'venue.edit.tab.services': 'Nabízené služby',

  /* INFORMATION TAB */
  // labels
  'venue.edit.information_tab.input.address.label': 'Adresa',
  'venue.edit.information_tab.input.address_region_district.label':
    'Vybraný region a okres',

  // errors
  'venue.edit.information_tab.input.address.required': 'Vyberte prosím adresu',

  /* STAFF TAB */
  'venue.edit.staff_tab.work_in_progress': '🔧 tato sekce je ve vývoji',

  /* SERVICES TAB */
  // labels
  'venue.edit.services_tab.input.services.label': 'Vyberte ze seznamu',
  'venue.edit.services_tab.input.length.label': 'Délka (násobky čtvrthodin)',
  'venue.edit.services_tab.input.price.label': 'Cena (Kč)',
  'venue.edit.services_tab.input.staff.label': 'Zaměstnanci',

  // placeholders
  'venue.edit.services_tab.input.length.placeholder':
    'délka po čtvrthodinách (15, 30, 45, 60, 75, 90, ...)',
  'venue.edit.services_tab.input.price.placeholder': 'cena v Kč',

  // errors
  'venue.edit.services_tab.input.length.required':
    'Vyplňte prosím kladnou délku',
  'venue.edit.services_tab.input.length.divisible':
    'Délka musí být násobkem čtvrthodiny (15, 30, 45, 60, ...)',
  'venue.edit.services_tab.input.price.required': 'Vyplňte prosím kladnou cenu',

  // toasts
  'venue.edit.services_tab.toast.success': 'Služby byly úspěšně uloženy',

  /* DELETE ALERT DIALOG */
  'venue.edit.information_tab.delete_confirmation.title': 'Smazat pobočku',
  'venue.edit.information_tab.delete_confirmation.subtitle':
    'Opravdu chcete smazat pobočku? Smazání pobočky neodstraní zaměstnance, ale služby ano.',
  'venue.edit.information_tab.delete_confirmation.toast.success':
    'Pobočka byla smazána.',
};
