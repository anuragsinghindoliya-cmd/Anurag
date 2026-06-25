/**
 * MetricWidget — Physical docked module/widget for stat displays.
 * Appears as a hardware panel extruded from the dashboard surface.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Text, View, ViewStyle } from 'react-native';
import { BOX_SHADOW, COLORS, GRADIENTS, LIGHT, RADIUS, SHADOWS, TYPE } from '@/constants/theme';

interface MetricWidgetProps {
  value: string | number;
  label: string;
  color?: string;
  glowColor?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricWidget({ value, label, color = COLORS.textPrimary, glowColor, icon, style, size = 'md' }: MetricWidgetProps) {
  const glow = glowColor ?? (color !== COLORS.textPrimary ? color + '80' : undefined);
  const shadowStyle = glow ? SHADOWS.glow(glow, 10) : SHADOWS.sm;
  const webShadow   = glow ? BOX_SHADOW.glow(glow, 10) : BOX_SHADOW.sm;
  const outerShadow = Platform.OS === 'web' ? { boxShadow: webShadow } as ViewStyle : shadowStyle;

  const valSize = size === 'lg' ? 32 : size === 'sm' ? 18 : 24;

  return (
    <LinearGradient
      colors={GRADIENTS.bevelBorder}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: RADIUS.lg + 1, padding: 1, flex: 1 }, outerShadow, style]}
    >
      <LinearGradient
        colors={GRADIENTS.cardElevated}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: RADIUS.lg,
          padding: size === 'sm' ? 12 : 16,
          alignItems: 'center',
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderTopColor: LIGHT.highlightBorder,
          borderLeftColor: LIGHT.highlightBorder,
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderBottomColor: COLORS.borderShadow,
          borderRightColor: COLORS.borderShadow,
        }}
      >
        {icon && <View style={{ marginBottom: 6 }}>{icon}</View>}
        <Text style={[TYPE.display, { fontSize: valSize, color, textAlign: 'center' as const }]}>{value}</Text>
        <Text style={[TYPE.label, { color: COLORS.textMuted, marginTop: 4, textAlign: 'center' as const }]}>{label}</Text>
      </LinearGradient>
    </LinearGradient>
  );
}

/** Horizontal stat row (label + value side by side) */
export function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
      <Text style={[TYPE.body, { color: COLORS.textSecondary }]}>{label}</Text>
      <Text style={[TYPE.bodyMed, { color: color ?? COLORS.textPrimary }]}>{value}</Text>
    </View>
  );
}

/** Glowing badge pill */
export function Badge({ label, color = COLORS.primary }: { label: string; color?: string }) {
  return (
    <View style={{
      backgroundColor: color + '18',
      borderRadius: RADIUS.pill,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderWidth: 1,
      borderColor: color + '40',
      alignSelf: 'flex-start' as const,
    }}>
      <Text style={[TYPE.xs, { color }]}>{label}</Text>
    </View>
  );
}
