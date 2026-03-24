import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors } from '../../theme';

export default function WorkoutBuilder() {
  const [exercises, setExercises] = useState([
    { id: '1', name: 'Cyber Squats', sets: 4, reps: 12 },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Protocol</Text>
      
      <GlassCard style={styles.inputCard}>
        <TextInput 
          style={styles.workoutNameInput} 
          placeholder="Protocol Name (e.g. Titan Strength)" 
          placeholderTextColor={Colors.textSecondary}
        />
      </GlassCard>

      <Text style={styles.sectionTitle}>Exercises</Text>
      <ScrollView style={styles.exerciseList}>
        {exercises.map((item) => (
          <GlassCard key={item.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseDetails}>{item.sets} Sets • {item.reps} Reps</Text>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <GlowButton title="+ Add Exercise" style={styles.addButton} variant="purple" />
      <GlowButton title="Save Protocol" style={styles.saveButton} />
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
  inputCard: {
    marginBottom: 20,
  },
  workoutNameInput: {
    color: Colors.textPrimary,
    fontSize: 18,
    padding: 10,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCard: {
    marginBottom: 15,
    padding: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '500',
  },
  exerciseDetails: {
    color: Colors.accentPrimary,
    fontSize: 14,
  },
  addButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accentSecondary,
    padding: 12,
  },
  saveButton: {
    marginBottom: 30,
  },
});
