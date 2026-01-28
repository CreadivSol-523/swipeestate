import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';

const Subscription = createApi({
     reducerPath: 'Subscription',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['CreateSubscription'],
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
                    console.log({ userId, downgradeTo }, 'Redux');
                    return {
                         url: `/api/subscriptions/downgrade-subscription/${userId}`,
                         method: 'POST',
                         body: { downgradeTo },
                    };
               },
          }),
     }),
});
export const { useCreateIntendMutation, useGetSubscriptionQuery, useDownGradeSubsMutation } = Subscription;
export default Subscription;
