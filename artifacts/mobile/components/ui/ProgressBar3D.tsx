/**
 * ProgressBar3D — Extruded track with glowing neon fill.
 * The track is an inset well (darker, shadow border on top-left).
 * The fill bar glows with the subject color.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { BOX_SHADOW, COLORS, GRADIENTS, LIGHT, SHADOWS } from '@/constants/theme';

interface ProgressBar3DProps {
  value: number;          // 0–100
  color?: string;
  glowColor?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
}

export function ProgressBar3D({
  value,
  color = COLORS.primary,
  glowColor,
  height = 8,
  style,
  rounded = true,
}: ProgressBar3DProps) {
  const pct = Math.min(100, Math.max(0, value));
  const glow = glowColor ?? color;
  const r = rounded ? height / 2 : 2;

  const trackShadow = Platform.OS === 'web'
    ? { boxShadow: BOX_SHADOW.inset } as ViewStyle
    : {};
  const fillShadow = Platform.OS === 'web'
    ? { boxShadow: BOX_SHADOW.glow(glow, height + 4) } as ViewStyle
    : SHADOWS.glow(glow, height + 4);

  return (
    // Track: inset well
    <LinearGradient
      colors={GRADIENTS.trackBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          height,
          borderRadius: r,
          overflow: 'hidden',
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderTopColor: COLORS.borderShadow,
          borderLeftColor: COLORS.borderShadow,
          borderBottomColor: LIGHT.highlightBorder,
          borderRightColor: LIGHT.highlightBorder,
          borderBottomWidth: 1,
          borderRightWidth: 1,
        },
        trackShadow,
        style,
      ]}
    >
      {pct > 0 && (
        // Fill: glowing neon bar
        <LinearGradient
          colors={[lighten(color, 0.3), color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            { width: `${pct}%`, height: '100%', borderRadius: r },
            fillShadow,
          ]}
        />
      )}
    </LinearGradient>
  );
}

/** Circular ring progress indicator */
export function RingProgress({
  value,
  size = 80,
  strokeWidth = 6,
  color = COLORS.primary,
  children,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  const glowShadow = Platform.OS === 'web'
    ? { boxShadow: `0 0 ${strokeWidth * 3}px ${color}90` } as ViewStyle
    : SHADOWS.glow(color, strokeWidth * 2);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background ring */}
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: COLORS.borderSubtle,
        borderTopColor: COLORS.borderShadow,
        borderLeftColor: COLORS.borderShadow,
      }} />
      {/* Progress arc — approximated with a filled segment */}
      {pct > 0 && (
        <View
          style={[{
            position: 'absolute',
            width: size, height: size, borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: pct > 25 ? color : 'transparent',
            borderBottomColor: pct > 50 ? color : 'transparent',
            borderLeftColor: pct > 75 ? color : 'transparent',
            transform: [{ rotate: '-45deg' }],
          }, glowShadow]}
        />
      )}
      {children && (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </View>
      )}
    </View>
  );
}

// Helper: lighten a hex color by mixing with white
function lighten(hex: string, amt: number): string {
  if (!hex.startsWith('#')) return hex;
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.round(((num >> 16) & 255) + (255 - ((num >> 16) & 255)) * amt));
  const g = Math.min(255, Math.round(((num >> 8)  & 255) + (255 - ((num >> 8)  & 255)) * amt));
  const b = Math.min(255, Math.round(((num)       & 255) + (255 - ((num)       & 255)) * amt));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
