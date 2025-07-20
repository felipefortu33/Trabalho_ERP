// src/components/dashboard/LiveStatsCard.js
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const LiveStatsCard = ({ title, subtitle, liveData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (liveData.length === 0) return;

    const interval = setInterval(() => {
      // Animação de saída
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Troca o índice
        setCurrentIndex(prev => (prev + 1) % liveData.length);
        
        // Animação de entrada
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [liveData.length, fadeAnim, scaleAnim]);

  if (!liveData || liveData.length === 0) {
    return null;
  }

  const currentData = liveData[currentIndex];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <Animated.View 
        style={[
          styles.dataContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.mainData}>
          <View style={[styles.iconContainer, { backgroundColor: currentData.color + '20' }]}>
            <Ionicons name={currentData.icon} size={24} color={currentData.color} />
          </View>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: currentData.color }]}>
              {currentData.value}
            </Text>
            <Text style={styles.label}>{currentData.label}</Text>
          </View>
        </View>

        {currentData.description && (
          <Text style={styles.description}>{currentData.description}</Text>
        )}

        {currentData.timestamp && (
          <Text style={styles.timestamp}>
            Última atualização: {new Date(currentData.timestamp).toLocaleTimeString('pt-BR')}
          </Text>
        )}
      </Animated.View>

      {/* Indicadores de posição */}
      <View style={styles.indicators}>
        {liveData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
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
    marginBottom: spacing.md,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: spacing.xs,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.error,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dataContainer: {
    marginBottom: spacing.md,
  },
  mainData: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  valueContainer: {
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default LiveStatsCard;
