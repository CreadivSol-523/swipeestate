import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { useGetApartmentListingHandler } from '../../models/Apartments/Apartments';
import { GetApartmentType } from '../../redux/Apartments/ApartmentType';
import API_BASE_URL from '../../utils/Config';
import { RefreshControl } from 'react-native';
import colors from '../../assests/Colors/Colors';
import PropertyCardSkeleton from '../../components/Skeletons/PropertyCardSkeleton';
import Ismessage from '../../components/IsMessage/Ismessage';

interface Apartment {
     id: string;
     image: string;
     title: string;
     location: string;
     price: number;
     beds: number;
     baths: number;
     area: number;
     availability: 'Available' | 'Sold' | 'Rented';
}

const ApartmentsScreen = ({ navigation }: { navigation: Navigation }) => {
     const [favorites, setFavorites] = useState<number[]>([]);
     const [matches, setMatches] = useState<Apartment[] | undefined>([]);
     const [page, setPage] = useState(1);
     const [loader, setLoader] = useState(false);
     const [matchesDetail, setMatchesDetail] = useState<any>([]);

     const { GetApartments, GetApartmentData, isError, isFetching, isLoading, refetch } = useGetApartmentListingHandler({ page });

     const onRefresh = () => {
          setLoader(true);
          setPage(1);
          setMatches([]);
          setMatchesDetail([]);
          refetch().finally(() => setLoader(false));
     };

     const handleIncreasePage = () => {
          if (GetApartments?.data?.meta?.totalPages === page) return;
          if (GetApartmentData?.length == 0 || isLoading) return;
          setPage(prev => prev + 1);
     };

     const toggleFavorite = (id: number): void => {
          setFavorites(prev => (prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]));
     };

     const handleNavigate = (id: string) => {
          const filterApartment = matchesDetail?.find((item: any) => item?._id === id);
          navigation.navigate('SingleAprtment', { filterApartment });
          // console.log(filterApartment);
     };

     const renderItem = (item: any) => {
          const apartment = item?.item;

          return (
               <View key={apartment.id} style={styles.card}>
                    {/* Image Container */}
                    <View style={styles.imageContainer}>
                         <Image source={{ uri: apartment.image }} style={styles.apartmentImage} />
                         {/* Match Badge */}
                         <View style={styles.matchBadge}>
                              <Text style={styles.matchText}>{apartment.availability}</Text>
                         </View>
                         {/* Favorite Button */}
                         <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(apartment.id)}>
                              {favorites.includes(apartment.id) ? <MaterialIcon name="favorite" size={20} color="#FF5252" /> : <MaterialIcon name="favorite-border" size={20} color="#999" />}
                         </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.cardContent}>
                         <Text style={styles.apartmentTitle}>{apartment.title}</Text>

                         <View style={styles.locationContainer}>
                              <Icon name="map-pin" size={14} color="#00BCD4" />
                              <Text style={styles.locationText}>{apartment.location}</Text>
                         </View>

                         {/* Features */}
                         <View style={styles.featuresContainer}>
                              <View style={styles.feature}>
                                   <Icon name="home" size={16} color="#00BCD4" />
                                   <Text style={styles.featureText}>{apartment.beds}</Text>
                              </View>
                              <View style={styles.feature}>
                                   <Icon name="droplet" size={16} color="#00BCD4" />
                                   <Text style={styles.featureText}>{apartment.baths}</Text>
                              </View>
                              <View style={styles.feature}>
                                   <Icon name="maximize" size={16} color="#00BCD4" />
                                   <Text style={styles.featureText}>{apartment.area} sq ft</Text>
                              </View>
                         </View>

                         {/* Price & Button */}
                         <View style={styles.footer}>
                              <View style={styles.priceContainer}>
                                   <Icon name="dollar-sign" size={18} color="#00BCD4" />
                                   <Text style={styles.price}>{apartment.price}</Text>
                                   <Text style={styles.priceLabel}>/month</Text>
                              </View>
                              <TouchableOpacity style={styles.viewButton} onPress={() => handleNavigate(apartment?.id)}>
                                   <Text style={styles.viewButtonText}>View</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </View>
          );
     };

     const structuredMatches = (): Apartment[] | undefined => {
          if (!GetApartmentData?.length) return;

          const MatchesList: Apartment[] = (GetApartmentData || []).map(item => ({
               id: item?._id,
               image: API_BASE_URL + '/' + item?.image,
               title: item?.title,
               location: item?.location,
               price: item?.price,
               beds: item?.bedrooms,
               baths: item?.bathrooms,
               area: item?.area,
               availability: item?.availability,
          }));

          return MatchesList;
     };

     useEffect(() => {
          if (GetApartmentData?.length == 0 || isLoading) return;

          const newMatches = structuredMatches();
          const newMatchesDetails = GetApartmentData;

          setMatches((prev: any) => {
               const map = new Map();

               // add old ones
               prev.forEach((item: any) => {
                    map.set(item.id, item);
               });

               // add new ones (duplicates auto-overwritten)
               newMatches?.forEach(item => {
                    map.set(item.id, item);
               });

               return Array.from(map.values());
          });

          setMatchesDetail((prev: any) => {
               const map = new Map();

               // add old ones
               prev.forEach((item: any) => {
                    map.set(item._id, item);
               });

               // add new ones (duplicates auto-overwritten)
               newMatchesDetails?.forEach(item => {
                    map.set(item._id, item);
               });

               return Array.from(map.values());
          });
     }, [GetApartments]);

     return (
          <>
               {/* Header */}
               <View style={styles.header}>
                    <View>
                         <Text style={styles.headerTitle}>Your Listing</Text>
                         <Text style={styles.headerSubtitle}>{matches?.length} apartments found</Text>
                    </View>
                    <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate('ListingScreen')}>
                         <Text style={styles.viewButtonText}>Add</Text>
                    </TouchableOpacity>
               </View>

               {/* Apartment Cards */}
               <View style={styles.cardsContainer}>
                    {matches?.length === 0 && !isFetching && !isLoading ? (
                         <Ismessage text="No Listing available" />
                    ) : (
                         <FlatList
                              data={matches}
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={{ paddingBottom: 100 }}
                              renderItem={item => renderItem(item)}
                              keyExtractor={item => item?.id.toString()}
                              onEndReached={handleIncreasePage}
                              onEndReachedThreshold={0.5}
                              refreshControl={<RefreshControl onRefresh={onRefresh} colors={[colors.PrimaryColor]} refreshing={loader} />}
                              ListFooterComponent={
                                   !isError && (isFetching || isLoading) ? (
                                        <>
                                             {Array.from({ length: 5 }).map((_, i) => (
                                                  <PropertyCardSkeleton key={i + 1} />
                                             ))}
                                        </>
                                   ) : null
                              }
                         />
                    )}
               </View>
          </>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F5F5F5',
     },
     header: {
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
     },
     headerTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
     },
     headerSubtitle: {
          fontSize: 12,
          color: '#999',
          marginTop: 4,
     },
     filterButton: {
          padding: 8,
     },
     scrollView: {
          flex: 1,
     },
     cardsContainer: {
          padding: 16,
     },
     card: {
          backgroundColor: '#fff',
          borderRadius: 12,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          overflow: 'hidden',
     },
     imageContainer: {
          position: 'relative',
          height: 200,
     },
     apartmentImage: {
          width: '100%',
          height: '100%',
     },
     matchBadge: {
          position: 'absolute',
          top: 12,
          left: 12,
          backgroundColor: '#00BCD4',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
     },
     matchText: {
          color: '#fff',
          fontSize: 12,
          fontWeight: '600',
     },
     favoriteButton: {
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: '#fff',
          width: 36,
          height: 36,
          borderRadius: 18,
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
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 8,
     },
     locationContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
     },
     locationText: {
          fontSize: 14,
          color: '#666',
          marginLeft: 6,
     },
     featuresContainer: {
          flexDirection: 'row',
          gap: 16,
          marginBottom: 12,
     },
     feature: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
     },
     featureText: {
          fontSize: 14,
          color: '#666',
     },
     footer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
     },
     priceContainer: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     price: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
          marginLeft: 4,
     },
     priceLabel: {
          fontSize: 12,
          color: '#999',
          marginLeft: 4,
     },
     viewButton: {
          backgroundColor: '#00BCD4',
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderRadius: 8,
     },
     viewButtonText: {
          color: '#fff',
          fontSize: 14,
          fontWeight: '600',
     },
     bottomNav: {
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
     },
     navItem: {
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
     },
     navItemActive: {
          flex: 1,
          alignItems: 'center',
          paddingVertical: 8,
     },
     searchButton: {
          backgroundColor: '#00BCD4',
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -30,
          shadowColor: '#00BCD4',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
     },
     navText: {
          fontSize: 10,
          color: '#999',
          marginTop: 4,
     },
     navTextActive: {
          fontSize: 10,
          color: '#00BCD4',
          marginTop: 4,
     },
});

export default ApartmentsScreen;
