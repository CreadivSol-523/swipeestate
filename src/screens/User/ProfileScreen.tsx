import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import { useDeleteAccountHandler, useGetProfileHandler } from '../../models/Profile/Profile';
import { profileData } from '../../redux/Profile/ProfileTypes';
import { requestCameraPermission } from '../../utils/Permissions/Permissions';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useLogoutHandler } from '../../models/Auth/Auth';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
     const [deleteModalVisible, setDeleteModalVisible] = useState(false);

     const { handleNewPassword, isLoading: LogoutLoading } = useLogoutHandler();
     const { handleDeleteAccountAPI, isLoading: DeleteLoading } = useDeleteAccountHandler();

     const handleLogout = () => {
          handleNewPassword();
     };

     const { ProfileData, ProfileLoading } = useGetProfileHandler();
     const ProfileDetails: profileData | undefined = ProfileData;
     console.log({ ProfileDetails, ProfileLoading });

     console.log(ProfileData);

     const handleImagePicker = async () => {
          await requestCameraPermission();
          Alert.alert(
               'Select Profile Picture',
               'Choose an option',
               [
                    {
                         text: 'Take Photo',
                         onPress: () => openCamera(),
                    },
                    {
                         text: 'Choose from Gallery',
                         onPress: () => openGallery(),
                    },
                    {
                         text: 'Cancel',
                         style: 'cancel',
                    },
               ],
               { cancelable: true },
          );
     };

     const openCamera = () => {
          launchCamera(
               {
                    mediaType: 'photo',
                    cameraType: 'front',
                    quality: 0.8,
                    maxWidth: 500,
                    maxHeight: 500,
               },
               handleImageResponse,
          );
     };

     const openGallery = () => {
          launchImageLibrary(
               {
                    mediaType: 'photo',
                    quality: 0.8,
                    maxWidth: 500,
                    maxHeight: 500,
               },
               handleImageResponse,
          );
     };

     const handleImageResponse = (response: ImagePickerResponse) => {
          if (response.didCancel) {
               console.log('User cancelled image picker');
          } else if (response.errorCode) {
               console.log('ImagePicker Error: ', response.errorMessage);
               Alert.alert('Error', 'Failed to pick image');
          } else if (response.assets && response.assets[0].uri) {
               console.log('profilePicture', response.assets[0].uri);
          }
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

     const handleConfirmDelete = async () => {
          await handleDeleteAccountAPI();
          setDeleteModalVisible(false);
     };

     return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
               {/* Header */}
               <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    {/* <TouchableOpacity style={styles.settingsButton}>
                         <Icon name="settings-outline" size={24} color="#000" />
                    </TouchableOpacity> */}
               </View>

               {/* Profile Avatar Section */}
               <View style={styles.avatarSection}>
                    <View style={styles.profileImageContainer}>
                         <TouchableOpacity style={styles.profileImageWrapper} onPress={handleImagePicker} activeOpacity={0.7}>
                              {ProfileData?.profilePicture ? (
                                   <Image source={{ uri: ProfileData?.profilePicture }} style={styles.profileImage} />
                              ) : (
                                   <View style={styles.profileImagePlaceholder}>
                                        <Icon name="user" size={40} color="#9CA3AF" />
                                   </View>
                              )}
                              <View style={styles.cameraIconContainer}>
                                   <Icon name="camera" size={16} color="#FFFFFF" />
                              </View>
                         </TouchableOpacity>
                         <Text style={styles.profileImageText}>Upload Profile Picture</Text>
                    </View>
                    <Text style={styles.userName}>{ProfileData?.name || 'User Name'}</Text>
                    <View style={styles.verifiedBadge}>
                         <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                         <Text style={styles.verifiedText}>Verified Account</Text>
                    </View>
               </View>

               {/* Information Cards */}
               <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.infoGrid}>
                         <InfoCard icon="person-outline" label="Full Name" value={ProfileData?.name || 'N/A'} />
                         <InfoCard icon="call-outline" label="Phone Number" value={ProfileData?.phone || '+92 300 1234567'} />
                         <InfoCard icon="mail-outline" label="Email Address" value={ProfileData?.email || 'N/A'} />
                         <InfoCard icon="location-outline" label="City" value={ProfileData?.address || 'Karachi'} />
                         <InfoCard icon="cash-outline" label="Monthly Income" value={ProfileData?.selectedIncome || 'USD 50,000'} />
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

                    <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SubscriptionManagment')}>
                         <View style={styles.actionIconContainer}>
                              <Icon name="card-outline" size={22} color={colors.PrimaryColor} />
                         </View>
                         <View style={styles.actionContent}>
                              <Text style={styles.actionTitle}>Subscription</Text>
                              <Text style={styles.actionSubtitle}>Manage your Subscription</Text>
                         </View>
                         <Icon name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteActionButton} onPress={() => setDeleteModalVisible(true)} disabled={DeleteLoading}>
                         <View style={styles.deleteActionIconContainer}>
                              <Icon name="trash-outline" size={22} color="#D32F2F" />
                         </View>
                         <View style={styles.actionContent}>
                              <Text style={styles.deleteActionTitle}>Delete Account</Text>
                              <Text style={styles.actionSubtitle}>Permanently remove your account and related data</Text>
                         </View>
                         {DeleteLoading ? <ActivityIndicator color="#D32F2F" /> : <Icon name="chevron-forward" size={20} color="#999" />}
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.actionButton}>
                         <View style={styles.actionIconContainer}>
                              <Icon name="shield-checkmark-outline" size={22} color={colors.PrimaryColor} />
                         </View>
                         <View style={styles.actionContent}>
                              <Text style={styles.actionTitle}>Privacy & Security</Text>
                              <Text style={styles.actionSubtitle}>Control your privacy settings</Text>
                         </View>
                         <Icon name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity> */}
               </View>

               {/* Logout Button */}
               <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={LogoutLoading}>
                    {LogoutLoading ? (
                         <ActivityIndicator color="#FF3B30" />
                    ) : (
                         <>
                              <Icon name="log-out-outline" size={24} color="#FF3B30" />
                              <Text style={styles.logoutText}>Logout</Text>
                         </>
                    )}
               </TouchableOpacity>

               <Modal visible={deleteModalVisible} transparent animationType="fade" onRequestClose={() => setDeleteModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                         <View style={styles.modalCard}>
                              <View style={styles.modalHeaderIcon}>
                                   <Icon name="warning-outline" size={24} color="#D32F2F" />
                              </View>
                              <Text style={styles.modalTitle}>Delete account?</Text>
                              <Text style={styles.modalDescription}>
                                   This action is permanent and cannot be undone. Your profile, subscriptions, listings and matches will be removed.
                              </Text>
                              <View style={styles.modalActions}>
                                   <TouchableOpacity style={styles.modalCancelButton} onPress={() => setDeleteModalVisible(false)} disabled={DeleteLoading}>
                                        <Text style={styles.modalCancelText}>Cancel</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={styles.modalDeleteButton} onPress={handleConfirmDelete} disabled={DeleteLoading}>
                                        {DeleteLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalDeleteText}>Delete</Text>}
                                   </TouchableOpacity>
                              </View>
                         </View>
                    </View>
               </Modal>

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
          paddingTop: 10,
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
     profileImageContainer: {
          alignItems: 'center',
          marginBottom: 24,
     },
     profileImageWrapper: {
          position: 'relative',
          marginBottom: 8,
     },
     profileImage: {
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 3,
          borderColor: '#0EA5E9',
     },
     profileImagePlaceholder: {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#F3F4F6',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#E5E7EB',
          borderStyle: 'dashed',
     },
     cameraIconContainer: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: '#0EA5E9',
          width: 32,
          height: 32,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 3,
          borderColor: '#FFFFFF',
     },
     profileImageText: {
          fontSize: 13,
          color: '#6B7280',
          fontWeight: '500',
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
     deleteActionButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFF5F5',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#FAD4D4',
     },
     deleteActionIconContainer: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#FFECEC',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
     },
     deleteActionTitle: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#D32F2F',
          marginBottom: 2,
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
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
     },
     modalCard: {
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 20,
     },
     modalHeaderIcon: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#FFECEC',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginBottom: 12,
     },
     modalTitle: {
          fontSize: 20,
          fontFamily: Font.font500,
          textAlign: 'center',
          color: '#111827',
          marginBottom: 8,
     },
     modalDescription: {
          fontSize: 14,
          fontFamily: Font.font400,
          textAlign: 'center',
          color: '#6B7280',
          lineHeight: 20,
          marginBottom: 20,
     },
     modalActions: {
          flexDirection: 'row',
          gap: 10,
     },
     modalCancelButton: {
          flex: 1,
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
     },
     modalCancelText: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: '#374151',
     },
     modalDeleteButton: {
          flex: 1,
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#D32F2F',
     },
     modalDeleteText: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: '#fff',
     },
});
