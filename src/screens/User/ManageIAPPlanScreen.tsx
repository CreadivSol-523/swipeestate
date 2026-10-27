import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Font from '../../assests/fonts/Font';
import colors from '../../assests/Colors/Colors';
import ResToast from '../../components/ResToast/ResToast';
import Spinner from '../../components/Loader/Spinner';
import { useGetSubscribedPlanHandler } from '../../models/Plan/Plan';

// Apple ki subscriptions settings: cancel / manage yahin se hota hai
const APPLE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';
const PRIVACY_POLICY_URL = 'https://swipestate-adminpanel.vercel.app/privacy-policy';
const TERMS_OF_USE_URL = 'https://swipestate-adminpanel.vercel.app/terms-of-use';

// Navigator me jo naam register hai wahi yahan likho
const IAP_PLANS_ROUTE = 'SelectIAPPlanScreen';

const formatDate = (date: Date | null) => (date ? date.toISOString().split('T')[0] : 'N/A');

const toValidDate = (value: any): Date | null => {
     if (!value) return null;
     const parsed = new Date(value);
     return isNaN(parsed.getTime()) ? null : parsed;
};

// Free / Stripe subscription me end date save nahi hoti, to start date + interval (month / year) se nikalte hain
const addInterval = (start: Date, interval?: string) => {
     const end = new Date(start);
     if (interval === 'year') {
          end.setFullYear(end.getFullYear() + 1);
     } else {
          end.setMonth(end.getMonth() + 1);
     }
     return end;
};

const ManageIAPSubs = () => {
     const navigation = useNavigation();

     // Current subscription data (same hook jo Stripe wali screen use karti hai)
     const { GetSubscribedPlanData, GetSubscribedPlanLoading, isFetching, refetch } = useGetSubscribedPlanHandler();
     const SubsDetail = GetSubscribedPlanData as any;
     const subscription = SubsDetail?.plan;
     const planDetail = SubsDetail?.planDetail;

     // Plans screen se purchase karke wapas aane par data fresh ho jaye
     const refetchRef = useRef(refetch);
     refetchRef.current = refetch;
     useFocusEffect(
          useCallback(() => {
               try {
                    refetchRef.current();
               } catch (error) {
                    console.log('Subscription refetch failed', error);
               }
          }, []),
     );

     const hasPlan = !!planDetail;
     const isApple = subscription?.paymentProvider === 'apple';
     const isPaid = Number(planDetail?.amount) > 0;

     // Apple subscription ki asli expiry backend me currentPeriodEnd / endDate me save hoti hai.
     // Free plan me ye fields nahi hote, to startDate + plan interval se nikalte hain (purani screen ki tarah)
     const storedEnd = toValidDate(subscription?.currentPeriodEnd) || toValidDate(subscription?.endDate);
     const startDate = toValidDate(subscription?.startDate);
     const periodEnd = storedEnd || (startDate ? addInterval(startDate, planDetail?.interval) : null);

     // Free plan ko "expired" mark nahi karte, sirf Apple / paid plan ko
     const isExpired = !!periodEnd && periodEnd.getTime() <= Date.now() && (isApple || isPaid);
     const daysRemaining = periodEnd ? Math.max(0, Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

     const rawStatus: string = subscription?.status || 'inactive';
     const displayStatus = isExpired ? 'expired' : rawStatus;
     const isActive = displayStatus === 'active';

     // Stripe se kharidi hui active paid subscription ke upar IAP na kharide (double billing se bachne ke liye)
     const boughtOutsideAppStore = hasPlan && !isApple && isActive && isPaid;
     const canChangePlan = !boughtOutsideAppStore;

     const priceText = !hasPlan ? '--' : isPaid ? `$${planDetail?.amount}${planDetail?.interval ? `/${planDetail?.interval}` : ''}` : 'Free';

     const openLink = async (url: string) => {
          try {
               await Linking.openURL(url);
          } catch (error) {
               ResToast({ title: 'Could not open the link. Please try again.', type: 'danger' });
          }
     };

     const goToPlans = () => {
          navigation.navigate(IAP_PLANS_ROUTE as never);
     };

     return (
          <>
               <Spinner visible={GetSubscribedPlanLoading} color={colors.textBlue} />
               <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={!GetSubscribedPlanLoading && isFetching} onRefresh={() => refetch()} />}>
                    <View style={styles.header}>
                         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                              <Icon name="chevron-back" size={22} color="#000" />
                         </TouchableOpacity>
                         <Text style={styles.headerTitle}>Subscription</Text>
                         <View style={styles.headerSpacer} />
                    </View>
                    <Text style={styles.headerSubtitle}>Manage your subscription plan</Text>

                    <View style={[styles.currentPlanCard, { borderColor: '#9CA3AF' }]}>
                         <View style={styles.currentPlanHeader}>
                              <View style={styles.currentPlanTitleWrap}>
                                   <Text style={styles.currentPlanLabel}>Current Plan</Text>
                                   <Text style={styles.currentPlanName}>{hasPlan ? planDetail?.title : 'No active plan'}</Text>
                              </View>
                              {hasPlan && (
                                   <View style={[styles.planBadge, { backgroundColor: isActive ? '#22C55E' : '#9CA3AF' }]}>
                                        <Text style={styles.planBadgeText}>{displayStatus}</Text>
                                   </View>
                              )}
                         </View>

                         <View style={styles.usageSection}>
                              <View style={styles.usageItem}>
                                   <Icon name="cash-outline" size={24} color={colors.PrimaryColor} />
                                   <View style={styles.usageInfo}>
                                        <Text style={styles.usageLabel}>Price</Text>
                                        <Text style={styles.usageValue}>{priceText}</Text>
                                   </View>
                              </View>

                              <View style={styles.usageDivider} />

                              <View style={styles.usageItem}>
                                   <Icon name="calendar-outline" size={24} color={colors.PrimaryColor} />
                                   <View style={styles.usageInfo}>
                                        <Text style={styles.usageLabel}>Days Remaining</Text>
                                        <Text style={styles.usageValue}>{hasPlan && periodEnd ? `${daysRemaining} days` : '--'}</Text>
                                   </View>
                              </View>
                         </View>

                         {hasPlan && periodEnd && (
                              <View style={styles.renewalInfo}>
                                   <Icon name="sync" size={18} color="#10B981" />
                                   <Text style={styles.renewalText}>{isExpired ? `Expired on ${formatDate(periodEnd)}` : `Current period ends on ${formatDate(periodEnd)}`}</Text>
                              </View>
                         )}
                    </View>

                    {boughtOutsideAppStore && (
                         <View style={styles.noticeSection}>
                              <View style={styles.noticeCard}>
                                   <Icon name="alert-circle-outline" size={22} color="#B45309" />
                                   <Text style={styles.noticeText}>
                                        This subscription was not purchased through the App Store, so it cannot be changed or cancelled here. Please manage it where you originally subscribed.
                                   </Text>
                              </View>
                         </View>
                    )}

                    <View style={styles.actionsSection}>
                         {canChangePlan && (
                              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.PrimaryColor }]} onPress={goToPlans} activeOpacity={0.85}>
                                   <Text style={styles.primaryButtonText}>{hasPlan && !isPaid ? 'Upgrade Plan' : hasPlan && isPaid && isActive ? 'Change Plan' : 'Choose a Plan'}</Text>
                                   <Icon name="arrow-forward" size={20} color="#fff" />
                              </TouchableOpacity>
                         )}

                         {isApple && (
                              <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.PrimaryColor }]} onPress={() => openLink(APPLE_SUBSCRIPTIONS_URL)} activeOpacity={0.85}>
                                   <Icon name="logo-apple" size={20} color={colors.PrimaryColor} />
                                   <Text style={[styles.secondaryButtonText, { color: colors.PrimaryColor }]}>Manage on App Store</Text>
                              </TouchableOpacity>
                         )}
                    </View>

                    <View style={styles.infoSection}>
                         <View style={styles.infoCard}>
                              <Icon name="information-circle-outline" size={24} color={colors.PrimaryColor} />
                              <View style={styles.infoContent}>
                                   <Text style={styles.infoTitle}>About your subscription</Text>
                                   <Text style={styles.infoText}>
                                        • Payment is charged to your Apple ID account{'\n'}• Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period
                                        {'\n'}• You can manage or cancel anytime in your App Store account settings{'\n'}• Plan changes are handled by Apple. Upgrades usually start right away,
                                        downgrades usually start at your next renewal
                                   </Text>
                              </View>
                         </View>

                         <View style={styles.legalLinksRow}>
                              <TouchableOpacity onPress={() => openLink(TERMS_OF_USE_URL)} activeOpacity={0.7}>
                                   <Text style={styles.legalLink}>Terms of Use</Text>
                              </TouchableOpacity>
                              <Text style={styles.legalSeparator}>|</Text>
                              <TouchableOpacity onPress={() => openLink(PRIVACY_POLICY_URL)} activeOpacity={0.7}>
                                   <Text style={styles.legalLink}>Privacy Policy</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </ScrollView>
          </>
     );
};

export default ManageIAPSubs;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          backgroundColor: '#fff',
     },
     backButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
     },
     headerTitle: {
          fontSize: 20,
          fontFamily: Font.font500,
          color: '#000',
     },
     headerSpacer: {
          width: 40,
     },
     headerSubtitle: {
          fontSize: 15,
          fontFamily: Font.font400,
          color: '#666',
          paddingHorizontal: 16,
          paddingBottom: 16,
          backgroundColor: '#fff',
     },
     currentPlanCard: {
          backgroundColor: '#fff',
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 20,
          padding: 20,
          borderWidth: 2,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
     },
     currentPlanHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
     },
     currentPlanTitleWrap: {
          flex: 1,
          paddingRight: 12,
     },
     currentPlanLabel: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
          marginBottom: 4,
     },
     currentPlanName: {
          fontSize: 28,
          fontFamily: Font.font500,
          color: '#000',
     },
     planBadge: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
     },
     planBadgeText: {
          fontSize: 12,
          fontFamily: Font.font500,
          color: '#fff',
          textTransform: 'capitalize',
     },
     usageSection: {
          flexDirection: 'row',
          backgroundColor: '#F8F9FA',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
     },
     usageItem: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
     },
     usageDivider: {
          width: 1,
          backgroundColor: '#E0E0E0',
          marginHorizontal: 12,
     },
     usageInfo: {
          flex: 1,
     },
     usageLabel: {
          fontSize: 12,
          fontFamily: Font.font400,
          color: '#666',
          marginBottom: 4,
     },
     usageValue: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#000',
     },
     renewalInfo: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
     },
     renewalText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#666',
          flex: 1,
     },
     noticeSection: {
          paddingHorizontal: 16,
          paddingTop: 16,
     },
     noticeCard: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          backgroundColor: '#FFFBEB',
          padding: 14,
          borderRadius: 14,
          gap: 10,
     },
     noticeText: {
          flex: 1,
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#92400E',
          lineHeight: 19,
     },
     actionsSection: {
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 16,
     },
     primaryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          borderRadius: 16,
          marginBottom: 12,
          gap: 8,
     },
     primaryButtonText: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#fff',
     },
     secondaryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 15,
          borderRadius: 16,
          borderWidth: 1.5,
          backgroundColor: '#fff',
          gap: 8,
     },
     secondaryButtonText: {
          fontSize: 16,
          fontFamily: Font.font500,
     },
     infoSection: {
          paddingHorizontal: 16,
          paddingBottom: 32,
     },
     infoCard: {
          flexDirection: 'row',
          backgroundColor: '#F0F7FF',
          padding: 16,
          borderRadius: 16,
          gap: 12,
     },
     infoContent: {
          flex: 1,
     },
     infoTitle: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
          marginBottom: 8,
     },
     infoText: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#666',
          lineHeight: 20,
     },
     legalLinksRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 16,
          gap: 10,
     },
     legalLink: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: colors.PrimaryColor,
          textDecorationLine: 'underline',
     },
     legalSeparator: {
          fontSize: 13,
          color: '#9CA3AF',
     },
});
