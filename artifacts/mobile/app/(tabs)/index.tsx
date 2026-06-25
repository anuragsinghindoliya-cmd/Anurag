import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Card3D, Divider3D, Well3D } from '@/components/ui/Card3D';
import { MetricWidget, Badge } from '@/components/ui/MetricWidget';
import { ProgressBar3D } from '@/components/ui/ProgressBar3D';
import { usePlanner } from '@/context/PlannerContext';
import { SUBJECTS } from '@/data/plannerData';
import { COLORS, GRADIENTS, RADIUS, SHADOWS, BOX_SHADOW, SPACING, TYPE, SUBJECT_THEME, isWeb } from '@/constants/theme';
import type { SubjectColorKey } from '@/constants/theme';

function formatDate(d: Date) { return d.toISOString().split('T')[0]; }

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { state, schedule, getSubjectProgress, getOverallProgress } = usePlanner();
  const overall = getOverallProgress();

  const todayStr = formatDate(new Date());
  const todaySchedule = useMemo(() => schedule.find(d => d.date === todayStr), [schedule, todayStr]);

  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top;
  const botPad = isWeb ? 34 + 84 : 60 + insets.bottom;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const headerShadow = isWeb ? { boxShadow: BOX_SHADOW.card } as object : SHADOWS.card;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.void }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPad + 16, paddingHorizontal: 16, paddingBottom: botPad + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page Header ── */}
        <View style={{ marginBottom: 22 }}>
          <Text style={[TYPE.sm, { color: COLORS.textMuted, marginBottom: 3 }]}>{greeting}</Text>
          <Text style={[TYPE.h1, { color: COLORS.textPrimary }]}>Command Center</Text>
          {state.streak > 0 && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10,
              alignSelf: 'flex-start',
              backgroundColor: COLORS.warningGlow,
              borderRadius: RADIUS.pill,
              paddingHorizontal: 12, paddingVertical: 5,
              borderWidth: 1, borderColor: COLORS.warning + '50',
            }}>
              <Feather name="zap" size={12} color={COLORS.warning} />
              <Text style={[TYPE.smBold, { color: COLORS.warning }]}>{state.streak} day streak</Text>
            </View>
          )}
        </View>

        {/* ── Overall Progress Hero ── */}
        <Card3D variant="elevated" glowColor={COLORS.mathGlow} style={{ marginBottom: 14 }} padding={20}>
          <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 14 }]}>Overall Progress</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 16 }}>
            <Text style={[TYPE.display, { color: COLORS.math, lineHeight: 38 }]}>{overall.pct}%</Text>
            <Text style={[TYPE.sm, { color: COLORS.textMuted, marginBottom: 4 }]}>
              {overall.done}/{overall.total} lectures
            </Text>
          </View>
          <ProgressBar3D value={overall.pct} color={COLORS.math} height={10} />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <MetricWidget value={overall.doneCh} label="Done" color={COLORS.success} size="sm" />
            <MetricWidget value={overall.totalCh - overall.doneCh} label="Remaining" color={COLORS.textSecondary} size="sm" />
            <MetricWidget value={`${overall.pct}%`} label="Complete" color={COLORS.math} glowColor={COLORS.mathGlow} size="sm" />
          </View>
        </Card3D>

        {/* ── Subject Breakdown ── */}
        <Card3D variant="default" style={{ marginBottom: 14 }} padding={20}>
          <Text style={[TYPE.label, { color: COLORS.textMuted, marginBottom: 16 }]}>Subject Breakdown</Text>
          {SUBJECTS.map((subj, i) => {
            const prog = getSubjectProgress(subj.key);
            const t = SUBJECT_THEME[subj.key as SubjectColorKey];
            return (
              <View key={subj.key}>
                <View style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{
                        width: 6, height: 6, borderRadius: 3, backgroundColor: t.color,
                        ...(isWeb ? { boxShadow: `0 0 8px ${t.glow}` } : {}) as object,
                      }} />
                      <Text style={[TYPE.bodyMed, { color: COLORS.textPrimary }]}>{subj.label}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[TYPE.sm, { color: COLORS.textMuted }]}>
                        {prog.doneChapters}/{prog.totalChapters} ch
                      </Text>
                      <Text style={[TYPE.smBold, { color: t.color }]}>{prog.pct}%</Text>
                    </View>
                  </View>
                  <ProgressBar3D value={prog.pct} color={t.color} glowColor={t.glow} height={7} />
                  <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 5 }]}>
                    {prog.doneLectures} / {prog.totalLectures} lectures
                  </Text>
                </View>
                {i < SUBJECTS.length - 1 && <Divider3D style={{ marginBottom: 14 }} />}
              </View>
            );
          })}
        </Card3D>

        {/* ── Today's Schedule ── */}
        <Card3D variant="default" padding={0} style={{ overflow: 'hidden' }}>
          <LinearGradient
            colors={GRADIENTS.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle }}
          >
            <Text style={[TYPE.sm, { color: COLORS.textMuted }]}>
              {dayNames[now.getDay()]}, {now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={[TYPE.h3, { color: COLORS.textPrimary }]}>Today's Schedule</Text>
              {todaySchedule && todaySchedule.dayType !== 'SUNDAY' && (
                <Badge
                  label={`Day ${todaySchedule.dayType} · Phase ${todaySchedule.phase}`}
                  color={COLORS.math}
                />
              )}
            </View>
          </LinearGradient>

          {!todaySchedule ? (
            <View style={{ padding: 20 }}>
              <Text style={[TYPE.body, { color: COLORS.textMuted, textAlign: 'center' }]}>Outside plan dates</Text>
            </View>
          ) : todaySchedule.dayType === 'SUNDAY' ? (
            <View style={{ padding: 20, alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 28 }}>☀️</Text>
              <Text style={[TYPE.body, { color: COLORS.textMuted }]}>Rest day — recharge</Text>
            </View>
          ) : (
            todaySchedule.blocks.map((block, bi) => {
              const t = SUBJECT_THEME[block.subject as SubjectColorKey];
              const isLast = bi === todaySchedule.blocks.length - 1;
              return (
                <View key={block.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 14 }}>
                    <LinearGradient
                      colors={[t.color, t.dim]}
                      style={{ width: 3, height: 46, borderRadius: 2 }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[TYPE.bodyMed, { color: COLORS.textPrimary }]}>{block.label}</Text>
                      <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 2 }]}>{block.timeSlot}</Text>
                      <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 1 }]}>
                        {block.lecturesPlanned} lecture{block.lecturesPlanned > 1 ? 's' : ''} planned
                      </Text>
                    </View>
                    <View style={{
                      backgroundColor: t.color + '18',
                      borderRadius: RADIUS.sm,
                      paddingHorizontal: 8, paddingVertical: 4,
                      borderWidth: 1, borderColor: t.color + '35',
                    }}>
                      <Text style={[TYPE.xs, { color: t.color }]}>
                        {block.blockType === 'revision' ? 'REVISION' : block.blockType === 'language' ? 'LANGUAGE' : 'STUDY'}
                      </Text>
                    </View>
                  </View>
                  {!isLast && <Divider3D style={{ marginHorizontal: 20 }} />}
                </View>
              );
            })
          )}
        </Card3D>
      </ScrollView>
    </View>
  );
}
