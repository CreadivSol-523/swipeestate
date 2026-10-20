import { meta } from '../Meta';

export interface SubscriptionResponse {
     subscriptions: any;
     meta: meta;
}

export interface Subscriptions {
     _id: string;
     userId: string;
     planId: string;
     stripeSubscriptionId: string;
     stripeCustomerId: string;
     status: string;
     startDate: string;
     currentPeriodEnd: string;
     updatedAt: string;
     createdAt: string;
     downgradeRequestedAt: null | string;
     downgradeMessage: string;
     downgradeScheduled: boolean;
     __v: number;
     plan: {
          _id: string;
          title: string;
          description: string;
          planPoints: string[];
          productId: string;
          priceId: string;
          amount: number;
          currency: string;
          interval: string;
          active: boolean;
          createdAt: string;
          updatedAt: string;
          __v: number;
     };
}
