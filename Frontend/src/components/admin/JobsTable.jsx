import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ServerURL } from '../../App';
import { IoTrashOutline } from 'react-icons/io5';

const JobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${ServerURL}/api/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to completely remove this job posting?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${ServerURL}/api/admin/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Job Title</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Company</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Location</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Posted By</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-40"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-8 float-right"></div></td>
                </tr>
              ))
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">No jobs posted yet.</td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-brand-600">{job.job_title}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{job.company_name}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{job.company_location}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{job.user?.username || 'Unknown'}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(job._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Job"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsTable;
