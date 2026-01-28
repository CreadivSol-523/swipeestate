export interface LoginResponse {
     message: string;
     accessToken: string;
     refreshToken: string;
     user: User;
}

export interface LoginResquest {
     identifier: string;
     password: string;
     deviceName?: string;
     deviceType?: string;
     fcmToken?: string | undefined;
}

// Create Account
export interface CreateAccResquest {
     name: string;
     email: string;
     phone: string;
     address: string;
     selectedIncome: string;
     creditScore: string;
     password: string;
     fcmToken: string;
     deviceType: string;
     deviceName: string;
     profilePicture: string;
}

export interface CreateSellerAccRequest {
     name: string;
     email: string;
     phone: string;
     address: string;
     selectedIncome: string;
     creditScore: string;
     password: string;
     fcmToken: string;
     deviceType: string;
     deviceName: string;
     profilePicture: string;
}

export interface CreateAccResponse {
     accessToken: string;
     message: string;
     refreshToken: string;
     user: User;
}

export interface User {
     name: string;
     email: string;
     phone: string;
     address: string;
     selectedIncome: string;
     creditScore: string;
     password: string;
     profilePicture: string;
     role: string;
     subscribedPlan: string | boolean;
     _id: string;
}
