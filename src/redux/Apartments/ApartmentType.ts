import { meta } from '../Meta';

export interface CreateApartmentsRequest {
     userID: string;
     formData: FormData;
}

export interface GetApartmentResponse {
     apartments: GetApartmentType[];
     meta: meta;
}

export interface GetApartmentType {
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
     balcony: boolean;
     parking: boolean;
     amenities: string[];
     availability: 'Available' | 'Sold' | 'Rented';
     image: string;
     featuredImages: string[];
     featured: boolean;
     description: string;
     createdAt: string;
     updatedAt: string;
     __v: number;
     requestedCount: number;
     matchedCount: number;
     rejectedCount: number;
}

export interface ApartmentsType {
     title: string;
     type: 'Rent' | 'Sale';
     location: string;
     price: number;
     area: number;
     bedrooms: number;
     bathrooms: number;
     floor?: number;
     furnished: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
     balcony?: boolean;
     parking?: boolean;
     amenities: string[];
     availability: 'Available' | 'Sold' | 'Rented';
     images?: string[];
     featuredImages?: string;
     featured: boolean;
     description: string;
}
