import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import CustomLogo from '../../components/CustomLogo/CustomLogo';
import { useVerifyOTPHandler } from '../../models/Auth/Auth';

const VerifyOTPScreen = ({ navigation, route }: { navigation: any; route: any }) => {
     const [data, setData] = useState({ otp: ['', '', '', '', '', ''] });
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');
     const inputRefs = useRef<Array<TextInput | null>>([]);
     const email = route.params?.email || '';

     const handleOTPChange = (text: string, index: number) => {
          if (text.length > 1) {
               text = text[text.length - 1];
          }

          const newOtp = [...data.otp];
          newOtp[index] = text;
          setData({ ...data, otp: newOtp });
          setError('');

          if (text && index < 5) {
               inputRefs.current[index + 1]?.focus();
          }
     };

     const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
          if (e.nativeEvent.key === 'Backspace' && !data.otp[index] && index > 0) {
               inputRefs.current[index - 1]?.focus();
          }
     };

     // const handleVerifyOTP = () => {
     //      const otpValue = data.otp.join('');

     //      if (otpValue.length !== 6) {
     //           setError('Please enter complete OTP');
     //           return;
     //      }

     //      setLoading(true);
     //      setError('');

     //      setTimeout(() => {
     //           setLoading(false);
     //           navigation.navigate('ResetPasswordScreen', { email });
     //      }, 1500);
     // };

     const handleResendOTP = () => {
          setData({ ...data, otp: ['', '', '', '', '', ''] });
          setError('');
     };

     const { handleVerifyOTP, isLoading } = useVerifyOTPHandler();

     const VerifyOTP = async () => {
          await handleVerifyOTP({
               identifier: email,
               otp: data?.otp.join(''),
          });
          console.log({
               identifier: email,
               otp: data?.otp.join(''),
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

                    <View style={styles.otpContainer}>
                         {data.otp.map((digit, index) => (
                              <TextInput
                                   key={index}
                                   ref={ref => {
                                        inputRefs.current[index] = ref;
                                   }}
                                   style={[styles.otpInput, digit && styles.otpInputFilled]}
                                   value={digit}
                                   onChangeText={text => handleOTPChange(text, index)}
                                   onKeyPress={e => handleKeyPress(e, index)}
                                   keyboardType="number-pad"
                                   maxLength={1}
                                   selectTextOnFocus
                              />
                         ))}
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={VerifyOTP} activeOpacity={0.8} disabled={isLoading}>
                         {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Verify OTP</Text>}
                    </TouchableOpacity>
                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                         <Text style={styles.signupText}>Didn’t receive the OTP? </Text>
                         <TouchableOpacity onPress={handleResendOTP}>
                              <Text style={styles.signupLink}>Resend</Text>
                         </TouchableOpacity>
                    </View>
               </View>

               {/* Footer */}
               <Text style={styles.footer}>© 2026 Swipe Estate. All rights reserved.</Text>
          </ScrollView>
     );
};

export default VerifyOTPScreen;

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
     otpContainer: {
          flexDirection: 'row',
          marginBottom: 32,
          gap: 12,
     },
     otpInput: {
          flex: 1,
          height: 56,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
          textAlign: 'center',
          fontSize: 24,
          fontFamily: Font.font500,
          color: '#000',
          backgroundColor: '#fff',
     },
     otpInputFilled: {
          borderColor: colors.PrimaryColor,
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
