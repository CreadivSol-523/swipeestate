import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { useGetMatchesHandler } from '../../models/Matches/Matches';
import API_BASE_URL from '../../utils/Config';
import colors from '../../assests/Colors/Colors';
import PropertyCardSkeleton from '../../components/Skeletons/PropertyCardSkeleton';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import Ismessage from '../../components/IsMessage/Ismessage';

interface Apartment {
     id: string;
     image: string;
     title: string;
     location: string;
     price: string;
     beds: string;
     baths: string;
     area: string;
     matchPercentage: string;
}

const MatchApartments = ({ navigation }: { navigation: Navigation }) => {
     const [favorites, setFavorites] = useState<number[]>([]);
     const [matches, setMatches] = useState<Apartment[] | undefined>([]);
     const [matchesDetail, setMatchesDetail] = useState<any>([]);
     const [page, setPage] = useState(1);
     const [loader, setLoader] = useState(false);
     const [filter, setFilter] = useState<'Requested' | 'Matched' | 'Rejected' | ''>('');

     const { GetMatches, GetMatchesData, GetMatchesLoading, refetch, isFetching, isError } = useGetMatchesHandler({ page, search: filter });

     const handleIncreasePage = () => {
          if (GetMatchesData?.meta?.totalPages === page) return;
          if (GetMatches?.data?.matches?.length == 0 || GetMatchesLoading) return;
          setPage(prev => prev + 1);
     };

     const structuredMatches = (): Apartment[] | undefined => {
          if (!GetMatches?.data?.matches?.length) return;

          const MatchesList: Apartment[] = (GetMatches.data.matches || []).map(item => ({
               id: item?._id ?? '',
               image: item?.property?.image ? API_BASE_URL + '/' + item.property.image : '',
               title: item?.property?.title ?? '',
               location: item?.property?.location ?? '',
               price: item?.property?.price?.toString() ?? '',
               beds: item?.property?.bedrooms?.toString() ?? '',
               baths: item?.property?.bathrooms?.toString() ?? '',
               area: item?.property?.area?.toString() ?? '',
               matchPercentage: item?.status ?? 'Requested',
          }));

          return MatchesList;
     };

     useEffect(() => {
          // if (filter) {
          //      setMatches([]);
          //      setMatchesDetail([]);
          // }
          if (GetMatches?.data?.matches?.length == 0 || GetMatchesLoading) return;

          const newMatches = structuredMatches();
          const newMatchesDetails = GetMatchesData?.matches;

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
     }, [GetMatches, isFetching]);

     const toggleFavorite = (id: number): void => {
          setFavorites(prev => (prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]));
     };

     const handleNavigate = (id: string) => {
          const filterApartment = matchesDetail?.find((item: any) => item?._id === id);
          navigation.navigate('MatchDetail', { filterApartment });
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
                              <Text style={styles.matchText}>{apartment.matchPercentage}</Text>
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
                                   <Text style={styles.priceLabel}></Text>
                              </View>
                              <TouchableOpacity
                                   style={styles.viewButton}
                                   onPress={
                                        // () => navigation.navigate('MatchDetail', { item })
                                        () => handleNavigate(apartment?.id)
                                   }
                              >
                                   <Text style={styles.viewButtonText}>View</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </View>
          );
     };

     const onRefresh = () => {
          setLoader(true);
          setPage(1);
          setMatches([]);
          setFilter('');
          refetch().finally(() => setLoader(false));
     };

     return (
          <>
               {/* Header */}
               <View style={styles.header}>
                    <View>
                         <Text style={styles.headerTitle}>Your Matches</Text>
                         <Text style={styles.headerSubtitle}>{matches?.length} apartments found</Text>
                    </View>
                    <View style={{ width: 150, top: 0, zIndex: 10000 }}>
                         <CustomDropdown
                              placeholder="Filter"
                              options={[
                                   { label: 'Requested', value: 'Requested' },
                                   { label: 'Matched', value: 'Matched' },
                                   { label: 'Rejected', value: 'Rejected' },
                              ]}
                              value={filter}
                              onValueChange={(value, label) => {
                                   setFilter(value as '' | 'Requested' | 'Matched' | 'Rejected');
                                   setMatches([]);
                                   setMatchesDetail([]);
                                   // handleData('acountType', value);
                              }}
                              iconName="info"
                              iconSize={18}
                              iconColor="#9CA3AF"
                              maxHeight={100}
                              height={100}
                         />
                    </View>
               </View>

               {/* Apartment Cards */}
               <View style={styles.cardsContainer}>
                    {matches?.length === 0 ? (
                         <Ismessage text="No matches available" />
                    ) : (
                         <FlatList
                              data={matches}
                              renderItem={item => renderItem(item)}
                              contentContainerStyle={{ paddingBottom: 100, gap: 20 }}
                              showsVerticalScrollIndicator={false}
                              onEndReached={handleIncreasePage}
                              onEndReachedThreshold={0.5}
                              refreshControl={<RefreshControl onRefresh={onRefresh} colors={[colors.PrimaryColor]} refreshing={loader} />}
                              ListFooterComponent={
                                   !isError && (isFetching || GetMatchesLoading) ? (
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 16,
     },
     headerTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
          paddingTop: 30,
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
          position: 'relative',
          zIndex: 100,
     },
     card: {
          backgroundColor: '#fff',
          borderRadius: 12,
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

export default MatchApartments;
