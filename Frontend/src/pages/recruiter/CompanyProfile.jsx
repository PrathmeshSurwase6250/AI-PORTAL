import React from 'react';

const CompanyProfile = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Company Profile</h1>
                <p className="text-gray-500 mt-2">Manage your organization's details, branding, and billing information.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 p-12 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Company Settings Placeholder</h3>
                <p className="text-gray-500 text-sm">
                    This page will eventually allow you to upload your company logo, edit the description, and manage active recruiter seats.
                </p>
            </div>
        </div>
    );
};

export default CompanyProfile;
