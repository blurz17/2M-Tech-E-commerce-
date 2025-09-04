
```
2M-main
├─ admin
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  └─ SubcategoryManagement.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  └─ FeaturedProduct.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
└─ server
   ├─ .env
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ analytics.controller.ts
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  └─ SubcategoryManagement.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  └─ FeaturedProduct.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ CheckoutForm.tsx
│  │  │  ├─ Collections.tsx
│  │  │  ├─ collection_files
│  │  │  │  ├─ CategoryGrid.tsx
│  │  │  │  ├─ CollectionsStyles.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ header
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  │  ├─ LocationSection.tsx
│  │  │  │  │  │  ├─ Logo.tsx
│  │  │  │  │  │  ├─ MobileUserButton.tsx
│  │  │  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  │  │  ├─ SearchButton.tsx
│  │  │  │  │  │  ├─ Sidebar.tsx
│  │  │  │  │  │  └─ SocialMediaSection.tsx
│  │  │  │  │  ├─ constants.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useHeaderScroll.ts
│  │  │  │  │  │  ├─ useProfileMenu.ts
│  │  │  │  │  │  └─ useSidebar.ts
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  └─ SkeletonLoader.tsx
│  │  │  ├─ DebugConnection.tsx
│  │  │  ├─ FeaturedSection.css
│  │  │  ├─ FeaturedSection.tsx
│  │  │  ├─ layout
│  │  │  │  └─ Layout.tsx
│  │  │  ├─ PopularProduct.tsx
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ ProductCategories.tsx
│  │  │  ├─ routes
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ PublicRoute.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchResults.tsx
│  │  │  └─ WhatsAppButton.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ About.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  ├─ CartPage.tsx
│  │  │  ├─ CategoryPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyOrders.tsx
│  │  │  ├─ NotFound.tsx
│  │  │  ├─ OrderDetails.tsx
│  │  │  ├─ ProductDetails.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ SearchPage.tsx
│  │  │  └─ Shipping.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client-next
├─ README.md
└─ server
   ├─ .env
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ analytics.controller.ts
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  └─ SubcategoryManagement.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  └─ FeaturedProduct.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ CheckoutForm.tsx
│  │  │  ├─ Collections.tsx
│  │  │  ├─ collection_files
│  │  │  │  ├─ CategoryGrid.tsx
│  │  │  │  ├─ CollectionsStyles.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ header
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  │  ├─ LocationSection.tsx
│  │  │  │  │  │  ├─ Logo.tsx
│  │  │  │  │  │  ├─ MobileUserButton.tsx
│  │  │  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  │  │  ├─ SearchButton.tsx
│  │  │  │  │  │  ├─ Sidebar.tsx
│  │  │  │  │  │  └─ SocialMediaSection.tsx
│  │  │  │  │  ├─ constants.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useHeaderScroll.ts
│  │  │  │  │  │  ├─ useProfileMenu.ts
│  │  │  │  │  │  └─ useSidebar.ts
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  └─ SkeletonLoader.tsx
│  │  │  ├─ DebugConnection.tsx
│  │  │  ├─ FeaturedSection.css
│  │  │  ├─ FeaturedSection.tsx
│  │  │  ├─ layout
│  │  │  │  └─ Layout.tsx
│  │  │  ├─ PopularProduct.tsx
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ ProductCategories.tsx
│  │  │  ├─ routes
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ PublicRoute.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchResults.tsx
│  │  │  └─ WhatsAppButton.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ About.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  ├─ CartPage.tsx
│  │  │  ├─ CategoryPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyOrders.tsx
│  │  │  ├─ NotFound.tsx
│  │  │  ├─ OrderDetails.tsx
│  │  │  ├─ ProductDetails.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ SearchPage.tsx
│  │  │  └─ Shipping.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client-next
├─ README.md
└─ server
   ├─ .env
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ analytics.controller.ts
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  └─ SubcategoryManagement.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  └─ FeaturedProduct.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
└─ server
   ├─ .env
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ analytics.controller.ts
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ CurrencyManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  ├─ SubcategoryManagement.tsx
│  │  │  │  └─ whswhsb.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ currency_countries.ts
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  └─ FeaturedProduct.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ currency.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client
│  ├─ .env
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ CheckoutForm.tsx
│  │  │  ├─ Collections.tsx
│  │  │  ├─ collection_files
│  │  │  │  ├─ CategoryGrid.tsx
│  │  │  │  ├─ CollectionsStyles.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ filesRelatedProductDetails.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ header
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  │  ├─ LocationSection.tsx
│  │  │  │  │  │  ├─ Logo.tsx
│  │  │  │  │  │  ├─ MobileUserButton.tsx
│  │  │  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  │  │  ├─ SearchButton.tsx
│  │  │  │  │  │  ├─ Sidebar.tsx
│  │  │  │  │  │  └─ SocialMediaSection.tsx
│  │  │  │  │  ├─ constants.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useHeaderScroll.ts
│  │  │  │  │  │  ├─ useProfileMenu.ts
│  │  │  │  │  │  └─ useSidebar.ts
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SafeHtmlRenderer.tsx
│  │  │  │  └─ SkeletonLoader.tsx
│  │  │  ├─ DebugConnection.tsx
│  │  │  ├─ FeaturedSection.css
│  │  │  ├─ FeaturedSection.tsx
│  │  │  ├─ layout
│  │  │  │  └─ Layout.tsx
│  │  │  ├─ PopularProduct.tsx
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ ProductCategories.tsx
│  │  │  ├─ routes
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ PublicRoute.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchResults.tsx
│  │  │  └─ WhatsAppButton.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ About.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  ├─ CartPage.tsx
│  │  │  ├─ CategoryPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyOrders.tsx
│  │  │  ├─ NotFound.tsx
│  │  │  ├─ OrderDetails.tsx
│  │  │  ├─ ProductDetails.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ SearchPage.tsx
│  │  │  └─ Shipping.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
└─ server
   ├─ .env
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ analytics.controller.ts
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ currency.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ currency.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ currency.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     ├─ helper.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ CurrencyManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  ├─ SubcategoryManagement.tsx
│  │  │  │  └─ whswhsb.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ currency_countries.ts
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  └─ FeaturedProduct.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ currency.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ CheckoutForm.tsx
│  │  │  ├─ Collections.tsx
│  │  │  ├─ collection_files
│  │  │  │  ├─ CategoryGrid.tsx
│  │  │  │  ├─ CollectionsStyles.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ filesRelatedProductDetails.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ header
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  │  ├─ Logo.tsx
│  │  │  │  │  │  ├─ MobileUserButton.tsx
│  │  │  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  │  │  ├─ SearchButton.tsx
│  │  │  │  │  │  ├─ Sidebar.tsx
│  │  │  │  │  │  └─ SocialMediaSection.tsx
│  │  │  │  │  ├─ constants.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useHeaderScroll.ts
│  │  │  │  │  │  ├─ useProfileMenu.ts
│  │  │  │  │  │  └─ useSidebar.ts
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SafeHtmlRenderer.tsx
│  │  │  │  └─ SkeletonLoader.tsx
│  │  │  ├─ DebugConnection.tsx
│  │  │  ├─ FeaturedSection.css
│  │  │  ├─ FeaturedSection.tsx
│  │  │  ├─ filters
│  │  │  │  ├─ GearPriceControl.tsx
│  │  │  │  ├─ MobileFilterDrawer.tsx
│  │  │  │  ├─ ProductFilters.tsx
│  │  │  │  └─ useProductFilters.ts
│  │  │  ├─ layout
│  │  │  │  └─ Layout.tsx
│  │  │  ├─ PopularProduct.tsx
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ ProductCategories.tsx
│  │  │  ├─ routes
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ PublicRoute.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchResults.tsx
│  │  │  └─ WhatsAppButton.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ About.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  ├─ CartPage.tsx
│  │  │  ├─ CategoryPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyOrders.tsx
│  │  │  ├─ NotFound.tsx
│  │  │  ├─ OrderDetails.tsx
│  │  │  ├─ ProductDetails.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ SearchPage.tsx
│  │  │  └─ Shipping.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
└─ server
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ currency.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ currency.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ currency.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     ├─ helper.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ CurrencyManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  ├─ PageManagement.tsx
│  │  │  │  ├─ SubcategoryManagement.tsx
│  │  │  │  └─ whswhsb.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ currency_countries.ts
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  └─ FeaturedProduct.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ currency.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ page.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ CheckoutForm.tsx
│  │  │  ├─ Collections.tsx
│  │  │  ├─ collection_files
│  │  │  │  ├─ CategoryGrid.tsx
│  │  │  │  ├─ CollectionsStyles.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ filesRelatedProductDetails.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ header
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  │  ├─ Logo.tsx
│  │  │  │  │  │  ├─ MobileUserButton.tsx
│  │  │  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  │  │  ├─ SearchButton.tsx
│  │  │  │  │  │  ├─ Sidebar.tsx
│  │  │  │  │  │  └─ SocialMediaSection.tsx
│  │  │  │  │  ├─ constants.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useHeaderScroll.ts
│  │  │  │  │  │  ├─ useProfileMenu.ts
│  │  │  │  │  │  └─ useSidebar.ts
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SafeHtmlRenderer.tsx
│  │  │  │  └─ SkeletonLoader.tsx
│  │  │  ├─ DebugConnection.tsx
│  │  │  ├─ FeaturedSection.css
│  │  │  ├─ FeaturedSection.tsx
│  │  │  ├─ filters
│  │  │  │  ├─ GearPriceControl.tsx
│  │  │  │  ├─ MobileFilterDrawer.tsx
│  │  │  │  ├─ ProductFilters.tsx
│  │  │  │  └─ useProductFilters.ts
│  │  │  ├─ layout
│  │  │  │  └─ Layout.tsx
│  │  │  ├─ PopularProduct.tsx
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ ProductCategories.tsx
│  │  │  ├─ routes
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ PublicRoute.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchResults.tsx
│  │  │  └─ WhatsAppButton.tsx
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ About.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  ├─ CartPage.tsx
│  │  │  ├─ CategoryPage.tsx
│  │  │  ├─ DynamicPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyOrders.tsx
│  │  │  ├─ NotFound.tsx
│  │  │  ├─ OrderDetails.tsx
│  │  │  ├─ ProductDetails.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ SearchPage.tsx
│  │  │  └─ Shipping.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ page.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
└─ server
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ currency.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ page.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ currency.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ page.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ currency.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ page.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     ├─ helper.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ CurrencyManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  ├─ PageManagement.tsx
│  │  │  │  ├─ SubcategoryManagement.tsx
│  │  │  │  └─ whswhsb.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ currency_countries.ts
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ constants
│  │  │  └─ index.ts
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  ├─ useAuth.ts
│  │  │  └─ useConstants.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSettings.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  ├─ FeaturedProduct.tsx
│  │  │  │  └─ ShippingSettings.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ currency.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ page.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ settings.api.ts
│  │  │  │  ├─ shippingTier.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ CheckoutForm.tsx
│  │  │  ├─ Collections.tsx
│  │  │  ├─ collection_files
│  │  │  │  ├─ CategoryGrid.tsx
│  │  │  │  ├─ CollectionsStyles.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ filesRelatedProductDetails.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ header
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  │  ├─ Logo.tsx
│  │  │  │  │  │  ├─ MobileUserButton.tsx
│  │  │  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  │  │  ├─ SearchButton.tsx
│  │  │  │  │  │  ├─ Sidebar.tsx
│  │  │  │  │  │  └─ SocialMediaSection.tsx
│  │  │  │  │  ├─ constants.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useHeaderScroll.ts
│  │  │  │  │  │  ├─ useProfileMenu.ts
│  │  │  │  │  │  └─ useSidebar.ts
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SafeHtmlRenderer.tsx
│  │  │  │  └─ SkeletonLoader.tsx
│  │  │  ├─ DebugConnection.tsx
│  │  │  ├─ FeaturedSection.css
│  │  │  ├─ FeaturedSection.tsx
│  │  │  ├─ filters
│  │  │  │  ├─ GearPriceControl.tsx
│  │  │  │  ├─ MobileFilterDrawer.tsx
│  │  │  │  ├─ ProductFilters.tsx
│  │  │  │  └─ useProductFilters.ts
│  │  │  ├─ layout
│  │  │  │  └─ Layout.tsx
│  │  │  ├─ PopularProduct.tsx
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ ProductCategories.tsx
│  │  │  ├─ routes
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ PublicRoute.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchResults.tsx
│  │  │  └─ WhatsAppButton.tsx
│  │  ├─ constants
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useConstants.ts
│  │  │  └─ useMetadata.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ About.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  ├─ CartPage.tsx
│  │  │  ├─ CategoryPage.tsx
│  │  │  ├─ DynamicPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyOrders.tsx
│  │  │  ├─ NotFound.tsx
│  │  │  ├─ OrderDetails.tsx
│  │  │  ├─ ProductDetails.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ SearchPage.tsx
│  │  │  └─ Shipping.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ currency.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ page.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ settings.api.ts
│  │  │  │  ├─ shippingTier.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
└─ server
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ auth.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ currency.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ page.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ settings.controller.ts
   │  │  ├─ shippingTier.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ currency.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ page.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ settings.model.ts
   │  │  ├─ shippingTier.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ currency.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ page.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ settings.routes.ts
   │  │  ├─ shippingTier.routes.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     ├─ helper.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```
```
2M-main
├─ admin
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ logo.svg
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AddFeaturedProducts.tsx
│  │  │  │  ├─ AddProduct
│  │  │  │  │  ├─ AddProduct.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ form-sections
│  │  │  │  │  │  │  ├─ BasicInformation.tsx
│  │  │  │  │  │  │  ├─ ImageUpload.tsx
│  │  │  │  │  │  │  └─ ProductDetails.tsx
│  │  │  │  │  │  ├─ MainPhotoDisplay.tsx
│  │  │  │  │  │  ├─ PhotoGallery.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductHeader.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useProductForm.ts
│  │  │  │  │  │  └─ useProductImages.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ BannerManagement.tsx
│  │  │  │  ├─ BrandManagement.tsx
│  │  │  │  ├─ CategoryManagement.tsx
│  │  │  │  ├─ CurrencyManagement.tsx
│  │  │  │  ├─ ManageProduct.tsx
│  │  │  │  ├─ PageManagement.tsx
│  │  │  │  ├─ SubcategoryManagement.tsx
│  │  │  │  └─ whswhsb.tsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ currency_countries.ts
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SkeletonLoader.tsx
│  │  │  │  └─ WysiwygEditor
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ WysiwygEditor.css
│  │  │  │     └─ WysiwygEditor.tsx
│  │  │  └─ routes
│  │  │     └─ AdminRoute.tsx
│  │  ├─ constants
│  │  │  └─ index.ts
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  ├─ useAuth.ts
│  │  │  └─ useConstants.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminCustomers.tsx
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLayout.tsx
│  │  │  │  ├─ AdminOrders.tsx
│  │  │  │  ├─ AdminProducts.tsx
│  │  │  │  ├─ AdminSettings.tsx
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ AdminTransactions.tsx
│  │  │  │  ├─ AdmiOrderDetails.tsx
│  │  │  │  ├─ Coupons.tsx
│  │  │  │  ├─ FeaturedProduct.tsx
│  │  │  │  └─ ShippingSettings.tsx
│  │  │  ├─ AuthPage.tsx
│  │  │  └─ NotFound.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ banner.api.ts
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ currency.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ page.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ settings.api.ts
│  │  │  │  ├─ shippingTier.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ client
│  ├─ .eslintrc.cjs
│  ├─ index.html
│  ├─ next-env.d.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ a.png
│  │  ├─ Accesories.png
│  │  ├─ android-chrome-192x192.png
│  │  ├─ android-chrome-512x512.png
│  │  ├─ apple-touch-icon.png
│  │  ├─ banner.svg
│  │  ├─ cabel-min - Copy.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon.ico
│  │  ├─ harddisk-min.png
│  │  ├─ keyboard.png
│  │  ├─ laptop.png
│  │  ├─ mouse.png
│  │  ├─ site.webmanifest
│  │  ├─ Speaker.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ 2672252.jpg
│  │  │  ├─ canon - Copy.png
│  │  │  ├─ canon.png
│  │  │  ├─ ecommerce-animation.json
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Signup.tsx
│  │  │  ├─ BannerSection.tsx
│  │  │  ├─ CheckoutForm.tsx
│  │  │  ├─ Collections.tsx
│  │  │  ├─ collection_files
│  │  │  │  ├─ CategoryGrid.tsx
│  │  │  │  ├─ CollectionsStyles.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ BackBtn.tsx
│  │  │  │  ├─ Banner.tsx
│  │  │  │  ├─ filesRelatedProductDetails.tsx
│  │  │  │  ├─ FilterOptions.tsx
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ header
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  │  ├─ Logo.tsx
│  │  │  │  │  │  ├─ MobileUserButton.tsx
│  │  │  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  │  │  ├─ SearchButton.tsx
│  │  │  │  │  │  ├─ Sidebar.tsx
│  │  │  │  │  │  └─ SocialMediaSection.tsx
│  │  │  │  │  ├─ constants.ts
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useHeaderScroll.ts
│  │  │  │  │  │  ├─ useProfileMenu.ts
│  │  │  │  │  │  └─ useSidebar.ts
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ Loader.tsx
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  ├─ SafeHtmlRenderer.tsx
│  │  │  │  └─ SkeletonLoader.tsx
│  │  │  ├─ DebugConnection.tsx
│  │  │  ├─ FeaturedSection.css
│  │  │  ├─ FeaturedSection.tsx
│  │  │  ├─ filters
│  │  │  │  ├─ GearPriceControl.tsx
│  │  │  │  ├─ MobileFilterDrawer.tsx
│  │  │  │  ├─ ProductFilters.tsx
│  │  │  │  └─ useProductFilters.ts
│  │  │  ├─ layout
│  │  │  │  └─ Layout.tsx
│  │  │  ├─ PopularProduct.tsx
│  │  │  ├─ ProductCard.tsx
│  │  │  ├─ ProductCategories.tsx
│  │  │  ├─ RelatedProducts.tsx
│  │  │  ├─ routes
│  │  │  │  ├─ AdminRoute.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ PublicRoute.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchResults.tsx
│  │  │  └─ WhatsAppButton.tsx
│  │  ├─ constants
│  │  ├─ firebaseConfig.ts
│  │  ├─ hooks
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useConstants.ts
│  │  │  └─ useMetadata.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ AuthPage.tsx
│  │  │  ├─ BannerPage.tsx
│  │  │  ├─ CartPage.tsx
│  │  │  ├─ CategoryPage.tsx
│  │  │  ├─ DynamicPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyOrders.tsx
│  │  │  ├─ NotFound.tsx
│  │  │  ├─ OrderDetails.tsx
│  │  │  ├─ ProductDetails.tsx
│  │  │  ├─ ProductsPage.tsx
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ SearchPage.tsx
│  │  │  └─ Shipping.tsx
│  │  ├─ redux
│  │  │  ├─ api
│  │  │  │  ├─ banner.api.ts
│  │  │  │  ├─ brand.api.ts
│  │  │  │  ├─ category.api.ts
│  │  │  │  ├─ coupon.api.ts
│  │  │  │  ├─ currency.api.ts
│  │  │  │  ├─ order.api.ts
│  │  │  │  ├─ page.api.ts
│  │  │  │  ├─ payment.api.ts
│  │  │  │  ├─ product.api.ts
│  │  │  │  ├─ settings.api.ts
│  │  │  │  ├─ shippingTier.api.ts
│  │  │  │  ├─ stats.api.ts
│  │  │  │  ├─ subcategory.api.ts
│  │  │  │  └─ user.api.ts
│  │  │  ├─ reducers
│  │  │  │  ├─ cart.reducer.ts
│  │  │  │  └─ user.reducer.ts
│  │  │  └─ store.ts
│  │  ├─ types
│  │  │  ├─ api-types.ts
│  │  │  └─ index.ts
│  │  ├─ utils
│  │  │  └─ util.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
└─ server
   ├─ check-db.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ config
   │  │  ├─ cloudinary.config.ts
   │  │  ├─ db.config.ts
   │  │  ├─ firebase.config.ts
   │  │  └─ stripe.config.ts
   │  ├─ controllers
   │  │  ├─ auth.controller.ts
   │  │  ├─ banner.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ category.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ currency.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ page.controller.ts
   │  │  ├─ payment.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ settings.controller.ts
   │  │  ├─ shippingTier.controller.ts
   │  │  ├─ stats.controller.ts
   │  │  ├─ subcategory.controller.ts
   │  │  ├─ telegram.controller.ts
   │  │  └─ telegram.debug.ts
   │  ├─ index.ts
   │  ├─ middleware
   │  │  ├─ auth.middleware.ts
   │  │  └─ upload.middleware.ts
   │  ├─ models
   │  │  ├─ banner.model.ts
   │  │  ├─ brand.model.ts
   │  │  ├─ category.model.ts
   │  │  ├─ coupon.model.ts
   │  │  ├─ currency.model.ts
   │  │  ├─ order.model.ts
   │  │  ├─ page.model.ts
   │  │  ├─ product.model.ts
   │  │  ├─ settings.model.ts
   │  │  ├─ shippingTier.model.ts
   │  │  ├─ subcategory.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ auth.routes.ts
   │  │  ├─ banner.routes.ts
   │  │  ├─ brand.routes.ts
   │  │  ├─ category.routes.ts
   │  │  ├─ coupon.routes.ts
   │  │  ├─ currency.routes.ts
   │  │  ├─ order.routes.ts
   │  │  ├─ page.routes.ts
   │  │  ├─ payment.routes.ts
   │  │  ├─ product.route.ts
   │  │  ├─ settings.routes.ts
   │  │  ├─ shippingTier.routes.ts
   │  │  ├─ stats.route.ts
   │  │  ├─ subcategory.route.ts
   │  │  └─ telegram.routes.ts
   │  ├─ services
   │  │  ├─ category.service.ts
   │  │  ├─ product.service.ts
   │  │  └─ telegram.service.ts
   │  ├─ types
   │  │  └─ types.ts
   │  └─ utils
   │     ├─ ApiError.ts
   │     ├─ asyncHandler.ts
   │     ├─ cloudinary.ts
   │     ├─ helper.ts
   │     └─ utils.ts
   ├─ tsconfig.json
   └─ vercel.json

```