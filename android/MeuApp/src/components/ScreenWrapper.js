// src/components/ScreenWrapper.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

const ScreenWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default ScreenWrapper;
