import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import { windowHeight, windowWidth } from '../../utils/Dimension/Dimension';

const SAMPLE_USERS = [
     {
          id: 1,
          name: 'Sarah Johnson',
          age: 28,
          location: 'Downtown, New York',
          verified: true,
          income: '$85,000/year',
          creditScore: '750',
          occupation: 'Software Engineer',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
     },
     {
          id: 2,
          name: 'Michael Chen',
          age: 32,
          location: 'Brooklyn, New York',
          verified: true,
          income: '$95,000/year',
          creditScore: '780',
          occupation: 'Marketing Manager',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
     },
     {
          id: 3,
          name: 'Emily Rodriguez',
          age: 26,
          location: 'Queens, New York',
          verified: false,
          income: '$65,000/year',
          creditScore: '680',
          occupation: 'Graphic Designer',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
     },
     {
          id: 4,
          name: 'David Kim',
          age: 35,
          location: 'Manhattan, New York',
          verified: true,
          income: '$120,000/year',
          creditScore: '820',
          occupation: 'Senior Consultant',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
     },
     {
          id: 5,
          name: 'Jessica Williams',
          age: 29,
          location: 'Bronx, New York',
          verified: true,
          income: '$75,000/year',
          creditScore: '710',
          occupation: 'Teacher',
          avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
     },
];

type FilterKey = 'income' | 'creditScore' | 'location' | 'age' | 'verified';

const UserSwipeScreen = () => {
     const swiperRef = useRef<Swiper<any>>(null);
     const [currentIndex, setCurrentIndex] = useState(0);
     const [acceptedUsers, setAcceptedUsers] = useState<number[]>([]);
     const [selectedFilter, setSelectedFilter] = useState<FilterKey | string | undefined>(undefined);
     const [selectedValue, setSelectedValue] = useState<string | undefined | null>(undefined);

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
                         <TouchableOpacity style={styles.viewProfileButton}>
                              <Text style={styles.viewProfileText}>View Full Profile</Text>
                              <Icon name="arrow-forward" size={16} color={colors.PrimaryColor} />
                         </TouchableOpacity>
                    </View>
               </View>
          );
     };

     const FILTER_CONFIG: Record<FilterKey, { label: string; value: string }[]> = {
          income: [
               { label: 'Under $50k', value: 'under_50' },
               { label: '$50k – $75k', value: '50_75' },
               { label: '$75k – $100k', value: '75_100' },
               { label: '$100k+', value: '100_plus' },
          ],
          creditScore: [
               { label: '650+', value: '650' },
               { label: '700+', value: '700' },
               { label: '750+', value: '750' },
               { label: '800+', value: '800' },
          ],
          location: [
               { label: 'Downtown', value: 'downtown' },
               { label: 'Brooklyn', value: 'brooklyn' },
               { label: 'Queens', value: 'queens' },
               { label: 'Manhattan', value: 'manhattan' },
          ],
          age: [
               { label: '18-25', value: '18_25' },
               { label: '26-30', value: '26_30' },
               { label: '31-35', value: '31_35' },
               { label: '36+', value: '36_plus' },
          ],
          verified: [
               { label: 'Verified Only', value: 'true' },
               { label: 'All Users', value: 'false' },
          ],
     };

     const renderNoMoreCards = () => {
          return (
               <View style={styles.noMoreCards}>
                    <View style={styles.noMoreCardsIcon}>
                         <Icon name="checkmark-circle" size={80} color={colors.PrimaryColor} />
                    </View>
                    <Text style={styles.noMoreCardsText}>All Caught Up!</Text>
                    <Text style={styles.noMoreCardsSubtext}>You've reviewed all available applicants</Text>
                    <TouchableOpacity style={styles.refreshButton}>
                         <Icon name="refresh" size={20} color="#fff" />
                         <Text style={styles.refreshButtonText}>Load More</Text>
                    </TouchableOpacity>
               </View>
          );
     };

     const handleSwipeLeft = (index: number) => {
          console.log('Rejected:', SAMPLE_USERS[index].name);
          if (index === SAMPLE_USERS.length - 1) {
               setCurrentIndex(SAMPLE_USERS.length);
          }
     };

     const handleSwipeRight = (index: number) => {
          console.log('Accepted:', SAMPLE_USERS[index].name);
          setAcceptedUsers([...acceptedUsers, SAMPLE_USERS[index].id]);
          if (index === SAMPLE_USERS.length - 1) {
               setCurrentIndex(SAMPLE_USERS.length);
          }
     };

     const isLastCard = currentIndex === SAMPLE_USERS.length - 1;

     const handleAcceptPress = () => {
          if (isLastCard) return;
          swiperRef.current?.swipeRight();
     };

     const handleRejectPress = () => {
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
               {/* Filter Section */}
               <View style={{ paddingBottom: 100 }}>
                    <View style={{ paddingInline: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between', position: 'absolute' }}>
                         <CustomDropdown
                              placeholder="Filter By"
                              options={[
                                   { label: 'Income', value: 'income' },
                                   { label: 'Credit Score', value: 'creditScore' },
                                   { label: 'Location', value: 'location' },
                                   { label: 'Age', value: 'age' },
                                   { label: 'Verification', value: 'verified' },
                              ]}
                              value={selectedFilter}
                              onValueChange={value => {
                                   setSelectedFilter(value);
                                   setSelectedValue(null);
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
                         cards={SAMPLE_USERS}
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
                                   title: 'REJECT',
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
                                   title: 'ACCEPT',
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
                    <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={handleRejectPress}>
                         <Icon name="close" size={32} color="#FF3B30" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.undoButton]} onPress={handleUndoPress}>
                         <Icon name="arrow-undo" size={24} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={handleAcceptPress}>
                         <Icon name="checkmark" size={36} color={colors.PrimaryColor} />
                    </TouchableOpacity>
               </View>
          </View>
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
          height: windowHeight - 400,
     },
     imageSection: {
          height: '50%',
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
