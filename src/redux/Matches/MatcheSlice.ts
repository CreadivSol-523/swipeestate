import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { GetApartmentsResponse, GetBuyerResponse, GetMatchsResponse, GetSinglePropertyType } from './MatchType';
import { URLParams } from '../../utils/URL/URLParams';

const MatcheSlice = createApi({
     reducerPath: 'MatcheSlice',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['GetApartments', 'createLike', 'reject', 'accept'],
     endpoints: builder => ({
          GetApartments: builder.query<GetApartmentsResponse, { userID?: string; page?: number; limit?: number; key?: string; gte?: number; lte?: number; status?: string }>({
               query: ({ userID, page = 1, limit = 10, key, gte, lte, status }) => {
                    const base = `/api/apartments/${userID}/property-listing`;
                    const params: Record<string, any> = {
                         page,
                         limit,
                         ...(gte !== undefined && {
                              [`search[${key}][$gte]`]: gte,
                         }),
                         ...(lte !== undefined && {
                              [`search[${key}][$lte]`]: lte,
                         }),
                         ...(status && {
                              'search[status]': status,
                         }),
                    };
                    const url = URLParams(base, params);

                    return {
                         url: url,
                         method: 'GET',
                    };
               },
               providesTags: ['GetApartments'],
          }),

          CreateLike: builder.mutation<GetApartmentsResponse, { userID?: string; propertyId?: string }>({
               query: ({ userID, propertyId }) => ({
                    url: `/api/matches/${userID}/match-property/${propertyId}`,
                    method: 'POST',
               }),
               invalidatesTags: ['createLike'],
          }),

          GetMatches: builder.query<GetMatchsResponse, { userId?: string; propertyId?: string; page?: number; limit?: number; search?: string }>({
               query: ({ userId, page, limit, search }) => ({
                    url: `/api/matches/${userId}/get-matches?page=${page}&limit=${limit}&search[status]=${search}`,
                    method: 'GET',
               }),
               providesTags: ['createLike', 'reject', 'accept'],
          }),

          GetBuyers: builder.query<GetBuyerResponse, { propertyId?: string; page?: number; limit?: number }>({
               query: ({ page, limit }) => ({
                    url: `/api/get-buyers?page=${page}&limit=${limit}`,
                    method: 'GET',
               }),
          }),

          RejectMatch: builder.mutation<{ message: string }, { page?: number; limit?: number; propertyId?: string; userId?: string }>({
               query: ({ userId, propertyId }) => ({
                    url: `/api/matches/${userId}/reject-matches/${propertyId}`,
                    method: 'PATCH',
               }),
               invalidatesTags: ['reject'],
          }),

          AcceptMatch: builder.mutation<{ message: string }, { page?: number; limit?: number; matchId?: string; userId?: string }>({
               query: ({ userId, matchId }) => ({
                    url: `/api/matches/${userId}/accept-matches/${matchId}`,
                    method: 'PATCH',
               }),
               invalidatesTags: ['accept'],
          }),

          SingleProperty: builder.query<GetSinglePropertyType, { propertyId?: string; sellerId?: string }>({
               query: ({ sellerId, propertyId }) => ({
                    url: `/api/apartments/${sellerId}/seller-property/${propertyId}`,
                    method: 'GET',
               }),
               providesTags: ['accept'],
          }),
     }),
});

export const { useGetApartmentsQuery, useCreateLikeMutation, useGetMatchesQuery, useGetBuyersQuery, useRejectMatchMutation, useAcceptMatchMutation, useSinglePropertyQuery } = MatcheSlice;

export default MatcheSlice;
