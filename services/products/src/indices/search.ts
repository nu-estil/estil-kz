import { ElasticIndex } from '@depop/elastic';

export const searchIndex: ElasticIndex = {
    index: 'search',
    settings: {
        analysis: {
            analyzer: {
                autocomplete: {
                    type: 'custom',
                    tokenizer: 'autocomplete',
                    filter: ['lowercase'],
                },
                autocomplete_search: {
                    type: 'custom',
                    tokenizer: 'lowercase',
                },
            },
            tokenizer: {
                autocomplete: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 20,
                    token_chars: ['letter', 'digit'],
                },
            },
        },
    },
    mappings: {
        properties: {
            title: {
                type: 'text',
                analyzer: 'autocomplete',
                search_analyzer: 'autocomplete_search',
            },
        },
    },
};
