import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, Image } from 'react-native';

interface Apartment {
     title: string;
     type: 'Apartment' | 'Studio' | 'Penthouse' | 'House';
     location: string;
     price: number;
     area: number;
     bedrooms: number;
     bathrooms: number;
     floor?: number;
     furnished?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
     balcony?: boolean;
     parking?: number;
     amenities?: string[];
     availability?: string;
     images?: string[];
     featured?: boolean;
     description?: string;
}

const ListingScreen = () => {
     const [formData, setFormData] = useState<Apartment>({
          title: '',
          type: 'Apartment',
          location: '',
          price: 0,
          area: 0,
          bedrooms: 0,
          bathrooms: 0,
          floor: undefined,
          furnished: 'Unfurnished',
          balcony: false,
          parking: undefined,
          amenities: [],
          availability: '',
          images: [],
          featured: false,
          description: '',
     });

     const [currentAmenity, setCurrentAmenity] = useState('');
     const [currentImageUrl, setCurrentImageUrl] = useState('');

     const apartmentTypes: Array<'Apartment' | 'Studio' | 'Penthouse' | 'House'> = ['Apartment', 'Studio', 'Penthouse', 'House'];

     const furnishedOptions: Array<'Furnished' | 'Semi-Furnished' | 'Unfurnished'> = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

     const commonAmenities = ['Gym', 'Pool', 'Elevator', 'Security', 'Playground', 'Garden', 'Backup Generator'];

     const updateField = <K extends keyof Apartment>(field: K, value: Apartment[K]) => {
          setFormData(prev => ({ ...prev, [field]: value }));
     };

     const addAmenity = (amenity: string) => {
          if (amenity && !formData.amenities?.includes(amenity)) {
               updateField('amenities', [...(formData.amenities || []), amenity]);
               setCurrentAmenity('');
          }
     };

     const removeAmenity = (amenity: string) => {
          updateField(
               'amenities',
               formData.amenities?.filter(a => a !== amenity),
          );
     };

     const addImage = () => {
          if (currentImageUrl && !formData.images?.includes(currentImageUrl)) {
               updateField('images', [...(formData.images || []), currentImageUrl]);
               setCurrentImageUrl('');
          }
     };

     const removeImage = (url: string) => {
          updateField(
               'images',
               formData.images?.filter(img => img !== url),
          );
     };

     const handleSubmit = () => {
          // Validation
          if (!formData.title || !formData.location || !formData.price || !formData.area) {
               Alert.alert('Error', 'Please fill all required fields');
               return;
          }

          console.log('Apartment Listing:', formData);
          Alert.alert('Success', 'Apartment listing submitted successfully!');
     };

     return (
          <ScrollView style={styles.container}>
               <View style={styles.header}>
                    <Text style={styles.headerTitle}>Add Apartment Listing</Text>
                    <Text style={styles.headerSubtitle}>Fill in the property details</Text>
               </View>

               {/* Title */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Property Title *</Text>
                    <TextInput style={styles.input} placeholder="e.g., Luxury 3BR Apartment" value={formData.title} onChangeText={text => updateField('title', text)} />
               </View>

               {/* Type Selection */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Property Type *</Text>
                    <View style={styles.chipContainer}>
                         {apartmentTypes.map(type => (
                              <TouchableOpacity key={type} style={[styles.chip, formData.type === type && styles.chipSelected]} onPress={() => updateField('type', type)}>
                                   <Text style={[styles.chipText, formData.type === type && styles.chipTextSelected]}>{type}</Text>
                              </TouchableOpacity>
                         ))}
                    </View>
               </View>

               {/* Location */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Location *</Text>
                    <TextInput style={styles.input} placeholder="e.g., Houston, TX" value={formData.location} onChangeText={text => updateField('location', text)} />
               </View>

               {/* Price and Area */}
               <View style={styles.row}>
                    <View style={styles.halfWidth}>
                         <Text style={styles.label}>Price (USD) *</Text>
                         <TextInput style={styles.input} placeholder="2500" keyboardType="numeric" value={formData.price.toString()} onChangeText={text => updateField('price', Number(text) || 0)} />
                    </View>
                    <View style={styles.halfWidth}>
                         <Text style={styles.label}>Area (sq ft) *</Text>
                         <TextInput style={styles.input} placeholder="1500" keyboardType="numeric" value={formData.area.toString()} onChangeText={text => updateField('area', Number(text) || 0)} />
                    </View>
               </View>

               {/* Bedrooms and Bathrooms */}
               <View style={styles.row}>
                    <View style={styles.halfWidth}>
                         <Text style={styles.label}>Bedrooms *</Text>
                         <TextInput
                              style={styles.input}
                              placeholder="3"
                              keyboardType="numeric"
                              value={formData.bedrooms.toString()}
                              onChangeText={text => updateField('bedrooms', Number(text) || 0)}
                         />
                    </View>
                    <View style={styles.halfWidth}>
                         <Text style={styles.label}>Bathrooms *</Text>
                         <TextInput
                              style={styles.input}
                              placeholder="2"
                              keyboardType="numeric"
                              value={formData.bathrooms.toString()}
                              onChangeText={text => updateField('bathrooms', Number(text) || 0)}
                         />
                    </View>
               </View>

               {/* Floor */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Floor</Text>
                    <TextInput
                         style={styles.input}
                         placeholder="e.g., 5"
                         keyboardType="numeric"
                         value={formData.floor?.toString() || ''}
                         onChangeText={text => updateField('floor', Number(text) || undefined)}
                    />
               </View>

               {/* Furnished Status */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Furnished Status</Text>
                    <View style={styles.chipContainer}>
                         {furnishedOptions.map(option => (
                              <TouchableOpacity key={option} style={[styles.chip, formData.furnished === option && styles.chipSelected]} onPress={() => updateField('furnished', option)}>
                                   <Text style={[styles.chipText, formData.furnished === option && styles.chipTextSelected]}>{option}</Text>
                              </TouchableOpacity>
                         ))}
                    </View>
               </View>

               {/* Parking */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Parking Spots</Text>
                    <TextInput
                         style={styles.input}
                         placeholder="e.g., 2"
                         keyboardType="numeric"
                         value={formData.parking?.toString() || ''}
                         onChangeText={text => updateField('parking', Number(text) || undefined)}
                    />
               </View>

               {/* Balcony and Featured */}
               <View style={styles.switchContainer}>
                    <View style={styles.switchRow}>
                         <Text style={styles.label}>Has Balcony</Text>
                         <Switch
                              value={formData.balcony}
                              onValueChange={value => updateField('balcony', value)}
                              trackColor={{ false: '#E5E7EB', true: '#60A5FA' }}
                              thumbColor={formData.balcony ? '#3B82F6' : '#F3F4F6'}
                         />
                    </View>
                    <View style={styles.switchRow}>
                         <Text style={styles.label}>Featured Listing</Text>
                         <Switch
                              value={formData.featured}
                              onValueChange={value => updateField('featured', value)}
                              trackColor={{ false: '#E5E7EB', true: '#60A5FA' }}
                              thumbColor={formData.featured ? '#3B82F6' : '#F3F4F6'}
                         />
                    </View>
               </View>

               {/* Availability */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Availability</Text>
                    <TextInput style={styles.input} placeholder="e.g., Immediate, 1 Month" value={formData.availability} onChangeText={text => updateField('availability', text)} />
               </View>

               {/* Amenities */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Amenities</Text>
                    <View style={styles.chipContainer}>
                         {commonAmenities.map(amenity => (
                              <TouchableOpacity
                                   key={amenity}
                                   style={[styles.chip, formData.amenities?.includes(amenity) && styles.chipSelected]}
                                   onPress={() => (formData.amenities?.includes(amenity) ? removeAmenity(amenity) : addAmenity(amenity))}
                              >
                                   <Text style={[styles.chipText, formData.amenities?.includes(amenity) && styles.chipTextSelected]}>{amenity}</Text>
                              </TouchableOpacity>
                         ))}
                    </View>

                    <View style={styles.addRow}>
                         <TextInput style={[styles.input, styles.flexInput]} placeholder="Add custom amenity" value={currentAmenity} onChangeText={setCurrentAmenity} />
                         <TouchableOpacity style={styles.addButton} onPress={() => addAmenity(currentAmenity)}>
                              <Text style={styles.addButtonText}>+</Text>
                         </TouchableOpacity>
                    </View>

                    {formData.amenities && formData.amenities.length > 0 && (
                         <View style={styles.selectedChipContainer}>
                              {formData.amenities.map(amenity => (
                                   <View key={amenity} style={styles.selectedChip}>
                                        <Text style={styles.selectedChipText}>{amenity}</Text>
                                        <TouchableOpacity onPress={() => removeAmenity(amenity)}>
                                             <Text style={styles.removeText}>✕</Text>
                                        </TouchableOpacity>
                                   </View>
                              ))}
                         </View>
                    )}
               </View>

               {/* Images */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Images (URLs)</Text>
                    <View style={styles.addRow}>
                         <TextInput style={[styles.input, styles.flexInput]} placeholder="https://example.com/image.jpg" value={currentImageUrl} onChangeText={setCurrentImageUrl} />
                         <TouchableOpacity style={styles.addButton} onPress={addImage}>
                              <Text style={styles.addButtonText}>+</Text>
                         </TouchableOpacity>
                    </View>

                    {formData.images && formData.images.length > 0 && (
                         <View style={styles.imageGrid}>
                              {formData.images.map((url, idx) => (
                                   <View key={idx} style={styles.imageContainer}>
                                        <Image source={{ uri: url }} style={styles.imagePreview} />
                                        <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(url)}>
                                             <Text style={styles.removeImageText}>✕</Text>
                                        </TouchableOpacity>
                                   </View>
                              ))}
                         </View>
                    )}
               </View>

               {/* Description */}
               <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                         style={[styles.input, styles.textArea]}
                         placeholder="Provide detailed description..."
                         multiline
                         numberOfLines={4}
                         value={formData.description}
                         onChangeText={text => updateField('description', text)}
                    />
               </View>

               {/* Submit Button */}
               <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Listing</Text>
               </TouchableOpacity>
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F3F4F6',
          padding: 16,
     },
     header: {
          marginBottom: 24,
     },
     headerTitle: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 4,
     },
     headerSubtitle: {
          fontSize: 14,
          color: '#6B7280',
     },
     formGroup: {
          marginBottom: 20,
     },
     label: {
          fontSize: 14,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 8,
     },
     input: {
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          padding: 12,
          fontSize: 16,
          color: '#1F2937',
     },
     row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
     },
     halfWidth: {
          width: '48%',
     },
     chipContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
     },
     chip: {
          backgroundColor: '#F3F4F6',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginRight: 8,
          marginBottom: 8,
     },
     chipSelected: {
          backgroundColor: '#3B82F6',
     },
     chipText: {
          fontSize: 14,
          color: '#374151',
          fontWeight: '500',
     },
     chipTextSelected: {
          color: '#FFFFFF',
     },
     switchContainer: {
          marginBottom: 20,
     },
     switchRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
     },
     addRow: {
          flexDirection: 'row',
          gap: 8,
          marginTop: 8,
     },
     flexInput: {
          flex: 1,
     },
     addButton: {
          backgroundColor: '#3B82F6',
          width: 48,
          height: 48,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
     },
     addButtonText: {
          color: '#FFFFFF',
          fontSize: 24,
          fontWeight: 'bold',
     },
     selectedChipContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 12,
     },
     selectedChip: {
          backgroundColor: '#DBEAFE',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          gap: 6,
     },
     selectedChipText: {
          color: '#1E40AF',
          fontSize: 14,
     },
     removeText: {
          color: '#1E40AF',
          fontSize: 16,
          fontWeight: 'bold',
     },
     imageGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 12,
     },
     imageContainer: {
          width: 100,
          height: 100,
          position: 'relative',
     },
     imagePreview: {
          width: '100%',
          height: '100%',
          borderRadius: 8,
     },
     removeImageButton: {
          position: 'absolute',
          top: 4,
          right: 4,
          backgroundColor: '#EF4444',
          width: 24,
          height: 24,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
     },
     removeImageText: {
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 'bold',
     },
     textArea: {
          height: 100,
          textAlignVertical: 'top',
     },
     submitButton: {
          backgroundColor: '#3B82F6',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 32,
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
     },
     submitButtonText: {
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: 'bold',
     },
});

export default ListingScreen;
