import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors } from '../../theme';

  export default function LoginScreen() {
    return (
      <View style={styles.container}>
        <GlassCard style={styles.glassCard}>
          <Text style={styles.title}>FitSphere AI</Text>
          <Text style={styles.subtitle}>Welcome to the Future of Fitness</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Email Address" 
            placeholderTextColor={Colors.textSecondary}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry 
            placeholderTextColor={Colors.textSecondary}
          />

          <GlowButton title="Login" style={styles.button} />
        </GlassCard>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.black,
      justifyContent: 'center',
      padding: 20,
    },
    glassCard: {
      padding: 30,
    },
    title: {
      color: Colors.accentPrimary,
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      color: Colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 12,
      padding: 15,
      color: Colors.textPrimary,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: Colors.glassBorder,
    },
    button: {
      backgroundColor: Colors.accentPrimary,
      borderRadius: 15,
      padding: 18,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: Colors.black,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
