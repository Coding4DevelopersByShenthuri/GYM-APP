import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Modal, Alert, Animated, RefreshControl,
} from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors, Typography, Spacing, Shadows } from '../../theme';
import apiClient from '../../services/authService';
import { Dumbbell, Plus, ChevronRight, X, Sparkles } from 'lucide-react-native';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDesc, setWorkoutDesc] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: '3', reps: '10', weight: '' }]);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await apiClient.get('/workouts');
      setWorkouts(response.data);
    } catch (error) {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addExerciseField = () => {
    setExercises([...exercises, { name: '', sets: '3', reps: '10', weight: '' }]);
  };

  const removeExerciseField = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const updateExercise = (idx: number, field: keyof Exercise, value: string) => {
    const updated = [...exercises];
    updated[idx][field] = value;
    setExercises(updated);
  };

  const handleCreate = async () => {
    if (!workoutTitle.trim()) {
      Alert.alert('Missing Field', 'Please enter a protocol name.');
      return;
    }
    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) {
      Alert.alert('Missing Exercises', 'Add at least one exercise with a name.');
      return;
    }

    setSaving(true);
    try {
      await apiClient.post('/workouts', {
        title: workoutTitle,
        description: workoutDesc,
        exercises: validExercises.map((e) => ({
          name: e.name,
          sets: parseInt(e.sets) || 3,
          reps: parseInt(e.reps) || 10,
          weight: e.weight ? parseFloat(e.weight) : null,
        })),
      });
      setShowCreateModal(false);
      setWorkoutTitle('');
      setWorkoutDesc('');
      setExercises([{ name: '', sets: '3', reps: '10', weight: '' }]);
      await fetchWorkouts();
      Alert.alert('Protocol Saved! 🔥', `"${workoutTitle}" has been added.`);
    } catch (error) {
      Alert.alert('Error', 'Could not save protocol. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAIGenerate = async () => {
    setSaving(true);
    try {
      const resp = await apiClient.post('/ai/generate-workout', {
        goal: 'GENERAL_FITNESS',
        experienceLevel: 'INTERMEDIATE',
        durationMinutes: 45
      });
      if (resp.data.plan) {
        setWorkoutTitle(resp.data.plan.title);
        setWorkoutDesc(resp.data.plan.description);
        setExercises(resp.data.plan.exercises.map((e: any) => ({
          name: e.name, sets: e.sets.toString(), reps: e.reps.toString(), weight: e.weight?.toString() || ''
        })));
        setShowCreateModal(true);
      }
    } catch (e) {
      Alert.alert('AI Error', 'Could not generate workout. Are you sure the backend has the AI endpoint implemented?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWorkouts(); }} tintColor={Colors.accentPrimary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Workout Protocols</Text>
            <Text style={styles.subtitle}>{workouts.length} protocols in your arsenal</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.addFab, { backgroundColor: Colors.accentGold }]} onPress={handleAIGenerate} disabled={saving}>
              <Sparkles size={22} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addFab} onPress={() => setShowCreateModal(true)}>
              <Plus size={22} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout List */}
        {workouts.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Dumbbell size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Protocols Yet</Text>
            <Text style={styles.emptyText}>Tap the + button to create your first workout protocol</Text>
            <GlowButton title="Create Protocol" variant="cyan" size="md" style={{ marginTop: 16 }} onPress={() => setShowCreateModal(true)} />
          </GlassCard>
        ) : (
          workouts.map((workout) => (
            <TouchableOpacity key={workout.id} onPress={() => setExpanded(expanded === workout.id ? null : workout.id)}>
              <GlassCard variant={expanded === workout.id ? 'cyan' : 'default'} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutIconWrap}>
                    <Dumbbell size={18} color={Colors.accentPrimary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    {workout.description ? <Text style={styles.workoutDesc}>{workout.description}</Text> : null}
                  </View>
                  <View style={styles.workoutMeta}>
                    <Text style={styles.exerciseCount}>{workout.exercises?.length || 0} ex.</Text>
                    <ChevronRight size={16} color={Colors.textSecondary} style={{ transform: [{ rotate: expanded === workout.id ? '90deg' : '0deg' }] }} />
                  </View>
                </View>
                {expanded === workout.id && (
                  <View style={styles.exerciseList}>
                    {workout.exercises?.map((ex: any) => (
                      <View key={ex.id} style={styles.exerciseRow}>
                        <Text style={styles.exName}>{ex.name}</Text>
                        <Text style={styles.exDetail}>{ex.sets} × {ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ''}</Text>
                      </View>
                    ))}
                    <GlowButton title="Start This Workout" variant="cyan" size="sm" style={{ marginTop: 12 }} />
                  </View>
                )}
              </GlassCard>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Workout Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Protocol</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Protocol Name (e.g. Titan Strength)"
                placeholderTextColor={Colors.textMuted}
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                placeholderTextColor={Colors.textMuted}
                value={workoutDesc}
                onChangeText={setWorkoutDesc}
              />
              <Text style={styles.sectionLabel}>EXERCISES</Text>
              {exercises.map((ex, idx) => (
                <GlassCard key={idx} style={styles.exerciseInputCard}>
                  <View style={styles.exerciseInputHeader}>
                    <Text style={styles.exerciseNum}>Exercise {idx + 1}</Text>
                    {idx > 0 && (
                      <TouchableOpacity onPress={() => removeExerciseField(idx)}>
                        <X size={16} color={Colors.danger} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Exercise Name (e.g. Bench Press)"
                    placeholderTextColor={Colors.textMuted}
                    value={ex.name}
                    onChangeText={(v) => updateExercise(idx, 'name', v)}
                  />
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputSmall]}
                      placeholder="Sets"
                      placeholderTextColor={Colors.textMuted}
                      value={ex.sets}
                      onChangeText={(v) => updateExercise(idx, 'sets', v)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.input, styles.inputSmall]}
                      placeholder="Reps"
                      placeholderTextColor={Colors.textMuted}
                      value={ex.reps}
                      onChangeText={(v) => updateExercise(idx, 'reps', v)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.input, styles.inputSmall]}
                      placeholder="kg"
                      placeholderTextColor={Colors.textMuted}
                      value={ex.weight}
                      onChangeText={(v) => updateExercise(idx, 'weight', v)}
                      keyboardType="numeric"
                    />
                  </View>
                </GlassCard>
              ))}
              <GlowButton title="+ Add Exercise" variant="ghost" size="sm" style={{ marginBottom: 12 }} onPress={addExerciseField} />
              <GlowButton title="Save Protocol 🚀" variant="cyan" loading={saving} onPress={handleCreate} />
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.black },
  container: { flex: 1, paddingHorizontal: Spacing.md, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  title: { ...Typography.h1, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: 4 },
  addFab: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.accentPrimary, justifyContent: 'center', alignItems: 'center', ...Shadows.glowCyan },
  emptyCard: { alignItems: 'center', padding: 40, gap: 10, marginTop: 40 },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary, marginTop: 10 },
  emptyText: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  workoutCard: { marginBottom: 12, padding: Spacing.md },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  workoutIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0,229,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  workoutTitle: { ...Typography.h3, color: Colors.textPrimary },
  workoutDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  workoutMeta: { alignItems: 'flex-end', gap: 4 },
  exerciseCount: { ...Typography.caption, color: Colors.accentPrimary },
  exerciseList: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.borderSubtle, gap: 8 },
  exerciseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exName: { ...Typography.body, color: Colors.textPrimary },
  exDetail: { ...Typography.caption, color: Colors.accentPrimary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: Colors.surfaceBase, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.lg, maxHeight: '90%', borderWidth: 1, borderColor: Colors.glassBorder },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitle: { ...Typography.h2, color: Colors.textPrimary },
  sectionLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surfaceElevated, borderRadius: 12, padding: 14, color: Colors.textPrimary, marginBottom: 10, borderWidth: 1, borderColor: Colors.glassBorder, fontSize: 14 },
  inputRow: { flexDirection: 'row', gap: 8 },
  inputSmall: { flex: 1 },
  exerciseInputCard: { marginBottom: 10, padding: Spacing.md },
  exerciseInputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  exerciseNum: { ...Typography.caption, color: Colors.accentPrimary, fontWeight: '700' },
});
