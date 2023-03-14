import { ElasticIndex } from '@depop/elastic';

export const productIndex: ElasticIndex = {
    index: 'products',
    settings: {
        analysis: {
            normalizer: {
                keyword_lowercase: {
                    type: 'custom',
                    char_filter: [],
                    filter: ['lowercase'],
                },
            },
        },
    },
    mappings: {
        properties: {
            user: {
                properties: {
                    id: {
                        type: 'integer',
                    },
                    username: {
                        type: 'keyword',
                        normalizer: 'keyword_lowercase',
                    },
                },
            },
            brand: {
                properties: {
                    id: {
                        type: 'integer',
                    },
                    name: {
                        type: 'text',
                    },
                },
            },
            categories: {
                properties: {
                    id: {
                        type: 'integer',
                    },
                    name: {
                        type: 'keyword',
                        normalizer: 'keyword_lowercase',
                    },
                    path: {
                        type: 'keyword',
                        normalizer: 'keyword_lowercase',
                    },
                },
            },
            size: {
                properties: {
                    id: {
                        type: 'integer',
                    },
                    title: {
                        type: 'keyword',
                        normalizer: 'keyword_lowercase',
                    },
                },
            },
            condition: {
                properties: {
                    id: {
                        type: 'integer',
                    },
                    title: {
                        type: 'keyword',
                        index: false,
                    },
                },
            },
            colors: {
                properties: {
                    id: {
                        type: 'integer',
                    },
                    hex: {
                        type: 'keyword',
                        index: false,
                    },
                    title: {
                        type: 'keyword',
                        normalizer: 'keyword_lowercase',
                    },
                    code: {
                        type: 'keyword',
                        normalizer: 'keyword_lowercase',
                    },
                },
            },
            images: {
                properties: {
                    id: {
                        type: 'integer',
                        index: false,
                    },
                    original: {
                        type: 'keyword',
                        index: false,
                    },
                    thumbnails: {
                        type: 'object',
                        enabled: false,
                    },
                },
            },
            price: {
                type: 'double',
            },
            currency: {
                type: 'keyword',
                index: false,
            },
            isActive: {
                type: 'boolean',
            },
            isApproved: {
                type: 'boolean',
            },
            sold: {
                type: 'boolean',
            },
            slug: {
                type: 'keyword',
                normalizer: 'keyword_lowercase',
            },
            description: {
                type: 'text',
            },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
        },
    },
};
