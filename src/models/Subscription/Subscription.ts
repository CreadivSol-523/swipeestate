import ResToast from '../../components/ResToast/ResToast';
import { useCreateIntendMutation, useDownGradeSubsMutation, useGetSubscriptionQuery } from '../../redux/Subscription/Subscription';
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

     const handleDownGradePlanAPI = async (downgradeTo: string) => {
          console.log(downgradeTo, 'downgradeTodowngradeTo');
          try {
               console.log(downgradeTo, 'amount');
               if (downgradeTo === undefined || downgradeTo === null || downgradeTo === '') {
                    return ResToast({
                         title: 'Please Select your subscription',
                         type: 'warning',
                    });
               }
               const res = await DownGradePlanAPI({
                    userId: userId,
                    downgradeTo: downgradeTo,
               });
               console.log(res, 'response');
               if (res.error) {
                    return ResToast({ title: (res.error as any)?.data?.message || 'Please try again', type: 'danger' });
               } else {
                    return ResToast({ title: 'Plan Downgraded Successfully', type: 'success' });
               }
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
     console.log(userId);
     const GetSubscription = useGetSubscriptionQuery(userId, { skip: !userId });
     const GetSubscriptionData = GetSubscription?.data?.plan;
     const GetSubscriptionLoading = GetSubscription.isLoading;
     const { isError, error, refetch } = GetSubscription;

     if (isError) {
          ResToast({ type: 'danger', title: 'Failed to fetch Profile Details' });
     }

     return { GetSubscription, GetSubscriptionLoading, GetSubscriptionData, isError, error, refetch };
};
