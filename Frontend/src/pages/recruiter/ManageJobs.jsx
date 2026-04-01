import React from 'react';
import JobTable from '../../components/Jobs/JobTable';

const ManageJobs = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Manage Job Listings</h1>
                <p className="text-gray-500 mt-2">View active postings, edit details, or remove closed positions.</p>
            </div>
            
            <JobTable />
        </div>
    );
};

export default ManageJobs;
