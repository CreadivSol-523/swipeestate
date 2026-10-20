import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetMatchesHandler } from '../../models/Matches/Matches';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import Ismessage from '../../components/IsMessage/Ismessage';
import PropertyCardSkeleton from '../../components/Skeletons/PropertyCardSkeleton';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import { useAuth } from '../../utils/Storage/Storage';

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
     title: string;
}

type FilterValue = 'All' | 'Requested' | 'Matched' | '';

const FILTER_OPTIONS: { label: string; value: FilterValue }[] = [
     { label: 'All', value: 'All' },
     { label: 'Requested', value: 'Requested' },
     { label: 'Matched', value: 'Matched' },
];

// Status -> semantic color, consistent with how Home screen uses
// colors.PrimaryColor for its own "active" accents.
const getStatusStyle = (status: string) => {
     switch (status) {
          case 'Matched':
               return { bg: '#E7F7EE', text: '#15803D', dot: '#22C55E' };
          case 'Rejected':
               return { bg: '#FDECEC', text: '#DC2626', dot: '#EF4444' };
          case 'Requested':
          default:
               return { bg: '#FFF4E5', text: '#B45309', dot: '#F59E0B' };
     }
};

const Matches = ({ navigation }: { navigation: Navigation }) => {
     const [matches, setMatches] = useState<UserMatch[]>([]);
     const [matchesDetail, setMatchesDetail] = useState<any[]>([]);
     const [page, setPage] = useState(1);
     const [loader, setLoader] = useState(false);
     const [filter, setFilter] = useState<FilterValue>('');
     const [filterMenuOpen, setFilterMenuOpen] = useState(false);

     const handleNavigate = (id: string) => {
          const filterApartment = matchesDetail?.find((item: any) => item?._id === id);
          // console.log({ filterApartment, matchID: filterApartment?._id });
          navigation.navigate('AgentMatchDetail', { filterApartment, matchID: filterApartment?._id });
     };

     const { GetMatches, GetMatchesData, GetMatchesLoading, refetch, isFetching, isError } = useGetMatchesHandler({
          page,
          search: filter === 'All' ? '' : filter,
     });

     const { userData } = useAuth();
     const userId = userData?._id;

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

     const handleSelectFilter = (value: FilterValue) => {
          setFilter(value);
          setMatches([]);
          setMatchesDetail([]);
          setPage(1);
          refetch();
          setFilterMenuOpen(false);
     };
     console.log(GetMatches, 'GetMatchesGetMatchesGetMatchesGetMatches');
     const structuredMatches = (): UserMatch[] | undefined => {
          if (!GetMatches?.data?.matches?.length) return;

          return (GetMatches.data.matches || []).map((item: any) => ({
               id: item?.buyer?._id ?? item?.seller?._id,
               apartmentID: item?._id,
               name: item?.buyer?.name ?? item?.seller?.name,
               address: item?.buyer?.address ?? item?.seller?.address,
               phone: item?.buyer?.phone ?? item?.seller?.phone,
               selectedIncome: item?.buyer?.selectedIncome ?? item?.seller?.selectedIncome,
               creditScore: item?.buyer?.creditScore ?? item?.seller?.creditScore,
               image: item?.buyer?.profilePicture ?? item?.seller?.profilePicture,
               status: item?.status,
               title: item?.property?.title,
               rejectedBy: item?.rejectedBy?.buyerId,
               matchLikedBy: item?.matchLikedBy?.buyerId,
          }));
     };

     useEffect(() => {
          if (GetMatches?.data?.matches?.length == 0 || GetMatchesLoading || isFetching) return;

          const newMatches = structuredMatches();
          const newMatchesDetails = GetMatchesData?.matches;

          setMatches(prev => {
               const map = new Map();
               prev.forEach(item => map.set(item.apartmentID, item));
               newMatches?.forEach(item => map.set(item.apartmentID, item));
               return Array.from(map.values());
          });

          setMatchesDetail((prev: any[]) => {
               const map = new Map();
               prev.forEach(item => map.set(item._id, item));
               newMatchesDetails?.forEach((item: any) => map.set(item._id, item));
               return Array.from(map.values());
          });
     }, [GetMatches, isFetching]);

     const activeFilterLabel = useMemo(() => FILTER_OPTIONS.find(f => f.value === filter)?.label, [filter]);

     // console.log((GetMatches?.data?.matches as any)?.rejectedBy?.buyerId == userId);
     // console.log(GetMatches?.data);
     // console.log(userId);

     const renderMatchCard = ({ item }: { item: UserMatch }) => {
          const statusStyle = getStatusStyle(item.status);
          console.log(item, 'itemitemitem');
          return (
               <View style={styles.card}>
                    {/* Image Section */}
                    <View style={styles.imageSection}>
                         <Image source={{ uri: item.image }} style={styles.cardImage} />
                         <View style={styles.gradientOverlay} />

                         <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                              <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
                              <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                         </View>

                         <Text style={styles.nameOverlayText} numberOfLines={1}>
                              {item.name}
                         </Text>
                    </View>

                    {/* Content Section */}
                    <View style={styles.cardContent}>
                         <View style={styles.likedForRow}>
                              <View style={styles.likedForBadge}>
                                   <Text style={styles.likedForBadgeText}>Liked for</Text>
                              </View>
                              <Text style={styles.likedForValue} numberOfLines={1}>
                                   {item?.title}
                              </Text>
                         </View>

                         {(item as any)?.rejectedBy == userId ? null : (
                              <View style={styles.detailsGrid}>
                                   <View style={styles.detailBox}>
                                        <Ionicons name="cash-outline" size={20} color={colors.PrimaryColor} />
                                        <Text style={styles.detailValue} numberOfLines={1}>
                                             {item.selectedIncome}
                                        </Text>
                                        <Text style={styles.detailLabel}>Income</Text>
                                   </View>

                                   <View style={styles.detailDivider} />

                                   <View style={styles.detailBox}>
                                        <Ionicons name="trophy-outline" size={20} color={colors.PrimaryColor} />
                                        <Text style={styles.detailValue} numberOfLines={1}>
                                             {item.creditScore}
                                        </Text>
                                        <Text style={styles.detailLabel}>Credit score</Text>
                                   </View>
                              </View>
                         )}
                         <TouchableOpacity
                              style={[styles.profileButton, { marginTop: (item as any)?.rejectedBy == userId ? 10 : 0 }]}
                              activeOpacity={0.85}
                              onPress={() => handleNavigate(item.apartmentID)}
                         >
                              <Text style={styles.profileButtonText}>View detail</Text>
                              <Ionicons name="arrow-forward" size={16} color="#fff" />
                         </TouchableOpacity>
                    </View>
               </View>
          );
     };

     return (
          <View style={styles.container}>
               <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 10 }}>
                    {/* Header */}
                    <View style={styles.header}>
                         <Text style={styles.headerTitle}>Matches</Text>
                         <Text style={styles.headerSubtitle}>{matches.filter(m => m.status !== 'Rejected').length} potential matches</Text>
                    </View>

                    {/* Filter bar — same chip + overlay pattern as Home */}
                    <View style={styles.filterWrapper}>
                         <View style={styles.filterBar}>
                              <TouchableOpacity style={[styles.filterChip, filterMenuOpen && styles.filterChipActive]} activeOpacity={0.8} onPress={() => setFilterMenuOpen(v => !v)}>
                                   <Ionicons name="filter" size={15} color={filterMenuOpen ? '#fff' : colors.PrimaryColor} />
                                   <Text style={[styles.filterChipText, filterMenuOpen && styles.filterChipTextActive]}>{activeFilterLabel || 'Filter'}</Text>
                                   <Ionicons name={filterMenuOpen ? 'chevron-up' : 'chevron-down'} size={14} color={filterMenuOpen ? '#fff' : '#9CA3AF'} />
                              </TouchableOpacity>
                         </View>

                         {filterMenuOpen && (
                              <>
                                   <TouchableOpacity style={styles.overlayBackdrop} activeOpacity={1} onPress={() => setFilterMenuOpen(false)} />
                                   <View style={styles.filterOverlay}>
                                        {FILTER_OPTIONS.map(opt => (
                                             <TouchableOpacity key={opt.value} style={styles.overlayRow} onPress={() => handleSelectFilter(opt.value)}>
                                                  <Text style={styles.overlayRowText}>{opt.label}</Text>
                                                  {filter === opt.value && <Ionicons name="checkmark" size={16} color={colors.PrimaryColor} />}
                                             </TouchableOpacity>
                                        ))}
                                   </View>
                              </>
                         )}
                    </View>
               </View>

               {/* Matches List */}
               {matches?.length === 0 && !isFetching && !GetMatchesLoading ? (
                    <Ismessage text="No matches available" />
               ) : (
                    <FlatList
                         data={matches.filter(m => m.status !== 'Rejected')}
                         renderItem={renderMatchCard}
                         contentContainerStyle={styles.listContent}
                         keyExtractor={item => item?.apartmentID?.toString()}
                         showsVerticalScrollIndicator={false}
                         onEndReached={handleIncreasePage}
                         onEndReachedThreshold={0.5}
                         refreshControl={<RefreshControl onRefresh={onRefresh} colors={[colors.PrimaryColor]} refreshing={loader} />}
                         ListFooterComponent={
                              !isError && (isFetching || GetMatchesLoading) ? (
                                   <>
                                        {Array.from({ length: 3 }).map((_, i) => (
                                             <PropertyCardSkeleton key={i + 1} />
                                        ))}
                                   </>
                              ) : null
                         }
                    />
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     header: {
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 4,
     },
     headerTitle: {
          fontSize: 24,
          fontFamily: Font.font500,
          color: '#000',
     },
     headerSubtitle: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#666',
          marginTop: 2,
     },
     filterWrapper: {
          zIndex: 20,
     },
     filterBar: {
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
     },
     filterChip: {
          // unchanged
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 38,
          paddingHorizontal: 14,
          borderRadius: 19,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E0E0E0',
     },
     filterChipActive: {
          backgroundColor: colors.PrimaryColor,
          borderColor: colors.PrimaryColor,
     },
     filterChipText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: '#333',
     },
     filterChipTextActive: {
          color: '#fff',
     },
     likedForRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
     },
     likedForBadge: {
          backgroundColor: '#F0F7FF',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 14,
     },
     likedForBadgeText: {
          fontSize: 12,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
          textTransform: 'uppercase',
     },
     likedForValue: {
          flex: 1,
          fontSize: 15,
          fontFamily: Font.font400,
          color: '#111827',
     },
     overlayBackdrop: {
          position: 'absolute',
          top: -1000,
          left: -1000,
          right: -1000,
          bottom: -1000,
          zIndex: 15,
     },
     filterOverlay: {
          // was `top: 102` (a hardcoded guess) — now `top: '100%'` means
          // "right after the filterBar ends", correct on every screen size
          position: 'absolute',
          top: '80%',
          right: 20,
          width: 180,
          marginTop: 0,
          backgroundColor: '#fff',
          borderRadius: 16,
          paddingVertical: 6,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          zIndex: 20,
     },
     overlayRow: {
          // unchanged
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 13,
     },
     overlayRowText: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#333',
     },
     listContent: {
          paddingBottom: 120,
          paddingHorizontal: 16,
          paddingTop: 8,
          gap: 16,
     },
     card: {
          borderRadius: 20,
          backgroundColor: '#fff',
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          overflow: 'hidden',
     },
     imageSection: {
          height: 170,
          position: 'relative',
          backgroundColor: '#F0F0F0',
     },
     cardImage: {
          width: '100%',
          height: '100%',
     },
     gradientOverlay: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.25)',
     },
     statusBadge: {
          position: 'absolute',
          top: 14,
          right: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 20,
     },
     statusDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
     },
     statusText: {
          fontSize: 11,
          fontFamily: Font.font500,
     },
     nameOverlayText: {
          position: 'absolute',
          bottom: 14,
          left: 16,
          right: 16,
          fontSize: 19,
          fontFamily: Font.font500,
          color: '#fff',
     },
     cardContent: {
          padding: 16,
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 8,
     },
     locationText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#666',
          flex: 1,
     },
     detailsGrid: {
          flexDirection: 'row',
          backgroundColor: '#F8F9FA',
          borderRadius: 14,
          paddingVertical: 14,
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 14,
     },
     detailBox: {
          flex: 1,
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 4,
     },
     detailDivider: {
          width: 1,
          height: 36,
          backgroundColor: '#E0E0E0',
     },
     detailValue: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: '#000',
     },
     detailLabel: {
          fontSize: 11,
          fontFamily: Font.font400,
          color: '#999',
     },
     profileButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: colors.PrimaryColor,
          paddingVertical: 13,
          borderRadius: 24,
     },
     profileButtonText: {
          color: '#fff',
          fontSize: 14,
          fontFamily: Font.font500,
     },
});

export default Matches;
