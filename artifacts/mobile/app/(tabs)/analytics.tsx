import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlanner } from '@/context/PlannerContext';
import { SUBJECTS, MONTHLY_TARGETS } from '@/data/plannerData';
import { useColors } from '@/hooks/useColors';
import type { SubjectKey } from '@/data/plannerData';

const SUBJECT_COLORS: Record<SubjectKey, string> = {
  physics: '#00d4ff', chemistry: '#00e5a0', math: '#6c63ff', english: '#ffb347', hindi: '#ff6b9d',
};

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, getSubjectProgress, getOverallProgress } = usePlanner();

  const overall = getOverallProgress();
  const topPadding = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 + 84 : 60 + insets.bottom;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPadding + 12, paddingHorizontal: 18, paddingBottom: 14,
      backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold' },
    scroll: { flex: 1 },
    content: { padding: 14, paddingBottom: bottomPadding + 14 },
    card: { backgroundColor: colors.card, borderRadius: colors.radius, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
    cardTitle: { fontSize: 12, fontWeight: '600' as const, color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14, fontFamily: 'Inter_600SemiBold' },
    bigPct: { fontSize: 52, fontWeight: '700' as const, color: colors.primary, fontFamily: 'Inter_700Bold', lineHeight: 58 },
    bigSub: { fontSize: 13, color: colors.mutedForeground, fontFamily: 'Inter_400Regular', marginTop: 2 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
    statBox: { backgroundColor: colors.secondary, borderRadius: 10, padding: 14, flex: 1, minWidth: '44%' },
    statVal: { fontSize: 22, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold' },
    statLbl: { fontSize: 11, color: colors.mutedForeground, marginTop: 2, fontFamily: 'Inter_400Regular' },
    subjectRow: { marginBottom: 18 },
    subjHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    subjName: { fontSize: 14, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
    subjPct: { fontSize: 14, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
    barBg: { height: 10, backgroundColor: colors.secondary, borderRadius: 5, overflow: 'hidden' },
    barFill: { height: 10, borderRadius: 5 },
    subjStats: { flexDirection: 'row', gap: 16, marginTop: 6 },
    subjStat: { fontSize: 11, color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 2 },
    monthRow: { marginBottom: 12 },
    monthName: { fontSize: 13, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
    monthNote: { fontSize: 12, color: colors.mutedForeground, fontFamily: 'Inter_400Regular', marginBottom: 6 },
    monthTargets: { flexDirection: 'row', gap: 8 },
    targetBox: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
    targetText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
    phaseBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.secondary, alignSelf: 'flex-start', marginBottom: 6 },
    phaseText: { fontSize: 10, color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold' },
  });

  const totalTests = Object.values(state.chapters).reduce((s, c) => s + c.testsDone.length, 0);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Progress</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Overall */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Overall Completion</Text>
          <Text style={s.bigPct}>{overall.pct}%</Text>
          <Text style={s.bigSub}>{overall.done} of {overall.total} lectures done</Text>
          <View style={{ height: 12, backgroundColor: colors.secondary, borderRadius: 6, overflow: 'hidden', marginTop: 14 }}>
            <View style={{ height: 12, width: `${overall.pct}%`, borderRadius: 6, backgroundColor: colors.primary }} />
          </View>
          <View style={s.statsGrid}>
            <View style={s.statBox}>
              <Text style={s.statVal}>{overall.doneCh}</Text>
              <Text style={s.statLbl}>Chapters done</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statVal}>{overall.totalCh - overall.doneCh}</Text>
              <Text style={s.statLbl}>Remaining</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statVal, { color: '#FFB400' }]}>{totalTests}</Text>
              <Text style={s.statLbl}>Tests logged</Text>
            </View>
          </View>
        </View>

        {/* Per Subject */}
        <View style={s.card}>
          <Text style={s.cardTitle}>By Subject</Text>
          {SUBJECTS.map((subj, i) => {
            const prog = getSubjectProgress(subj.key);
            const col = SUBJECT_COLORS[subj.key];
            return (
              <View key={subj.key}>
                <View style={s.subjectRow}>
                  <View style={s.subjHeader}>
                    <Text style={s.subjName}>{subj.label}</Text>
                    <Text style={[s.subjPct, { color: col }]}>{prog.pct}%</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${prog.pct}%`, backgroundColor: col }]} />
                  </View>
                  <View style={s.subjStats}>
                    <Text style={s.subjStat}>{prog.doneLectures}/{prog.totalLectures} lectures</Text>
                    <Text style={s.subjStat}>{prog.doneChapters}/{prog.totalChapters} chapters</Text>
                  </View>
                </View>
                {i < SUBJECTS.length - 1 && <View style={s.divider} />}
              </View>
            );
          })}
        </View>

        {/* Monthly Pacing Guide */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Pacing Guide</Text>
          {MONTHLY_TARGETS.map((target, i) => (
            <View key={target.month}>
              <View style={s.monthRow}>
                <View style={s.phaseBadge}><Text style={s.phaseText}>Phase {target.phase}</Text></View>
                <Text style={s.monthName}>{target.month}</Text>
                <Text style={s.monthNote}>{target.note}</Text>
                <View style={s.monthTargets}>
                  {target.physicsChapters > 0 && (
                    <View style={[s.targetBox, { borderColor: '#00d4ff30', backgroundColor: '#00d4ff10' }]}>
                      <Text style={[s.targetText, { color: '#00d4ff' }]}>Phy +{target.physicsChapters}</Text>
                    </View>
                  )}
                  {target.chemistryChapters > 0 && (
                    <View style={[s.targetBox, { borderColor: '#00e5a030', backgroundColor: '#00e5a010' }]}>
                      <Text style={[s.targetText, { color: '#00e5a0' }]}>Chem +{target.chemistryChapters}</Text>
                    </View>
                  )}
                  {target.mathChapters > 0 && (
                    <View style={[s.targetBox, { borderColor: '#6c63ff30', backgroundColor: '#6c63ff10' }]}>
                      <Text style={[s.targetText, { color: '#6c63ff' }]}>Math +{target.mathChapters}</Text>
                    </View>
                  )}
                </View>
              </View>
              {i < MONTHLY_TARGETS.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
