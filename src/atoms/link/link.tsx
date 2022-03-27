import React, { PropsWithChildren } from 'react';

import { useIntl } from 'react-intl';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import clsx from 'clsx';

import { Message, messageToString } from '@utils/message';

import classes from './link.module.scss';

export type LinkProps = PropsWithChildren<
  {
    className?: string;
    newTab?: boolean;
    external?: boolean;
    message?: Message;
    onClick?: () => void;
  } & LinkPropsRoute &
    NextLinkProps
>;

export type LinkPropsRoute = {
  to?: string;
  as?: string;
  href?: string;
};

export const Link = ({
  className,
  children,
  newTab,
  external,
  message,
  onClick,
  ...nextLinkProps
}: LinkProps) => {
  const intl = useIntl();

  const anchorProps: Record<string, any> = {
    className: clsx(className, classes.link),
    target: newTab ? '_blank' : '_self',
  };
  if (external) anchorProps.href = nextLinkProps.href;

  let formattedMessage: {} | null | undefined = '';
  if (message) formattedMessage = messageToString(message, intl);

  const anchor = (
    <a onClick={onClick} {...anchorProps}>
      {formattedMessage ? formattedMessage : children}
    </a>
  );

  if (external) return anchor;

  return <NextLink {...nextLinkProps}>{anchor}</NextLink>;
};
