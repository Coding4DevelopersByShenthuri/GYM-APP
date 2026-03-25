import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '../../components/GlassCard';
import { Colors, Typography, Spacing } from '../../theme';
import apiClient, { getStoredUser } from '../../services/authService';
import { Flame, TrendingUp, Target, ArrowRight, Moon, Sun, Sunset } from 'lucide-react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - Spacing.md * 2 - Spacing.sm) / 2;

const AI_INSIGHTS = [
  "Recovery at 94% — optimal conditions for heavy lifting.",
  "Protein goal achieved 3 days straight. Maintain momentum.",
  "Gym occupancy 40% lower at 6 AM. Ideal for your session.",
  "At current pace, you'll hit your weight target in 14 days.",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', Icon: Sun };
  if (h < 17) return { text: 'Good afternoon', Icon: Sunset };
  return { text: 'Good evening', Icon: Moon };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ burned: 0, sessions: 0, streak: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [insightIdx, setInsightIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { text: greetText, Icon: GreetIcon } = getGreeting();

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    const iv = setInterval(() => setInsightIdx((i) => (i + 1) % AI_INSIGHTS.length), 5000);
    fetchData();
    return () => clearInterval(iv);
  }, []);

  const fetchData = async () => {
    try {
      const userData = await getStoredUser();
      setUser(userData);
      const resp = await apiClient.get('/progress');
      const records = resp.data;
      if (records.length > 0) {
        const burned = records.reduce((acc: number, r: any) => acc + (r.caloriesBurned || 0), 0);
        setStats({ burned, sessions: records.length, streak: Math.min(records.length, 7) });
      }
    } catch (_) {}
    finally { setRefreshing(false); }
  };

  const onRefresh = () => { setRefreshing(true); fetchData(); };
  const firstName = user?.name?.split(' ')[0] || 'Athlete';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentPrimary}
            progressViewOffset={insets.top + 20}
          />
        }
      >
        {/* Safe area top padding */}
        <View style={{ height: insets.top + 16 }} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.greetRow}>
              <GreetIcon size={14} color={Colors.textSecondary} />
              <Text style={styles.greetLabel}>{greetText}</Text>
            </View>
            <Text style={styles.name}>{firstName}</Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{firstName[0]?.toUpperCase()}</Text>
          </View>
        </View>

        {/* AI Insight Banner */}
        <View style={styles.insightBanner}>
          <View style={styles.insightDot} />
          <Text style={styles.insightText} numberOfLines={2}>
            {AI_INSIGHTS[insightIdx]}
          </Text>
          <ArrowRight size={14} color={Colors.accentPrimary} />
        </View>

        {/* Stat Cards — Bento 2 col */}
        <View style={styles.statsGrid}>
          {/* Left large card */}
          <View style={[styles.statCardLarge, { backgroundColor: Colors.accentPrimary }]}>
            <Flame size={20} color="rgba(0,0,0,0.5)" style={{ marginBottom: 8 }} />
            <Text style={styles.statLargeValue}>
              {stats.burned > 0 ? stats.burned.toLocaleString() : '—'}
            </Text>
            <Text style={styles.statLargeLabel}>kcal burned</Text>
          </View>

          {/* Right column */}
          <View style={styles.statColRight}>
            <View style={[styles.statCardSmall, styles.statCardDark]}>
              <Target size={16} color={Colors.accentSecondary} />
              <Text style={styles.statSmallValue}>{stats.sessions}</Text>
              <Text style={styles.statSmallLabel}>Sessions</Text>
            </View>
            <View style={[styles.statCardSmall, styles.statCardDark]}>
              <TrendingUp size={16} color={Colors.accentGreen} />
              <Text style={styles.statSmallValue}>{stats.streak}</Text>
              <Text style={styles.statSmallLabel}>Day streak</Text>
            </View>
          </View>
        </View>

        {/* Weekly Activity */}
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <GlassCard style={styles.weekCard}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
            const today = new Date().getDay(); // 0=Sun
            // Map Monday=0 to Sunday=6 for display
            const dayIdx = (i + 1) % 7; // Mon=1..Sun=0
            const isToday = dayIdx === today;
            const pct = isToday ? 70 : i < (today === 0 ? 6 : today - 1) ? Math.round(30 + Math.random() * 60) : 0;
            return (
              <View key={`${d}-${i}`} style={styles.dayCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${pct}%`,
                        backgroundColor: isToday ? Colors.accentPrimary : pct > 0 ? Colors.accentSecondary : Colors.borderSubtle,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, isToday && { color: Colors.accentPrimary }]}>{d}</Text>
              </View>
            );
          })}
        </GlassCard>

        {/* Goal Progress */}
        <Text style={styles.sectionTitle}>Monthly Goal</Text>
        <GlassCard style={styles.goalCard}>
          <View style={styles.goalRow}>
            <Text style={styles.goalTitle}>Workouts Completed</Text>
            <Text style={styles.goalValue}>{stats.sessions}/20</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((stats.sessions / 20) * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.goalSub}>{Math.max(0, 20 - stats.sessions)} sessions remaining this month</Text>
        </GlassCard>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  greetLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,229,255,0.15)',
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accentPrimary,
  },

  // AI Insight
  insightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,229,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentPrimary,
    flexShrink: 0,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: 28,
    height: 190,
  },
  statCardLarge: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    justifyContent: 'flex-end',
  },
  statLargeValue: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -1,
  },
  statLargeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.55)',
    marginTop: 2,
  },
  statColRight: {
    width: CARD_W,
    gap: Spacing.sm,
  },
  statCardSmall: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
  },
  statCardDark: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  statSmallValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  statSmallLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Section titles
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
    letterSpacing: 0.1,
  },

  // Weekly Activity
  weekCard: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 24,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 6,
    height: 72,
    backgroundColor: Colors.borderSubtle,
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 3,
  },
  dayLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // Goal Card
  goalCard: {
    padding: 18,
    marginBottom: 20,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentPrimary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.borderSubtle,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentPrimary,
    borderRadius: 3,
  },
  goalSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
