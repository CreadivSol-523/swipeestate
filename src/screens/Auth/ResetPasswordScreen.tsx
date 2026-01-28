import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import CustomLogo from '../../components/CustomLogo/CustomLogo';
import Icon from '../../components/Icons/Icons';
import { useNewPasswordHandler } from '../../models/Auth/Auth';

const ResetPasswordScreen = ({ navigation, route }: { navigation?: any; route?: any }) => {
     const [data, setData] = useState({ newPassword: '', reenterNewPassword: '' });
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');
     const [showPassword, setShowPassword] = useState(false);

     const { newPassword, reenterNewPassword } = data;
     const { identifier, otp } = route.params;

     const handleFields = (name: string, value: any) => {
          setData(prev => ({
               ...prev,
               [name]: value,
          }));
     };
     const { handleNewPassword, isLoading } = useNewPasswordHandler();

     const handleResetPassword = () => {
          handleNewPassword({
               email: identifier,
               otp,
               newPassword: data?.newPassword,
               reNewPassword: data?.reenterNewPassword,
          });
     };

     return (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
               {/* Logo Section */}
               <View style={styles.logoContainer}>
                    <CustomLogo />
                    <Text style={styles.title}>Swipe Estate</Text>
                    <Text style={styles.subtitle}>WHERE DREAMS COME TRUE</Text>
               </View>

               {/* Login Form */}
               <View style={styles.formContainer}>
                    <Text style={styles.welcomeText}>Reset Password!</Text>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                         <Text style={styles.label}>Password</Text>
                         <View style={styles.inputWrapper}>
                              <View style={styles.inputIconContainer}>
                                   <Icon name="lock" size={18} color="#9CA3AF" />
                              </View>
                              <TextInput
                                   style={styles.input}
                                   placeholder="Enter your password"
                                   placeholderTextColor="#9CA3AF"
                                   value={newPassword}
                                   onChangeText={value => handleFields('newPassword', value)}
                                   secureTextEntry={!showPassword}
                                   autoCapitalize="none"
                              />
                              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                                   <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} color="#9CA3AF" />
                              </TouchableOpacity>
                         </View>
                    </View>

                    {/* Comfirm Password Input */}
                    <View style={styles.inputGroup}>
                         <Text style={styles.label}>Password</Text>
                         <View style={styles.inputWrapper}>
                              <View style={styles.inputIconContainer}>
                                   <Icon name="lock" size={18} color="#9CA3AF" />
                              </View>
                              <TextInput
                                   style={styles.input}
                                   placeholder="Enter your password"
                                   placeholderTextColor="#9CA3AF"
                                   value={reenterNewPassword}
                                   onChangeText={value => handleFields('reenterNewPassword', value)}
                                   secureTextEntry={!showPassword}
                                   autoCapitalize="none"
                              />
                              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                                   <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} color="#9CA3AF" />
                              </TouchableOpacity>
                         </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword} activeOpacity={0.8} disabled={isLoading}>
                         {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Reset Password</Text>}
                    </TouchableOpacity>
               </View>

               {/* Footer */}
               <Text style={styles.footer}>© 2026 Swipe Estate. All rights reserved.</Text>
          </ScrollView>
     );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
     scrollContent: {
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 20,
          backgroundColor: '#fff',
     },
     logoContainer: {
          alignItems: 'center',
          marginBottom: 40,
     },

     title: {
          fontSize: 36,
          fontWeight: 'bold',
          color: colors.textBlue,
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 16,
          color: colors.textColor,
          fontWeight: '600',
          fontStyle: 'italic',
          letterSpacing: 0.5,
     },
     formContainer: {
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 10,
     },
     welcomeText: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1F2937',
          textAlign: 'center',
          marginBottom: 24,
     },
     inputGroup: {
          marginBottom: 20,
     },
     label: {
          fontSize: 14,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 8,
     },
     inputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#E5E7EB',
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
     },
     inputIconContainer: {
          paddingLeft: 16,
          justifyContent: 'center',
     },
     input: {
          flex: 1,
          paddingVertical: 14,
          paddingHorizontal: 12,
          fontSize: 16,
          color: '#1F2937',
     },
     eyeIconContainer: {
          paddingRight: 16,
          paddingLeft: 8,
     },
     forgotPassword: {
          alignSelf: 'flex-end',
          marginBottom: 20,
     },
     forgotPasswordText: {
          fontSize: 14,
          color: '#0EA5E9',
          fontWeight: '600',
     },
     loginButton: {
          backgroundColor: '#0EA5E9',
          borderRadius: 16,
          paddingVertical: 16,
          alignItems: 'center',
          shadowColor: '#0EA5E9',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
     },
     loginButtonText: {
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: 'bold',
     },
     divider: {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 24,
     },
     dividerLine: {
          flex: 1,
          height: 1,
          backgroundColor: '#E5E7EB',
     },
     dividerText: {
          marginHorizontal: 16,
          fontSize: 14,
          color: '#6B7280',
     },
     socialButtons: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 12,
     },
     socialButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: '#E5E7EB',
          borderRadius: 16,
          paddingVertical: 14,
          gap: 8,
     },
     socialIcon: {
          width: 28,
          height: 28,
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
     },
     socialButtonText: {
          fontSize: 14,
          fontWeight: '600',
          color: '#374151',
     },
     signupContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 24,
     },
     signupText: {
          fontSize: 14,
          color: '#6B7280',
     },
     signupLink: {
          fontSize: 14,
          color: '#0EA5E9',
          fontWeight: '700',
     },
     footer: {
          textAlign: 'center',
          color: '#FFFFFF',
          fontSize: 12,
          marginTop: 24,
          opacity: 0.8,
     },
});
