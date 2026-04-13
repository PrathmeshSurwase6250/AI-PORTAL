import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import {
    IoPencilOutline, IoTrashOutline, IoPeopleOutline,
    IoBriefcaseOutline, IoLocationOutline, IoCashOutline,
    IoTimeOutline, IoPersonOutline, IoAddOutline,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import EditJobModal from './EditJobModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import axios from 'axios';
import { ServerURL } from '../../App';

const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true,
});

const typeBadge = (type) => ({
    'Full-time': 'bg-green-100 text-green-700',
    'Part-time': 'bg-blue-100  text-blue-700',
    'Remote':    'bg-purple-100 text-purple-700',
    'Internship':'bg-amber-100 text-amber-700',
    'Contract':  'bg-rose-100  text-rose-700',
}[type] || 'bg-gray-100 text-gray-600');

const JobTable = () => {
    const [jobs, setJobs]               = useState([]);
    const [loading, setLoading]         = useState(true);
    const [editJob, setEditJob]         = useState(null);
    const [deleteJob, setDeleteJob]     = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [expandedId, setExpandedId]   = useState(null);

    const navigate  = useNavigate();
    const user      = useSelector(s => s.user?.userData);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${ServerURL}/api/jobPosting/my-jobs`, getHeaders());
            setJobs(res.data.jobs || []);
        } catch (err) {
            console.error('Failed to load my jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleDeleteConfirm = async () => {
        if (!deleteJob) return;
        try {
            setDeleteLoading(true);
            await axios.delete(`${ServerURL}/api/jobPosting/delete-job-post/${deleteJob._id}`, getHeaders());
            setJobs(prev => prev.filter(j => j._id !== deleteJob._id));
            setDeleteJob(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete job.');
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                    <div className="h-5 bg-gray-100 rounded w-48 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-32" />
                </div>
            ))}
        </div>
    );

    if (jobs.length === 0) return (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <IoBriefcaseOutline className="text-3xl text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Jobs Posted Yet</h3>
            <p className="text-sm text-gray-400 mb-5">Post your first opening to start receiving candidates.</p>
            <button onClick={() => navigate('/recruiter/post-job')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">
                <IoAddOutline /> Post a Job
            </button>
        </div>
    );

    return (
        <div className="space-y-3">
            {jobs.map((job, idx) => {
                const isExpanded = expandedId === job._id;
                return (
                    <motion.div key={job._id}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Main row */}
                        <div className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            {/* Left: job info */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center text-indigo-600 text-xl shrink-0">
                                    {job.company_logo?.url ? (
                                        <img 
                                            src={job.company_logo.url.startsWith('http') ? job.company_logo.url : `${ServerURL}${job.company_logo.url}`} 
                                            alt={job.company_name} 
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <IoBriefcaseOutline />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{job.job_title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeBadge(job.job_type)}`}>
                                            {job.job_type}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <IoLocationOutline /> {job.company_location}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <IoCashOutline /> {job.salary}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <IoTimeOutline /> Exp: {job.experience}
                                        </span>
                                    </div>
                                    {/* Recruiter identity */}
                                    <p className="text-xs text-indigo-500 font-semibold mt-1 flex items-center gap-1">
                                        <IoPersonOutline />
                                        Posted by: {job.user?.username || 'You'} ({job.user?.email || ''})
                                    </p>
                                </div>
                            </div>

                            {/* Right: actions */}
                            <div className="flex items-center gap-2 shrink-0 ml-auto">
                                <button onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition text-xs">
                                    <IoPeopleOutline /> Applicants
                                </button>
                                <button onClick={() => setExpandedId(isExpanded ? null : job._id)}
                                    className="px-3 py-1.5 text-xs font-bold text-gray-500 border border-gray-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition">
                                    {isExpanded ? 'Hide' : 'Details'}
                                </button>
                                <button onClick={() => setEditJob(job)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                                    <IoPencilOutline size={17} />
                                </button>
                                <button onClick={() => setDeleteJob(job)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                                    <IoTrashOutline size={17} />
                                </button>
                            </div>
                        </div>

                        {/* Expanded: full job details */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                    className="overflow-hidden">
                                    <div className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Skills */}
                                        {job.skills_Required?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Skills Required</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.skills_Required.map((s, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Description */}
                                        {job.job_Description && (
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Description</p>
                                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{job.job_Description}</p>
                                            </div>
                                        )}
                                        {/* Posted on */}
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Posted On</p>
                                            <p className="text-sm text-gray-700">
                                                {new Date(job.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        {/* Company */}
                                        {job.company_name && (
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Company</p>
                                                <p className="text-sm text-gray-700 font-semibold">{job.company_name}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}

            {/* Modals */}
            <EditJobModal
                isOpen={!!editJob} job={editJob}
                onClose={() => setEditJob(null)} onRefresh={fetchJobs}
            />
            <DeleteConfirmModal
                isOpen={!!deleteJob} jobTitle={deleteJob?.job_title}
                loading={deleteLoading}
                onClose={() => setDeleteJob(null)} onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default JobTable;
