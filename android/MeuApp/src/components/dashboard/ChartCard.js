// src/components/dashboard/ChartCard.js
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const ChartCard = ({ title, data, color, type = 'bar', icon }) => {
  const animationValues = useRef([]).current;
  const { width } = Dimensions.get('window');
  const chartWidth = width - (spacing.lg * 4);
  const maxValue = Math.max(...data.map(item => item.value));

  // Inicializar animações
  useEffect(() => {
    data.forEach((_, index) => {
      animationValues[index] = new Animated.Value(0);
    });

    // Animar barras sequencialmente
    const animations = data.map((_, index) => 
      Animated.timing(animationValues[index], {
        toValue: 1,
        duration: 800,
        delay: index * 100,
        useNativeDriver: false,
      })
    );

    Animated.sequence(animations).start();
  }, [data]);

  const renderBarChart = () => {
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const animatedHeight = animationValues[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, barHeight],
          }) || 0;

          return (
            <View key={item.label} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: animatedHeight,
                      backgroundColor: color,
                    },
                  ]}
                />
                <Text style={styles.barValue}>{item.value}</Text>
              </View>
              <Text style={styles.barLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (chartWidth - 40);
      const y = 80 - ((item.value / maxValue) * 60);
      return { x, y, value: item.value, label: item.label };
    });

    return (
      <View style={styles.lineChartContainer}>
        <View style={styles.lineChart}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((line) => (
            <View
              key={line}
              style={[
                styles.gridLine,
                { top: `${line}%` },
              ]}
            />
          ))}
          
          {/* Data points */}
          {points.map((point, index) => (
            <View key={index}>
              <Animated.View
                style={[
                  styles.dataPoint,
                  {
                    left: point.x,
                    top: point.y,
                    backgroundColor: color,
                    opacity: animationValues[index] || 0,
                  },
                ]}
              />
              {index < points.length - 1 && (
                <Animated.View
                  style={[
                    styles.connectionLine,
                    {
                      left: point.x + 4,
                      top: point.y + 4,
                      width: points[index + 1].x - point.x,
                      transform: [
                        {
                          rotate: `${Math.atan2(
                            points[index + 1].y - point.y,
                            points[index + 1].x - point.x
                          )}rad`,
                        },
                      ],
                      backgroundColor: color,
                      opacity: animationValues[index] || 0,
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        
        {/* Labels */}
        <View style={styles.lineLabels}>
          {data.map((item, index) => (
            <Text key={index} style={styles.lineLabel} numberOfLines={1}>
              {item.label}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
              <Ionicons name={icon} size={20} color={color} />
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      
      {type === 'bar' ? renderBarChart() : renderLineChart()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingBottom: spacing.md,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 60,
  },
  barWrapper: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    minHeight: 2,
  },
  barValue: {
    position: 'absolute',
    top: -20,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  lineChartContainer: {
    height: 120,
  },
  lineChart: {
    height: 80,
    position: 'relative',
    marginBottom: spacing.md,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionLine: {
    position: 'absolute',
    height: 2,
  },
  lineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lineLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
});

export default ChartCard;
