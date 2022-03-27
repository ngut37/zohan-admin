export const messageIdConcat = (prefix: string) => (rest?: string) => {
  let messageId = `${prefix}`;
  if (rest) {
    messageId += `.${rest}`;
  }
  return messageId;
};
