// src/components/dashboard/MetricsCard.js
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const MetricsCard = ({ title, current, previous, target, icon, color, unit = '' }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const { width } = Dimensions.get('window');
  
  const percentage = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const targetPercentage = target > 0 ? (current / target) * 100 : 0;
  const isPositive = percentage >= 0;
  
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
      Animated.timing(progressAnim, {
        toValue: Math.min(targetPercentage, 100),
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [targetPercentage]);

  const formatValue = (value) => {
    if (unit === 'currency') {
      return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return `${Number(value).toLocaleString('pt-BR')}${unit}`;
  };

  return (
    <Animated.View 
      style={[
        styles.card,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.currentValue}>{formatValue(current)}</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar para Meta */}
      {target > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Meta: {formatValue(target)}</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(targetPercentage)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Comparação com período anterior */}
      {previous > 0 && (
        <View style={styles.comparisonSection}>
          <View style={styles.comparisonContainer}>
            <Ionicons 
              name={isPositive ? 'trending-up-outline' : 'trending-down-outline'} 
              size={16} 
              color={isPositive ? colors.success : colors.error} 
            />
            <Text style={[
              styles.comparisonText,
              { color: isPositive ? colors.success : colors.error }
            ]}>
              {isPositive ? '+' : ''}{percentage.toFixed(1)}%
            </Text>
          </View>
          <Text style={styles.comparisonLabel}>vs. período anterior</Text>
        </View>
      )}

      {/* Indicador visual lateral */}
      <View style={[styles.sideIndicator, { backgroundColor: color }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    position: 'relative',
    ...shadows.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  comparisonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  comparisonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sideIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
});

export default MetricsCard;
