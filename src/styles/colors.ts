import Color from 'color';

const base = {
  white: Color('#fff'),
  black: Color('#000'),
};

const named = {
  whitesmoke: Color('#f5f5f5'),
  silver: Color('#c0c0c0'),
  teal_50: Color('#E6FFFA'),
  teal_100: Color('#B2F5EA'),
  teal_200: Color('#81E6D9'),
  teal_300: Color('#4FD1C5'),
  teal_400: Color('#38B2AC'),
  teal_500: Color('#319795'),
  teal_600: Color('#2C7A7B'),
  teal_700: Color('#285E61'),
  teal_800: Color('#234E52'),
  teal_900: Color('#1D4044'),
  gray_400: Color('#A0AEC0'),
  interdimensional_blue: Color('#470dd9'),
};

export const colors = { ...base, ...named };

export type ColorName = keyof typeof colors;
