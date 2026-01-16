import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

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
  },
];

const HomeScreen = () => {
  const swiperRef = useRef<Swiper<any>>(null);

  const renderCard = (property: any) => {
    if (!property) return null;

    return (
      <View style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Icon name="home" size={80} color="#E0E0E0" />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{property.type}</Text>
          </View>

          <Text style={styles.propertyTitle}>{property.title}</Text>

          <View style={styles.locationRow}>
            <Icon name="location" size={16} color="#666" />
            <Text style={styles.locationText}>{property.location}</Text>
          </View>

          <Text style={styles.priceText}>{property.price}</Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Icon name="bed-outline" size={20} color={colors.PrimaryColor} />
              <Text style={styles.detailText}>{property.bedrooms} Beds</Text>
            </View>

            <View style={styles.detailItem}>
              <Icon
                name="water-outline"
                size={20}
                color={colors.PrimaryColor}
              />
              <Text style={styles.detailText}>{property.bathrooms} Baths</Text>
            </View>

            <View style={styles.detailItem}>
              <Icon
                name="resize-outline"
                size={20}
                color={colors.PrimaryColor}
              />
              <Text style={styles.detailText}>{property.area}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderNoMoreCards = () => {
    return (
      <View style={styles.noMoreCards}>
        <Icon name="checkmark-circle" size={80} color={colors.PrimaryColor} />
        <Text style={styles.noMoreCardsText}>No more properties!</Text>
        <Text style={styles.noMoreCardsSubtext}>
          Check back later for new listings
        </Text>
      </View>
    );
  };

  const handleSwipeLeft = (index: number) => {
    console.log('Swiped left on:', SAMPLE_PROPERTIES[index].title);
  };

  const handleSwipeRight = (index: number) => {
    console.log('Swiped right on:', SAMPLE_PROPERTIES[index].title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your dream property</Text>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={SAMPLE_PROPERTIES}
          renderCard={renderCard}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={3}
          stackScale={10}
          stackSeparation={15}
          animateCardOpacity
          verticalSwipe={false}
          overlayLabels={{
            left: {
              title: 'PASS',
              style: {
                label: {
                  backgroundColor: '#FF3B30',
                  color: '#fff',
                  fontSize: 24,
                  fontFamily: Font.font500,
                  borderRadius: 8,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: colors.PrimaryColor,
                  color: '#fff',
                  fontSize: 24,
                  fontFamily: Font.font500,
                  borderRadius: 8,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
          containerStyle={styles.cardContainer}
          cardStyle={styles.cardStyle}
        >
          {renderNoMoreCards()}
        </Swiper>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SecondaryColor,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: Font.font500,
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: Font.font400,
    color: '#666',
    marginTop: 4,
  },
  swiperContainer: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
  },
  cardStyle: {
    top: 0,
    left: 0,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: '50%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.PrimaryColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  typeText: {
    fontSize: 12,
    fontFamily: Font.font500,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  propertyTitle: {
    fontSize: 24,
    fontFamily: Font.font500,
    color: '#000',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: Font.font400,
    color: '#666',
  },
  priceText: {
    fontSize: 28,
    fontFamily: Font.font500,
    color: colors.PrimaryColor,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Font.font500,
    color: '#000',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingBottom: 30,
    gap: 20,
  },
  actionButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  likeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.PrimaryColor,
  },
  progressContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  progressText: {
    fontSize: 14,
    fontFamily: Font.font500,
    color: '#999',
  },
  noMoreCards: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
  },
  noMoreCardsText: {
    fontSize: 24,
    fontFamily: Font.font500,
    color: '#000',
    marginTop: 20,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    fontFamily: Font.font400,
    color: '#666',
    marginTop: 8,
  },
});
