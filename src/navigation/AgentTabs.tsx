import React, { JSX } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Platform } from 'react-native';
import colors from '../assests/color/color';
import ProfileScreen from '../screens/User/ProfileScreen';
import EditProfileScreen from '../screens/User/EditProfileScreen';
import ChangePasswordScreen from '../screens/User/ChangePasswordScreen';
import HomeScreen from '../screens/Agent/HomeScreen';
import { NavigationContainer, useNavigation, getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListingScreen from '../screens/Agent/ListingScreen';
import SubscriptionManagment from '../screens/Subscription/SubscriptionManagment';
import ApartmentsScreen from '../screens/Agent/ApartmentsScreen';
import MatchDetail from '../screens/User/MatchDetail';
import Matches from '../screens/Agent/Matches';
import SingleApartment from '../screens/Agent/SingleApartment';
import AgentMatchDetail from '../screens/Agent/AgentMatchDetail';
import PrivacyPolicyScreen from '../screens/PrivacyPolicy/PrivacyPolicyScreen';

const Tab = createBottomTabNavigator();
const ProfileStackNavigator = createStackNavigator();
const ListStackNavigator = createStackNavigator();
const HomeStackNavigator = createStackNavigator();
const MatchesStackNavigator = createStackNavigator();

type HomeStackParamList = {
     buyerMatch: undefined;
     AgentMatchDetail: undefined;
};

type HomeStackRouteProp = RouteProp<{ Home: HomeStackParamList }, 'Home'>;

const HomeStack = (): JSX.Element => {
     return (
          <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
               <HomeStackNavigator.Screen name="buyerMatch" component={Matches} options={{ headerShown: false }} />
               <HomeStackNavigator.Screen name="AgentMatchDetail" component={AgentMatchDetail} options={{ headerShown: false }} />
          </HomeStackNavigator.Navigator>
     );
};

const ProfileStack = (): JSX.Element => {
     return (
          <ProfileStackNavigator.Navigator screenOptions={{ headerShown: false }}>
               <ProfileStackNavigator.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="SubscriptionManagment" component={SubscriptionManagment} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
          </ProfileStackNavigator.Navigator>
     );
};

const ListStack = (): JSX.Element => {
     return (
          <ListStackNavigator.Navigator screenOptions={{ headerShown: false }}>
               <ListStackNavigator.Screen name="ApartmentsScreen" component={ApartmentsScreen} options={{ headerShown: false }} />
               <ListStackNavigator.Screen name="SingleAprtment" component={SingleApartment} options={{ headerShown: false }} />
               <ListStackNavigator.Screen name="ListingScreen" component={ListingScreen} options={{ headerShown: false }} />
          </ListStackNavigator.Navigator>
     );
};

const MatchesStack = (): JSX.Element => {
     return (
          <MatchesStackNavigator.Navigator screenOptions={{ headerShown: false }}>
               <MatchesStackNavigator.Screen name="buyerMatch" component={Matches} options={{ headerShown: false }} />
               <MatchesStackNavigator.Screen name="MatchDetail" component={MatchDetail} options={{ headerShown: false }} />
               <MatchesStackNavigator.Screen name="ListingScreen" component={ListingScreen} options={{ headerShown: false }} />
          </MatchesStackNavigator.Navigator>
     );
};

// Custom Tab Bar Icon — now actually applies the active-state background
const TabBarIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => {
     return (
          <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
               <Icon name={focused ? name : `${name}-outline`} size={22} color={color} />
          </View>
     );
};

const AgentTabs = (): JSX.Element => {
     const insets = useSafeAreaInsets();

     return (
          <NavigationContainer>
               <Tab.Navigator
                    screenOptions={{
                         headerShown: false,
                         tabBarActiveTintColor: colors.PrimaryColor,
                         tabBarInactiveTintColor: '#9CA3AF',

                         tabBarStyle: {
                              position: 'absolute',
                              left: 20,
                              right: 20,
                              bottom: insets.bottom + 12,
                              height: 64,
                              marginInline: 10,
                              backgroundColor: '#FFFFFF',
                              borderRadius: 32,
                              borderTopWidth: 0,
                              paddingHorizontal: 8,
                              ...Platform.select({
                                   ios: {
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 6 },
                                        shadowOpacity: 0.12,
                                        shadowRadius: 16,
                                   },
                                   android: {
                                        elevation: 10,
                                   },
                              }),
                         },
                         tabBarLabelStyle: {
                              fontSize: 11,
                              fontWeight: '600',
                              marginTop: 2,
                         },
                         tabBarItemStyle: {
                              paddingVertical: 6,
                         },
                    }}
               >
                    <Tab.Screen
                         name="Home"
                         component={HomeStack}
                         options={({ route }) => ({
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
                              // Hide tab bar when on AgentMatchDetail
                              tabBarStyle:
                                   getFocusedRouteNameFromRoute(route) === 'AgentMatchDetail' || getFocusedRouteNameFromRoute(route) === 'ListingScreen'
                                        ? { display: 'none' }
                                        : {
                                               position: 'absolute',
                                               left: 20,
                                               right: 20,
                                               bottom: insets.bottom + 12,
                                               height: 64,
                                               marginInline: 10,
                                               backgroundColor: '#FFFFFF',
                                               borderRadius: 32,
                                               borderTopWidth: 0,
                                               paddingHorizontal: 8,
                                               ...Platform.select({
                                                    ios: {
                                                         shadowColor: '#000',
                                                         shadowOffset: { width: 0, height: 6 },
                                                         shadowOpacity: 0.12,
                                                         shadowRadius: 16,
                                                    },
                                                    android: {
                                                         elevation: 10,
                                                    },
                                               }),
                                          },
                         })}
                    />
                    <Tab.Screen
                         name="Listing"
                         component={ListStack}
                         options={({ route }) => ({
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="list" color={color} focused={focused} />,
                              tabBarStyle:
                                   getFocusedRouteNameFromRoute(route) === 'ListingScreen' || getFocusedRouteNameFromRoute(route) === 'SingleAprtment'
                                        ? { display: 'none' }
                                        : {
                                               position: 'absolute',
                                               left: 20,
                                               right: 20,
                                               bottom: insets.bottom + 12,
                                               height: 64,
                                               marginInline: 10,
                                               backgroundColor: '#FFFFFF',
                                               borderRadius: 32,
                                               borderTopWidth: 0,
                                               paddingHorizontal: 8,
                                               ...Platform.select({
                                                    ios: {
                                                         shadowColor: '#000',
                                                         shadowOffset: { width: 0, height: 6 },
                                                         shadowOpacity: 0.12,
                                                         shadowRadius: 16,
                                                    },
                                                    android: {
                                                         elevation: 10,
                                                    },
                                               }),
                                          },
                         })}
                    />
                    <Tab.Screen
                         name="Profile"
                         component={ProfileStack}
                         options={({ route }) => ({
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="person" color={color} focused={focused} />,
                              tabBarStyle:
                                   getFocusedRouteNameFromRoute(route) === 'EditProfileScreen' ||
                                   getFocusedRouteNameFromRoute(route) === 'ChangePasswordScreen' ||
                                   getFocusedRouteNameFromRoute(route) === 'SubscriptionManagment' ||
                                   getFocusedRouteNameFromRoute(route) === 'PrivacyPolicyScreen'
                                        ? { display: 'none' }
                                        : {
                                               position: 'absolute',
                                               left: 20,
                                               right: 20,
                                               bottom: insets.bottom + 12,
                                               height: 64,
                                               marginInline: 10,
                                               backgroundColor: '#FFFFFF',
                                               borderRadius: 32,
                                               borderTopWidth: 0,
                                               paddingHorizontal: 8,
                                               ...Platform.select({
                                                    ios: {
                                                         shadowColor: '#000',
                                                         shadowOffset: { width: 0, height: 6 },
                                                         shadowOpacity: 0.12,
                                                         shadowRadius: 16,
                                                    },
                                                    android: {
                                                         elevation: 10,
                                                    },
                                               }),
                                          },
                         })}
                    />
               </Tab.Navigator>
          </NavigationContainer>
     );
};

const styles = StyleSheet.create({
     iconContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 36,
          borderRadius: 18,
     },
     iconContainerActive: {
          backgroundColor: `${colors.PrimaryColor}15`,
     },
});

export default AgentTabs;
