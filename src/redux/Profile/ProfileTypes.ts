// Get Profile
export interface ResponseProfile {
     message?: string;
     user: profileData;
}

export interface RequestProfile {
     userId: string;
}

// Update Profile
export interface RequestUpdateProfile {
     userId: string;
     data: profileData;
}

// profileData
export interface profileData {
     address: string;
     creditScore: string;
     email: string;
     name: string;
     phone: string;
     profilePicture: string;
     role: string;
     selectedIncome: string;
     subscribedPlan: {
          plan: plan;
          subscription: subscription;
     };
}

interface plan {
     active: boolean;
     amount: number;
     createdAt: string;
     currency: string;
     description: string;
     interval: string;
     planPoints: string[];
     priceId: string;
     productId: string;
     title: string;
     updatedAt: string;
     __v: number;
     _id: string;
}

interface subscription {
     createdAt: string;
     currentPeriodEnd: string;
     downgradeMessage: string;
     downgradeRequestedAt: null | string;
     downgradeScheduled: boolean;
     planId: string;
     startDate: string;
     status: string;
     stripeCustomerId: string;
     stripeSubscriptionId: string;
     updatedAt: string;
     userId: string;
     __v: number;
     _id: string;
}
