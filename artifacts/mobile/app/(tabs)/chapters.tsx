import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePlanner } from '@/context/PlannerContext';
import { SUBJECTS } from '@/data/plannerData';
import { useColors } from '@/hooks/useColors';
import type { SubjectKey } from '@/data/plannerData';

const SUBJECT_COLORS: Record<SubjectKey, string> = {
  physics: '#00d4ff', chemistry: '#00e5a0', math: '#6c63ff', english: '#ffb347', hindi: '#ff6b9d',
};

export default function ChaptersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateLectures, toggleChapterComplete } = usePlanner();
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('physics');

  const topPadding = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 + 84 : 60 + insets.bottom;

  const subject = SUBJECTS.find(s => s.key === activeSubject)!;
  const subjectColor = SUBJECT_COLORS[activeSubject];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPadding + 12, paddingHorizontal: 18, paddingBottom: 0,
      backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '700' as const, color: colors.foreground, fontFamily: 'Inter_700Bold', marginBottom: 14 },
    tabRow: { flexDirection: 'row', gap: 4 },
    tab: { paddingHorizontal: 12, paddingVertical: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    tabLabel: { fontSize: 12, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
    scroll: { flex: 1 },
    content: { padding: 14, paddingBottom: bottomPadding + 14 },
    chapterCard: {
      backgroundColor: colors.card, borderRadius: colors.radius, marginBottom: 8,
      borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    },
    chapterCardDone: { borderColor: '#00e5a020', backgroundColor: colors.card },
    chapterRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    chapterInfo: { flex: 1 },
    chapterName: { fontSize: 13, fontWeight: '600' as const, color: colors.foreground, fontFamily: 'Inter_600SemiBold' },
    chapterSub: { fontSize: 11, color: colors.mutedForeground, marginTop: 3, fontFamily: 'Inter_400Regular' },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
    progressTrack: { flex: 1, height: 4, backgroundColor: colors.secondary, borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: 4, borderRadius: 2 },
    progressCount: { fontSize: 11, color: colors.mutedForeground, fontFamily: 'Inter_500Medium', minWidth: 32, textAlign: 'right' as const },
    controls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    ctrlBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
    checkBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Chapter Tracker</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabRow}>
          {SUBJECTS.map(subj => {
            const isActive = subj.key === activeSubject;
            const col = SUBJECT_COLORS[subj.key];
            return (
              <TouchableOpacity
                key={subj.key}
                style={[s.tab, {
                  backgroundColor: isActive ? `${col}20` : 'transparent',
                  borderBottomWidth: isActive ? 2 : 0,
                  borderBottomColor: col,
                }]}
                onPress={() => { Haptics.selectionAsync(); setActiveSubject(subj.key); }}
              >
                <Text style={[s.tabLabel, { color: isActive ? col : colors.mutedForeground }]}>{subj.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {subject.chapters.map(chapter => {
          const st = state.chapters[chapter.id];
          if (!st) return null;
          const pct = Math.min(100, st.totalLectures > 0 ? Math.round((st.lecturesWatched / st.totalLectures) * 100) : 0);
          return (
            <View key={chapter.id} style={[s.chapterCard, st.completed && s.chapterCardDone]}>
              <View style={s.chapterRow}>
                <View style={s.chapterInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={s.chapterName}>{chapter.name}</Text>
                    {chapter.isBasics && (
                      <View style={{ backgroundColor: 'rgba(255,180,0,0.15)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                        <Text style={{ fontSize: 10, color: '#FFB400', fontFamily: 'Inter_600SemiBold' }}>basics</Text>
                      </View>
                    )}
                  </View>
                  <View style={s.progressRow}>
                    <View style={s.progressTrack}>
                      <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: st.completed ? '#00e5a0' : subjectColor }]} />
                    </View>
                    <Text style={s.progressCount}>{st.lecturesWatched}/{st.totalLectures}</Text>
                  </View>
                </View>
                <View style={s.controls}>
                  <TouchableOpacity
                    style={s.ctrlBtn}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateLectures(chapter.id, st.lecturesWatched - 1); }}
                    disabled={st.lecturesWatched <= 0}
                  >
                    <Feather name="minus" size={14} color={st.lecturesWatched <= 0 ? colors.mutedForeground : colors.foreground} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.ctrlBtn}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateLectures(chapter.id, st.lecturesWatched + 1); }}
                  >
                    <Feather name="plus" size={14} color={colors.foreground} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.checkBtn, {
                      borderColor: st.completed ? '#00e5a0' : colors.border,
                      backgroundColor: st.completed ? 'rgba(0,229,160,0.15)' : 'transparent',
                    }]}
                    onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); toggleChapterComplete(chapter.id); }}
                  >
                    {st.completed && <Feather name="check" size={14} color="#00e5a0" />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
