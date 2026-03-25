import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors } from '../../theme';
import { login } from '../../services/authService';

interface LoginScreenProps {
  onSignup: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginScreen({ onSignup, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      onLoginSuccess(data.user);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GlassCard style={styles.glassCard}>
        <Text style={styles.title}>FitSphere AI</Text>
        <Text style={styles.subtitle}>Welcome to the Future of Fitness</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          placeholderTextColor={Colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
        />

        {loading ? (
          <ActivityIndicator size="large" color={Colors.accentPrimary} style={{ marginVertical: 20 }} />
        ) : (
          <GlowButton title="Login" style={styles.button} onPress={handleLogin} />
        )}

        <TouchableOpacity onPress={onSignup} style={styles.signupLink}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupAccent}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
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
    signupLink: {
      marginTop: 20,
      alignItems: 'center',
    },
    signupText: {
      color: Colors.textSecondary,
      fontSize: 14,
    },
    signupAccent: {
      color: Colors.accentPrimary,
      fontWeight: 'bold',
    },
  });
  
