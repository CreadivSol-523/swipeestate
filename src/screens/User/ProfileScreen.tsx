import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/Features/authState';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
     const userData = useSelector((state: RootState) => state?.userData?.data);
     const dispatch = useDispatch();

     const handleLogout = () => {
          dispatch(logout());
     };

     const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
          <View style={styles.infoCard}>
               <View style={styles.infoIconContainer}>
                    <Icon name={icon} size={20} color={colors.PrimaryColor} />
               </View>
               <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
               </View>
          </View>
     );

     return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
               {/* Header */}
               <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                         <Icon name="settings-outline" size={24} color="#000" />
                    </TouchableOpacity>
               </View>

               {/* Profile Avatar Section */}
               <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                         <View style={styles.avatarCircle}>
                              <Icon name="person" size={50} color="#fff" />
                         </View>
                         <TouchableOpacity style={styles.editAvatarButton}>
                              <Icon name="camera" size={16} color="#fff" />
                         </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{userData?.name || 'User Name'}</Text>
                    <View style={styles.verifiedBadge}>
                         <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                         <Text style={styles.verifiedText}>Verified Account</Text>
                    </View>
               </View>

               {/* Information Cards */}
               <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.infoGrid}>
                         <InfoCard icon="person-outline" label="Full Name" value={userData?.name || 'N/A'} />
                         <InfoCard icon="call-outline" label="Phone Number" value={userData?.phone || '+92 300 1234567'} />
                         <InfoCard icon="mail-outline" label="Email Address" value={userData?.email || 'N/A'} />
                         <InfoCard icon="location-outline" label="City" value={userData?.city || 'Karachi'} />
                         <InfoCard icon="cash-outline" label="Monthly Income" value={userData?.income || 'PKR 50,000'} />
                    </View>
               </View>

               {/* Action Buttons */}
               <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfileScreen')}>
                         <View style={styles.actionIconContainer}>
                              <Icon name="create-outline" size={22} color={colors.PrimaryColor} />
                         </View>
                         <View style={styles.actionContent}>
                              <Text style={styles.actionTitle}>Edit Profile</Text>
                              <Text style={styles.actionSubtitle}>Update your personal information</Text>
                         </View>
                         <Icon name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ChangePasswordScreen')}>
                         <View style={styles.actionIconContainer}>
                              <Icon name="lock-closed-outline" size={22} color={colors.PrimaryColor} />
                         </View>
                         <View style={styles.actionContent}>
                              <Text style={styles.actionTitle}>Change Password</Text>
                              <Text style={styles.actionSubtitle}>Update your account password</Text>
                         </View>
                         <Icon name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                         <View style={styles.actionIconContainer}>
                              <Icon name="notifications-outline" size={22} color={colors.PrimaryColor} />
                         </View>
                         <View style={styles.actionContent}>
                              <Text style={styles.actionTitle}>Notifications</Text>
                              <Text style={styles.actionSubtitle}>Manage your notifications</Text>
                         </View>
                         <Icon name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                         <View style={styles.actionIconContainer}>
                              <Icon name="shield-checkmark-outline" size={22} color={colors.PrimaryColor} />
                         </View>
                         <View style={styles.actionContent}>
                              <Text style={styles.actionTitle}>Privacy & Security</Text>
                              <Text style={styles.actionSubtitle}>Control your privacy settings</Text>
                         </View>
                         <Icon name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
               </View>

               {/* Logout Button */}
               <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>Logout</Text>
               </TouchableOpacity>

               <View style={styles.bottomSpacing} />
          </ScrollView>
     );
};

export default ProfileScreen;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 20,
          backgroundColor: '#fff',
     },
     headerTitle: {
          fontSize: 28,
          fontFamily: Font.font500,
          color: '#000',
     },
     settingsButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
     },
     avatarSection: {
          alignItems: 'center',
          paddingVertical: 32,
          backgroundColor: '#fff',
          marginBottom: 16,
     },
     avatarContainer: {
          position: 'relative',
          marginBottom: 16,
     },
     avatarCircle: {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: colors.PrimaryColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: '#E3F2FD',
     },
     editAvatarButton: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.PrimaryColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: '#fff',
     },
     userName: {
          fontSize: 24,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 8,
     },
     verifiedBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#E8F5E9',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          gap: 4,
     },
     verifiedText: {
          fontSize: 12,
          fontFamily: Font.font500,
          color: '#4CAF50',
     },
     section: {
          paddingHorizontal: 24,
          marginBottom: 24,
     },
     sectionTitle: {
          fontSize: 18,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 16,
     },
     infoGrid: {
          gap: 12,
     },
     infoCard: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
     },
     infoIconContainer: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#E3F2FD',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
     },
     infoContent: {
          flex: 1,
     },
     infoLabel: {
          fontSize: 12,
          fontFamily: Font.font400,
          color: '#999',
          marginBottom: 4,
     },
     infoValue: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: '#000',
     },
     actionButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
     },
     actionIconContainer: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#E3F2FD',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
     },
     actionContent: {
          flex: 1,
     },
     actionTitle: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 2,
     },
     actionSubtitle: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#999',
     },
     logoutButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          marginHorizontal: 24,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#FF3B30',
          gap: 8,
     },
     logoutText: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#FF3B30',
     },
     bottomSpacing: {
          height: 100,
     },
});
