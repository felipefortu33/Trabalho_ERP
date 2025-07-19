// src/components/Sidebar.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../utils/colors';
import AnimatedContainer from './common/AnimatedContainer';

const Sidebar = ({ navigation, state }) => {
  const [activeRoute, setActiveRoute] = useState(state?.routeNames[state?.index] || 'Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: 'analytics-outline', title: 'Painel Principal' },
    { name: 'Clientes', icon: 'people-outline', title: 'Clientes' },
    { name: 'Produtos', icon: 'cube-outline', title: 'Produtos' },
    { name: 'Pedidos', icon: 'document-text-outline', title: 'Pedidos' },
    { name: 'Financeiro', icon: 'card-outline', title: 'Financeiro' },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Sair do Sistema',
      'Tem certeza de que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              navigation.navigate('Auth');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          },
        },
      ]
    );
  };

  const handleNavigate = (routeName) => {
    setActiveRoute(routeName);
    navigation.navigate(routeName);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header do Sidebar */}
      <LinearGradient
        colors={colors.gradientPrimary}
        style={styles.header}
      >
        <AnimatedContainer animation="fadeInUp" style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ERP</Text>
          </View>
          <Text style={styles.headerTitle}>Sistema de Gestão</Text>
          <Text style={styles.headerSubtitle}>Versão 1.0</Text>
        </AnimatedContainer>
      </LinearGradient>

      {/* Menu Items */}
      <DrawerContentScrollView 
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContent}>
          {menuItems.map((item, index) => {
            const isActive = activeRoute === item.name;
            return (
              <AnimatedContainer 
                key={item.name} 
                animation="fadeInUp" 
                delay={index * 100}
              >
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    isActive && styles.activeMenuItem
                  ]}
                  onPress={() => handleNavigate(item.name)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.iconContainer,
                    isActive && styles.activeIconContainer
                  ]}>
                    <Ionicons 
                      name={item.icon} 
                      size={22} 
                      color={isActive ? colors.textWhite : colors.textSecondary} 
                    />
                  </View>
                  <Text style={[
                    styles.menuText,
                    isActive && styles.activeMenuText
                  ]}>
                    {item.title}
                  </Text>
                  {isActive && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              </AnimatedContainer>
            );
          })}
        </View>

        {/* Botão de Logout */}
        <AnimatedContainer 
          animation="fadeInUp" 
          delay={menuItems.length * 100}
          style={styles.logoutContainer}
        >
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="log-out-outline" size={22} color={colors.error} />
            </View>
            <Text style={styles.logoutText}>Sair do Sistema</Text>
          </TouchableOpacity>
        </AnimatedContainer>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.8,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  menuContent: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    position: 'relative',
  },
  activeMenuItem: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activeIconContainer: {
    backgroundColor: colors.secondary,
  },
  menuText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  activeMenuText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  activeIndicator: {
    width: 4,
    height: 20,
    backgroundColor: colors.textWhite,
    borderRadius: 2,
    position: 'absolute',
    right: spacing.sm,
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '500',
    flex: 1,
  },
});

export default Sidebar;
