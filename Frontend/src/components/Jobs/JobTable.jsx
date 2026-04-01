import React, { useState, useEffect } from 'react';
import { getAllJobs, deleteJobPost } from '../../services/jobApi';
import { IoPencilOutline, IoTrashOutline, IoPeopleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import EditJobModal from './EditJobModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const JobTable = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [editJob, setEditJob] = useState(null);
    const [deleteJob, setDeleteJob] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getAllJobs();
            // In a real app we might filter only jobs created by THIS recruiter. 
            // For now, assume getAllJobs brings back what they are allowed to see or we filter locally if needed.
            setJobs(data.allJobPosting || []);
        } catch (err) {
            console.error("Failed to load jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDeleteConfirm = async () => {
        if (!deleteJob) return;
        try {
            setDeleteLoading(true);
            await deleteJobPost(deleteJob._id);
            setJobs(jobs.filter(j => j._id !== deleteJob._id));
            setDeleteJob(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete job.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Job Title</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Type & Location</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Salary Estimate</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-5 px-6"><div className="h-6 bg-gray-100 rounded w-48"></div><div className="h-4 bg-gray-100 rounded w-24 mt-2"></div></td>
                                    <td className="py-5 px-6"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                    <td className="py-5 px-6"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                    <td className="py-5 px-6"><div className="h-8 bg-gray-100 rounded w-32 float-right"></div></td>
                                </tr>
                            ))
                        ) : jobs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-12 text-center text-gray-500 font-medium">
                                    <p className="text-gray-900 font-bold text-lg mb-1">No Jobs Posted Yet</p>
                                    <p className="text-sm">Click "Post New Job" from the sidebar to start hiring.</p>
                                </td>
                            </tr>
                        ) : (
                            jobs.map(job => (
                                <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-6">
                                        <p className="font-bold text-gray-900">{job.job_title}</p>
                                        <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">Exp: {job.experience}</p>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex w-max px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                                                {job.job_type}
                                            </span>
                                            <span className="text-sm text-gray-500">{job.company_location}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-sm font-medium text-gray-700">
                                        {job.salary}
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => navigate(`/recruiter/applicants` /* Deep link could be used: /recruiter/applicants?jobId=${job._id} */)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
                                                title="View Applicants"
                                            >
                                                <IoPeopleOutline size={18} /> <span className="hidden sm:inline">Applicants</span>
                                            </button>
                                            <div className="w-px h-6 bg-gray-200 mx-1"></div>
                                            <button 
                                                onClick={() => setEditJob(job)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit Job"
                                            >
                                                <IoPencilOutline size={18} />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteJob(job)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Job"
                                            >
                                                <IoTrashOutline size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <EditJobModal 
                isOpen={!!editJob} 
                job={editJob} 
                onClose={() => setEditJob(null)} 
                onRefresh={fetchJobs} 
            />
            
            <DeleteConfirmModal 
                isOpen={!!deleteJob}
                jobTitle={deleteJob?.job_title}
                loading={deleteLoading}
                onClose={() => setDeleteJob(null)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default JobTable;
