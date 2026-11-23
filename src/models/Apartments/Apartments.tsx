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

     const handleBuyPlanAPI = async (data: ApartmentsType, setState: any) => {
          try {
               const {
                    title,
                    type,
                    amenities,
                    area,
                    availability,
                    proof_of_ownership,
                    bathrooms,
                    bedrooms,
                    description,
                    featured,
                    furnished,
                    location,
                    price,
                    balcony,
                    galleryImages,
                    floor,
                    featuredImage,
                    parking,
                    issue_note,
                    video,
               } = data;
               console.log(data);
               if (!title || !type || !area || !availability || !bathrooms || !bedrooms || !description || !furnished || !location || !price) {
                    return ResToast({ title: 'All Fields Required', type: 'warning' });
               }

               const formData = new FormData();

               // Append featured images (multiple)
               galleryImages?.forEach((uri, index) => {
                    if (!uri) return;
                    const imgType = uri.split('.').pop() || 'jpg';
                    formData.append('galleryImages', {
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
               if (featuredImage) {
                    const imgType = featuredImage.split('.').pop() || 'jpg';
                    formData.append('featuredImage', {
                         uri: featuredImage,
                         type: `image/${imgType}`,
                         name: `image.${imgType}`,
                    } as any);
               }

               if (video) {
                    const imgType = video.split('.').pop() || 'mp4';
                    formData.append('video', {
                         uri: video,
                         type: `video/${imgType}`,
                         name: `video.${imgType}`,
                    } as any);
               }

               // Append main proof_of_ownership
               if (proof_of_ownership) {
                    const imgType = proof_of_ownership.split('.').pop() || 'jpg';
                    formData.append('proof_of_ownership', {
                         uri: proof_of_ownership,
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
               formData.append('issue_note', String(issue_note));

               const res = await CreateApartmentAPI({ userId, formData });
               console.log({ res, formData });

               if (!res.error) {
                    setState({
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
                         issue_note: '',
                    });
                    navigation.goBack();
                    return ResToast({ title: 'Apartment Created', type: 'success' });
               } else if ((res.error as any)?.status && typeof (res.error as any).status !== 'string') {
                    return ResToast({ title: (res.error as any).data.message || 'please try again', type: 'warning' });
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
