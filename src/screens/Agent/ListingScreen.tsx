import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, Image, ActivityIndicator } from 'react-native';
import { ApartmentsType } from '../../redux/Apartments/ApartmentType';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { requestCameraPermission } from '../../utils/Permissions/Permissions';
import { useCreateApartmentHandler } from '../../models/Apartments/Apartments';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Navigation from '../../utils/NavigationProps/NavigationProps';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

const ListingScreen = ({ navigation }: { navigation: Navigation }) => {
     const [formData, setFormData] = useState<ApartmentsType>({
          title: '',
          type: 'Rent',
          location: '',
          price: 0,
          area: 0,
          bedrooms: 0,
          bathrooms: 0,
          floor: null,
          furnished: 'Unfurnished',
          balcony: false,
          parking: false,
          amenities: [],
          availability: 'Available',
          images: [],
          featuredImages: '',
          proof_of_ownership: '',
          featured: false,
          description: '',
     });
     const [currentAmenity, setCurrentAmenity] = useState('');

     const apartmentTypes: Array<'Rent' | 'Sale'> = ['Rent', 'Sale'];
     const furnishedOptions: Array<'Furnished' | 'Semi-Furnished' | 'Unfurnished'> = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
     const commonAmenities = ['Gym', 'Pool', 'Elevator', 'Security', 'Playground', 'Garden', 'Backup Generator'];
     const availability: ('Available' | 'Sold' | 'Rented')[] = ['Available', 'Sold', 'Rented'];

     const updateField = <K extends keyof ApartmentsType>(field: K, value: ApartmentsType[K]) => {
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

     // Handle Camera / Gallery picker — single entry point for all 3 image slots
     const handleImagePicker = async (type: 'featuredImages' | 'proof_of_ownership' | 'images') => {
          await requestCameraPermission();
          Alert.alert(
               'Add photo',
               'Choose an option',
               [
                    { text: 'Take photo', onPress: () => openCamera(type) },
                    { text: 'Choose from gallery', onPress: () => openGallery(type) },
                    { text: 'Cancel', style: 'cancel' },
               ],
               { cancelable: true },
          );
     };

     const openCamera = (type: string) => {
          launchCamera({ mediaType: 'photo', cameraType: 'back', quality: 0.8, maxWidth: 1200, maxHeight: 1200 }, response => handleImageResponse({ response, type }));
     };

     const openGallery = (type: string) => {
          launchImageLibrary({ mediaType: 'photo', quality: 0.8, maxWidth: 1200, maxHeight: 1200 }, response => handleImageResponse({ response, type }));
     };

     const handleImageResponse = ({ response, type }: { response?: ImagePickerResponse; type?: string }) => {
          if (response?.didCancel) return;
          if (response?.errorCode) {
               Alert.alert('Error', 'Failed to pick image');
               return;
          }
          const uri = response?.assets?.[0]?.uri;
          if (!uri) return;

          if (type === 'featuredImages') {
               updateField('featuredImages', uri);
          } else if (type === 'proof_of_ownership') {
               updateField('proof_of_ownership', uri);
          } else {
               updateField('images', [...(formData.images || []), uri]);
          }
     };

     const removeFeaturedImage = () => updateField('featuredImages', '');
     const removeProofOfimage = () => updateField('proof_of_ownership', '');
     const removeGalleryImage = (url: string) =>
          updateField(
               'images',
               formData.images?.filter(img => img !== url),
          );

     const { handleBuyPlanAPI, isLoading } = useCreateApartmentHandler();

     const handleSubmit = () => {
          handleBuyPlanAPI(formData, setFormData);
     };

     return (
          <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
               <View style={styles.header}>
                    <View style={styles.headerTopRow}>
                         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                              <Ionicons name="arrow-back" size={22} color="#1F2937" />
                         </TouchableOpacity>
                         <Text style={styles.headerTitle}>Add apartment listing</Text>
                    </View>
                    <Text style={styles.headerSubtitle}>Fill in the property details</Text>
               </View>

               {/* Basic info */}
               <View style={styles.card}>
                    <Text style={styles.cardTitle}>Basic info</Text>

                    <View style={styles.formGroup}>
                         <Text style={styles.label}>Property title *</Text>
                         <TextInput style={styles.input} placeholder="e.g., Luxury 3BR Apartment" value={formData.title} onChangeText={text => updateField('title', text)} />
                    </View>

                    <View style={styles.formGroup}>
                         <Text style={styles.label}>Property type *</Text>
                         <View style={styles.chipContainer}>
                              {apartmentTypes.map(type => (
                                   <TouchableOpacity key={type} style={[styles.chip, formData?.type === type && styles.chipSelected]} onPress={() => updateField('type', type)}>
                                        <Text style={[styles.chipText, formData?.type === type && styles.chipTextSelected]}>{type}</Text>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </View>

                    <View style={styles.formGroup}>
                         <Text style={styles.label}>Location *</Text>
                         <TextInput style={styles.input} placeholder="e.g., Houston, TX" value={formData.location} onChangeText={text => updateField('location', text)} />
                    </View>
               </View>

               {/* Pricing & size */}
               <View style={styles.card}>
                    <Text style={styles.cardTitle}>Pricing & size</Text>

                    <View style={styles.row}>
                         <View style={styles.halfWidth}>
                              <Text style={styles.label}>Price (USD) *</Text>
                              <TextInput
                                   style={styles.input}
                                   placeholder="2500"
                                   keyboardType="numeric"
                                   value={formData.price.toString()}
                                   onChangeText={text => updateField('price', Number(text) || 0)}
                              />
                         </View>
                         <View style={styles.halfWidth}>
                              <Text style={styles.label}>Area (sq ft) *</Text>
                              <TextInput
                                   style={styles.input}
                                   placeholder="1500"
                                   keyboardType="numeric"
                                   value={formData.area.toString()}
                                   onChangeText={text => updateField('area', Number(text) || 0)}
                              />
                         </View>
                    </View>

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

                    <View style={styles.formGroup}>
                         <Text style={styles.label}>Floor</Text>
                         <TextInput
                              style={styles.input}
                              placeholder="e.g., 5"
                              keyboardType="numeric"
                              value={formData.floor?.toString() || ''}
                              // was `Number(text) || undefined` — typing "0" (ground
                              // floor) silently became undefined since 0 is falsy.
                              // Now only an empty field clears it.
                              onChangeText={text => updateField('floor', text === '' ? undefined : Number(text) || 0)}
                         />
                    </View>
               </View>

               {/* Status */}
               <View style={styles.card}>
                    <Text style={styles.cardTitle}>Status</Text>

                    <View style={styles.formGroup}>
                         <Text style={styles.label}>Furnished status</Text>
                         <View style={styles.chipContainer}>
                              {furnishedOptions.map(option => (
                                   <TouchableOpacity key={option} style={[styles.chip, formData.furnished === option && styles.chipSelected]} onPress={() => updateField('furnished', option)}>
                                        <Text style={[styles.chipText, formData.furnished === option && styles.chipTextSelected]}>{option}</Text>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </View>

                    <View style={styles.formGroup}>
                         <Text style={styles.label}>Availability</Text>
                         <View style={styles.chipContainer}>
                              {availability.map(type => (
                                   <TouchableOpacity key={type} style={[styles.chip, formData?.availability === type && styles.chipSelected]} onPress={() => updateField('availability', type)}>
                                        <Text style={[styles.chipText, formData?.availability === type && styles.chipTextSelected]}>{type}</Text>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </View>

                    <View style={styles.switchRow}>
                         <Text style={styles.label}>Has parking</Text>
                         <Switch
                              value={formData.parking}
                              onValueChange={value => updateField('parking', value)}
                              trackColor={{ false: '#E5E7EB', true: `${colors.PrimaryColor}80` }}
                              thumbColor={formData.parking ? colors.PrimaryColor : '#F3F4F6'}
                         />
                    </View>
                    <View style={styles.switchRow}>
                         <Text style={styles.label}>Has balcony</Text>
                         <Switch
                              value={formData.balcony}
                              onValueChange={value => updateField('balcony', value)}
                              trackColor={{ false: '#E5E7EB', true: `${colors.PrimaryColor}80` }}
                              thumbColor={formData.balcony ? colors.PrimaryColor : '#F3F4F6'}
                         />
                    </View>
                    <View style={[styles.switchRow, { marginBottom: 0 }]}>
                         <Text style={styles.label}>Featured listing</Text>
                         <Switch
                              value={formData.featured}
                              onValueChange={value => updateField('featured', value)}
                              trackColor={{ false: '#E5E7EB', true: `${colors.PrimaryColor}80` }}
                              thumbColor={formData.featured ? colors.PrimaryColor : '#F3F4F6'}
                         />
                    </View>
               </View>

               {/* Amenities */}
               <View style={styles.card}>
                    <Text style={styles.cardTitle}>Amenities</Text>
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
                         <TouchableOpacity style={styles.addButton} onPress={() => addAmenity(currentAmenity)} disabled={!currentAmenity.trim()}>
                              <Ionicons name="add" size={22} color="#fff" />
                         </TouchableOpacity>
                    </View>

                    {!!formData.amenities?.length && (
                         <View style={styles.selectedChipContainer}>
                              {formData.amenities.map(amenity => (
                                   <View key={amenity} style={styles.selectedChip}>
                                        <Text style={styles.selectedChipText}>{amenity}</Text>
                                        <TouchableOpacity onPress={() => removeAmenity(amenity)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                             <Ionicons name="close" size={14} color={colors.PrimaryColor} />
                                        </TouchableOpacity>
                                   </View>
                              ))}
                         </View>
                    )}
               </View>

               {/* Media — URL text inputs removed; "+" opens camera/gallery directly */}
               <View style={styles.card}>
                    <Text style={styles.cardTitle}>Photos & documents</Text>

                    <Text style={styles.label}>Featured image</Text>
                    {formData.featuredImages ? (
                         <View style={styles.featuredImageContainer}>
                              <Image source={{ uri: formData.featuredImages }} style={styles.featuredImagePreview} />
                              <TouchableOpacity style={styles.removeImageButton} onPress={removeFeaturedImage}>
                                   <Ionicons name="close" size={14} color="#fff" />
                              </TouchableOpacity>
                         </View>
                    ) : (
                         <TouchableOpacity style={styles.uploadBoxWide} onPress={() => handleImagePicker('featuredImages')}>
                              <View style={styles.uploadIconCircle}>
                                   <Ionicons name="add" size={22} color={colors.PrimaryColor} />
                              </View>
                              <Text style={styles.uploadBoxText}>Add featured image</Text>
                         </TouchableOpacity>
                    )}

                    <Text style={[styles.label, styles.galleryLabel]}>Gallery images</Text>
                    <View style={styles.imageGrid}>
                         {formData.images?.map((url, idx) => (
                              <View key={idx} style={styles.imageContainer}>
                                   <Image source={{ uri: url }} style={styles.imagePreview} />
                                   <TouchableOpacity style={styles.removeImageButton} onPress={() => removeGalleryImage(url)}>
                                        <Ionicons name="close" size={14} color="#fff" />
                                   </TouchableOpacity>
                              </View>
                         ))}
                         <TouchableOpacity style={styles.uploadBoxSquare} onPress={() => handleImagePicker('images')}>
                              <View style={styles.uploadIconCircle}>
                                   <Ionicons name="add" size={22} color={colors.PrimaryColor} />
                              </View>
                         </TouchableOpacity>
                    </View>

                    <Text style={[styles.label, styles.galleryLabel]}>Proof of ownership</Text>
                    {formData.proof_of_ownership ? (
                         <View style={styles.featuredImageContainer}>
                              <Image source={{ uri: formData.proof_of_ownership }} style={styles.featuredImagePreview} />
                              <TouchableOpacity style={styles.removeImageButton} onPress={removeProofOfimage}>
                                   <Ionicons name="close" size={14} color="#fff" />
                              </TouchableOpacity>
                         </View>
                    ) : (
                         <TouchableOpacity style={styles.uploadBoxWide} onPress={() => handleImagePicker('proof_of_ownership')}>
                              <View style={styles.uploadIconCircle}>
                                   <Ionicons name="add" size={22} color={colors.PrimaryColor} />
                              </View>
                              <Text style={styles.uploadBoxText}>Add proof of ownership</Text>
                         </TouchableOpacity>
                    )}
               </View>

               {/* Description */}
               <View style={styles.card}>
                    <Text style={styles.cardTitle}>Description</Text>
                    <TextInput
                         style={[styles.input, styles.textArea]}
                         placeholder="Provide detailed description..."
                         placeholderTextColor="#9CA3AF"
                         multiline
                         numberOfLines={4}
                         value={formData.description}
                         onChangeText={text => updateField('description', text)}
                    />
               </View>

               <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading} activeOpacity={0.85}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit listing</Text>}
               </TouchableOpacity>
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
          padding: 16,
     },
     header: {
          marginBottom: 20,
          marginTop: 8,
     },
     headerTopRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 4,
     },
     backButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E5E7EB',
     },
     headerTitle: {
          fontSize: 22,
          fontFamily: Font.font500,
          color: '#1F2937',
     },
     headerSubtitle: {
          fontSize: 13,
          fontFamily: Font.font400,
          color: '#6B7280',
          marginLeft: 46,
     },
     card: {
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#F0F0F0,',
     },
     cardTitle: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: '#1F2937',
          marginBottom: 14,
     },
     formGroup: {
          marginBottom: 16,
     },
     label: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: '#374151',
          marginBottom: 8,
     },
     input: {
          backgroundColor: '#F9FAFB',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
          fontFamily: Font.font400,
          color: '#1F2937',
     },
     row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
          gap: 12,
     },
     halfWidth: {
          flex: 1,
     },
     chipContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
     },
     chip: {
          backgroundColor: '#F3F4F6',
          paddingHorizontal: 16,
          paddingVertical: 9,
          borderRadius: 20,
     },
     chipSelected: {
          backgroundColor: colors.PrimaryColor,
     },
     chipText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: '#374151',
     },
     chipTextSelected: {
          color: '#FFFFFF',
     },
     switchRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
     },
     addRow: {
          flexDirection: 'row',
          gap: 8,
          marginTop: 10,
     },
     flexInput: {
          flex: 1,
     },
     addButton: {
          backgroundColor: colors.PrimaryColor,
          width: 46,
          height: 46,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
     },
     selectedChipContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 12,
     },
     selectedChip: {
          backgroundColor: '#F0F7FF',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 16,
          gap: 6,
     },
     selectedChipText: {
          color: colors.PrimaryColor,
          fontSize: 13,
          fontFamily: Font.font500,
     },
     imageGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 2,
     },
     galleryLabel: {
          marginTop: 18,
     },
     // Single-image upload slot (Featured image / Proof of ownership)
     uploadBoxWide: {
          height: 110,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#E5E7EB',
          borderStyle: 'dashed',
          backgroundColor: '#F9FAFB',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
     },
     // Gallery grid "+" tile — same square size as thumbnails
     uploadBoxSquare: {
          width: 92,
          height: 92,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#E5E7EB',
          borderStyle: 'dashed',
          backgroundColor: '#F9FAFB',
          alignItems: 'center',
          justifyContent: 'center',
     },
     uploadIconCircle: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#F0F7FF',
          alignItems: 'center',
          justifyContent: 'center',
     },
     uploadBoxText: {
          fontSize: 13,
          fontFamily: Font.font500,
          color: '#6B7280',
     },
     featuredImageContainer: {
          position: 'relative',
          alignSelf: 'flex-start',
     },
     featuredImagePreview: {
          width: 180,
          height: 130,
          borderRadius: 12,
          resizeMode: 'cover',
          backgroundColor: '#F0F0F0',
     },
     imageContainer: {
          width: 92,
          height: 92,
          position: 'relative',
     },
     imagePreview: {
          width: '100%',
          height: '100%',
          borderRadius: 12,
          backgroundColor: '#F0F0F0',
     },
     removeImageButton: {
          position: 'absolute',
          top: 6,
          right: 6,
          backgroundColor: 'rgba(0,0,0,0.6)',
          width: 22,
          height: 22,
          borderRadius: 11,
          justifyContent: 'center',
          alignItems: 'center',
     },
     textArea: {
          height: 100,
          textAlignVertical: 'top',
     },
     submitButton: {
          backgroundColor: colors.PrimaryColor,
          paddingVertical: 16,
          borderRadius: 24,
          alignItems: 'center',
          marginTop: 4,
          marginBottom: 24,
          shadowColor: colors.PrimaryColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 6,
     },
     submitButtonText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontFamily: Font.font500,
     },
});

export default ListingScreen;
