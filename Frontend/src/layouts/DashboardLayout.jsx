import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import RecruiterSidebar from '../components/recruiter/RecruiterSidebar';
import RecruiterNavbar from '../components/recruiter/RecruiterNavbar';
import { useSelector } from 'react-redux';

const DashboardLayout = () => {
    const authState = useSelector((state) => state.auth);
    const userData = authState?.userData;
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Security Guard: Only allow recruiters or admin to access this layout
    useEffect(() => {
        if (userData && (userData.role !== 'recruiter' && userData.role !== 'admin')) {
            navigate('/dashboard'); // Redirect jobseekers to their own dashboard
        } else if (!userData && !localStorage.getItem("token")) {
            navigate('/auth'); // Redirect guests to login
        }
    }, [userData, navigate]);

    // Close sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 z-10 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-20 transform md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <RecruiterSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-64">
                <RecruiterNavbar toggleSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
