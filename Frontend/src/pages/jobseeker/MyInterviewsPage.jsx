import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { ServerURL } from '../../config/server';
import {
    IoMicOutline, IoTimeOutline, IoChevronDownOutline, IoTrophyOutline,
    IoCheckmarkCircleOutline, IoCloseCircleOutline, IoCalendarOutline,
    IoBriefcaseOutline, IoStatsChartOutline, IoRefreshOutline,
    IoSparklesOutline, IoDocumentTextOutline,
} from 'react-icons/io5';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true,
});

const gradeInfo = (score) => {
    if (score >= 8.5) return { grade: 'A+', color: 'text-green-600',  bg: 'bg-green-50  border-green-200',  bar: 'bg-green-500'  };
    if (score >= 7.5) return { grade: 'A',  color: 'text-green-600',  bg: 'bg-green-50  border-green-200',  bar: 'bg-green-400'  };
    if (score >= 6.5) return { grade: 'B+', color: 'text-blue-600',   bg: 'bg-blue-50   border-blue-200',   bar: 'bg-blue-500'   };
    if (score >= 5.5) return { grade: 'B',  color: 'text-blue-600',   bg: 'bg-blue-50   border-blue-200',   bar: 'bg-blue-400'   };
    if (score >= 4.5) return { grade: 'C',  color: 'text-amber-600',  bg: 'bg-amber-50  border-amber-200',  bar: 'bg-amber-500'  };
    return                   { grade: 'D',  color: 'text-red-600',    bg: 'bg-red-50    border-red-200',    bar: 'bg-red-500'    };
};

const diffBadge = (d) => ({
    easy:   'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    hard:   'bg-red-100   text-red-700',
}[d] || 'bg-gray-100 text-gray-600');

const ScoreBar = ({ label, value, color = 'bg-indigo-500' }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-gray-600">{label}</span>
            <span className="font-bold text-gray-800">{value.toFixed(1)}/10</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }} animate={{ width: `${(value / 10) * 100}%` }}
                transition={{ duration: 0.7 }} />
        </div>
    </div>
);

// ── Question Accordion ────────────────────────────────────────────────────────
const QuestionCard = ({ q, index }) => {
    const [open, setOpen] = useState(false);
    const g = gradeInfo(q.score);

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(!open)}
                className="w-full flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition text-left">
                {/* Index */}
                <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-relaxed line-clamp-2">{q.question}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diffBadge(q.difficulty)}`}>
                            {q.difficulty?.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <IoTimeOutline /> {q.timelimit}s limit
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xl font-extrabold ${g.color}`}>{q.score.toFixed(1)}</span>
                    <IoChevronDownOutline className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">

                            {/* Answer */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Your Answer</p>
                                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed italic">
                                    {q.answer || <span className="text-gray-400">No answer recorded</span>}
                                </div>
                            </div>

                            {/* AI Feedback */}
                            {q.feedback && (
                                <div>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1.5">AI Feedback</p>
                                    <div className="bg-indigo-50 rounded-xl px-4 py-3 text-sm text-indigo-900 leading-relaxed border border-indigo-100">
                                        💡 {q.feedback}
                                    </div>
                                </div>
                            )}

                            {/* Sub-scores */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Confidence',    value: q.confidence,    color: 'bg-purple-500' },
                                    { label: 'Communication', value: q.communication, color: 'bg-blue-500'   },
                                    { label: 'Correctness',   value: q.correctness,   color: 'bg-green-500'  },
                                ].map(m => (
                                    <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                                        <p className="text-2xl font-extrabold text-gray-900">{m.value.toFixed(1)}</p>
                                        <p className="text-xs text-gray-400 font-semibold mt-0.5">{m.label}</p>
                                        <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                            <div className={`h-full rounded-full ${m.color}`} style={{ width: `${(m.value / 10) * 100}%` }} />
                                        </div>
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

// ── Interview Detail Panel ────────────────────────────────────────────────────
const InterviewDetail = ({ interview, onClose }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${ServerURL}/api/interview/full/${interview._id}`, getHeaders());
                setDetail(res.data);
            } catch (e) {
                setError(e.response?.data?.error || 'Failed to load interview details.');
            } finally {
                setLoading(false);
            }
        })();
    }, [interview._id]);

    const g = detail ? gradeInfo(detail.finalScore) : null;

    return (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto flex flex-col">

            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <div>
                    <h2 className="font-extrabold text-gray-900 text-lg">{interview.role}</h2>
                    <p className="text-xs text-gray-400 capitalize">{interview.mode} · {interview.experience}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500">
                    <IoCloseCircleOutline className="text-2xl" />
                </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-6">
                {loading && (
                    <div className="space-y-4">
                        {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                    </div>
                )}

                {error && <p className="text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">{error}</p>}

                {detail && (
                    <>
                        {/* Overall Score Card */}
                        <div className={`rounded-3xl border p-6 ${g.bg}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Final Score</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className={`text-6xl font-extrabold ${g.color}`}>{g.grade}</span>
                                        <span className="text-2xl text-gray-500">({detail.finalScore}/10)</span>
                                    </div>
                                </div>
                                <IoTrophyOutline className={`text-5xl opacity-30 ${g.color}`} />
                            </div>
                            <div className="space-y-2">
                                <ScoreBar label="Confidence"    value={detail.avgConfidence}    color="bg-purple-500" />
                                <ScoreBar label="Communication" value={detail.avgCommunication} color="bg-blue-500"   />
                                <ScoreBar label="Correctness"   value={detail.avgCorrectness}   color="bg-green-500"  />
                            </div>
                        </div>

                        {/* Meta info */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            {[
                                { icon: <IoDocumentTextOutline />, label: 'Questions', value: detail.questions.length },
                                { icon: <IoCalendarOutline />,     label: 'Date',      value: new Date(detail.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                                { icon: <IoCheckmarkCircleOutline />, label: 'Status', value: detail.status },
                            ].map(m => (
                                <div key={m.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
                                    <div className="text-indigo-500 flex justify-center text-xl mb-1">{m.icon}</div>
                                    <p className="text-xs text-gray-400 font-semibold">{m.label}</p>
                                    <p className="text-sm font-bold text-gray-800 capitalize">{m.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Questions */}
                        <div>
                            <h3 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                                <IoMicOutline className="text-indigo-500" /> Questions & Answers
                            </h3>
                            <div className="space-y-2">
                                {detail.questions.map((q, i) => (
                                    <QuestionCard key={q._id} q={q} index={i} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

// ── Interview History Card ────────────────────────────────────────────────────
const HistoryCard = ({ interview, onClick }) => {
    const g = gradeInfo(interview.finalScore || 0);
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition group">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                            interview.mode === 'technical' || interview.mode === 'Technical'
                                ? 'bg-blue-100 text-blue-700'
                                : interview.mode === 'behavioral'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-amber-100 text-amber-700'
                        }`}>{interview.mode}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            interview.status === 'completed' || interview.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                        }`}>{interview.status}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition truncate">{interview.role}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                        <span className="flex items-center gap-1"><IoBriefcaseOutline /> {interview.experience} experience</span>
                        <span className="flex items-center gap-1"><IoCalendarOutline />
                            {new Date(interview.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </p>
                </div>

                {/* Grade badge */}
                <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${g.bg}`}>
                    <span className={`text-xl font-extrabold ${g.color}`}>{g.grade}</span>
                    <span className="text-xs text-gray-400">{(interview.finalScore || 0).toFixed(1)}/10</span>
                </div>
            </div>

            {/* Mini score bars */}
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${g.bar}`} style={{ width: `${((interview.finalScore || 0) / 10) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-400 text-right -mt-1">Click to view full details →</p>
            </div>
        </motion.div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const MyInterviewsPage = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [selected, setSelected]     = useState(null);
    const [filter, setFilter]         = useState('all');

    const fetchInterviews = useCallback(async () => {
        try {
            setLoading(true); setError('');
            const res = await axios.get(`${ServerURL}/api/interview/my-interviews`, getHeaders());
            setInterviews(res.data.interviews || []);
        } catch (e) {
            setError('Failed to load interviews. Make sure you are logged in.');
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

    const filtered = interviews.filter(iv => {
        if (filter === 'all') return true;
        return iv.mode?.toLowerCase() === filter;
    });

    const avgScore = interviews.length
        ? (interviews.reduce((s, iv) => s + (iv.finalScore || 0), 0) / interviews.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6 py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-heading font-extrabold tracking-tight mb-1 flex items-center gap-3">
                        <IoMicOutline className="text-indigo-300" /> Interview History
                    </h1>
                    <p className="text-indigo-300 text-sm">All your past AI voice interview sessions with full Q&A breakdowns</p>

                    {/* Summary stats */}
                    {!loading && interviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            {[
                                { label: 'Total Sessions', value: interviews.length,         icon: <IoDocumentTextOutline /> },
                                { label: 'Average Score',  value: `${avgScore}/10`,          icon: <IoStatsChartOutline />   },
                                { label: 'Completed',      value: interviews.filter(iv => iv.status === 'completed' || iv.status === 'Completed').length, icon: <IoCheckmarkCircleOutline /> },
                            ].map(s => (
                                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                                    <span className="text-indigo-300 text-xl">{s.icon}</span>
                                    <div>
                                        <p className="text-xl font-extrabold">{s.value}</p>
                                        <p className="text-xs text-indigo-300">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Filter tabs */}
                <div className="flex items-center gap-3 mb-6">
                    {[
                        { id: 'all',          label: 'All' },
                        { id: 'technical',    label: 'Technical' },
                        { id: 'behavioral',   label: 'Behavioral' },
                        { id: 'system design',label: 'System Design' },
                    ].map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                                filter === f.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                            }`}>
                            {f.label}
                        </button>
                    ))}
                    <button onClick={fetchInterviews} className="ml-auto p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                        <IoRefreshOutline className="text-lg" />
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="space-y-3">
                        {[1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border animate-pulse" />)}
                    </div>
                )}

                {/* Error */}
                {error && <p className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">{error}</p>}

                {/* Empty state */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                            <IoMicOutline className="text-4xl text-indigo-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {filter === 'all' ? 'No interviews yet' : `No ${filter} interviews`}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {filter === 'all'
                                ? 'Complete your first AI voice interview to see results here.'
                                : 'Try a different filter or start a new interview.'}
                        </p>
                        <a href="/interview" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">
                            <IoSparklesOutline /> Start an Interview
                        </a>
                    </div>
                )}

                {/* Interview List */}
                {!loading && filtered.length > 0 && (
                    <div className="space-y-3">
                        {filtered.map((iv, i) => (
                            <motion.div key={iv._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <HistoryCard interview={iv} onClick={() => setSelected(iv)} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Side Panel */}
            <AnimatePresence>
                {selected && (
                    <>
                        {/* Backdrop */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
                        <InterviewDetail interview={selected} onClose={() => setSelected(null)} />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyInterviewsPage;
