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
     }),
});
export const { useCreateIntendMutation } = Subscription;
export default Subscription;
