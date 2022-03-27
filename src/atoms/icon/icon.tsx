// Icons should be imported from https://heroicons.com/ to stay consistent (export as JSX)

import React, { PropsWithChildren, HTMLAttributes } from 'react';

import clsx from 'clsx';

import { IconType, iconTypes, BaseIconProps } from './icons/icon-types';

import classes from './icon.module.scss';

type BaseProps = {
  icon: IconType;
  className?: string;
} & BaseIconProps &
  HTMLAttributes<HTMLElement>;

export type IconProps = PropsWithChildren<BaseProps>;

export const Icon = ({
  icon,
  children,
  className,
  fill,
  stroke,
  ...props
}: IconProps) => {
  if (typeof fill === 'undefined') {
    fill = 'none';
  }

  if (typeof stroke === 'undefined') {
    stroke = 'currentcolor';
  }

  const iconType = iconTypes[icon];

  const Component = iconType;

  return (
    <div className={clsx(classes.iconWrapper, className)}>
      <i {...props}>
        {children}
        <Component fill={fill} stroke={stroke} />
      </i>
    </div>
  );
};
