import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import JobCard from './JobCard';
import { ServerURL } from '../../App';
import { IoBriefcase, IoSearchOutline } from 'react-icons/io5';

const JobList = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ServerURL}/api/jobPosting/show-all-posts`);
        setJobs(response.data.allJobPosting || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job?.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="w-full flex-col flex items-center justify-center p-20 min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Scanning the market for opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-20 bg-red-50 rounded-3xl border border-red-100">
        <IoBriefcase className="text-red-400 text-5xl mb-4" />
        <h3 className="text-xl font-heading font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Search Header */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center glass-panel p-4 rounded-2xl mx-4 sm:mx-0">
        <div className="relative w-full md:w-96">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input 
            type="text" 
            placeholder="Search by job title or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 whitespace-nowrap">
          <span className="text-brand-600 font-bold">{filteredJobs.length}</span> positions available
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-20">
          <IoBriefcase className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-heading font-bold text-gray-700 mb-2">No matching jobs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0"
        >
          {filteredJobs.map((job) => (
            <motion.div key={job._id || Math.random()} variants={item}>
              <JobCard job={job} onClick={onSelectJob} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default JobList;
