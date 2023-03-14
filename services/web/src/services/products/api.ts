import { config } from '@/config'
import {
  ProductCategory,
  ProductColor,
  ProductCondition,
  ProductImage,
  ProductPreview,
  ProductSizeGroup
} from '@/modules/products/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import omit from 'lodash/omit'
import { HYDRATE } from 'next-redux-wrapper'
import { baseQueryWithReauth } from '..'
import {
  CreateProductRequest,
  CreateProductResponse,
  GetBrandsResponse,
  GetProductResponse,
  GetProductSearchSuggestionsResponse,
  GetProductsRequest,
  GetProductsResponse,
  GetShopProductsRequest,
  UpdateProductRequest
} from './types'

export const PRODUCT_API_REDUCER_KEY = 'productApi'

const productApi = createApi({
  reducerPath: PRODUCT_API_REDUCER_KEY,
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  tagTypes: ['Products', 'Suggestions', 'ShopProducts', 'LikedProducts'],
  endpoints: builder => ({
    create: builder.mutation<CreateProductResponse, CreateProductRequest>({
      query: product => ({
        url: 'products/',
        method: 'POST',
        body: product
      }),
      invalidatesTags: () => [{ type: 'ShopProducts' }]
    }),
    update: builder.mutation<null, UpdateProductRequest>({
      query: product => ({
        url: `products/${product.id}`,
        method: 'PUT',
        body: product
      }),
      invalidatesTags: (res, _, { id }) => [{ type: 'ShopProducts', id }]
    }),
    delete: builder.mutation<null, number>({
      query: id => ({
        url: `products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (res, _, id) => [{ type: 'ShopProducts', id }]
    }),
    getProducts: builder.query<GetProductsResponse, GetProductsRequest>({
      query: filter => ({
        url: `${config.api.products.baseUrl}`,
        method: 'GET',
        params: {
          ...omit(filter, 'categories', 'conditions', 'brands', 'sizes'),
          categories: filter.categories
            ? `[${filter.categories?.join(', ')}]`
            : '[]',
          conditions: filter.conditions
            ? `[${filter.conditions?.join(', ')}]`
            : '[]',
          colors: filter.colors ? `[${filter.colors?.join(', ')}]` : '[]',
          brands: filter.brands ? `[${filter.brands?.join(', ')}]` : '[]',
          sizes: filter.sizes ? `[${filter.sizes?.join(', ')}]` : '[]'
        }
      }),
      providesTags: ['Products']
    }),
    getShopProducts: builder.query<GetProductsResponse, GetShopProductsRequest>(
      {
        query: ({ userId, ...params }) => ({
          url: `products/${userId}/shop`,
          method: 'GET',
          params
        }),
        providesTags: data =>
          data?.products
            ? data.products.map(p => ({ type: 'ShopProducts', id: p.id }))
            : [{ type: 'ShopProducts' }]
      }
    ),
    getProduct: builder.query<GetProductResponse, string>({
      query: slug => ({
        url: `products/${slug}`,
        method: 'GET'
      })
    }),
    categories: builder.query<ProductCategory[], null>({
      query: () => ({
        url: 'products/categories',
        method: 'GET'
      })
    }),
    sizeGroups: builder.query<Record<string, ProductSizeGroup>, null>({
      query: () => ({
        url: 'products/attributes/size-groups',
        method: 'GET'
      })
    }),
    colors: builder.query<ProductColor[], null>({
      query: () => ({
        url: 'products/attributes/colors',
        method: 'GET'
      })
    }),
    brands: builder.query<GetBrandsResponse, null>({
      query: () => ({
        url: 'products/brands',
        method: 'GET'
      })
    }),
    conditions: builder.query<ProductCondition[], null>({
      query: () => ({
        url: 'products/conditions',
        method: 'GET'
      })
    }),
    getFavorite: builder.query<ProductPreview[], null>({
      query: () => ({
        url: 'products/liked',
        method: 'GET'
      }),
      providesTags: products =>
        products
          ? products.map(p => ({ type: 'LikedProducts' }))
          : [{ type: 'LikedProducts' }]
    }),
    getSearchSuggestions: builder.query<
      GetProductSearchSuggestionsResponse,
      string
    >({
      query: search => ({
        url: `${config.api.products.baseUrl}suggestions`,
        method: 'GET',
        params: { search }
      }),
      providesTags: ['Suggestions']
    }),
    saveImage: builder.mutation<ProductImage, File>({
      query: file => {
        const body = new FormData()
        body.append('image', file)
        return {
          url: 'image/save-image',
          method: 'POST',
          body
        }
      }
    }),
    toggleLike: builder.mutation<{}, GetProductResponse>({
      query: ({ id }) => ({
        url: 'products/likes/toggle',
        method: 'POST',
        body: {
          productId: id
        }
      }),
      invalidatesTags: (_, base, { id }) => [{ type: 'LikedProducts' }],
      async onQueryStarted({ slug }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApi.util.updateQueryData('getProduct', slug, product => {
            if (product.isLiked) {
              product.likes -= 1
            } else {
              product.likes += 1
            }
            product.isLiked = !product.isLiked
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()

          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      }
    })
  })
})

export default productApi
