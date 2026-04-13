import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication.
 * Redirects to /auth if the user is not logged in.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const { userData } = useSelector((state) => state.auth);
    const token = localStorage.getItem("token");
    const location = useLocation();

    // If no token exists, the user is definitely not logged in
    if (!token) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If we have a token but userData isn't loaded yet, 
    // we show a small loading state to prevent flickering redirects
    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Optional: Check for specific roles (e.g., jobseeker, recruiter, admin)
    if (requiredRole && userData.role !== requiredRole) {
        // Redirection logic if they have the wrong role
        if (userData.role === 'admin') return <Navigate to="/admin" replace />;
        if (userData.role === 'recruiter') return <Navigate to="/recruiter" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
