import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/user.api";
import { productApi } from "./api/product.api";
import { orderApi } from "./api/order.api";
import userReducer from "./reducers/user.reducer";
import cartReducer from "./reducers/cart.reducer";
import { couponApi } from "./api/coupon.api";
import { statsApi } from "./api/stats.api";
import { categoryApi } from './api/category.api';
import { brandApi } from "./api/brand.api";
import subcategoryApi from "./api/subcategory.api";
import { pageApi } from './api/page.api';
import { settingsApi } from './api/settings.api';
import { currencyApi } from "./api/currency.api";
import { shippingTierApi } from "./api/shippingTier.api";
import { bannerApi } from "./api/banner.api";
const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [brandApi.reducerPath]: brandApi.reducer ,
        [subcategoryApi.reducerPath]: subcategoryApi.reducer ,
        [pageApi.reducerPath]: pageApi.reducer,
        [settingsApi.reducerPath]: settingsApi.reducer,
        [currencyApi.reducerPath]: currencyApi.reducer,
        [shippingTierApi.reducerPath]: shippingTierApi.reducer,
                [bannerApi.reducerPath]: bannerApi.reducer,





    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            productApi.middleware,
            orderApi.middleware,
            couponApi.middleware,
            statsApi.middleware,
            categoryApi.middleware,
            brandApi.middleware , 
            subcategoryApi.middleware,
            pageApi.middleware,
            settingsApi.middleware,
            currencyApi.middleware,
            shippingTierApi.middleware,
            bannerApi.middleware,

        )
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
