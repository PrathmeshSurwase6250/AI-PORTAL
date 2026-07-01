import React from 'react';
import { motion } from 'motion/react';
import { IoLocationOutline, IoBriefcaseOutline, IoCashOutline, IoTimeOutline } from 'react-icons/io5';
import { ServerURL } from '../../App';

const JobCard = ({ job, onClick }) => {
  const logoUrl = job?.company_logo?.url;
  const displayLogo = logoUrl 
    ? (logoUrl.startsWith('http') ? logoUrl : `${ServerURL}${logoUrl}`)
    : "https://img.freepik.com/premium-vector/creative-elegant-minimalistic-logo-design-vector-any-brand-business-company_1253202-134378.jpg";

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onClick(job)}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 p-2">
            <img 
              src={displayLogo} 
              alt={job?.company_name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
              {job?.job_title}
            </h3>
            <p className="text-gray-500 text-sm font-medium">{job?.company_name}</p>
          </div>
        </div>
        <div className="bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-bold capitalize">
          {job?.job_type || 'Full-time'}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1.5">
          <IoLocationOutline className="text-gray-400" />
          <span>{job?.company_location || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IoBriefcaseOutline className="text-gray-400" />
          <span>{job?.experience || 'Entry Level'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IoCashOutline className="text-gray-400" />
          <span>{job?.salary || 'Not Disclosed'}</span>
        </div>
      </div>

      {job?.required_skills && job.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {job.required_skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-100">
              {skill}
            </span>
          ))}
          {job.required_skills.length > 4 && (
            <span className="bg-gray-50 text-gray-500 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-100">
              +{job.required_skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <span className="text-xs text-gray-400 font-medium tracking-wide">
          {new Date(job?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <button className="text-brand-600 bg-brand-50 hover:bg-brand-100 px-5 py-2 rounded-full text-sm font-bold transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default JobCard;
