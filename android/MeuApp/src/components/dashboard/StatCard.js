// src/components/dashboard/StatCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ title, value, color }) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    marginBottom: 15,
  },
  title: { fontSize: 16, color: '#333' },
  value: { fontSize: 22, fontWeight: 'bold' },
});

export default StatCard;
