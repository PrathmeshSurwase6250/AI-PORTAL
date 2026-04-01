import React from 'react';
import MyApplicationsTable from '../../components/applications/MyApplicationsTable';

const MyApplications = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight">My Applications</h1>
        <p className="text-gray-500 mt-2 text-lg">Track the status of roles you have applied for.</p>
      </div>
      
      <MyApplicationsTable />
    </div>
  );
};

export default MyApplications;
