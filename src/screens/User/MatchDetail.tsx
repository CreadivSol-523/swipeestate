import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { matches } from '../../redux/Matches/MatchType';
import API_BASE_URL from '../../utils/Config';
import { useAuth } from '../../utils/Storage/Storage';
import { useAcceptPropertyHandler, useGetSingleMatchHandler, useUnlockContactHandler } from '../../models/Matches/Matches';

const { width } = Dimensions.get('window');

const PRIMARY = '#00BCD4';

type Props = {
     route: { params?: { filterApartment?: matches } };
     navigation: Navigation;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
     Requested: { bg: '#FFF7E0', text: '#B45309', dot: '#F59E0B' },
     Matched: { bg: '#E8F8EE', text: '#15803D', dot: '#22C55E' },
     Rejected: { bg: '#FDECEC', text: '#B91C1C', dot: '#EF4444' },
};

const formatPrice = (value?: number | string) => {
     if (value === undefined || value === null || value === '') return '—';
     const n = Number(value);
     return Number.isNaN(n) ? String(value) : n.toLocaleString();
};

const MatchDetail = ({ navigation, route }: Props) => {
     const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const [isFavorite, setIsFavorite] = useState(false);

     // Video player state (hooks early return se pehle hi rehne chahiye)
     const videoRef = useRef<any>(null);
     const [videoPaused, setVideoPaused] = useState(true);
     const [videoStarted, setVideoStarted] = useState(false);
     const [videoLoading, setVideoLoading] = useState(true);
     const [videoError, setVideoError] = useState(false);

     const { filterApartment: paramsData } = route.params || {};

     const { userData } = useAuth();

     const { handleAcceptPropertyAPI, isLoading } = useAcceptPropertyHandler();
     const { handleUnlockContactAPI, isLoading: UnlockLoading } = useUnlockContactHandler();
     const { GetSingleMatch, GetSingleMatchLoading } = useGetSingleMatchHandler(paramsData?._id as unknown as string);

     const filterApartment = (GetSingleMatch?.data as any)?.match;
     console.log(filterApartment);
     const property = filterApartment?.property;
     const isSeller = userData.role === 'Seller';
     const isBuyer = userData.role === 'Buyer';
     const status = filterApartment?.status;
     const statusStyle = STATUS_STYLES[status as string];

     const galleryImages: string[] = property?.galleryImages ?? [];
     const videoUrl = property?.video as string | undefined;

     // Backend kabhi ek hi string me bhejta hai ("Gym\nPool\nSecurity" ya "Gym, Pool"),
     // isliye har item ko newline / comma / ; / | par split karke alag chips banate hain.
     const amenitiesList: string[] = (Array.isArray(property?.amenities) ? property.amenities : property?.amenities ? [property.amenities] : [])
          .flatMap((a: any) => String(a).split(/[\n,;|]+/))
          .map((a: string) => a.trim())
          .filter(Boolean);

     const handleAcceptMatches = (matchId: string) => {
          handleAcceptPropertyAPI(matchId);
     };

     const handleViewContact = (matchId: string) => {
          handleUnlockContactAPI(matchId);
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

     const renderSectionTitle = (title: string, iconName: string, iconColor: string = PRIMARY) => (
          <View style={styles.sectionHeader}>
               <View style={[styles.sectionIconWrap, { backgroundColor: iconColor + '1A' }]}>
                    <Icon name={iconName} size={14} color={iconColor} />
               </View>
               <Text style={styles.sectionTitle}>{title}</Text>
          </View>
     );

     // Ek hi card teeno cases ke liye. locked=true par image blur + text masked (asli data screen par nahi aata)
     const renderContactCard = (title: string, person: any, locked: boolean = false, footer?: React.ReactNode) => (
          <View style={styles.section}>
               {renderSectionTitle(title, 'user')}
               <View style={styles.agentCard}>
                    <View style={styles.agentImageWrap}>
                         {locked ? (
                              // FastImage blur support nahi karta, isliye RN Image
                              <Image source={{ uri: person?.profilePicture }} style={styles.agentImage} resizeMode="cover" blurRadius={10} />
                         ) : (
                              <FastImage source={{ uri: person?.profilePicture }} style={styles.agentImage} resizeMode={FastImage.resizeMode.cover} />
                         )}
                         {locked && (
                              <View style={styles.lockBadge}>
                                   <Icon name="lock" size={12} color="#fff" />
                              </View>
                         )}
                    </View>

                    <View style={styles.agentInfo}>
                         <Text style={styles.agentName} numberOfLines={1}>
                              {person?.name}
                         </Text>
                         <View style={styles.agentDetail}>
                              <View style={styles.agentDetailIcon}>
                                   <Icon name="phone" size={12} color={PRIMARY} />
                              </View>
                              <Text style={[styles.agentText, locked && styles.lockedText]} numberOfLines={1}>
                                   {locked ? '+•• ••• •••••••' : person?.phone}
                              </Text>
                         </View>
                         <View style={styles.agentDetail}>
                              <View style={styles.agentDetailIcon}>
                                   <Icon name="map-pin" size={12} color={PRIMARY} />
                              </View>
                              <Text style={[styles.agentText, locked && styles.lockedText]} numberOfLines={2}>
                                   {locked ? '•••••• •••••• ••••' : person?.address}
                              </Text>
                         </View>
                    </View>
               </View>
               {footer}
          </View>
     );

     const renderContactSection = () => {
          if (isSeller) {
               if (status === 'Requested') {
                    return (
                         <View style={styles.section}>
                              {renderSectionTitle('Match Request', 'user-plus')}
                              <View style={styles.requestCard}>
                                   <Text style={styles.requestText}>A buyer is interested in this property. Accept to connect with them.</Text>
                                   <View style={styles.contactButtons}>
                                        <TouchableOpacity disabled={isLoading} activeOpacity={isLoading ? 1 : 0.2} style={styles.callButton} onPress={() => handleAcceptMatches(filterApartment?._id)}>
                                             {isLoading ? (
                                                  <ActivityIndicator color="#fff" />
                                             ) : (
                                                  <>
                                                       <Icon name="check" size={18} color="#fff" />
                                                       <Text style={styles.callButtonText}>Accept</Text>
                                                  </>
                                             )}
                                        </TouchableOpacity>
                                   </View>
                              </View>
                         </View>
                    );
               }
               if (status === 'Matched') return renderContactCard('Contact Buyer', filterApartment?.buyer);
               if (status === 'Rejected') return null;
          }

          if ((isBuyer && status === 'Rejected') || status === 'Requested') {
               return null;
          }

          if (isBuyer && status === 'Matched') {
               // showContact true -> seller ka contact khula
               if (filterApartment?.showContact === true) {
                    return renderContactCard('Contact Agent', filterApartment?.seller);
               }

               // showContact false -> blur + View Contact button
               return renderContactCard(
                    'Contact Agent',
                    filterApartment?.seller,
                    true,
                    <View style={styles.contactButtons}>
                         <TouchableOpacity disabled={UnlockLoading} activeOpacity={UnlockLoading ? 1 : 0.2} style={styles.callButton} onPress={() => handleViewContact(filterApartment?._id)}>
                              {UnlockLoading ? (
                                   <ActivityIndicator color="#fff" />
                              ) : (
                                   <>
                                        <Icon name="unlock" size={18} color="#fff" />
                                        <Text style={styles.callButtonText}>View Contact</Text>
                                   </>
                              )}
                         </TouchableOpacity>
                    </View>,
               );
          }

          // Baqi sab cases (pehle wala default)
          return renderContactCard('Contact Agent', filterApartment?.seller);
     };

     if (GetSingleMatchLoading && !filterApartment) {
          return (
               <View style={styles.loaderWrap}>
                    <ActivityIndicator size="large" color={PRIMARY} />
               </View>
          );
     }

     const detailItems = [
          property?.floor ? { icon: 'layers', label: `Floor ${property.floor}` } : null,
          property?.furnished ? { icon: 'box', label: property.furnished } : null,
          property?.parking ? { icon: 'truck', label: `${property.parking} Parking` } : null,
          property?.availability ? { icon: 'calendar', label: property.availability } : null,
     ].filter(Boolean) as { icon: string; label: string }[];

     return (
          <>
               <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                              {galleryImages.length > 0 ? (
                                   galleryImages.map((image: string, index: number) => (
                                        <FastImage key={index} source={{ uri: image }} style={styles.apartmentImage} resizeMode={FastImage.resizeMode.cover} />
                                   ))
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
                         <View style={styles.imageHeader}>
                              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                                   <Icon name="arrow-left" size={22} color="#fff" />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={() => setIsFavorite(!isFavorite)}>
                                   {isFavorite ? <MaterialIcon name="favorite" size={22} color="#FF5252" /> : <MaterialIcon name="favorite-border" size={22} color="#fff" />}
                              </TouchableOpacity>
                         </View>

                         {/* Featured Badge */}
                         {property?.featured && (
                              <View style={styles.featuredWrap} pointerEvents="none">
                                   <View style={styles.featuredBadge}>
                                        <Icon name="star" size={14} color="#FFD700" />
                                        <Text style={styles.featuredText}>Featured</Text>
                                   </View>
                              </View>
                         )}

                         {/* Dots + Counter */}
                         {galleryImages.length > 0 && (
                              <>
                                   {galleryImages.length > 1 && (
                                        <View style={styles.dotsRow} pointerEvents="none">
                                             {galleryImages.map((_, i) => (
                                                  <View key={i} style={[styles.dot, i === currentImageIndex && styles.dotActive]} />
                                             ))}
                                        </View>
                                   )}
                                   <View style={styles.imageIndicator}>
                                        <Icon name="image" size={12} color="#fff" />
                                        <Text style={styles.imageIndicatorText}>
                                             {currentImageIndex + 1} / {galleryImages.length}
                                        </Text>
                                   </View>
                              </>
                         )}
                    </View>

                    {/* Main Content (sheet overlapping the image) */}
                    <View style={styles.content}>
                         {/* Title & Price */}
                         <View style={styles.titleSection}>
                              <View style={styles.titleRow}>
                                   <Text style={styles.title} numberOfLines={2}>
                                        {property?.title}
                                   </Text>
                                   {!!property?.type && (
                                        <View style={styles.typeBadge}>
                                             <Text style={styles.typeText}>{property?.type}</Text>
                                        </View>
                                   )}
                              </View>

                              <View style={styles.locationRow}>
                                   <Icon name="map-pin" size={15} color={PRIMARY} />
                                   <Text style={styles.location}>{property?.location}</Text>
                              </View>

                              <View style={styles.priceRow}>
                                   <View style={styles.priceWrap}>
                                        <Text style={styles.currency}>$</Text>
                                        <Text style={styles.price}>{formatPrice(property?.price)}</Text>
                                   </View>

                                   {!!statusStyle && (
                                        <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                                             <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
                                             <Text style={[styles.statusText, { color: statusStyle.text }]}>{status}</Text>
                                        </View>
                                   )}
                              </View>
                         </View>

                         {/* Quick Stats */}
                         <View style={styles.statsContainer}>
                              <View style={styles.stat}>
                                   <View style={styles.statIconWrap}>
                                        <Icon name="home" size={20} color={PRIMARY} />
                                   </View>
                                   <Text style={styles.statNumber}>{property?.bedrooms}</Text>
                                   <Text style={styles.statLabel}>Bedrooms</Text>
                              </View>
                              <View style={styles.statDivider} />
                              <View style={styles.stat}>
                                   <View style={styles.statIconWrap}>
                                        <Icon name="droplet" size={20} color={PRIMARY} />
                                   </View>
                                   <Text style={styles.statNumber}>{property?.bathrooms}</Text>
                                   <Text style={styles.statLabel}>Bathrooms</Text>
                              </View>
                              <View style={styles.statDivider} />
                              <View style={styles.stat}>
                                   <View style={styles.statIconWrap}>
                                        <Icon name="maximize" size={20} color={PRIMARY} />
                                   </View>
                                   <Text style={styles.statNumber}>{property?.area}</Text>
                                   <Text style={styles.statLabel}>sq ft</Text>
                              </View>
                         </View>

                         {/* Details Section */}
                         {detailItems.length > 0 && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Details', 'list')}
                                   <View style={styles.detailsGrid}>
                                        {detailItems.map((item, index) => (
                                             <View key={index} style={styles.detailItem}>
                                                  <Icon name={item.icon} size={16} color={PRIMARY} />
                                                  <Text style={styles.detailText}>{item.label}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         )}

                         {/* Description */}
                         {!!property?.description && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Description', 'file-text')}
                                   <Text style={styles.description}>{property?.description}</Text>
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
                                                  <Icon name="refresh-cw" size={14} color={PRIMARY} />
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

                         {/* Issue Note */}
                         {!!property?.issue_note && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Issue Note', 'alert-circle', '#F59E0B')}
                                   <View style={styles.issueCard}>
                                        <View style={styles.issueAccent} />
                                        <Text style={styles.issueText}>{property?.issue_note}</Text>
                                   </View>
                              </View>
                         )}

                         {/* Amenities */}
                         {amenitiesList.length > 0 && (
                              <View style={styles.section}>
                                   {renderSectionTitle('Amenities', 'check-circle', '#4CAF50')}
                                   <View style={styles.amenitiesContainer}>
                                        {amenitiesList.map((amenity: string, index: number) => (
                                             <View key={index} style={styles.amenityItem}>
                                                  <Icon name="check" size={14} color="#4CAF50" />
                                                  <Text style={styles.amenityText}>{amenity}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         )}

                         {/* Agent / Buyer Contact */}
                         {renderContactSection()}
                    </View>
               </ScrollView>
          </>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
     },
     loaderWrap: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
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
          top: 16,
          left: 16,
          right: 16,
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
          fontWeight: '600',
     },
     dotsRow: {
          position: 'absolute',
          bottom: 42,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
     },
     dot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.5)',
     },
     dotActive: {
          width: 18,
          backgroundColor: '#fff',
     },
     imageIndicator: {
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
     imageIndicatorText: {
          color: '#fff',
          fontSize: 12,
          fontWeight: '600',
     },

     // ---- Content sheet ----
     content: {
          backgroundColor: '#fff',
          marginTop: -26,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 20,
          paddingTop: 22,
          paddingBottom: 100,
     },
     titleSection: {
          marginBottom: 20,
     },
     titleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
          gap: 10,
     },
     title: {
          fontSize: 24,
          fontWeight: '700',
          color: '#1F2937',
          flex: 1,
     },
     typeBadge: {
          backgroundColor: '#E0F7FA',
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 14,
          marginTop: 4,
     },
     typeText: {
          color: PRIMARY,
          fontSize: 12,
          fontWeight: '700',
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
          fontWeight: '700',
          color: PRIMARY,
          marginTop: 5,
          marginRight: 3,
     },
     price: {
          fontSize: 34,
          fontWeight: '800',
          color: '#111827',
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
          fontWeight: '700',
     },

     // ---- Stats ----
     statsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8F9FB',
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
          fontSize: 18,
          fontWeight: '700',
          color: '#111827',
          marginTop: 8,
     },
     statLabel: {
          fontSize: 12,
          color: '#6B7280',
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
          fontSize: 17,
          fontWeight: '700',
          color: '#1F2937',
     },
     detailsGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
     },
     detailItem: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8F9FB',
          borderWidth: 1,
          borderColor: '#EEF0F3',
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderRadius: 12,
          gap: 7,
     },
     detailText: {
          fontSize: 13,
          fontWeight: '500',
          color: '#4B5563',
     },
     description: {
          fontSize: 14,
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
          backgroundColor: PRIMARY,
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
          backgroundColor: '#F8F9FB',
          borderWidth: 1,
          borderColor: '#EEF0F3',
          gap: 8,
     },
     videoErrorText: {
          fontSize: 13,
          color: '#6B7280',
     },
     retryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#E0F7FA',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 16,
          marginTop: 2,
     },
     retryText: {
          fontSize: 13,
          fontWeight: '600',
          color: PRIMARY,
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
          color: '#374151',
     },

     // ---- Amenities ----
     amenitiesContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
     },
     amenityItem: {
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
          fontWeight: '500',
          color: '#166534',
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
          marginBottom: 12,
          shadowColor: '#000',
          shadowOpacity: 0.07,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
     },
     agentImageWrap: {
          marginRight: 14,
     },
     agentImage: {
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: '#ECEFF1',
     },
     lockBadge: {
          position: 'absolute',
          right: -2,
          bottom: -2,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: PRIMARY,
          borderWidth: 2,
          borderColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
     },
     agentInfo: {
          flex: 1,
          justifyContent: 'center',
     },
     agentName: {
          fontSize: 17,
          fontWeight: '700',
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
          backgroundColor: '#E0F7FA',
          alignItems: 'center',
          justifyContent: 'center',
     },
     agentText: {
          fontSize: 13,
          color: '#4B5563',
          flex: 1,
     },
     lockedText: {
          color: '#9CA3AF',
          letterSpacing: 1,
     },
     requestCard: {
          backgroundColor: '#F8F9FB',
          borderWidth: 1,
          borderColor: '#EEF0F3',
          borderRadius: 18,
          padding: 16,
          gap: 14,
     },
     requestText: {
          fontSize: 14,
          lineHeight: 21,
          color: '#4B5563',
     },
     contactButtons: {
          flexDirection: 'row',
          gap: 12,
     },
     callButton: {
          flex: 1,
          backgroundColor: PRIMARY,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 15,
          borderRadius: 14,
          gap: 8,
          shadowColor: PRIMARY,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
     },
     callButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '700',
     },
     messageButton: {
          flex: 1,
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: PRIMARY,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 14,
          borderRadius: 14,
          gap: 8,
     },
     messageButtonText: {
          color: PRIMARY,
          fontSize: 16,
          fontWeight: '600',
     },
     bottomBar: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
     },
     bottomPrice: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     bottomPriceLabel: {
          fontSize: 12,
          color: '#999',
     },
     bottomPriceValue: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
          marginHorizontal: 4,
     },
     scheduleButton: {
          backgroundColor: PRIMARY,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
          gap: 8,
     },
     scheduleButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
     },
});

export default MatchDetail;
