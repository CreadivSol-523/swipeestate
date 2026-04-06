import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import {
     useDownGradePlanHandler,
     useGetSubscriptionHandler,
     useUpgradePlanHandler,
} from '../../models/Subscription/Subscription';
import ResToast from '../../components/ResToast/ResToast';
import Spinner from '../../components/Loader/Spinner';
import { useGetPlanHandler } from '../../models/Plan/Plan';
import { useAuth } from '../../utils/Storage/Storage';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import { explainIapError, purchaseIosSubscription } from '../../utils/appleIap';
import { resolveAppleProductId } from '../../utils/applePlanProductIds';
import { Plans } from '../../redux/Plan/PlanTypes';

const SubscriptionManagment = ({ navigation }: { navigation: Navigation }) => {
     const [isLoading, setIsLoading] = useState(false);
     const [selectedPlan, setSelectedPlan] = useState<string>('');

     const { userData } = useAuth();

     const { GetSubscription, refetch } = useGetSubscriptionHandler();
     const subPayload = GetSubscription.data;

     const activePlanId =
          subPayload?.planId ??
          (userData?.subscribedPlan as { plan?: { _id?: string } } | undefined)?.plan?._id ??
          '';

     const subscriptionDoc = subPayload?.plan as
          | { currentPeriodEnd?: string; endDate?: string; updatedAt?: string }
          | undefined;

     const periodEndRaw = subscriptionDoc?.currentPeriodEnd ?? subscriptionDoc?.endDate;
     const periodEnd = periodEndRaw ? new Date(periodEndRaw) : null;
     const daysRemaining = periodEnd ? Math.max(0, Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

     const { handleUpgradePlanAPI, isLoading: upgradeLoading } = useUpgradePlanHandler();
     const { handleDownGradePlanAPI, isLoading: downgradeLoading } = useDownGradePlanHandler();

     const { PlanData, PlanLoading, isFetching } = useGetPlanHandler({ interval: 'month' });
     const plans = PlanData?.plans as Plans[] | undefined;

     const structuredPlan = useMemo(() => {
          return plans?.map((item, i) => ({
               id: item._id,
               name: item.title,
               price: item.amount,
               duration: item.interval,
               productId: resolveAppleProductId(item) ?? item.productId,
               listings: item.amount > 40 ? 'Unlimited' : 'Limited',
               color: item.amount > 40 ? '#FFD700' : item.amount === 0 ? '#9CA3AF' : colors.PrimaryColor,
               features: item.planPoints,
               recommended: i % 2 === 0,
          }));
     }, [plans]);

     const SUBSCRIPTION_PLANS = structuredPlan ?? [];
     const filterPlans = SUBSCRIPTION_PLANS.filter(p => p.id !== activePlanId);
     const currentPlanMeta = SUBSCRIPTION_PLANS.find(p => p.id === activePlanId);

     const runPaidUpgrade = async (plan: Plans) => {
          if (Platform.OS !== 'ios') {
               return ResToast({
                    title: 'Plan changes that charge Apple use the iOS app.',
                    type: 'warning',
               });
          }
          const appleSku = resolveAppleProductId(plan);
          if (!appleSku) {
               return ResToast({
                    title: `No App Store product id for “${plan.title}”. Add its title in APPLE_PRODUCT_ID_BY_PLAN_TITLE in applePlanProductIds.ts.`,
                    type: 'danger',
               });
          }

          setIsLoading(true);
          try {
               const { receipt } = await purchaseIosSubscription(appleSku);
               const ok = await handleUpgradePlanAPI(plan._id, receipt);
               if (ok) {
                    await refetch();
               }
          } catch (e) {
               console.error(e);
               ResToast({
                    title: explainIapError(e),
                    type: 'danger',
               });
          } finally {
               setIsLoading(false);
          }
     };

     const handleChangePlan = () => {
          if (!selectedPlan) {
               return ResToast({ title: 'Please select a plan', type: 'warning' });
          }
          if (selectedPlan === activePlanId) {
               return ResToast({ title: 'This is already your current plan', type: '' });
          }

          const selected = plans?.find(p => p._id === selectedPlan);
          const current = plans?.find(p => p._id === activePlanId);
          if (!selected || !current) {
               return ResToast({ title: 'Plan data unavailable. Pull to refresh.', type: 'danger' });
          }

          if (selected.amount > current.amount) {
               Alert.alert('Confirm upgrade', `Subscribe to ${selected.title} with Apple?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Continue', onPress: () => void runPaidUpgrade(selected) },
               ]);
               return;
          }

          if (selected.amount === 0 && current.amount > 0) {
               void (async () => {
                    const ok = await handleDownGradePlanAPI(selectedPlan);
                    if (ok) {
                         await refetch();
                    }
               })();
               return;
          }

          if (selected.amount < current.amount && selected.amount > 0) {
               return ResToast({
                    title: 'To move to a lower paid tier, change your subscription in Apple Settings.',
                    type: 'warning',
               });
          }

          ResToast({
               title: 'Use Apple subscription settings for other plan changes.',
               type: 'warning',
          });
     };

     const handleManageWithApple = async () => {
          const isIos = Platform.OS === 'ios';
          Alert.alert(
               'Manage subscription',
               isIos
                    ? 'Billing is through Apple. Open subscription settings to cancel or change renewal.'
                    : 'Open your store account to manage or cancel subscriptions.',
               [
                    { text: 'Not now', style: 'cancel' },
                    {
                         text: 'Open',
                         onPress: async () => {
                              if (Platform.OS === 'android') {
                                   await Linking.openURL('https://play.google.com/store/account/subscriptions');
                                   return;
                              }
                              try {
                                   const { deepLinkToSubscriptions } = await import('react-native-iap');
                                   await deepLinkToSubscriptions({
                                        sku: currentPlanMeta?.productId,
                                   });
                              } catch {
                                   await Linking.openURL('https://apps.apple.com/account/subscriptions');
                              }
                         },
                    },
               ],
          );
     };

     const busy = isLoading || upgradeLoading || downgradeLoading || PlanLoading || isFetching;

     return (
          <>
               <Spinner visible={busy} color={colors.textBlue} />
               <ScrollView style={styles.container}>
                    <View style={styles.header}>
                         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                              <Icon name="arrow-back" size={24} color="#000" />
                         </TouchableOpacity>
                         <Text style={styles.headerTitle}>Subscription</Text>
                         <View style={styles.placeholder} />
                    </View>

                    <View style={[styles.currentPlanCard, { borderColor: '#9CA3AF' }]}>
                         <View style={styles.currentPlanHeader}>
                              <View>
                                   <Text style={styles.currentPlanLabel}>Current Plan</Text>
                                   <Text style={styles.currentPlanName}>{currentPlanMeta?.name ?? '—'}</Text>
                              </View>
                              <View style={[styles.planBadge, { backgroundColor: '#9CA3AF' }]}>
                                   <Text style={styles.planBadgeText}>Active</Text>
                              </View>
                         </View>

                         <View style={styles.usageSection}>
                              <View style={styles.usageItem}>
                                   <Icon name="cash-outline" size={24} color={colors.PrimaryColor} />
                                   <View style={styles.usageInfo}>
                                        <Text style={styles.usageLabel}>Price</Text>
                                        <Text style={styles.usageValue}>
                                             {typeof currentPlanMeta?.price === 'number' && currentPlanMeta.price === 0
                                                  ? 'Free'
                                                  : `$${currentPlanMeta?.price ?? '—'}`}
                                        </Text>
                                   </View>
                              </View>

                              <View style={styles.usageDivider} />

                              <View style={styles.usageItem}>
                                   <Icon name="calendar-outline" size={24} color={colors.PrimaryColor} />
                                   <View style={styles.usageInfo}>
                                        <Text style={styles.usageLabel}>Renewal / period end</Text>
                                        <Text style={styles.usageValue}>
                                             {periodEnd
                                                  ? `${periodEnd.toLocaleDateString()} (${daysRemaining ?? 0} days)`
                                                  : currentPlanMeta?.price === 0
                                                    ? 'No renewal (free)'
                                                    : '—'}
                                        </Text>
                                   </View>
                              </View>
                         </View>

                         {subPayload?.canDowngrade === false ? null : (
                              <View style={styles.renewalInfo}>
                                   <Icon name="sync" size={18} color="#10B981" />
                                   <Text style={styles.renewalText}>
                                        {subscriptionDoc?.updatedAt
                                             ? `Updated ${String(subscriptionDoc.updatedAt).split('T')[0]}`
                                             : 'Subscription in sync with your account'}
                                   </Text>
                              </View>
                         )}
                    </View>

                    <View style={styles.plansSection}>
                         <Text style={styles.sectionTitle}>Available Plans</Text>
                         <Text style={styles.sectionSubtitle}>Choose the plan that fits your needs</Text>

                         {filterPlans?.map(plan => (
                              <TouchableOpacity
                                   disabled={plan.id === activePlanId}
                                   key={plan.id}
                                   style={[styles.planCard, selectedPlan === plan.id && styles.planCardSelected]}
                                   onPress={() => {
                                        setSelectedPlan(plan.id);
                                   }}
                              >
                                   {plan.id === activePlanId && (
                                        <View style={styles.recommendedBadge}>
                                             <Text style={styles.recommendedText}>Current</Text>
                                        </View>
                                   )}

                                   <View style={styles.planHeader}>
                                        <View style={styles.planInfo}>
                                             <Text style={styles.planName}>{plan.name}</Text>
                                             {plan.price === 0 ? (
                                                  <View style={styles.priceRow}>
                                                       <Text style={styles.planDuration}>Free</Text>
                                                  </View>
                                             ) : (
                                                  <View style={styles.priceRow}>
                                                       <Text style={styles.planPrice}>${plan.price}</Text>
                                                       <Text style={styles.planDuration}>/{plan.duration}</Text>
                                                  </View>
                                             )}
                                        </View>
                                        {plan.id !== activePlanId && (
                                             <View style={[styles.radioButton, selectedPlan === plan.id && styles.radioButtonSelected]}>
                                                  {selectedPlan === plan.id && (
                                                       <View style={[styles.radioButtonInner, { backgroundColor: colors.PrimaryColor }]} />
                                                  )}
                                             </View>
                                        )}
                                   </View>

                                   <View style={[styles.listingsTag, { backgroundColor: `${plan.color}15` }]}>
                                        <Icon name="document-text-outline" size={16} color={plan.color} />
                                        <Text style={[styles.listingsText, { color: plan.color }]}>
                                             {plan.listings === 'Unlimited' ? 'Unlimited' : `${plan.listings}`} Listings
                                        </Text>
                                   </View>

                                   <View style={styles.featuresContainer}>
                                        {plan.features.map((feature: string, index: number) => (
                                             <View key={index} style={styles.featureItem}>
                                                  <Icon name="checkmark-circle" size={18} color={plan.color} />
                                                  <Text style={styles.featureText}>{feature}</Text>
                                             </View>
                                        ))}
                                   </View>
                              </TouchableOpacity>
                         ))}
                    </View>

                    <View style={styles.actionsSection}>
                         <TouchableOpacity
                              style={[styles.upgradeButton, { backgroundColor: colors.PrimaryColor }]}
                              onPress={handleChangePlan}
                              disabled={downgradeLoading || upgradeLoading || isLoading}
                         >
                              {downgradeLoading || upgradeLoading ? (
                                   <ActivityIndicator color="#fff" />
                              ) : (
                                   <>
                                        <Text style={styles.upgradeButtonText}>
                                             {selectedPlan === activePlanId || !selectedPlan ? 'Select a plan' : 'Update subscription'}
                                        </Text>
                                        <Icon name="arrow-forward" size={20} color="#fff" />
                                   </>
                              )}
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.cancelButton} onPress={handleManageWithApple}>
                              <Text style={styles.cancelButtonText}>Manage in App Store / Apple Settings</Text>
                         </TouchableOpacity>
                    </View>

                    <View style={styles.infoSection}>
                         <View style={styles.infoCard}>
                              <Icon name="information-circle-outline" size={24} color={colors.PrimaryColor} />
                              <View style={styles.infoContent}>
                                   <Text style={styles.infoTitle}>Apple billing</Text>
                                   <Text style={styles.infoText}>
                                        Upgrades that increase price are completed with Apple In-App Purchase; we verify your receipt on the server. To downgrade
                                        to Free, pick the free plan here—Apple may still renew until you turn off auto-renew in Settings.
                                   </Text>
                              </View>
                         </View>
                    </View>
               </ScrollView>
          </>
     );
};

export default SubscriptionManagment;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 24,
          backgroundColor: '#fff',
     },
     headerTitle: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#000',
     },
     placeholder: {
          width: 40,
     },
     backButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          justifyContent: 'center',
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
     currentPlanLabel: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
          marginBottom: 4,
     },
     currentPlanName: {
          fontSize: 24,
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
          fontSize: 14,
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
     },
     plansSection: {
          padding: 16,
     },
     sectionTitle: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 4,
     },
     sectionSubtitle: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
          marginBottom: 20,
     },
     planCard: {
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          borderWidth: 2,
          borderColor: '#E0E0E0',
          position: 'relative',
     },
     planCardSelected: {
          borderColor: colors.PrimaryColor,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
     },
     recommendedBadge: {
          position: 'absolute',
          top: -10,
          right: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.PrimaryColor,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          gap: 4,
     },
     recommendedText: {
          fontSize: 11,
          fontFamily: Font.font500,
          color: '#fff',
     },
     planHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
     },
     planInfo: {
          flex: 1,
     },
     planName: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 4,
     },
     priceRow: {
          flexDirection: 'row',
          alignItems: 'baseline',
     },
     planPrice: {
          fontSize: 28,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
     planDuration: {
          fontSize: 16,
          fontFamily: Font.font400,
          color: '#666',
          marginLeft: 4,
     },
     radioButton: {
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#E0E0E0',
          alignItems: 'center',
          justifyContent: 'center',
     },
     radioButtonSelected: {
          borderColor: colors.PrimaryColor,
     },
     radioButtonInner: {
          width: 12,
          height: 12,
          borderRadius: 6,
     },
     listingsTag: {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          gap: 6,
          marginBottom: 16,
     },
     listingsText: {
          fontSize: 13,
          fontFamily: Font.font500,
     },
     featuresContainer: {
          gap: 12,
     },
     featureItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
     },
     featureText: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
          flex: 1,
     },
     actionsSection: {
          paddingHorizontal: 16,
          paddingBottom: 16,
     },
     upgradeButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          borderRadius: 16,
          marginBottom: 12,
          gap: 8,
     },
     upgradeButtonText: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#fff',
     },
     cancelButton: {
          alignItems: 'center',
          paddingVertical: 14,
     },
     cancelButtonText: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#EF4444',
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
});
