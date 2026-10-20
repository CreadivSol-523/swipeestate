import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { GetApartmentType } from '../../redux/Apartments/ApartmentType';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

const { width } = Dimensions.get('window');

type Props = {
     route: { params?: { filterApartment?: GetApartmentType } };
     navigation: Navigation;
};

const formatPrice = (value?: number | string) => {
     if (value === undefined || value === null || value === '') return '—';
     const num = Number(value);
     if (Number.isNaN(num)) return String(value);
     return `$${num.toLocaleString()}`;
};

const SingleApartment = ({ navigation, route }: Props) => {
     const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const [isFavorite, setIsFavorite] = useState(false);
     const insets = useSafeAreaInsets();

     const { filterApartment } = route.params || {};
     const images = filterApartment?.featuredImages ?? [];

     return (
          <View style={styles.container}>
               <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
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
                                   <FastImage key={index} source={{ uri: image }} style={styles.apartmentImage} resizeMode={FastImage.resizeMode.cover} />
                              ))}
                         </ScrollView>

                         {/* Header Buttons — now respects the notch/status bar */}
                         <View style={[styles.imageHeader]}>
                              <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
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
                         {filterApartment?.featured && (
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
                                        {filterApartment?.title}
                                   </Text>
                                   {!!filterApartment?.type && (
                                        <View style={styles.typeBadge}>
                                             <Text style={styles.typeText}>{filterApartment?.type}</Text>
                                        </View>
                                   )}
                              </View>
                              <View style={styles.locationRow}>
                                   <Icon name="map-pin" size={15} color={colors.PrimaryColor} />
                                   <Text style={styles.location} numberOfLines={1}>
                                        {filterApartment?.location}
                                   </Text>
                              </View>
                              <Text style={styles.price}>{formatPrice(filterApartment?.price)}</Text>
                         </View>

                         {/* Quick Stats */}
                         <View style={styles.statsContainer}>
                              <View style={styles.stat}>
                                   <Icon name="home" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.statNumber}>{filterApartment?.bedrooms}</Text>
                                   <Text style={styles.statLabel}>Bedrooms</Text>
                              </View>

                              <View style={styles.statDivider} />

                              <View style={styles.stat}>
                                   <Icon name="droplet" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.statNumber}>{filterApartment?.bathrooms}</Text>
                                   <Text style={styles.statLabel}>Bathrooms</Text>
                              </View>

                              <View style={styles.statDivider} />

                              <View style={styles.stat}>
                                   <Icon name="maximize" size={20} color={colors.PrimaryColor} />
                                   <Text style={styles.statNumber}>{filterApartment?.area}</Text>
                                   <Text style={styles.statLabel}>sq ft</Text>
                              </View>
                         </View>

                         {/* Details Section */}
                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>Details</Text>
                              <View style={styles.chipGrid}>
                                   {!!filterApartment?.floor && (
                                        <View style={styles.chip}>
                                             <Icon name="layers" size={16} color="#666" />
                                             <Text style={styles.chipText}>Floor {filterApartment?.floor}</Text>
                                        </View>
                                   )}
                                   {!!filterApartment?.furnished && (
                                        <View style={styles.chip}>
                                             <Icon name="box" size={16} color="#666" />
                                             <Text style={styles.chipText}>{filterApartment?.furnished}</Text>
                                        </View>
                                   )}
                                   {!!filterApartment?.parking && (
                                        <View style={styles.chip}>
                                             <Icon name="truck" size={16} color="#666" />
                                             <Text style={styles.chipText}>{filterApartment?.parking} Parking</Text>
                                        </View>
                                   )}
                                   {!!filterApartment?.availability && (
                                        <View style={styles.chip}>
                                             <Icon name="calendar" size={16} color="#666" />
                                             <Text style={styles.chipText}>{filterApartment?.availability}</Text>
                                        </View>
                                   )}
                              </View>
                         </View>

                         {/* Description */}
                         {!!filterApartment?.description && (
                              <View style={styles.section}>
                                   <Text style={styles.sectionTitle}>Description</Text>
                                   <Text style={styles.description}>{filterApartment?.description}</Text>
                              </View>
                         )}

                         {/* Amenities — same chip-grid treatment as Details, for visual consistency */}
                         {!!filterApartment?.amenities?.length && (
                              <View style={styles.section}>
                                   <Text style={styles.sectionTitle}>Amenities</Text>
                                   <View style={styles.chipGrid}>
                                        {filterApartment.amenities.map((amenity, index) => (
                                             <View key={index} style={styles.chip}>
                                                  <Icon name="check-circle" size={16} color="#22C55E" />
                                                  <Text style={styles.chipText}>{amenity}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         )}
                    </View>
               </ScrollView>
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
});

export default SingleApartment;
