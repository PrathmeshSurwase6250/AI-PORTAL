import React, { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/applicationApi';
import StatusBadge from './StatusBadge';
import { IoDocumentTextOutline, IoBusinessOutline } from 'react-icons/io5';

const MyApplicationsTable = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getMyApplications();
                setApplications(data.applications || []);
            } catch (err) {
                console.error("Failed to load applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Job Details</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider hidden md:table-cell">Resume Submitted</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Applied Date</th>
                            <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-5 px-6"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
                                    <td className="py-5 px-6 hidden md:table-cell"><div className="h-6 bg-gray-100 rounded overflow-hidden w-24"></div></td>
                                    <td className="py-5 px-6"><div className="h-6 bg-gray-100 rounded w-20"></div></td>
                                    <td className="py-5 px-6"><div className="h-6 bg-gray-100 rounded w-16 float-right"></div></td>
                                </tr>
                            ))
                        ) : applications.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-12 text-center text-gray-500 font-medium">
                                    <div className="flex flex-col items-center justify-center">
                                        <IoDocumentTextOutline className="text-gray-300 text-5xl mb-3" />
                                        <p className="text-gray-900 font-bold text-lg">No Applications Yet</p>
                                        <p className="text-gray-500 text-sm mt-1">Start browsing jobs to send your first application.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            applications.map(app => (
                                <tr key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                                                <IoBusinessOutline size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{app.job?.job_title || 'Unknown Role'}</p>
                                                <p className="text-xs font-medium text-gray-500 mt-0.5">{app.job?.company_name || 'Unknown Company'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 hidden md:table-cell">
                                        {app.resume ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <IoDocumentTextOutline className="text-gray-400" />
                                                Resume attached
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No Resume</span>
                                        )}
                                    </td>
                                    <td className="py-5 px-6 text-sm text-gray-500 font-medium">
                                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <StatusBadge status={app.status || 'pending'} />
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

export default MyApplicationsTable;
