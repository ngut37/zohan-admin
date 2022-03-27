import { IntlShape } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

type MessageData =
  | { id: string; text?: undefined; values?: Record<string, any> }
  | { text: string; id?: undefined };

export type Message = MessageData & {
  disableHTMLRender?: boolean;
};

export const messageToString = (message: Message, intl: IntlShape) => {
  let content = '';

  if (message.id && !message.disableHTMLRender) {
    content = intl.formatMessage(
      { id: message.id },
      {
        span: (chunks) => sanitizeHtml(`<span>${chunks}</span>`),
        b: (chunks) => sanitizeHtml(`<b>${chunks}</b>`),
        strong: (chunks) => sanitizeHtml(`<b>${chunks}</b>`),
        sup: (chunks) => sanitizeHtml(`<sup>${chunks}</sup>`),
        br: () => sanitizeHtml(`<br/>`),
        ...message.values,
      },
    );
  } else if (message.id && message.disableHTMLRender) {
    content = intl.formatMessage({ id: message.id }, message.values);
  } else if (message.text) {
    return message.text;
  }

  return content;
};
