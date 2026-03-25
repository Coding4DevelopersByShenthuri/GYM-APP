import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { GlassCard } from '../../components/GlassCard';
import { GlowButton } from '../../components/GlowButton';
import { Colors } from '../../theme';
import { signup } from '../../services/authService';

interface SignupScreenProps {
  onLogin: () => void;
  onSignupSuccess: (user: any) => void;
}

export default function SignupScreen({ onLogin, onSignupSuccess }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await signup(email, name, password);
      Alert.alert('Success', 'Account created successfully!');
      onSignupSuccess(data.user);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Signup failed';
      Alert.alert('Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GlassCard style={styles.glassCard}>
        <Text style={styles.title}>Join FitSphere</Text>
        <Text style={styles.subtitle}>Start your fitness journey today</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Full Name" 
          placeholderTextColor={Colors.textSecondary}
          value={name}
          onChangeText={setName}
        />
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
          <GlowButton title="Sign Up" style={styles.button} onPress={handleSignup} />
        )}

        <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginAccent}>Login</Text>
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
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginAccent: {
    color: Colors.accentPrimary,
    fontWeight: 'bold',
  },
});
