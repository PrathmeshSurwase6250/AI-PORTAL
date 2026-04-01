import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import RecruiterNavbar from '../../components/recruiter/RecruiterNavbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
