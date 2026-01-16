import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { authUser } from '../../redux/Features/authState';
import Font from '../../assests/fonts/Font';
import colors from '../../assests/color/color';
import { useForm } from '../../utils/UseForm/UseForm';
import Icon from '../../components/Icons/Icons';
import CustomDropdown, { DropdownOption } from '../../components/CustomDropdown/CustomDropdown';

const SignupScreen = ({ navigation }: { navigation: any }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');
     const [showPassword, setShowPassword] = useState(false);
     const dispatch = useDispatch();
     const [selectedIncome, setSelectedIncome] = useState('');

     const incomeRanges: DropdownOption[] = [
          { label: 'Under ₨25,000', value: '0-25000' },
          { label: '₨25,000 - ₨50,000', value: '25000-50000' },
          { label: '₨50,000 - ₨75,000', value: '50000-75000' },
          { label: '₨75,000 - ₨1,00,000', value: '75000-100000' },
          { label: '₨1,00,000 - ₨1,50,000', value: '100000-150000' },
          { label: '₨1,50,000 - ₨2,00,000', value: '150000-200000' },
          { label: '₨2,00,000 - ₨3,00,000', value: '200000-300000' },
          { label: 'Above ₨3,00,000', value: '300000+' },
     ];

     const {
          data,
          handleChange: handleData,
          setData,
     } = useForm({
          initialState: { email: '', password: '', name: '', phone: '', confirmPassword: '', city: '' },
     });

     const { email, password, name, city, confirmPassword, phone } = data;

     const handleSignup = () => {
          // if (!data.name || !data.email || !data.password) {
          //      setError('Please fill in all fields');
          //      return;
          // }

          // if (data.password.length < 6) {
          //      setError('Password must be at least 6 characters');
          //      return;
          // }

          setLoading(true);
          setError('');

          setTimeout(() => {
               // dispatch(authUser({ data: { email: data.email, name: data.name } }));
               navigation.navigate('LoginScreen');
               setLoading(false);
          }, 1500);
     };

     return (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
               {/* Logo Section */}
               <View style={styles.logoContainer}>
                    <Text style={styles.title}>Swipe Estate</Text>
                    <Text style={styles.subtitle}>WHERE DREAMS COME TRUE</Text>
               </View>

               {/* Login Form */}
               <View style={styles.formContainer}>
                    <Text style={styles.welcomeText}>Create Account</Text>

                    {/* FullName Input */}
                    <View style={styles.inputGroup}>
                         <Text style={styles.label}>Full Name</Text>
                         <View style={styles.inputWrapper}>
                              <View style={styles.inputIconContainer}>
                                   <Icon name="user" size={18} color="#9CA3AF" />
                              </View>
                              <TextInput
                                   style={[styles.input]}
                                   placeholder="Enter your Full Name"
                                   placeholderTextColor="#9CA3AF"
                                   value={name}
                                   onChangeText={value => handleData('name', value)}
                                   autoCapitalize="none"
                                   autoCorrect={false}
                              />
                         </View>
                    </View>

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

                    {/* Phone Input */}
                    <View style={styles.inputGroup}>
                         <Text style={styles.label}>Phone</Text>
                         <View style={styles.inputWrapper}>
                              <View style={styles.inputIconContainer}>
                                   <Icon name="phone" size={18} color="#9CA3AF" />
                              </View>
                              <TextInput
                                   style={styles.input}
                                   placeholder="Enter your Phone"
                                   placeholderTextColor="#9CA3AF"
                                   value={phone}
                                   onChangeText={value => handleData('phone', value)}
                                   keyboardType="phone-pad"
                                   autoCapitalize="none"
                                   autoCorrect={false}
                              />
                         </View>
                    </View>

                    {/* City Input */}
                    <View style={styles.inputGroup}>
                         <Text style={styles.label}>City</Text>
                         <View style={styles.inputWrapper}>
                              <View style={styles.inputIconContainer}>
                                   <Icon name="city" size={18} color="#9CA3AF" />
                              </View>
                              <TextInput
                                   style={styles.input}
                                   placeholder="Enter your City"
                                   placeholderTextColor="#9CA3AF"
                                   value={city}
                                   onChangeText={value => handleData('city', value)}
                                   keyboardType="default"
                                   autoCapitalize="none"
                                   autoCorrect={false}
                              />
                         </View>
                    </View>

                    <CustomDropdown
                         label="Income Range"
                         placeholder="Select your income range"
                         options={incomeRanges}
                         value={selectedIncome}
                         onValueChange={(value, label) => {
                              setSelectedIncome(value);
                              console.log('Selected:', value, label);
                         }}
                         iconName="income"
                         iconSize={18}
                         iconColor="#9CA3AF"
                    />

                    <CustomDropdown
                         label="Cradit Score"
                         placeholder="Select your income range"
                         options={incomeRanges}
                         value={selectedIncome}
                         onValueChange={(value, label) => {
                              setSelectedIncome(value);
                              console.log('Selected:', value, label);
                         }}
                         iconName="income"
                         iconSize={18}
                         iconColor="#9CA3AF"
                    />

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

                    {/*Confirm Password Input */}
                    <View style={styles.inputGroup}>
                         <Text style={styles.label}>Confirm Password</Text>
                         <View style={styles.inputWrapper}>
                              <View style={styles.inputIconContainer}>
                                   <Icon name="lock" size={18} color="#9CA3AF" />
                              </View>
                              <TextInput
                                   style={styles.input}
                                   placeholder="Enter your Confirm password"
                                   placeholderTextColor="#9CA3AF"
                                   value={confirmPassword}
                                   onChangeText={value => handleData('confirmPassword', value)}
                                   secureTextEntry={!showPassword}
                                   autoCapitalize="none"
                              />
                              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                                   <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} color="#9CA3AF" />
                              </TouchableOpacity>
                         </View>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleSignup} activeOpacity={0.8}>
                         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Signup</Text>}
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
                         <Text style={styles.signupText}>Already have an account? </Text>
                         <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                              <Text style={styles.signupLink}>Login</Text>
                         </TouchableOpacity>
                    </View>
               </View>

               {/* Footer */}
               <Text style={styles.footer}>© 2026 Swipe Estate. All rights reserved.</Text>
          </ScrollView>
     );
};

export default SignupScreen;

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
