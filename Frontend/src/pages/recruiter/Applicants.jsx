import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
    IoArrowBackOutline, 
    IoPeopleOutline, 
    IoDocumentTextOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoBarChartOutline,
    IoPersonOutline,
    IoMailOutline,
    IoTimeOutline
} from 'react-icons/io5';
import { getJobApplicants, updateApplicationStatus } from '../../services/applicationApi';
import { getAllJobs } from '../../services/jobApi';

// Status badge helper
const StatusBadge = ({ status }) => {
    const styles = {
        applied:     'bg-blue-50 text-blue-700 border border-blue-100',
        shortlisted: 'bg-green-50 text-green-700 border border-green-100',
        rejected:    'bg-red-50 text-red-600 border border-red-100',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${styles[status] || styles.applied}`}>
            {status}
        </span>
    );
};

// Score meter helper
const ScoreMeter = ({ score, label }) => {
    const color = score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-400' : 'bg-red-400';
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs font-bold text-gray-800">{score}/10</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score * 10}%` }} />
            </div>
        </div>
    );
};

const Applicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch job info and applicants in parallel
                const [applicantsRes, jobsRes] = await Promise.all([
                    getJobApplicants(jobId),
                    getAllJobs()
                ]);

                const jobsList = jobsRes.allJobPosting || [];
                const matchedJob = jobsList.find(j => j._id === jobId);
                setJob(matchedJob || null);

                setApplicants(applicantsRes.applications || []);
            } catch (err) {
                if (err.response?.status === 404) {
                    setApplicants([]); // No applicants yet — not an error
                } else {
                    setError('Failed to load applicants. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [jobId]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdatingId(applicationId);
            await updateApplicationStatus(applicationId, newStatus);
            setApplicants(prev =>
                prev.map(a => a._id === applicationId ? { ...a, status: newStatus } : a)
            );
        } catch (err) {
            console.error('Status update failed:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Summary counts
    const counts = {
        total:       applicants.length,
        shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
        rejected:    applicants.filter(a => a.status === 'rejected').length,
        applied:     applicants.filter(a => a.status === 'applied').length,
    };

    if (!jobId) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Review Applicants</h1>
                    <p className="text-gray-500 mt-2">Select a job from Manage Jobs to see its applicants.</p>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 p-16 shadow-sm text-center">
                    <IoPeopleOutline className="text-gray-200 text-6xl mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Job Selected</h3>
                    <p className="text-gray-500 text-sm mb-6">Go to Manage Jobs and click the Applicants button on a specific role.</p>
                    <button onClick={() => navigate('/recruiter/manage-jobs')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                        Go to Manage Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/recruiter/manage-jobs')}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold text-sm mb-4 transition-colors"
                >
                    <IoArrowBackOutline /> Back to Manage Jobs
                </button>
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
                    Applicants
                    {job && <span className="text-indigo-600"> — {job.job_title}</span>}
                </h1>
                <p className="text-gray-500 mt-1">{job?.company_name} · Review and shortlist candidates</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Applied', count: counts.total,       color: 'text-gray-900',   bg: 'bg-gray-50'   },
                    { label: 'Pending',        count: counts.applied,     color: 'text-blue-700',   bg: 'bg-blue-50'   },
                    { label: 'Shortlisted',   count: counts.shortlisted, color: 'text-green-700',  bg: 'bg-green-50'  },
                    { label: 'Rejected',      count: counts.rejected,    color: 'text-red-600',    bg: 'bg-red-50'    },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-gray-100`}>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className={`text-3xl font-extrabold ${stat.color} mt-1`}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Applicant List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100 h-24" />
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center text-red-600 font-medium">{error}</div>
            ) : applicants.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-16 shadow-sm text-center">
                    <IoPeopleOutline className="text-gray-200 text-6xl mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-500 text-sm">Share your job posting to start receiving candidates.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applicants.map((app, idx) => {
                        const candidate = app.user;
                        const resume    = app.resume;
                        const interview = app.interview;
                        const isExpanded = expandedId === app._id;

                        return (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                                {/* Main Row */}
                                <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                                    {/* Candidate Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0">
                                            {(candidate?.username || 'A')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{candidate?.username || 'Anonymous'}</p>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                                                <IoMailOutline className="shrink-0" />
                                                <span>{candidate?.email || 'No email'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side Actions */}
                                    <div className="flex flex-wrap items-center gap-3 ml-auto">
                                        {/* Interview Score Badge */}
                                        {interview ? (
                                            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
                                                <IoBarChartOutline className="text-indigo-600" />
                                                <span className="text-xs font-bold text-indigo-700">
                                                    AI Score: {interview.finalScore}/10
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">No interview attached</span>
                                        )}

                                        {/* Applied At */}
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <IoTimeOutline />
                                            {new Date(app.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                                        </div>

                                        {/* Status Badge */}
                                        <StatusBadge status={app.status} />

                                        {/* Expand toggle */}
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                            className="text-xs font-bold text-indigo-600 hover:underline"
                                        >
                                            {isExpanded ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Detail Panel */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                                                {/* Resume Info */}
                                                <div className="bg-gray-50 rounded-2xl p-5">
                                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <IoDocumentTextOutline className="text-indigo-500" /> Resume
                                                    </h4>
                                                    {resume ? (
                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <p><span className="font-semibold">Name:</span> {resume.personal_Information?.full_Name || '—'}</p>
                                                            <p><span className="font-semibold">Phone:</span> {resume.personal_Information?.phone_number || '—'}</p>
                                                            <p><span className="font-semibold">City:</span> {resume.personal_Information?.city || '—'}</p>
                                                            {resume.career_Objective && (
                                                                <p className="text-xs text-gray-500 mt-2 italic line-clamp-3">"{resume.career_Objective}"</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-400 text-sm">No resume data available.</p>
                                                    )}
                                                </div>

                                                {/* Interview Performance */}
                                                <div className="bg-gray-50 rounded-2xl p-5">
                                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <IoBarChartOutline className="text-indigo-500" /> AI Interview Performance
                                                    </h4>
                                                    {interview ? (
                                                        <div className="space-y-3">
                                                            <ScoreMeter score={interview.finalScore}    label="Overall Score" />
                                                            <div className="text-xs text-gray-500 mt-2">
                                                                <p>Role: <span className="font-semibold text-gray-700">{interview.role}</span></p>
                                                                <p>Mode: <span className="font-semibold text-gray-700">{interview.mode}</span></p>
                                                                <p>Experience: <span className="font-semibold text-gray-700">{interview.experience}</span></p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-400 text-sm">Candidate did not attach an interview score.</p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="bg-gray-50 rounded-2xl p-5 flex flex-col justify-between">
                                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <IoPersonOutline className="text-indigo-500" /> Decision
                                                    </h4>
                                                    <div className="flex flex-col gap-3">
                                                        <button
                                                            onClick={() => handleStatusChange(app._id, 'shortlisted')}
                                                            disabled={updatingId === app._id || app.status === 'shortlisted'}
                                                            className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                                        >
                                                            {updatingId === app._id ? (
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <><IoCheckmarkCircleOutline /> Shortlist</>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(app._id, 'rejected')}
                                                            disabled={updatingId === app._id || app.status === 'rejected'}
                                                            className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                                        >
                                                            <IoCloseCircleOutline /> Reject
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Applicants;
