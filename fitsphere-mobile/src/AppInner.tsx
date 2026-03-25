import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Dumbbell, Calendar, User } from 'lucide-react-native';

import LoginScreen from './screens/Auth/LoginScreen';
import SignupScreen from './screens/Auth/SignupScreen';
import HomeScreen from './screens/Dashboard/HomeScreen';
import WorkoutScreen from './screens/Workouts/WorkoutBuilder'; // We'll update this shortly
import ScheduleScreen from './screens/Schedule/ScheduleScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import { Colors } from './theme';
import { getStoredUser } from './services/authService';

const Tab = createBottomTabNavigator();

type AuthScreen = 'login' | 'signup';

function TabNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surfaceBase,
          borderTopWidth: 1,
          borderTopColor: Colors.borderSubtle,
          paddingTop: 8,
          paddingBottom: 6,
          height: 70,
        },
        tabBarActiveTintColor: Colors.accentPrimary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => {
          const sz = 22;
          if (route.name === 'Dashboard') return <Home color={color} size={sz} />;
          if (route.name === 'Workouts') return <Dumbbell color={color} size={sz} />;
          if (route.name === 'Schedule') return <Calendar color={color} size={sz} />;
          if (route.name === 'Profile') return <User color={color} size={sz} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppInner() {
  const [user, setUser] = useState<any>(null);
  const [currentAuthScreen, setCurrentAuthScreen] = useState<AuthScreen>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to check stored user:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleSignupSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accentPrimary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? (
          <TabNavigator onLogout={handleLogout} />
        ) : currentAuthScreen === 'login' ? (
          <LoginScreen 
            onSignup={() => setCurrentAuthScreen('signup')} 
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <SignupScreen 
            onLogin={() => setCurrentAuthScreen('login')} 
            onSignupSuccess={handleSignupSuccess}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
