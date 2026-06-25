import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Card3D, Divider3D, Well3D } from '@/components/ui/Card3D';
import { ProgressBar3D } from '@/components/ui/ProgressBar3D';
import { usePlanner } from '@/context/PlannerContext';
import { SUBJECTS } from '@/data/plannerData';
import {
  COLORS, GRADIENTS, RADIUS, SHADOWS, BOX_SHADOW,
  TYPE, SUBJECT_THEME, LIGHT, isWeb,
} from '@/constants/theme';
import type { SubjectColorKey } from '@/constants/theme';
import type { SubjectKey } from '@/data/plannerData';

const SPRING = { damping: 14, stiffness: 400 };

function CtrlButton({ icon, onPress, disabled }: { icon: string; onPress: () => void; disabled?: boolean }) {
  const pressed = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.08 }, { translateY: pressed.value * 1.5 }],
  }));
  return (
    <TouchableOpacity
      onPressIn={() => { if (!disabled) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); pressed.value = withSpring(1, SPRING); } }}
      onPressOut={() => { pressed.value = withSpring(0, SPRING); }}
      onPress={disabled ? undefined : onPress}
      activeOpacity={1}
    >
      <Animated.View style={anim}>
        <LinearGradient
          colors={disabled ? ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)'] : GRADIENTS.ghostBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 32, height: 32, borderRadius: RADIUS.sm,
            alignItems: 'center', justifyContent: 'center',
            borderTopWidth: 1, borderLeftWidth: 1,
            borderTopColor: disabled ? COLORS.borderSubtle : LIGHT.highlightBorder,
            borderLeftColor: disabled ? COLORS.borderSubtle : LIGHT.highlightBorder,
            borderBottomWidth: 1, borderRightWidth: 1,
            borderBottomColor: LIGHT.shadowBorder,
            borderRightColor: LIGHT.shadowBorder,
          }}
        >
          <Feather name={icon as any} size={14} color={disabled ? COLORS.textDim : COLORS.textSecondary} />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ChaptersScreen() {
  const insets = useSafeAreaInsets();
  const { state, updateLectures, toggleChapterComplete } = usePlanner();
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('physics');

  const topPad = isWeb ? Math.max(insets.top, 67) : insets.top;
  const botPad = isWeb ? 34 + 84 : 60 + insets.bottom;

  const subject = SUBJECTS.find(s => s.key === activeSubject)!;
  const t = SUBJECT_THEME[activeSubject as SubjectColorKey];

  const completedCount = subject.chapters.filter(ch => state.chapters[ch.id]?.completed).length;
  const totalCount     = subject.chapters.length;

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
          paddingBottom: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.borderSubtle,
          ...(isWeb ? { boxShadow: BOX_SHADOW.sm } : SHADOWS.sm) as object,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View>
            <Text style={[TYPE.h2, { color: COLORS.textPrimary }]}>Chapter Tracker</Text>
            <Text style={[TYPE.sm, { color: t.color, marginTop: 2 }]}>
              {completedCount}/{totalCount} chapters complete
            </Text>
          </View>
          <View style={{
            backgroundColor: t.color + '18',
            borderRadius: RADIUS.pill,
            paddingHorizontal: 14, paddingVertical: 6,
            borderWidth: 1, borderColor: t.color + '40',
            ...(isWeb ? { boxShadow: `0 0 14px ${t.glow}` } : {}) as object,
          }}>
            <Text style={[TYPE.smBold, { color: t.color }]}>{subject.label}</Text>
          </View>
        </View>

        {/* Subject tab strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4, paddingBottom: 1 }}>
          {SUBJECTS.map(subj => {
            const isActive = subj.key === activeSubject;
            const st = SUBJECT_THEME[subj.key as SubjectColorKey];
            return (
              <TouchableOpacity
                key={subj.key}
                onPress={() => { Haptics.selectionAsync(); setActiveSubject(subj.key); }}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8,
                  borderTopLeftRadius: RADIUS.sm, borderTopRightRadius: RADIUS.sm,
                  backgroundColor: isActive ? st.color + '18' : 'transparent',
                  borderBottomWidth: isActive ? 2 : 0,
                  borderBottomColor: st.color,
                }}
              >
                <Text style={[TYPE.smBold, { color: isActive ? st.color : COLORS.textMuted }]}>
                  {subj.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 14, paddingBottom: botPad + 14 }}
        showsVerticalScrollIndicator={false}
      >
        {subject.chapters.map((chapter, ci) => {
          const st = state.chapters[chapter.id];
          if (!st) return null;
          const pct = st.totalLectures > 0 ? Math.min(100, Math.round((st.lecturesWatched / st.totalLectures) * 100)) : 0;
          const isDone = st.completed;

          return (
            <Card3D
              key={chapter.id}
              variant={isDone ? 'elevated' : 'default'}
              glowColor={isDone ? COLORS.successGlow : undefined}
              padding={0}
              style={{ marginBottom: 8, overflow: 'hidden' }}
            >
              <View style={{ padding: 14 }}>
                {/* Title row */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <Text style={[TYPE.bodyMed, { color: isDone ? COLORS.success : COLORS.textPrimary, flex: 0 }]}>
                        {chapter.name}
                      </Text>
                      {chapter.isBasics && (
                        <View style={{
                          backgroundColor: COLORS.warning + '18', borderRadius: RADIUS.xs,
                          paddingHorizontal: 6, paddingVertical: 2,
                          borderWidth: 1, borderColor: COLORS.warning + '35',
                        }}>
                          <Text style={[TYPE.xs, { color: COLORS.warning }]}>BASICS</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[TYPE.sm, { color: isDone ? COLORS.success + 'aa' : COLORS.textMuted, marginTop: 3 }]}>
                      {st.lecturesWatched} / {st.totalLectures} lectures
                      {isDone ? ' · ✓ Complete' : ` · ${pct}%`}
                    </Text>
                  </View>

                  {/* Complete toggle */}
                  <TouchableOpacity
                    onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); toggleChapterComplete(chapter.id); }}
                    style={{
                      width: 30, height: 30, borderRadius: RADIUS.sm,
                      backgroundColor: isDone ? COLORS.success + '20' : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                      borderWidth: 1.5, borderColor: isDone ? COLORS.success : COLORS.borderHighlight,
                      ...(isDone && isWeb ? { boxShadow: `0 0 10px ${COLORS.successGlow}` } : {}) as object,
                    }}
                  >
                    {isDone && <Feather name="check" size={15} color={COLORS.success} />}
                  </TouchableOpacity>
                </View>

                {/* Progress bar */}
                <ProgressBar3D
                  value={pct}
                  color={isDone ? COLORS.success : t.color}
                  glowColor={isDone ? COLORS.successGlow : t.glow}
                  height={6}
                  style={{ marginBottom: 12 }}
                />

                {/* Counter controls */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <CtrlButton
                    icon="minus"
                    disabled={st.lecturesWatched <= 0}
                    onPress={() => updateLectures(chapter.id, st.lecturesWatched - 1)}
                  />

                  {/* Lecture count display */}
                  <Well3D style={{ flex: 1, padding: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Text style={[TYPE.h3, { color: isDone ? COLORS.success : t.color }]}>
                        {st.lecturesWatched}
                      </Text>
                      <Text style={[TYPE.sm, { color: COLORS.textMuted }]}>/ {st.totalLectures}</Text>
                    </View>
                  </Well3D>

                  <CtrlButton
                    icon="plus"
                    onPress={() => updateLectures(chapter.id, st.lecturesWatched + 1)}
                  />
                </View>
              </View>

              {/* Bottom accent strip for active subject color */}
              {!isDone && (
                <LinearGradient
                  colors={[t.color + '00', t.color + '22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 2 }}
                />
              )}
            </Card3D>
          );
        })}
      </ScrollView>
    </View>
  );
}
