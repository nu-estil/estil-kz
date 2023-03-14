export type SuggestionDocument = {
    title: string;
};

export type ProductDocumentBrand = {
    id: number;
    name: string;
};

export type ProductDocumentUser = {
    id: number;
    username: string;
};

export type ProductDocumentSize = {
    id: number;
    title: string;
};

export type ProductDocumentCondition = {
    id: number;
    title: string;
};

export type ProductDocumentCategory = {
    id: number;
    name: string;
    path: string;
};

export type ProductDocumentColor = {
    id: number;
    title: string;
    hex: string;
    code: string;
};

export type ProductDocumentImage = {
    id: number;
    original: string;
    thumbnails: object;
};

export type ProductDocument = {
    id: number;
    slug: string;
    description: string;
    user: ProductDocumentUser;
    brand: ProductDocumentBrand | null;
    categories: ProductDocumentCategory[];
    size: ProductDocumentSize | null;
    condition: ProductDocumentCondition;
    colors: ProductDocumentColor[];
    images: ProductDocumentImage[];
    price: number;
    currency: string;
    isActive: boolean;
    isApproved: boolean;
    isSold: boolean;
    createdAt: string;
    updatedAt: string;
};
