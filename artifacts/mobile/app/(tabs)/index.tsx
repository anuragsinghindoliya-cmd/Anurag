import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { usePlanner } from '@/context/PlannerContext';
import { SUBJECTS } from '@/data/plannerData';
import { useColors } from '@/hooks/useColors';

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, schedule, getSubjectProgress, getOverallProgress } = usePlanner();

  const overall = getOverallProgress();

  const todayStr = formatDate(new Date());
  const todaySchedule = useMemo(() => schedule.find(d => d.date === todayStr), [schedule, todayStr]);

  const subjectColors: Record<string, string> = {
    physics: colors.physics ?? '#00d4ff',
    chemistry: colors.chemistry ?? '#00e5a0',
    math: colors.math ?? '#6c63ff',
    english: colors.english ?? '#ffb347',
    hindi: colors.hindi ?? '#ff6b9d',
  };

  const topPadding = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 + 84 : 60 + insets.bottom;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: { paddingTop: topPadding + 16, paddingHorizontal: 18, paddingBottom: bottomPadding + 16 },
    header: { marginBottom: 24 },
    greeting: { fontSize: 13, color: colors.mutedForeground, marginBottom: 2, fontFamily: 'Inter_400Regular' },
    title: { fontSize: 26, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold' },
    streakBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: 'rgba(255,180,0,0.12)',
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
      alignSelf: 'flex-start', marginTop: 8,
    },
    streakText: { fontSize: 13, fontWeight: '700' as const, color: '#FFB400', fontFamily: 'Inter_700Bold' },
    card: { backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
    cardTitle: { fontSize: 12, fontWeight: '600' as const, color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14, fontFamily: 'Inter_600SemiBold' },
    progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressText: { fontSize: 14, color: colors.foreground, fontFamily: 'Inter_500Medium' },
    progressPct: { fontSize: 14, fontWeight: '700' as const, color: colors.primary, fontFamily: 'Inter_700Bold' },
    progressTrack: { height: 8, backgroundColor: colors.secondary, borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: 8, borderRadius: 4 },
    statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
    statBox: { flex: 1, backgroundColor: colors.secondary, borderRadius: 10, padding: 12, alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold' },
    statLbl: { fontSize: 11, color: colors.mutedForeground, marginTop: 2, fontFamily: 'Inter_400Regular' },
    subjectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    subjectDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
    subjectName: { flex: 1, fontSize: 13, color: colors.foreground, fontFamily: 'Inter_500Medium' },
    subjectPct: { fontSize: 13, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
    subjectTrack: { height: 4, backgroundColor: colors.secondary, borderRadius: 2, overflow: 'hidden', marginTop: 4, marginBottom: 2 },
    todayCard: { padding: 0, overflow: 'hidden' },
    todayHeader: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    todayDate: { fontSize: 11, color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
    todayTitle: { fontSize: 14, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
    blockRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
    blockAccent: { width: 3, borderRadius: 2, height: 44, marginTop: 2 },
    blockInfo: { flex: 1 },
    blockSubject: { fontSize: 14, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
    blockTime: { fontSize: 12, color: colors.mutedForeground, marginTop: 2, fontFamily: 'Inter_400Regular' },
    blockBadge: { fontSize: 11, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' as const },
    sundayText: { fontSize: 14, color: colors.mutedForeground, padding: 18, textAlign: 'center' as const, fontFamily: 'Inter_400Regular' },
    dayTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.secondary, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 2 },
    dayTypeText: { fontSize: 10, color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold' },
  });

  const now = new Date();
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  return (
    <View style={s.container}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.greeting}>Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}</Text>
          <Text style={s.title}>Anurag's Planner</Text>
          {state.streak > 0 && (
            <View style={s.streakBadge}>
              <Feather name="zap" size={13} color="#FFB400" />
              <Text style={s.streakText}>{state.streak} day streak</Text>
            </View>
          )}
        </View>

        {/* Overall Progress */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Overall Progress</Text>
          <View style={s.progressLabel}>
            <Text style={s.progressText}>{overall.done}/{overall.total} lectures</Text>
            <Text style={s.progressPct}>{overall.pct}%</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${overall.pct}%`, backgroundColor: colors.primary }]} />
          </View>
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statVal}>{overall.doneCh}</Text>
              <Text style={s.statLbl}>Chapters Done</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statVal}>{overall.totalCh - overall.doneCh}</Text>
              <Text style={s.statLbl}>Remaining</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statVal}>{overall.pct}%</Text>
              <Text style={s.statLbl}>Complete</Text>
            </View>
          </View>
        </View>

        {/* Subject Progress */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Subject Breakdown</Text>
          {SUBJECTS.map((subj, i) => {
            const prog = getSubjectProgress(subj.key);
            const col = subjectColors[subj.key];
            return (
              <View key={subj.key}>
                <View style={s.subjectRow}>
                  <View style={[s.subjectDot, { backgroundColor: col }]} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                      <Text style={s.subjectName}>{subj.label}</Text>
                      <Text style={[s.subjectPct, { color: col }]}>{prog.pct}%</Text>
                    </View>
                    <View style={s.subjectTrack}>
                      <View style={[s.progressFill, { width: `${prog.pct}%`, backgroundColor: col }]} />
                    </View>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 3, fontFamily: 'Inter_400Regular' }}>
                      {prog.doneLectures}/{prog.totalLectures} lec · {prog.doneChapters}/{prog.totalChapters} ch
                    </Text>
                  </View>
                </View>
                {i < SUBJECTS.length - 1 && <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 12 }} />}
              </View>
            );
          })}
        </View>

        {/* Today's Schedule */}
        <View style={[s.card, s.todayCard]}>
          <View style={s.todayHeader}>
            <Text style={s.todayDate}>{dayNames[now.getDay()]}, {now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={s.todayTitle}>Today's Schedule</Text>
              {todaySchedule && todaySchedule.dayType !== 'SUNDAY' && (
                <View style={s.dayTypeBadge}>
                  <Text style={s.dayTypeText}>
                    Day {todaySchedule.dayType}
                    {todaySchedule.isHybridDay ? ' · Hybrid' : ''}
                    {' · Phase '}{todaySchedule.phase}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {!todaySchedule ? (
            <Text style={s.sundayText}>Outside the plan dates</Text>
          ) : todaySchedule.dayType === 'SUNDAY' ? (
            <Text style={s.sundayText}>Rest day — recharge for the week</Text>
          ) : (
            todaySchedule.blocks.map(block => (
              <View key={block.id} style={s.blockRow}>
                <View style={[s.blockAccent, { backgroundColor: subjectColors[block.subject] }]} />
                <View style={s.blockInfo}>
                  <Text style={s.blockSubject}>{block.label}</Text>
                  <Text style={s.blockTime}>{block.timeSlot}</Text>
                  <Text style={[s.blockTime, { marginTop: 3 }]}>{block.lecturesPlanned} lecture{block.lecturesPlanned > 1 ? 's' : ''} planned</Text>
                </View>
                <View style={[s.blockBadge, {
                  backgroundColor: block.blockType === 'revision' ? 'rgba(255,180,0,0.15)' : block.blockType === 'language' ? 'rgba(255,107,157,0.15)' : `${subjectColors[block.subject]}18`,
                }]}>
                  <Text style={[s.blockBadge, {
                    color: block.blockType === 'revision' ? '#FFB400' : block.blockType === 'language' ? '#ff6b9d' : subjectColors[block.subject],
                    fontFamily: 'Inter_600SemiBold',
                  }]}>
                    {block.blockType === 'revision' ? 'Revision' : block.blockType === 'language' ? 'Language' : 'Study'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
