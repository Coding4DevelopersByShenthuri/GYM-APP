import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors, GlassStyles } from '../theme';

export const GlassCard: React.FC<ViewProps> = ({ children, style, ...props }) => {
  return (
    <View style={[GlassStyles.container, styles.glass, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glass: {
    overflow: 'hidden',
  },
});
