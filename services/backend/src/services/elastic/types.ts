import { TThumbnails } from '../../types';

export type ElasticProductDocument = {
    id: number;
    slug: string;
    description: string;
    brand: {
        id: number;
        name: string;
    };
    categories: {
        id: number;
        name: string;
        path: string;
    }[];
    size: {
        id: number;
        title: string;
    };
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
        thumbnails: TThumbnails;
    }[];
    price: number;
    currency: string;
    isActive: boolean;
    isApproved: boolean;
    sold: boolean;
    createdAt: string;
    updatedAt: string;
};
