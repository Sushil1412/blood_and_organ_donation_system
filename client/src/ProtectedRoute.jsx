// utils/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// General protected route (any authenticated user)
export const ProtectedRoute = ({ }) => {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet /> : <Navigate to="/" />;
};

// Admin-only route
export const AdminRoute = () => {
    const { currentUser } = useAuth();
    // console.log("authhh", currentUser.role);
    return currentUser?.role === 'hospital' ? <Outlet /> : <Navigate to="/" />;
};

// Recipient-only route
export const UserRoute = () => {
    const { currentUser } = useAuth();
    // console.log("authhh", currentUser.role);
    return currentUser?.role === 'recipient' ? <Outlet /> : <Navigate to="/" />;
};

// Donor-only route
export const DonorRoute = () => {
    const { currentUser } = useAuth();
    return currentUser?.role === 'donor' ? <Outlet /> : <Navigate to="/" />;
};

