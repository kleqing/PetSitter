export interface ServiceTag {
    serviceTagId: string;
    tagName: string;
}

export interface ServiceReview {
    reviewId: string;
    userId: string;
    serviceId: string;
    rating: number;
    comment: string;
    createdAt: string;
    users: {
        userId: string;
        fullName: string;
        profilePictureUrl: string;
    } | null;
}

export interface Shop {
    shopId: string;
    userId: string;
    shopName: string;
    description: string;
    address: string;
    location: string;
    socialMediaLinks: string | null;
    shopImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    user: any | null; 
    products: any[]; 
    services: any[];
}

export interface Service {
    serviceId: string;
    shopId: string;
    tagId: string;
    serviceName: string;
    pricePerPerson: number;
    description: string;
    serviceImageUrl: string | string[];
    createdAt: string;
    serviceTags: ServiceTag | null;
    serviceReviews: ServiceReview[];
    shop: Shop | null; // Thêm thuộc tính shop
}