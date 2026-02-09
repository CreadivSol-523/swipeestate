import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { matches } from '../../redux/Matches/MatchType';
import API_BASE_URL from '../../utils/Config';
import { GetApartmentType } from '../../redux/Apartments/ApartmentType';
import { useAcceptPropertyHandler } from '../../models/Matches/Matches';

const { width } = Dimensions.get('window');

type Props = {
     route: { params?: { filterApartment?: GetApartmentType } };
     navigation: Navigation;
};

const SingleApartment = ({ navigation, route }: Props) => {
     const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const [isFavorite, setIsFavorite] = useState(false);

     const { filterApartment } = route.params || {};
     console.log(filterApartment);

     return (
          <>
               <ScrollView showsVerticalScrollIndicator={false}>
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
                              {filterApartment?.featuredImages?.map((image, index) => (
                                   <Image key={index} source={{ uri: image }} style={styles.apartmentImage} />
                              ))}
                         </ScrollView>

                         {/* Header Buttons */}
                         <View style={styles.imageHeader}>
                              <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                                   <Icon name="arrow-left" size={24} color="#fff" />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.headerButton} onPress={() => setIsFavorite(!isFavorite)}>
                                   {isFavorite ? <MaterialIcon name="favorite" size={24} color="#FF5252" /> : <MaterialIcon name="favorite-border" size={24} color="#fff" />}
                              </TouchableOpacity>
                         </View>

                         {/* Image Indicator */}
                         <View style={styles.imageIndicator}>
                              <Text style={styles.imageIndicatorText}>
                                   {currentImageIndex + 1} / {filterApartment?.featuredImages?.length}
                              </Text>
                         </View>

                         {/* Featured Badge */}
                         {filterApartment?.featured && (
                              <View style={styles.featuredBadge}>
                                   <Icon name="star" size={16} color="#FFD700" />
                                   <Text style={styles.featuredText}>Featured</Text>
                              </View>
                         )}
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>
                         {/* Title & Price */}
                         <View style={styles.titleSection}>
                              <View style={styles.titleRow}>
                                   <Text style={styles.title}>{filterApartment?.title}</Text>
                                   <View style={styles.typeBadge}>
                                        <Text style={styles.typeText}>{filterApartment?.type}</Text>
                                   </View>
                              </View>
                              <View style={styles.locationRow}>
                                   <Icon name="map-pin" size={16} color="#00BCD4" />
                                   <Text style={styles.location}>{filterApartment?.location}</Text>
                              </View>
                              <View style={styles.priceRow}>
                                   <Icon name="dollar-sign" size={28} color="#00BCD4" />
                                   <Text style={styles.price}>{filterApartment?.price}</Text>
                              </View>
                         </View>

                         {/* Quick Stats */}
                         <View style={styles.statsContainer}>
                              <View style={styles.stat}>
                                   <Icon name="home" size={24} color="#00BCD4" />
                                   <Text style={styles.statNumber}>{filterApartment?.bedrooms}</Text>
                                   <Text style={styles.statLabel}>Bedrooms</Text>
                              </View>
                              <View style={styles.stat}>
                                   <Icon name="droplet" size={24} color="#00BCD4" />
                                   <Text style={styles.statNumber}>{filterApartment?.bathrooms}</Text>
                                   <Text style={styles.statLabel}>Bathrooms</Text>
                              </View>
                              <View style={styles.stat}>
                                   <Icon name="maximize" size={24} color="#00BCD4" />
                                   <Text style={styles.statNumber}>{filterApartment?.area}</Text>
                                   <Text style={styles.statLabel}>sq ft</Text>
                              </View>
                         </View>

                         {/* Details Section */}
                         <View style={styles.section}>
                              <Text style={styles.sectionTitle}>Details</Text>
                              <View style={styles.detailsGrid}>
                                   {filterApartment?.floor && (
                                        <View style={styles.detailItem}>
                                             <Icon name="layers" size={18} color="#666" />
                                             <Text style={styles.detailText}>Floor {filterApartment?.floor}</Text>
                                        </View>
                                   )}
                                   {filterApartment?.furnished && (
                                        <View style={styles.detailItem}>
                                             <Icon name="box" size={18} color="#666" />
                                             <Text style={styles.detailText}>{filterApartment?.furnished}</Text>
                                        </View>
                                   )}
                                   {filterApartment?.parking && (
                                        <View style={styles.detailItem}>
                                             <Icon name="truck" size={18} color="#666" />
                                             <Text style={styles.detailText}>{filterApartment?.parking} Parking</Text>
                                        </View>
                                   )}
                                   {filterApartment?.availability && (
                                        <View style={styles.detailItem}>
                                             <Icon name="calendar" size={18} color="#666" />
                                             <Text style={styles.detailText}>{filterApartment?.availability}</Text>
                                        </View>
                                   )}
                              </View>
                         </View>

                         {/* Description */}
                         {filterApartment?.description && (
                              <View style={styles.section}>
                                   <Text style={styles.sectionTitle}>Description</Text>
                                   <Text style={styles.description}>{filterApartment?.description}</Text>
                              </View>
                         )}

                         {/* Amenities */}
                         {filterApartment?.amenities && filterApartment?.amenities?.length > 0 && (
                              <View style={styles.section}>
                                   <Text style={styles.sectionTitle}>Amenities</Text>
                                   <View style={styles.amenitiesContainer}>
                                        {filterApartment?.amenities.map((amenity, index) => (
                                             <View key={index} style={styles.amenityItem}>
                                                  <Icon name="check-circle" size={18} color="#4CAF50" />
                                                  <Text style={styles.amenityText}>{amenity}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         )}
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
     imageGallery: {
          position: 'relative',
          height: 300,
     },
     apartmentImage: {
          width: width,
          height: 300,
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
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
     },
     imageIndicator: {
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
     },
     imageIndicatorText: {
          color: '#fff',
          fontSize: 12,
          fontWeight: '600',
     },
     featuredBadge: {
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: [{ translateX: -50 }],
          backgroundColor: 'rgba(0,0,0,0.7)',
          paddingHorizontal: 16,
          paddingVertical: 8,
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
     content: {
          padding: 16,
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
     },
     title: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
          flex: 1,
     },
     typeBadge: {
          backgroundColor: '#E3F2FD',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
     },
     typeText: {
          color: '#00BCD4',
          fontSize: 12,
          fontWeight: '600',
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
          gap: 6,
     },
     location: {
          fontSize: 14,
          color: '#666',
     },
     priceRow: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     price: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#333',
     },
     priceLabel: {
          fontSize: 14,
          color: '#999',
          marginLeft: 6,
     },
     statsContainer: {
          flexDirection: 'row',
          backgroundColor: '#F5F5F5',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
     },
     stat: {
          flex: 1,
          alignItems: 'center',
     },
     statNumber: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
          marginTop: 8,
     },
     statLabel: {
          fontSize: 12,
          color: '#666',
          marginTop: 4,
     },
     section: {
          marginBottom: 24,
     },
     sectionTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 12,
     },
     detailsGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
     },
     detailItem: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          gap: 6,
     },
     detailText: {
          fontSize: 14,
          color: '#666',
     },
     description: {
          fontSize: 14,
          color: '#666',
          lineHeight: 22,
     },
     amenitiesContainer: {
          gap: 12,
     },
     amenityItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
     },
     amenityText: {
          fontSize: 14,
          color: '#666',
     },
     agentCard: {
          flexDirection: 'row',
          backgroundColor: '#F5F5F5',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
     },
     agentImage: {
          width: 60,
          height: 60,
          borderRadius: 30,
          marginRight: 12,
     },
     agentInfo: {
          flex: 1,
          justifyContent: 'center',
     },
     agentName: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
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
          color: '#666',
     },
     contactButtons: {
          flexDirection: 'row',
          gap: 12,
     },
     callButton: {
          flex: 1,
          backgroundColor: '#00BCD4',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 14,
          borderRadius: 8,
          gap: 8,
     },
     callButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
     },
     messageButton: {
          flex: 1,
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: '#00BCD4',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 14,
          borderRadius: 8,
          gap: 8,
     },
     messageButtonText: {
          color: '#00BCD4',
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
          backgroundColor: '#00BCD4',
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

export default SingleApartment;
