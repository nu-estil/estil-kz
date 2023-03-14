export type ProductDocument = {
    id: number;
    slug: string;
    description: string;
    brand: {
        id: number;
        name: string;
    } | null;
    categories: {
        id: number;
        name: string;
        path: string;
    }[];
    size: {
        id: number;
        title: string;
    } | null;
    condition: {
        id: number;
        title: string;
    };
    colors: {
        id: number;
        hex: string;
        code: string;
        title: string;
    }[];
    images: {
        id: number;
        original: string;
        thumbnails: object;
    }[];
    price: number;
    currency: string;
    isActive: boolean;
    isApproved: boolean;
    sold: boolean;
    createdAt: string;
    updatedAt: string;
};
