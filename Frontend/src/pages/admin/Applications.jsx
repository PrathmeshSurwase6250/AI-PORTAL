import React from 'react';
import ApplicationsTable from '../../components/admin/ApplicationsTable';

const Applications = () => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Applications</h1>
          <p className="text-gray-500 mt-1">Review applicant tracking status across all active jobs.</p>
        </div>
      </div>

      <ApplicationsTable />
    </div>
  );
};

export default Applications;
