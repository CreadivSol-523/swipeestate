import { useEffect, useRef } from 'react';
import ResToast from '../../components/ResToast/ResToast';
import {
     useAcceptMatchMutation,
     useCreateLikeMutation,
     useGetApartmentsQuery,
     useGetBuyersQuery,
     useGetMatchesQuery,
     useGetSingleAppartmentQuery,
     useRejectedBySellerMutation,
     useRejectMatchMutation,
     useSinglePropertyQuery,
     useUnlockContactByBuyerMutation,
} from '../../redux/Matches/MatcheSlice';
import { useAuth } from '../../utils/Storage/Storage';

// Get Apartment
export const useGetApartmentsHandler = ({ page, limit, key, gte, lte, status }: { page?: number; limit?: number; key?: string; gte?: number; lte?: number; status?: string }) => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetApartments = useGetApartmentsQuery({ userID: userId, limit, page, key, gte, lte, status });
     const ApartmentsData = GetApartments.data;
     const ApartmentsLoading = GetApartments.isLoading;
     const { isError, error, refetch, isFetching } = GetApartments;
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Apartments' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { GetApartments, ApartmentsData, ApartmentsLoading, isError, error, refetch, isFetching };
};

// Get Matches
export const useGetMatchesHandler = ({ page = 1, limit = 10, search }: { page?: number; limit?: number; search?: string }) => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetMatches = useGetMatchesQuery({ userId, limit, page, search });
     const GetMatchesData = GetMatches.data;
     const GetMatchesLoading = GetMatches.isLoading;
     const { isError, error, refetch, isFetching } = GetMatches;
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Apartments' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { GetMatches, GetMatchesData, GetMatchesLoading, isError, error, refetch, isFetching };
};

// Create Like
export const useCreateLikeHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const [CreateApartmentAPI, { isLoading }] = useCreateLikeMutation();
     console.log(userId);
     const handleCreateLikeAPI = async (propertyId: string) => {
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

     console.log(userId, 'Reject API ID');

     const handleRejectPropertyAPI = async (propertyId: string) => {
          try {
               console.log(propertyId);
               const res = await RejectPropertyAPI({ propertyId, userId: userId });
               console.log(res, 'resresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresres');
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

     console.log(userId, 'Accept API ID');

     const handleAcceptPropertyAPI = async (matchId: string) => {
          try {
               const res = await AcceptPropertyAPI({ matchId, userId: userId });

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

     return { handleAcceptPropertyAPI, isLoading };
};

// Get Matches
export const useGetBuyersHandler = ({ page = 1, limit = 4 }: { page?: number; limit?: number }) => {
     const GetBuyers = useGetBuyersQuery({ limit, page });
     const GetBuyersData = GetBuyers.data;
     const GetBuyersLoading = GetBuyers.isLoading;
     const { isError, error, refetch, isFetching } = GetBuyers;
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Buyers' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

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
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch Apartments' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { GetSingleApartment, GetSingleApartmentData, GetBuyersLoading, isError, error, refetch, isFetching };
};

// Reject property
export const useRejectBySellerHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const [RejectBySellerAPI, { isLoading }] = useRejectedBySellerMutation();

     console.log(userId, 'Reject API ID');

     const handleRejectBySellerAPI = async (matchId: string) => {
          try {
               console.log(matchId);
               const res = await RejectBySellerAPI({ matchId, userId: userId });
               console.log(res, 'resresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresres');
               if (!res.error) {
                    console.log('Match Reject');
               } else {
                    console.log('Error');
               }
          } catch (error) {
               console.error('Payment failed:', error);
               throw error;
          }
     };

     return { handleRejectBySellerAPI, isLoading };
};

// unlock contact
export const useUnlockContactHandler = () => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const [UnlockContactAPI, { isLoading }] = useUnlockContactByBuyerMutation();

     console.log(userId, 'Reject API ID');

     const handleUnlockContactAPI = async (matchId: string) => {
          try {
               console.log(matchId);
               const res = await UnlockContactAPI({ matchId, userId: userId });
               console.log(res, 'resresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresres');
               if (!res.error) {
                    console.log('Contact Unlocked');
               } else {
                    ResToast({ res });
                    console.log(res);
               }
          } catch (error) {
               console.error('Payment failed:', error);
               throw error;
          }
     };

     return { handleUnlockContactAPI, isLoading };
};

// Get Single Match
export const useGetSingleMatchHandler = (matchId: string) => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetSingleMatch = useGetSingleAppartmentQuery({ matchId, userId });
     const GetSingleMatchData = GetSingleMatch.data;
     const GetSingleMatchLoading = GetSingleMatch.isLoading;
     const { isError, error, refetch, isFetching } = GetSingleMatch;
     const hasShownError = useRef(false);

     useEffect(() => {
          if (isError && !hasShownError.current) {
               hasShownError.current = true;
               ResToast({ type: 'danger', title: 'Failed to fetch match' });
          } else if (!isError) {
               hasShownError.current = false;
          }
     }, [isError]);

     return { GetSingleMatch, GetSingleMatchData, GetSingleMatchLoading, isError, error, refetch, isFetching };
};
