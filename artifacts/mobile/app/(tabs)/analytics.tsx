import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card3D, Divider3D, Well3D } from '@/components/ui/Card3D';
import { MetricWidget, Badge } from '@/components/ui/MetricWidget';
import { ProgressBar3D } from '@/components/ui/ProgressBar3D';
import { usePlanner } from '@/context/PlannerContext';
import { SUBJECTS, MONTHLY_TARGETS } from '@/data/plannerData';
import {
  COLORS, GRADIENTS, RADIUS, SHADOWS, BOX_SHADOW,
  TYPE, SUBJECT_THEME, isWeb,
} from '@/constants/theme';
import type { SubjectColorKey } from '@/constants/theme';

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { state, getSubjectProgress, getOverallProgress } = usePlanner();

  const overall = getOverallProgress();
  const topPad  = isWeb ? Math.max(insets.top, 67) : insets.top;
  const botPad  = isWeb ? 34 + 84 : 60 + insets.bottom;

  const totalTests = Object.values(state.chapters).reduce((s, c) => s + c.testsDone.length, 0);
  const longestSubject = SUBJECTS.reduce((best, s) => {
    const p = getSubjectProgress(s.key);
    return p.pct > getSubjectProgress(best.key).pct ? s : best;
  }, SUBJECTS[0]);

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
        <Text style={[TYPE.h2, { color: COLORS.textPrimary }]}>Progress</Text>
        <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 2 }]}>
          Class 12 PCM Academic Command Center
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 14, paddingBottom: botPad + 14 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Overall Hero ── */}
        <Card3D variant="elevated" glowColor={COLORS.mathGlow} padding={20} style={{ marginBottom: 14 }}>
          <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 14 }]}>Overall Completion</Text>

          {/* Big percentage */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <Text style={[TYPE.display, { fontSize: 56, color: COLORS.math, lineHeight: 62 }]}>
              {overall.pct}
            </Text>
            <Text style={[TYPE.h1, { color: COLORS.math + 'aa' }]}>%</Text>
          </View>
          <Text style={[TYPE.body, { color: COLORS.textMuted, marginBottom: 16 }]}>
            {overall.done} of {overall.total} lectures complete
          </Text>

          <ProgressBar3D value={overall.pct} color={COLORS.math} glowColor={COLORS.mathGlow} height={12} />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <MetricWidget value={overall.doneCh}                   label="Chapters Done"  color={COLORS.success}        glowColor={COLORS.successGlow} size="sm" />
            <MetricWidget value={overall.totalCh - overall.doneCh} label="Remaining"      color={COLORS.textSecondary}  size="sm" />
            <MetricWidget value={totalTests}                        label="Tests Logged"   color={COLORS.warning}        glowColor={COLORS.warningGlow} size="sm" />
          </View>
        </Card3D>

        {/* ── Per-Subject Breakdown ── */}
        <Card3D variant="default" padding={20} style={{ marginBottom: 14 }}>
          <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 16 }]}>By Subject</Text>

          {SUBJECTS.map((subj, i) => {
            const prog = getSubjectProgress(subj.key);
            const t    = SUBJECT_THEME[subj.key as SubjectColorKey];
            return (
              <View key={subj.key}>
                <View style={{ marginBottom: 14 }}>
                  {/* Subject header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <LinearGradient
                      colors={[t.color, t.dim]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{ width: 3, height: 36, borderRadius: 2, marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={[TYPE.bodyMed, { color: COLORS.textPrimary }]}>{subj.label}</Text>
                        <Text style={[TYPE.h3, { color: t.color }]}>{prog.pct}%</Text>
                      </View>
                      <ProgressBar3D value={prog.pct} color={t.color} glowColor={t.glow} height={8} />
                    </View>
                  </View>

                  {/* Stats row */}
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Well3D style={{ flex: 1, padding: 10 }}>
                      <Text style={[TYPE.smBold, { color: t.color, textAlign: 'center' }]}>{prog.doneLectures}</Text>
                      <Text style={[TYPE.xs, { color: COLORS.textMuted, textAlign: 'center', marginTop: 2 }]}>of {prog.totalLectures} lec</Text>
                    </Well3D>
                    <Well3D style={{ flex: 1, padding: 10 }}>
                      <Text style={[TYPE.smBold, { color: t.color, textAlign: 'center' }]}>{prog.doneChapters}</Text>
                      <Text style={[TYPE.xs, { color: COLORS.textMuted, textAlign: 'center', marginTop: 2 }]}>of {prog.totalChapters} ch</Text>
                    </Well3D>
                    <Well3D style={{ flex: 1, padding: 10 }}>
                      <Text style={[TYPE.smBold, { color: prog.pct === 100 ? COLORS.success : t.color, textAlign: 'center' }]}>
                        {prog.pct === 100 ? '✓' : `${prog.totalChapters - prog.doneChapters}`}
                      </Text>
                      <Text style={[TYPE.xs, { color: COLORS.textMuted, textAlign: 'center', marginTop: 2 }]}>
                        {prog.pct === 100 ? 'done' : 'left'}
                      </Text>
                    </Well3D>
                  </View>
                </View>
                {i < SUBJECTS.length - 1 && <Divider3D style={{ marginBottom: 14 }} />}
              </View>
            );
          })}
        </Card3D>

        {/* ── Monthly Pacing Guide ── */}
        <Card3D variant="default" padding={20}>
          <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 16 }]}>Pacing Guide</Text>
          {MONTHLY_TARGETS.map((target, i) => {
            const phaseColor = target.phase === 'FINAL' ? COLORS.success : target.phase === '1' ? COLORS.warning : COLORS.math;
            return (
              <View key={target.month}>
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                    {/* Phase accent */}
                    <LinearGradient
                      colors={[phaseColor + 'aa', phaseColor + '22']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{ width: 3, borderRadius: 2, marginTop: 2, alignSelf: 'stretch', minHeight: 40 }}
                    />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={[TYPE.bodyMed, { color: COLORS.textPrimary }]}>{target.month}</Text>
                        <Badge label={`Phase ${target.phase}`} color={phaseColor} />
                      </View>
                      <Text style={[TYPE.sm, { color: COLORS.textMuted, marginBottom: 8, lineHeight: 18 }]}>
                        {target.note}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                        {target.physicsChapters   > 0 && <Badge label={`Phy +${target.physicsChapters}`}   color={COLORS.physics} />}
                        {target.chemistryChapters  > 0 && <Badge label={`Chem +${target.chemistryChapters}`}  color={COLORS.chemistry} />}
                        {target.mathChapters        > 0 && <Badge label={`Math +${target.mathChapters}`}       color={COLORS.math} />}
                      </View>
                    </View>
                  </View>
                </View>
                {i < MONTHLY_TARGETS.length - 1 && <Divider3D style={{ marginBottom: 14 }} />}
              </View>
            );
          })}
        </Card3D>
      </ScrollView>
    </View>
  );
}
