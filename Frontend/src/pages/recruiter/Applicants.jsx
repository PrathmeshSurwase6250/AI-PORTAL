import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import {
    IoArrowBackOutline, IoPeopleOutline, IoDocumentTextOutline,
    IoCheckmarkCircleOutline, IoCloseCircleOutline, IoBarChartOutline,
    IoPersonOutline, IoMailOutline, IoTimeOutline, IoMicOutline,
    IoChevronDownOutline, IoTrophyOutline, IoCalendarOutline,
    IoCloseOutline, IoBriefcaseOutline, IoSparklesOutline,
} from 'react-icons/io5';
import { getJobApplicants, updateApplicationStatus } from '../../services/applicationApi';
import { getAllJobs } from '../../services/jobApi';
import { ServerURL } from '../../config/server';

const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles = {
        applied:     'bg-blue-50 text-blue-700 border border-blue-100',
        shortlisted: 'bg-green-50 text-green-700 border border-green-100',
        rejected:    'bg-red-50 text-red-600 border border-red-100',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${styles[status] || styles.applied}`}>{status}</span>;
};

const gradeInfo = (score) => {
    if (score >= 8.5) return { grade: 'A+', color: 'text-green-600', bg: 'from-green-400 to-emerald-500' };
    if (score >= 7.5) return { grade: 'A',  color: 'text-green-600', bg: 'from-green-400 to-emerald-400' };
    if (score >= 6.5) return { grade: 'B+', color: 'text-blue-600',  bg: 'from-blue-400  to-indigo-500'  };
    if (score >= 5.5) return { grade: 'B',  color: 'text-blue-600',  bg: 'from-blue-400  to-indigo-400'  };
    if (score >= 4.5) return { grade: 'C',  color: 'text-amber-600', bg: 'from-amber-400 to-orange-400'  };
    return                   { grade: 'D',  color: 'text-red-500',   bg: 'from-red-400   to-rose-500'    };
};

const ScoreBar = ({ label, value, color = 'bg-indigo-500' }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-gray-600">{label}</span>
            <span className="font-bold text-gray-900">{Number(value).toFixed(1)}/10</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }} animate={{ width: `${(value / 10) * 100}%` }}
                transition={{ duration: 0.7 }} />
        </div>
    </div>
);

const diffBadge = (d) => ({
    easy:   'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    hard:   'bg-red-100   text-red-700',
}[d] || 'bg-gray-100 text-gray-600');

// ── Single Question Row ───────────────────────────────────────────────────────
const QRow = ({ q, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center shrink-0">{index + 1}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{q.question}</p>
                    <div className="flex gap-2 mt-0.5">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${diffBadge(q.difficulty)}`}>{q.difficulty?.toUpperCase()}</span>
                    </div>
                </div>
                <span className="text-lg font-extrabold text-indigo-600 shrink-0">{q.score.toFixed(1)}</span>
                <IoChevronDownOutline className={`text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Candidate's Answer</p>
                                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2 italic leading-relaxed">
                                    {q.answer || <span className="text-gray-400">No answer recorded</span>}
                                </p>
                            </div>
                            {q.feedback && (
                                <div>
                                    <p className="text-xs font-bold text-indigo-500 uppercase mb-1">AI Feedback</p>
                                    <p className="text-sm text-indigo-900 bg-indigo-50 rounded-xl px-3 py-2 border border-indigo-100">💡 {q.feedback}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                {[
                                    { label: 'Confidence',    val: q.confidence,    col: 'text-purple-600', bg: 'bg-purple-50' },
                                    { label: 'Communication', val: q.communication, col: 'text-blue-600',   bg: 'bg-blue-50'   },
                                    { label: 'Correctness',   val: q.correctness,   col: 'text-green-600',  bg: 'bg-green-50'  },
                                ].map(m => (
                                    <div key={m.label} className={`${m.bg} rounded-xl p-2`}>
                                        <p className={`text-base font-extrabold ${m.col}`}>{m.val.toFixed(1)}</p>
                                        <p className="text-xs text-gray-500">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Interview History Side Panel ──────────────────────────────────────────────
const CandidateInterviewPanel = ({ candidate, onClose }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [selected, setSelected]     = useState(null); // which interview is expanded

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${ServerURL}/api/interview/candidate/${candidate._id}`, getHeaders());
                setInterviews(res.data.interviews || []);
                if (res.data.interviews?.length > 0) setSelected(res.data.interviews[0]._id);
            } catch (e) {
                setError(e.response?.data?.error || 'Could not load interview history.');
            } finally { setLoading(false); }
        })();
    }, [candidate._id]);

    const active = interviews.find(iv => iv._id === selected);
    const g = active ? gradeInfo(active.finalScore) : null;

    return (
        <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />

            {/* Panel */}
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6 py-5 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-lg">
                                {(candidate.username || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-extrabold text-lg">{candidate.username}</h2>
                                <p className="text-indigo-300 text-xs">{candidate.email}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
                            <IoCloseOutline className="text-2xl" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <IoMicOutline className="text-indigo-300" />
                        <span className="text-sm text-indigo-200 font-semibold">
                            {interviews.length} AI Interview{interviews.length !== 1 ? 's' : ''} completed
                        </span>
                    </div>
                </div>

                {/* Body — split: left list, right detail */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Left: Interview sessions list */}
                    <div className="w-60 shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50 p-3 space-y-2">
                        {loading && [1,2].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />)}
                        {!loading && interviews.length === 0 && (
                            <div className="text-center py-10">
                                <IoMicOutline className="text-3xl text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">No interviews yet</p>
                            </div>
                        )}
                        {interviews.map(iv => {
                            const g = gradeInfo(iv.finalScore);
                            const isActive = selected === iv._id;
                            return (
                                <button key={iv._id} onClick={() => setSelected(iv._id)}
                                    className={`w-full text-left rounded-xl p-3 transition border ${
                                        isActive ? 'bg-white border-indigo-200 shadow-sm' : 'border-transparent hover:bg-white'
                                    }`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold capitalize text-gray-500">{iv.mode}</span>
                                        <span className={`text-sm font-extrabold ${g.color}`}>{g.grade}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 truncate">{iv.role}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                        <IoCalendarOutline />
                                        {new Date(iv.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Detail */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}

                        {!active && !loading && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <IoSparklesOutline className="text-5xl text-indigo-200 mb-3" />
                                <p className="text-gray-400 text-sm">Select an interview session from the left</p>
                            </div>
                        )}

                        {active && g && (
                            <>
                                {/* Score hero */}
                                <div className={`bg-gradient-to-br ${g.bg} rounded-3xl p-6 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold opacity-70 mb-1">Final Score</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-6xl font-extrabold">{g.grade}</span>
                                                <span className="text-xl opacity-70">({active.finalScore}/10)</span>
                                            </div>
                                        </div>
                                        <IoTrophyOutline className="text-5xl text-yellow-300 opacity-80" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-5">
                                        {[
                                            { label: 'Confidence',    val: active.avgConfidence    },
                                            { label: 'Communication', val: active.avgCommunication },
                                            { label: 'Correctness',   val: active.avgCorrectness   },
                                        ].map(m => (
                                            <div key={m.label} className="bg-white/20 rounded-xl py-2 px-3 text-center">
                                                <p className="text-lg font-extrabold">{m.val.toFixed(1)}</p>
                                                <p className="text-xs opacity-70">{m.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: <IoBriefcaseOutline />, label: 'Role',       val: active.role             },
                                        { icon: <IoPersonOutline />,    label: 'Experience', val: active.experience       },
                                        { icon: <IoMicOutline />,       label: 'Mode',       val: active.mode             },
                                    ].map(m => (
                                        <div key={m.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                                            <div className="text-indigo-500 flex justify-center mb-1">{m.icon}</div>
                                            <p className="text-xs text-gray-400 font-medium">{m.label}</p>
                                            <p className="text-sm font-bold text-gray-900 capitalize truncate">{m.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Questions */}
                                <div>
                                    <h3 className="font-extrabold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                        <IoMicOutline className="text-indigo-500" />
                                        Questions & Answers ({active.questions.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {active.questions.map((q, i) => (
                                            <QRow key={q._id} q={q} index={i} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

// ── Main Applicants Page ──────────────────────────────────────────────────────
const Applicants = () => {
    const { jobId } = useParams();
    const navigate  = useNavigate();

    const [job, setJob]           = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [panelCandidate, setPanelCandidate] = useState(null); // opens interview history panel

    useEffect(() => {
        if (!jobId) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [applicantsRes, jobsRes] = await Promise.all([
                    getJobApplicants(jobId),
                    getAllJobs()
                ]);
                const jobsList = jobsRes.allJobPosting || [];
                setJob(jobsList.find(j => j._id === jobId) || null);
                setApplicants(applicantsRes.applications || []);
            } catch (err) {
                if (err.response?.status !== 404) setError('Failed to load applicants.');
            } finally { setLoading(false); }
        };
        fetchData();
    }, [jobId]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdatingId(applicationId);
            await updateApplicationStatus(applicationId, newStatus);
            setApplicants(prev => prev.map(a => a._id === applicationId ? { ...a, status: newStatus } : a));
        } catch (err) { console.error(err); }
        finally { setUpdatingId(null); }
    };

    const counts = {
        total:       applicants.length,
        shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
        rejected:    applicants.filter(a => a.status === 'rejected').length,
        applied:     applicants.filter(a => a.status === 'applied').length,
    };

    if (!jobId) return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 p-16 shadow-sm text-center">
                <IoPeopleOutline className="text-gray-200 text-6xl mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Job Selected</h3>
                <button onClick={() => navigate('/recruiter/manage-jobs')} className="mt-4 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                    Go to Manage Jobs
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button onClick={() => navigate('/recruiter/manage-jobs')}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold text-sm mb-4 transition-colors">
                    <IoArrowBackOutline /> Back to Manage Jobs
                </button>
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
                    Applicants {job && <span className="text-indigo-600">— {job.job_title}</span>}
                </h1>
                <p className="text-gray-500 mt-1">{job?.company_name} · Review and shortlist candidates</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Applied', count: counts.total,       color: 'text-gray-900',  bg: 'bg-gray-50'  },
                    { label: 'Pending',        count: counts.applied,     color: 'text-blue-700',  bg: 'bg-blue-50'  },
                    { label: 'Shortlisted',   count: counts.shortlisted, color: 'text-green-700', bg: 'bg-green-50' },
                    { label: 'Rejected',      count: counts.rejected,    color: 'text-red-600',   bg: 'bg-red-50'   },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100`}>
                        <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                        <p className={`text-3xl font-extrabold ${s.color} mt-1`}>{s.count}</p>
                    </div>
                ))}
            </div>

            {/* Applicant List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100 h-24" />)}
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
                            <motion.div key={app._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                                {/* Main Row */}
                                <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
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

                                    <div className="flex flex-wrap items-center gap-3 ml-auto">
                                        {/* Interview Score Badge */}
                                        {interview ? (
                                            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
                                                <IoBarChartOutline className="text-indigo-600" />
                                                <span className="text-xs font-bold text-indigo-700">
                                                    AI Score: {interview.finalScore}/10
                                                </span>
                                            </div>
                                        ) : null}

                                        {/* 🎤 View Full Interview History Button */}
                                        {candidate && (
                                            <button onClick={() => setPanelCandidate(candidate)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold rounded-xl hover:bg-purple-100 transition">
                                                <IoMicOutline /> Interview History
                                            </button>
                                        )}

                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <IoTimeOutline />
                                            {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>

                                        <StatusBadge status={app.status} />

                                        <button onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                            className="text-xs font-bold text-indigo-600 hover:underline">
                                            {isExpanded ? 'Hide' : 'Resume Details'}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded: Resume + Decision */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="px-6 pb-6 border-t border-gray-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                                                {/* Resume Info */}
                                                <div className="bg-gray-50 rounded-2xl p-5">
                                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <IoDocumentTextOutline className="text-indigo-500" /> Resume
                                                    </h4>
                                                    {resume ? (
                                                        <div className="space-y-1.5 text-sm text-gray-600">
                                                            <p><span className="font-semibold">Name:</span> {resume.personal_Information?.full_Name || '—'}</p>
                                                            <p><span className="font-semibold">Phone:</span> {resume.personal_Information?.phone_number || '—'}</p>
                                                            <p><span className="font-semibold">City:</span> {resume.personal_Information?.city || '—'}</p>
                                                            {resume.career_Objective && (
                                                                <p className="text-xs text-gray-500 mt-2 italic line-clamp-3">"{resume.career_Objective}"</p>
                                                            )}
                                                        </div>
                                                    ) : <p className="text-gray-400 text-sm">No resume data.</p>}
                                                </div>

                                                {/* Decision */}
                                                <div className="bg-gray-50 rounded-2xl p-5 flex flex-col justify-between">
                                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <IoPersonOutline className="text-indigo-500" /> Decision
                                                    </h4>
                                                    <div className="flex flex-col gap-3">
                                                        <button onClick={() => handleStatusChange(app._id, 'shortlisted')}
                                                            disabled={updatingId === app._id || app.status === 'shortlisted'}
                                                            className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-40 transition flex items-center justify-center gap-2">
                                                            {updatingId === app._id
                                                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                : <><IoCheckmarkCircleOutline /> Shortlist</>}
                                                        </button>
                                                        <button onClick={() => handleStatusChange(app._id, 'rejected')}
                                                            disabled={updatingId === app._id || app.status === 'rejected'}
                                                            className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-100 disabled:opacity-40 transition flex items-center justify-center gap-2">
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

            {/* Interview History Side Panel */}
            <AnimatePresence>
                {panelCandidate && (
                    <CandidateInterviewPanel
                        candidate={panelCandidate}
                        onClose={() => setPanelCandidate(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Applicants;
