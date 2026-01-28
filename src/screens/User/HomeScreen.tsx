import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import Field from '../../components/Field/Field';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import { windowHeight, windowWidth } from '../../utils/Dimension/Dimension';
import { useAuth } from '../../utils/Storage/Storage';
import { useCreateLikeHandler, useGetApartmentsHandler, useRejectPropertyHandler } from '../../models/Matches/Matches';
import PropertyCardSkeleton from '../../components/Skeletons/PropertyCardSkeleton';
import API_BASE_URL from '../../utils/Config';
import SwipeDeck from '../../components/SwipeCards/SwipeDeck';
import LimitReachedModal from '../../components/LimitReachModal/LimitReachModal';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import Ismessage from '../../components/IsMessage/Ismessage';

type FilterKey = 'price' | 'bedrooms' | 'location' | 'type' | 'rating' | 'area';
type RangeFilter = {
     key?: string;
     gte?: number;
     lte?: number;
};

const HomeScreen = ({ navigation }: { navigation: Navigation }) => {
     const [currentIndex, setCurrentIndex] = useState(0);
     const [likedProperties, setLikedProperties] = useState<number[]>([]);
     const [selectedFilter, setSelectedFilter] = useState<FilterKey | string | undefined>(undefined);
     const [selectedValue, setSelectedValue] = useState<string | undefined | null>(undefined);
     const [modalVisible, setModalVisible] = useState(false);
     const [modalFeature, setModalFeature] = useState<'featured' | 'listings' | 'swipes' | 'analytics'>('swipes');

     const [rangeFilter, setRangeFilter] = useState<RangeFilter>({});
     const [apartmentList, setApartmentList] = useState<any>([]);
     const [disableSwipe, setDisableSwipe] = useState(false);
     const [page, setPage] = useState(1);

     const { userData } = useAuth();

     const pageRef = useRef(1);
     const limit = 10;

     const renderCard = useCallback(
          (property: any) => {
               if (!property) return null;

               return (
                    <View style={styles.card}>
                         {/* Image Section with Gradient Overlay */}
                         <View style={styles.imageSection}>
                              <View style={styles.imagePlaceholder}>
                                   <Image source={{ uri: API_BASE_URL + '/' + property?.featuredImage }} style={{ width: '100%', height: '100%' }} />
                              </View>

                              {/* Gradient Overlay */}
                              <View style={styles.gradientOverlay} />

                              {/* Top Badges */}
                              <View style={styles.topBadges}>
                                   {property.featured && (
                                        <View style={styles.featuredBadge}>
                                             <Icon name="star" size={12} color="#FFD700" />
                                             <Text style={styles.featuredText}>Featured</Text>
                                        </View>
                                   )}
                                   <View style={styles.typeTag}>
                                        <Text style={styles.typeText}>{property.type}</Text>
                                   </View>
                              </View>
                         </View>

                         {/* Content Section */}
                         <View style={styles.cardContent}>
                              {/* Title & Rating */}
                              <View style={styles.titleRow}>
                                   <Text style={styles.propertyTitle} numberOfLines={1}>
                                        {property.title}
                                   </Text>
                                   <View style={styles.ratingBadge}>
                                        <Icon name="star" size={14} color="#FFD700" />
                                        <Text style={styles.ratingText}>{property.rating}</Text>
                                   </View>
                              </View>

                              {/* Location */}
                              <View style={styles.locationRow}>
                                   <Icon name="location" size={16} color={colors.PrimaryColor} />
                                   <Text style={styles.locationText} numberOfLines={1}>
                                        {property.location}
                                   </Text>
                              </View>

                              {/* Details Grid */}
                              <View style={styles.detailsGrid}>
                                   <View style={styles.detailBox}>
                                        <Icon name="bed-outline" size={22} color={colors.PrimaryColor} />
                                        <Text style={styles.detailValue}>{property.bedrooms}</Text>
                                        <Text style={styles.detailLabel}>Beds</Text>
                                   </View>

                                   <View style={styles.detailDivider} />

                                   <View style={styles.detailBox}>
                                        <Icon name="water-outline" size={22} color={colors.PrimaryColor} />
                                        <Text style={styles.detailValue}>{property.bathrooms}</Text>
                                        <Text style={styles.detailLabel}>Baths</Text>
                                   </View>

                                   <View style={styles.detailDivider} />

                                   <View style={styles.detailBox}>
                                        <Icon name="resize-outline" size={22} color={colors.PrimaryColor} />
                                        <Text style={styles.detailValue}>{property.area}</Text>
                                        <Text style={styles.detailLabel}>sq ft</Text>
                                   </View>
                              </View>
                         </View>
                    </View>
               );
          },
          [currentIndex],
     );

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
          type: [
               { label: 'Apartment', value: 'apartment' },
               { label: 'House', value: 'house' },
               { label: 'Studio', value: 'studio' },
               { label: 'Penthouse', value: 'penthouse' },
          ],
          rating: [
               { label: '4.0+', value: '4' },
               { label: '4.5+', value: '4.5' },
               { label: 'Any', value: 'any' },
          ],
          area: [
               { label: 'Under 800 sq ft', value: 'under_800' },
               { label: '800 – 1500 sq ft', value: '800_1500' },
               { label: '1500+ sq ft', value: '1500_plus' },
          ],
     };

     const isLastCard = apartmentList.length === 1;

     const { handleCreateLikeAPI, isLoading } = useCreateLikeHandler();
     const { handleRejectPropertyAPI, isLoading: rejectPropertyLoading } = useRejectPropertyHandler();

     const handleSwipeLeft = async (index: number, item?: any) => {
          if (isLastCard) {
               return setModalVisible(true);
          }

          setDisableSwipe(true);
          await handleRejectPropertyAPI(item?.id);
          setDisableSwipe(false);

          if (apartmentList.length <= 5) {
               pageRef.current += 1;
               setPage(prev => prev + 1);
          }

          if (apartmentList?.length === 1) {
               setDisableSwipe(true);
          }

          if (index === apartmentList?.length - 1) {
               setCurrentIndex(apartmentList?.length);
          }
     };

     const handleSwipeRight = async (index: number, item?: any) => {
          if (isLastCard) {
               return setModalVisible(true);
          }
          setDisableSwipe(true);
          await handleCreateLikeAPI(item?.id);
          setDisableSwipe(false);

          setLikedProperties([...likedProperties, apartmentList[index].id]);

          if (apartmentList?.length === 1) {
               setDisableSwipe(true);
          }

          if (apartmentList.length <= 5) {
               pageRef.current += 1;
               setPage(prev => prev + 1);
          }

          if (index === apartmentList?.length - 1) {
               setCurrentIndex(apartmentList?.length);
          }
     };

     // Handle API Get Apartments
     const { ApartmentsData, ApartmentsLoading, isFetching } = useGetApartmentsHandler({
          limit,
          page,
          key: rangeFilter.key,
          gte: rangeFilter.gte,
          lte: rangeFilter.lte,
     });

     const structuredApartment = () => {
          if (ApartmentsData?.apartments.length == 0) return;
          const ApartmentData = ApartmentsData?.apartments?.map((item, i) => ({
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
          return ApartmentData;
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
               default:
                    return {};
          }
     };

     useEffect(() => {
          if (ApartmentsLoading || !ApartmentsData?.apartments?.length) return;

          const newApartments = structuredApartment();

          setApartmentList((prev: any) => {
               const map = new Map();

               // add old ones
               prev.forEach((item: any) => {
                    map.set(item.id, item);
               });

               // add new ones (duplicates auto-overwritten)
               newApartments?.forEach(item => {
                    map.set(item.id, item);
               });

               return Array.from(map.values());
          });
     }, [ApartmentsData]);

     useEffect(() => {
          if (apartmentList?.length === 1) {
               return setModalVisible(true);
          }
     }, [apartmentList]);

     return (
          <>
               <View style={styles.container}>
                    {/* Enhanced Header */}
                    <View style={{ paddingBottom: 100 }}>
                         <View style={{ paddingInline: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between', position: 'absolute' }}>
                              <CustomDropdown
                                   placeholder="Filter By"
                                   options={[
                                        { label: 'Budget', value: 'price' },
                                        { label: 'Bedrooms', value: 'bedrooms' },
                                        // { label: 'Location', value: 'location' },
                                        // { label: 'Property Type', value: 'type' },
                                        // { label: 'Rating', value: 'rating' },
                                        { label: 'Area Size', value: 'area' },
                                   ]}
                                   value={selectedFilter}
                                   onValueChange={value => {
                                        setSelectedFilter(value);
                                        setSelectedValue(null); // reset second dropdown
                                   }}
                                   iconName="filter"
                                   iconSize={18}
                                   iconColor="#9CA3AF"
                                   maxHeight={150}
                                   dropdownStyle={{ width: windowWidth / 2 - 40 }}
                              />
                              {selectedFilter && (
                                   <CustomDropdown
                                        placeholder={`Select ${selectedFilter}`}
                                        options={(FILTER_CONFIG as any)[selectedFilter]}
                                        value={selectedValue ?? undefined}
                                        onValueChange={value => {
                                             setSelectedValue(value);

                                             const range = getRangeFromFilter(selectedFilter as string, value);

                                             setRangeFilter(range);

                                             // RESET DATA WHEN FILTER CHANGES
                                             setApartmentList([]);
                                             setPage(1);
                                             pageRef.current = 1;
                                        }}
                                        iconName="options"
                                        iconSize={18}
                                        iconColor="#9CA3AF"
                                        maxHeight={150}
                                        dropdownStyle={{ width: windowWidth / 2 - 40 }}
                                   />
                              )}
                         </View>
                    </View>
                    {/* Swiper Container */}
                    <View style={styles.swiperContainer}>
                         {apartmentList.length == 0 && !ApartmentsLoading && !isFetching ? (
                              <Ismessage text="No Apartments Available" height={windowHeight - 300} />
                         ) : ApartmentsLoading || isFetching ? (
                              <PropertyCardSkeleton />
                         ) : (
                              <SwipeDeck
                                   data={apartmentList}
                                   renderCard={renderCard}
                                   disableLeftSwipe={disableSwipe || apartmentList?.length === 1 || isFetching}
                                   disableRightSwipe={disableSwipe || apartmentList?.length === 1 || isFetching}
                                   onSwipeLeft={(item, index) => {
                                        setApartmentList((prev: any) => prev.slice(1));
                                        handleSwipeLeft(index, item);
                                   }}
                                   onSwipeRight={(item, index) => {
                                        handleSwipeRight(index, item);
                                        setApartmentList((prev: any) => prev.slice(1));
                                   }}
                              />
                         )}
                    </View>
               </View>
               <LimitReachedModal
                    visible={modalVisible}
                    onClose={() => {
                         setModalVisible(false), setModalFeature('swipes');
                    }}
                    onUpgrade={() => {
                         setModalVisible(false);
                         setModalFeature('swipes');
                         navigation.navigate('SubscriptionManagment');
                    }}
                    limitType={modalFeature}
                    currentLimit={5}
                    currentPlan="Basic"
               />
          </>
     );
};

export default HomeScreen;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     header: {
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 16,
          backgroundColor: '#fff',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
     },
     headerTop: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
     },
     headerGreeting: {
          fontSize: 32,
          fontFamily: Font.font500,
          color: '#000',
     },
     headerSubtitle: {
          fontSize: 15,
          fontFamily: Font.font400,
          color: '#666',
          marginTop: 4,
     },
     filterButton: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
     },
     progressBar: {
          height: 4,
          backgroundColor: '#E0E0E0',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 8,
     },
     progressFill: {
          height: '100%',
          backgroundColor: colors.PrimaryColor,
          borderRadius: 2,
     },
     progressText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: '#999',
          textAlign: 'center',
     },
     swiperContainer: {
          flex: 1,
          marginTop: 20,
     },
     cardContainer: {
          width: '100%',
          flex: 1,
     },
     cardStyle: {
          width: '100%',
          top: 0,
          left: 0,
     },
     card: {
          borderRadius: 24,
          backgroundColor: '#fff',
          marginHorizontal: 16,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          overflow: 'hidden',
     },
     imageSection: {
          height: '55%',
          position: 'relative',
     },
     imagePlaceholder: {
          height: '100%',
          backgroundColor: '#F0F0F0',
          alignItems: 'center',
          justifyContent: 'center',
     },
     gradientOverlay: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
     },
     topBadges: {
          position: 'absolute',
          top: 16,
          left: 16,
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
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     cardContent: {
          flex: 1,
          padding: 20,
     },
     titleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
     },
     propertyTitle: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#000',
          flex: 1,
          marginRight: 8,
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
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          alignItems: 'center',
     },
     detailBox: {
          flex: 1,
          alignItems: 'center',
          gap: 4,
     },
     detailDivider: {
          width: 1,
          height: 40,
          backgroundColor: '#E0E0E0',
     },
     detailValue: {
          fontSize: 18,
          fontFamily: Font.font500,
          color: '#000',
     },
     detailLabel: {
          fontSize: 12,
          fontFamily: Font.font400,
          color: '#999',
     },
     priceSection: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
     },
     priceLabel: {
          fontSize: 12,
          fontFamily: Font.font400,
          color: '#999',
          marginBottom: 4,
     },
     priceText: {
          fontSize: 26,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     viewDetailsButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F0F7FF',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          gap: 4,
     },
     viewDetailsText: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     actionsContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
          paddingBottom: 32,
          gap: 16,
          zIndex: 1000,
     },
     actionButton: {
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
     },
     passButton: {
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: '#FF3B30',
     },
     undoButton: {
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: '#E0E0E0',
     },
     likeButton: {
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: colors.PrimaryColor,
     },
     noMoreCards: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 40,
     },
     noMoreCardsIcon: {
          marginBottom: 20,
     },
     noMoreCardsText: {
          fontSize: 26,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 8,
     },
     noMoreCardsSubtext: {
          fontSize: 15,
          fontFamily: Font.font400,
          color: '#666',
          textAlign: 'center',
          marginBottom: 24,
     },
     refreshButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 24,
          paddingVertical: 14,
          borderRadius: 24,
          gap: 8,
     },
     refreshButtonText: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#fff',
     },
});
