import { ComponentType, CSSProperties } from 'react';

import { BadgeCheck } from './badge-check';

export type BaseIconProps = {
  fill?: CSSProperties['color'];
  stroke?: CSSProperties['color'];
};

export type IconType = 'badge-check';

export const iconTypes: Record<IconType, ComponentType<BaseIconProps>> = {
  'badge-check': BadgeCheck,
};
