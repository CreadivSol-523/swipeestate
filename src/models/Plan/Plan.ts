import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import ResToast from '../../components/ResToast/ResToast';
import {
     useBuyPlanMutation,
     useGetPlanQuery,
     useVerifyApplePurchaseMutation,
} from '../../redux/Plan/Plan';
import { RequestBuyPlan } from '../../redux/Plan/PlanTypes';
import { useDispatch } from 'react-redux';
import { authUser } from '../../redux/Features/authState';
import { useAuth } from '../../utils/Storage/Storage';
import { useGetSubscriptionDetailQuery } from '../../redux/Matches/MatcheSlice';

// Get Plan
export const useGetPlanHandler = ({ interval, type }: { interval: string; type?: string }) => {
     const GetPlan = useGetPlanQuery({ interval, type });
     const PlanData = GetPlan.data;
     const PlanLoading = GetPlan.isLoading;
     const { isError, error, refetch, isFetching } = GetPlan;
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Plan' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { PlanData, PlanLoading, isError, error, refetch, isFetching };
};

// Create Plan
export const useBuyPlanHandler = () => {
     const [BuyPlanAPI, { isLoading }] = useBuyPlanMutation();

     const dispatch = useDispatch();

     type RootStackParamList = {
          Home: undefined;
     };

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     interface data {
          RequestBuyPlan: RequestBuyPlan;
          user: any;
          amount?: number;
     }

     const handleBuyPlanAPI = async (data: data) => {
          try {
               const res = await BuyPlanAPI(data?.RequestBuyPlan);
               if (!res.error) {
                    dispatch(authUser({ data: data?.user }));
                    if (data.amount == 0 || data.amount == null || !data.amount) {
                         return ResToast({ title: 'Account Created', type: 'success' });
                    } else {
                         return ResToast({ title: 'Payment Comfirmed', type: 'success' });
                    }
               } else {
                    return ResToast({ title: 'Payment Failed! please try again', type: 'warning' });
               }
          } catch (error) {
               console.error('Payment failed:', error);
               throw error;
          }
     };

     return { handleBuyPlanAPI, isLoading };
};

// Verify Apple In-App Purchase (iOS)
export const useVerifyApplePurchaseHandler = () => {
     const [VerifyApplePurchaseAPI, { isLoading }] = useVerifyApplePurchaseMutation();

     const dispatch = useDispatch();

     interface VerifyApplePurchaseData {
          planId: string;
          transactionId: string;
          user: any; // login response (route.params.user), jis mein user.user._id hota hai
     }

     // true = backend ne Apple se verify karke subscription activate kar di
     // false = verification fail hui (transaction finish nahi karni, Apple dobara deliver karega)
     const verifyApplePurchase = async ({
          planId,
          transactionId,
          user,
     }: VerifyApplePurchaseData): Promise<boolean> => {
          try {
               const userId = user?.user?._id;

               if (!userId || !planId || !transactionId) {
                    ResToast({ title: 'Purchase details missing. Please try again', type: 'warning' });
                    return false;
               }

               const res = await VerifyApplePurchaseAPI({ userId, planId, transactionId });

               if (!res.error) {
                    // Existing Stripe flow ki tarah user ko app ke andar bhejo
                    dispatch(authUser({ data: user }));
                    ResToast({ title: 'Subscription activated', type: 'success' });
                    return true;
               }

               ResToast({ title: 'Purchase verification failed! please try again', type: 'warning' });
               return false;
          } catch (error) {
               console.error('Apple purchase verification failed:', error);
               ResToast({ title: 'Purchase verification failed! please try again', type: 'warning' });
               return false;
          }
     };

     return { verifyApplePurchase, isLoading };
};

// Get Subscribed Plan
export const useGetSubscribedPlanHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id || '';
     const GetSubscribedPlan = useGetSubscriptionDetailQuery(userId);
     const GetSubscribedPlanData = GetSubscribedPlan.data;
     const GetSubscribedPlanLoading = GetSubscribedPlan.isLoading;
     const { isError, error, refetch, isFetching } = GetSubscribedPlan;

     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Plan' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { GetSubscribedPlanData, GetSubscribedPlanLoading, isError, error, refetch, isFetching };
};