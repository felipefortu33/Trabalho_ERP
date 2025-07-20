// src/components/dashboard/StatCard.js
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const StatCard = ({ title, value, color, icon, onPress, trend, previousValue }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const valueAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  
  // Calcular largura responsiva
  const isTablet = width > 768;
  const cardWidth = isTablet ? '19%' : '48%';

  // Calcular trend
  const getTrendInfo = () => {
    if (trend !== undefined) {
      return {
        percentage: trend,
        isPositive: trend >= 0,
        icon: trend >= 0 ? 'trending-up-outline' : 'trending-down-outline'
      };
    }
    
    if (previousValue !== undefined && previousValue > 0) {
      const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
      const percentage = ((numericValue - previousValue) / previousValue) * 100;
      return {
        percentage: percentage,
        isPositive: percentage >= 0,
        icon: percentage >= 0 ? 'trending-up-outline' : 'trending-down-outline'
      };
    }
    
    return null;
  };

  const trendInfo = getTrendInfo();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(valueAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent 
      style={[
        styles.card, 
        { 
          width: cardWidth,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={[styles.valueIndicator, { backgroundColor: color }]} />
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.title}>{title}</Text>
        <Animated.Text 
          style={[
            styles.value, 
            { 
              color,
              opacity: valueAnim,
            }
          ]}
        >
          {value}
        </Animated.Text>
        
        {trendInfo && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={trendInfo.icon} 
              size={12} 
              color={trendInfo.isPositive ? colors.success : colors.error} 
            />
            <Text style={[
              styles.trendText,
              { color: trendInfo.isPositive ? colors.success : colors.error }
            ]}>
              {trendInfo.isPositive ? '+' : ''}{trendInfo.percentage.toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
      
      <View style={[styles.bottomLine, { backgroundColor: color }]} />
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    position: 'relative',
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  cardBody: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
});

export default StatCard;
