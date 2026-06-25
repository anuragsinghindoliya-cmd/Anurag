import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePlanner } from '@/context/PlannerContext';
import { useColors } from '@/hooks/useColors';
import type { SubjectKey } from '@/data/plannerData';

function formatDate(d: Date) { return d.toISOString().split('T')[0]; }

const SUBJECT_COLORS: Record<SubjectKey, string> = {
  physics: '#00d4ff',
  chemistry: '#00e5a0',
  math: '#6c63ff',
  english: '#ffb347',
  hindi: '#ff6b9d',
};

export default function TimetableScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { schedule, getTask, updateTask } = usePlanner();

  const todayStr = formatDate(new Date());

  const currentWeek = useMemo(() => {
    const day = schedule.find(d => d.date === todayStr);
    return day?.week ?? 1;
  }, [schedule, todayStr]);

  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weekDays = useMemo(() => schedule.filter(d => d.week === selectedWeek), [schedule, selectedWeek]);

  const topPadding = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 + 84 : 60 + insets.bottom;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPadding + 12,
      paddingHorizontal: 18,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    headerTitle: { fontSize: 22, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold' },
    weekNav: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
    weekBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
    weekLabel: { flex: 1, textAlign: 'center' as const, fontSize: 14, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
    scroll: { flex: 1 },
    content: { padding: 14, paddingBottom: bottomPadding + 14 },
    dayCard: { backgroundColor: colors.card, borderRadius: colors.radius, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    dayCardToday: { borderColor: colors.primary, borderWidth: 1.5 },
    dayHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    dayLabel: { flex: 1, fontSize: 14, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
    dayDate: { fontSize: 12, color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
    todayBadge: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
    todayBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
    typeBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
    typeBadgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
    sundayRow: { paddingHorizontal: 16, paddingVertical: 14 },
    sundayText: { fontSize: 13, color: colors.mutedForeground, fontFamily: 'Inter_400Regular' },
    blockRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    blockLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
    blockAccent: { width: 3, height: 40, borderRadius: 2 },
    blockInfo: { flex: 1 },
    blockSubject: { fontSize: 13, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
    blockTime: { fontSize: 11, color: colors.mutedForeground, marginTop: 2, fontFamily: 'Inter_400Regular' },
    blockLec: { fontSize: 11, color: colors.mutedForeground, marginTop: 1, fontFamily: 'Inter_400Regular' },
    statusBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  });

  const toggleStatus = (blockId: string, date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const task = getTask(blockId, date);
    const next = task.status === 'done' ? 'pending' : task.status === 'pending' ? 'not-done' : 'done';
    updateTask(blockId, date, { status: next });
  };

  const statusColor = (status: string) => {
    if (status === 'done') return '#00e5a0';
    if (status === 'not-done') return '#ef4444';
    return colors.border;
  };
  const statusIcon = (status: string): 'check' | 'x' | 'circle' => {
    if (status === 'done') return 'check';
    if (status === 'not-done') return 'x';
    return 'circle';
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Schedule</Text>
        <View style={s.weekNav}>
          <TouchableOpacity style={s.weekBtn} onPress={() => setSelectedWeek(w => Math.max(1, w - 1))} disabled={selectedWeek === 1}>
            <Feather name="chevron-left" size={18} color={selectedWeek === 1 ? colors.mutedForeground : colors.foreground} />
          </TouchableOpacity>
          <Text style={s.weekLabel}>Week {selectedWeek} · Phase {selectedWeek <= 3 ? 1 : 2}</Text>
          <TouchableOpacity style={s.weekBtn} onPress={() => setSelectedWeek(w => Math.min(24, w + 1))} disabled={selectedWeek === 24}>
            <Feather name="chevron-right" size={18} color={selectedWeek === 24 ? colors.mutedForeground : colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {weekDays.map(day => {
          const isToday = day.date === todayStr;
          const isSunday = day.dayType === 'SUNDAY';
          return (
            <View key={day.date} style={[s.dayCard, isToday && s.dayCardToday]}>
              <View style={s.dayHeader}>
                {isToday && <View style={s.todayBadge}><Text style={s.todayBadgeText}>TODAY</Text></View>}
                <Text style={s.dayLabel}>{day.dayOfWeek}</Text>
                <Text style={s.dayDate}>{new Date(day.date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
                {!isSunday && (
                  <View style={[s.typeBadge, { backgroundColor: colors.secondary, marginLeft: 8 }]}>
                    <Text style={[s.typeBadgeText, { color: colors.mutedForeground }]}>
                      {day.dayType}{day.isHybridDay ? ' Hybrid' : ''}
                    </Text>
                  </View>
                )}
              </View>

              {isSunday ? (
                <View style={s.sundayRow}>
                  <Text style={s.sundayText}>Rest day</Text>
                </View>
              ) : (
                day.blocks.map((block, bi) => {
                  const task = getTask(block.id, day.date);
                  const col = SUBJECT_COLORS[block.subject];
                  return (
                    <View key={block.id} style={[s.blockRow, bi === day.blocks.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={s.blockLeft}>
                        <View style={[s.blockAccent, { backgroundColor: col }]} />
                        <View style={s.blockInfo}>
                          <Text style={s.blockSubject}>{block.label}</Text>
                          <Text style={s.blockTime}>{block.timeSlot}</Text>
                          <Text style={s.blockLec}>{block.lecturesPlanned} lec · {block.blockType}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[s.statusBtn, { backgroundColor: task.status === 'done' ? 'rgba(0,229,160,0.15)' : task.status === 'not-done' ? 'rgba(239,68,68,0.15)' : colors.secondary }]}
                        onPress={() => toggleStatus(block.id, day.date)}
                      >
                        <Feather name={statusIcon(task.status)} size={14} color={statusColor(task.status)} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
