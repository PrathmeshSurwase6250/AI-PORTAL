import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getMyApplications } from '../../services/applicationApi';
import StatusBadge from './StatusBadge';
import { 
    IoDocumentTextOutline, 
    IoBusinessOutline, 
    IoRefreshOutline,
    IoBriefcaseOutline,
    IoSparklesOutline,
    IoArrowForwardOutline
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const POLL_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = 'app_statuses'; // to detect status changes

const MyApplicationsTable = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const [newlyChanged, setNewlyChanged] = useState(new Set()); // IDs that just changed
    const [lastChecked, setLastChecked] = useState(null);
    
    const pollingRef = useRef(null);

    // ------- Core Fetch ------- //
    const fetchApps = useCallback(async (isManual = false) => {
        if (isManual) setRefreshing(true);

        try {
            const data = await getMyApplications();
            const fetched = data.myApplications || [];

            // Compare with previously stored statuses
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            const changed = new Set();

            fetched.forEach(app => {
                const prev = stored[app._id];
                if (prev && prev !== app.status) {
                    changed.add(app._id); // status changed since last visit!
                }
                stored[app._id] = app.status; // update store
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
            setApplications(fetched);
            setNewlyChanged(changed);
            setLastChecked(new Date());

            // Auto-clear the highlight after 8s
            if (changed.size > 0) {
                setTimeout(() => setNewlyChanged(new Set()), 8000);
            }
        } catch {
            setApplications([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // ------- Mount + Poll ------- //
    useEffect(() => {
        fetchApps();
        pollingRef.current = setInterval(() => fetchApps(), POLL_INTERVAL);
        return () => clearInterval(pollingRef.current);
    }, [fetchApps]);

    // ------- Skeleton Rows ------- //
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="py-5 px-6"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
            <td className="py-5 px-6 hidden md:table-cell"><div className="h-6 bg-gray-100 rounded w-24"></div></td>
            <td className="py-5 px-6"><div className="h-6 bg-gray-100 rounded w-20"></div></td>
            <td className="py-5 px-6"><div className="h-6 bg-gray-100 rounded w-16 float-right"></div></td>
        </tr>
    );

    return (
        <div className="flex flex-col gap-4">

            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 font-medium">
                    {lastChecked && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                            Last checked: {lastChecked.toLocaleTimeString()}
                            <span className="text-gray-400">· Auto-refreshes every 30s</span>
                        </span>
                    )}
                </div>
                <button
                    onClick={() => fetchApps(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
                >
                    <IoRefreshOutline className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Status Change Notification Toast */}
            <AnimatePresence>
                {newlyChanged.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 bg-brand-600 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-brand-500/20"
                    >
                        <IoSparklesOutline className="text-yellow-300 text-xl shrink-0" />
                        <p className="font-bold text-sm">
                            {newlyChanged.size === 1
                                ? '1 application status has been updated by the recruiter!'
                                : `${newlyChanged.size} applications have new status updates!`}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
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
                                <>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                                <IoBriefcaseOutline className="text-gray-300 text-3xl" />
                                            </div>
                                            <p className="text-gray-900 font-bold text-lg mb-1">No Applications Yet</p>
                                            <p className="text-gray-500 text-sm mb-5">Start browsing jobs to send your first application.</p>
                                            <Link to="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition text-sm">
                                                Browse Jobs <IoArrowForwardOutline />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                applications.map(app => {
                                    const isChanged = newlyChanged.has(app._id);
                                    return (
                                        <motion.tr
                                            key={app._id}
                                            layout
                                            className={`transition-colors group ${isChanged ? 'bg-brand-50' : 'hover:bg-gray-50/50'}`}
                                        >
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                                        <IoBusinessOutline size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-gray-900 text-sm">{app.job?.job_title || 'Unknown Role'}</p>
                                                            {isChanged && (
                                                                <span className="text-xs font-bold bg-brand-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                                                                    Updated!
                                                                </span>
                                                            )}
                                                        </div>
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
                                                <div className={`inline-flex ${isChanged ? 'ring-2 ring-brand-400 ring-offset-2 rounded-full' : ''}`}>
                                                    <StatusBadge status={app.status || 'applied'} />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyApplicationsTable;
