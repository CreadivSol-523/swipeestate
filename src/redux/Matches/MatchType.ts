import { meta } from '../Meta';

export interface GetApartmentsResponse {
     apartments: Apartment[];
     seller: seller;
}

export interface GetMatchsResponse {
     matches: matches[];
     meta: meta;
}

export interface GetSinglePropertyType {
     apartment: {
          _id: string;
          sellerId: string;
          title: string;
          type: 'Rent' | 'Sale';
          location: string;
          price: number;
          area: number;
          bedrooms: number;
          bathrooms: number;
          floor: number;
          furnished: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
          amenities: string[];
          availability: 'Available' | 'Sold' | 'Rented';
          image: string;
          featuredImages: string[];
          description: string;
          createdAt: string;
          updatedAt: string;
          balcony: boolean;
          parking: boolean;
          featured: boolean;
          __v: number;
          matches: matches[];
          buyers: buyer[];
     };
}

export interface matches {
     _id: string;
     propertyId: string;
     matchLikedBy: {
          buyerId: string;
          likedAt: string;
          _id: string;
          buyer: {
               _id: string;
               name: string;
               email: string;
               phone: string;
               address: string;
               selectedIncome: string;
               creditScore: string;
               role: 'Buyer';
               profilePicture: string;
               createdAt: string;
               updatedAt: string;
               customerId: string;
               otp: boolean;
               otpExpire: boolean;
          };
     };
     matchAcceptedBy: {
          seller: {
               _id: string;
               name: string;
               email: string;
               phone: string;
               address: string;
               role: 'Seller';
               profilePicture: string;
               createdAt: string;
               updatedAt: string;
               customerId: string;
          };
          likedAt: string;
          _id: string;
     };
     status: 'Requested' | 'Matched' | 'Rejected';
     createdAt: string;
     updatedAt: string;
     __v: number;
     property: Apartment;
     buyer: buyer;
     seller: seller;
}

export interface seller {
     _id: string;
     name: string;
     email: string;
     phone: string;
     address: string;
     role: 'Seller';
     profilePicture: string;
     createdAt: string;
     updatedAt: string;
     customerId: string;
}

export interface GetBuyerResponse {
     users: buyer[];
}

export interface buyer {
     _id: string;
     name: string;
     email: string;
     phone: string;
     address: string;
     selectedIncome: string;
     creditScore: string;
     role: 'Buyer';
     profilePicture: string;
     createdAt: string;
     updatedAt: string;
     customerId: string;
}

export interface Apartment {
     _id: string;
     sellerId: string;
     title: string;
     type: 'Rent' | 'Sale';
     location: string;
     price: number;
     area: number;
     bedrooms: number;
     bathrooms: number;
     floor: number;
     furnished: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
     amenities: string[];
     availability: 'Available' | 'Sold' | 'Rented';
     image: string;
     featuredImages: string[];
     description: string;
     createdAt: string;
     updatedAt: string;
     balcony: boolean;
     parking: boolean;
     featured: boolean;
     __v: number;
}
