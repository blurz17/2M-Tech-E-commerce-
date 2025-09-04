import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
    incrementCartItem, 
    decrementCartItem, 
    removeCartItem, 
    calculatePrice, 
    resetCart, 
    discountApplied,
    updateShippingCharges 
} from '../redux/reducers/cart.reducer';
import { useApplyCouponMutation } from '../redux/api/coupon.api';
import { useCalculateShippingCostQuery } from '../redux/api/shippingTier.api';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { notify } from '../utils/util';
import { useConstants } from '../hooks/useConstants';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { currencySymbol } = useConstants();
  const cartState = useSelector((state: RootState) => state.cart);
  
  // Ensure cartItems is always an array with safe fallback
  const cartItems = Array.isArray(cartState.cartItems) ? cartState.cartItems : [];
  const { subTotal, tax, shippingCharges, total, discount } = cartState;

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  // Calculate shipping cost dynamically based on subtotal
  const { 
    data: shippingData, 
    isLoading: isCalculatingShipping,
    error: shippingError
  } = useCalculateShippingCostQuery(subTotal, {
    skip: subTotal === 0 // Skip API call if cart is empty
  });

  // Update shipping charges when shipping data is available
  useEffect(() => {
    if (shippingData?.success && shippingData.shippingCost !== undefined) {
      dispatch(updateShippingCharges(shippingData.shippingCost));
    } else if (subTotal === 0) {
      // If cart is empty, set shipping to 0
      dispatch(updateShippingCharges(0));
    } else if (shippingError) {
      // Fallback to default shipping cost if API fails
      dispatch(updateShippingCharges(50));
    }
  }, [shippingData, shippingError, subTotal, dispatch]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch, discount]);

  const handleIncrement = (productId: string) => {
    dispatch(incrementCartItem(productId));
  };

  const handleDecrement = (productId: string) => {
    dispatch(decrementCartItem(productId));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const handleClearCart = () => {
    dispatch(resetCart());
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      notify('Please enter a coupon code', null);
      return;
    }

    try {
      const response = await applyCoupon({ code: couponCode }).unwrap();
      dispatch(discountApplied(response.coupon.amount));
      setAppliedCoupon(couponCode);
      setCouponCode('');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to apply coupon';
      notify(errorMessage, null);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(discountApplied(0));
    setAppliedCoupon('');
  };

  // Early return if cart state is corrupted
  if (!cartState || typeof cartState !== 'object') {
    return (
      <div className="container mx-auto mt-20 mb-8 p-4 bg-white rounded-lg shadow-md">
        <BackButton />
        <div className="text-center">
          <p className="text-lg">Cart data is corrupted. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Function to get shipping tier info for display
  const getShippingTierInfo = () => {
    if (!shippingData?.appliedTier) return null;
    
    const tier = shippingData.appliedTier;
    return `${currencySymbol}${tier.minOrderValue} - ${currencySymbol}${tier.maxOrderValue}`;
  };

  return (
    <div className="container mx-auto mt-20 mb-8 p-4 bg-white rounded-lg shadow-md">
      <BackButton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <div className="overflow-x-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600 mb-4">No items in cart</p>
                <Link
                  to="/products"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Subtotal</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    // Additional safety check for each item
                    if (!item || typeof item !== 'object' || !item.productId) {
                      return null;
                    }

                    return (
                      <tr className="border-b" key={item.productId}>
                        <td className="p-4">
                          <Link to={`/product/${item.productId}`}>
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.photo || 'https://via.placeholder.com/150'}
                                alt="Product"
                                className="h-12 w-12 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/150';
                                }}
                              />
                              <div>
                                <p className="font-bold text-blue-600">{item.name || 'Unknown Product'}</p>
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="p-4">{currencySymbol} {(item.price || 0).toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDecrement(item.productId)}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.quantity || 0}
                              readOnly
                              className="w-8 text-center bg-gray-200 rounded"
                            />
                            <button
                              onClick={() => handleIncrement(item.productId)}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4">{currencySymbol} {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 my-4">
            <Link
              to="/products"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-center hover:bg-yellow-600 transition"
            >
              Continue shopping
            </Link>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h2 className="font-bold text-lg mb-4">Cart total</h2>
            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <span>{currencySymbol} {(subTotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Tax</span>
              <span>{currencySymbol} {(tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex flex-col">
                <span>Shipping</span>
                {isCalculatingShipping && (
                  <span className="text-xs text-gray-500">Calculating...</span>
                )}
                {shippingData?.appliedTier && (
                  <span className="text-xs text-gray-500">
                    Range: {getShippingTierInfo()}
                  </span>
                )}
                {!shippingData?.appliedTier && !isCalculatingShipping && subTotal > 0 && (
                  <span className="text-xs text-red-500">Default rate applied</span>
                )}
              </div>
              <span>{currencySymbol} {(shippingCharges || 0).toFixed(2)}</span>
            </div>
            {(discount || 0) > 0 && (
              <div className="flex justify-between mb-4">
                <span>Discount</span>
                <span className="text-green-600">-{currencySymbol} {(discount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-4 font-bold">
              <span>Total amount</span>
              <span>{currencySymbol} {Math.max(0, (total || 0)).toFixed(2)}</span>
            </div>

            <div className="flex flex-col md:flex-row mb-4 space-y-2 md:space-y-0 md:space-x-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-grow px-4 py-2 rounded-lg border-2 border-gray-300"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button
                  onClick={handleRemoveCoupon}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition md:w-auto"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyCoupon}
                  className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition md:w-auto"
                  disabled={isApplyingCoupon || !couponCode.trim()}
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              )}
            </div>

            {cartItems.length > 0 ? (
              <Link
                to="/shipping"
                className="p-2 bg-yellow-500 text-white w-full py-2 rounded-lg block text-center hover:bg-yellow-600 transition"
              >
                Proceed to checkout
              </Link>
            ) : (
              <button
                disabled
                className="p-2 bg-gray-400 text-white w-full py-2 rounded-lg block text-center cursor-not-allowed"
              >
                Proceed to checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;