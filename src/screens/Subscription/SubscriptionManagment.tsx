import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';
import { useCreateIntendHandler, useDownGradePlanHandler, useGetSubscriptionHandler } from '../../models/Subscription/Subscription';
import { useStripe } from '@stripe/stripe-react-native';
import ResToast from '../../components/ResToast/ResToast';
import Spinner from '../../components/Loader/Spinner';
import { useGetPlanHandler } from '../../models/Plan/Plan';
import { useAuth } from '../../utils/Storage/Storage';

const SubscriptionManagment = () => {
     const [isLoading, setIsLoading] = useState(false);
     const [planPrice, setPlanPrice] = useState<number | null>(null);
     // Current active subscription
     const [currentPlan, setCurrentPlan] = useState<string>('basic');
     const [selectedPlan, setSelectedPlan] = useState<string>('');

     const { userData } = useAuth();

     const { GetSubscription, GetSubscriptionData } = useGetSubscriptionHandler();

     // Mock current subscription data
     const currentSubscription = {
          plan: currentPlan,
          startDate: '2025-01-01',
          endDate: '2025-02-01',
          listingsUsed: 3,
          listingsTotal: 5,
          autoRenew: true,
     };

     const handleUpgrade = () => {
          if (selectedPlan === currentPlan) {
               Alert.alert('Info', 'This is your current plan');
               return;
          }

          Alert.alert('Confirm Upgrade', `Are you sure you want to upgrade to ${SUBSCRIPTION_PLANS?.find(p => p.id === selectedPlan)?.name} plan?`, [
               { text: 'Cancel', style: 'cancel' },
               {
                    text: 'Confirm',
                    onPress: () => {
                         setCurrentPlan(selectedPlan);
                         Alert.alert('Success', 'Your subscription has been updated!');
                    },
               },
          ]);
     };

     const handleCancelSubscription = () => {
          Alert.alert('Cancel Subscription', 'Are you sure you want to cancel your subscription? You will lose access to premium features.', [
               { text: 'No', style: 'cancel' },
               {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => {
                         Alert.alert('Cancelled', 'Your subscription will end on ' + currentSubscription.endDate);
                    },
               },
          ]);
     };

     const { initPaymentSheet, presentPaymentSheet } = useStripe();

     const { handleCreateIntendAPI } = useCreateIntendHandler();

     const openPaymentSheet = async () => {
          const { error } = await presentPaymentSheet();

          if (error) {
               console.error('Payment failed:', error);
               return;
          }

          // dispatch(
          //      authUser({
          //           data: {
          //                email,
          //                password,
          //                name,
          //                city,
          //                confirmPassword,
          //                phone,
          //                selectedIncome,
          //                role: acountType,
          //                craditScore,
          //           },
          //      }),
          // );
          ResToast({ title: 'Your monthly subscription updated successfully', type: 'success' });
     };

     const initializePaymentSheet = async () => {
          try {
               setIsLoading(true);
               const paymentRes = await handleCreateIntendAPI(Number(planPrice));

               if (!paymentRes?.paymentIntend) return;

               const { error } = await initPaymentSheet({
                    merchantDisplayName: 'ABC, Inc.',
                    paymentIntentClientSecret: paymentRes.paymentIntend,
                    allowsDelayedPaymentMethods: true,
               });

               if (error) {
                    setIsLoading(false);
                    console.error('Init Sheet Error:', error);
                    return;
               } else {
                    setIsLoading(false);
               }
               openPaymentSheet();
          } catch (err) {
               console.error(err);
          }
     };

     // Get All Plans
     const { PlanData, PlanLoading, isFetching } = useGetPlanHandler({ interval: 'month' });
     const plans = PlanData?.plans;

     const structuredPlan = () => {
          const GetPlans = plans?.map((item, i) => {
               return {
                    id: item?._id,
                    name: item?.title,
                    price: item?.amount,
                    duration: item?.interval,
                    listings: item?.amount > 40 ? 'Unlimited' : 'Limited',
                    color: item?.amount > 40 ? '#FFD700' : item?.amount == 0 ? '#9CA3AF' : colors.PrimaryColor,
                    features: item?.planPoints,
                    recommended: i % 2 === 0 ? true : false,
               };
          });
          return GetPlans;
     };
     const SUBSCRIPTION_PLANS = structuredPlan();
     const filterPlans = structuredPlan()?.filter(v => v.id !== userData?.subscribedPlan?.plan?._id);

     const currentPlanData = SUBSCRIPTION_PLANS?.find(p => p.id === userData?.subscribedPlan?.plan?._id);
     const daysRemaining = Math.ceil((new Date(currentSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

     // Downgrade Plan
     const { handleDownGradePlanAPI, isLoading: downgradeLoading } = useDownGradePlanHandler();

     const handleChangePlan = () => {
          if (planPrice === null || planPrice === undefined) return ResToast({ title: 'Please select plan', type: 'warning' });
          if ((currentPlanData as any)?.price < planPrice) {
               console.log('Up');
          } else {
               console.log('Down');
               handleDownGradePlanAPI(selectedPlan);
          }
     };

     return (
          <>
               <Spinner visible={isLoading} color={colors.textBlue} />
               <ScrollView style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                         <Text style={styles.headerTitle}>Subscription</Text>
                         <Text style={styles.headerSubtitle}>Manage your subscription plan</Text>
                    </View>

                    {/* Current Subscription Card */}
                    <View style={[styles.currentPlanCard, { borderColor: '#9CA3AF' }]}>
                         <View style={styles.currentPlanHeader}>
                              <View>
                                   <Text style={styles.currentPlanLabel}>Current Plan</Text>
                                   <Text style={styles.currentPlanName}>{currentPlanData?.name}</Text>
                              </View>
                              <View style={[styles.planBadge, { backgroundColor: '#9CA3AF' }]}>
                                   <Text style={styles.planBadgeText}>Active</Text>
                              </View>
                         </View>

                         {/* Usage Stats */}
                         <View style={styles.usageSection}>
                              <View style={styles.usageItem}>
                                   <Icon name="cash-outline" size={24} color={colors.PrimaryColor} />
                                   <View style={styles.usageInfo}>
                                        <Text style={styles.usageLabel}>Price</Text>
                                        <Text style={styles.usageValue}>{currentPlanData?.price}</Text>
                                   </View>
                              </View>

                              <View style={styles.usageDivider} />

                              <View style={styles.usageItem}>
                                   <Icon name="calendar-outline" size={24} color={colors.PrimaryColor} />
                                   <View style={styles.usageInfo}>
                                        <Text style={styles.usageLabel}>Days Remaining</Text>
                                        <Text style={styles.usageValue}>{daysRemaining} days</Text>
                                   </View>
                              </View>
                         </View>

                         {/* Progress Bar */}
                         <View style={styles.progressSection}>
                              <Text style={styles.progressLabel}>Usage Progress</Text>
                              <View style={styles.progressBar}>
                                   <View
                                        style={[
                                             styles.progressFill,
                                             {
                                                  width: `${(currentSubscription.listingsUsed / currentSubscription.listingsTotal) * 100}%`,
                                                  backgroundColor: '#9CA3AF',
                                             },
                                        ]}
                                   />
                              </View>
                         </View>

                         {/* Renewal Info */}
                         <View style={styles.renewalInfo}>
                              <Icon name={currentSubscription.autoRenew ? 'sync' : 'close-circle'} size={18} color={currentSubscription.autoRenew ? '#10B981' : '#EF4444'} />
                              <Text style={styles.renewalText}>{currentSubscription.autoRenew ? `Updated-At ${GetSubscriptionData?.updatedAt?.split('T')[0]}` : 'Auto-renewal is off'}</Text>
                         </View>
                    </View>

                    {/* Available Plans */}
                    <View style={styles.plansSection}>
                         <Text style={styles.sectionTitle}>Available Plans</Text>
                         <Text style={styles.sectionSubtitle}>Choose the plan that fits your needs</Text>

                         {filterPlans?.map(plan => {
                              return (
                                   <TouchableOpacity
                                        disabled={plan.id === userData?.subscribedPlan?.plan?._id}
                                        key={plan.id}
                                        style={[styles.planCard, selectedPlan === plan.id && styles.planCardSelected]}
                                        onPress={() => {
                                             setSelectedPlan(plan.id);
                                             setPlanPrice(plan.price);
                                        }}
                                   >
                                        {plan.id === userData?.subscribedPlan?.plan?._id && (
                                             <View style={styles.recommendedBadge}>
                                                  <Text style={styles.recommendedText}>Selected</Text>
                                             </View>
                                        )}

                                        <View style={styles.planHeader}>
                                             <View style={styles.planInfo}>
                                                  <Text style={styles.planName}>{plan.name}</Text>
                                                  {plan.price === null || plan.price === 0 ? (
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
                                             {plan.id != userData?.subscribedPlan?.plan?._id && (
                                                  <View style={[styles.radioButton, selectedPlan === plan.id && styles.radioButtonSelected]}>
                                                       {selectedPlan === plan.id && <View style={[styles.radioButtonInner, { backgroundColor: colors.PrimaryColor }]} />}
                                                  </View>
                                             )}
                                        </View>

                                        {/* Listings Info */}
                                        <View style={[styles.listingsTag, { backgroundColor: `${plan.color}15` }]}>
                                             <Icon name="document-text-outline" size={16} color={plan.color} />
                                             <Text style={[styles.listingsText, { color: plan.color }]}>{plan.listings === 'Unlimited' ? 'Unlimited' : `${plan.listings}`} Listings</Text>
                                        </View>

                                        {/* Features List */}
                                        <View style={styles.featuresContainer}>
                                             {plan.features.map((feature, index) => (
                                                  <View key={index} style={styles.featureItem}>
                                                       <Icon name="checkmark-circle" size={18} color={plan.color} />
                                                       <Text style={styles.featureText}>{feature}</Text>
                                                  </View>
                                             ))}
                                        </View>

                                        {currentPlan === plan.id && (
                                             <View style={[styles.currentBadge, { backgroundColor: `${plan.color}15` }]}>
                                                  <Text style={[styles.currentBadgeText, { color: plan.color }]}>Current Plan</Text>
                                             </View>
                                        )}
                                   </TouchableOpacity>
                              );
                         })}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsSection}>
                         <TouchableOpacity
                              style={[styles.upgradeButton, { backgroundColor: colors.PrimaryColor }]}
                              onPress={
                                   // initializePaymentSheet
                                   handleChangePlan
                              }
                              disabled={downgradeLoading}
                         >
                              {downgradeLoading ? (
                                   <ActivityIndicator color="#fff" />
                              ) : (
                                   <>
                                        <Text style={styles.upgradeButtonText}>{selectedPlan === currentPlan ? 'Current Plan' : 'Update Subscription'}</Text>
                                        <Icon name="arrow-forward" size={20} color="#fff" />
                                   </>
                              )}
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription} disabled={downgradeLoading}>
                              <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                         </TouchableOpacity>
                    </View>

                    {/* Additional Info */}
                    <View style={styles.infoSection}>
                         <View style={styles.infoCard}>
                              <Icon name="information-circle-outline" size={24} color={colors.PrimaryColor} />
                              <View style={styles.infoContent}>
                                   <Text style={styles.infoTitle}>Subscription Benefits</Text>
                                   <Text style={styles.infoText}>
                                        • Instant activation{'\n'}• Cancel anytime{'\n'}• 30-day money-back guarantee{'\n'}• Secure payment processing
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
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 24,
          backgroundColor: '#fff',
     },
     headerTitle: {
          fontSize: 32,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 4,
     },
     headerSubtitle: {
          fontSize: 15,
          fontFamily: Font.font400,
          color: '#666',
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
     progressSection: {
          marginBottom: 16,
     },
     progressLabel: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#666',
          marginBottom: 8,
     },
     progressBar: {
          height: 8,
          backgroundColor: '#E0E0E0',
          borderRadius: 4,
          overflow: 'hidden',
     },
     progressFill: {
          height: '100%',
          borderRadius: 4,
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
     planCardRecommended: {
          borderColor: colors.PrimaryColor,
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
          fontSize: 24,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 4,
     },
     priceRow: {
          flexDirection: 'row',
          alignItems: 'baseline',
     },
     planPrice: {
          fontSize: 32,
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
     currentBadge: {
          marginTop: 16,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 12,
          alignSelf: 'flex-start',
     },
     currentBadgeText: {
          fontSize: 12,
          fontFamily: Font.font500,
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
