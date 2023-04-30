import { MessageObject } from '../../../types';

export const dashboardMessages: MessageObject = {
  /* CALENDAR */

  /* labels */
  'dashboard.input.venue.label': 'Vyberte pobočku',
  'dashboard.input.view_type.label': 'Zobrazení kalendáře',

  'dashboard.input.view_type.day': 'denní',
  'dashboard.input.view_type.week': 'týdenní',
  'dashboard.input.view_type.month': 'měsíční',

  'dashboard.calendar.all_day.title': 'celý den',

  /* DASHBOARD HOOK FORM CONTEXT */
  'dashboard.input.custom_customer.name.required': 'Vyplňte jméno zákazníka',
  'dashboard.input.custom_customer.email.invalid': 'Neplatný email zákazníka',
  'dashboard.input.custom_customer.phone.invalid': 'Neplatný telefon zákazníka',

  /* BOOKING EDIT MODAL */
  // heading
  'dashboard.booking_edit_modal.heading': 'Úprava rezervace',

  // placeholders
  'dashboard.booking_edit_modal.input.customer.name.placeholder': 'Jméno',
  'dashboard.booking_edit_modal.input.customer.email.placeholder': 'Email',
  'dashboard.booking_edit_modal.input.customer.phone.placeholder': 'Telefon',
  'dashboard.booking_edit_modal.input.customer.phone.empty.placeholder':
    'Telefon (prázdné)',
  'dashboard.booking_edit_modal.input.staff.placeholder': 'Vyberte zaměstnance',
  'dashboard.booking_edit_modal.input.service.placeholder': 'Vyberte službu',
  'dashboard.booking_edit_modal.input.start.pick_service.placeholder':
    'Vyberte službu',
  'dashboard.booking_edit_modal.input.start.placeholder':
    'Vyberte začátek rezervace',
  'dashboard.booking_edit_modal.input.end.placeholder':
    'Vyberte začátek rezervace',

  // labels
  'dashboard.booking_edit_modal.input.customer.label': 'Zákazník',
  'dashboard.booking_edit_modal.input.venue.label': 'Pobočka',
  'dashboard.booking_edit_modal.input.staff.label': 'Zaměstnanec',
  'dashboard.booking_edit_modal.input.service.label': 'Služba',
  'dashboard.booking_edit_modal.input.service.price': 'Cena',
  'dashboard.booking_edit_modal.input.service.duration': 'Doba trvání',
  'dashboard.booking_edit_modal.input.start.label': 'Začátek',
  'dashboard.booking_edit_modal.input.end.label': 'Konec',

  // toasts
  'dashboard.booking_edit_modal.toast.delete.success': 'Rezervace byla smazána',
  'dashboard.booking_edit_modal.toast.edit.success': 'Rezervace byla upravena',
  'dashboard.booking_edit_modal.toast.form_error':
    'Formulář obsahuje chyby nebo je nekompletní',

  // delete booking modal
  'dashboard.booking_edit_modal.delete_confirmation.title':
    'Opravdu chcete smazat rezervaci?',
  'dashboard.booking_edit_modal.delete_confirmation.subtitle':
    'Tato akce je nevratná.',

  /* BOOKING CREATE MODAL */
  // heading
  'dashboard.booking_create_modal.heading': 'Vytvoření rezervace',

  // placeholders
  'dashboard.booking_create_modal.input.customer.name.placeholder': 'Jméno',
  'dashboard.booking_create_modal.input.customer.email.placeholder': 'Email',
  'dashboard.booking_create_modal.input.customer.phone.placeholder': 'Telefon',
  'dashboard.booking_create_modal.input.staff.placeholder':
    'Vyberte zaměstnance',
  'dashboard.booking_create_modal.input.service.placeholder': 'Vyberte službu',
  'dashboard.booking_create_modal.input.start.pick_service.placeholder':
    'Vyberte službu',
  'dashboard.booking_create_modal.input.start.placeholder':
    'Vyberte začátek rezervace',
  'dashboard.booking_create_modal.input.end.placeholder':
    'Vyberte začátek rezervace',

  // labels
  'dashboard.booking_create_modal.input.customer.label': 'Zákazník',
  'dashboard.booking_create_modal.input.venue.label': 'Pobočka',
  'dashboard.booking_create_modal.input.staff.label': 'Zaměstnanec',
  'dashboard.booking_create_modal.input.service.label': 'Služba',
  'dashboard.booking_create_modal.input.service.price': 'Cena',
  'dashboard.booking_create_modal.input.service.duration': 'Doba trvání',
  'dashboard.booking_create_modal.input.start.label': 'Začátek',
  'dashboard.booking_create_modal.input.end.label': 'Konec',

  // toasts
  'dashboard.booking_create_modal.toast.create.success':
    'Rezervace byla vytvořena',
  'dashboard.booking_create_modal.toast.form_error':
    'Formulář obsahuje chyby nebo je nekompletní',

  // error
  'dashboard.booking_create_modal.input.custom_customer.name.required':
    'Vyplňte jméno zákazníka',
  'dashboard.booking_create_modal.input.custom_customer.email.invalid':
    'Neplatný email zákazníka',
  'dashboard.booking_create_modal.input.custom_customer.phone.invalid':
    'Neplatný telefon zákazníka',
};
