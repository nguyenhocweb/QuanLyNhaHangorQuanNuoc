export interface CloudinarySignatureResponse {
    signature: string;
    timestamp: number;
    folder: string;
    transformation: string;
    public_id: string;
    apiKey: string;
    cloudName: string;
}

export interface CreateBrandRequest {
    name: string;
    tax_code: string;
    email_contact: string;
    phone_contact: string;
    link?: string | null;
    address: string;
    brand_owner_id: string;
    is_featured: boolean;
}

export interface CreateBrandResponse {
    id: string;
    cloudinary: {
        logo: CloudinarySignatureResponse;
        imageMain: CloudinarySignatureResponse;
    };
}

export interface UpdateBrandImageRequest {
    logo?: string | null;
    imageMain?: string | null;
    images?: string[];
}

