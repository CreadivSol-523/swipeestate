import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from '../Icons/Icons';

// Icon component placeholder - replace with your actual icon component
// const Icon = ({ name, size, color }: { name: string; size: number; color: string }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;

export interface DropdownOption {
     label: string;
     value: string;
}

interface CustomDropdownProps {
     label?: string;
     placeholder?: string;
     options: DropdownOption[];
     value?: string;
     onValueChange: (value: string, label: string) => void;
     iconName?: string;
     iconSize?: number;
     iconColor?: string;
     containerStyle?: ViewStyle;
     dropdownStyle?: ViewStyle;
     maxHeight?: number;
     height?: number;
     disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
     label,
     placeholder = 'Select an option',
     options,
     value,
     onValueChange,
     iconName = 'default',
     iconSize = 18,
     iconColor = '#9CA3AF',
     containerStyle,
     dropdownStyle,
     maxHeight = 280,
     height = 200,
     disabled = false,
}) => {
     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

     const selectedOption = options?.find(option => option.value === value);
     const displayText = selectedOption ? selectedOption.label : '';

     const handleSelect = (item: DropdownOption) => {
          onValueChange(item.value, item.label);
          setIsDropdownOpen(false);
     };

     return (
          <View style={[styles.inputGroup, containerStyle]}>
               <Text style={styles.label}>{label}</Text>

               <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                         style={[styles.selectButton, isDropdownOpen && styles.selectButtonActive, disabled && styles.selectButtonDisabled, dropdownStyle]}
                         onPress={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
                         activeOpacity={0.7}
                         disabled={disabled}
                    >
                         <View style={styles.inputIconContainer}>
                              <Icon name={iconName} size={18} color="#9CA3AF" />
                         </View>

                         <Text style={[styles.selectText, !displayText && styles.placeholder]}>{displayText || placeholder}</Text>

                         <View style={styles.chevronContainer}>
                              <Text style={[styles.chevron, isDropdownOpen && styles.chevronRotated]}>▼</Text>
                         </View>
                    </TouchableOpacity>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && !disabled && (
                         <View style={[styles.dropdownMenu, { maxHeight, height }]}>
                              <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                                   {options.map((item, index) => (
                                        <TouchableOpacity
                                             key={item.value}
                                             style={[
                                                  styles.optionItem,
                                                  value === item.value && styles.optionItemSelected,
                                                  index === 0 && styles.firstOption,
                                                  index === options.length - 1 && styles.lastOption,
                                             ]}
                                             onPress={() => handleSelect(item)}
                                             activeOpacity={0.7}
                                        >
                                             <Text style={[styles.optionText, value === item.value && styles.optionTextSelected]}>{item.label}</Text>
                                             {value === item.value && (
                                                  <View style={styles.checkmark}>
                                                       <Text style={styles.checkmarkText}>✓</Text>
                                                  </View>
                                             )}
                                        </TouchableOpacity>
                                   ))}
                              </ScrollView>
                         </View>
                    )}
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     inputGroup: {
          marginBottom: 16,
          zIndex: 1000,
     },
     label: {
          fontSize: 14,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 8,
     },
     dropdownContainer: {
          position: 'relative',
          zIndex: 1000,
     },
     selectButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 14,
          minHeight: 52,
     },
     selectButtonActive: {
          borderColor: '#2563EB',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
     },
     selectButtonDisabled: {
          backgroundColor: '#F9FAFB',
          opacity: 0.6,
     },
     inputIconContainer: {
          marginRight: 12,
     },
     selectText: {
          flex: 1,
          fontSize: 15,
          color: '#111827',
     },
     placeholder: {
          color: '#9CA3AF',
     },
     chevronContainer: {
          marginLeft: 8,
     },
     chevron: {
          fontSize: 10,
          color: '#9CA3AF',
     },
     chevronRotated: {
          transform: [{ rotate: '180deg' }],
     },
     dropdownMenu: {
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#2563EB',
          borderTopWidth: 0,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          zIndex: 1000,
     },
     optionsList: {
          flex: 1,
     },
     optionItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
     },
     firstOption: {
          paddingTop: 16,
     },
     lastOption: {
          borderBottomWidth: 0,
          paddingBottom: 16,
     },
     optionItemSelected: {
          backgroundColor: '#F0F9FF',
     },
     optionText: {
          fontSize: 15,
          color: '#374151',
          fontWeight: '500',
     },
     optionTextSelected: {
          color: '#2563EB',
          fontWeight: '600',
     },
     checkmark: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#2563EB',
          justifyContent: 'center',
          alignItems: 'center',
     },
     checkmarkText: {
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: 'bold',
     },
});

export default CustomDropdown;

// Example Usage:
/*
import CustomDropdown, { DropdownOption } from './CustomDropdown';

const incomeRanges: DropdownOption[] = [
  { label: 'Under $25,000', value: '0-25000' },
  { label: '$25,000 - $50,000', value: '25000-50000' },
  { label: '$50,000 - $75,000', value: '50000-75000' },
  { label: '$75,000 - $1,00,000', value: '75000-100000' },
  { label: '$1,00,000 - $1,50,000', value: '100000-150000' },
  { label: '$1,50,000 - $2,00,000', value: '150000-200000' },
  { label: '$2,00,000 - $3,00,000', value: '200000-300000' },
  { label: 'Above $3,00,000', value: '300000+' },
];

const [selectedIncome, setSelectedIncome] = useState('');

<CustomDropdown
  label="Income Range"
  placeholder="Select your income range"
  options={incomeRanges}
  value={selectedIncome}
  onValueChange={(value, label) => {
    setSelectedIncome(value);
    console.log('Selected:', value, label);
  }}
  iconName="income"
  iconSize={18}
  iconColor="#9CA3AF"
/>
*/
