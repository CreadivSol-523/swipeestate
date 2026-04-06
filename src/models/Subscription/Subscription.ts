import ResToast from '../../components/ResToast/ResToast';
import {
     useCreateIntendMutation,
     useDownGradeSubsMutation,
     useGetSubscriptionQuery,
     useUpgradeSubsMutation,
} from '../../redux/Subscription/Subscription';
import { useAuth } from '../../utils/Storage/Storage';

export const useCreateIntendHandler = () => {
     const [CreateIntendAPI, { isLoading }] = useCreateIntendMutation();

     const handleCreateIntendAPI = async (amount: number | undefined | null) => {
          try {
               console.log(amount, 'amount');
               if (amount === undefined || amount === null) {
                    return ResToast({
                         title: 'All Field Required',
                         type: 'warning',
                    });
               }
               const res = await CreateIntendAPI({
                    amount: amount,
               });
               console.log(res, 'response');
               if (res.error) {
                    return ResToast({ title: 'Please try again', type: 'danger' });
               } else {
                    return { paymentIntend: res?.data?.getPaymentIntent, id: res?.data?.id, res: res };
               }
          } catch (error) {
               console.error('Update Profile failed:', error);
               throw error;
          }
     };
     return { handleCreateIntendAPI, isLoading };
};

export const useDownGradePlanHandler = () => {
     const [DownGradePlanAPI, { isLoading }] = useDownGradeSubsMutation();
     const { userData } = useAuth();
     const userId = userData?._id;

     const handleDownGradePlanAPI = async (downgradeTo: string): Promise<boolean> => {
          try {
               if (downgradeTo === undefined || downgradeTo === null || downgradeTo === '') {
                    ResToast({
                         title: 'Please Select your subscription',
                         type: 'warning',
                    });
                    return false;
               }
               if (!userId) {
                    ResToast({ title: 'Not signed in', type: 'danger' });
                    return false;
               }
               const res = await DownGradePlanAPI({
                    userId,
                    downgradeTo,
               });
               if (res.error) {
                    ResToast({ title: (res.error as any)?.data?.message || 'Please try again', type: 'danger' });
                    return false;
               }
               ResToast({
                    title: (res.data as { message?: string })?.message || 'Downgrade request saved',
                    type: 'success',
               });
               return true;
          } catch (error) {
               console.error('Update Profile failed:', error);
               throw error;
          }
     };
     return { handleDownGradePlanAPI, isLoading };
};

export const useGetSubscriptionHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetSubscription = useGetSubscriptionQuery(userId ?? '', { skip: !userId });
     const GetSubscriptionData = GetSubscription?.data?.plan;
     const GetSubscriptionLoading = GetSubscription.isLoading;
     const { isError, error, refetch } = GetSubscription;

     return { GetSubscription, GetSubscriptionLoading, GetSubscriptionData, isError, error, refetch };
};

export const useUpgradePlanHandler = () => {
     const [upgradeApi, { isLoading }] = useUpgradeSubsMutation();
     const { userData } = useAuth();
     const userId = userData?._id;

     const handleUpgradePlanAPI = async (upgradeTo: string, receipt: string): Promise<boolean> => {
          try {
               if (!userId || !upgradeTo || !receipt) {
                    ResToast({
                         title: 'Missing subscription or receipt. Try the purchase again.',
                         type: 'warning',
                    });
                    return false;
               }
               const res = await upgradeApi({ userId, upgradeTo, receipt });
               if (res.error) {
                    ResToast({
                         title: (res.error as { data?: { message?: string } })?.data?.message || 'Upgrade failed',
                         type: 'danger',
                    });
                    return false;
               }
               ResToast({
                    title: res.data?.message || 'Subscription updated',
                    type: 'success',
               });
               return true;
          } catch (e) {
               console.error('Upgrade failed:', e);
               throw e;
          }
     };

     return { handleUpgradePlanAPI, isLoading };
};
