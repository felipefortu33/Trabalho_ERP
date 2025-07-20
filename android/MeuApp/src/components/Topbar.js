// src/components/Topbar.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation, useNavigationState, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './common/Logo';
import { colors, spacing, shadows } from '../utils/colors';

const Topbar = ({ title, navigation: propNavigation }) => {
  const hookNavigation = useNavigation();
  const navigation = propNavigation || hookNavigation;
  const navigationState = useNavigationState(state => state);
  
  const getTitle = () => {
    if (title) return title;
    
    const routeName = navigationState?.routes[navigationState?.index]?.name;
    const titles = {
      'Dashboard': 'Painel Principal',
      'Clientes': 'Gerenciar Clientes',
      'Produtos': 'Gerenciar Produtos',
      'Pedidos': 'Gerenciar Pedidos',
      'Financeiro': 'Controle Financeiro',
    };
    
    return titles[routeName] || 'Sistema ERP';
  };

  const handleMenuPress = () => {
    try {
      if (navigation && navigation.dispatch) {
        navigation.dispatch(DrawerActions.openDrawer());
      } else if (navigation && navigation.openDrawer) {
        navigation.openDrawer();
      } else {
        console.warn('Drawer navigation not available');
      }
    } catch (error) {
      console.warn('Erro ao abrir drawer:', error);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <LinearGradient
        colors={colors.gradientPrimary}
        style={styles.container}
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color={colors.textWhite} />
          </TouchableOpacity>
          
          <View style={styles.centerContent}>
            <Logo size={32} />
            <Text style={styles.title}>{getTitle()}</Text>
          </View>
          
          <View style={styles.rightContent}>
            <TouchableOpacity 
              style={styles.searchButton}
              activeOpacity={0.7}
            >
              <Ionicons name="search-outline" size={20} color={colors.textWhite} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.notificationButton}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.textWhite} />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight + 10,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    ...shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  centerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textWhite,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.textWhite,
  },
  badgeText: {
    color: colors.textWhite,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Topbar;
