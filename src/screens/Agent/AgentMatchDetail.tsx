import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
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

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
     Requested: { bg: '#FFF7E0', text: '#B45309', dot: '#F59E0B' },
     Matched: { bg: '#E8F8EE', text: '#15803D', dot: '#22C55E' },
     Rejected: { bg: '#FDECEC', text: '#B91C1C', dot: '#EF4444' },
};

const formatNumber = (value?: number | string) => {
     if (value === undefined || value === null || value === '') return '—';
     const num = Number(value);
     if (Number.isNaN(num)) return String(value);
     return num.toLocaleString();
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

     // Video player state
     const videoRef = useRef<any>(null);
     const [videoPaused, setVideoPaused] = useState(true);
     const [videoStarted, setVideoStarted] = useState(false);
     const [videoLoading, setVideoLoading] = useState(true);
     const [videoError, setVideoError] = useState(false);

     const { filterApartment, matchID } = route?.params || {};
     const { userData } = useAuth();

     const { handleAcceptPropertyAPI, isLoading } = useAcceptPropertyHandler();
     const { handleRejectBySellerAPI, isLoading: RejectLoading } = useRejectBySellerHandler();
     const { GetSingleApartmentData } = useGetSingleApartmentHandler({ propertyId: filterApartment?.property?._id });

     const apartment = GetSingleApartmentData?.apartment;
     const images = apartment?.galleryImages ?? [];

     // ApartmentType me `video` na ho to bhi TypeScript error na aaye
     const videoUrl = (apartment as any)?.video as string | undefined;

     // Backend kabhi ek hi string me bhejta hai ("Gym\nPool\nSecurity" ya "Gym, Pool"),
     // isliye har item ko newline / comma / ; / | par split karke alag chips banate hain.
     const amenitiesList: string[] = (Array.isArray(apartment?.amenities) ? apartment?.amenities : apartment?.amenities ? [apartment?.amenities] : [])
          .flatMap((a: any) => String(a).split(/[\n,;|]+/))
          .map((a: string) => a.trim())
          .filter(Boolean);

     const handleAcceptMatches = async (matchId: string) => {
          await handleAcceptPropertyAPI(matchId);
          navigation?.goBack();
     };

     const handleRejectMatches = async () => {
          await handleRejectBySellerAPI(matchID ?? '');
          navigation?.goBack();
          console.log(matchID);
     };

     const handlePlayVideo = () => {
          setVideoError(false);
          setVideoStarted(true);
          setVideoPaused(false);
     };

     const handleVideoEnd = () => {
          setVideoPaused(true);
          setVideoStarted(false);
          videoRef.current?.seek?.(0);
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

     const matchStatus = filterApartment?.status as string | undefined;
     const statusStyle = matchStatus ? STATUS_STYLES[matchStatus] : undefined;

     const contactPerson = userData.role === 'Seller' ? relevantMatch?.matchLikedBy?.buyer : relevantMatch?.matchAcceptedBy?.seller;

     const detailItems = [
          apartment?.floor ? { icon: 'layers', label: `Floor ${apartment?.floor}` } : null,
          apartment?.furnished ? { icon: 'box', label: apartment?.furnished } : null,
          apartment?.parking ? { icon: 'truck', label: `${apartment?.parking} Parking` } : null,
          apartment?.availability ? { icon: 'calendar', label: apartment?.availability } : null,
     ].filter(Boolean) as { icon: string; label: string }[];

     const renderSectionTitle = (title: string, iconName: string, iconColor: string = colors.PrimaryColor, bg: string = '#F0F7FF') => (
          <View style={styles.sectionHeader}>
               <View style={[styles.sectionIconWrap, { backgroundColor: bg }]}>
                    <Icon name={iconName} size={14} color={iconColor} />
               </View>
               <Text style={styles.sectionTitle}>{title}</Text>
          </View>
     );

     return (
          <View style={styles.container}>
               <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: showAcceptBar ? 120 : 32 }}>
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
                              {images.length > 0 ? (
                                   images.map((image, index) => <Image key={index} source={{ uri: image }} style={styles.apartmentImage} />)
                              ) : (
                                   <View style={[styles.apartmentImage, styles.imagePlaceholder]}>
                                        <Icon name="image" size={40} color="#B0BEC5" />
                                   </View>
                              )}
                         </ScrollView>

                         {/* Soft shading so buttons / indicators stay readable */}
                         <View style={styles.topShade} pointerEvents="none" />
                         <View style={styles.bottomShade} pointerEvents="none" />

                         {/* Header Buttons */}
                         <View style={[styles.imageHeader]}>
                              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={() => navigation?.goBack()}>
                                   <Icon name="arrow-left" size={22} color="#fff" />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={() => setIsFavorite(!isFavorite)}>
                                   {isFavorite ? <MaterialIcon name="favorite" size={22} color="#FF5252" /> : <MaterialIcon name="favorite-border" size={22} color="#fff" />}
                              </TouchableOpacity>
                         </View>

                         {/* Featured Badge */}
                         {apartment?.featured && (
                              <View style={styles.featuredWrap} pointerEvents="none">
                                   <View style={styles.featuredBadge}>
                                        <Icon name="star" size={14} color="#FFD700" />
                                        <Text style={styles.featuredText}>Featured</Text>
                                   </View>
                              </View>
                         )}

                         {/* Dots + Counter */}
                         {images.length > 1 && (
                              <View style={styles.imageDots} pointerEvents="none">
                                   {images.map((_, index) => (
                                        <View key={index} style={[styles.imageDot, index === currentImageIndex && styles.imageDotActive]} />
                                   ))}
                              </View>
                         )}
                         {images.length > 0 && (
                              <View style={styles.imageCounter}>
                                   <Icon name="image" size={12} color="#fff" />
                                   <Text style={styles.imageCounterText}>
                                        {currentImageIndex + 1} / {images.length}
                                   </Text>
                              </View>
                         )}
                    </View>

                    {/* Main Content (sheet overlapping the image) */}
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

                              <View style={styles.priceRow}>
                                   <View style={styles.priceWrap}>
                                        <Text style={styles.currency}>$</Text>
                                        <Text style={styles.price}>{formatNumber(apartment?.price)}</Text>
                                   </View>

                                   {!!statusStyle && (
                                        <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                                             <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
                                             <Text style={[styles.statusText, { color: statusStyle.text }]}>{matchStatus}</Text>
                                        </View>
                                   )}
                              </View>
                         </View>

                         {/* Quick Stats */}
                         <View style={styles.statsContainer}>
                              <View style={styles.stat}>
                                   <View style={styles.statIconWrap}>
                                        <Icon name="home" size={20} color={colors.PrimaryColor} />
                                   </View>
                                   <Text style={styles.statNumber}>{apartment?.bedrooms}</Text>
                                   <Text style={styles.statLabel}>Bedrooms</Text>
                              </View>

                              <View style={styles.statDivider} />

                              <View style={styles.stat}>
                                   <View style={styles.statIconWrap}>
                                        <Icon name="droplet" size={20} color={colors.PrimaryColor} />
                                   </View>
                                   <Text style={styles.statNumber}>{apartment?.bathrooms}</Text>
                                   <Text style={styles.statLabel}>Bathrooms</Text>
                              </View>

                              <View style={styles.statDivider} />

                              <View style={styles.stat}>
                                   <View style={styles.statIconWrap}>
                                        <Icon name="maximize" size={20} color={colors.PrimaryColor} />
                                   </View>
                                   <Text style={styles.statNumber}>{apartment?.area}</Text>
                                   <Text style={styles.statLabel}>sq ft</Text>
                              </View>
                         </View>

                         {/* Details Section */}
                         {detailItems.length > 0 && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Details', 'list')}
                                   <View style={styles.chipGrid}>
                                        {detailItems.map((item, index) => (
                                             <View key={index} style={styles.chip}>
                                                  <Icon name={item.icon} size={16} color={colors.PrimaryColor} />
                                                  <Text style={styles.chipText}>{item.label}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         )}

                         {/* Description */}
                         {!!apartment?.description && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Description', 'file-text')}
                                   <Text style={styles.description}>{apartment?.description}</Text>
                              </View>
                         )}

                         {/* Property Video (sirf tab dikhega jab video URL ho) */}
                         {!!videoUrl && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Property Video', 'video')}

                                   {videoError ? (
                                        <View style={[styles.videoWrap, styles.videoErrorBox]}>
                                             <Icon name="video-off" size={28} color="#9CA3AF" />
                                             <Text style={styles.videoErrorText}>Video could not be loaded</Text>
                                             <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={handlePlayVideo}>
                                                  <Icon name="refresh-cw" size={14} color={colors.PrimaryColor} />
                                                  <Text style={styles.retryText}>Try again</Text>
                                             </TouchableOpacity>
                                        </View>
                                   ) : (
                                        <View style={styles.videoWrap}>
                                             <Video
                                                  ref={videoRef}
                                                  source={{ uri: videoUrl }}
                                                  style={styles.video}
                                                  resizeMode="contain"
                                                  paused={videoPaused}
                                                  controls={videoStarted}
                                                  onLoad={() => setVideoLoading(false)}
                                                  onError={() => {
                                                       setVideoError(true);
                                                       setVideoPaused(true);
                                                       setVideoStarted(false);
                                                  }}
                                                  onEnd={handleVideoEnd}
                                             />

                                             {/* Play overlay — video start hone se pehle */}
                                             {!videoStarted && (
                                                  <TouchableOpacity style={styles.playOverlay} activeOpacity={0.85} onPress={handlePlayVideo}>
                                                       <View style={styles.playCircle}>
                                                            <Icon name="play" size={26} color="#fff" />
                                                       </View>
                                                  </TouchableOpacity>
                                             )}

                                             {/* Loading spinner — play dabane ke baad jab tak load na ho */}
                                             {videoStarted && !videoPaused && videoLoading && (
                                                  <View style={styles.videoLoader} pointerEvents="none">
                                                       <ActivityIndicator color="#fff" />
                                                  </View>
                                             )}
                                        </View>
                                   )}
                              </View>
                         )}

                         {/* Issue Note (agar property par issue_note ho) */}
                         {!!(apartment as any)?.issue_note && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Issue Note', 'alert-circle', '#F59E0B', '#FEF3C7')}
                                   <View style={styles.issueCard}>
                                        <View style={styles.issueAccent} />
                                        <Text style={styles.issueText}>{(apartment as any)?.issue_note}</Text>
                                   </View>
                              </View>
                         )}

                         {/* Amenities — alag alag chips */}
                         {amenitiesList.length > 0 && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Amenities', 'check-circle', '#22C55E', '#DCFCE7')}
                                   <View style={styles.chipGrid}>
                                        {amenitiesList.map((amenity: string, index: number) => (
                                             <View key={index} style={styles.amenityChip}>
                                                  <Icon name="check" size={14} color="#22C55E" />
                                                  <Text style={styles.amenityText}>{amenity}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         )}

                         {/* Contact card — shown once Matched, for either role */}
                         {relevantMatch?.status === 'Matched' && (
                              <View style={styles.section}>
                                   {renderSectionTitle(userData.role === 'Seller' ? 'Contact buyer' : 'Contact agent', 'user')}
                                   <View style={styles.agentCard}>
                                        <Image source={{ uri: contactPerson?.profilePicture }} style={styles.agentImage} />
                                        <View style={styles.agentInfo}>
                                             <Text style={styles.agentName} numberOfLines={1}>
                                                  {contactPerson?.name}
                                             </Text>
                                             <View style={styles.agentDetail}>
                                                  <View style={styles.agentDetailIcon}>
                                                       <Icon name="phone" size={12} color={colors.PrimaryColor} />
                                                  </View>
                                                  <Text style={styles.agentText} numberOfLines={1}>
                                                       {contactPerson?.phone}
                                                  </Text>
                                             </View>
                                             <View style={styles.agentDetail}>
                                                  <View style={styles.agentDetailIcon}>
                                                       <Icon name="map-pin" size={12} color={colors.PrimaryColor} />
                                                  </View>
                                                  <Text style={styles.agentText} numberOfLines={2}>
                                                       {contactPerson?.address}
                                                  </Text>
                                             </View>
                                        </View>
                                   </View>
                              </View>
                         )}
                    </View>
               </ScrollView>

               {/* Sticky bottom CTA — scroll ke bahar, hamesha visible */}
               {showAcceptBar && !showStatusOnly ? (
                    <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                         <View style={styles.bottomPriceBlock}>
                              <Text style={styles.bottomPriceLabel}>Price</Text>
                              <Text style={styles.bottomPriceValue}>{formatPrice(apartment?.price)}</Text>
                         </View>

                         <View style={styles.bottomButtons}>
                              <TouchableOpacity disabled={RejectLoading} activeOpacity={RejectLoading ? 1 : 0.85} style={styles.rejectButton} onPress={() => matchID && handleRejectMatches()}>
                                   {RejectLoading ? (
                                        <ActivityIndicator color="#EF4444" />
                                   ) : (
                                        <>
                                             <Icon name="x" size={18} color="#EF4444" />
                                             <Text style={styles.rejectButtonText}>Reject</Text>
                                        </>
                                   )}
                              </TouchableOpacity>

                              <TouchableOpacity
                                   disabled={isLoading}
                                   activeOpacity={isLoading ? 1 : 0.85}
                                   style={styles.acceptButton}
                                   onPress={() => relevantMatch?._id && handleAcceptMatches(relevantMatch._id)}
                              >
                                   {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                   ) : (
                                        <>
                                             <Icon name="check" size={18} color="#fff" />
                                             <Text style={styles.acceptButtonText}>Accept</Text>
                                        </>
                                   )}
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

     // ---- Gallery ----
     imageGallery: {
          position: 'relative',
          height: 320,
          backgroundColor: '#ECEFF1',
     },
     apartmentImage: {
          width: width,
          height: 320,
     },
     imagePlaceholder: {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ECEFF1',
     },
     topShade: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: 'rgba(0,0,0,0.22)',
     },
     bottomShade: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 90,
          backgroundColor: 'rgba(0,0,0,0.18)',
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
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          alignItems: 'center',
     },
     featuredWrap: {
          position: 'absolute',
          top: 22,
          left: 0,
          right: 0,
          alignItems: 'center',
     },
     featuredBadge: {
          backgroundColor: 'rgba(0,0,0,0.65)',
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
     imageDots: {
          position: 'absolute',
          bottom: 42,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
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
     imageCounter: {
          position: 'absolute',
          bottom: 40,
          right: 16,
          backgroundColor: 'rgba(0,0,0,0.55)',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
     },
     imageCounterText: {
          color: '#fff',
          fontSize: 12,
          fontFamily: Font.font500,
     },

     // ---- Content sheet ----
     content: {
          backgroundColor: '#fff',
          marginTop: -26,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 20,
          paddingTop: 22,
     },
     titleSection: {
          marginBottom: 20,
     },
     titleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 8,
     },
     title: {
          fontSize: 23,
          fontFamily: Font.font500,
          color: '#111827',
          flex: 1,
     },
     typeBadge: {
          backgroundColor: '#F0F7FF',
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 14,
          marginTop: 3,
     },
     typeText: {
          color: colors.PrimaryColor,
          fontSize: 12,
          fontFamily: Font.font500,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14,
          gap: 6,
     },
     location: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#6B7280',
          flex: 1,
     },
     priceRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
     },
     priceWrap: {
          flexDirection: 'row',
          alignItems: 'flex-start',
     },
     currency: {
          fontSize: 20,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
          marginTop: 5,
          marginRight: 3,
     },
     price: {
          fontSize: 32,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     statusPill: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          gap: 6,
     },
     statusDot: {
          width: 7,
          height: 7,
          borderRadius: 4,
     },
     statusText: {
          fontSize: 12,
          fontFamily: Font.font500,
     },

     // ---- Stats ----
     statsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8F9FA',
          borderWidth: 1,
          borderColor: '#EEF0F3',
          borderRadius: 18,
          paddingVertical: 16,
          marginBottom: 26,
     },
     stat: {
          flex: 1,
          alignItems: 'center',
     },
     statIconWrap: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
     },
     statDivider: {
          width: 1,
          height: 52,
          backgroundColor: '#E5E7EB',
     },
     statNumber: {
          fontSize: 17,
          fontFamily: Font.font500,
          color: '#111827',
          marginTop: 8,
     },
     statLabel: {
          fontSize: 11,
          fontFamily: Font.font400,
          color: '#9CA3AF',
          marginTop: 2,
     },

     // ---- Sections ----
     section: {
          marginBottom: 26,
     },
     sectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
          gap: 8,
     },
     sectionIconWrap: {
          width: 26,
          height: 26,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
     },
     sectionTitle: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#1F2937',
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
          borderWidth: 1,
          borderColor: '#EEF0F3',
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderRadius: 12,
          gap: 7,
     },
     chipText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#4B5563',
     },
     amenityChip: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F0FDF4',
          borderWidth: 1,
          borderColor: '#BBF7D0',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          gap: 6,
     },
     amenityText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#166534',
     },
     description: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#4B5563',
          lineHeight: 23,
     },

     // ---- Video ----
     videoWrap: {
          width: '100%',
          height: 210,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#111827',
     },
     video: {
          ...StyleSheet.absoluteFillObject,
     },
     playOverlay: {
          ...StyleSheet.absoluteFillObject,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.25)',
     },
     playCircle: {
          width: 62,
          height: 62,
          borderRadius: 31,
          backgroundColor: colors.PrimaryColor,
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 3,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
     },
     videoLoader: {
          ...StyleSheet.absoluteFillObject,
          alignItems: 'center',
          justifyContent: 'center',
     },
     videoErrorBox: {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F9FA',
          borderWidth: 1,
          borderColor: '#EEF0F3',
          gap: 8,
     },
     videoErrorText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#6B7280',
     },
     retryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#F0F7FF',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 16,
          marginTop: 2,
     },
     retryText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },

     // ---- Issue note ----
     issueCard: {
          flexDirection: 'row',
          backgroundColor: '#FFFBEB',
          borderWidth: 1,
          borderColor: '#FDE68A',
          borderRadius: 14,
          overflow: 'hidden',
     },
     issueAccent: {
          width: 4,
          backgroundColor: '#F59E0B',
     },
     issueText: {
          flex: 1,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 14,
          lineHeight: 21,
          fontFamily: Font.font400,
          color: '#374151',
     },

     // ---- Contact ----
     agentCard: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#EEF0F3',
          borderRadius: 18,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.07,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
     },
     agentImage: {
          width: 62,
          height: 62,
          borderRadius: 31,
          marginRight: 14,
          backgroundColor: '#E5E7EB',
     },
     agentInfo: {
          flex: 1,
          justifyContent: 'center',
     },
     agentName: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#1F2937',
          marginBottom: 8,
     },
     agentDetail: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
     },
     agentDetailIcon: {
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: '#F0F7FF',
          alignItems: 'center',
          justifyContent: 'center',
     },
     agentText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#4B5563',
          flex: 1,
     },

     // ---- Bottom bar ----
     bottomBar: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
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
     bottomPriceBlock: {
          minWidth: 78,
     },
     bottomPriceLabel: {
          fontSize: 11,
          fontFamily: Font.font400,
          color: '#9CA3AF',
     },
     bottomPriceValue: {
          fontSize: 18,
          fontFamily: Font.font500,
          color: '#111827',
     },
     bottomButtons: {
          flex: 1,
          flexDirection: 'row',
          gap: 10,
     },
     acceptButton: {
          flex: 1,
          flexDirection: 'row',
          gap: 6,
          backgroundColor: colors.PrimaryColor,
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.PrimaryColor,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
     },
     rejectButton: {
          flex: 1,
          flexDirection: 'row',
          gap: 6,
          backgroundColor: '#FEF2F2',
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#FCA5A5',
     },
     acceptButtonText: {
          color: '#fff',
          fontSize: 15,
          fontFamily: Font.font500,
     },
     rejectButtonText: {
          color: '#EF4444',
          fontSize: 15,
          fontFamily: Font.font500,
     },
});

export default AgentMatchDetail;
