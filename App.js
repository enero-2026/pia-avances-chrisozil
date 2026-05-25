import React from 'react';
import { Text } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TravelProvider } from './context/TravelContext';

import HomeScreen from './screens/HomeScreen';
import AddScreen from './screens/AddScreen';
import MapScreen from './screens/MapScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TravelProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ size }) => {
              let iconName;
              if (route.name === 'Inicio') iconName = '🧳';
              else if (route.name === 'Agregar') iconName = '➕';
              else if (route.name === 'Mapa') iconName = '🗺️';

              return <Text style={{ fontSize: size }}>{iconName}</Text>;
            },
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: { height: 65, paddingBottom: 8, paddingTop: 6 },
            headerStyle: { backgroundColor: '#3b82f6' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          })}
        >
          <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'Mi Bitácora' }} />
          <Tab.Screen name="Agregar" component={AddScreen} options={{ title: 'Nuevo Destino' }} />
          <Tab.Screen name="Mapa" component={MapScreen} options={{ title: 'Mapa Interactivo' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </TravelProvider>
  );
}
