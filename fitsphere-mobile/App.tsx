import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AppInner from './src/AppInner';

export default function App() {
  return (
    <>
      <AppInner />
      <StatusBar style="light" />
    </>
  );
}
