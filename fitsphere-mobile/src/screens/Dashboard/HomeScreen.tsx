import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors } from '../../theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Athlete</Text>
        <Text style={styles.date}>Wednesday, March 24</Text>
      </View>

      <GlassCard style={styles.aiCard}>
        <Text style={styles.cardTitle}>AI Insights</Text>
        <Text style={styles.aiText}>"Your recovery is optimal. Today is the best day for a Titan Strength session."</Text>
        <GlowButton title="View Recommendation" style={styles.aiButton} variant="purple" />
      </GlassCard>

      <View style={styles.statsContainer}>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statLabel}>Burned</Text>
          <Text style={styles.statValue}>850 kcal</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statLabel}>Workout</Text>
          <Text style={styles.statValue}>45 mins</Text>
        </GlassCard>
      </View>

      <Text style={styles.sectionTitle}>Daily Progress</Text>
      <GlassCard style={styles.progressCard}>
        {/* Placeholder for a chart or progress bars */}
        <View style={styles.progressPlaceholder} />
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  aiCard: {
    padding: 20,
    marginBottom: 20,
    borderColor: Colors.accentPrimary,
  },
  cardTitle: {
    color: Colors.accentPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aiText: {
    color: Colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
  },
  aiButton: {
    backgroundColor: 'rgba(0, 210, 255, 0.15)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  aiButtonText: {
    color: Colors.accentPrimary,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressCard: {
    height: 150,
    marginBottom: 30,
  },
  progressPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
  },
});
