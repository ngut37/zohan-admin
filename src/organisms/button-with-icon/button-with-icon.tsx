import React from 'react';

import { Button, ButtonProps, Icon, IconType } from '@atoms';

import { colors } from '@styles';

import classes from './button-with-icon.module.scss';

type Props = ButtonProps & {
  icon?: IconType;
};

export const ButtonWithIcon = ({ onClick, message, icon }: Props) => {
  return (
    <>
      {icon && (
        <Icon
          className={classes.icon}
          icon="badge-check"
          stroke={colors.interdimensional_blue.hex()}
        />
      )}
      <Button message={message} onClick={onClick} />
    </>
  );
};
