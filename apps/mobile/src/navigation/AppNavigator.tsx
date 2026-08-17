/**
 * Atlas Sanctum Mobile — Navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen       from '../screens/HomeScreen';
import ReportScreen     from '../screens/ReportScreen';
import MapScreen        from '../screens/MapScreen';
import GovernanceScreen from '../screens/GovernanceScreen';
import ProfileScreen    from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Home: '🌍', Report: '📋', Map: '🗺', Governance: '🏛', Profile: '👤',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name] ?? '●'}</Text>,
          tabBarActiveTintColor: '#16a34a',
          tabBarInactiveTintColor: '#9ca3af',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        })}
      >
        <Tab.Screen name="Home"       component={HomeScreen}       options={{ title: 'Atlas Field' }} />
        <Tab.Screen name="Report"     component={ReportScreen}     options={{ title: 'Field Report' }} />
        <Tab.Screen name="Map"        component={MapScreen}        options={{ title: 'Bioregion Map' }} />
        <Tab.Screen name="Governance" component={GovernanceScreen} options={{ title: 'Governance' }} />
        <Tab.Screen name="Profile"    component={ProfileScreen}    options={{ title: 'Profile' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
