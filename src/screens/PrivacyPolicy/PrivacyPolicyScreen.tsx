import React, { useState } from 'react';
import { LayoutAnimation, Linking, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
     UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ----------------------------- THEME ----------------------------- */
const COLORS = {
     primary: '#1EA7E8',
     primaryLight: '#E3F2FC',
     background: '#F3F5F8',
     card: '#FFFFFF',
     textDark: '#1F2933',
     textMuted: '#7B8794',
     textBody: '#4B5563',
     successBg: '#E6F6EA',
     successText: '#2E9E55',
     border: '#EEF1F4',
};

const CONTACT_EMAIL = 'Tj@noircash.com';
const LAST_UPDATED = 'October 15, 2026';
const APPLE_EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

/* ----------------------------- DATA ----------------------------- */
type Block = { type: 'p'; text: string } | { type: 'h'; text: string } | { type: 'b'; text: string };

type Section = {
     id: string;
     title: string;
     icon: string;
     blocks: Block[];
};

const SECTIONS: Section[] = [
     {
          id: 'agreement',
          title: 'Agreement to Terms',
          icon: 'document-text-outline',
          blocks: [
               {
                    type: 'p',
                    text: `These Terms of Use ("Terms") are a legal agreement between You and Swipe Estate ("We", "Us", "Our") governing Your access to and use of the Swipe Estate mobile application and any related services (the "Service").`,
               },
               {
                    type: 'p',
                    text: 'By creating an account, subscribing, or otherwise using the Service, You confirm that You have read, understood and agree to be bound by these Terms and Our Privacy Policy. If You do not agree, do not use the Service.',
               },
          ],
     },
     {
          id: 'eligibility',
          title: 'Eligibility',
          icon: 'checkmark-circle-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'You must be at least 18 years old and legally able to enter into a binding contract to create an account or purchase a subscription.',
               },
          ],
     },
     {
          id: 'account',
          title: 'Your Account',
          icon: 'person-outline',
          blocks: [
               { type: 'p', text: 'When You create an account, You agree to:' },
               { type: 'b', text: 'Provide accurate, current and complete information and keep it up to date.' },
               { type: 'b', text: 'Keep Your login credentials confidential and not share them with anyone.' },
               { type: 'b', text: 'Be responsible for all activity that happens under Your account.' },
               { type: 'b', text: 'Notify Us promptly at the contact email below if You suspect unauthorized use of Your account.' },
          ],
     },
     {
          id: 'service',
          title: 'The Service',
          icon: 'home-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'Swipe Estate helps users discover and browse real estate listings and connect with real estate agents.',
               },
               {
                    type: 'p',
                    text: 'We are a technology platform. We are not a real estate broker, agent or lender, and We are not a party to any transaction between users. Listings, prices, availability and other property information are provided by agents, other users or third parties, and We do not guarantee that they are accurate, complete or up to date. You should independently verify all information before making any decision.',
               },
          ],
     },
     {
          id: 'subscriptions',
          title: 'Subscriptions and Payments',
          icon: 'card-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'Some features require a paid subscription ("Subscription"). We offer a free plan and paid plans. The features and price of each plan are shown in the app before You subscribe.',
               },
               { type: 'h', text: 'Purchases on iOS' },
               {
                    type: 'b',
                    text: 'Subscriptions purchased in the iOS app are processed by Apple through In-App Purchase. Payment is charged to Your Apple ID account at confirmation of purchase.',
               },
               {
                    type: 'b',
                    text: 'Subscriptions renew automatically each billing period (monthly) unless they are cancelled at least 24 hours before the end of the current period.',
               },
               {
                    type: 'b',
                    text: 'Your account is charged for renewal within 24 hours before the end of the current period, at the price then shown in the App Store.',
               },
               {
                    type: 'b',
                    text: 'You can manage or cancel Your Subscription at any time in Your Apple ID Account Settings after purchase. Deleting the app does not cancel Your Subscription.',
               },
               {
                    type: 'b',
                    text: 'Refund requests for purchases made through Apple are handled by Apple under its policies. We are not able to issue refunds for Apple purchases.',
               },
               { type: 'h', text: 'Other payment methods' },
               {
                    type: 'p',
                    text: 'If You subscribe through another payment provider (for example, Stripe on Android or for certain account types), payments are processed by that provider and are subject to its terms. Billing and cancellation details for those purchases are shown at the time of purchase.',
               },
               { type: 'h', text: 'Price changes' },
               {
                    type: 'p',
                    text: 'We may change subscription prices or features from time to time. Changes for existing subscribers take effect in line with the rules of the relevant payment platform and, where required, only after You have been notified and, if required, have agreed.',
               },
          ],
     },
     {
          id: 'apple',
          title: 'Apple Terms (iOS)',
          icon: 'logo-apple',
          blocks: [
               {
                    type: 'p',
                    text: 'If You use the iOS app, these Terms are between You and Swipe Estate only, and not with Apple. Apple is not responsible for the app or its content, maintenance or support, or for any claims relating to it.',
               },
               {
                    type: 'p',
                    text: "Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against You to the extent permitted by law. Unless We provide a custom license, Your use of the app is also subject to Apple's Licensed Application End User License Agreement (Standard EULA), linked below.",
               },
          ],
     },
     {
          id: 'content',
          title: 'User Content and Listings',
          icon: 'images-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'You may be able to submit content such as profile information, photos, messages and, for agents, property listings ("User Content"). You keep ownership of Your User Content. You grant Us a worldwide, non-exclusive, royalty-free license to host, store, display, reproduce and distribute it as needed to operate and promote the Service.',
               },
               {
                    type: 'p',
                    text: 'You are responsible for Your User Content and confirm that You have the right to submit it, that it is accurate, and that it does not violate any law or third-party right. Agents are responsible for making sure their listings are accurate, authorized, and comply with applicable real estate, advertising and fair housing laws.',
               },
          ],
     },
     {
          id: 'acceptable',
          title: 'Acceptable Use',
          icon: 'ban-outline',
          blocks: [
               { type: 'p', text: 'You agree not to:' },
               { type: 'b', text: 'Use the Service for any unlawful, fraudulent or deceptive purpose.' },
               {
                    type: 'b',
                    text: 'Post false, misleading, discriminatory, harassing, defamatory or infringing content, including listings You are not authorized to advertise.',
               },
               { type: 'b', text: 'Impersonate another person or misrepresent Your identity or affiliation.' },
               {
                    type: 'b',
                    text: 'Scrape, copy, reverse-engineer or collect data from the Service by automated means without Our permission.',
               },
               {
                    type: 'b',
                    text: "Interfere with or disrupt the Service, its security features, or other users' use of it.",
               },
               {
                    type: 'b',
                    text: 'Upload malware or try to gain unauthorized access to the Service or to other accounts.',
               },
               {
                    type: 'b',
                    text: 'Use contact information from the Service to send spam or unsolicited promotions.',
               },
          ],
     },
     {
          id: 'ip',
          title: 'Intellectual Property',
          icon: 'ribbon-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'The Service, including its software, design, logos, text and graphics (other than User Content), is owned by Swipe Estate or its licensors and is protected by intellectual property laws.',
               },
               {
                    type: 'p',
                    text: 'We grant You a limited, non-exclusive, non-transferable, revocable license to use the app for Your personal, non-commercial use in line with these Terms. All rights not expressly granted are reserved.',
               },
          ],
     },
     {
          id: 'thirdparty',
          title: 'Third-Party Services and Links',
          icon: 'extension-puzzle-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'The Service may integrate with or link to third-party services such as maps and location services, payment providers and analytics tools. We do not control and are not responsible for third-party services, and Your use of them is subject to their own terms and privacy policies.',
               },
          ],
     },
     {
          id: 'termination',
          title: 'Suspension and Termination',
          icon: 'log-out-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'You may stop using the Service and delete Your account at any time through Your account settings or by contacting Us. Deleting Your account does not automatically cancel a Subscription purchased through Apple or another provider. You must cancel it separately.',
               },
               {
                    type: 'p',
                    text: 'We may suspend or terminate Your access, with or without notice, if You breach these Terms, if required by law, or if We discontinue the Service. Provisions that by their nature should survive termination will continue to apply.',
               },
          ],
     },
     {
          id: 'disclaimers',
          title: 'Disclaimers',
          icon: 'alert-circle-outline',
          blocks: [
               {
                    type: 'p',
                    text: `The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement, to the extent permitted by law. We do not warrant that the Service will be uninterrupted, secure or error-free, that any listing or information is accurate, or that any transaction will be completed.`,
               },
               {
                    type: 'p',
                    text: 'Nothing in the Service is legal, financial, tax or professional real estate advice.',
               },
          ],
     },
     {
          id: 'liability',
          title: 'Limitation of Liability',
          icon: 'shield-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'To the maximum extent permitted by law, Swipe Estate and its affiliates, officers, employees and service providers will not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits, data or goodwill, arising out of or related to Your use of the Service or any transaction with other users.',
               },
               {
                    type: 'p',
                    text: 'Our total liability for any claim relating to the Service will not exceed the greater of the amount You paid Us for the Service in the 12 months before the claim arose or US$100. Some jurisdictions do not allow certain limitations, so these may not apply to You in full.',
               },
          ],
     },
     {
          id: 'indemnification',
          title: 'Indemnification',
          icon: 'hand-left-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'You agree to defend and indemnify Swipe Estate against claims, damages and expenses (including reasonable legal fees) arising from Your User Content, Your breach of these Terms, or Your violation of any law or third-party right.',
               },
          ],
     },
     {
          id: 'law',
          title: 'Governing Law',
          icon: 'earth-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'These Terms are governed by the laws of the State of Texas, United States, without regard to conflict-of-law rules. Any dispute relating to these Terms or the Service will be brought in the state or federal courts located in Texas, and You consent to their jurisdiction, unless applicable law gives You the right to bring a claim elsewhere.',
               },
          ],
     },
     {
          id: 'changes',
          title: 'Changes to These Terms',
          icon: 'refresh-outline',
          blocks: [
               {
                    type: 'p',
                    text: 'We may update these Terms from time to time. We will post the updated Terms in the app and on Our website and update the "Last updated" date. If a change is material, We will give reasonable notice.',
               },
               {
                    type: 'p',
                    text: 'Continuing to use the Service after the changes take effect means You accept the updated Terms.',
               },
          ],
     },
];

/* ----------------------------- COMPONENTS ----------------------------- */
const SectionCard = ({ section, expanded, onToggle }: { section: Section; expanded: boolean; onToggle: () => void }) => (
     <View style={styles.card}>
          <TouchableOpacity activeOpacity={0.8} style={styles.cardHeader} onPress={onToggle}>
               <View style={styles.iconCircle}>
                    <Icon name={section.icon} size={20} color={COLORS.primary} />
               </View>
               <Text style={styles.cardTitle}>{section.title}</Text>
               <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {expanded && (
               <View style={styles.cardBody}>
                    {section.blocks.map((block, index) => {
                         if (block.type === 'h') {
                              return (
                                   <Text key={index} style={styles.subHeading}>
                                        {block.text}
                                   </Text>
                              );
                         }
                         if (block.type === 'b') {
                              return (
                                   <View key={index} style={styles.bulletRow}>
                                        <View style={styles.bulletDot} />
                                        <Text style={styles.bulletText}>{block.text}</Text>
                                   </View>
                              );
                         }
                         return (
                              <Text key={index} style={styles.paragraph}>
                                   {block.text}
                              </Text>
                         );
                    })}

                    {section.id === 'apple' && (
                         <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(APPLE_EULA_URL).catch(() => {})}>
                              <Text style={styles.linkText}>Apple Standard EULA</Text>
                         </TouchableOpacity>
                    )}
               </View>
          )}
     </View>
);

/* ----------------------------- SCREEN ----------------------------- */
const TermsOfUseScreen = () => {
     const navigation = useNavigation();
     const [openIds, setOpenIds] = useState<string[]>(['agreement']);

     const toggle = (id: string) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpenIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
     };

     const allOpen = openIds.length === SECTIONS.length;

     const toggleAll = () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpenIds(allOpen ? [] : SECTIONS.map(s => s.id));
     };

     const openMail = () => {
          Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=Swipe%20Estate%20Terms%20of%20Use`).catch(() => {});
     };

     return (
          <SafeAreaView style={styles.safeArea}>
               <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />

               {/* Header */}
               <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                         <Icon name="chevron-back" size={22} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Terms of Use</Text>
                    <View style={styles.headerButton}>
                         <Icon name="document-text-outline" size={22} color={COLORS.primary} />
                    </View>
               </View>

               <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Hero */}
                    <View style={styles.hero}>
                         <View style={styles.heroCircle}>
                              <Icon name="document-text" size={40} color={COLORS.primary} />
                         </View>
                         <Text style={styles.heroTitle}>Swipe Estate</Text>
                         <View style={styles.badge}>
                              <Icon name="checkmark-circle" size={14} color={COLORS.successText} />
                              <Text style={styles.badgeText}>Last updated: {LAST_UPDATED}</Text>
                         </View>
                         <Text style={styles.heroSubtitle}>Please read these Terms carefully. They explain the rules for using Swipe Estate, including subscriptions and payments.</Text>
                    </View>

                    {/* Section title row */}
                    <View style={styles.sectionHeaderRow}>
                         <Text style={styles.sectionHeader}>Terms Details</Text>
                         <TouchableOpacity onPress={toggleAll} activeOpacity={0.7}>
                              <Text style={styles.expandAll}>{allOpen ? 'Collapse all' : 'Expand all'}</Text>
                         </TouchableOpacity>
                    </View>

                    {SECTIONS.map(section => (
                         <SectionCard key={section.id} section={section} expanded={openIds.includes(section.id)} onToggle={() => toggle(section.id)} />
                    ))}

                    {/* Contact card */}
                    <Text style={[styles.sectionHeader, styles.contactHeader]}>Contact Us</Text>
                    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={openMail}>
                         <View style={styles.cardHeader}>
                              <View style={styles.iconCircle}>
                                   <Icon name="mail-outline" size={20} color={COLORS.primary} />
                              </View>
                              <View style={styles.contactTextWrap}>
                                   <Text style={styles.contactLabel}>Questions about these Terms?</Text>
                                   <Text style={styles.contactEmail}>{CONTACT_EMAIL}</Text>
                              </View>
                              <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
                         </View>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>© {new Date().getFullYear()} Swipe Estate. All rights reserved.</Text>
               </ScrollView>
          </SafeAreaView>
     );
};

export default TermsOfUseScreen;

/* ----------------------------- STYLES ----------------------------- */
const styles = StyleSheet.create({
     safeArea: {
          flex: 1,
          backgroundColor: COLORS.card,
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: COLORS.card,
     },
     headerButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: COLORS.background,
          alignItems: 'center',
          justifyContent: 'center',
     },
     headerTitle: {
          fontSize: 20,
          fontWeight: '500',
          color: COLORS.textDark,
     },
     scroll: {
          flex: 1,
          backgroundColor: COLORS.background,
     },
     scrollContent: {
          paddingBottom: 40,
     },
     hero: {
          alignItems: 'center',
          backgroundColor: COLORS.card,
          paddingTop: 12,
          paddingBottom: 24,
          paddingHorizontal: 24,
     },
     heroCircle: {
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 3,
          borderColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.primaryLight,
     },
     heroTitle: {
          marginTop: 14,
          fontSize: 20,
          fontWeight: '500',
          color: COLORS.textDark,
     },
     badge: {
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.successBg,
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 14,
     },
     badgeText: {
          marginLeft: 6,
          fontSize: 12,
          color: COLORS.successText,
          fontWeight: '500',
     },
     heroSubtitle: {
          marginTop: 14,
          fontSize: 13,
          lineHeight: 19,
          textAlign: 'center',
          color: COLORS.textMuted,
     },
     sectionHeaderRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginTop: 20,
          marginBottom: 12,
     },
     sectionHeader: {
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.textDark,
          paddingHorizontal: 0,
     },
     expandAll: {
          fontSize: 13,
          color: COLORS.primary,
          fontWeight: '500',
     },
     contactHeader: {
          marginTop: 12,
          marginBottom: 12,
          paddingHorizontal: 16,
     },
     card: {
          backgroundColor: COLORS.card,
          borderRadius: 14,
          marginHorizontal: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 5,
          elevation: 4,
     },
     cardHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 14,
     },
     iconCircle: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: COLORS.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
     },
     cardTitle: {
          flex: 1,
          fontSize: 15,
          fontWeight: '500',
          color: COLORS.textDark,
     },
     cardBody: {
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 2,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
     },
     subHeading: {
          marginTop: 14,
          marginBottom: 4,
          fontSize: 13,
          fontWeight: '600',
          color: COLORS.primary,
     },
     paragraph: {
          marginTop: 10,
          fontSize: 13.5,
          lineHeight: 21,
          color: COLORS.textBody,
     },
     bulletRow: {
          flexDirection: 'row',
          marginTop: 8,
          paddingRight: 8,
     },
     bulletDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: COLORS.primary,
          marginTop: 8,
          marginRight: 10,
     },
     bulletText: {
          flex: 1,
          fontSize: 13.5,
          lineHeight: 21,
          color: COLORS.textBody,
     },
     linkText: {
          marginTop: 10,
          fontSize: 13.5,
          fontWeight: '500',
          color: COLORS.primary,
          textDecorationLine: 'underline',
     },
     contactTextWrap: {
          flex: 1,
     },
     contactLabel: {
          fontSize: 12,
          color: COLORS.textMuted,
     },
     contactEmail: {
          marginTop: 2,
          fontSize: 14.5,
          fontWeight: '500',
          color: COLORS.primary,
     },
     footerText: {
          marginTop: 8,
          textAlign: 'center',
          fontSize: 12,
          color: COLORS.textMuted,
     },
});
