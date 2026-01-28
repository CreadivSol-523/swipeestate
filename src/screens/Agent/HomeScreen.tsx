import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import { windowHeight, windowWidth } from '../../utils/Dimension/Dimension';
import ResToast from '../../components/ResToast/ResToast';
import LimitReachedModal from '../../components/LimitReachModal/LimitReachModal';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import SwipeDeck from '../../components/SwipeCards/SwipeDeck';
import { useGetBuyersHandler } from '../../models/Matches/Matches';
import API_BASE_URL from '../../utils/Config';
import { useAuth } from '../../utils/Storage/Storage';

type FilterKey = 'income' | 'creditScore' | 'location' | 'age' | 'verified';

const UserSwipeScreen = ({ navigation }: { navigation: Navigation }) => {
     const [modalVisible, setModalVisible] = useState(false);
     const [modalFeature, setModalFeature] = useState<'featured' | 'listings' | 'swipes' | 'analytics'>('featured');
     const [Buyers, setBuyers] = useState<any>([]);

     const renderCard = (user: any) => {
          if (!user) return null;

          return (
               <View style={styles.card}>
                    {/* Profile Image Section */}
                    <View style={styles.imageSection}>
                         {user.avatar ? (
                              <Image source={{ uri: user.avatar }} style={styles.profileImage} />
                         ) : (
                              <View style={styles.imagePlaceholder}>
                                   <Icon name="person" size={120} color="#E0E0E0" />
                              </View>
                         )}

                         {/* Verified Badge */}
                         {user.verified && (
                              <View style={styles.verifiedBadge}>
                                   <Icon name="checkmark-circle" size={16} color="#fff" />
                                   <Text style={styles.verifiedText}>Verified</Text>
                              </View>
                         )}
                         {/* Gradient Overlay */}
                         <View style={styles.gradientOverlay} />
                         {/* Name & Age Overlay */}
                         <View style={styles.nameOverlay}>
                              <Text style={styles.userName}>
                                   {user.name}, {user.age}
                              </Text>
                              <View style={styles.locationRow}>
                                   <Icon name="location" size={16} color="#fff" />
                                   <Text style={styles.locationText}>{user.location}</Text>
                              </View>
                         </View>
                    </View>

                    {/* Content Section */}
                    <View style={[styles.cardContent, { justifyContent: 'space-between' }]}>
                         {/* Details Grid */}
                         <View style={styles.detailsGrid}>
                              <View style={styles.detailBox}>
                                   <Icon name="cash-outline" size={24} color={colors.PrimaryColor} />
                                   <Text style={styles.detailLabel}>Income</Text>
                                   <Text style={styles.detailValue}>{user.income}</Text>
                              </View>

                              <View style={styles.detailDivider} />

                              <View style={styles.detailBox}>
                                   <Icon name="shield-checkmark-outline" size={24} color={colors.PrimaryColor} />
                                   <Text style={styles.detailLabel}>Credit Score</Text>
                                   <Text style={styles.detailValue}>{user.creditScore}</Text>
                              </View>
                         </View>

                         {/* View Profile Button */}
                         <TouchableOpacity
                              style={styles.viewProfileButton}
                              onPress={() => {
                                   setModalVisible(true), setModalFeature('featured');
                              }}
                         >
                              <Text style={styles.viewProfileText}>View Full Profile</Text>
                              <Icon name="arrow-forward" size={16} color={colors.PrimaryColor} />
                         </TouchableOpacity>
                    </View>
               </View>
          );
     };

     const { userData } = useAuth();

     const isLastCard = Buyers.length === 1;

     const { GetBuyers, GetBuyersData, GetBuyersLoading } = useGetBuyersHandler({});

     const structuredApartment = () => {
          if (GetBuyersData?.users.length == 0) return;
          const ApartmentData = GetBuyersData?.users?.map((item, i) => ({
               id: item?._id,
               name: item?.name,
               age: 28,
               location: item?.address,
               verified: true,
               income: '$85,000/year',
               creditScore: '750',
               occupation: 'Software Engineer',
               avatar: API_BASE_URL + '/' + item?.profilePicture,
          }));
          return ApartmentData;
     };

     useEffect(() => {
          if (GetBuyersLoading || !GetBuyersData?.users?.length) return;

          const newBuyers = structuredApartment();

          setBuyers((prev: any) => {
               const map = new Map();

               // add old ones
               prev.forEach((item: any) => {
                    map.set(item.id, item);
               });

               // add new ones (duplicates auto-overwritten)
               newBuyers?.forEach(item => {
                    map.set(item.id, item);
               });

               return Array.from(map.values());
          });
     }, [GetBuyers]);

     const handleSwipeLeft = (index: number) => {
          console.log('Rejected:', Buyers[index].name);
          if (isLastCard) {
               return setModalVisible(true);
          }
     };

     const handleSwipeRight = (index: number) => {
          if (isLastCard) {
               return setModalVisible(true);
          }
          console.log('Accepted:', Buyers[index].name);
     };

     useEffect(() => {
          if (Buyers?.length === 1) {
               return setModalVisible(true);
          }
     }, [Buyers]);

     return (
          <>
               <View style={styles.container}>
                    {/* Swiper Container */}
                    <View style={styles.swiperContainer}>
                         <SwipeDeck
                              data={Buyers}
                              renderCard={renderCard}
                              disableLeftSwipe={Buyers?.length === 1}
                              disableRightSwipe={Buyers?.length === 1}
                              onSwipeLeft={(item, index) => {
                                   setBuyers((prev: any) => prev.slice(1));
                                   handleSwipeLeft(index);
                              }}
                              onSwipeRight={(item, index) => {
                                   handleSwipeRight(index);
                                   setBuyers((prev: any) => prev.slice(1));
                              }}
                         />
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

export default UserSwipeScreen;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
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
          height: windowHeight - 200,
     },
     imageSection: {
          height: '65%',
          position: 'relative',
     },
     profileImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
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
          height: '40%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderTopEndRadius: 40,
          borderTopStartRadius: 40,
     },
     verifiedBadge: {
          position: 'absolute',
          top: 16,
          right: 16,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          gap: 6,
     },
     verifiedText: {
          fontSize: 12,
          fontFamily: Font.font500,
          color: '#fff',
     },
     nameOverlay: {
          position: 'absolute',
          bottom: 16,
          left: 20,
          right: 20,
     },
     userName: {
          fontSize: 28,
          fontFamily: Font.font500,
          color: '#fff',
          marginBottom: 4,
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
     },
     locationText: {
          fontSize: 16,
          fontFamily: Font.font400,
          color: '#fff',
     },
     cardContent: {
          flex: 1,
          padding: 20,
     },
     infoRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
     },
     infoLabel: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
     },
     infoValue: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: '#000',
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
          gap: 8,
     },
     detailDivider: {
          width: 1,
          height: 60,
          backgroundColor: '#E0E0E0',
     },
     detailLabel: {
          fontSize: 12,
          fontFamily: Font.font400,
          color: '#999',
          textAlign: 'center',
     },
     detailValue: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#000',
          textAlign: 'center',
     },
     viewProfileButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F0F7FF',
          paddingVertical: 14,
          borderRadius: 16,
          gap: 8,
     },
     viewProfileText: {
          fontSize: 16,
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
     rejectButton: {
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
     acceptButton: {
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
