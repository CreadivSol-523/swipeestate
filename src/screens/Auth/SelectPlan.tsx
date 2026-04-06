import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Spinner from '../../components/Loader/Spinner';
import colors from '../../assests/Colors/Colors';
import { useBuyPlanHandler, useGetPlanHandler } from '../../models/Plan/Plan';
import { Plans } from '../../redux/Plan/PlanTypes';
import ResToast from '../../components/ResToast/ResToast';
import PurchaseModal from '../../components/PurchaseModal/Purchasemodal';
import { explainIapError, purchaseIosSubscription } from '../../utils/appleIap';
import { resolveAppleProductId } from '../../utils/applePlanProductIds';

const SelectPlan = ({ route }: { route?: { params: { user: any; plan: any } } | any }) => {
     const [isLoading, setIsLoading] = useState(false);
     const [buyPlan, setBuyPlan] = useState({
          plan: null as Plans | null,
          visible: false,
     });
     const { user } = route.params || {};

     const { PlanData, PlanLoading, isFetching } = useGetPlanHandler({ interval: 'month' });
     const plans = PlanData?.plans;

     const { handleBuyPlanAPI, isLoading: BuyPlanLoading } = useBuyPlanHandler();

     const subscribeWithApple = async (plan: Plans) => {
          if (Platform.OS !== 'ios') {
               return ResToast({
                    title: 'Paid subscriptions use Apple In-App Purchase on iOS. Android billing is not wired to this backend yet.',
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
               await handleBuyPlanAPI({
                    RequestBuyPlan: {
                         userId: user?.user?._id,
                         planId: plan._id,
                         email: user?.user?.email,
                         receipt,
                    },
                    user,
                    amount: plan.amount,
               });
          } catch (err) {
               console.error(err);
               ResToast({
                    title: explainIapError(err),
                    type: 'danger',
               });
          } finally {
               setIsLoading(false);
               setBuyPlan({ plan: null, visible: false });
          }
     };

     const CreateAcc = (item: Plans) => {
          handleBuyPlanAPI({
               RequestBuyPlan: {
                    email: user.user?.email,
                    planId: item._id,
                    userId: user?.user?._id,
               },
               user,
               amount: item.amount,
          });
     };

     return (
          <>
               <Spinner visible={isLoading || BuyPlanLoading || PlanLoading || isFetching} color={colors.textBlue} />
               <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                         <Text style={styles.headerTitle}>SELECT PLAN</Text>
                         <Text style={styles.headerSubtitle}>Pick the option that gives you the comfort you deserve</Text>
                    </View>

                    {plans?.map((plan: Plans, index: number) => (
                         <View key={index} style={styles.planCard}>
                              <Text style={styles.planName}>{plan.title}</Text>
                              <Text style={styles.planDescription}>{plan.description}</Text>

                              <View style={styles.featuresContainer}>
                                   {plan.planPoints.map((feature: string, idx: number) => (
                                        <View key={idx} style={styles.featureItem}>
                                             <Text style={styles.featureTitle}>{feature}</Text>
                                        </View>
                                   ))}
                              </View>

                              <View style={styles.priceRow}>
                                   <Text style={styles.price}>
                                        {plan.amount === 0 ? (
                                             'Free'
                                        ) : (
                                             <>
                                                  ${plan.amount}
                                                  <Text style={styles.period}>/ {plan.interval}</Text>
                                             </>
                                        )}
                                   </Text>
                                   <TouchableOpacity
                                        style={styles.getPlanButton}
                                        onPress={() => {
                                             if (plan.amount > 0) {
                                                  setBuyPlan({ plan, visible: true });
                                             } else {
                                                  CreateAcc(plan);
                                             }
                                        }}
                                   >
                                        <Text style={styles.getPlanButtonText}>GET PLAN</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    ))}

                    <View style={styles.bottomSpacing} />
               </ScrollView>
               <PurchaseModal
                    visible={buyPlan.visible}
                    isLoading={isLoading}
                    planTitle={buyPlan.plan?.title}
                    onClose={() => setBuyPlan({ plan: null, visible: false })}
                    onBuy={() => {
                         if (buyPlan.plan) {
                              void subscribeWithApple(buyPlan.plan);
                         }
                    }}
               />
          </>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#FFFFFF',
     },
     scrollView: {
          flex: 1,
     },
     header: {
          paddingHorizontal: 20,
          paddingTop: 30,
          paddingBottom: 10,
     },
     headerTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#0EA5E9',
          textAlign: 'center',
          marginBottom: 8,
          letterSpacing: 0.5,
     },
     headerSubtitle: {
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          lineHeight: 20,
          paddingHorizontal: 10,
     },
     planCard: {
          backgroundColor: '#FFF',
          borderRadius: 16,
          padding: 20,
          marginHorizontal: 20,
          marginTop: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#F5F5F5',
     },
     planName: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0EA5E9',
          marginBottom: 8,
          letterSpacing: 0.5,
     },
     planDescription: {
          fontSize: 13,
          color: '#666',
          marginBottom: 16,
          lineHeight: 18,
     },
     featuresContainer: {
          marginBottom: 20,
     },
     featureItem: {
          backgroundColor: '#F0EFFF',
          borderRadius: 12,
          padding: 14,
          marginBottom: 8,
     },
     featureTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
          marginBottom: 4,
     },
     priceRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
     },
     price: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#0EA5E9',
     },
     period: {
          fontSize: 14,
          fontWeight: 'normal',
     },
     getPlanButton: {
          backgroundColor: '#0EA5E9',
          borderRadius: 20,
          paddingHorizontal: 28,
          paddingVertical: 12,
          shadowColor: '#0EA5E9',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
     },
     getPlanButtonText: {
          color: '#FFF',
          fontSize: 14,
          fontWeight: 'bold',
          letterSpacing: 0.5,
     },
     bottomSpacing: {
          height: 30,
     },
});

export default SelectPlan;
