import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import HomeScreen from './screens/HomeScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OfferScreen from './screens/OfferScreen';
import PassengerScreen from './screens/PassengerScreen';
import AvailableRidesScreen from './screens/RideAvailableScreen';
export default function App() {
  const Stack= createNativeStackNavigator();
  return (

  <Provider store={store}>
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
          <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{
            headerShown:false
          }}/>
          <Stack.Screen 
          name="OfferScreen" 
          component={OfferScreen} 
          options={{
            headerShown:false
          }}
          />
          <Stack.Screen 
          name="PassengerScreen" 
          component={PassengerScreen} 
          options={{
            headerShown:false
          }}
          /><Stack.Screen 
          name="AvailableRidesScreen" 
          component={AvailableRidesScreen} 
          options={{
            headerShown:false
          }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
 
  </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
