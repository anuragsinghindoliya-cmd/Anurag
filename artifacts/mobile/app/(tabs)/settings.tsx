import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Card3D, Divider3D, Well3D } from '@/components/ui/Card3D';
import { Button3D } from '@/components/ui/Button3D';
import { MetricWidget } from '@/components/ui/MetricWidget';
import { usePlanner } from '@/context/PlannerContext';
import { PLAN_START_DATE, PHASE1_WEEKS, PHASE2_WEEKS } from '@/data/plannerData';
import {
  COLORS, GRADIENTS, RADIUS, SHADOWS, BOX_SHADOW,
  TYPE, LIGHT, isWeb,
} from '@/constants/theme';

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}>
      {icon && (
        <View style={{
          width: 32, height: 32, borderRadius: RADIUS.sm, backgroundColor: COLORS.math + '18',
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 1, borderColor: COLORS.math + '30',
        }}>
          <Feather name={icon as any} size={14} color={COLORS.math} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[TYPE.sm, { color: COLORS.textMuted }]}>{label}</Text>
        <Text style={[TYPE.bodyMed, { color: COLORS.textPrimary, marginTop: 2 }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { state, resetAll, getOverallProgress } = usePlanner();

  const overall = getOverallProgress();
  const topPad  = isWeb ? Math.max(insets.top, 67) : insets.top;
  const botPad  = isWeb ? 34 + 84 : 60 + insets.bottom;

  const endDate = new Date(PLAN_START_DATE);
  endDate.setDate(endDate.getDate() + (PHASE1_WEEKS + PHASE2_WEEKS) * 7);

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reset ALL progress? This permanently clears all lectures, tasks, and streak data.')) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        resetAll();
      }
    } else {
      Alert.alert(
        'Reset All Progress',
        'This permanently clears all lecture tracking, task statuses, and your streak. This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset Everything', style: 'destructive', onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); resetAll(); } },
        ]
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.void }}>
      {/* ── Header ── */}
      <LinearGradient
        colors={GRADIENTS.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: topPad + 12,
          paddingHorizontal: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.borderSubtle,
          ...(isWeb ? { boxShadow: BOX_SHADOW.sm } : SHADOWS.sm) as object,
        }}
      >
        <Text style={[TYPE.h2, { color: COLORS.textPrimary }]}>Settings</Text>
        <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 2 }]}>
          Anurag's Academic Command Center
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 14, paddingBottom: botPad + 14 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats Panel ── */}
        <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 10 }]}>Your Stats</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          <MetricWidget
            value={state.streak}
            label="Day Streak"
            color={COLORS.warning}
            glowColor={COLORS.warningGlow}
            icon={<Feather name="zap" size={16} color={COLORS.warning} />}
            size="md"
          />
          <MetricWidget
            value={`${overall.pct}%`}
            label="Complete"
            color={COLORS.math}
            glowColor={COLORS.mathGlow}
            size="md"
          />
          <MetricWidget
            value={overall.doneCh}
            label="Chapters"
            color={COLORS.success}
            glowColor={COLORS.successGlow}
            size="md"
          />
        </View>

        {/* ── Plan Info ── */}
        <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 10 }]}>Plan Details</Text>
        <Card3D variant="default" padding={16} style={{ marginBottom: 14 }}>
          <InfoRow
            icon="calendar"
            label="Plan Start"
            value={PLAN_START_DATE.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          />
          <Divider3D />
          <InfoRow
            icon="flag"
            label="Target Completion"
            value={endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          />
          <Divider3D />
          <InfoRow
            icon="layers"
            label="Phase 1"
            value={`${PHASE1_WEEKS} weeks — Rhythm Builder (1 lecture/session)`}
          />
          <Divider3D />
          <InfoRow
            icon="zap"
            label="Phase 2"
            value={`${PHASE2_WEEKS} weeks — Full Sprint (2 lectures/session)`}
          />
          <Divider3D />
          <InfoRow
            icon="refresh-cw"
            label="Day Types"
            value="Day A: Physics + Chemistry · Day B: Math + Language"
          />
        </Card3D>

        {/* ── Syllabus Summary ── */}
        <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 10 }]}>Syllabus</Text>
        <Card3D variant="default" padding={16} style={{ marginBottom: 14 }}>
          <Text style={[TYPE.body, { color: COLORS.textSecondary, lineHeight: 22, marginBottom: 14 }]}>
            A 24-week plan covering the full Class 12 syllabus across 5 subjects with systematic A/B day rotation.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Physics · 15 ch', color: COLORS.physics },
              { label: 'Chemistry · 11 ch', color: COLORS.chemistry },
              { label: 'Math · 14 ch', color: COLORS.math },
              { label: 'English · 4 ch', color: COLORS.english },
              { label: 'Hindi · 4 ch', color: COLORS.hindi },
            ].map(b => (
              <View key={b.label} style={{
                backgroundColor: b.color + '15',
                borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 5,
                borderWidth: 1, borderColor: b.color + '35',
              }}>
                <Text style={[TYPE.smBold, { color: b.color }]}>{b.label}</Text>
              </View>
            ))}
          </View>
        </Card3D>

        {/* ── Danger Zone ── */}
        <Text style={[TYPE.label, { color: COLORS.error + 'aa', marginBottom: 10 }]}>Danger Zone</Text>
        <LinearGradient
          colors={['rgba(255,77,109,0.10)', 'rgba(255,77,109,0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: RADIUS.lg, padding: 1,
            borderWidth: 1, borderColor: COLORS.error + '30',
            ...(isWeb ? { boxShadow: `0 0 20px ${COLORS.errorGlow}` } : {}) as object,
          }}
        >
          <View style={{ borderRadius: RADIUS.lg - 1, padding: 16 }}>
            <Text style={[TYPE.bodyMed, { color: COLORS.error, marginBottom: 6 }]}>Reset All Progress</Text>
            <Text style={[TYPE.sm, { color: COLORS.textMuted, marginBottom: 14, lineHeight: 18 }]}>
              Permanently clears all lecture counts, task statuses, test records, and your streak. This cannot be undone.
            </Text>
            <Button3D
              label="Reset Everything"
              variant="error"
              icon={<Feather name="trash-2" size={15} color="#fff" />}
              onPress={handleReset}
              fullWidth
            />
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}
