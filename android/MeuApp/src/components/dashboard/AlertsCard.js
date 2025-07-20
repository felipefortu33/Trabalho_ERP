// src/components/dashboard/AlertsCard.js
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const AlertsCard = ({ alerts = [], onAlertPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      case 'info': return colors.info;
      case 'success': return colors.success;
      default: return colors.tertiary;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return 'alert-circle-outline';
      case 'warning': return 'warning-outline';
      case 'info': return 'information-circle-outline';
      case 'success': return 'checkmark-circle-outline';
      default: return 'ellipse-outline';
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Alertas e Notificações</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>Nenhum alerta no momento</Text>
          <Text style={styles.emptySubtext}>Tudo funcionando perfeitamente!</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Alertas e Notificações</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{alerts.length}</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.alertsList}
      >
        {alerts.map((alert, index) => (
          <TouchableOpacity
            key={alert.id || index}
            style={[styles.alertItem, { borderLeftColor: getAlertColor(alert.type) }]}
            onPress={() => onAlertPress && onAlertPress(alert)}
            activeOpacity={0.7}
          >
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <View style={[styles.alertIconContainer, { backgroundColor: getAlertColor(alert.type) + '20' }]}>
                  <Ionicons 
                    name={getAlertIcon(alert.type)} 
                    size={16} 
                    color={getAlertColor(alert.type)} 
                  />
                </View>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle} numberOfLines={2}>
                    {alert.title}
                  </Text>
                  {alert.timestamp && (
                    <Text style={styles.alertTime}>
                      {new Date(alert.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  )}
                </View>
              </View>
              
              {alert.description && (
                <Text style={styles.alertDescription} numberOfLines={3}>
                  {alert.description}
                </Text>
              )}
              
              {alert.action && (
                <View style={styles.alertActions}>
                  <Text style={[styles.actionText, { color: getAlertColor(alert.type) }]}>
                    {alert.action}
                  </Text>
                  <Ionicons 
                    name="chevron-forward-outline" 
                    size={16} 
                    color={getAlertColor(alert.type)} 
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertsList: {
    maxHeight: 300,
  },
  alertItem: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  alertTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  alertDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  alertActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default AlertsCard;
