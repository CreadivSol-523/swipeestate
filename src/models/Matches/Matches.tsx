import ResToast from '../../components/ResToast/ResToast';
import {
     useAcceptMatchMutation,
     useCreateLikeMutation,
     useGetApartmentsQuery,
     useGetBuyersQuery,
     useGetMatchesQuery,
     useRejectMatchMutation,
     useSinglePropertyQuery,
} from '../../redux/Matches/MatcheSlice';
import { useAuth } from '../../utils/Storage/Storage';

// Get Apartment
export const useGetApartmentsHandler = ({ page, limit, key, gte, lte }: { page?: number; limit?: number; key?: string; gte?: number; lte?: number }) => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetApartments = useGetApartmentsQuery({ userID: userId, limit, page, key, gte, lte });
     const ApartmentsData = GetApartments.data;
     const ApartmentsLoading = GetApartments.isLoading;
     const { isError, error, refetch, isFetching } = GetApartments;

     if (isError) {
          ResToast({ type: 'danger', title: 'Failed to fetch Apartments' });
     }

     return { GetApartments, ApartmentsData, ApartmentsLoading, isError, error, refetch, isFetching };
};

// Get Matches
export const useGetMatchesHandler = ({ page = 1, limit = 4, search }: { page?: number; limit?: number; search?: string }) => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetMatches = useGetMatchesQuery({ userId, limit, page, search });
     console.log({ search, GetMatches });
     const GetMatchesData = GetMatches.data;
     const GetMatchesLoading = GetMatches.isLoading;
     const { isError, error, refetch, isFetching } = GetMatches;

     if (isError) {
          ResToast({ type: 'danger', title: 'Failed to fetch Apartments' });
     }

     return { GetMatches, GetMatchesData, GetMatchesLoading, isError, error, refetch, isFetching };
};

// Create Like
export const useCreateLikeHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const [CreateApartmentAPI, { isLoading }] = useCreateLikeMutation();

     const handleCreateLikeAPI = async (propertyId: string) => {
          console.log(propertyId);
          try {
               const res = await CreateApartmentAPI({ propertyId, userID: userId });
               console.log(res);

               if (!res.error) {
                    console.log('Property Liked');
               } else {
                    console.log('Error');
               }
          } catch (error) {
               console.error('Payment failed:', error);
               throw error;
          }
     };

     return { handleCreateLikeAPI, isLoading };
};

// Reject property
export const useRejectPropertyHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const [RejectPropertyAPI, { isLoading }] = useRejectMatchMutation();

     const handleRejectPropertyAPI = async (propertyId: string) => {
          console.log(propertyId);
          try {
               const res = await RejectPropertyAPI({ propertyId, userId: userId });
               console.log(res);

               if (!res.error) {
                    console.log('Property Reject');
               } else {
                    console.log('Error');
               }
          } catch (error) {
               console.error('Payment failed:', error);
               throw error;
          }
     };

     return { handleRejectPropertyAPI, isLoading };
};

// Accept property
export const useAcceptPropertyHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const [AcceptPropertyAPI, { isLoading }] = useAcceptMatchMutation();

     const handleRejectPropertyAPI = async (matchId: string) => {
          console.log(matchId);
          try {
               const res = await AcceptPropertyAPI({ matchId, userId: userId });
               console.log(res);

               if (!res.error) {
                    console.log('Property Accept');
               } else {
                    console.log('Error');
                    ResToast({ title: (res?.error as any)?.data?.message || "You doesn't have enough matches", type: 'warning' });
               }
          } catch (error) {
               console.error('Payment failed:', error);
               throw error;
          }
     };

     return { handleRejectPropertyAPI, isLoading };
};

// Get Matches
export const useGetBuyersHandler = ({ page = 1, limit = 4 }: { page?: number; limit?: number }) => {
     const GetBuyers = useGetBuyersQuery({ limit, page });
     const GetBuyersData = GetBuyers.data;
     const GetBuyersLoading = GetBuyers.isLoading;
     const { isError, error, refetch, isFetching } = GetBuyers;

     if (isError) {
          ResToast({ type: 'danger', title: 'Failed to fetch Buyers' });
     }

     return { GetBuyers, GetBuyersData, GetBuyersLoading, isError, error, refetch, isFetching };
};

// Get Single Apartment Matches
export const useGetSingleApartmentHandler = ({ propertyId }: { propertyId?: string }) => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetSingleApartment = useSinglePropertyQuery({ sellerId: userId, propertyId });
     const GetSingleApartmentData = GetSingleApartment.data;
     const GetBuyersLoading = GetSingleApartment.isLoading;
     const { isError, error, refetch, isFetching } = GetSingleApartment;
     console.log(GetSingleApartment);
     if (isError) {
          ResToast({ type: 'danger', title: 'Failed to fetch Apartments' });
     }

     return { GetSingleApartment, GetSingleApartmentData, GetBuyersLoading, isError, error, refetch, isFetching };
};
