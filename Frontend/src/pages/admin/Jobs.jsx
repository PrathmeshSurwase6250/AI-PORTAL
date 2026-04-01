import React from 'react';
import JobsTable from '../../components/admin/JobsTable';

const Jobs = () => {
    return (
        <div>
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Manage Jobs</h1>
                    <p className="text-gray-500 mt-1">Review active job postings and moderate content.</p>
                </div>
            </div>

            <JobsTable />
        </div>
    );
};

export default Jobs;
