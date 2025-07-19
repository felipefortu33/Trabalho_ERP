// src/utils/responsive.js
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isTablet = dimensions.width > 768;
  const isLandscape = dimensions.width > dimensions.height;
  const screenWidth = dimensions.width;
  const screenHeight = dimensions.height;

  // Breakpoints
  const breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  };

  const getColumns = (defaultCols = 2) => {
    if (screenWidth >= breakpoints.xl) return defaultCols + 2;
    if (screenWidth >= breakpoints.lg) return defaultCols + 1;
    if (screenWidth >= breakpoints.md) return defaultCols;
    return Math.max(1, defaultCols - 1);
  };

  const getFontSize = (baseSize) => {
    if (isTablet) return baseSize + 2;
    return baseSize;
  };

  const getSpacing = (baseSpacing) => {
    if (isTablet) return baseSpacing * 1.2;
    return baseSpacing;
  };

  return {
    dimensions,
    isTablet,
    isLandscape,
    screenWidth,
    screenHeight,
    breakpoints,
    getColumns,
    getFontSize,
    getSpacing,
  };
};

export const responsive = {
  // Função para calcular larguras responsivas
  width: (percentage, minWidth = 0, maxWidth = Infinity) => {
    const { width } = Dimensions.get('window');
    const calculatedWidth = (width * percentage) / 100;
    return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
  },

  // Função para calcular alturas responsivas
  height: (percentage, minHeight = 0, maxHeight = Infinity) => {
    const { height } = Dimensions.get('window');
    const calculatedHeight = (height * percentage) / 100;
    return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
  },

  // Função para escalar fontes
  fontScale: (size) => {
    const { width } = Dimensions.get('window');
    if (width > 768) return size * 1.1;
    if (width < 400) return size * 0.9;
    return size;
  },
};
