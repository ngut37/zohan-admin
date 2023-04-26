type TextBackgroundColorCombination = {
  text: string;
  background: string;
};

export const textAndBackgroundColorCombinations: TextBackgroundColorCombination[] =
  [
    { text: '#FFFFFF', background: '#795548' },
    { text: '#FFFFFF', background: '#9E9E9E' },
    { text: '#FFFFFF', background: '#607D8B' },
    { text: '#FFFFFF', background: '#2196F3' },
    { text: '#FFFFFF', background: '#03A9F4' },
    { text: '#FFFFFF', background: '#4CAF50' },
    { text: '#FFFFFF', background: '#8BC34A' },
    { text: '#FFFFFF', background: '#CDDC39' },
    { text: '#FFFFFF', background: '#FFC107' },
    { text: '#FFFFFF', background: '#FFEB3B' },
    { text: '#FFFFFF', background: '#FF5722' },
    { text: '#FFFFFF', background: '#FF9800' },
    { text: '#FFFFFF', background: '#9C27B0' },
    { text: '#FFFFFF', background: '#E91E63' },
    { text: '#FFFFFF', background: '#673AB7' },
    { text: '#FFFFFF', background: '#3F51B5' },

    { text: '#000000', background: '#03A9F4' },
    { text: '#000000', background: '#2196F3' },
    { text: '#000000', background: '#3F51B5' },
    { text: '#000000', background: '#4CAF50' },
    { text: '#000000', background: '#607D8B' },
    { text: '#000000', background: '#673AB7' },
    { text: '#000000', background: '#795548' },
    { text: '#000000', background: '#8BC34A' },
    { text: '#000000', background: '#9C27B0' },
    { text: '#000000', background: '#9E9E9E' },
    { text: '#000000', background: '#CDDC39' },
    { text: '#000000', background: '#E91E63' },
    { text: '#000000', background: '#FF5722' },
    { text: '#000000', background: '#FF9800' },
    { text: '#000000', background: '#FFC107' },
    { text: '#000000', background: '#FFEB3B' },
  ];

export const getColorCombinationByIndex = (index: number) => {
  return textAndBackgroundColorCombinations[
    index % textAndBackgroundColorCombinations.length
  ];
};
