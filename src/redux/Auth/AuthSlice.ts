import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { CreateAccResponse, CreateAccResquest, LoginResponse, LoginResquest } from './AuthTypes';

const Auth = createApi({
     reducerPath: 'Auth',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['auth'],
     endpoints: builder => ({
          createAccount: builder.mutation<CreateAccResponse, FormData>({
               query: data => ({
                    url: `/api/buyer-register`,
                    method: 'POST',
                    body: data,
               }),
          }),
          CreateSellerAccount: builder.mutation<CreateAccResponse, FormData>({
               query: data => ({
                    url: `/api/seller-register`,
                    method: 'POST',
                    body: data,
               }),
          }),
          loginAccoint: builder.mutation<CreateAccResponse, { identifier?: string; password?: string }>({
               query: data => ({
                    url: `/api/login`,
                    method: 'POST',
                    body: data,
               }),
          }),
          forgotPassword: builder.mutation<{ message: string; identifier: string }, { identifier: string }>({
               query: data => ({
                    url: `/api/forget-password`,
                    method: 'PATCH',
                    body: data,
               }),
          }),
          verifyOtp: builder.mutation<{ message: string; identifier: string; otp: string }, { identifier: string; otp: string }>({
               query: data => ({
                    url: `/api/verify-otp`,
                    method: 'PATCH',
                    body: data,
               }),
          }),

          newpassword: builder.mutation<{ message: string; identifier: string }, { identifier: string; otp: string; newPassword: string }>({
               query: data => ({
                    url: `/api/change-password`,
                    method: 'PATCH',
                    body: data,
               }),
          }),

          logout: builder.mutation<any, { token: string }>({
               query: token => ({
                    url: `/api/logout`,
                    method: 'POST',
                    body: token,
               }),
          }),
     }),
});

export const { useCreateAccountMutation, useCreateSellerAccountMutation, useLoginAccointMutation, useForgotPasswordMutation, useNewpasswordMutation, useVerifyOtpMutation, useLogoutMutation } = Auth;

export default Auth;
