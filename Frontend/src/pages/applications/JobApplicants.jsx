import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicantsTable from '../../components/applications/ApplicantsTable';
import { IoArrowBackOutline } from 'react-icons/io5';

const JobApplicants = () => {
  const { job_id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 transition-colors mb-6"
      >
        <IoArrowBackOutline size={18} />
        Back to Dashboard
      </button>

      <div className="mb-10">
        <h1 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight">Job Applicants</h1>
        <p className="text-gray-500 mt-2 text-lg">Review and manage candidates who applied for this role.</p>
      </div>
      
      <ApplicantsTable jobId={job_id} />
    </div>
  );
};

export default JobApplicants;
