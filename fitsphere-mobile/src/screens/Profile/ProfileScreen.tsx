import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors } from '../../theme';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userBio}>Elite Athlete • Level 42</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>128</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>15.4k</Text>
          <Text style={styles.statLabel}>Burned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text>
      <GlassCard style={styles.preferenceCard}>
        <Text style={styles.preferenceLabel}>Current Goal</Text>
        <Text style={styles.preferenceValue}>Muscle Gain</Text>
      </GlassCard>
      <GlassCard style={styles.preferenceCard}>
        <Text style={styles.preferenceLabel}>Experience Level</Text>
        <Text style={styles.preferenceValue}>Intermediate</Text>
      </GlassCard>

      <GlowButton title="Edit Profile" style={styles.editButton} variant="blue" />
      <GlowButton title="Log Out" style={styles.logoutButton} variant="blue" />
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
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.accentPrimary,
    padding: 3,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userBio: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.accentPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  preferenceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 10,
  },
  preferenceLabel: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  preferenceValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 30,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
  },
  logoutButton: {
    marginTop: 15,
    marginBottom: 50,
    backgroundColor: 'transparent',
    borderColor: Colors.danger,
    borderWidth: 1,
  },
});
