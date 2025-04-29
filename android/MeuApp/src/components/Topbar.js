// src/components/Topbar.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // ícones bonitos

const Topbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.logo}>🔳 ABC</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Topbar;
