import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Animated, RefreshControl,
} from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors, Typography, Spacing, Shadows } from '../../theme';
import apiClient from '../../services/authService';
import { Calendar, Clock, Users, Zap, ChevronRight } from 'lucide-react-native';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleScreen() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [booking, setBooking] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await apiClient.get('/schedule');
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBook = async (scheduleId: string, title: string) => {
    setBooking(scheduleId);
    try {
      await apiClient.post('/schedule/book', { scheduleId });
      Alert.alert('Booked! ✅', `Your slot for "${title}" has been confirmed.`);
      fetchSchedules();
    } catch (error: any) {
      Alert.alert('Booking Failed', error.response?.data?.error || 'Could not book this slot.');
    } finally {
      setBooking(null);
    }
  };

  // Generate week day tabs
  const today = new Date();
  const dayTabs = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { label: DAYS[d.getDay()], date: d.getDate(), full: d };
  });

  // Filter slots for selected day
  const selectedDate = dayTabs[selectedDay].full;
  const filteredSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.startTime);
    return (
      slotDate.getDate() === selectedDate.getDate() &&
      slotDate.getMonth() === selectedDate.getMonth()
    );
  });

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchSchedules(); }} tintColor={Colors.accentPrimary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Gym Scheduling</Text>
          <Text style={styles.subtitle}>Book your premium session</Text>
        </View>

        {/* AI Suggestion */}
        <GlassCard variant="violet" style={styles.aiCard}>
          <View style={styles.aiRow}>
            <Zap size={18} color={Colors.accentSecondary} />
            <Text style={styles.aiLabel}>AI OPTIMAL TIME</Text>
          </View>
          <Text style={styles.aiText}>
            🕕 6:00 AM slot is 60% less crowded — perfect for your Titan Strength session today!
          </Text>
        </GlassCard>

        {/* Day picker */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
          {dayTabs.map((day, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.dayTab, selectedDay === idx && styles.dayTabActive]}
              onPress={() => setSelectedDay(idx)}
            >
              <Text style={[styles.dayLabel, selectedDay === idx && { color: Colors.black }]}>{day.label}</Text>
              <Text style={[styles.dayDate, selectedDay === idx && { color: Colors.black }]}>{day.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Slots */}
        <Text style={styles.sectionLabel}>
          {filteredSlots.length} SLOTS AVAILABLE
        </Text>

        {filteredSlots.length === 0 ? (
          <GlassCard style={{ alignItems: 'center', padding: 40, gap: 8 }}>
            <Calendar size={40} color={Colors.textMuted} />
            <Text style={{ ...Typography.body, color: Colors.textSecondary }}>No slots for this day</Text>
          </GlassCard>
        ) : (
          filteredSlots.map((slot) => {
            const startTime = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const booked = slot.bookings?.length || 0;
            const capacity = slot.capacity;
            const isFull = booked >= capacity;
            const fillRatio = booked / capacity;
            const crowdLabel = fillRatio < 0.3 ? '🟢 Quiet' : fillRatio < 0.7 ? '🟡 Moderate' : '🔴 Busy';

            return (
              <GlassCard
                key={slot.id}
                variant={isFull ? 'default' : 'cyan'}
                style={isFull ? [styles.slotCard, { opacity: 0.5 }] : styles.slotCard}
              >
                <View style={styles.slotRow}>
                  <View style={styles.slotTime}>
                    <Clock size={16} color={isFull ? Colors.textMuted : Colors.accentPrimary} />
                    <Text style={[styles.timeText, isFull && { color: Colors.textMuted }]}>{startTime}</Text>
                    <Text style={styles.timeEnd}>– {endTime}</Text>
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <View style={styles.crowdRow}>
                      <Users size={12} color={Colors.textSecondary} />
                      <Text style={styles.crowdText}>{booked}/{capacity} booked · {crowdLabel}</Text>
                    </View>
                    <View style={styles.capacityBar}>
                      <View style={[styles.capacityFill, { width: `${fillRatio * 100}%`, backgroundColor: fillRatio < 0.3 ? Colors.accentGreen : fillRatio < 0.7 ? Colors.accentGold : Colors.danger }]} />
                    </View>
                  </View>
                  {isFull ? (
                    <View style={styles.fullBadge}>
                      <Text style={styles.fullText}>FULL</Text>
                    </View>
                  ) : (
                    <GlowButton
                      title="Book"
                      variant="cyan"
                      size="sm"
                      loading={booking === slot.id}
                      onPress={() => handleBook(slot.id, startTime)}
                    />
                  )}
                </View>
              </GlassCard>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.black },
  container: { flex: 1, paddingHorizontal: Spacing.md, paddingTop: 60 },
  header: { marginBottom: Spacing.lg },
  title: { ...Typography.h1, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: 4 },
  aiCard: { marginBottom: Spacing.lg, padding: Spacing.md },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  aiLabel: { ...Typography.label, color: Colors.accentSecondary },
  aiText: { ...Typography.body, color: Colors.textPrimary, lineHeight: 22 },
  dayScroll: { marginBottom: Spacing.md },
  dayTab: { width: 56, height: 72, borderRadius: 16, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.cardBg, justifyContent: 'center', alignItems: 'center', marginRight: 8, gap: 4 },
  dayTabActive: { backgroundColor: Colors.accentPrimary, borderColor: Colors.accentPrimary },
  dayLabel: { ...Typography.label, color: Colors.textSecondary },
  dayDate: { ...Typography.h3, color: Colors.textPrimary },
  sectionLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: Spacing.sm },
  slotCard: { marginBottom: 10, padding: Spacing.md },
  slotRow: { flexDirection: 'row', alignItems: 'center' },
  slotTime: { flexDirection: 'column', gap: 2, alignItems: 'center', width: 60 },
  timeText: { ...Typography.h3, color: Colors.accentPrimary },
  timeEnd: { ...Typography.caption, color: Colors.textSecondary },
  crowdRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  crowdText: { ...Typography.caption, color: Colors.textSecondary },
  capacityBar: { height: 4, backgroundColor: Colors.borderSubtle, borderRadius: 2, overflow: 'hidden' },
  capacityFill: { height: '100%', borderRadius: 2 },
  fullBadge: { backgroundColor: 'rgba(255,77,109,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: Colors.danger },
  fullText: { ...Typography.label, color: Colors.danger },
});
