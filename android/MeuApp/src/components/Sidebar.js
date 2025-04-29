// src/components/Sidebar.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const Sidebar = ({ navigation }) => {

  const menuItems = [
    { name: 'Dashboard', icon: 'pie-chart' },
    { name: 'Clientes', icon: 'people' },
    { name: 'Produtos', icon: 'cube' },
    { name: 'Pedidos', icon: 'document-text' },
    { name: 'Financeiro', icon: 'cash' },
  ];

  const handleLogout = () => {
    navigation.navigate('Auth'); // volta para tela de login
  };

  return (
    <DrawerContentScrollView style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.name)}
        >
          <Ionicons name={item.icon} size={22} color="#27ae60" />
          <Text style={styles.menuText}>{item.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
        <Ionicons name="log-out" size={22} color="red" />
        <Text style={[styles.menuText, { color: 'red' }]}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  logout: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
  },
});

export default Sidebar;
