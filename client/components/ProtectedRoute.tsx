import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const userRole = localStorage.getItem('userRole');

    if (!userRole) {
        // Not logged in, redirect to login
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        // Logged in but not authorized for this page
        // Redirect to their appropriate dashboard
        if (userRole === 'admin') {
            return <Navigate to="/admin" replace />;
        } else if (userRole === 'owner') {
            return <Navigate to="/owner" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // Authorized, render the page
    return <>{children}</>;
}
