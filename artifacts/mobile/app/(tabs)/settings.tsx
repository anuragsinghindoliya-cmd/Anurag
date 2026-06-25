import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePlanner } from '@/context/PlannerContext';
import { PLAN_START_DATE, PHASE1_WEEKS, PHASE2_WEEKS } from '@/data/plannerData';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, resetAll, getOverallProgress } = usePlanner();

  const overall = getOverallProgress();
  const topPadding = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 + 84 : 60 + insets.bottom;

  const endDate = new Date(PLAN_START_DATE);
  endDate.setDate(endDate.getDate() + (PHASE1_WEEKS + PHASE2_WEEKS) * 7);

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reset all progress? This cannot be undone.')) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        resetAll();
      }
    } else {
      Alert.alert(
        'Reset All Progress',
        'This will permanently delete all lecture tracking, task statuses, and streak data. This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset Everything',
            style: 'destructive',
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              resetAll();
            },
          },
        ]
      );
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPadding + 12, paddingHorizontal: 18, paddingBottom: 14,
      backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold' },
    scroll: { flex: 1 },
    content: { padding: 14, paddingBottom: bottomPadding + 14 },
    card: { backgroundColor: colors.card, borderRadius: colors.radius, marginBottom: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    sectionLabel: { fontSize: 11, fontWeight: '600' as const, color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8, fontFamily: 'Inter_600SemiBold' },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowLast: { borderBottomWidth: 0 },
    rowLeft: { flex: 1 },
    rowLabel: { fontSize: 14, color: colors.foreground, fontFamily: 'Inter_500Medium' },
    rowValue: { fontSize: 13, color: colors.mutedForeground, fontFamily: 'Inter_400Regular', marginTop: 2 },
    rowIcon: { marginLeft: 8 },
    statCard: { padding: 18 },
    statGrid: { flexDirection: 'row', gap: 10, marginTop: 4 },
    statBox: { flex: 1, backgroundColor: colors.secondary, borderRadius: 10, padding: 12 },
    statVal: { fontSize: 20, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold' },
    statLbl: { fontSize: 11, color: colors.mutedForeground, marginTop: 2, fontFamily: 'Inter_400Regular' },
    dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: colors.radius, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', marginTop: 4 },
    dangerText: { fontSize: 14, fontWeight: '600' as const, color: '#ef4444', fontFamily: 'Inter_600SemiBold' },
    aboutText: { fontSize: 13, color: colors.mutedForeground, fontFamily: 'Inter_400Regular', lineHeight: 20 },
    badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 12 },
    badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <Text style={s.sectionLabel}>Stats</Text>
        <View style={s.card}>
          <View style={s.statCard}>
            <View style={s.statGrid}>
              <View style={s.statBox}>
                <Text style={[s.statVal, { color: '#FFB400' }]}>{state.streak}</Text>
                <Text style={s.statLbl}>Day streak</Text>
              </View>
              <View style={s.statBox}>
                <Text style={[s.statVal, { color: colors.primary }]}>{overall.pct}%</Text>
                <Text style={s.statLbl}>Done</Text>
              </View>
              <View style={s.statBox}>
                <Text style={s.statVal}>{overall.doneCh}</Text>
                <Text style={s.statLbl}>Chapters</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Plan Info */}
        <Text style={s.sectionLabel}>Plan Details</Text>
        <View style={s.card}>
          <View style={[s.row]}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>Start Date</Text>
              <Text style={s.rowValue}>{PLAN_START_DATE.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            </View>
          </View>
          <View style={[s.row]}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>Target End Date</Text>
              <Text style={s.rowValue}>{endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            </View>
          </View>
          <View style={[s.row]}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>Phase 1 Duration</Text>
              <Text style={s.rowValue}>{PHASE1_WEEKS} weeks — Rhythm Builder (1 lecture/session)</Text>
            </View>
          </View>
          <View style={[s.row, s.rowLast]}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>Phase 2 Duration</Text>
              <Text style={s.rowValue}>{PHASE2_WEEKS} weeks — Full Sprint (2 lectures/session)</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <Text style={s.sectionLabel}>About</Text>
        <View style={s.card}>
          <View style={{ padding: 18 }}>
            <Text style={s.aboutText}>
              Anurag's Academic Command Center is a 24-week Class 12 PCM study planner covering Physics, Chemistry, Mathematics, English, and Hindi. The schedule alternates between Day A (Physics + Chemistry) and Day B (Math + Language) for systematic coverage.
            </Text>
            <View style={s.badgeRow}>
              {[
                { label: '15 chapters', color: '#00d4ff' },
                { label: '11 chapters', color: '#00e5a0' },
                { label: '14 chapters', color: '#6c63ff' },
                { label: '4 chapters', color: '#ffb347' },
                { label: '4 chapters', color: '#ff6b9d' },
              ].map((b, i) => (
                <View key={i} style={[s.badge, { backgroundColor: `${b.color}15` }]}>
                  <Text style={[s.badgeText, { color: b.color }]}>{b.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <Text style={s.sectionLabel}>Data</Text>
        <TouchableOpacity style={s.dangerBtn} onPress={handleReset}>
          <Feather name="trash-2" size={16} color="#ef4444" />
          <Text style={s.dangerText}>Reset All Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
