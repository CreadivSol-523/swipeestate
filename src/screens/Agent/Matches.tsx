import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Apartment } from '../../redux/Matches/MatchType';
import { useGetMatchesHandler } from '../../models/Matches/Matches';
import API_BASE_URL from '../../utils/Config';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import Ismessage from '../../components/IsMessage/Ismessage';
import PropertyCardSkeleton from '../../components/Skeletons/PropertyCardSkeleton';
import colors from '../../assests/Colors/Colors';

interface UserMatch {
     id: string;
     apartmentID: string;
     name: string;
     address: string;
     phone: string;
     selectedIncome: string;
     creditScore: string;
     image: string;
     status: string;
}

const Matches = ({ navigation }: { navigation: Navigation }) => {
     const [matches, setMatches] = useState<UserMatch[] | undefined>([]);
     const [matchesDetail, setMatchesDetail] = useState<any>([]);
     const [page, setPage] = useState(1);
     const [loader, setLoader] = useState(false);

     const [filter, setFilter] = useState<'Requested' | 'Matched' | 'Rejected' | 'All' | ''>('');

     const handleNavigate = (id: string) => {
          const filterApartment = matchesDetail?.find((item: any) => item?._id === id);
          navigation.navigate('AgentMatchDetail', { filterApartment });
     };

     const renderMatchCard = (item: any) => {
          const match = item?.item;
          return (
               <View key={match.apartmentID} style={styles.card}>
                    {/* Image Section */}
                    <View style={styles.imageContainer}>
                         <Image source={{ uri: match.image }} style={styles.image} />
                         <View style={styles.imageOverlay} />
                         <View style={styles.verifiedBadge}>
                              <Text style={styles.verifiedText}>{match.status}</Text>
                         </View>
                    </View>

                    {/* Content Section */}
                    <View style={styles.cardContent}>
                         {/* Name */}
                         <Text style={styles.name}>{match.name}</Text>

                         {/* Address */}
                         <View style={styles.row}>
                              <Ionicons name="location" size={16} color="#666" />
                              <Text style={styles.address}>{match.address}</Text>
                         </View>

                         {/* Phone */}
                         <View style={styles.row}>
                              <Ionicons name="call" size={16} color="#666" />
                              <Text style={styles.phone}>{match.phone}</Text>
                         </View>

                         {/* Income & Credit Score */}
                         <View style={styles.statsContainer}>
                              <View style={styles.statBox}>
                                   <View style={styles.statHeader}>
                                        <Ionicons name="cash-outline" size={18} color="#3B82F6" />
                                        <Text style={styles.statLabel}>Income</Text>
                                   </View>
                                   <Text style={styles.statValue}>{match.selectedIncome}</Text>
                              </View>

                              <View style={styles.statBox}>
                                   <View style={styles.statHeader}>
                                        <Ionicons name="trophy-outline" size={18} color="#8B5CF6" />
                                        <Text style={styles.statLabel}>Credit Score</Text>
                                   </View>
                                   <Text style={styles.statValue}>{match.creditScore}</Text>
                              </View>
                         </View>

                         {/* View Profile Button */}
                         <TouchableOpacity
                              style={styles.profileButton}
                              onPress={
                                   // () => navigation.navigate('MatchDetail', { item })
                                   () => handleNavigate(match?.apartmentID)
                              }
                         >
                              <Text style={styles.profileButtonText}>View Detail</Text>
                              <Ionicons name="arrow-forward" size={16} color="#fff" />
                         </TouchableOpacity>
                    </View>
               </View>
          );
     };

     const { GetMatches, GetMatchesData, GetMatchesLoading, refetch, isFetching, isError } = useGetMatchesHandler({ page, search: filter === 'All' ? '' : filter });

     const onRefresh = () => {
          setLoader(true);
          setPage(1);
          setMatches([]);
          setMatchesDetail([]);
          setFilter('All');
          refetch()?.finally(() => setLoader(false));
     };

     const handleIncreasePage = () => {
          if (GetMatchesData?.meta?.totalPages === page) return;
          if (GetMatches?.data?.matches?.length == 0 || GetMatchesLoading) return;
          setPage(prev => prev + 1);
     };

     const structuredMatches = (): UserMatch[] | undefined => {
          if (!GetMatches?.data?.matches?.length) return;

          const MatchesList: UserMatch[] = (GetMatches.data.matches || []).map(item => ({
               id: item?.buyer?._id,
               apartmentID: item?._id,
               name: item?.buyer?.name,
               address: item?.buyer?.address,
               phone: item?.buyer?.phone,
               selectedIncome: item?.buyer?.selectedIncome,
               creditScore: item?.buyer?.creditScore,
               image: API_BASE_URL + '/' + item?.buyer?.profilePicture,
               status: item?.status,
          }));

          return MatchesList;
     };

     useEffect(() => {
          // if (filter) {
          //      setMatches([]);
          //      setMatchesDetail([]);
          // }
          if (GetMatches?.data?.matches?.length == 0 || GetMatchesLoading || isFetching) return;

          const newMatches = structuredMatches();
          const newMatchesDetails = GetMatchesData?.matches;

          setMatches((prev: any) => {
               const map = new Map();

               // add old ones
               prev.forEach((item: any) => {
                    map.set(item.apartmentID, item);
               });

               // add new ones (duplicates auto-overwritten)
               newMatches?.forEach(item => {
                    map.set(item.apartmentID, item);
               });

               return Array.from(map.values());
          });

          setMatchesDetail((prev: any) => {
               const map = new Map();

               // add old ones
               prev.forEach((item: any) => {
                    map.set(item._id, item);
               });

               // add new ones (duplicates auto-overwritten)
               newMatchesDetails?.forEach(item => {
                    map.set(item._id, item);
               });

               return Array.from(map.values());
          });
     }, [GetMatches, isFetching]);

     console.log(isFetching, 'isFetchingisFetchingisFetching');

     return (
          <>
               {/* Header */}
               <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                    <View>
                         <Text style={styles.headerTitle}>Matches</Text>
                         <Text style={styles.headerSubtitle}>{matches?.length} potential matches</Text>
                    </View>
                    <View style={{ width: 150, top: 0, zIndex: 10000 }}>
                         <CustomDropdown
                              placeholder="Filter"
                              options={[
                                   { label: 'All', value: 'All' },
                                   { label: 'Requested', value: 'Requested' },
                                   { label: 'Matched', value: 'Matched' },
                                   { label: 'Rejected', value: 'Rejected' },
                              ]}
                              value={filter}
                              onValueChange={(value, label) => {
                                   setFilter(value as '' | 'Requested' | 'Matched' | 'Rejected');
                                   setMatches([]);
                                   setMatchesDetail([]);
                                   refetch();
                                   // handleData('acountType', value);
                              }}
                              iconName="info"
                              iconSize={18}
                              iconColor="#9CA3AF"
                              maxHeight={100}
                              height={100}
                         />
                    </View>
               </View>

               {/* Matches List */}
               {matches?.length === 0 && !isFetching && !GetMatchesLoading ? (
                    <Ismessage text="No matches available" />
               ) : (
                    <FlatList
                         data={matches}
                         renderItem={item => renderMatchCard(item)}
                         contentContainerStyle={{ paddingBottom: 100, gap: 20, padding: 16 }}
                         keyExtractor={item => item?.apartmentID.toString()}
                         showsVerticalScrollIndicator={false}
                         onEndReached={handleIncreasePage}
                         onEndReachedThreshold={0.5}
                         refreshControl={<RefreshControl onRefresh={onRefresh} colors={[colors.PrimaryColor]} refreshing={loader} />}
                         ListFooterComponent={
                              !isError && (isFetching || GetMatchesLoading) ? (
                                   <>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                             <PropertyCardSkeleton key={i + 1} />
                                        ))}
                                   </>
                              ) : null
                         }
                    />
               )}
          </>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F9FAFB',
     },
     header: {
          paddingHorizontal: 16,
     },
     headerTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          paddingTop: 25,

          color: '#1F2937',
     },
     headerSubtitle: {
          fontSize: 14,
          color: '#6B7280',
          marginTop: 4,
     },
     searchContainer: {
          backgroundColor: '#fff',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
     },
     searchBar: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: 25,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: '#E5E7EB',
     },
     searchInput: {
          flex: 1,
          marginLeft: 8,
          fontSize: 16,
          color: '#1F2937',
     },
     scrollView: {
          flex: 1,
     },
     scrollContent: {
          padding: 16,
          paddingBottom: 50,
     },
     card: {
          backgroundColor: '#fff',
          borderRadius: 16,
          marginBottom: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     imageContainer: {
          height: 200,
          position: 'relative',
     },
     image: {
          width: '100%',
          height: '100%',
     },
     imageOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.1)',
     },
     verifiedBadge: {
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: '#3B82F6',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
     },
     verifiedText: {
          color: '#fff',
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 4,
     },
     cardContent: {
          padding: 16,
     },
     name: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 8,
     },
     row: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 8,
     },
     address: {
          fontSize: 14,
          color: '#6B7280',
          marginLeft: 6,
          flex: 1,
     },
     phone: {
          fontSize: 14,
          color: '#6B7280',
          marginLeft: 6,
     },
     statsContainer: {
          flexDirection: 'row',
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          gap: 16,
     },
     statBox: {
          flex: 1,
          alignItems: 'center',
     },
     statHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
     },
     statLabel: {
          fontSize: 12,
          color: '#6B7280',
          marginLeft: 4,
     },
     statValue: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1F2937',
     },
     profileButton: {
          backgroundColor: '#3B82F6',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          borderRadius: 25,
          marginTop: 16,
     },
     profileButtonText: {
          color: '#fff',
          fontSize: 14,
          fontWeight: '600',
          marginRight: 8,
     },
     bottomNav: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          justifyContent: 'space-around',
          alignItems: 'center',
     },
     navItem: {
          alignItems: 'center',
          justifyContent: 'center',
     },
     navItemCenter: {
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -24,
     },
     centerButton: {
          backgroundColor: '#3B82F6',
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
     },
     navText: {
          fontSize: 10,
          color: '#999',
          marginTop: 4,
     },
     navTextActive: {
          color: '#3B82F6',
     },
});

export default Matches;
