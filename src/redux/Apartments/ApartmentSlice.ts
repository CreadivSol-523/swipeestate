import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { GetApartmentResponse } from './ApartmentType';

const ApartmentSlice = createApi({
     reducerPath: 'ApartmentSlice',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['GetApartmentAPI'],
     endpoints: builder => ({
          CreateApartment: builder.mutation<{ message: string }, any>({
               query: ({ formData, userId }) => ({
                    url: `/api/apartments/create-apartment/${userId}`,
                    method: 'POST',
                    body: formData,
               }),
               invalidatesTags: ['GetApartmentAPI'],
          }),

          GetApartment: builder.query<GetApartmentResponse, { userId?: string; page?: number; limit?: number }>({
               query: ({ userId, page, limit }) => ({
                    url: `/api/apartments/${userId}/seller-property-listing?page=${page}&limit=${limit}`,
                    method: 'GET',
               }),
               providesTags: ['GetApartmentAPI'],
          }),
     }),
});

export const { useCreateApartmentMutation, useGetApartmentQuery } = ApartmentSlice;
export default ApartmentSlice;
