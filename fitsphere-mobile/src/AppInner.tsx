import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
// Note: Actual react-navigation imports would fail here until npm install finishes
// We'll structure it so it's ready for when the packages are available

import LoginScreen from './screens/Auth/LoginScreen';
import HomeScreen from './screens/Dashboard/HomeScreen';
import { Colors } from './theme';

export default function AppInner() {
  // Mock authentication state for now
  const isAuthenticated = false;

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <HomeScreen />
      ) : (
        <LoginScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});
