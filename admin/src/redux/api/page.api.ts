// admin/src/redux/api/page.api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Page {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

export const pageApi = createApi({
  reducerPath: 'pageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL 
      ? `${import.meta.env.VITE_SERVER_URL}/api/v1/pages`
      : `/api/pages`,
    credentials: 'include',
  }),
  tagTypes: ['Page'],
  endpoints: (builder) => ({
    getAllPages: builder.query<Page[], void>({
      query: () => '/',
      providesTags: ['Page'],
    }),
    
    getPageBySlug: builder.query<Page, string>({
      query: (slug) => `/${slug}`,
      providesTags: ['Page'],
    }),
    
    createPage: builder.mutation<Page, Omit<Page, '_id'>>({
      query: (page) => ({
        url: '/',
        method: 'POST',
        body: page,
      }),
      invalidatesTags: ['Page'],
    }),
    
    updatePage: builder.mutation<Page, { id: string; page: Partial<Page> }>({
      query: ({ id, page }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: page,
      }),
      invalidatesTags: ['Page'],
    }),
    
    deletePage: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Page'],
    }),
  }),
});

export const {
  useGetAllPagesQuery,
  useGetPageBySlugQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pageApi;