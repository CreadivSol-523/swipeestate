import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { authUser } from '../../redux/Features/authState';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import { useAuth } from '../../utils/Storage/Storage';
import CustomDropdown, { DropdownOption } from '../../components/CustomDropdown/CustomDropdown';
import { requestCameraPermission } from '../../utils/Permissions/Permissions';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useGetProfileHandler, useUpdateProfileHandler } from '../../models/Profile/Profile';
import { profileData } from '../../redux/Profile/ProfileTypes';

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
     const [data, setData] = useState({
          name: '',
          email: '',
          phone: '',
          address: '',
          selectedIncome: '',
          creditScore: '',
          profilePicture: '',
     });
     const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState<{ [key: string]: string }>({});
     const dispatch = useDispatch();

     const { ProfileData, ProfileLoading } = useGetProfileHandler();
     const userData: profileData | undefined = ProfileData;

     console.log(ProfileData, 'ProfileDataProfileDataProfileDataProfileData');

     const incomeRanges: DropdownOption[] = [
          { label: 'Under $25,000', value: '0-25000' },
          { label: '$25,000 - $50,000', value: '25000-50000' },
          { label: '$50,000 - $75,000', value: '50000-75000' },
          { label: '$75,000 - $1,00,000', value: '75000-100000' },
          { label: '$1,00,000 - $1,50,000', value: '100000-150000' },
          { label: '$1,50,000 - $2,00,000', value: '150000-200000' },
          { label: '$2,00,000 - $3,00,000', value: '200000-300000' },
          { label: 'Above $3,00,000', value: '300000+' },
     ];

     const creditScoreRanges: DropdownOption[] = [
          { label: 'Poor (300-579)', value: '300-579' },
          { label: 'Fair (580-669)', value: '580-669' },
          { label: 'Good (670-739)', value: '670-739' },
          { label: 'Very Good (740-799)', value: '740-799' },
          { label: 'Excellent (800-850)', value: '800-850' },
     ];

     const { handleUpdateProfileAPI, isLoading } = useUpdateProfileHandler();

     const handleSave = () => {
          handleUpdateProfileAPI(data);
     };

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
               setData({ ...data, profilePicture: response.assets[0].uri });
          }
     };

     useEffect(() => {
          setData({
               name: userData?.name || '',
               email: userData?.email || '',
               creditScore: userData?.creditScore || '',
               address: userData?.address || '',
               phone: userData?.phone || '',
               profilePicture: userData?.profilePicture || '',
               selectedIncome: userData?.selectedIncome || '',
          });
     }, [userData]);

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                         <Icon name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={styles.placeholder} />
               </View>

               <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                         <View style={styles.profileImageContainer}>
                              <TouchableOpacity style={styles.profileImageWrapper} onPress={handleImagePicker} activeOpacity={0.7}>
                                   {data?.profilePicture ? (
                                        data?.profilePicture?.split('/')?.includes('uploads') ? (
                                             <Image source={{ uri: data?.profilePicture }} style={styles.profileImage} />
                                        ) : (
                                             <Image src={data?.profilePicture} style={styles.profileImage} />
                                        )
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
                         <Text style={styles.userName}>{data?.name || 'User Name'}</Text>
                         <View style={styles.verifiedBadge}>
                              <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                              <Text style={styles.verifiedText}>Verified Account</Text>
                         </View>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                         <Text style={styles.sectionTitle}>Personal Information</Text>

                         <FieldWrapper icon="user" label="Full Name" placeholder="Enter your full name" value={data.name} onChangeText={text => setData({ ...data, name: text })} fieldType="text" />

                         <FieldWrapper icon="call" label="Phone Number" placeholder="+92 300 1234567" value={data.phone} onChangeText={text => setData({ ...data, phone: text })} fieldType="phone" />

                         <FieldWrapper
                              icon="mail"
                              label="Email Address"
                              placeholder="example@email.com"
                              value={data.email}
                              onChangeText={text => setData({ ...data, email: text })}
                              fieldType="email"
                              disable
                         />

                         <FieldWrapper icon="city" label="Address" placeholder="Enter your Address" value={data.address} onChangeText={text => setData({ ...data, address: text })} fieldType="text" />

                         <CustomDropdown
                              label="Income Range"
                              placeholder={data.selectedIncome || 'Select your income range'}
                              value={data.selectedIncome}
                              onValueChange={(value, label) => {
                                   setData({ ...data, selectedIncome: value });
                              }}
                              options={incomeRanges}
                              iconName="income"
                              iconSize={18}
                              iconColor="#9CA3AF"
                         />
                         <CustomDropdown
                              label="Credit Score"
                              placeholder={data.creditScore || 'Select your Credit Score'}
                              value={data.creditScore}
                              onValueChange={text => setData({ ...data, creditScore: text })}
                              options={creditScoreRanges}
                              iconName="credit"
                              iconSize={18}
                              iconColor="#9CA3AF"
                         />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionSection}>
                         <TouchableOpacity style={[styles.saveButton, isLoading && styles.buttonDisabled]} onPress={handleSave} disabled={isLoading} activeOpacity={0.8}>
                              {isLoading ? (
                                   <ActivityIndicator color="#fff" />
                              ) : (
                                   <>
                                        <Icon name="checkmark-circle-outline" size={24} color="#fff" />
                                        <Text style={styles.saveButtonText}>Save Changes</Text>
                                   </>
                              )}
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isLoading}>
                              <Text style={styles.cancelButtonText}>Cancel</Text>
                         </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSpacing} />
               </ScrollView>
          </KeyboardAvoidingView>
     );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 16,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
     },
     backButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
     },
     headerTitle: {
          fontSize: 20,
          fontFamily: Font.font500,
          color: '#000',
     },
     placeholder: {
          width: 40,
     },
     scrollView: {
          flex: 1,
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

     avatarText: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     formSection: {
          paddingHorizontal: 24,
          paddingTop: 24,
     },
     sectionTitle: {
          fontSize: 18,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 20,
     },
     inputContainer: {
          marginBottom: 20,
     },
     label: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 8,
     },
     inputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#E0E0E0',
          paddingHorizontal: 16,
          height: 56,
     },
     inputWrapperFocused: {
          borderColor: colors.PrimaryColor,
          backgroundColor: '#F0F7FF',
     },
     inputWrapperError: {
          borderColor: '#FF3B30',
          backgroundColor: '#FFF5F5',
     },
     inputIconContainer: {
          marginRight: 12,
     },
     input: {
          flex: 1,
          fontSize: 16,
          fontFamily: Font.font400,
          color: '#000',
          paddingVertical: 0,
     },
     errorIcon: {
          marginLeft: 8,
     },
     errorContainer: {
          marginTop: 6,
          flexDirection: 'row',
          alignItems: 'center',
     },
     errorText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#FF3B30',
     },
     actionSection: {
          paddingHorizontal: 24,
          paddingTop: 16,
     },
     saveButton: {
          height: 56,
          backgroundColor: colors.PrimaryColor,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 12,
          shadowColor: colors.PrimaryColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
     },
     buttonDisabled: {
          opacity: 0.6,
     },
     saveButtonText: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#fff',
     },
     cancelButton: {
          height: 56,
          backgroundColor: '#fff',
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: '#E0E0E0',
     },
     cancelButtonText: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#666',
     },
     bottomSpacing: {
          height: 40,
     },
});
