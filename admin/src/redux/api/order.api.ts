import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, MessageResponse, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from "../../types/api-types";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL 
            ? `${import.meta.env.VITE_SERVER_URL}/api/v1/orders`
            : `/api/v1/orders`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['orders'],
    endpoints: (builder) => ({
        newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
            query: (order) => ({
                url: `new`,
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['orders']
        }),
        myOrders: builder.query<AllOrdersResponse, string>({
            query: () => (`my`),
            providesTags: ['orders']
        }),
        allOrders: builder.query<AllOrdersResponse, string>({
            query: () => (`all`),
            providesTags: ['orders']
        }),
        orderDetails: builder.query<OrderDetailsResponse, string>({
            query: (id) => id,
            providesTags: ['orders']
        }),
        deleteOrder: builder.mutation<MessageResponse, string>({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['orders']
        }),
        // FIXED: This was the main issue - wrong endpoint structure
        updateOrderStatus: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ orderId, status }) => ({
                url: `update-status/${orderId}`,  // Fixed: orderId in URL path
                method: 'PUT',
                body: { status }  // Only status in body
            }),
            invalidatesTags: ['orders'],
        }),
        // Add test endpoint for debugging
        testTelegram: builder.query<MessageResponse, void>({
            query: () => 'test-telegram'
        })
    })
});

export const {
    useNewOrderMutation,
    useAllOrdersQuery,
    useMyOrdersQuery,
    useOrderDetailsQuery,
    useDeleteOrderMutation,
    useUpdateOrderStatusMutation,
    useTestTelegramQuery  // Add this for testing
} = orderApi;
