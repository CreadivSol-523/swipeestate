import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';

export interface CurrentSubscriptionResponse {
     planId: string;
     canDowngrade: boolean;
     priceId: string | null;
     plan: Record<string, unknown>;
}

const Subscription = createApi({
     reducerPath: 'Subscription',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['CreateSubscription', 'CurrentSubscription'],
     endpoints: builder => ({
          CreateIntend: builder.mutation<{ getPaymentIntent: string; id: string }, { amount: number }>({
               query: amount => ({
                    url: `/api/subscriptions/get-intent`,
                    method: 'POST',
                    body: amount,
               }),
          }),

          GetSubscription: builder.query<CurrentSubscriptionResponse, string>({
               query: userId => ({
                    url: `/api/subscriptions/get-subscribed-plan/${userId}`,
                    method: 'GET',
               }),
               providesTags: ['CurrentSubscription'],
          }),

          DownGradeSubs: builder.mutation<{ message: string; downgradeDate?: string }, { userId: string; downgradeTo: string }>({
               query: ({ userId, downgradeTo }) => ({
                    url: `/api/subscriptions/downgrade-subscription/${userId}`,
                    method: 'POST',
                    body: { downgradeTo },
               }),
               invalidatesTags: ['CurrentSubscription'],
          }),

          UpgradeSubs: builder.mutation<{ message: string }, { userId: string; upgradeTo: string; receipt: string }>({
               query: ({ userId, upgradeTo, receipt }) => ({
                    url: `/api/subscriptions/upgrade-subscription/${userId}`,
                    method: 'POST',
                    body: { upgradeTo, receipt },
               }),
               invalidatesTags: ['CurrentSubscription'],
          }),
     }),
});
export const { useCreateIntendMutation, useGetSubscriptionQuery, useDownGradeSubsMutation, useUpgradeSubsMutation } = Subscription;
export default Subscription;
