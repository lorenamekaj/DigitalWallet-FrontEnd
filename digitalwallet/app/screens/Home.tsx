import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';  // Correct import for Ionicons
import Profile from './Profile';
import Documents from './Documents';
import Transactions from './Transactions';
import Info from './Info';

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Profile':
              iconName = 'person';
              break;
            case 'Documents':
              iconName = 'document-text';
              break;
            case 'Transactions':
              iconName = 'wallet';
              break;
            case 'Info':
              iconName = 'information-circle';
              break;
            default:
              iconName = 'help';
              break;
          }

          return <Ionicons name={iconName} size={size} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray'
    })}
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Documents" component={Documents} />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="Info" component={Info} />
    </Tab.Navigator>
  );
};

export default Home;
