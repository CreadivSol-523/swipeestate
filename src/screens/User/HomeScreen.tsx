import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import Field from '../../components/Field/Field';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import { windowWidth } from '../../utils/Dimension/Dimension';

const SAMPLE_PROPERTIES = [
     {
          id: 1,
          title: 'Modern Apartment',
          location: 'Downtown, New York',
          price: '$450,000',
          bedrooms: 3,
          bathrooms: 2,
          area: '1,200 sq ft',
          type: 'Apartment',
          rating: 4.8,
          featured: true,
     },
     {
          id: 2,
          title: 'Luxury Villa',
          location: 'Beverly Hills, LA',
          price: '$2,500,000',
          bedrooms: 5,
          bathrooms: 4,
          area: '4,500 sq ft',
          type: 'Villa',
          rating: 4.9,
          featured: true,
     },
     {
          id: 3,
          title: 'Cozy Studio',
          location: 'Brooklyn, New York',
          price: '$280,000',
          bedrooms: 1,
          bathrooms: 1,
          area: '650 sq ft',
          type: 'Studio',
          rating: 4.5,
          featured: false,
     },
     {
          id: 4,
          title: 'Family House',
          location: 'Austin, Texas',
          price: '$650,000',
          bedrooms: 4,
          bathrooms: 3,
          area: '2,800 sq ft',
          type: 'House',
          rating: 4.7,
          featured: false,
     },
     {
          id: 5,
          title: 'Penthouse Suite',
          location: 'Manhattan, New York',
          price: '$3,200,000',
          bedrooms: 4,
          bathrooms: 3,
          area: '3,500 sq ft',
          type: 'Penthouse',
          rating: 5.0,
          featured: true,
     },
];
type FilterKey = 'budget' | 'bedrooms' | 'location' | 'type' | 'rating' | 'area';

const HomeScreen = () => {
     const swiperRef = useRef<Swiper<any>>(null);
     const [currentIndex, setCurrentIndex] = useState(0);
     const [likedProperties, setLikedProperties] = useState<number[]>([]);
     const [selectedFilter, setSelectedFilter] = useState<FilterKey | string | undefined>(undefined);
     const [selectedValue, setSelectedValue] = useState<string | undefined | null>(undefined);

     const renderCard = (property: any) => {
          if (!property) return null;

          return (
               <View style={styles.card}>
                    {/* Image Section with Gradient Overlay */}
                    <View style={styles.imageSection}>
                         <View style={styles.imagePlaceholder}>
                              <Icon name="home" size={100} color="#E0E0E0" />
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
                                   <Text style={styles.detailValue}>{property.area.split(' ')[0]}</Text>
                                   <Text style={styles.detailLabel}>sq ft</Text>
                              </View>
                         </View>
                    </View>
               </View>
          );
     };

     const FILTER_CONFIG: Record<FilterKey, { label: string; value: string }[]> = {
          budget: [
               { label: 'Under $300k', value: 'under_300' },
               { label: '$300k – $500k', value: '300_500' },
               { label: '$500k – $800k', value: '500_800' },
               { label: '$800k+', value: '800_plus' },
          ],
          bedrooms: [
               { label: 'Studio', value: '0' },
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

     const renderNoMoreCards = () => {
          return (
               <View style={styles.noMoreCards}>
                    <View style={styles.noMoreCardsIcon}>
                         <Icon name="checkmark-circle" size={80} color={colors.PrimaryColor} />
                    </View>
                    <Text style={styles.noMoreCardsText}>All Caught Up!</Text>
                    <Text style={styles.noMoreCardsSubtext}>You've reviewed all available properties</Text>
                    <TouchableOpacity style={styles.refreshButton}>
                         <Icon name="refresh" size={20} color="#fff" />
                         <Text style={styles.refreshButtonText}>Load More</Text>
                    </TouchableOpacity>
               </View>
          );
     };

     const handleSwipeLeft = (index: number) => {
          console.log('Passed:', SAMPLE_PROPERTIES[index].title);
          // Check if this was the last card
          if (index === SAMPLE_PROPERTIES.length - 1) {
               setCurrentIndex(SAMPLE_PROPERTIES.length);
          }
     };

     const handleSwipeRight = (index: number) => {
          console.log('Liked:', SAMPLE_PROPERTIES[index].title);
          setLikedProperties([...likedProperties, SAMPLE_PROPERTIES[index].id]);
          // Check if this was the last card
          if (index === SAMPLE_PROPERTIES.length - 1) {
               setCurrentIndex(SAMPLE_PROPERTIES.length);
          }
     };

     const isLastCard = currentIndex == SAMPLE_PROPERTIES.length - 1;

     const handleLikePress = () => {
          if (isLastCard) return;
          swiperRef.current?.swipeRight();
     };

     const handlePassPress = () => {
          if (isLastCard) return;
          swiperRef.current?.swipeLeft();
     };

     const handleUndoPress = () => {
          if (currentIndex > 0) {
               swiperRef.current?.swipeBack();
               setCurrentIndex(0);
          }
     };

     return (
          <View style={styles.container}>
               {/* Enhanced Header */}
               <View style={{ paddingBottom: 100 }}>
                    <View style={{ paddingInline: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between', position: 'absolute' }}>
                         <CustomDropdown
                              placeholder="Filter By"
                              options={[
                                   { label: 'Budget', value: 'budget' },
                                   { label: 'Bedrooms', value: 'bedrooms' },
                                   { label: 'Location', value: 'location' },
                                   { label: 'Property Type', value: 'type' },
                                   { label: 'Rating', value: 'rating' },
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
                                        console.log('Applied filter:', selectedFilter, value);
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
                    <Swiper
                         ref={swiperRef}
                         cards={SAMPLE_PROPERTIES}
                         renderCard={renderCard}
                         onSwipedLeft={handleSwipeLeft}
                         onSwipedRight={handleSwipeRight}
                         showSecondCard
                         secondCardZoom={100}
                         onSwiped={index => {
                              setCurrentIndex(index + 1);
                         }}
                         backgroundColor="transparent"
                         stackSize={2}
                         stackScale={5}
                         stackSeparation={14}
                         animateCardOpacity
                         verticalSwipe={false}
                         infinite={false}
                         disableLeftSwipe={isLastCard}
                         disableRightSwipe={isLastCard}
                         disableBottomSwipe={true}
                         disableTopSwipe={true}
                         overlayLabels={{
                              left: {
                                   title: 'PASS',
                                   style: {
                                        label: {
                                             backgroundColor: '#FF3B30',
                                             color: '#fff',
                                             fontSize: 20,
                                             fontFamily: Font.font500,
                                             borderRadius: 8,
                                             padding: 8,
                                        },
                                        wrapper: {
                                             flexDirection: 'column',
                                             alignItems: 'flex-end',
                                             marginTop: 20,
                                             marginLeft: -40,
                                        },
                                   },
                              },
                              right: {
                                   title: 'LIKE',
                                   style: {
                                        label: {
                                             backgroundColor: colors.PrimaryColor,
                                             color: '#fff',
                                             fontSize: 20,
                                             fontFamily: Font.font500,
                                             borderRadius: 8,
                                             padding: 8,
                                        },
                                        wrapper: {
                                             flexDirection: 'column',
                                             alignItems: 'flex-start',
                                             marginTop: 20,
                                             marginLeft: 40,
                                        },
                                   },
                              },
                         }}
                         containerStyle={styles.cardContainer}
                         cardStyle={styles.cardStyle}
                    />
               </View>

               {/* Action Buttons */}
               <View style={styles.actionsContainer}>
                    <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handlePassPress}>
                         <Icon name="close" size={32} color="#FF3B30" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.undoButton]} onPress={handleUndoPress}>
                         <Icon name="arrow-undo" size={24} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLikePress}>
                         <Icon name="heart" size={32} color={colors.PrimaryColor} />
                    </TouchableOpacity>
               </View>
          </View>
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
