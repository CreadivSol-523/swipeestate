import React, { JSX } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import colors from '../assests/color/color';
import ProfileScreen from '../screens/User/ProfileScreen';
import EditProfileScreen from '../screens/User/EditProfileScreen';
import ChangePasswordScreen from '../screens/User/ChangePasswordScreen';
import HomeScreen from '../screens/Agent/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListingScreen from '../screens/Agent/ListingScreen';
import SubscriptionManagment from '../screens/Subscription/SubscriptionManagment';
import ApartmentsScreen from '../screens/Agent/ApartmentsScreen';
import MatchDetail from '../screens/User/MatchDetail';
import Matches from '../screens/Agent/Matches';
import SingleApartment from '../screens/Agent/SingleApartment';
import AgentMatchDetail from '../screens/Agent/AgentMatchDetail';

const Tab = createBottomTabNavigator();
const ProfileStackNavigator = createStackNavigator();
const ListStackNavigator = createStackNavigator();
const HomeStackNavigator = createStackNavigator();
const MatchesStackNavigator = createStackNavigator();

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

// Custom Tab Bar Icon Component with animated background
const TabBarIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => {
     return (
          <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
               <Icon name={focused ? name : `${name}-outline`} size={24} color={color} />
               {focused && <View style={styles.activeDot} />}
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
                              height: 60 + insets.bottom + 4,
                              backgroundColor: '#FFFFFF',
                              borderTopWidth: 1,
                              borderTopColor: '#F0F0F0',
                              paddingBottom: 10,
                              paddingTop: 10,
                              ...Platform.select({
                                   ios: {
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: -2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                   },
                                   android: {
                                        elevation: 8,
                                   },
                              }),
                         },
                         tabBarLabelStyle: {
                              fontSize: 12,
                              fontWeight: '600',
                              marginTop: 4,
                         },
                         tabBarItemStyle: {
                              paddingVertical: 5,
                         },
                    }}
               >
                    <Tab.Screen
                         name="Home"
                         component={HomeStack}
                         options={{
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
                         }}
                    />
                    <Tab.Screen
                         name="Chat"
                         component={MatchesStack}
                         options={{
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="chatbubble" color={color} focused={focused} />,
                         }}
                         listeners={{
                              tabPress: e => {
                                   e.preventDefault();
                                   Alert.alert('Coming Soon', 'Chat feature coming soon');
                              },
                         }}
                    />
                    <Tab.Screen
                         name="Search"
                         component={HomeScreen}
                         options={{
                              tabBarIcon: ({ color, focused }) => (
                                   <View style={styles.searchIconContainer}>
                                        <Icon name="search" size={36} color="#FFFFFF" />
                                   </View>
                              ),
                              tabBarLabel: '',
                         }}
                         listeners={{
                              tabPress: e => {
                                   e.preventDefault();
                                   Alert.alert('Coming Soon', 'Search feature is under development');
                              },
                         }}
                    />
                    <Tab.Screen
                         name="Listing"
                         component={ListStack}
                         options={{
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="list" color={color} focused={focused} />,
                              tabBarBadgeStyle: {
                                   backgroundColor: '#EF4444',
                                   color: '#FFFFFF',
                                   fontSize: 10,
                                   fontWeight: 'bold',
                                   minWidth: 18,
                                   height: 18,
                                   borderRadius: 9,
                                   marginTop: 2,
                              },
                         }}
                    />
                    <Tab.Screen
                         name="Profile"
                         component={ProfileStack}
                         options={{
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="person" color={color} focused={focused} />,
                         }}
                    />
               </Tab.Navigator>
          </NavigationContainer>
     );
};

const styles = StyleSheet.create({
     iconContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          height: 40,
          borderRadius: 16,
     },
     iconContainerActive: {
          backgroundColor: `${colors.PrimaryColor}15`,
     },
     activeDot: {
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.PrimaryColor,
          marginTop: 4,
          position: 'absolute',
          bottom: -2,
     },
     searchIconContainer: {
          width: 70,
          height: 70,
          borderRadius: 70,
          backgroundColor: colors.PrimaryColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -20,
          ...Platform.select({
               ios: {
                    shadowColor: colors.PrimaryColor,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
               },
               android: {
                    elevation: 8,
               },
          }),
     },
});

export default AgentTabs;
