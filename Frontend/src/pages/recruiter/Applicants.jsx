import React from 'react';

const Applicants = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Review Applicants</h1>
                <p className="text-gray-500 mt-2">Manage candidates across all your active job postings.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 p-12 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Applicant Dashboard Placeholder</h3>
                <p className="text-gray-500 text-sm">
                    This page bridges to the Applicant tables. For now, navigate back to Manage Jobs and click the Applicant button for a specific role to load candidate data!
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                    <a href="/recruiter/manage-jobs" className="px-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition">Go to Manage Jobs</a>
                </div>
            </div>
        </div>
    );
};

export default Applicants;
