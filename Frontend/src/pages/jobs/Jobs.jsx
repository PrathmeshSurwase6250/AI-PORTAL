import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import JobList from '../../components/jobs/JobList';

const Jobs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-8">
      {/* Page Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight"
        >
          Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">Next Opportunity</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto"
        >
          Explore curated job listings from top industry veterans. Let AI match you with the perfect role for your skills.
        </motion.p>
      </div>

      <div className="flex-1 w-full flex item-start justify-center px-4 sm:px-6 lg:px-8 mb-20">
        <JobList onSelectJob={(job) => navigate(`/jobs/${job._id}`)} />
      </div>
    </div>
  );
};

export default Jobs;
