import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithTimeout from '../baseQuery';
import { PlanResponse, RequestBuyPlan } from './PlanTypes';

// Body jo backend ke Apple verification endpoint ko jata hai
export interface RequestVerifyApplePurchase {
     userId: string;
     planId: string;
     transactionId: string;
}

const Plan = createApi({
     reducerPath: 'Plan',
     baseQuery: baseQueryWithTimeout,
     tagTypes: ['GetPlanAPI'],
     endpoints: builder => ({
          GetPlan: builder.query<PlanResponse, { interval?: string; type?: string }>({
               query: ({ interval, type }) => ({
                    url: `/api/plans/get-plans?search[interval]=${interval}&search[type]=${type}`,
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
          // Apple In-App Purchase: backend Apple se transaction verify karke subscription activate karta hai
          VerifyApplePurchase: builder.mutation<any, RequestVerifyApplePurchase>({
               query: data => ({
                    url: `/api/subscriptions/apple/verify`,
                    method: 'POST',
                    body: data,
               }),
          }),
     }),
});

export const { useGetPlanQuery, useBuyPlanMutation, useVerifyApplePurchaseMutation } = Plan;

export default Plan;