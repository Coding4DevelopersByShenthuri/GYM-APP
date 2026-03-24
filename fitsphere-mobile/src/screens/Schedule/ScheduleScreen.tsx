import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors } from '../../theme';

export default function ScheduleScreen() {
  const slots = [
    { id: '1', time: '08:00 AM', workout: 'Morning Cardio', available: true },
    { id: '2', time: '10:00 AM', workout: 'Neural Strength', available: false },
    { id: '3', time: '05:00 PM', workout: 'Cyber HIIT', available: true },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym Scheduling</Text>
      
      <GlassCard style={styles.infoCard}>
        <Text style={styles.infoTitle}>Smart Suggestion</Text>
        <Text style={styles.infoText}>The gym is 20% less crowded at 08:00 AM. Perfect for your session.</Text>
      </GlassCard>

      <Text style={styles.sectionTitle}>Available Slots</Text>
      <ScrollView>
        {slots.map((slot) => (
          <GlassCard key={slot.id} style={[styles.slotCard, !slot.available && styles.disabledCard]}>
            <View style={styles.slotHeader}>
              <View>
                <Text style={styles.slotTime}>{slot.time}</Text>
                <Text style={styles.slotWorkout}>{slot.workout}</Text>
              </View>
              {slot.available ? (
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.fullText}>FULL</Text>
              )}
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoCard: {
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accentPrimary,
  },
  infoTitle: {
    color: Colors.accentPrimary,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  infoText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  slotCard: {
    marginBottom: 15,
    padding: 20,
  },
  disabledCard: {
    opacity: 0.5,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotTime: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  slotWorkout: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  bookButton: {
    backgroundColor: 'rgba(0, 210, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
  },
  bookButtonText: {
    color: Colors.accentPrimary,
    fontWeight: 'bold',
  },
  fullText: {
    color: Colors.danger,
    fontWeight: 'bold',
  },
});
