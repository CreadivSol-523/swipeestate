import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { authUser } from '../../redux/Features/authState';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import CustomLogo from '../../components/CustomLogo/CustomLogo';
import { useForm } from '../../utils/UseForm/UseForm';
import Icon from '../../components/Icons/Icons';
import { useLoginAccountHandler } from '../../models/Auth/Auth';

const LoginScreen = ({ navigation }: { navigation: any }) => {
     const [showPassword, setShowPassword] = useState(false);

     const { handleLogin, isLoading } = useLoginAccountHandler();

     const { data, handleChange: handleData } = useForm({ initialState: { email: '', password: '' } });
     const { email, password } = data;

     const handleLoginData = () => {
          handleLogin(data);
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
                    <Text style={styles.welcomeText}>Welcome Back!</Text>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                         <Text style={styles.label}>Email</Text>
                         <View style={styles.inputWrapper}>
                              <View style={styles.inputIconContainer}>
                                   <Icon name="mail" size={18} color="#9CA3AF" />
                              </View>
                              <TextInput
                                   style={styles.input}
                                   placeholder="Enter your email"
                                   placeholderTextColor="#9CA3AF"
                                   value={email}
                                   onChangeText={value => handleData('email', value)}
                                   keyboardType="email-address"
                                   autoCapitalize="none"
                                   autoCorrect={false}
                              />
                         </View>
                    </View>

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
                                   value={password}
                                   onChangeText={value => handleData('password', value)}
                                   secureTextEntry={!showPassword}
                                   autoCapitalize="none"
                              />
                              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                                   <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} color="#9CA3AF" />
                              </TouchableOpacity>
                         </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgetPasswordScreen')}>
                         <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLoginData} activeOpacity={0.8} disabled={isLoading}>
                         {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                         <View style={styles.dividerLine} />
                         <Text style={styles.dividerText}>Or continue with</Text>
                         <View style={styles.dividerLine} />
                    </View>

                    {/* Social Login Buttons */}
                    <View style={styles.socialButtons}>
                         <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                              <View style={[styles.socialIcon, { backgroundColor: '#EA4335' }]}>
                                   <Icon name="google" size={20} color="#FFFFFF" />
                              </View>
                              <Text style={styles.socialButtonText}>Google</Text>
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                              <View style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}>
                                   <Icon name="facebook" size={20} color="#FFFFFF" />
                              </View>
                              <Text style={styles.socialButtonText}>Facebook</Text>
                         </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                         <Text style={styles.signupText}>Don't have an account? </Text>
                         <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                              <Text style={styles.signupLink}>Sign Up</Text>
                         </TouchableOpacity>
                    </View>
               </View>

               {/* Footer */}
               <Text style={styles.footer}>© 2026 Swipe Estate. All rights reserved.</Text>
          </ScrollView>
     );
};

export default LoginScreen;

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
