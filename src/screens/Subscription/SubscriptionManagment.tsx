import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from '../../assests/fonts/Font';
import { useDownGradePlanHandler, useUpGradePlanHandler } from '../../models/Subscription/Subscription';
import { useStripe } from '@stripe/stripe-react-native';
import ResToast from '../../components/ResToast/ResToast';
import Spinner from '../../components/Loader/Spinner';
import { useGetPlanHandler, useGetSubscribedPlanHandler } from '../../models/Plan/Plan';
import { useAuth } from '../../utils/Storage/Storage';
import colors from '../../assests/Colors/Colors';
import { Switch } from 'react-native-paper';
import PurchaseModal from '../../components/PurchaseModal/Purchasemodal';
import { useNavigation } from '@react-navigation/native';

const SubscriptionManagment = () => {
     const navigation = useNavigation();
     const [isLoading, setIsLoading] = useState(false);
     const [isUpgrade, setIsUpgrade] = useState(false);
     const [planPrice, setPlanPrice] = useState<number | null>(null);
     // Current active subscription
     const [filter, setFilter] = useState('month');
     const [isSwitchOn, setIsSwitchOn] = useState(false);
     const [currentPlan] = useState<string>('basic');
     const [selectedPlan, setSelectedPlan] = useState<string>('');

     const { userData } = useAuth();
     console.log(userData?.role === 'Buyer' ? 'user' : 'agent');
     const { createPaymentMethod } = useStripe();

     // Get Subscription Data
     const { GetSubscribedPlanData, refetch } = useGetSubscribedPlanHandler();
     const SubsDetail = GetSubscribedPlanData as any;

     // Get All Plans
     const { PlanData } = useGetPlanHandler({ interval: filter, type: userData?.role === 'Buyer' ? 'user' : 'agent' });
     const plan = PlanData?.plans;

     const structuredPlan = () => {
          const GetPlans = plan?.map((item, i) => {
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

     const filterPlans = structuredPlan()?.filter(v => v.id !== SubsDetail?.planId);
     console.log(plan);
     const startDateRaw = SubsDetail?.plan?.startDate;
     const startDate = startDateRaw ? new Date(startDateRaw) : null;
     const endDate = startDate && !isNaN(startDate.getTime()) ? new Date(startDate) : null;

     if (endDate) {
          endDate.setMonth(endDate.getMonth() + 1);
     }

     const daysRemaining = endDate ? Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;

     const renewalDate = endDate ? endDate.toISOString().split('T')[0] : 'N/A';

     // Downgrade Plan
     const { handleDownGradePlanAPI, isLoading: downgradeLoading } = useDownGradePlanHandler();
     // Upgrade Plan
     const { handleUpGradePlanAPI, isLoading: upgradeLoading } = useUpGradePlanHandler();

     const openPaymentSheet = async () => {
          try {
               setIsLoading(true);
               const billingDetails = {
                    email: userData?.email || '',
                    name: userData?.username || '',
               };
               const { paymentMethod, error } = await createPaymentMethod({
                    paymentMethodType: 'Card',
                    paymentMethodData: {
                         billingDetails,
                    },
               });
               if (error) {
                    setIsLoading(false);
                    return ResToast({ title: error.message, type: 'danger' });
               }
               if (!error) {
                    await handleUpGradePlanAPI({
                         upgradeTo: selectedPlan,
                         paymentMethodId: paymentMethod?.id,
                    });
                    refetch();
                    setIsLoading(false);
                    setIsUpgrade(false);
               }
          } catch (err) {
               console.error(err);
          }
     };

     const handleChangePlan = () => {
          if (planPrice === null || planPrice === undefined) return ResToast({ title: 'Please select plan', type: 'warning' });
          if (SubsDetail?.planDetail?.amount < planPrice) {
               setIsUpgrade(true);
          } else {
               handleDownGradePlanAPI(selectedPlan);
               refetch();
          }
     };

     return (
          <>
               <Spinner visible={isLoading} color={colors.textBlue} />
               <ScrollView style={styles.container}>
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
                              <View>
                                   <Text style={styles.currentPlanLabel}>Current Plan</Text>
                                   <Text style={styles.currentPlanName}>{SubsDetail?.planDetail?.title}</Text>
                              </View>
                              <View style={[styles.planBadge, { backgroundColor: SubsDetail?.plan?.status == 'active' ? '#22C55E' : '#9CA3AF' }]}>
                                   <Text style={styles.planBadgeText}>{SubsDetail?.plan?.status}</Text>
                              </View>
                         </View>

                         <View style={styles.usageSection}>
                              <View style={styles.usageItem}>
                                   <Icon name="cash-outline" size={24} color={colors.PrimaryColor} />
                                   <View style={styles.usageInfo}>
                                        <Text style={styles.usageLabel}>Price</Text>
                                        <Text style={styles.usageValue}>${SubsDetail?.planDetail?.amount}</Text>
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

                         <View style={styles.renewalInfo}>
                              <Icon name={'sync'} size={18} color={'#10B981'} />
                              <Text style={styles.renewalText}>{`Updated-At ${renewalDate}`}</Text>
                         </View>
                    </View>

                    <View style={styles.plansSection}>
                         <Text style={styles.sectionTitle}>Available Plans</Text>
                         <Text style={styles.sectionSubtitle}>Choose the plan that fits your needs</Text>

                         <View className="flex-row items-center gap-1 pb-5 justify-center">
                              <Text className={`text-lg text-text-muted font-figtree500`}>Monthly</Text>
                              <Switch
                                   value={isSwitchOn}
                                   onValueChange={(value: boolean) => {
                                        setIsSwitchOn(value);
                                        setFilter(value ? 'year' : 'month');
                                   }}
                                   color={colors.textBlue}
                                   focusable
                              />
                              <Text className="text-lg text-text-muted font-figtree500">Yearly</Text>
                         </View>
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

                                        <View style={[styles.listingsTag, { backgroundColor: `${plan.color}15` }]}>
                                             <Icon name="document-text-outline" size={16} color={plan.color} />
                                             <Text style={[styles.listingsText, { color: plan.color }]}>{plan.listings === 'Unlimited' ? 'Unlimited' : `${plan.listings}`} Listings</Text>
                                        </View>

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
                    </View>

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
               <PurchaseModal visible={isUpgrade} isLoading={upgradeLoading} onClose={() => setIsUpgrade(false)} onBuy={openPaymentSheet} />
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
