import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgetPasswordScreen from '../screens/Auth/ForgetPasswordScreen';
import VerifyOTPScreen from '../screens/Auth/VerifyOTPScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import SelectPlan from '../screens/Auth/SelectPlan';
interface AuthProps {
     initRoute: string;
}
const AuthNaivgation = ({ initRoute }: AuthProps): JSX.Element => {
     const Stack = createNativeStackNavigator();
     const screenOptions = { headerShown: false };
     return (
          <NavigationContainer>
               <Stack.Navigator initialRouteName={initRoute} screenOptions={{ ...screenOptions }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
                    <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ title: 'Signup' }} />
                    <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} options={{ title: 'Forget Password' }} />
                    <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} options={{ title: 'Verify OTP' }} />
                    <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />
                    <Stack.Screen name="SelectPlanScreen" component={SelectPlan} options={{ title: 'Select Plan' }} />
               </Stack.Navigator>
          </NavigationContainer>
     );
};
export default AuthNaivgation;
const styles = StyleSheet.create({});
