import { NavigationProp, useNavigation } from '@react-navigation/native';
import ResToast from '../../components/ResToast/ResToast';
import { useBuyPlanMutation, useGetPlanQuery } from '../../redux/Plan/Plan';
import { RequestBuyPlan } from '../../redux/Plan/PlanTypes';
import { useDispatch } from 'react-redux';
import { authUser } from '../../redux/Features/authState';

// Get Plan
export const useGetPlanHandler = ({ interval }: { interval: string }) => {
     const GetPlan = useGetPlanQuery({ interval });
     const PlanData = GetPlan.data;
     const PlanLoading = GetPlan.isLoading;
     const { isError, error, refetch, isFetching } = GetPlan;

     if (isError) {
          ResToast({ type: 'danger', title: 'Failed to fetch Plan' });
     }

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
               console.log(res);
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
