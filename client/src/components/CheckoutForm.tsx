import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useNewOrderMutation } from '../redux/api/order.api';
import { resetCart } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { notify } from '../utils/util';
import BackButton from '../components/common/BackBtn';

// Define the CheckoutForm component for Cash on Delivery
const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
  const {
    shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cart);

  const [newOrder] = useNewOrderMutation();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');

  // Function to handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      notify('Please login to place order', 'error');
      return;
    }

    if (cartItems.length === 0) {
      notify('Your cart is empty', 'error');
      return;
    }

    setIsProcessing(true);

    // Fixed: Match the field name that server expects (subTotal with uppercase T)
    const orderData: NewOrderRequest = {
      shippingCharges,
      shippingInfo,
      tax,
      discount,
      total,
      subTotal, // Changed back to subTotal (uppercase T) to match server expectation
      orderItems: cartItems,
      userId: user?._id,
    };

    try {
      const orderResponse = await newOrder(orderData);
      
      if (orderResponse.error) {
        // Fix: Properly handle error type checking
        let errorMessage = 'Failed to place order';
        
        if ('status' in orderResponse.error) {
          // Handle FetchBaseQueryError
          if (typeof orderResponse.error.data === 'string') {
            errorMessage = orderResponse.error.data;
          } else if (orderResponse.error.data && typeof orderResponse.error.data === 'object' && 'message' in orderResponse.error.data) {
            errorMessage = (orderResponse.error.data as any).message;
          }
        } else if ('message' in orderResponse.error) {
          // Handle SerializedError
          errorMessage = orderResponse.error.message || 'Failed to place order';
        }
        
        throw new Error(errorMessage);
      }

      // Order placed successfully
      dispatch(resetCart());
      notify('Order placed successfully! You will pay on delivery.', 'success');
      navigate("/my-orders");
      
    } catch (error: any) {
      console.error(error);
      notify(error.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg m-4">
        <BackButton />
      </div>
      
      <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">2M Technology</h1>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        
        {/* Order Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>EGP {subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>EGP {shippingCharges.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>EGP {tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount:</span>
              <span>-EGP {discount.toFixed(2)}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>EGP {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <div className="mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when your order arrives</div>
                </div>
              </div>
            </label>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                disabled
                className="mr-3"
              />
              <div className="flex items-center">
                <div className="mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Online Payment</div>
                  <div className="text-sm text-gray-600">Coming soon</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Shipping Info Display */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p className="text-sm text-gray-700">
            {shippingInfo.address}, {shippingInfo.city}<br />
            {shippingInfo.state} - <br />
            {shippingInfo.country}
          </p>
        </div>

        {/* COD Info */}
        {paymentMethod === 'cod' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Cash on Delivery</p>
                <p className="text-yellow-700">
                  Please keep exact change ready. Amount to pay: <strong>EGP {total.toFixed(0)}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isProcessing} 
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg w-full font-medium transition-colors"
        >
          {isProcessing ? "Placing Order..." : `Place Order - EGP ${total.toFixed(0)}`}
        </button>
      </form>

      <div className="text-center mt-4">
        
      </div>
    </div>
  );
};

export default CheckoutForm;
