import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { GetApartmentsResponse, GetBuyerResponse, GetMatchsResponse, GetSinglePropertyType } from './MatchType';

const MatcheSlice = createApi({
     reducerPath: 'MatcheSlice',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['GetApartments', 'createLike', 'reject', 'accept'],
     endpoints: builder => ({
          GetApartments: builder.query<
               GetApartmentsResponse,
               {
                    userID?: string;
                    page?: number;
                    limit?: number;
                    key?: string;
                    gte?: number;
                    lte?: number;
               }
          >({
               query: ({ userID, page = 1, limit = 10, key, gte, lte }) => {
                    const params = new URLSearchParams();

                    params.append('page', String(page));
                    params.append('limit', String(limit));

                    if (key && gte !== undefined) {
                         params.append(`search[${key}][$gte]`, String(gte));
                    }

                    if (key && lte !== undefined) {
                         params.append(`search[${key}][$lte]`, String(lte));
                    }

                    return {
                         url: `/api/apartments/${userID}/property-listing?${params.toString()}`,
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
