import React from 'react';
import Svg, { Rect, Path, Text as SvgText } from 'react-native-svg';

const Logo = ({ size = 72 }) => (
  <Svg width={size} height={size} viewBox="0 0 72 72" fill="none">
    {/* Fundo */}
    <Rect x="0" y="0" width="72" height="72" rx="16" fill="#1976D2" />
    {/* Gráfico */}
    <Path d="M20 48V36C20 34.8954 20.8954 34 22 34H26C27.1046 34 28 34.8954 28 36V48" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    <Path d="M32 48V28C32 26.8954 32.8954 26 34 26H38C39.1046 26 40 26.8954 40 28V48" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    <Path d="M44 48V42C44 40.8954 44.8954 40 46 40H50C51.1046 40 52 40.8954 52 42V48" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    {/* Letras ERP */}
    <SvgText x="36" y="66" textAnchor="middle" fontWeight="bold" fontSize="18" fill="#fff">ERP</SvgText>
  </Svg>
);

export default Logo;
