import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
interface AuthProps {
  initRoute: string;
}
const AuthNaivgation = ({ initRoute }: AuthProps): JSX.Element => {
  const Stack = createNativeStackNavigator();
  const screenOptions = { headerShown: false };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initRoute}
        screenOptions={{ ...screenOptions }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{ title: 'Signup' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AuthNaivgation;
const styles = StyleSheet.create({});
