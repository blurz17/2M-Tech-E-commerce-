import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackBtn';
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderStatusMutation } from '../../redux/api/order.api';
import { notify } from '../../utils/util';
import { useConstants } from '../../hooks/useConstants';

const AdminOrderDetails: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { data, isLoading, isError, refetch } = useOrderDetailsQuery(orderId!);
    const { currencySymbol } = useConstants();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();
    const navigate = useNavigate();

    const handleStatusUpdate = async (status: string) => {
        try {
            await updateOrderStatus({ orderId: orderId!, status }).unwrap();
            notify('Order status updated successfully', 'success');
            refetch();
        } catch (error) {
            notify('Failed to update order status', 'error');
        }
    };

    const handleDeleteOrder = async () => {
        try {
            await deleteOrder(orderId!).unwrap();
            notify('Order deleted successfully', 'success');
            navigate('/admin/orders');
        } catch (error) {
            notify('Failed to delete order', 'error');
        }
    };

    if (isLoading) {
        return <p className="text-center text-lg">Loading...</p>;
    }

    if (isError || !data) {
        return <p className="text-center text-lg text-red-500">Error loading order details</p>;
    }

    const { order } = data;

    return (
        <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md min-h-screen">
            <BackButton />
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Order Details</h2>
            
            {/* Basic Order Info */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Order Information</h3>
                <p>Order ID: <span className="font-medium">{order._id}</span></p>
                <p>Customer: <span className="font-medium">{order.user.name}</span></p>
                <p>Status: <span className="font-medium">{order.status}</span></p>
                <p>Placed on: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
            </div>

            {/* Shipping Information */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Shipping Information</h3>
                <p>Address: <span className="font-medium">{order.shippingInfo.address}</span></p>
                <p>City: <span className="font-medium">{order.shippingInfo.city}</span></p>
                <p>Phone: <span className="font-medium">{order.shippingInfo.phone}</span></p>
                <p>Country: <span className="font-medium">{order.shippingInfo.country}</span></p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Order Items</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="p-4">Product</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item) => (
                                <tr className="border-b hover:bg-gray-100" key={item._id}>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <img src={item.photo} alt="Product" className="h-12 w-12 object-cover rounded-lg" />
                                            <div>{item.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">{item.quantity}</td>
                                    <td className="p-4">{currencySymbol} {item.price}</td>
                                    <td className="p-4">{currencySymbol} {(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>{currencySymbol} {order.subtotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>{currencySymbol} {order.tax}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>{currencySymbol} {order.shippingCharges}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span>{currencySymbol} {order.discount}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{currencySymbol} {order.total}</span>
                </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Admin Actions</h3>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium">Update Status:</label>
                        <select
                            className="p-2 border rounded-md"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    <button
                        onClick={handleDeleteOrder}
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition duration-300"
                    >
                        Delete Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;