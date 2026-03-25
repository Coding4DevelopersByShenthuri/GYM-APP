import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Colors, Shadows, Radii } from '../theme';

interface GlowButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'cyan' | 'violet' | 'green' | 'danger' | 'ghost' | 'ghostViolet';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  title,
  variant = 'cyan',
  style,
  loading = false,
  size = 'md',
  icon,
  ...props
}) => {
  const configs = {
    cyan: {
      bg: Colors.accentPrimary,
      text: Colors.black,
      shadow: Shadows.glowCyan,
    },
    violet: {
      bg: Colors.accentSecondary,
      text: Colors.textPrimary,
      shadow: Shadows.glowViolet,
    },
    green: {
      bg: Colors.accentGreen,
      text: Colors.black,
      shadow: Shadows.glowGreen,
    },
    danger: {
      bg: Colors.danger,
      text: Colors.textPrimary,
      shadow: { shadowColor: Colors.danger, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 8 },
    },
    ghost: {
      bg: 'transparent',
      text: Colors.accentPrimary,
      shadow: {},
    },
    ghostViolet: {
      bg: 'transparent',
      text: Colors.accentSecondary,
      shadow: {},
    },
  };

  const sizes = {
    sm: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 13, borderRadius: Radii.md },
    md: { paddingVertical: 15, paddingHorizontal: 24, fontSize: 15, borderRadius: Radii.lg },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 17, borderRadius: Radii.lg },
  };

  const cfg = configs[variant];
  const sz = sizes[size];
  const isGhost = variant === 'ghost' || variant === 'ghostViolet';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        cfg.shadow,
        {
          backgroundColor: cfg.bg,
          paddingVertical: sz.paddingVertical,
          paddingHorizontal: sz.paddingHorizontal,
          borderRadius: sz.borderRadius,
        },
        isGhost && styles.ghost,
        isGhost && {
          borderColor: cfg.text,
        },
        style,
      ]}
      activeOpacity={0.75}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={cfg.text} />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, { color: cfg.text, fontSize: sz.fontSize }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ghost: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
