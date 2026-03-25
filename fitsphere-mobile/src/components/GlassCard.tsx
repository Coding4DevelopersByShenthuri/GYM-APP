import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, GlassStyles } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'cyan' | 'violet' | 'green';
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  noPadding = false,
  ...props
}) => {
  const borderColor = {
    default: Colors.glassBorder,
    cyan: Colors.glassBorderActive,
    violet: 'rgba(178, 75, 243, 0.4)',
    green: 'rgba(0, 255, 158, 0.35)',
  }[variant];

  const accentOverlay = {
    default: 'transparent',
    cyan: 'rgba(0, 229, 255, 0.04)',
    violet: 'rgba(178, 75, 243, 0.04)',
    green: 'rgba(0, 255, 158, 0.04)',
  }[variant];

  return (
    <View
      style={[
        GlassStyles.container,
        { borderColor, backgroundColor: accentOverlay },
        !noPadding && styles.padding,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  padding: {
    padding: 16,
  },
});
