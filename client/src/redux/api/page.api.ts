// client/src/redux/api/page.api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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
    getPageBySlug: builder.query<Page, string>({
      query: (slug) => `/${slug}`,
      providesTags: ['Page'],
    }),
  }),
});

export const {
  useGetPageBySlugQuery,
} = pageApi;