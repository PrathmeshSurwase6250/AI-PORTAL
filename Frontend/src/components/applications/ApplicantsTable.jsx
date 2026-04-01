import React, { useState, useEffect } from 'react';
import { getJobApplicants, updateApplicationStatus } from '../../services/applicationApi';
import StatusBadge from './StatusBadge';
import { IoDownloadOutline, IoPersonCircleOutline, IoMailOutline } from 'react-icons/io5';

const ApplicantsTable = ({ jobId }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const data = await getJobApplicants(jobId);
                setApplicants(data.applications || []);
            } catch (err) {
                console.error("Failed to load applicants:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdatingId(applicationId);
            await updateApplicationStatus(applicationId, newStatus);
            // Locally update the UI to avoid re-fetching immediately
            setApplicants(prev => prev.map(app => 
                app._id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Error updating candidate status.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Applicant Info</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Resume Profile</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Applied On</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Update Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-5 px-6 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-100"></div><div className="flex-1"><div className="w-32 h-4 bg-gray-100 rounded mb-2"></div><div className="w-24 h-3 bg-gray-100 rounded"></div></div></td>
                                    <td className="py-5 px-6"><div className="w-20 h-6 bg-gray-100 rounded"></div></td>
                                    <td className="py-5 px-6"><div className="w-20 h-4 bg-gray-100 rounded"></div></td>
                                    <td className="py-5 px-6"><div className="w-24 h-8 bg-gray-100 rounded float-right"></div></td>
                                </tr>
                            ))
                        ) : applicants.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-12 text-center text-gray-500 font-medium">
                                    <IoPersonCircleOutline className="text-gray-300 text-6xl mx-auto mb-4" />
                                    No applicants have applied to this role yet.
                                </td>
                            </tr>
                        ) : (
                            applicants.map(app => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center border border-brand-200 shadow-sm">
                                                <IoPersonCircleOutline size={26} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{app.user?.username || 'Candidate'}</p>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                                    <IoMailOutline className="text-gray-400" />
                                                    {app.user?.email || 'No Email'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        {app.resume ? (
                                            <button 
                                                onClick={() => window.alert('Opening Resume Viewer... \n(Add a resume modal/tab view here if needed)')}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 font-bold text-xs transition-colors"
                                            >
                                                <IoDownloadOutline size={16} /> Get Resume
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Missing Document</span>
                                        )}
                                    </td>
                                    <td className="py-5 px-6 text-sm text-gray-500 font-medium">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <div className="hidden sm:block">
                                                <StatusBadge status={app.status || 'pending'} />
                                            </div>
                                            <div className="relative">
                                                <select
                                                    value={app.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                    disabled={updatingId === app._id}
                                                    className={`appearance-none bg-white border outline-none text-xs font-bold rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-brand-500/20 cursor-pointer transition-all ${
                                                        updatingId === app._id ? 'opacity-50' : 'border-gray-200 hover:border-gray-300 shadow-sm text-gray-700'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                </div>
                                            </div>
                                        </div>
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

export default ApplicantsTable;
