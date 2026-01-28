import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/Config';
import { PlanResponse, RequestBuyPlan } from './PlanTypes';

const Plan = createApi({
     reducerPath: 'Plan',
     baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
     tagTypes: ['GetPlanAPI'],
     endpoints: builder => ({
          GetPlan: builder.query<PlanResponse, { interval?: string }>({
               query: ({ interval }) => ({
                    url: `/api/plans/get-plans?search[interval]=${interval}`,
                    method: 'GET',
               }),
               providesTags: ['GetPlanAPI'],
          }),
          BuyPlan: builder.mutation<any, RequestBuyPlan>({
               query: data => ({
                    url: `/api/subscriptions/create-subscription`,
                    method: 'POST',
                    body: data,
               }),
          }),
     }),
});

export const { useGetPlanQuery, useBuyPlanMutation } = Plan;

export default Plan;
