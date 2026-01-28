import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, TextInputProps, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Prediction {
     place_id: string;
     description: string;
}

interface AddressAutocompleteProps {
     value: string;
     onChangeText: (text: string) => void;
     label?: string;
     placeholder?: string;
     apiKey: string;
     iconName?: string;
     style?: ViewStyle;
     inputProps?: Partial<TextInputProps>;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ value, onChangeText, label = 'Address', placeholder = 'Enter your Address', apiKey, iconName = 'city', style, inputProps }) => {
     const [suggestions, setSuggestions] = useState<Prediction[]>([]);
     const [showSuggestions, setShowSuggestions] = useState(false);
     const [loading, setLoading] = useState(false);

     const fetchPlaceSuggestions = async (input: string) => {
          if (input.length < 3) {
               setSuggestions([]);
               setShowSuggestions(false);
               return;
          }

          setLoading(true);
          try {
               const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`);
               const data = await response.json();

               if (data.predictions) {
                    setSuggestions(data.predictions);
                    setShowSuggestions(true);
               }
          } catch (error) {
               console.error('Error fetching suggestions:', error);
          } finally {
               setLoading(false);
          }
     };

     const handleSelect = (description: string) => {
          onChangeText(description);
          setShowSuggestions(false);
          setSuggestions([]);
     };

     return (
          <View style={[styles.container, style]}>
               {label && <Text style={styles.label}>{label}</Text>}
               <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                         <Icon name={iconName} size={18} color="#9CA3AF" />
                    </View>
                    <TextInput
                         style={styles.input}
                         placeholder={placeholder}
                         placeholderTextColor="#9CA3AF"
                         value={value}
                         onChangeText={text => {
                              onChangeText(text);
                              fetchPlaceSuggestions(text);
                         }}
                         keyboardType="default"
                         autoCapitalize="none"
                         autoCorrect={false}
                         {...inputProps}
                    />
                    {loading && <ActivityIndicator size="small" color="#9CA3AF" style={styles.loader} />}
               </View>

               {showSuggestions && suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                         <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                              {suggestions.map(item => (
                                   <TouchableOpacity key={item.place_id} style={styles.suggestionItem} onPress={() => handleSelect(item.description)}>
                                        <Icon name="map-marker" size={16} color="#6B7280" style={styles.suggestionIcon} />
                                        <Text style={styles.suggestionText}>{item.description}</Text>
                                   </TouchableOpacity>
                              ))}
                         </ScrollView>
                    </View>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          marginBottom: 16,
     },
     label: {
          fontSize: 14,
          fontWeight: '500',
          color: '#374151',
          marginBottom: 8,
     },
     inputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 8,
          paddingHorizontal: 12,
     },
     inputIconContainer: {
          marginRight: 8,
     },
     input: {
          flex: 1,
          height: 48,
          fontSize: 14,
          color: '#111827',
     },
     loader: {
          marginLeft: 8,
     },
     suggestionsContainer: {
          marginTop: 4,
          backgroundColor: 'white',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          maxHeight: 250,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
     },
     suggestionItem: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
     },
     suggestionIcon: {
          marginRight: 8,
     },
     suggestionText: {
          flex: 1,
          fontSize: 14,
          color: '#374151',
     },
});

export default AddressAutocomplete;
