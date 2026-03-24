import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Colors, Shadows } from '../theme';

interface GlowButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'blue' | 'purple';
}

export const GlowButton: React.FC<GlowButtonProps> = ({ title, variant = 'blue', style, ...props }) => {
  const shadowStyle = variant === 'blue' ? Shadows.glowBlue : Shadows.neonPurple;
  const bgColor = variant === 'blue' ? Colors.accentPrimary : Colors.accentSecondary;

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: bgColor }, shadowStyle, style]} 
      activeOpacity={0.8}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
