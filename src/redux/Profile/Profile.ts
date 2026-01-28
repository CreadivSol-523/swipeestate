import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { RequestProfile, RequestUpdateProfile, ResponseProfile } from './ProfileTypes';

const Profile = createApi({
     reducerPath: 'Profile',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['UpdateProfile'],
     endpoints: builder => ({
          GetProfile: builder.query<ResponseProfile, RequestProfile>({
               query: userId => ({
                    url: `/api/get-profile/${userId}`,
                    method: 'GET',
               }),
               providesTags: ['UpdateProfile'],
          }),
          UpdateProfile: builder.mutation<ResponseProfile, { userId: string; data: FormData }>({
               query: ({ userId, data }) => ({
                    url: `/api/update-user/${userId}`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['UpdateProfile'],
          }),
          UpdatePassword: builder.mutation<ResponseProfile, { userId: string; data: any }>({
               query: ({ userId, data }) => ({
                    url: `/api/${userId}/update-password`,
                    method: 'PATCH',
                    body: data,
               }),
               invalidatesTags: ['UpdateProfile'],
          }),
     }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation } = Profile;

export default Profile;
