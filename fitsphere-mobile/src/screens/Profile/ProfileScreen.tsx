import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, Animated,
} from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors, Typography, Spacing, Shadows } from '../../theme';
import apiClient, { getStoredUser, logout } from '../../services/authService';
import { User, Edit2, Save, X, Target, Zap, LogOut } from 'lucide-react-native';

interface ProfileScreenProps {
  onLogout: () => void;
}

const GOALS = ['WEIGHT_LOSS', 'MUSCLE_GAIN', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL_FITNESS'];
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', weight: '', goal: '', experienceLevel: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getStoredUser();
    setUser(userData);
    if (userData) {
      setForm({
        name: userData.name || '',
        age: userData.age?.toString() || '',
        weight: userData.weight?.toString() || '',
        goal: userData.goal || 'MUSCLE_GAIN',
        experienceLevel: userData.experienceLevel || 'INTERMEDIATE',
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiClient.put('/auth/profile', {
        name: form.name,
        age: form.age ? parseInt(form.age) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        goal: form.goal,
        experienceLevel: form.experienceLevel,
      });
      const updated = { ...user, ...response.data };
      setUser(updated);
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('user_data', JSON.stringify(updated));
      setEditing(false);
      Alert.alert('Profile Updated! ✅', 'Your changes have been saved.');
    } catch (error: any) {
      Alert.alert('Update Failed', error.response?.data?.error || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => { await logout(); onLogout(); } },
    ]);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const goalLabel = (g: string) => g.replace(/_/g, ' ');

  if (!user) return null;

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => editing ? setEditing(false) : setEditing(true)} style={styles.editBtn}>
            {editing ? <X size={18} color={Colors.danger} /> : <Edit2 size={18} color={Colors.accentPrimary} />}
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          </View>
          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              placeholder="Your Name"
              placeholderTextColor={Colors.textMuted}
            />
          ) : (
            <Text style={styles.userName}>{user.name}</Text>
          )}
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Zap size={18} color={Colors.accentGold} />
            <Text style={styles.statValue}>Lvl 12</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </GlassCard>
          <GlassCard variant="cyan" style={styles.statCard}>
            <Target size={18} color={Colors.accentPrimary} />
            <Text style={styles.statValue}>{form.goal ? goalLabel(form.goal).split(' ')[0] : '—'}</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <User size={18} color={Colors.accentSecondary} />
            <Text style={styles.statValue}>{form.experienceLevel?.charAt(0) || '—'}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </GlassCard>
        </View>

        {/* Edit Form */}
        {editing ? (
          <GlassCard style={styles.formCard}>
            <Text style={styles.sectionLabel}>PHYSICAL INFO</Text>
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={form.age}
                  onChangeText={(v) => setForm({ ...form, age: v })}
                  placeholder="e.g. 25"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={form.weight}
                  onChangeText={(v) => setForm({ ...form, weight: v })}
                  placeholder="e.g. 75"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.sectionLabel}>FITNESS GOAL</Text>
            <View style={styles.chipRow}>
              {GOALS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, form.goal === g && styles.chipActive]}
                  onPress={() => setForm({ ...form, goal: g })}
                >
                  <Text style={[styles.chipText, form.goal === g && styles.chipTextActive]}>
                    {goalLabel(g)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>EXPERIENCE LEVEL</Text>
            <View style={styles.chipRow}>
              {LEVELS.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.chip, form.experienceLevel === l && styles.chipActive]}
                  onPress={() => setForm({ ...form, experienceLevel: l })}
                >
                  <Text style={[styles.chipText, form.experienceLevel === l && styles.chipTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <GlowButton title="Save Changes" variant="cyan" loading={saving} onPress={handleSave} style={{ marginTop: 16 }} />
          </GlassCard>
        ) : (
          <GlassCard style={styles.formCard}>
            <Text style={styles.sectionLabel}>ACCOUNT INFO</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Goal</Text>
              <Text style={styles.infoValue}>{form.goal ? goalLabel(form.goal) : 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{form.experienceLevel || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{form.age || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{form.weight ? `${form.weight} kg` : 'Not set'}</Text>
            </View>
          </GlassCard>
        )}

        {/* Logout */}
        <GlowButton
          title="Log Out"
          variant="danger"
          style={styles.logoutBtn}
          icon={<LogOut size={16} color={Colors.textPrimary} />}
          onPress={handleLogout}
        />
        <View style={{ height: 120 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.black },
  container: { flex: 1, paddingHorizontal: Spacing.md, paddingTop: 60 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  title: { ...Typography.h1, color: Colors.textPrimary },
  editBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: Colors.glassBorder, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cardBg },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarRing: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: Colors.accentPrimary, padding: 4, marginBottom: 14, ...Shadows.glowCyan },
  avatar: { flex: 1, borderRadius: 51, backgroundColor: 'rgba(0,229,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  initials: { ...Typography.h1, color: Colors.accentPrimary, fontSize: 32 },
  userName: { ...Typography.h2, color: Colors.textPrimary },
  userEmail: { ...Typography.body, color: Colors.textSecondary, marginTop: 4 },
  nameInput: { ...Typography.h2, color: Colors.textPrimary, borderBottomWidth: 1, borderBottomColor: Colors.accentPrimary, paddingBottom: 4, textAlign: 'center', minWidth: 200 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: { flex: 1, alignItems: 'center', padding: Spacing.md, gap: 6 },
  statValue: { ...Typography.h3, color: Colors.textPrimary },
  statLabel: { ...Typography.caption, color: Colors.textSecondary },
  formCard: { padding: Spacing.md, marginBottom: Spacing.md, gap: 2 },
  sectionLabel: { ...Typography.label, color: Colors.textSecondary, marginTop: 8, marginBottom: Spacing.sm },
  inputRow: { flexDirection: 'row', gap: Spacing.sm },
  inputLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 4 },
  input: { backgroundColor: Colors.surfaceElevated, borderRadius: 10, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.glassBorder, fontSize: 14, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.cardBg },
  chipActive: { backgroundColor: Colors.accentPrimary, borderColor: Colors.accentPrimary },
  chipText: { ...Typography.caption, color: Colors.textSecondary },
  chipTextActive: { color: Colors.black, fontWeight: '700' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  infoLabel: { ...Typography.body, color: Colors.textSecondary },
  infoValue: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600' },
  logoutBtn: { marginBottom: Spacing.md },
});
