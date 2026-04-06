import { meta } from '../Meta';

export interface PlanResponse {
     meta: meta;
     plans: Plans[];
}

export interface RequestBuyPlan {
     userId: string;
     planId: string;
     email?: string;
     /** Base64 App Store receipt; required for paid plans when using Apple billing */
     receipt?: string;
     /** Legacy Stripe fields (optional) */
     priceId?: string;
     token?: string;
     paymentMethodId?: string;
}

// sub interface
export interface Plans {
     _id: string;
     title: string;
     description: string;
     /** App Store product id (may be missing while migrating from Stripe) */
     productId?: string;
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
