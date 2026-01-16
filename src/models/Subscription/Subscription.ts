import ResToast from '../../components/ResToast/ResToast';
import { useCreateIntendMutation } from '../../redux/Subscription/Subscription';

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
