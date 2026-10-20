import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

interface NoMoreApartmentsCardProps {
     onRefresh?: () => void;
     onAdjustFilters?: () => void;
}

const NoMoreApartmentsCard: React.FC<NoMoreApartmentsCardProps> = ({
     onRefresh,
     onAdjustFilters,
}) => {
     return (
          <View style={styles.card}>
               <View style={styles.contentContainer}>
                    <View style={styles.iconCircle}>
                         <Icon name="home-outline" size={42} color={colors.PrimaryColor} />
                    </View>

                    <Text style={styles.title}>No More Apartments Left</Text>
                    <Text style={styles.subtitle}>
                         You've reached the end of the list for now. Check back later or adjust your filters to see more homes.
                    </Text>

                    <View style={styles.actionRow}>
                         {onAdjustFilters && (
                              <TouchableOpacity
                                   style={styles.secondaryButton}
                                   onPress={onAdjustFilters}
                                   activeOpacity={0.8}
                              >
                                   <Icon name="options-outline" size={18} color={colors.PrimaryColor} />
                                   <Text style={styles.secondaryButtonText}>Filters</Text>
                              </TouchableOpacity>
                         )}

                         {onRefresh && (
                              <TouchableOpacity
                                   style={styles.primaryButton}
                                   onPress={onRefresh}
                                   activeOpacity={0.8}
                              >
                                   <Icon name="refresh-outline" size={18} color="#fff" />
                                   <Text style={styles.primaryButtonText}>Refresh</Text>
                              </TouchableOpacity>
                         )}
                    </View>
               </View>
          </View>
     );
};

export default NoMoreApartmentsCard;

const styles = StyleSheet.create({
     card: {
          flex: 1,
          borderRadius: 20,
          backgroundColor: '#fff',
          marginHorizontal: 16,
          marginVertical: 10,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
     },
     contentContainer: {
          alignItems: 'center',
          width: '100%',
     },
     iconCircle: {
          width: 84,
          height: 84,
          borderRadius: 42,
          backgroundColor: '#F0F7FF',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
     },
     title: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#111827',
          textAlign: 'center',
          marginBottom: 10,
     },
     subtitle: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 21,
          marginBottom: 28,
          paddingHorizontal: 10,
     },
     actionRow: {
          flexDirection: 'row',
          gap: 12,
          width: '100%',
          justifyContent: 'center',
     },
     primaryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: colors.PrimaryColor,
          paddingVertical: 13,
          paddingHorizontal: 22,
          borderRadius: 14,
          flexGrow: 1,
          maxWidth: 160,
     },
     primaryButtonText: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: '#fff',
     },
     secondaryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: '#F0F7FF',
          borderWidth: 1,
          borderColor: colors.PrimaryColor,
          paddingVertical: 13,
          paddingHorizontal: 22,
          borderRadius: 14,
          flexGrow: 1,
          maxWidth: 160,
     },
     secondaryButtonText: {
          fontSize: 14,
          fontFamily: Font.font500,
          color: colors.PrimaryColor,
     },
});
