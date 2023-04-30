import { MessageObject } from '../../../types';

export const registerMessages: MessageObject = {
  //========================================================================
  /* ICO FORM */

  // heading
  'register.ico.heading': 'Zadejte IČO společnosti',

  // input placeholders
  'register.ico.input.placeholder': 'např. 12345678',

  // buttons
  'register.ico.button.look_up_ico': 'Vyhledat',

  // form errors
  'register.ico.input.error.required': 'Zadejte prosím IČO',
  'register.ico.input.error.format': 'Zadejte prosím platné IČO',
  'register.ico.input.error.not_found': 'Společnost nebyla nalezena',
  'register.ico.input.error.conflict': 'Společnost pod zadaným IČO už existuje',

  //========================================================================
  /* COMPANY FORM */

  'register.company.heading': 'Registrace',
  'register.company.sub_heading': 'Rychle, jednoduše a zdarma.',

  // input labels
  'register.company.input.ico.label': 'IČO',
  'register.company.input.name.label': 'Název společnosti',
  'register.company.input.address.label': 'Sídlo',
  'register.company.input.staff_name.label': 'Jméno administrátora',
  'register.company.input.email.label': 'Emailová adresa administrátora',
  'register.company.input.password.label': 'Heslo',
  'register.company.input.password_confirm.label': 'Heslo znovu',

  // input placeholders
  'register.company.input.ico.placeholder': 'např. 12345678',
  'register.company.input.name.placeholder': 'např. Známá firma',
  'register.company.input.staff_name.placeholder': 'Jan Novák',
  'register.company.input.email.placeholder': 'vas@email.cz',
  'register.company.input.password.placeholder': 'Heslo',
  'register.company.input.password_confirm.placeholder': 'Potvrďte heslo',

  // form errors
  'register.company.error.general': 'Při registraci došlo k chybě',
  'register.company.input.ico.error.format': 'Zadejte prosím platné IČO',
  'register.company.input.ico.error.conflict':
    'Společnost pod tímto IČO už existuje.',
  'register.company.input.name.error.min': `Název společnosti musí obsahovat nejméně {length} {length, plural, 
    one {znak}
    few {znaky}
    other {znaků}
  }`,
  'register.company.input.name.error.max': `Název společnosti přesahuje maximální délku {length} {length, plural, 
    one {znak}
    few {znaky}
      other {znaků}
    }`,
  'register.company.input.name.error.required':
    'Doplňte prosím název společnosti.',
  'register.company.input.address.error': 'Zadejte prosím platnou adresu sídla',
  'register.company.input.string_address.error.required':
    'Zadejte prosím adresu',
  'register.company.input.staff_name.error.min': `Jméno administrátora musí obsahovat nejméně {length} {length, plural, 
    one {znak}
    few {znaky}
    other {znaků}
  }`,
  'register.company.input.staff_name.error.max': `Jméno administrátora přesahuje maximální délku {length} {length, plural, 
    one {znak}
    few {znaky}
      other {znaků}
    }`,
  'register.company.input.staff_name.error.required':
    'Doplňte prosím jméno administrátora.',
  'register.company.input.email.error.format':
    'Emailová adresa není ve správném tvaru',
  'register.company.input.email.error.required':
    'Emailová adresa nemůže být prázdná',
  'register.company.input.email.error.conflict':
    'Účet s touto emailovou adresou již existuje',
  'register.company.input.password.error.required': 'Heslo nemůžse být prázdné',
  'register.company.input.password.error.min':
    'Heslo musí obsahovat nejméně 6 znaků',
  'register.company.input.password.error.max': 'Heslo je příliš dlouhé',
  'register.company.input.password_confirm.error.match':
    'Zadaná hesla nesouhlasí',

  // buttons
  'register.company.button.submit': 'Registrovat se',
  'register.company.button.back': 'Zadat jiné IČO',

  // toasts
  'register.company.toast.success':
    'Společnost "{companyName}" a její účet byly vytvořeny.',
  'register.company.toast.error':
    'Při registraci došlo k chybě, zkuste to prosím později.',
};
