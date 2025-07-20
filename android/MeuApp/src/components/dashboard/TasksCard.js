// src/components/dashboard/TasksCard.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const TasksCard = ({ tasks = [], onTaskPress, onTaskComplete }) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta': return colors.error;
      case 'média': return colors.warning;
      case 'baixa': return colors.success;
      default: return colors.tertiary;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta': return 'flag';
      case 'média': return 'flag-outline';
      case 'baixa': return 'flag-outline';
      default: return 'flag-outline';
    }
  };

  const handleTaskComplete = (taskId) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
    onTaskComplete && onTaskComplete(taskId);
  };

  const pendingTasks = tasks.filter(task => !completedTasks.has(task.id));
  const completedCount = completedTasks.size;

  if (!tasks || tasks.length === 0) {
    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Tarefas Pendentes</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>Nenhuma tarefa pendente</Text>
          <Text style={styles.emptySubtext}>Você está em dia!</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Tarefas Pendentes</Text>
        <View style={styles.statsContainer}>
          {completedCount > 0 && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>+{completedCount}</Text>
            </View>
          )}
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>{pendingTasks.length}</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progresso</Text>
          <Text style={styles.progressPercentage}>
            {Math.round((completedCount / tasks.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${(completedCount / tasks.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.tasksList}
      >
        {pendingTasks.map((task, index) => (
          <TouchableOpacity
            key={task.id || index}
            style={styles.taskItem}
            onPress={() => onTaskPress && onTaskPress(task)}
            activeOpacity={0.7}
          >
            <View style={styles.taskContent}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleTaskComplete(task.id)}
              >
                <Ionicons 
                  name="ellipse-outline" 
                  size={20} 
                  color={colors.border} 
                />
              </TouchableOpacity>

              <View style={styles.taskInfo}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle} numberOfLines={2}>
                    {task.title}
                  </Text>
                  {task.priority && (
                    <View style={[styles.priorityBadge, { borderColor: getPriorityColor(task.priority) }]}>
                      <Ionicons 
                        name={getPriorityIcon(task.priority)} 
                        size={12} 
                        color={getPriorityColor(task.priority)} 
                      />
                    </View>
                  )}
                </View>

                {task.description && (
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}

                <View style={styles.taskFooter}>
                  {task.dueDate && (
                    <View style={styles.dueDateContainer}>
                      <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                      <Text style={styles.dueDate}>
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  )}
                  
                  {task.category && (
                    <View style={styles.categoryContainer}>
                      <Text style={styles.category}>{task.category}</Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons 
                  name="chevron-forward-outline" 
                  size={16} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Tarefas Completadas */}
        {completedCount > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.completedSectionTitle}>
              Concluídas ({completedCount})
            </Text>
            {tasks
              .filter(task => completedTasks.has(task.id))
              .map((task, index) => (
                <View key={`completed-${task.id || index}`} style={styles.completedTask}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={colors.success} 
                  />
                  <Text style={styles.completedTaskTitle}>{task.title}</Text>
                </View>
              ))}
          </View>
        )}
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
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  },
  completedText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  pendingBadge: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pendingText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressInfo: {
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
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  tasksList: {
    maxHeight: 400,
  },
  taskItem: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: spacing.sm,
    paddingTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  priorityBadge: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
  },
  taskDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  categoryContainer: {
    backgroundColor: colors.tertiary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  category: {
    fontSize: 10,
    color: colors.tertiary,
    fontWeight: '600',
  },
  actionButton: {
    padding: spacing.sm,
  },
  completedSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  completedSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  completedTask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  completedTaskTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    textDecorationLine: 'line-through',
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

export default TasksCard;
