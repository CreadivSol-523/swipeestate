import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import ResToast from '../../components/ResToast/ResToast';
import { useGetProfileQuery, useUpdatePasswordMutation, useUpdateProfileMutation } from '../../redux/Profile/Profile';
import { profileData } from '../../redux/Profile/ProfileTypes';
import { useAuth } from '../../utils/Storage/Storage';
import { authUser } from '../../redux/Features/authState';

// Get Profile
export const useGetProfileHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;

     const Profile = useGetProfileQuery(userId, { skip: !userId });
     const ProfileData = Profile?.data?.user;
     const ProfileLoading = Profile.isLoading;
     const { isError, error, refetch } = Profile;
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Profile Details' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { ProfileData, ProfileLoading, isError, error, refetch };
};

// Update Profile
export const useUpdateProfileHandler = () => {
     const [UpdateProfileAPI, { isLoading }] = useUpdateProfileMutation();
     const { userData } = useAuth();
     const dispatch = useDispatch();

     const handleUpdateProfileAPI = async (data: any) => {
          try {
               const { name, email, address, profilePicture, creditScore, phone, selectedIncome } = data;
               if (!name || !email || !address || !profilePicture || !creditScore || !phone || !selectedIncome) {
                    return ResToast({
                         title: 'All Field Required',
                         type: 'warning',
                    });
               }
               const isImage = profilePicture?.split('/')?.includes('uploads');

               const formData = new FormData();
               const proofImgType = profilePicture?.split('.');
               const imgType = proofImgType?.pop();
               const imageBlob = {
                    uri: profilePicture,
                    type: `image/${imgType}`,
                    name: `profilePicture.${imgType}`,
               } as any;

               formData.append('profilePicture', isImage ? profilePicture : imageBlob);
               formData.append('address', address);
               formData.append('email', email);
               formData.append('name', name);
               formData.append('phone', phone);
               formData.append('selectedIncome', selectedIncome);
               formData.append('creditScore', creditScore);

               const res = await UpdateProfileAPI({
                    userId: userData?._id,
                    data: formData,
               });

               console.log(res)

               if (!res.error) {
                    // dispatch(authUser({ data: data }));
                    return ResToast({ title: res.data.message, type: 'success' });
               }
          } catch (error) {
               console.error('Update Profile failed:', error);
               throw error;
          }
     };

     return { handleUpdateProfileAPI, isLoading };
};

// Update Profile
export const useUpdatePasswordHandler = () => {
     const [UpdatePasswordAPI, { isLoading }] = useUpdatePasswordMutation();
     const { userData } = useAuth();

     const handleUpdatePasswordAPI = async ({ data }: { data: { previousPass: string; password: string; newPass: string } }) => {
          try {
               const { newPass, password, previousPass } = data;
               if (!newPass || !password) {
                    return ResToast({
                         title: 'All Field Required',
                         type: 'warning',
                    });
               }

               if (!previousPass) {
                    return ResToast({
                         title: 'Please enter your previous password',
                         type: 'warning',
                    });
               }

               if (newPass !== password) {
                    return ResToast({
                         title: 'New password and confirm password do not match',
                         type: 'warning',
                    });
               }

               const res = await UpdatePasswordAPI({
                    userId: userData?._id,
                    data: {
                         password: previousPass,
                         newPass: newPass,
                    },
               });

               if (!res.error) {
                    return ResToast({ title: res?.data?.message, type: 'success' });
               } else {
                    return ResToast({ title: (res?.error as any)?.data?.message, type: 'danger' });
               }
          } catch (error) {
               console.error('Update Profile failed:', error);
               throw error;
          }
     };

     return { handleUpdatePasswordAPI, isLoading };
};
