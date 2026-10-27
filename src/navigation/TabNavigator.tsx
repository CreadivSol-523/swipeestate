import React, { JSX } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import colors from '../assests/color/color';
import ProfileScreen from '../screens/User/ProfileScreen';
import EditProfileScreen from '../screens/User/EditProfileScreen';
import ChangePasswordScreen from '../screens/User/ChangePasswordScreen';
import HomeScreen from '../screens/User/HomeScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicy/PrivacyPolicyScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SubscriptionManagment from '../screens/Subscription/SubscriptionManagment';
import MatchApartments from '../screens/User/MatchApartments';
import MatchDetail from '../screens/User/MatchDetail';
import SelectIAPPlanScreen from '../screens/Auth/SelectIAPPlanScreen';
import ManageIAPSubs from '../screens/User/ManageIAPPlanScreen';

const Tab = createBottomTabNavigator();
const ProfileStackNavigator = createStackNavigator();
const HomeStackNavigator = createStackNavigator();
const MatchStackNavigator = createStackNavigator();

const ProfileStack = (): JSX.Element => {
     return (
          <ProfileStackNavigator.Navigator screenOptions={{ headerShown: false }}>
               <ProfileStackNavigator.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="SubscriptionManagment" component={SubscriptionManagment} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="ManageIAPSubs" component={ManageIAPSubs} options={{ headerShown: false }} />
               <ProfileStackNavigator.Screen name="SelectIAPPlanScreen" component={SelectIAPPlanScreen} options={{ headerShown: false }} />
          </ProfileStackNavigator.Navigator>
     );
};

const HomeStack = (): JSX.Element => {
     return (
          <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
               <HomeStackNavigator.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
               <HomeStackNavigator.Screen name="SubscriptionManagment" component={SubscriptionManagment} options={{ headerShown: false }} />
          </HomeStackNavigator.Navigator>
     );
};

const MatchStack = (): JSX.Element => {
     return (
          <MatchStackNavigator.Navigator screenOptions={{ headerShown: false }}>
               <MatchStackNavigator.Screen name="MatchScreen" component={MatchApartments} options={{ headerShown: false }} />
               <MatchStackNavigator.Screen name="MatchDetail" component={MatchDetail} options={{ headerShown: false }} />
          </MatchStackNavigator.Navigator>
     );
};

// Lightweight placeholder for tabs that are "coming soon" — avoids ever
// mounting a heavy real screen (with API calls) behind a blocked tab.
const ComingSoonPlaceholder = (): JSX.Element => (
     <View style={styles.placeholder}>
          <Icon name="construct-outline" size={28} color="#C4C4C4" />
          <Text style={styles.placeholderText}>Coming soon</Text>
     </View>
);

// Custom Tab Bar Icon Component with animated background
const TabBarIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => {
     return (
          <View style={[styles.iconContainer]}>
               <Icon name={focused ? name : `${name}-outline`} size={28} color={color} />
               {focused && <View style={styles.activeDot} />}
          </View>
     );
};

const TabNavigation = (): JSX.Element => {
     const insets = useSafeAreaInsets();

     return (
          <NavigationContainer>
               <Tab.Navigator
                    screenOptions={{
                         headerShown: false,
                         tabBarActiveTintColor: colors.PrimaryColor,
                         tabBarInactiveTintColor: '#9CA3AF',
                         tabBarStyle: {
                              height: 60 + insets.bottom + 10,
                              backgroundColor: '#FFFFFF',
                              borderTopWidth: 1,
                              borderTopColor: '#F0F0F0',
                              paddingBottom: 10,
                              paddingTop: 10,
                              overflow: 'visible',
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
                              fontSize: 14,
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
                    {/* <Tab.Screen
                         name="Favorites"
                         component={ComingSoonPlaceholder}
                         options={{
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="heart" color={color} focused={focused} />,
                         }}
                         listeners={{
                              tabPress: e => {
                                   e.preventDefault();
                                   Alert.alert('Coming Soon', 'Favorites feature is under development');
                              },
                         }}
                    /> */}
                    <Tab.Screen
                         name="Matches"
                         component={MatchStack}
                         options={{
                              // was "home" — duplicated the Home tab's icon
                              tabBarIcon: ({ color, focused }) => <TabBarIcon name="chatbubbles" color={color} focused={focused} />,
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
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.PrimaryColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -18,
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
     placeholder: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F9FA',
          gap: 8,
     },
     placeholderText: {
          fontSize: 14,
          color: '#9CA3AF',
     },
});

export default TabNavigation;
