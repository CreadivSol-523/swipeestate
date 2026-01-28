import { meta } from '../Meta';

export interface PlanResponse {
     meta: meta;
     plans: Plans[];
}

export interface RequestBuyPlan {
     userId: string;
     planId: string;
     priceId: string;
     email: string;
     token: string;
     paymentMethodId?: string;
}

// sub interface
export interface Plans {
     _id: string;
     title: string;
     description: string;
     productId: string;
     priceId: string;
     amount: number;
     planPoints: [];
     currency: string;
     interval: string;
     active: boolean;
     createdAt: string;
     updatedAt: string;
     __v: number;
}
