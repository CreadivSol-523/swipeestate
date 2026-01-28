import { useDispatch } from 'react-redux';
import { useCreateApartmentMutation, useGetApartmentQuery } from '../../redux/Apartments/ApartmentSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ApartmentsType } from '../../redux/Apartments/ApartmentType';
import { useAuth } from '../../utils/Storage/Storage';
import ResToast from '../../components/ResToast/ResToast';

// Create Apartment
export const useCreateApartmentHandler = () => {
     const [CreateApartmentAPI, { isLoading }] = useCreateApartmentMutation();

     const dispatch = useDispatch();

     type RootStackParamList = {
          Home: undefined;
     };
     const { userData } = useAuth();
     const userId = userData?._id;

     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

     const handleBuyPlanAPI = async (data: ApartmentsType) => {
          try {
               const { title, type, amenities, area, availability, bathrooms, bedrooms, description, featured, furnished, location, price, balcony, featuredImages, floor, images, parking } = data;

               if (!title || !type || !area || !availability || !bathrooms || !bedrooms || !description || !featured || !furnished || !location || !price || !balcony) {
                    return ResToast({ title: 'All Fields Required', type: 'warning' });
               }

               const formData = new FormData();

               // Append featured images (multiple)
               images?.forEach((uri, index) => {
                    if (!uri) return;
                    const imgType = uri.split('.').pop() || 'jpg';
                    formData.append('featuredImages', {
                         uri,
                         type: `image/${imgType}`,
                         name: `featuredImages_${index}.${imgType}`,
                    } as any);
               });

               // Append amenities (just text)
               amenities?.forEach((amenity, index) => {
                    formData.append('amenities', String(amenity));
               });

               // Append main featured image
               if (featuredImages) {
                    const imgType = featuredImages.split('.').pop() || 'jpg';
                    formData.append('image', {
                         uri: featuredImages,
                         type: `image/${imgType}`,
                         name: `image.${imgType}`,
                    } as any);
               }

               // Append all text fields
               formData.append('title', String(title));
               formData.append('type', String(type));
               formData.append('location', String(location));
               formData.append('price', String(price));
               formData.append('area', String(area));
               formData.append('bedrooms', String(bedrooms));
               formData.append('bathrooms', String(bathrooms));
               formData.append('floor', String(floor));
               formData.append('furnished', String(furnished));
               formData.append('balcony', String(balcony));
               formData.append('parking', String(parking));
               formData.append('availability', String(availability));
               formData.append('featured', String(featured));
               formData.append('description', String(description));

               const res = await CreateApartmentAPI({ userId, formData });

               if (!res.error) {
                    return ResToast({ title: 'Apartment Created', type: 'success' });
               } else {
                    return ResToast({ title: 'please try again', type: 'warning' });
               }
          } catch (error) {
               console.error('Apartment creation failed:', error);
               throw error;
          }
     };

     return { handleBuyPlanAPI, isLoading };
};

// Get Listing
export const useGetApartmentListingHandler = ({ limit = 4, page = 1 }: { limit?: number; page?: number }) => {
     const { userData } = useAuth();
     const userId = userData?._id;
     const GetApartments = useGetApartmentQuery({ userId, limit, page });
     const GetApartmentData = GetApartments?.data?.apartments;
     const { isError, isFetching, isLoading, refetch } = GetApartments;

     return { GetApartments, GetApartmentData, isError, refetch, isFetching, isLoading };
};
