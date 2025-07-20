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
import Logo from './common/Logo';

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
          <Logo size={64} />
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
            <View style={styles.logoutIconContainer}>
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
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    fontWeight: '500',
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  activeMenuItem: {
    backgroundColor: colors.primary,
    ...shadows.md,
    transform: [{ scale: 1.02 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  activeIconContainer: {
    backgroundColor: colors.secondary,
    ...shadows.md,
  },
  menuText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  activeMenuText: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  activeIndicator: {
    width: 4,
    height: 24,
    backgroundColor: colors.textWhite,
    borderRadius: 2,
    position: 'absolute',
    right: spacing.md,
    ...shadows.sm,
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    ...shadows.sm,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
    flex: 1,
  },
  logoutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});

export default Sidebar;
