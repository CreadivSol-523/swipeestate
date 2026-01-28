import { NavigationProp, useNavigation } from '@react-navigation/native';
import ResToast from '../../components/ResToast/ResToast';
import {
     useCreateAccountMutation,
     useCreateSellerAccountMutation,
     useForgotPasswordMutation,
     useLoginAccointMutation,
     useLogoutMutation,
     useNewpasswordMutation,
     useVerifyOtpMutation,
} from '../../redux/Auth/AuthSlice';
import { CreateAccResquest } from '../../redux/Auth/AuthTypes';
import { useDispatch } from 'react-redux';
import { authUser, logout } from '../../redux/Features/authState';
import { useAuth } from '../../utils/Storage/Storage';

// Create Account
export const useRegisterHandler = () => {
     const [register, { isLoading, isSuccess, isError }] = useCreateAccountMutation();

     type RootStackParamList = {
          SelectPlanScreen: { user: any };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleRegister = async (credentials: CreateAccResquest & { confirmPassword?: string }) => {
          try {
               const { name, email, phone, address, selectedIncome, creditScore, password, fcmToken, deviceType, deviceName, confirmPassword, profilePicture } = credentials;
               const hasEmpty = Object.values(credentials).some(v => v === '');

               if (password !== confirmPassword) {
                    return ResToast({
                         title: 'Passwords do not match.',
                         type: 'warning',
                    });
               }

               if (hasEmpty) {
                    return ResToast({
                         title: 'All fields required.',
                         type: 'warning',
                    });
               }
               // FormData for file upload
               const formData = new FormData();

               const proofImgType = profilePicture?.split('.');
               const imgType = proofImgType?.pop();

               const imageBlob = {
                    uri: profilePicture,
                    type: `image/${imgType}`,
                    name: `profilePicture.${imgType}`,
               } as any;

               formData.append('profilePicture', imageBlob);
               formData.append('name', name);
               formData.append('phone', phone);
               formData.append('selectedIncome', selectedIncome);
               formData.append('creditScore', creditScore);
               formData.append('address', address);
               formData.append('deviceName', deviceName);
               formData.append('deviceType', deviceType);
               formData.append('email', email);
               formData.append('password', password);
               formData.append('fcmToken', fcmToken);

               const res = await register(formData);

               if (!res.error) {
                    ResToast({
                         title: 'Pick a subscription plan to unlock all features.',
                         type: 'success',
                    });
                    return navigation.navigate('SelectPlanScreen', { user: res?.data });
               } else {
                    ResToast({
                         res: res,
                         type: 'warning',
                    });
               }
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleRegister, isLoading, isSuccess, isError };
};

// Create Account
export const useSellerRegisterHandler = () => {
     const [sellerRegister, { isLoading, isSuccess, isError }] = useCreateSellerAccountMutation();

     type RootStackParamList = {
          SelectPlanScreen: { user: any };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleSellerRegister = async (credentials: CreateAccResquest & { confirmPassword?: string }) => {
          try {
               const { name, email, phone, address, password, fcmToken, deviceType, deviceName, confirmPassword, profilePicture } = credentials;
               const hasEmpty = Object.values(credentials).some(v => v === '');

               if (password !== confirmPassword) {
                    return ResToast({
                         title: 'Passwords do not match.',
                         type: 'warning',
                    });
               }

               if (hasEmpty) {
                    return ResToast({
                         title: 'All fields required.',
                         type: 'warning',
                    });
               }
               // FormData for file upload
               const formData = new FormData();

               const proofImgType = profilePicture?.split('.');
               const imgType = proofImgType?.pop();

               const imageBlob = {
                    uri: profilePicture,
                    type: `image/${imgType}`,
                    name: `profilePicture.${imgType}`,
               } as any;

               formData.append('profilePicture', imageBlob);
               formData.append('name', name);
               formData.append('phone', phone);
               formData.append('address', address);
               formData.append('deviceName', deviceName);
               formData.append('deviceType', deviceType);
               formData.append('email', email);
               formData.append('password', password);
               formData.append('fcmToken', fcmToken);

               const res = await sellerRegister(formData);
               console.log(res, 'Signup');

               if (!res.error) {
                    ResToast({
                         title: 'Pick a subscription plan to unlock all features.',
                         type: 'success',
                    });
                    return navigation.navigate('SelectPlanScreen', { user: res?.data });
               } else {
                    ResToast({
                         res: res,
                         type: 'warning',
                    });
               }
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleSellerRegister, isLoading, isSuccess, isError };
};

// Login Account
export const useLoginAccountHandler = () => {
     const [loginAPI, { isLoading, isSuccess, isError }] = useLoginAccointMutation();
     const dispatch = useDispatch();

     type RootStackParamList = {
          SelectPlanScreen: { user: any };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleLogin = async (credentials: { email?: string; password?: string }) => {
          try {
               const { email, password } = credentials;
               const hasEmpty = Object.values(credentials).some(v => v === '');

               if (hasEmpty) {
                    return ResToast({
                         title: 'All fields required.',
                         type: 'warning',
                    });
               }

               const res = await loginAPI({
                    identifier: email,
                    password: password,
               });
               console.log(res, 'Login');

               if (!res.error) {
                    if (res?.data?.user?.subscribedPlan === null) {
                         ResToast({
                              title: 'Pick a subscription plan to unlock all features.',
                              type: 'success',
                         });
                         return navigation.navigate('SelectPlanScreen', { user: res?.data });
                    } else {
                         dispatch(authUser({ data: res?.data }));
                    }
               } else {
                    ResToast({
                         res: res,
                         type: 'warning',
                    });
               }
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleLogin, isLoading, isSuccess, isError };
};

// Forgot Password
export const useForgotPasswordHandler = () => {
     const dispatch = useDispatch();
     const [forgotPassword, { isLoading, isError }] = useForgotPasswordMutation();

     type RootStackParamList = {
          VerifyOTPScreen: { type: string; email: string };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleForgotPassword = async ({ email }: { email: string }) => {
          try {
               if (!email) {
                    return ResToast({
                         title: 'Please enter your email.',
                         type: 'warning',
                    });
               }

               const res = await forgotPassword({ identifier: email });

               if (!res.error) {
                    ResToast({
                         title: 'Otp Sent successfully',
                         type: 'success',
                    });
                    navigation.navigate('VerifyOTPScreen', { type: 'forgot', email });
               } else {
                    ResToast({
                         title: (res.error as any).data?.message || 'Failed to send OTP.',
                         type: 'danger',
                    });
               }
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleForgotPassword, isLoading, isError };
};

// OTP
export const useVerifyOTPHandler = () => {
     const dispatch = useDispatch();
     const [verifyOTP, { isLoading }] = useVerifyOtpMutation();

     type RootStackParamList = {
          ResetPasswordScreen: { identifier: string; otp: string };
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleVerifyOTP = async ({ identifier, otp }: { identifier: string; otp: string }) => {
          try {
               if (!identifier || !otp) {
                    return ResToast({
                         title: 'Please enter OTP or refresh.',
                         type: 'warning',
                    });
               }

               const res = await verifyOTP({ identifier, otp });

               if (!res.error) {
                    ResToast({
                         title: 'Otp Verified successfully',
                         type: 'success',
                    });

                    navigation.navigate('ResetPasswordScreen', { identifier, otp });
               } else {
                    ResToast({
                         title: (res.error as any).data.message || 'Failed to send OTP.',
                         type: 'danger',
                    });
               }
          } catch (error) {
               console.error('Verified failed:', error);
               throw error;
          }
     };

     return { handleVerifyOTP, isLoading };
};

// Reset Password
export const useNewPasswordHandler = () => {
     const [newPasswordAPI, { isLoading }] = useNewpasswordMutation();

     type RootStackParamList = {
          LoginScreen: undefined;
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleNewPassword = async ({ email, otp, newPassword, reNewPassword }: { email: string; otp: string; newPassword: string; reNewPassword: string }) => {
          try {
               if (!newPassword || !reNewPassword) {
                    return ResToast({
                         title: 'Please fill all fields.',
                         type: 'warning',
                    });
               }

               if (newPassword !== reNewPassword) {
                    return ResToast({
                         title: 'Passwords do not match.',
                         type: 'warning',
                    });
               }

               const res = await newPasswordAPI({ identifier: email, otp, newPassword });
               if (!res.error) {
                    ResToast({
                         title: 'Password changed successfully',
                         type: 'success',
                    });
                    navigation.navigate('LoginScreen');
               } else {
                    ResToast({
                         title: (res.error as any).data.message || 'Failed to change password.',
                         type: 'danger',
                    });
               }
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleNewPassword, isLoading };
};

// Reset Password
export const useLogoutHandler = () => {
     const [LogoutAPI, { isLoading }] = useLogoutMutation();
     const dispatch = useDispatch();
     const { refreshToken } = useAuth();

     const handleNewPassword = async () => {
          try {
               await LogoutAPI({ token: refreshToken });
               dispatch(logout());
          } catch (error) {
               console.error('signup failed:', error);
               throw error;
          }
     };

     return { handleNewPassword, isLoading };
};
