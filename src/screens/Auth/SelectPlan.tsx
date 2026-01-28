import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { authUser } from '../../redux/Features/authState';
import { useCreateIntendHandler } from '../../models/Subscription/Subscription';
import { useStripe } from '@stripe/stripe-react-native';
import Spinner from '../../components/Loader/Spinner';
import colors from '../../assests/Colors/Colors';
import { useBuyPlanHandler, useGetPlanHandler } from '../../models/Plan/Plan';
import { PlanResponse, Plans } from '../../redux/Plan/PlanTypes';
import ResToast from '../../components/ResToast/ResToast';
import PurchaseModal from '../../components/PurchaseModal/Purchasemodal';

const SelectPlan = ({ route }: { route?: { params: { user: any; plan: any } } | any }) => {
     const [isLoading, setIsLoading] = useState(false);
     const [buyPlan, setBuyPlan] = useState({
          plan: null as any,
          visible: false,
     });
     const { user } = route.params || {};
     const dispatch = useDispatch();

     console.log(user, 'useruseruseruseruseruseruseruser');

     const [isPaymentSheetReady, setIsPaymentSheetReady] = useState(false);
     const [selectedPlan, setSelectedPlan] = useState<any>(null);

     const { createPaymentMethod } = useStripe();

     // Get Plans
     const { PlanData, PlanLoading, isFetching } = useGetPlanHandler({ interval: 'month' });
     const plans = PlanData?.plans;

     // API
     const { handleBuyPlanAPI, isLoading: BuyPlanLoading } = useBuyPlanHandler();

     const openPaymentSheet = async (plan: Plans) => {
          try {
               setIsLoading(true);
               const billingDetails = {
                    email: 'jenny.rosen@example.com',
                    name: 'Jenny Rosen',
               };

               const { paymentMethod, error } = await createPaymentMethod({
                    paymentMethodType: 'Card',
                    paymentMethodData: {
                         billingDetails,
                    },
               });
               console.log(paymentMethod?.id);
               if (error) {
                    setIsLoading(false);
                    return ResToast({ title: error.message, type: 'danger' });
               }
               if (!error) {
                    await handleBuyPlanAPI({
                         RequestBuyPlan: {
                              email: user.user?.email,
                              planId: plan?._id,
                              token: '',
                              userId: user?.user?._id,
                              priceId: plan?.priceId,
                              paymentMethodId: paymentMethod?.id,
                         },
                         user: user,
                         amount: plan?.amount,
                    });
                    setIsLoading(false);
               }
          } catch (err) {
               console.error(err);
          }
     };

     const CreateAcc = (item: Plans) => {
          handleBuyPlanAPI({
               RequestBuyPlan: {
                    email: user.user?.email,
                    planId: item?._id,
                    token: '',
                    userId: user?.user?._id,
                    priceId: (item as any)?.priceId,
               },
               user: user,
               amount: item?.amount,
          });
     };

     return (
          <>
               <Spinner visible={isLoading || BuyPlanLoading} color={colors.textBlue} />
               <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                         <Text style={styles.headerTitle}>SELECT PLAN</Text>
                         <Text style={styles.headerSubtitle}>Pick the option that gives you the comfort you deserve</Text>
                    </View>

                    {/* Plans */}
                    {plans?.map((plan: Plans, index: number) => (
                         <View key={index} style={styles.planCard}>
                              <Text style={styles.planName}>{plan.title}</Text>
                              <Text style={styles.planDescription}>{plan.description}</Text>

                              {/* Features */}
                              <View style={styles.featuresContainer}>
                                   {plan.planPoints.map((feature, idx) => (
                                        <View key={idx} style={styles.featureItem}>
                                             <Text style={styles.featureTitle}>{feature}</Text>
                                        </View>
                                   ))}
                              </View>

                              {/* Price and Button */}
                              <View style={styles.priceRow}>
                                   <Text style={styles.price}>
                                        {plan?.amount === 0 ? (
                                             'Free'
                                        ) : (
                                             <>
                                                  {plan.amount}
                                                  <Text style={styles.period}>/ {plan.interval}</Text>
                                             </>
                                        )}
                                   </Text>
                                   <TouchableOpacity
                                        style={styles.getPlanButton}
                                        onPress={() => {
                                             if ((plan as any)?.amount != '' || plan?.amount != 0) {
                                                  setBuyPlan({ plan: plan, visible: true });
                                             } else {
                                                  CreateAcc(plan);
                                             }
                                             setSelectedPlan(plan);
                                        }}
                                   >
                                        <Text style={styles.getPlanButtonText}>GET PLAN</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    ))}

                    <View style={styles.bottomSpacing} />
               </ScrollView>
               <PurchaseModal visible={buyPlan.visible} isLoading={isLoading} onClose={() => setBuyPlan({ plan: null, visible: false })} onBuy={() => openPaymentSheet(buyPlan.plan)} />
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
     logoSection: {
          alignItems: 'center',
          paddingTop: 40,
          paddingBottom: 20,
     },
     logoContainer: {
          width: 100,
          height: 100,
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 5,
          borderWidth: 1,
          borderColor: '#F0F0F0',
     },
     logoEmoji: {
          fontSize: 42,
     },
     brandName: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#00A8E8',
          marginBottom: 4,
     },
     tagline: {
          fontSize: 11,
          color: '#666',
          letterSpacing: 1.2,
          fontStyle: 'italic',
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
     featureDesc: {
          fontSize: 12,
          color: '#666',
          lineHeight: 16,
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
