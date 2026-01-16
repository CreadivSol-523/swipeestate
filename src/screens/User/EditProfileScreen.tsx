import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { authUser } from '../../redux/Features/authState';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
     const userData = useSelector((state: RootState) => state?.userData?.data);
     const [data, setData] = useState({
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          city: userData?.city || '',
          income: userData?.income || '',
     });
     const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState<{ [key: string]: string }>({});
     const [focusedField, setFocusedField] = useState('');
     const dispatch = useDispatch();

     const validateForm = () => {
          const newErrors: { [key: string]: string } = {};

          if (!data.name.trim()) {
               newErrors.name = 'Name is required';
          } else if (data.name.trim().length < 3) {
               newErrors.name = 'Name must be at least 3 characters';
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!data.email.trim()) {
               newErrors.email = 'Email is required';
          } else if (!emailRegex.test(data.email)) {
               newErrors.email = 'Please enter a valid email';
          }

          const phoneRegex = /^[\d\s\+\-\(\)]+$/;
          if (!data.phone.trim()) {
               newErrors.phone = 'Phone number is required';
          } else if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
               newErrors.phone = 'Please enter a valid phone number';
          }

          if (!data.city.trim()) {
               newErrors.city = 'City is required';
          }

          if (!data.income.trim()) {
               newErrors.income = 'Income is required';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleSave = () => {
          if (!validateForm()) {
               return;
          }

          setLoading(true);

          setTimeout(() => {
               dispatch(authUser({ data: data }));
               setLoading(false);
               navigation.goBack();
          }, 1500);
     };

     // const InputField = ({
     //      icon,
     //      label,
     //      placeholder,
     //      value,
     //      onChangeText,
     //      keyboardType = 'default',
     //      fieldName,
     // }: {
     //      icon: string;
     //      label: string;
     //      placeholder: string;
     //      value: string;
     //      onChangeText: (text: string) => void;
     //      keyboardType?: any;
     //      fieldName: string;
     // }) => (
     //      <View style={styles.inputContainer}>
     //           <Text style={styles.label}>{label}</Text>
     //           <View style={[styles.inputWrapper, focusedField === fieldName && styles.inputWrapperFocused, errors[fieldName] && styles.inputWrapperError]}>
     //                <View style={styles.inputIconContainer}>
     //                     <Icon name={icon} size={20} color={errors[fieldName] ? '#FF3B30' : colors.PrimaryColor} />
     //                </View>
     //                <TextInput
     //                     style={styles.input}
     //                     placeholder={placeholder}
     //                     placeholderTextColor="#999"
     //                     value={value}
     //                     onChangeText={text => {
     //                          onChangeText(text);
     //                          if (errors[fieldName]) {
     //                               setErrors({ ...errors, [fieldName]: '' });
     //                          }
     //                     }}
     //                     onFocus={() => setFocusedField(fieldName)}
     //                     onBlur={() => setFocusedField('')}
     //                     keyboardType={keyboardType}
     //                     autoCapitalize={fieldName === 'email' ? 'none' : 'words'}
     //                />
     //                {errors[fieldName] && <Icon name="alert-circle" size={20} color="#FF3B30" style={styles.errorIcon} />}
     //           </View>
     //           {errors[fieldName] && (
     //                <View style={styles.errorContainer}>
     //                     <Text style={styles.errorText}>{errors[fieldName]}</Text>
     //                </View>
     //           )}
     //      </View>
     // );

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
                         <View style={styles.avatarContainer}>
                              <View style={styles.avatarCircle}>
                                   <Icon name="person" size={40} color="#fff" />
                              </View>
                              <TouchableOpacity style={styles.editAvatarButton}>
                                   <Icon name="camera" size={16} color="#fff" />
                              </TouchableOpacity>
                         </View>
                         <Text style={styles.avatarText}>Change Profile Picture</Text>
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
                         />

                         <FieldWrapper icon="city" label="City" placeholder="Enter your city" value={data.city} onChangeText={text => setData({ ...data, city: text })} fieldType="text" />

                         <FieldWrapper icon="dollar" label="Monthly Income" placeholder="PKR 50,000" value={data.income} onChangeText={text => setData({ ...data, income: text })} fieldType="number" />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionSection}>
                         <TouchableOpacity style={[styles.saveButton, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading} activeOpacity={0.8}>
                              {loading ? (
                                   <ActivityIndicator color="#fff" />
                              ) : (
                                   <>
                                        <Icon name="checkmark-circle-outline" size={24} color="#fff" />
                                        <Text style={styles.saveButtonText}>Save Changes</Text>
                                   </>
                              )}
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
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
          marginBottom: 12,
     },
     avatarCircle: {
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: colors.PrimaryColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: '#E3F2FD',
     },
     editAvatarButton: {
          position: 'absolute',
          right: -4,
          bottom: -4,
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: '#4CAF50',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: '#fff',
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
