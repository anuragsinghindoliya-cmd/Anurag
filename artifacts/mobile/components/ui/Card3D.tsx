/**
 * Card3D — Floating extruded panel with bevel border lighting.
 * Outer LinearGradient creates a highlight→shadow bevel edge.
 * Inner LinearGradient simulates the virtual light source on the surface.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { BOX_SHADOW, COLORS, GRADIENTS, LIGHT, RADIUS, SHADOWS } from '@/constants/theme';

interface Card3DProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'deep' | 'glass';
  glowColor?: string;
  padding?: number;
  borderRadius?: number;
  noBevel?: boolean;
}

const CARD_GRADS: Record<string, readonly [string, string, ...string[]]> = {
  default:  GRADIENTS.card,
  elevated: GRADIENTS.cardElevated,
  deep:     GRADIENTS.cardDeep,
  glass:    ['rgba(20,26,52,0.75)', 'rgba(10,14,30,0.85)'],
};

export function Card3D({
  children,
  style,
  innerStyle,
  variant = 'default',
  glowColor,
  padding = 18,
  borderRadius = RADIUS.lg,
  noBevel = false,
}: Card3DProps) {
  const shadowStyle = glowColor ? SHADOWS.glow(glowColor) : SHADOWS.card;
  const webShadow   = glowColor ? BOX_SHADOW.glow(glowColor) : BOX_SHADOW.card;
  const outerR = borderRadius + 1;

  const outerShadow = Platform.OS === 'web'
    ? { boxShadow: webShadow } as ViewStyle
    : shadowStyle;

  if (noBevel) {
    return (
      <LinearGradient
        colors={CARD_GRADS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius, padding }, outerShadow, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    // Bevel border: gradient goes from highlight (top-left) to shadow (bottom-right)
    <LinearGradient
      colors={noBevel ? ['transparent', 'transparent'] : GRADIENTS.bevelBorder}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: outerR, padding: 1 }, outerShadow, style]}
    >
      {/* Card surface: light at top-left, darker at bottom-right */}
      <LinearGradient
        colors={CARD_GRADS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius, padding }, innerStyle]}
      >
        {children}
      </LinearGradient>
    </LinearGradient>
  );
}

/** Hairline divider that fades like light hitting a crease */
export function Divider3D({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient
      colors={['transparent', LIGHT.highlightBorder, 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[{ height: 1, marginVertical: 2 }, style]}
    />
  );
}

/** Inset well — like an indented recess in the surface */
export function Well3D({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const insetShadow = Platform.OS === 'web'
    ? { boxShadow: BOX_SHADOW.inset } as ViewStyle
    : {};
  return (
    <LinearGradient
      colors={GRADIENTS.cardDeep}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: RADIUS.md,
          padding: 12,
          borderWidth: 1,
          borderTopColor: COLORS.borderShadow,
          borderLeftColor: COLORS.borderShadow,
          borderBottomColor: LIGHT.highlightBorder,
          borderRightColor: LIGHT.highlightBorder,
        },
        insetShadow,
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}
