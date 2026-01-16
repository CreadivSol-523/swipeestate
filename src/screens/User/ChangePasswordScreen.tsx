import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

const ChangePasswordScreen = ({ navigation }: { navigation: any }) => {
     const [data, setData] = useState({
          oldPassword: '',
          newPassword: '',
          reenterNewPassword: '',
     });
     const [showPassword, setShowPassword] = useState({
          old: false,
          new: false,
          reenter: false,
     });
     const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState<{ [key: string]: string }>({});
     const [focusedField, setFocusedField] = useState('');
     const [passwordStrength, setPasswordStrength] = useState(0);

     const calculatePasswordStrength = (password: string) => {
          let strength = 0;
          if (password.length >= 6) strength++;
          if (password.length >= 8) strength++;
          if (/[A-Z]/.test(password)) strength++;
          if (/[0-9]/.test(password)) strength++;
          if (/[^A-Za-z0-9]/.test(password)) strength++;
          return strength;
     };

     const getStrengthColor = () => {
          if (passwordStrength <= 1) return '#FF3B30';
          if (passwordStrength <= 3) return '#FF9500';
          return '#4CAF50';
     };

     const getStrengthText = () => {
          if (passwordStrength <= 1) return 'Weak';
          if (passwordStrength <= 3) return 'Medium';
          return 'Strong';
     };

     const validateForm = () => {
          const newErrors: { [key: string]: string } = {};

          if (!data.oldPassword.trim()) {
               newErrors.oldPassword = 'Old password is required';
          }

          if (!data.newPassword.trim()) {
               newErrors.newPassword = 'New password is required';
          } else if (data.newPassword.length < 6) {
               newErrors.newPassword = 'Password must be at least 6 characters';
          }

          if (!data.reenterNewPassword.trim()) {
               newErrors.reenterNewPassword = 'Please confirm your password';
          } else if (data.newPassword !== data.reenterNewPassword) {
               newErrors.reenterNewPassword = 'Passwords do not match';
          }

          if (data.oldPassword === data.newPassword && data.oldPassword) {
               newErrors.newPassword = 'New password must be different from old password';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleChangePassword = () => {
          if (!validateForm()) {
               return;
          }

          setLoading(true);

          setTimeout(() => {
               setLoading(false);
               navigation.goBack();
          }, 1500);
     };

     const PasswordInput = ({
          icon,
          label,
          placeholder,
          value,
          onChangeText,
          fieldName,
          showKey,
     }: {
          icon: string;
          label: string;
          placeholder: string;
          value: string;
          onChangeText: (text: string) => void;
          fieldName: string;
          showKey: 'old' | 'new' | 'reenter';
     }) => (
          <View style={styles.inputContainer}>
               <Text style={styles.label}>{label}</Text>
               <View style={[styles.inputWrapper, focusedField === fieldName && styles.inputWrapperFocused, errors[fieldName] && styles.inputWrapperError]}>
                    <View style={styles.inputIconContainer}>
                         <Icon name={icon} size={20} color={errors[fieldName] ? '#FF3B30' : colors.PrimaryColor} />
                    </View>
                    <TextInput
                         style={styles.input}
                         placeholder={placeholder}
                         placeholderTextColor="#999"
                         value={value}
                         onChangeText={text => {
                              onChangeText(text);
                              if (errors[fieldName]) {
                                   setErrors({ ...errors, [fieldName]: '' });
                              }
                              if (fieldName === 'newPassword') {
                                   setPasswordStrength(calculatePasswordStrength(text));
                              }
                         }}
                         onFocus={() => setFocusedField(fieldName)}
                         onBlur={() => setFocusedField('')}
                         secureTextEntry={!showPassword[showKey]}
                    />
                    <TouchableOpacity onPress={() => setShowPassword({ ...showPassword, [showKey]: !showPassword[showKey] })} style={styles.eyeButton}>
                         <Icon name={showPassword[showKey] ? 'eye-outline' : 'eye-off-outline'} size={22} color="#999" />
                    </TouchableOpacity>
               </View>
               {errors[fieldName] && (
                    <View style={styles.errorContainer}>
                         <Icon name="alert-circle" size={16} color="#FF3B30" />
                         <Text style={styles.errorText}>{errors[fieldName]}</Text>
                    </View>
               )}
          </View>
     );

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                         <Icon name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <View style={styles.placeholder} />
               </View>

               <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {/* Security Icon */}
                    <View style={styles.securitySection}>
                         <View style={styles.securityIconContainer}>
                              <Icon name="shield-checkmark" size={48} color={colors.PrimaryColor} />
                         </View>
                         <Text style={styles.securityTitle}>Secure Your Account</Text>
                         <Text style={styles.securitySubtitle}>Choose a strong password to keep your account safe</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                         <PasswordInput
                              icon="lock-closed-outline"
                              label="Current Password"
                              placeholder="Enter your current password"
                              value={data.oldPassword}
                              onChangeText={text => setData({ ...data, oldPassword: text })}
                              fieldName="oldPassword"
                              showKey="old"
                         />

                         <PasswordInput
                              icon="key-outline"
                              label="New Password"
                              placeholder="Enter your new password"
                              value={data.newPassword}
                              onChangeText={text => setData({ ...data, newPassword: text })}
                              fieldName="newPassword"
                              showKey="new"
                         />

                         {/* Password Strength Indicator */}
                         {data.newPassword.length > 0 && (
                              <View style={styles.strengthContainer}>
                                   <View style={styles.strengthBar}>
                                        <View style={[styles.strengthFill, { width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getStrengthColor() }]} />
                                   </View>
                                   <Text style={[styles.strengthText, { color: getStrengthColor() }]}>{getStrengthText()}</Text>
                              </View>
                         )}

                         <PasswordInput
                              icon="checkmark-circle-outline"
                              label="Confirm New Password"
                              placeholder="Re-enter your new password"
                              value={data.reenterNewPassword}
                              onChangeText={text => setData({ ...data, reenterNewPassword: text })}
                              fieldName="reenterNewPassword"
                              showKey="reenter"
                         />

                         {/* Password Requirements */}
                         <View style={styles.requirementsContainer}>
                              <Text style={styles.requirementsTitle}>Password must contain:</Text>
                              <View style={styles.requirementRow}>
                                   <Icon name={data.newPassword.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={data.newPassword.length >= 6 ? '#4CAF50' : '#999'} />
                                   <Text style={styles.requirementText}>At least 6 characters</Text>
                              </View>
                              <View style={styles.requirementRow}>
                                   <Icon name={/[A-Z]/.test(data.newPassword) ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={/[A-Z]/.test(data.newPassword) ? '#4CAF50' : '#999'} />
                                   <Text style={styles.requirementText}>One uppercase letter</Text>
                              </View>
                              <View style={styles.requirementRow}>
                                   <Icon name={/[0-9]/.test(data.newPassword) ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={/[0-9]/.test(data.newPassword) ? '#4CAF50' : '#999'} />
                                   <Text style={styles.requirementText}>One number</Text>
                              </View>
                              <View style={styles.requirementRow}>
                                   <Icon
                                        name={/[^A-Za-z0-9]/.test(data.newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={18}
                                        color={/[^A-Za-z0-9]/.test(data.newPassword) ? '#4CAF50' : '#999'}
                                   />
                                   <Text style={styles.requirementText}>One special character</Text>
                              </View>
                         </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionSection}>
                         <TouchableOpacity style={[styles.changeButton, loading && styles.buttonDisabled]} onPress={handleChangePassword} disabled={loading} activeOpacity={0.8}>
                              {loading ? (
                                   <ActivityIndicator color="#fff" />
                              ) : (
                                   <>
                                        <Icon name="shield-checkmark-outline" size={24} color="#fff" />
                                        <Text style={styles.changeButtonText}>Update Password</Text>
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

export default ChangePasswordScreen;

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
          paddingTop: 60,
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
     securitySection: {
          alignItems: 'center',
          paddingVertical: 32,
          backgroundColor: '#fff',
          marginBottom: 16,
     },
     securityIconContainer: {
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: '#E3F2FD',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
     },
     securityTitle: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 8,
     },
     securitySubtitle: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#999',
          textAlign: 'center',
          paddingHorizontal: 40,
     },
     formSection: {
          paddingHorizontal: 24,
          paddingTop: 24,
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
     eyeButton: {
          padding: 4,
          marginLeft: 8,
     },
     errorContainer: {
          marginTop: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
     },
     errorText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#FF3B30',
     },
     strengthContainer: {
          marginBottom: 20,
     },
     strengthBar: {
          height: 6,
          backgroundColor: '#E0E0E0',
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 8,
     },
     strengthFill: {
          height: '100%',
          borderRadius: 3,
          transition: 'width 0.3s ease',
     },
     strengthText: {
          fontSize: 13,
          fontFamily: Font.font500,
          textAlign: 'right',
     },
     requirementsContainer: {
          backgroundColor: '#F0F7FF',
          padding: 16,
          borderRadius: 12,
          marginBottom: 24,
     },
     requirementsTitle: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 12,
     },
     requirementRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8,
     },
     requirementText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#666',
     },
     actionSection: {
          paddingHorizontal: 24,
          paddingTop: 8,
     },
     changeButton: {
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
     changeButtonText: {
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
