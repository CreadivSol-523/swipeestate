import { useEffect, useRef } from 'react';
import ResToast from '../../components/ResToast/ResToast';
import { useCreateIntendMutation, useDownGradeSubsMutation, useGetSubscriptionQuery, useUpGradeSubsMutation } from '../../redux/Subscription/Subscription';
import { useAuth } from '../../utils/Storage/Storage';

export const useCreateIntendHandler = () => {
     const [CreateIntendAPI, { isLoading }] = useCreateIntendMutation();

     const handleCreateIntendAPI = async (amount: number | undefined | null) => {
          try {
               if (amount === undefined || amount === null) {
                    return ResToast({
                         title: 'All Field Required',
                         type: 'warning',
                    });
               }
               const res = await CreateIntendAPI({
                    amount: amount,
               });
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
          try {
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
               console.log(res, "Downgrade Payment Response")
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
     const GetSubscription = useGetSubscriptionQuery(userId, { skip: !userId });
     const GetSubscriptionData = GetSubscription?.data?.plan;
     const GetSubscriptionLoading = GetSubscription.isLoading;
     const { isError, error, refetch } = GetSubscription;
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Profile Details' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { GetSubscription, GetSubscriptionLoading, GetSubscriptionData, isError, error, refetch };
};

export const useUpGradePlanHandler = () => {
     const [UpGradePlanAPI, { isLoading }] = useUpGradeSubsMutation();
     const { userData } = useAuth();
     const userId = userData?._id;

     const handleUpGradePlanAPI = async ({ upgradeTo, paymentMethodId }: { upgradeTo: string; paymentMethodId: string }) => {
          try {
               if (upgradeTo === undefined || upgradeTo === null || upgradeTo === '' || paymentMethodId === undefined || paymentMethodId === null || paymentMethodId === '') {
                    return ResToast({
                         title: 'Please Select your subscription',
                         type: 'warning',
                    });
               }
               const res = await UpGradePlanAPI({
                    userId: userId,
                    upgradeTo: upgradeTo,
                    paymentMethodId: paymentMethodId,
               });
               console.log(res, "Upgrade Payment Response")

               if (res.error) {
                    return ResToast({ title: (res.error as any)?.data?.message || 'Please try again', type: 'danger' });
               } else {
                    return ResToast({ title: 'Plan Upgraded Successfully', type: 'success' });
               }
          } catch (error) {
               console.error('Update Profile failed:', error);
               throw error;
          }
     };
     return { handleUpGradePlanAPI, isLoading };
};
