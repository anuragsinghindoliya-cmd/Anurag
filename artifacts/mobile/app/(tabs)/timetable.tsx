import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Card3D, Divider3D } from '@/components/ui/Card3D';
import { IconButton3D } from '@/components/ui/Button3D';
import { Badge } from '@/components/ui/MetricWidget';
import { usePlanner } from '@/context/PlannerContext';
import {
  COLORS, GRADIENTS, RADIUS, SHADOWS, BOX_SHADOW, SPACING, TYPE,
  SUBJECT_THEME, isWeb,
} from '@/constants/theme';
import type { SubjectColorKey } from '@/constants/theme';
import type { SubjectKey } from '@/data/plannerData';

function formatDate(d: Date) { return d.toISOString().split('T')[0]; }

const STATUS_CONFIG = {
  pending:    { icon: 'circle'  as const, color: COLORS.textDim,  bg: 'rgba(255,255,255,0.04)' },
  done:       { icon: 'check'   as const, color: COLORS.success,  bg: COLORS.success + '18'    },
  'not-done': { icon: 'x'      as const, color: COLORS.error,    bg: COLORS.error   + '18'    },
  partial:    { icon: 'minus'   as const, color: COLORS.warning,  bg: COLORS.warning + '18'    },
};

const STATUS_CYCLE: Record<string, 'done' | 'not-done' | 'pending'> = {
  pending: 'done', done: 'not-done', 'not-done': 'pending', partial: 'done',
};

const PRIMARY_SUBJECTS: { key: SubjectKey; label: string; color: string }[] = [
  { key: 'physics',   label: 'Physics',   color: COLORS.physics   },
  { key: 'chemistry', label: 'Chemistry', color: COLORS.chemistry },
  { key: 'math',      label: 'Math',      color: COLORS.math      },
];

export default function TimetableScreen() {
  const insets = useSafeAreaInsets();
  const { schedule, getTask, updateTask } = usePlanner();

  const todayStr = formatDate(new Date());
  const currentWeek = useMemo(() => schedule.find(d => d.date === todayStr)?.week ?? 1, [schedule, todayStr]);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const weekDays = useMemo(() => schedule.filter(d => d.week === selectedWeek), [schedule, selectedWeek]);

  const [openSwapKey, setOpenSwapKey] = useState<string | null>(null);

  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top;
  const botPad = isWeb ? 34 + 84 : 60 + insets.bottom;

  const doneCount   = weekDays.reduce((s, d) => s + d.blocks.filter(b => getTask(b.id, d.date).status === 'done').length, 0);
  const totalBlocks = weekDays.reduce((s, d) => s + d.blocks.length, 0);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.void }}>
      {/* ── Fixed Header ── */}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={[TYPE.h2, { color: COLORS.textPrimary }]}>Schedule</Text>
            <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 2 }]}>
              {doneCount}/{totalBlocks} blocks complete this week
            </Text>
          </View>
          <Badge label={`Week ${selectedWeek} · Phase ${selectedWeek <= 3 ? 1 : 2}`} color={COLORS.math} />
        </View>

        {/* Week navigator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <IconButton3D
            icon={<Feather name="chevron-left" size={18} color={selectedWeek === 1 ? COLORS.textDim : COLORS.textPrimary} />}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedWeek(w => Math.max(1, w - 1)); }}
            disabled={selectedWeek === 1}
            size={36}
          />
          <View style={{ flex: 1 }}>
            <LinearGradient
              colors={GRADIENTS.trackBg}
              style={{ height: 4, borderRadius: 2, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={[COLORS.math + 'cc', COLORS.math]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ height: '100%', width: `${totalBlocks > 0 ? (doneCount / totalBlocks) * 100 : 0}%`, borderRadius: 2 }}
              />
            </LinearGradient>
          </View>
          <IconButton3D
            icon={<Feather name="chevron-right" size={18} color={selectedWeek === 24 ? COLORS.textDim : COLORS.textPrimary} />}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedWeek(w => Math.min(24, w + 1)); }}
            disabled={selectedWeek === 24}
            size={36}
          />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 14, paddingBottom: botPad + 14 }}
        showsVerticalScrollIndicator={false}
      >
        {weekDays.map(day => {
          const isToday  = day.date === todayStr;
          const isSunday = day.dayType === 'SUNDAY';
          const glowColor = isToday ? COLORS.mathGlow : undefined;

          return (
            <Card3D
              key={day.date}
              variant={isToday ? 'elevated' : 'default'}
              glowColor={glowColor}
              padding={0}
              style={{ marginBottom: 10, overflow: 'hidden' }}
            >
              {/* Day header */}
              <LinearGradient
                colors={isToday ? [COLORS.math + '22', 'transparent'] : ['transparent', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 16, paddingVertical: 12,
                  borderBottomWidth: isSunday ? 0 : 1, borderBottomColor: COLORS.borderSubtle,
                }}
              >
                {isToday && (
                  <View style={{
                    backgroundColor: COLORS.math, borderRadius: RADIUS.sm,
                    paddingHorizontal: 6, paddingVertical: 2, marginRight: 8,
                  }}>
                    <Text style={[TYPE.xs, { color: '#fff' }]}>TODAY</Text>
                  </View>
                )}
                <Text style={[TYPE.bodyMed, { flex: 1, color: isToday ? COLORS.textPrimary : COLORS.textSecondary }]}>
                  {day.dayOfWeek}
                </Text>
                <Text style={[TYPE.sm, { color: COLORS.textMuted, marginRight: 10 }]}>
                  {new Date(day.date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
                {!isSunday && (
                  <Badge
                    label={`Day ${day.dayType}${day.isHybridDay ? ' · Hybrid' : ''}`}
                    color={day.dayType === 'A' ? COLORS.physics : COLORS.math}
                  />
                )}
              </LinearGradient>

              {isSunday ? (
                <View style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 16 }}>💤</Text>
                  <Text style={[TYPE.body, { color: COLORS.textMuted }]}>Rest day</Text>
                </View>
              ) : (
                day.blocks.map((block, bi) => {
                  const task        = getTask(block.id, day.date);
                  const st          = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
                  const isPrimary   = block.blockType !== 'language';
                  const activeSubj  = (isPrimary && task.subjectOverride) ? task.subjectOverride : block.subject;
                  const t           = SUBJECT_THEME[activeSubj as SubjectColorKey];
                  const swapKey     = `${day.date}-${block.id}`;
                  const swapOpen    = openSwapKey === swapKey;
                  const isOverridden = isPrimary && !!task.subjectOverride && task.subjectOverride !== block.subject;

                  return (
                    <View key={block.id}>
                      {/* ── Block row ── */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
                        <LinearGradient
                          colors={[t.color, t.dim]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={{ width: 3, height: 44, borderRadius: 2 }}
                        />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[TYPE.bodyMed, { color: COLORS.textPrimary }]}>
                              {isPrimary && task.subjectOverride
                                ? (PRIMARY_SUBJECTS.find(s => s.key === task.subjectOverride)?.label ?? block.label)
                                : block.label}
                            </Text>
                            {isOverridden && (
                              <View style={{
                                backgroundColor: COLORS.warning + '22',
                                borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1,
                                borderWidth: 1, borderColor: COLORS.warning + '44',
                              }}>
                                <Text style={[TYPE.xs, { color: COLORS.warning }]}>was {block.label}</Text>
                              </View>
                            )}
                          </View>
                          <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 2 }]}>{block.timeSlot}</Text>
                          <Text style={[TYPE.sm, { color: COLORS.textMuted, marginTop: 1 }]}>
                            {block.lecturesPlanned} lec · {block.blockType}
                          </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          {/* Swap icon — only for primary (non-language) blocks */}
                          {isPrimary && (
                            <TouchableOpacity
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setOpenSwapKey(swapOpen ? null : swapKey);
                              }}
                              style={{
                                width: 32, height: 32, borderRadius: 8,
                                backgroundColor: swapOpen ? COLORS.math + '28' : 'rgba(255,255,255,0.05)',
                                alignItems: 'center', justifyContent: 'center',
                                borderWidth: 1, borderColor: swapOpen ? COLORS.math + '60' : COLORS.borderSubtle,
                              }}
                            >
                              <Feather name="repeat" size={13} color={swapOpen ? COLORS.math : COLORS.textDim} />
                            </TouchableOpacity>
                          )}

                          {/* Status toggle */}
                          <TouchableOpacity
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                              updateTask(block.id, day.date, { status: STATUS_CYCLE[task.status] });
                            }}
                            style={{
                              width: 34, height: 34, borderRadius: 10,
                              backgroundColor: st.bg,
                              alignItems: 'center', justifyContent: 'center',
                              borderWidth: 1, borderColor: st.color + '50',
                              ...(isWeb ? { boxShadow: `0 0 10px ${st.color}40` } : {}) as object,
                            }}
                          >
                            <Feather name={st.icon} size={15} color={st.color} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* ── Subject picker (shown when swap is open) ── */}
                      {swapOpen && (
                        <View style={{
                          marginHorizontal: 16,
                          marginBottom: 12,
                          padding: 10,
                          borderRadius: RADIUS.md,
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          borderWidth: 1,
                          borderColor: COLORS.borderSubtle,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Feather name="repeat" size={12} color={COLORS.textDim} style={{ marginRight: 2 }} />
                          <Text style={[TYPE.xs, { color: COLORS.textDim, marginRight: 4 }]}>Study instead:</Text>
                          {PRIMARY_SUBJECTS.map(s => {
                            const isActive = activeSubj === s.key;
                            return (
                              <TouchableOpacity
                                key={s.key}
                                onPress={() => {
                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                  const newOverride = s.key === block.subject ? undefined : s.key;
                                  updateTask(block.id, day.date, { subjectOverride: newOverride });
                                  setOpenSwapKey(null);
                                }}
                                style={{
                                  flex: 1,
                                  paddingVertical: 7,
                                  borderRadius: RADIUS.sm,
                                  alignItems: 'center',
                                  backgroundColor: isActive ? s.color + '28' : 'rgba(255,255,255,0.06)',
                                  borderWidth: 1,
                                  borderColor: isActive ? s.color + '80' : 'rgba(255,255,255,0.08)',
                                  ...(isWeb && isActive ? { boxShadow: `0 0 8px ${s.color}50` } : {}) as object,
                                }}
                              >
                                <Text style={[TYPE.sm, { color: isActive ? s.color : COLORS.textSecondary, fontWeight: isActive ? '700' : '400' }]}>
                                  {s.label}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

                      {bi < day.blocks.length - 1 && <Divider3D style={{ marginHorizontal: 16 }} />}
                    </View>
                  );
                })
              )}
            </Card3D>
          );
        })}
      </ScrollView>
    </View>
  );
}
