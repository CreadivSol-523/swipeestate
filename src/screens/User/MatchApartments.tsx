import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { useGetMatchesHandler } from '../../models/Matches/Matches';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import PropertyCardSkeleton from '../../components/Skeletons/PropertyCardSkeleton';
import Ismessage from '../../components/IsMessage/Ismessage';
import MatchApartmentCardSkeleton from '../../components/Skeletons/MatchApartmentCardSkeleton';

interface Apartment {
     id: string;
     image: string;
     title: string;
     location: string;
     price: string;
     beds: string;
     baths: string;
     area: string;
     matchPercentage: string;
}

type FilterValue = 'Requested' | 'Matched' | 'Rejected' | '';

const FILTER_OPTIONS: { label: string; value: FilterValue }[] = [
     { label: 'All', value: '' },
     { label: 'Requested', value: 'Requested' },
     { label: 'Matched', value: 'Matched' },
     { label: 'Rejected', value: 'Rejected' },
];

const getStatusStyle = (status: string) => {
     switch (status) {
          case 'Matched':
               return { bg: '#ECFDF5', text: '#059669', dot: '#10B981' };
          case 'Rejected':
               return { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' };
          case 'Requested':
          default:
               return { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' };
     }
};

const formatPrice = (price: string): string => {
     const num = Number(price);
     if (!num || Number.isNaN(num)) return price;
     return `$${num.toLocaleString()}`;
};

const MatchApartments = ({ navigation }: { navigation: Navigation }) => {
     const [favorites, setFavorites] = useState<string[]>([]);
     const [matches, setMatches] = useState<Apartment[] | undefined>([]);
     const [matchesDetail, setMatchesDetail] = useState<any>([]);
     const [page, setPage] = useState(1);
     const [loader, setLoader] = useState(false);
     const [filter, setFilter] = useState<FilterValue>('');
     const [filterOpen, setFilterOpen] = useState(false);

     const { GetMatches, GetMatchesData, GetMatchesLoading, refetch, isFetching, isError } = useGetMatchesHandler({ page, search: filter, limit: 4 });
     console.log('API matches:', GetMatchesData?.matches);
     console.log('UI matches:', matches);
     const handleIncreasePage = () => {
          if (GetMatchesData?.meta?.totalPages === page) return;
          if (GetMatches?.data?.matches?.length == 0 || GetMatchesLoading) return;
          setPage(prev => prev + 1);
     };

     const structuredMatches = (): Apartment[] | undefined => {
          if (!GetMatches?.data?.matches?.length) return;

          const MatchesList: Apartment[] = (GetMatches.data.matches || []).map(item => ({
               id: item?._id ?? '',
               image: item?.property?.image ? item.property.image : '',
               title: item?.property?.title ?? '',
               location: item?.property?.location ?? '',
               price: item?.property?.price?.toString() ?? '',
               beds: item?.property?.bedrooms?.toString() ?? '',
               baths: item?.property?.bathrooms?.toString() ?? '',
               area: item?.property?.area?.toString() ?? '',
               matchPercentage: item?.status ?? 'Requested',
          }));

          return MatchesList;
     };

     useEffect(() => {
          // Important: filter changes can keep old cached data while a new request is in-flight.
          // To avoid stale items showing together (e.g., rejected showing while API returns requested only),
          // we only update the UI once fetching is complete.
          if (isFetching) return;

          const newMatches = structuredMatches() ?? [];
          const newMatchesDetails = GetMatchesData?.matches ?? [];

          // On first page (initial load / filter change), replace entirely so old status can't linger.
          if (page === 1) {
               setMatches(newMatches);
               setMatchesDetail(newMatchesDetails);
               return;
          }

          // For pagination (page > 1), append/merge only when we actually received new items.
          if (!newMatches.length) return;

          setMatches((prev: any) => {
               const map = new Map();
               prev.forEach((item: any) => {
                    map.set(item.id, item);
               });
               newMatches.forEach(item => {
                    map.set(item.id, item);
               });
               return Array.from(map.values());
          });

          setMatchesDetail((prev: any) => {
               const map = new Map();
               prev.forEach((item: any) => {
                    map.set(item._id, item);
               });
               newMatchesDetails.forEach(item => {
                    map.set(item._id, item);
               });
               return Array.from(map.values());
          });
     }, [GetMatchesData, isFetching, page]);

     const toggleFavorite = (id: string): void => {
          setFavorites(prev => (prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]));
     };

     const handleNavigate = (id: string) => {
          const filterApartment = matchesDetail?.find((item: any) => item?._id === id);
          navigation.navigate('MatchDetail', { filterApartment });
     };

     const applyFilter = (value: FilterValue) => {
          setFilter(value);
          setMatches([]);
          setMatchesDetail([]);
          setPage(1);
          setFilterOpen(false);
     };

     const onRefresh = () => {
          setLoader(true);
          setPage(1);
          setMatches([]);
          setFilter('');
          refetch().finally(() => setLoader(false));
     };

     const activeFilterLabel = FILTER_OPTIONS.find(opt => opt.value === filter)?.label ?? 'All';

     const renderItem = ({ item: apartment }: { item: Apartment }) => {
          const statusStyle = getStatusStyle(apartment.matchPercentage);
          const isFavorite = favorites.includes(apartment.id);

          return (
               <Pressable style={styles.card} onPress={() => handleNavigate(apartment.id)}>
                    <View style={styles.imageContainer}>
                         <Image source={{ uri: apartment.image }} style={styles.apartmentImage} resizeMode="cover" />

                         <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                              <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
                              <Text style={[styles.statusText, { color: statusStyle.text }]}>{apartment.matchPercentage}</Text>
                         </View>

                         <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(apartment.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                              <MaterialIcon name={isFavorite ? 'favorite' : 'favorite-border'} size={18} color={isFavorite ? '#EF4444' : '#9CA3AF'} />
                         </TouchableOpacity>
                    </View>

                    <View style={styles.cardContent}>
                         {!!apartment.title && <Text style={styles.apartmentTitle}>{apartment.title}</Text>}

                         <View style={styles.locationRow}>
                              <Icon name="map-pin" size={13} color={colors.PrimaryColor} />
                              <Text style={styles.locationText} numberOfLines={1}>
                                   {apartment.location}
                              </Text>
                         </View>

                         <View style={styles.featuresRow}>
                              <View style={styles.feature}>
                                   <Icon name="home" size={14} color="#6B7280" />
                                   <Text style={styles.featureText}>{apartment.beds} beds</Text>
                              </View>
                              <View style={styles.featureDivider} />
                              <View style={styles.feature}>
                                   <Icon name="droplet" size={14} color="#6B7280" />
                                   <Text style={styles.featureText}>{apartment.baths} baths</Text>
                              </View>
                              <View style={styles.featureDivider} />
                              <View style={styles.feature}>
                                   <Icon name="maximize" size={14} color="#6B7280" />
                                   <Text style={styles.featureText}>{apartment.area} sqft</Text>
                              </View>
                         </View>

                         <View style={styles.footer}>
                              <Text style={styles.price}>{formatPrice(apartment.price)}</Text>
                              <TouchableOpacity style={styles.viewButton} onPress={() => handleNavigate(apartment.id)}>
                                   <Text style={styles.viewButtonText}>View</Text>
                                   <Icon name="arrow-right" size={14} color="#fff" />
                              </TouchableOpacity>
                         </View>
                    </View>
               </Pressable>
          );
     };

     return (
          <View style={styles.container}>
               {/* Header */}
               <View style={styles.filterWrapper}>
                    <View style={styles.header}>
                         <View>
                              <Text style={styles.headerTitle}>Your Matches</Text>
                              <Text style={styles.headerSubtitle}>{matches?.length ?? 0} apartments found</Text>
                         </View>

                         <TouchableOpacity style={styles.filterChip} onPress={() => setFilterOpen(prev => !prev)} activeOpacity={0.8}>
                              <Icon name="sliders" size={14} color={colors.PrimaryColor} />
                              <Text style={styles.filterChipText}>{activeFilterLabel}</Text>
                              <Icon name={filterOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#6B7280" />
                         </TouchableOpacity>
                    </View>

                    {filterOpen && (
                         <>
                              <Pressable style={styles.overlayBackdrop} onPress={() => setFilterOpen(false)} />
                              <View style={styles.filterOverlay}>
                                   {FILTER_OPTIONS.map(opt => {
                                        const selected = opt.value === filter;
                                        return (
                                             <TouchableOpacity key={opt.label} style={[styles.filterOption, selected && styles.filterOptionActive]} onPress={() => applyFilter(opt.value)}>
                                                  <Text style={[styles.filterOptionText, selected && styles.filterOptionTextActive]}>{opt.label}</Text>
                                                  {selected && <Icon name="check" size={14} color={colors.PrimaryColor} />}
                                             </TouchableOpacity>
                                        );
                                   })}
                              </View>
                         </>
                    )}
               </View>

               {/* Apartment Cards */}
               <View style={styles.cardsContainer}>
                    {matches?.length === 0 && !isFetching && !GetMatchesLoading ? (
                         <Ismessage text="No matches available" />
                    ) : !isError && (isFetching || GetMatchesLoading) ? (
                         <MatchApartmentCardSkeleton count={3} />
                    ) : (
                         <FlatList
                              data={matches}
                              renderItem={renderItem}
                              keyExtractor={item => item.id}
                              contentContainerStyle={styles.listContent}
                              showsVerticalScrollIndicator={false}
                              onEndReached={handleIncreasePage}
                              onEndReachedThreshold={0.5}
                              refreshControl={<RefreshControl onRefresh={onRefresh} colors={[colors.PrimaryColor]} tintColor={colors.PrimaryColor} refreshing={loader} />}
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
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F7F8FA',
     },
     filterWrapper: {
          zIndex: 20,
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 16,
     },
     headerTitle: {
          fontSize: 24,
          fontFamily: Font.font500,
          color: '#111827',
     },
     headerSubtitle: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#9CA3AF',
          marginTop: 2,
     },
     filterChip: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#fff',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#EEF0F3',
     },
     filterChipText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: '#374151',
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
          position: 'absolute',
          top: '100%',
          right: 20,
          width: 170,
          marginTop: 4,
          backgroundColor: '#fff',
          borderRadius: 16,
          paddingVertical: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 10,
          zIndex: 20,
     },
     filterOption: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
     },
     filterOptionActive: {
          backgroundColor: `${colors.PrimaryColor}0D`,
     },
     filterOptionText: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#374151',
     },
     filterOptionTextActive: {
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     cardsContainer: {
          flex: 1,
          paddingHorizontal: 20,
          zIndex: 1,
     },
     listContent: {
          paddingBottom: 120,
          gap: 16,
     },
     card: {
          backgroundColor: '#fff',
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
     },
     imageContainer: {
          position: 'relative',
          height: 180,
          backgroundColor: '#F3F4F6',
     },
     apartmentImage: {
          width: '100%',
          height: '100%',
     },
     statusBadge: {
          position: 'absolute',
          top: 12,
          left: 12,
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
          fontSize: 12,
          fontFamily: Font.font500,
     },
     favoriteButton: {
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: '#fff',
          width: 32,
          height: 32,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     cardContent: {
          padding: 16,
     },
     apartmentTitle: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#111827',
          marginBottom: 6,
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 12,
     },
     locationText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#6B7280',
          flexShrink: 1,
     },
     featuresRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
     },
     feature: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
     },
     featureDivider: {
          width: 1,
          height: 12,
          backgroundColor: '#E5E7EB',
     },
     featureText: {
          fontSize: 12,
          fontFamily: Font.font400,
          color: '#6B7280',
     },
     footer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
     },
     price: {
          fontSize: 18,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     viewButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 12,
     },
     viewButtonText: {
          color: '#fff',
          fontSize: 13,
          fontFamily: Font.font500,
     },
});

export default MatchApartments;
