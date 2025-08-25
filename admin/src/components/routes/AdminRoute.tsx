import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const AdminRoute: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);

    // If user is admin, render the protected routes
    // If not, redirect to auth page
    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default AdminRoute;