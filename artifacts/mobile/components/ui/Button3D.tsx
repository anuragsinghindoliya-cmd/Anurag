/**
 * Button3D — Tactile spring-physics button that presses into the Z-axis.
 * Uses Reanimated withSpring for realistic snap-back feel.
 * The LinearGradient surface + shadow depth shrinks on press.
 */
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, StyleProp, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BOX_SHADOW, COLORS, GRADIENTS, LIGHT, RADIUS, SHADOWS, TYPE } from '@/constants/theme';

type Variant = 'primary' | 'success' | 'error' | 'ghost' | 'outline' | 'subject';

interface Button3DProps {
  label?: string;
  onPress?: () => void;
  variant?: Variant;
  color?: string;
  glowColor?: string;
  gradColors?: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  icon?: React.ReactNode;
  compact?: boolean;
  fullWidth?: boolean;
}

const VARIANT_GRADS: Record<Variant, readonly [string, string, ...string[]]> = {
  primary: GRADIENTS.primaryBtn,
  success: GRADIENTS.successBtn,
  error:   GRADIENTS.errorBtn,
  ghost:   GRADIENTS.ghostBtn,
  outline: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'],
  subject: GRADIENTS.primaryBtn,
};

const VARIANT_GLOW: Record<Variant, string> = {
  primary: COLORS.primaryGlow,
  success: COLORS.successGlow,
  error:   COLORS.errorGlow,
  ghost:   'transparent',
  outline: 'transparent',
  subject: COLORS.primaryGlow,
};

const SPRING_PRESS   = { damping: 14, stiffness: 450 };
const SPRING_RELEASE = { damping: 10, stiffness: 220 };

export function Button3D({
  label,
  onPress,
  variant = 'primary',
  color,
  glowColor,
  gradColors,
  style,
  textStyle,
  disabled = false,
  icon,
  compact = false,
  fullWidth = false,
}: Button3DProps) {
  const pressed = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - pressed.value * 0.035 },
      { translateY: pressed.value * 2.5 },
    ],
  }));

  const onPressIn = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pressed.value = withSpring(1, SPRING_PRESS);
  };

  const onPressOut = () => {
    pressed.value = withSpring(0, SPRING_RELEASE);
  };

  const resolvedGrad  = gradColors ?? VARIANT_GRADS[variant];
  const resolvedGlow  = glowColor  ?? VARIANT_GLOW[variant];
  const isOutlineOrGhost = variant === 'ghost' || variant === 'outline';

  const shadowStyle = resolvedGlow && resolvedGlow !== 'transparent'
    ? SHADOWS.glow(resolvedGlow, 12)
    : SHADOWS.sm;
  const webShadow = resolvedGlow && resolvedGlow !== 'transparent'
    ? BOX_SHADOW.glow(resolvedGlow, 12)
    : BOX_SHADOW.sm;

  const outerShadow = Platform.OS === 'web'
    ? { boxShadow: webShadow } as ViewStyle
    : shadowStyle;

  const btnPadV = compact ? 8  : 14;
  const btnPadH = compact ? 14 : 20;

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={disabled ? undefined : onPress}
    >
      <Animated.View style={[animStyle, fullWidth && { width: '100%' }, style]}>
        {/* Outer bevel border */}
        <LinearGradient
          colors={GRADIENTS.bevelBorderStrong}
          locations={[0, 0.45, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ borderRadius: RADIUS.md + 1, padding: 1 }, outerShadow, disabled && { opacity: 0.45 }]}
        >
          {/* Button surface */}
          <LinearGradient
            colors={resolvedGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={{
              borderRadius: RADIUS.md,
              paddingVertical: btnPadV,
              paddingHorizontal: btnPadH,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderTopColor: isOutlineOrGhost ? LIGHT.highlightBorder : 'rgba(255,255,255,0.18)',
              borderLeftColor: isOutlineOrGhost ? LIGHT.highlightBorder : 'rgba(255,255,255,0.18)',
              borderBottomWidth: isOutlineOrGhost ? 1 : 0,
              borderRightWidth: isOutlineOrGhost ? 1 : 0,
              borderBottomColor: LIGHT.shadowBorder,
              borderRightColor: LIGHT.shadowBorder,
            }}
          >
            {icon && <View>{icon}</View>}
            {label && (
              <Text
                style={[
                  TYPE.bodyMed,
                  { color: isOutlineOrGhost ? COLORS.textSecondary : COLORS.textPrimary },
                  color && { color },
                  textStyle,
                ]}
              >
                {label}
              </Text>
            )}
          </LinearGradient>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

/** Compact icon-only round 3D button */
export function IconButton3D({
  icon,
  onPress,
  size = 36,
  glowColor,
  variant = 'ghost',
  disabled,
}: {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  glowColor?: string;
  variant?: Variant;
  disabled?: boolean;
}) {
  const pressed = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.06 }, { translateY: pressed.value * 1.5 }],
  }));

  return (
    <TouchableWithoutFeedback
      onPressIn={() => { if (!disabled) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); pressed.value = withSpring(1, SPRING_PRESS); } }}
      onPressOut={() => { pressed.value = withSpring(0, SPRING_RELEASE); }}
      onPress={disabled ? undefined : onPress}
    >
      <Animated.View style={animStyle}>
        <LinearGradient
          colors={VARIANT_GRADS[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: size, height: size, borderRadius: size / 2,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1,
            borderTopColor: LIGHT.highlightBorder,
            borderLeftColor: LIGHT.highlightBorder,
            borderBottomColor: LIGHT.shadowBorder,
            borderRightColor: LIGHT.shadowBorder,
          }}
        >
          {icon}
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
