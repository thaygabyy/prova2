import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DestinationsScreen from './screens/DestinationsScreen';
import PackagesScreen from './screens/PackagesScreen';
import RoutesScreen from './screens/RoutesScreen';
import ExperiencesScreen from './screens/ExperiencesScreen';
import ReviewsScreen from './screens/ReviewsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Destinos" component={DestinationsScreen} />
        <Tab.Screen name="Pacotes turísticos" component={PackagesScreen} />
        <Tab.Screen name="Roteiros" component={RoutesScreen} />
        <Tab.Screen name="Experiências" component={ExperiencesScreen} />
        <Tab.Screen name="Avaliações" component={ReviewsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

