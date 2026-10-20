import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { matches } from '../../redux/Matches/MatchType';
import { useAuth } from '../../utils/Storage/Storage';
import { useAcceptPropertyHandler, useGetSingleApartmentHandler, useRejectBySellerHandler, useRejectPropertyHandler } from '../../models/Matches/Matches';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

const { width } = Dimensions.get('window');

type Props = {
     route?: { params?: { filterApartment?: matches; matchID: string } };
     navigation?: Navigation;
};

const formatPrice = (value?: number | string) => {
     if (value === undefined || value === null || value === '') return '—';
     const num = Number(value);
     if (Number.isNaN(num)) return String(value);
     return `$${num.toLocaleString()}`;
};

const AgentMatchDetail = ({ navigation, route }: Props) => {
     const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const [isFavorite, setIsFavorite] = useState(false);
     const insets = useSafeAreaInsets();

     const { filterApartment, matchID } = route?.params || {};
     const { userData } = useAuth();

     const { handleAcceptPropertyAPI, isLoading } = useAcceptPropertyHandler();
     const { handleRejectBySellerAPI, isLoading: RejectLoading } = useRejectBySellerHandler();
     const { GetSingleApartmentData } = useGetSingleApartmentHandler({ propertyId: filterApartment?.property?._id });

     const apartment = GetSingleApartmentData?.apartment;
     const images = apartment?.featuredImages ?? [];

     const handleAcceptMatches = async (matchId: string) => {
          await handleAcceptPropertyAPI(matchId);
          navigation?.goBack();
     };

     const handleRejectMatches = async () => {
          await handleRejectBySellerAPI(matchID ?? '');
          navigation?.goBack();
          console.log(matchID);
     };

     // Find the single relevant match entry for the current user's role —
     // drives both the inline contact card and the sticky bottom CTA.
     const relevantMatch = apartment?.matches?.find(item => {
          if (userData.role === 'Seller') return item?.status === 'Requested' || item?.status === 'Matched' || item.status === 'Rejected';
          return userData.role === 'Buyer' && item?.status === 'Matched';
     });

     const showAcceptBar = userData.role === 'Seller' && filterApartment?.status === 'Requested';

     // If match is already Rejected or Matched, show status instead of action buttons
     const showStatusOnly = filterApartment?.status === 'Rejected' || filterApartment?.status === 'Matched';

     return (
          <View style={styles.container}>
               <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: showAcceptBar ? 130 : 32 }}>
                    {/* Image Gallery */}
                    <View style={styles.imageGallery}>
                         <ScrollView
                              horizontal
                              pagingEnabled
                              showsHorizontalScrollIndicator={false}
                              onScroll={e => {
                                   const index = Math.round(e.nativeEvent.contentOffset.x / width);
                                   setCurrentImageIndex(index);
                              }}
                              scrollEventThrottle={16}
                         >
                              {images.map((image, index) => (
                                   <Image key={index} source={{ uri: image }} style={styles.apartmentImage} />
                              ))}
                         </ScrollView>

                         {/* Header Buttons — now respects the notch/status bar */}
                         <View style={[styles.imageHeader]}>
                              <TouchableOpacity style={styles.headerButton} onPress={() => navigation?.goBack()}>
                                   <Icon name="arrow-left" size={22} color="#fff" />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.headerButton} onPress={() => setIsFavorite(!isFavorite)}>
                                   {isFavorite ? <MaterialIcon name="favorite" size={22} color="#FF5252" /> : <MaterialIcon name="favorite-border" size={22} color="#fff" />}
                              </TouchableOpacity>
                         </View>

                         {/* Image dots — visual pagination instead of text-only */}
                         {images.length > 1 && (
                              <View style={styles.imageDots}>
                                   {images.map((_, index) => (
                                        <View key={index} style={[styles.imageDot, index === currentImageIndex && styles.imageDotActive]} />
                                   ))}
                              </View>
                         )}

                         {/* Featured Badge */}
                         {apartment?.featured && (
                              <View style={styles.featuredBadge}>
                                   <Icon name="star" size={14} color="#FFD700" />
                                   <Text style={styles.featuredText}>Featured</Text>
                              </View>
                         )}
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>
                         {/* Title & Price */}
                         <View style={styles.titleSection}>
                              <View style={styles.titleRow}>
                                   <Text style={styles.title} numberOfLines={2}>
                                        {apartment?.title}
                                   </Text>
                                   {!!apartment?.type && (
                                        <View style={styles.typeBadge}>
                                             <Text style={styles.typeText}>{apartment?.type}</Text>
                                        </View>
                                   )}
                              </View>
                              <View style={styles.locationRow}>
                                   <Icon name="map-pin" size={15} color={colors.PrimaryColor} />
                                   <Text style={styles.location} numberOfLines={1}>
                                        {apartment?.location}
                                   </Text>
                              </View>
                              <Text style={styles.price}>{formatPrice(apartment?.price)}</Text>
                         </View>

                         {/* Quick Stats */}
                         <View style={styles.statsContainer}>
                              <View style={styles.stat}>
                                   <Icon name="home" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.statNumber}>{apartment?.bedrooms}</Text>
                                   <Text style={styles.statLabel}>Bedrooms</Text>
                              </View>

                              <View style={styles.statDivider} />

                              <View style={styles.stat}>
                                   <Icon name="droplet" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.statNumber}>{apartment?.bathrooms}</Text>
                                   <Text style={styles.statLabel}>Bathrooms</Text>
                              </View>

                              <View style={styles.statDivider} />

                              <View style={styles.stat}>
                                   <Icon name="maximize" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.statNumber}>{apartment?.area}</Text>
                                   <Text style={styles.statLabel}>sq ft</Text>
                              </View>
                         </View>

                         {/* Details Section */}
                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>Details</Text>
                              <View style={styles.chipGrid}>
                                   {!!apartment?.floor && (
                                        <View style={styles.chip}>
                                             <Icon name="layers" size={16} color="#666" />
                                             <Text style={styles.chipText}>Floor {apartment?.floor}</Text>
                                        </View>
                                   )}
                                   {!!apartment?.furnished && (
                                        <View style={styles.chip}>
                                             <Icon name="box" size={16} color="#666" />
                                             <Text style={styles.chipText}>{apartment?.furnished}</Text>
                                        </View>
                                   )}
                                   {!!apartment?.parking && (
                                        <View style={styles.chip}>
                                             <Icon name="truck" size={16} color="#666" />
                                             <Text style={styles.chipText}>{apartment?.parking} Parking</Text>
                                        </View>
                                   )}
                                   {!!apartment?.availability && (
                                        <View style={styles.chip}>
                                             <Icon name="calendar" size={16} color="#666" />
                                             <Text style={styles.chipText}>{apartment?.availability}</Text>
                                        </View>
                                   )}
                              </View>
                         </View>

                         {/* Description */}
                         {!!apartment?.description && (
                              <View style={styles.section}>
                                   <Text style={styles.sectionTitle}>Description</Text>
                                   <Text style={styles.description}>{apartment?.description}</Text>
                              </View>
                         )}

                         {/* Amenities — now same chip-grid treatment as Details, for visual consistency */}
                         {!!apartment?.amenities?.length && (
                              <View style={styles.section}>
                                   <Text style={styles.sectionTitle}>Amenities</Text>
                                   <View style={styles.chipGrid}>
                                        {apartment.amenities.map((amenity, index) => (
                                             <View key={index} style={styles.chip}>
                                                  <Icon name="check-circle" size={16} color="#22C55E" />
                                                  <Text style={styles.chipText}>{amenity}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         )}

                         {/* Contact card — shown once Matched, for either role */}
                         {relevantMatch?.status === 'Matched' && (
                              <View style={styles.section}>
                                   <Text style={styles.sectionTitle}>{userData.role === 'Seller' ? 'Contact buyer' : 'Contact agent'}</Text>
                                   <View style={styles.agentCard}>
                                        <Image
                                             source={{
                                                  uri: userData.role === 'Seller' ? relevantMatch?.matchLikedBy?.buyer?.profilePicture : relevantMatch?.matchAcceptedBy?.seller?.profilePicture,
                                             }}
                                             style={styles.agentImage}
                                        />
                                        <View style={styles.agentInfo}>
                                             <Text style={styles.agentName} numberOfLines={1}>
                                                  {userData.role === 'Seller' ? relevantMatch?.matchLikedBy?.buyer?.name : relevantMatch?.matchAcceptedBy?.seller?.name}
                                             </Text>
                                             <View style={styles.agentDetail}>
                                                  <Icon name="phone" size={13} color="#666" />
                                                  <Text style={styles.agentText}>
                                                       {userData.role === 'Seller' ? relevantMatch?.matchLikedBy?.buyer?.phone : relevantMatch?.matchAcceptedBy?.seller?.phone}
                                                  </Text>
                                             </View>
                                             <View style={styles.agentDetail}>
                                                  <Icon name="map-pin" size={13} color="#666" />
                                                  <Text style={styles.agentText} numberOfLines={1}>
                                                       {userData.role === 'Seller' ? relevantMatch?.matchLikedBy?.buyer?.address : relevantMatch?.matchAcceptedBy?.seller?.address}
                                                  </Text>
                                             </View>
                                        </View>
                                   </View>
                              </View>
                         )}
                    </View>
               </ScrollView>

               {/* Sticky bottom CTA — was previously buried inline inside the
                   scroll, invisible until the seller scrolled all the way down */}
               {showAcceptBar && !showStatusOnly ? (
                    <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, gap: 15 }]}>
                         <View>
                              <Text style={styles.bottomPriceLabel}>Price</Text>
                              <Text style={styles.bottomPriceValue}>{formatPrice(apartment?.price)}</Text>
                         </View>
                         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                              <TouchableOpacity
                                   disabled={isLoading}
                                   activeOpacity={isLoading ? 1 : 0.85}
                                   style={styles.acceptButton}
                                   onPress={() => relevantMatch?._id && handleAcceptMatches(relevantMatch._id)}
                              >
                                   {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.acceptButtonText}>Accept</Text>}
                              </TouchableOpacity>
                              <TouchableOpacity disabled={RejectLoading} activeOpacity={RejectLoading ? 1 : 0.85} style={styles.rejectButton} onPress={() => matchID && handleRejectMatches()}>
                                   {RejectLoading ? <ActivityIndicator color="red" /> : <Text style={[styles.acceptButtonText, { color: 'red' }]}>Reject</Text>}
                              </TouchableOpacity>
                         </View>
                    </View>
               ) : null}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
     },
     imageGallery: {
          position: 'relative',
          height: 300,
          backgroundColor: '#F0F0F0',
     },
     apartmentImage: {
          width: width,
          height: 300,
     },
     imageHeader: {
          position: 'absolute',
          left: 16,
          right: 16,
          top: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     headerButton: {
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
     },
     imageDots: {
          position: 'absolute',
          bottom: 16,
          alignSelf: 'center',
          flexDirection: 'row',
          gap: 6,
     },
     imageDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.5)',
     },
     imageDotActive: {
          width: 18,
          backgroundColor: '#fff',
     },
     featuredBadge: {
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: [{ translateX: -50 }],
          backgroundColor: 'rgba(0,0,0,0.7)',
          paddingHorizontal: 14,
          paddingVertical: 7,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
     },
     featuredText: {
          color: '#FFD700',
          fontSize: 12,
          fontFamily: Font.font500,
     },
     content: {
          padding: 16,
     },
     titleSection: {
          marginBottom: 18,
     },
     titleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 8,
     },
     title: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#000',
          flex: 1,
     },
     typeBadge: {
          backgroundColor: '#F0F7FF',
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 12,
     },
     typeText: {
          color: colors.PrimaryColor,
          fontSize: 12,
          fontFamily: Font.font500,
          textTransform: 'capitalize',
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
          gap: 6,
     },
     location: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
          flex: 1,
     },
     price: {
          fontSize: 28,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     statsContainer: {
          flexDirection: 'row',
          backgroundColor: '#F8F9FA',
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: 'center',
          marginBottom: 24,
     },
     stat: {
          flex: 1,
          alignItems: 'center',
          gap: 4,
     },
     statDivider: {
          width: 1,
          height: 36,
          backgroundColor: '#E0E0E0',
     },
     statNumber: {
          fontSize: 17,
          fontFamily: Font.font500,
          color: '#000',
          marginTop: 2,
     },
     statLabel: {
          fontSize: 11,
          fontFamily: Font.font400,
          color: '#999',
     },
     section: {
          marginBottom: 24,
     },
     sectionTitle: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 12,
     },
     chipGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
     },
     chip: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8F9FA',
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderRadius: 10,
          gap: 7,
     },
     chipText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#555',
     },
     description: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
          lineHeight: 22,
     },
     agentCard: {
          flexDirection: 'row',
          backgroundColor: '#F8F9FA',
          borderRadius: 14,
          padding: 16,
     },
     agentImage: {
          width: 56,
          height: 56,
          borderRadius: 28,
          marginRight: 12,
          backgroundColor: '#E0E0E0',
     },
     agentInfo: {
          flex: 1,
          justifyContent: 'center',
     },
     agentName: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 6,
     },
     agentDetail: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 4,
     },
     agentText: {
          fontSize: 12,
          fontFamily: Font.font400,
          color: '#666',
          flex: 1,
     },
     bottomBar: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 10,
     },
     bottomPriceLabel: {
          fontSize: 11,
          fontFamily: Font.font400,
          color: '#999',
     },
     bottomPriceValue: {
          fontSize: 18,
          fontFamily: Font.font500,
          color: '#000',
     },
     acceptButton: {
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 32,
          paddingVertical: 14,
          borderRadius: 24,
          minWidth: 150,
          alignItems: 'center',
          justifyContent: 'center',
     },
     rejectButton: {
          backgroundColor: 'transparent',
          paddingHorizontal: 32,
          paddingVertical: 14,
          borderRadius: 24,
          minWidth: 150,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'red',
     },
     acceptButtonText: {
          color: '#fff',
          fontSize: 15,
          fontFamily: Font.font500,
     },
});

export default AgentMatchDetail;
