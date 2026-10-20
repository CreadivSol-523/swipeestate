import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import { windowHeight } from '../../utils/Dimension/Dimension';
import { useCreateLikeHandler, useGetApartmentsHandler, useRejectPropertyHandler } from '../../models/Matches/Matches';
import PropertyCardSkeleton from '../../components/Skeletons/PropertyCardSkeleton';
import SwipeDeck from '../../components/SwipeCards/SwipeDeck';
import LimitReachedModal from '../../components/LimitReachModal/LimitReachModal';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import Ismessage from '../../components/IsMessage/Ismessage';
import { useGetSubscribedPlanHandler } from '../../models/Plan/Plan';
import NoMoreApartmentsCard from '../../components/SwipeCards/NoMoreApartmentsCard';

type FilterKey = 'price' | 'bedrooms' | 'location' | 'status' | 'area';
type RangeFilter = {
     key?: string;
     gte?: number;
     lte?: number;
     status?: string;
};

type ModalFeature = 'featured' | 'listings' | 'swipes' | 'analytics';
type SwipeDirection = 'left' | 'right';

interface State {
     currentIndex: number;
     likedProperties: number[];
     selectedFilter?: FilterKey | string;
     selectedValue?: string | null;
     modalVisible: boolean;
     modalFeature: ModalFeature;
     rangeFilter: RangeFilter;
     apartmentList: any[];
     disableSwipe: boolean;
     page: number;
}

const initialState: State = {
     currentIndex: 0,
     likedProperties: [],
     selectedFilter: undefined,
     selectedValue: undefined,
     modalVisible: false,
     modalFeature: 'swipes',
     rangeFilter: {},
     apartmentList: [],
     disableSwipe: false,
     page: 1,
};

type Action =
     | { type: 'SET_INDEX'; payload: number }
     | { type: 'TOGGLE_LIKE'; payload: number }
     | { type: 'SET_FILTER'; payload?: FilterKey | string }
     | { type: 'SET_VALUE'; payload?: string | null }
     | { type: 'SET_RANGE'; payload: RangeFilter }
     | { type: 'SET_APARTMENTS'; payload: any[] }
     | { type: 'APPEND_APARTMENTS'; payload: any[] }
     | { type: 'SET_DISABLE_SWIPE'; payload: boolean }
     | { type: 'SET_PAGE'; payload: number }
     | { type: 'SET_MODAL'; payload: { visible: boolean; feature?: ModalFeature } };

function reducer(state: State, action: Action): State {
     switch (action.type) {
          case 'SET_INDEX':
               return { ...state, currentIndex: action.payload };

          case 'TOGGLE_LIKE':
               return {
                    ...state,
                    likedProperties: state.likedProperties.includes(action.payload) ? state.likedProperties.filter(id => id !== action.payload) : [...state.likedProperties, action.payload],
               };

          case 'SET_FILTER':
               return {
                    ...state,
                    selectedFilter: action.payload,
                    selectedValue: undefined,
                    page: 1,
               };

          case 'SET_VALUE':
               return { ...state, selectedValue: action.payload };

          case 'SET_RANGE':
               return { ...state, rangeFilter: action.payload };

          case 'SET_APARTMENTS':
               return { ...state, apartmentList: action.payload };

          case 'APPEND_APARTMENTS': {
               const map = new Map();
               state.apartmentList.forEach(i => map.set(i.id, i));
               action.payload.forEach(i => map.set(i.id, i));
               return { ...state, apartmentList: Array.from(map.values()) };
          }

          case 'SET_DISABLE_SWIPE':
               return { ...state, disableSwipe: action.payload };

          case 'SET_PAGE':
               return { ...state, page: action.payload };

          case 'SET_MODAL':
               return {
                    ...state,
                    modalVisible: action.payload.visible,
                    modalFeature: action.payload.feature ?? state.modalFeature,
               };

          default:
               return state;
     }
}

const formatPrice = (value?: number) => {
     if (value === undefined || value === null) return '—';
     return `$${Number(value).toLocaleString()}`;
};

const FILTER_CATEGORIES: { label: string; value: FilterKey }[] = [
     { label: 'Budget', value: 'price' },
     { label: 'Bedrooms', value: 'bedrooms' },
     { label: 'Status', value: 'status' },
     { label: 'Area Size', value: 'area' },
];

const FILTER_CONFIG: Record<FilterKey, { label: string; value: string }[]> = {
     price: [
          { label: 'Under $300k', value: 'under_300' },
          { label: '$300k – $500k', value: '300_500' },
          { label: '$500k – $800k', value: '500_800' },
          { label: '$800k+', value: '800_plus' },
     ],
     bedrooms: [
          { label: '1 Bedroom', value: '1' },
          { label: '2 Bedrooms', value: '2' },
          { label: '3+ Bedrooms', value: '3_plus' },
     ],
     location: [
          { label: 'Downtown', value: 'downtown' },
          { label: 'Suburbs', value: 'suburbs' },
          { label: 'City Center', value: 'city_center' },
     ],
     status: [
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
     ],
     area: [
          { label: 'Under 800 sq ft', value: 'under_800' },
          { label: '800 – 1500 sq ft', value: '800_1500' },
          { label: '1500+ sq ft', value: '1500_plus' },
     ],
};

const HomeScreen = ({ navigation }: { navigation: Navigation }) => {
     const [state, dispatch] = React.useReducer(reducer, initialState);

     const { currentIndex, likedProperties, selectedFilter, selectedValue, modalVisible, modalFeature, rangeFilter, apartmentList, disableSwipe, page } = state;

     const pageRef = useRef(1);
     const limit = 10;

     // Tracks the last removed card so the Undo button can restore it.
     const lastRemovedRef = useRef<{ item: any; direction: SwipeDirection } | null>(null);
     const [canUndo, setCanUndo] = useState(false);
     const [filterMenuOpen, setFilterMenuOpen] = useState(false);
     const [isRefreshing, setIsRefreshing] = useState(false);

     const renderCard = useCallback((property: any) => {
          if (!property) return null;
          return (
               <View style={styles.card}>
                    {/* Image Section */}
                    <View style={styles.imageSection}>
                         <FastImage source={{ uri: property?.featuredImage }} style={styles.cardImage} resizeMode={FastImage.resizeMode.cover} />
                         <View style={styles.gradientOverlay} />

                         {/* Top badges */}
                         <View style={styles.topBadges}>
                              {property.featured && (
                                   <View style={styles.featuredBadge}>
                                        <Icon name="star" size={12} color="#FFD700" />
                                        <Text style={styles.featuredText}>Featured</Text>
                                   </View>
                              )}
                              {!!property.type && (
                                   <View style={styles.typeTag}>
                                        <Text style={styles.typeText}>{property.type}</Text>
                                   </View>
                              )}
                         </View>

                         {/* Bookmark */}
                         <TouchableOpacity style={styles.bookmarkButton} activeOpacity={0.7}>
                              <Icon name="bookmark-outline" size={18} color="#fff" />
                         </TouchableOpacity>

                         {/* Price overlay */}
                         <Text style={styles.priceOverlayText}>{formatPrice(property.price)}</Text>
                    </View>

                    {/* Content Section */}
                    <View style={styles.cardContent}>
                         <View style={styles.titleRow}>
                              <Text style={styles.propertyTitle} numberOfLines={1}>
                                   {property.title}
                              </Text>
                              <View style={styles.ratingBadge}>
                                   <Icon name="star" size={13} color="#FFD700" />
                                   <Text style={styles.ratingText}>{property.rating}</Text>
                              </View>
                         </View>

                         <View style={styles.locationRow}>
                              <Icon name="location" size={15} color={colors.PrimaryColor} />
                              <Text style={styles.locationText} numberOfLines={1}>
                                   {property.location}
                              </Text>
                         </View>

                         <View style={styles.detailsGrid}>
                              <View style={styles.detailBox}>
                                   <Icon name="bed-outline" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.detailValue}>{property.bedrooms}</Text>
                                   <Text style={styles.detailLabel}>Beds</Text>
                              </View>

                              <View style={styles.detailDivider} />

                              <View style={styles.detailBox}>
                                   <Icon name="water-outline" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.detailValue}>{property.bathrooms}</Text>
                                   <Text style={styles.detailLabel}>Baths</Text>
                              </View>

                              <View style={styles.detailDivider} />

                              <View style={styles.detailBox}>
                                   <Icon name="resize-outline" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.detailValue}>{property.area}</Text>
                                   <Text style={styles.detailLabel}>sq ft</Text>
                              </View>
                         </View>
                    </View>
               </View>
          );
     }, []);

     const { handleCreateLikeAPI, isLoading } = useCreateLikeHandler();
     const { handleRejectPropertyAPI, isLoading: rejectPropertyLoading } = useRejectPropertyHandler();
     const { GetSubscribedPlanData, refetch: planRefetch } = useGetSubscribedPlanHandler();

     const numberOfSwipes = (GetSubscribedPlanData as any)?.plan?.planRestrictions?.numberOfSwipes;

     console.log(apartmentList, 'apartmentListapartmentList');

     const maybeLoadMore = () => {
          if (apartmentList.length <= 2) {
               // pageRef.current += 1;
               // dispatch({ type: 'SET_PAGE', payload: pageRef.current });
               refetch();
          }
     };

     const handleSwipeLeft = async (_: number, item?: any) => {
          if (numberOfSwipes == 0) {
               dispatch({ type: 'SET_MODAL', payload: { visible: true } });
               return;
          }

          dispatch({ type: 'SET_DISABLE_SWIPE', payload: true });
          await handleRejectPropertyAPI(item?.id);
          dispatch({ type: 'SET_DISABLE_SWIPE', payload: false });
          maybeLoadMore();
     };

     const handleSwipeRight = async (_: number, item?: any) => {
          if (numberOfSwipes == 0) {
               dispatch({ type: 'SET_MODAL', payload: { visible: true } });
               return;
          }

          dispatch({ type: 'SET_DISABLE_SWIPE', payload: true });
          await handleCreateLikeAPI(item?.id);
          dispatch({ type: 'SET_DISABLE_SWIPE', payload: false });
          dispatch({ type: 'TOGGLE_LIKE', payload: item.id });
          maybeLoadMore();
     };

     // Manual action-button handlers (Pass / Like) — mirrors swipe gestures
     const handlePassPress = () => {
          if (apartmentList.length === 0 || disableSwipe) return;
          const item = apartmentList[0];
          lastRemovedRef.current = { item, direction: 'left' };
          setCanUndo(true);
          dispatch({ type: 'SET_APARTMENTS', payload: apartmentList.slice(1) });
          handleSwipeLeft(0, item);
     };

     const handleLikePress = () => {
          if (apartmentList.length === 0 || disableSwipe) return;
          const item = apartmentList[0];
          lastRemovedRef.current = { item, direction: 'right' };
          setCanUndo(true);
          handleSwipeRight(0, item);
          dispatch({ type: 'SET_APARTMENTS', payload: apartmentList.slice(1) });
     };

     const handleUndoPress = () => {
          if (!lastRemovedRef.current) return;
          const { item, direction } = lastRemovedRef.current;

          dispatch({ type: 'SET_APARTMENTS', payload: [item, ...apartmentList] });

          if (direction === 'right') {
               dispatch({ type: 'TOGGLE_LIKE', payload: item.id });
          }

          lastRemovedRef.current = null;
          setCanUndo(false);
     };

     const { ApartmentsData, ApartmentsLoading, isFetching, GetApartments, isError, refetch } = useGetApartmentsHandler({
          limit,
          page,
          key: rangeFilter.key,
          gte: rangeFilter.gte,
          lte: rangeFilter.lte,
          status: selectedValue || '',
     });

     console.log(ApartmentsData);

     const structuredApartment = () => {
          if (ApartmentsData?.apartments.length == 0) return;
          return ApartmentsData?.apartments?.map((item: any) => ({
               id: item?._id,
               title: item?.title,
               location: item?.location,
               price: item?.price,
               bedrooms: item?.bedrooms,
               bathrooms: item?.bathrooms,
               area: item?.area,
               type: item?.type,
               rating: 4.5,
               featured: item?.featured,
               featuredImage: item?.image,
          }));
     };

     const getRangeFromFilter = (filterKey?: string, value?: string | null): RangeFilter => {
          if (!filterKey || !value) return {};

          switch (filterKey) {
               case 'price':
                    switch (value) {
                         case 'under_300':
                              return { key: 'price', lte: 300000, gte: 0 };
                         case '300_500':
                              return { key: 'price', gte: 300000, lte: 500000 };
                         case '500_800':
                              return { key: 'price', gte: 500000, lte: 800000 };
                         case '800_plus':
                              return { key: 'price', gte: 800000 };
                         default:
                              return {};
                    }

               case 'area':
                    switch (value) {
                         case 'under_800':
                              return { key: 'area', lte: 800 };
                         case '800_1500':
                              return { key: 'area', gte: 800, lte: 1500 };
                         case '1500_plus':
                              return { key: 'area', gte: 1500 };
                         default:
                              return {};
                    }
               case 'bedrooms':
                    switch (value) {
                         case '1':
                              return { key: 'bedrooms', gte: 1, lte: 1 };
                         case '2':
                              return { key: 'bedrooms', gte: 2, lte: 2 };
                         case '3_plus':
                              return { key: 'bedrooms', gte: 3 };
                         default:
                              return {};
                    }
               case 'status':
                    switch (value) {
                         case '1':
                              return { key: 'Active' };
                         case '2':
                              return { key: 'Inactive' };
                         default:
                              return {};
                    }
               default:
                    return {};
          }
     };

     // --- Filter overlay logic (replaces the old dual-CustomDropdown UX) ---
     const selectedValueLabel = useMemo(() => {
          if (!selectedFilter || !selectedValue) return null;
          const opts = (FILTER_CONFIG as any)[selectedFilter] ?? [];
          return opts.find((o: any) => o.value === selectedValue)?.label ?? selectedValue;
     }, [selectedFilter, selectedValue]);

     const handleSelectCategory = (key: FilterKey) => {
          dispatch({ type: 'SET_FILTER', payload: key });
          // overlay stays open — now shows this category's values
     };

     const handleSelectValue = (value: string) => {
          dispatch({ type: 'SET_VALUE', payload: value });
          dispatch({
               type: 'SET_RANGE',
               payload: getRangeFromFilter(selectedFilter as string, value),
          });
          pageRef.current = 1;
          setFilterMenuOpen(false); // auto-close on selection
     };

     const handleClearFilter = () => {
          dispatch({ type: 'SET_FILTER', payload: undefined });
          dispatch({ type: 'SET_VALUE', payload: undefined });
          dispatch({ type: 'SET_RANGE', payload: {} });
          pageRef.current = 1;
     };

     const handleBackToCategories = () => {
          dispatch({ type: 'SET_FILTER', payload: undefined });
     };

     const handleRefresh = async () => {
          setIsRefreshing(true);
          try {
               // Reset to page 1 to fetch fresh data from the beginning
               pageRef.current = 1;
               dispatch({ type: 'SET_PAGE', payload: 1 });
               // Trigger refetch with current filters
               await refetch();
               await planRefetch();
          } finally {
               setIsRefreshing(false);
          }
     };

     useEffect(() => {
          if (ApartmentsLoading) return;

          const incoming = structuredApartment() ?? [];

          // On page 1 (initial load or filter change), replace the list so
          // apartments the backend no longer returns don't linger on screen.
          // Later pages are appended for infinite scroll.
          if (page === 1) {
               dispatch({ type: 'SET_APARTMENTS', payload: incoming });
          } else if (incoming.length) {
               dispatch({ type: 'APPEND_APARTMENTS', payload: incoming });
          }
     }, [ApartmentsData, isFetching]);

     useEffect(() => {
          if (numberOfSwipes == 0) {
               dispatch({ type: 'SET_MODAL', payload: { visible: true } });
          }
     }, [apartmentList]);

     return (
          <>
               <ScrollView
                    style={styles.scrollContainer}
                    scrollEnabled={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.PrimaryColor} colors={[colors.PrimaryColor]} />}
               >
                    <View style={styles.container}>
                         <View style={styles.filterBar}>
                              <TouchableOpacity style={[styles.filterChip, filterMenuOpen && styles.filterChipActive]} activeOpacity={0.8} onPress={() => setFilterMenuOpen(v => !v)}>
                                   <Icon name="filter" size={15} color={filterMenuOpen ? '#fff' : colors.PrimaryColor} />
                                   <Text style={[styles.filterChipText, filterMenuOpen && styles.filterChipTextActive]}>
                                        {selectedFilter ? FILTER_CATEGORIES.find(c => c.value === selectedFilter)?.label : 'Filter by'}
                                   </Text>
                                   <Icon name={filterMenuOpen ? 'chevron-up' : 'chevron-down'} size={14} color={filterMenuOpen ? '#fff' : '#9CA3AF'} />
                              </TouchableOpacity>

                              {selectedValueLabel && !filterMenuOpen && (
                                   <TouchableOpacity style={styles.appliedChip} activeOpacity={0.8} onPress={handleClearFilter}>
                                        <Text style={styles.appliedChipText} numberOfLines={1}>
                                             {selectedValueLabel}
                                        </Text>
                                        <Icon name="close" size={14} color={colors.PrimaryColor} />
                                   </TouchableOpacity>
                              )}
                         </View>

                         {filterMenuOpen && (
                              <>
                                   <TouchableOpacity style={styles.overlayBackdrop} activeOpacity={1} onPress={() => setFilterMenuOpen(false)} />
                                   <View style={styles.filterOverlay}>
                                        {!selectedFilter ? (
                                             FILTER_CATEGORIES.map(cat => (
                                                  <TouchableOpacity key={cat.value} style={styles.overlayRow} onPress={() => handleSelectCategory(cat.value)}>
                                                       <Text style={styles.overlayRowText}>{cat.label}</Text>
                                                       <Icon name="chevron-forward" size={16} color="#ccc" />
                                                  </TouchableOpacity>
                                             ))
                                        ) : (
                                             <>
                                                  <TouchableOpacity style={styles.overlayBackRow} onPress={handleBackToCategories}>
                                                       <Icon name="chevron-back" size={16} color={colors.PrimaryColor} />
                                                       <Text style={styles.overlayBackText}>{FILTER_CATEGORIES.find(c => c.value === selectedFilter)?.label}</Text>
                                                  </TouchableOpacity>
                                                  {(FILTER_CONFIG as any)[selectedFilter]?.map((opt: any) => (
                                                       <TouchableOpacity key={opt.value} style={styles.overlayRow} onPress={() => handleSelectValue(opt.value)}>
                                                            <Text style={styles.overlayRowText}>{opt.label}</Text>
                                                            {selectedValue === opt.value && <Icon name="checkmark" size={16} color={colors.PrimaryColor} />}
                                                       </TouchableOpacity>
                                                  ))}
                                             </>
                                        )}
                                   </View>
                              </>
                         )}

                         <View style={styles.swiperContainer}>
                              {apartmentList.length == 0 && !ApartmentsLoading && !isFetching ? (
                                   isError ? (
                                        <Ismessage text="Failed to load apartments" height={windowHeight - 340} onRetry={() => refetch()} />
                                   ) : (
                                        // <Ismessage text="No Apartments Available" height={windowHeight - 340} />
                                        <NoMoreApartmentsCard />
                                   )
                              ) : ApartmentsLoading || isFetching ? (
                                   <PropertyCardSkeleton />
                              ) : (
                                   <SwipeDeck
                                        data={apartmentList}
                                        renderCard={renderCard}
                                        disableLeftSwipe={numberOfSwipes == 0 || isFetching}
                                        disableRightSwipe={numberOfSwipes == 0 || isFetching}
                                        onSwipeLeft={(item, index) => {
                                             lastRemovedRef.current = { item, direction: 'left' };
                                             setCanUndo(true);
                                             dispatch({ type: 'SET_APARTMENTS', payload: apartmentList.slice(1) });
                                             handleSwipeLeft(index, item);
                                        }}
                                        onSwipeRight={(item, index) => {
                                             lastRemovedRef.current = { item, direction: 'right' };
                                             setCanUndo(true);
                                             handleSwipeRight(index, item);
                                             dispatch({ type: 'SET_APARTMENTS', payload: apartmentList.slice(1) });
                                        }}
                                   />
                              )}
                         </View>

                         {apartmentList.length > 0 && !ApartmentsLoading && !isFetching && (
                              <View style={styles.actionsContainer}>
                                   <TouchableOpacity style={[styles.actionButton, styles.passButton]} activeOpacity={0.8} onPress={handlePassPress} disabled={disableSwipe}>
                                        <Icon name="close" size={26} color="#FF3B30" />
                                   </TouchableOpacity>

                                   <TouchableOpacity
                                        style={[styles.actionButton, styles.undoButton, !canUndo && styles.disabledButton]}
                                        activeOpacity={0.8}
                                        onPress={handleUndoPress}
                                        disabled={!canUndo}
                                   >
                                        <Icon name="arrow-undo" size={20} color={canUndo ? '#666' : '#ccc'} />
                                   </TouchableOpacity>

                                   <TouchableOpacity style={[styles.actionButton, styles.likeButton]} activeOpacity={0.8} onPress={handleLikePress} disabled={disableSwipe}>
                                        <Icon name="heart" size={26} color={colors.PrimaryColor} />
                                   </TouchableOpacity>
                              </View>
                         )}
                    </View>

                    <LimitReachedModal
                         visible={modalVisible}
                         onClose={() => dispatch({ type: 'SET_MODAL', payload: { visible: false } })}
                         onUpgrade={() => {
                              dispatch({ type: 'SET_MODAL', payload: { visible: false } });
                              navigation.navigate('SubscriptionManagment');
                         }}
                         limitType={modalFeature}
                         currentLimit={2}
                         currentPlan="Basic"
                    />
               </ScrollView>
          </>
     );
};

export default HomeScreen;

const styles = StyleSheet.create({
     scrollContainer: {
          flex: 1,
          flexGrow: 1,
          backgroundColor: '#F8F9FA',
     },
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     filterBar: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
          gap: 10,
          zIndex: 20,
     },
     filterChip: {
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
     appliedChip: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 38,
          paddingHorizontal: 12,
          borderRadius: 19,
          backgroundColor: '#F0F7FF',
          maxWidth: 140,
     },
     appliedChipText: {
          fontSize: 12,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
          flexShrink: 1,
     },
     searchIconBtn: {
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E0E0E0',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto',
     },
     overlayBackdrop: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: -1000,
          zIndex: 15,
     },
     filterOverlay: {
          position: 'absolute',
          top: 62,
          left: 20,
          right: 20,
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
     overlayBackRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
          marginBottom: 4,
     },
     overlayBackText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     swiperContainer: {
          flex: 1,
     },
     card: {
          flex: 1,
          borderRadius: 20,
          backgroundColor: '#fff',
          marginHorizontal: 16,
          marginVertical: 10,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          overflow: 'hidden',
     },
     imageSection: {
          height: '50%',
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
          backgroundColor: 'rgba(0,0,0,0.35)',
     },
     topBadges: {
          position: 'absolute',
          top: 14,
          left: 14,
          flexDirection: 'row',
          gap: 8,
     },
     featuredBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 20,
          gap: 4,
     },
     featuredText: {
          fontSize: 11,
          fontFamily: Font.font500,
          color: '#fff',
     },
     typeTag: {
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
     },
     typeText: {
          fontSize: 11,
          fontFamily: Font.font500,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
     },
     bookmarkButton: {
          position: 'absolute',
          top: 14,
          right: 14,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(0,0,0,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     priceOverlayText: {
          position: 'absolute',
          bottom: 14,
          left: 16,
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#fff',
     },
     cardContent: {
          flex: 1,
          padding: 18,
     },
     titleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 8,
          marginBottom: 6,
     },
     propertyTitle: {
          fontSize: 20,
          fontFamily: Font.font500,
          color: '#000',
          flex: 1,
     },
     ratingBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFF9E6',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          gap: 4,
     },
     ratingText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: '#000',
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
          gap: 4,
     },
     locationText: {
          fontSize: 14,
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
     },
     detailBox: {
          flex: 1,
          alignItems: 'center',
          gap: 4,
     },
     detailDivider: {
          width: 1,
          height: 36,
          backgroundColor: '#E0E0E0',
     },
     detailValue: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#000',
     },
     detailLabel: {
          fontSize: 11,
          fontFamily: Font.font400,
          color: '#999',
     },
     actionsContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
          paddingVertical: 20,
          gap: 20,
     },
     actionButton: {
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
     },
     passButton: {
          borderWidth: 2,
          borderColor: '#FF3B30',
     },
     likeButton: {
          borderWidth: 2,
          borderColor: colors.PrimaryColor,
     },
     undoButton: {
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 2,
          borderColor: '#E0E0E0',
     },
     disabledButton: {
          opacity: 0.5,
     },
});
