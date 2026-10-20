import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithTimeout from '../baseQuery';
import { SubscriptionResponse } from './SubscriptionTypes';

const Subscription = createApi({
     reducerPath: 'Subscription',
     baseQuery: baseQueryWithTimeout,
     tagTypes: ['CreateSubscription', "upgradeSubscription"],
     endpoints: builder => ({
          CreateIntend: builder.mutation<{ getPaymentIntent: string; id: string }, { amount: number }>({
               query: amount => ({
                    url: `/api/subscriptions/get-intent`,
                    method: 'POST',
                    body: amount,
               }),
          }),

          GetSubscription: builder.query<any, { userId: string }>({
               query: userId => ({
                    url: `/api/subscriptions/get-subscribed-plan/${userId}`,
                    method: 'GET',
               }),
          }),

          DownGradeSubs: builder.mutation<any, { userId: string; downgradeTo: string }>({
               query: ({ userId, downgradeTo }) => {
                    return {
                         url: `/api/subscriptions/downgrade-subscription/${userId}`,
                         method: 'POST',
                         body: { downgradeTo },
                    };
               },
          }),

          UpGradeSubs: builder.mutation<any, { userId: string; upgradeTo: string; paymentMethodId: string }>({
               query: ({ userId, upgradeTo, paymentMethodId }) => {
                    return {
                         url: `/api/subscriptions/upgrade-subscription/${userId}`,
                         method: 'POST',
                         body: { upgradeTo, paymentMethodId },
                    };
               },
               invalidatesTags: ['upgradeSubscription'],
          }),


     }),
});
export const { useCreateIntendMutation, useGetSubscriptionQuery, useDownGradeSubsMutation, useUpGradeSubsMutation, } = Subscription;
export default Subscription;
