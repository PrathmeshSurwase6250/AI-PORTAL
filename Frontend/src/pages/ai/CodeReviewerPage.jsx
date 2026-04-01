import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { ServerURL } from '../../config/server';
import {
    IoCodeSlashOutline, IoSparklesOutline, IoWarningOutline,
    IoCheckmarkCircleOutline, IoShieldCheckmarkOutline,
    IoBugOutline, IoRocketOutline, IoChevronDownOutline,
    IoCopyOutline, IoCheckmarkOutline, IoRefreshOutline,
} from 'react-icons/io5';

const LANGUAGES = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'C#',
    'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'HTML/CSS',
    'Shell/Bash', 'Other',
];

const SEVERITY_CONFIG = {
    critical: { color: 'bg-red-100 text-red-700 border-red-200',    dot: 'bg-red-500',    label: 'Critical' },
    warning:  { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400', label: 'Warning'  },
    info:     { color: 'bg-blue-100 text-blue-700 border-blue-200',  dot: 'bg-blue-400',   label: 'Info'     },
};

const scoreGrade = (s) => {
    if (s >= 9) return { grade: 'A+', bg: 'from-green-400 to-emerald-600' };
    if (s >= 8) return { grade: 'A',  bg: 'from-green-400 to-emerald-500' };
    if (s >= 7) return { grade: 'B+', bg: 'from-blue-400  to-indigo-600'  };
    if (s >= 6) return { grade: 'B',  bg: 'from-blue-400  to-indigo-500'  };
    if (s >= 5) return { grade: 'C',  bg: 'from-amber-400 to-orange-500'  };
    return         { grade: 'D',  bg: 'from-red-400   to-rose-600'    };
};

const CopyBtn = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (
        <button onClick={copy} className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 rounded-lg transition">
            {copied ? <><IoCheckmarkOutline className="text-green-500" /> Copied!</> : <><IoCopyOutline /> Copy</>}
        </button>
    );
};

const Section = ({ icon, title, badge, badgeColor = 'bg-gray-100 text-gray-600', children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="font-bold text-gray-900">{title}</span>
                    {badge !== undefined && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>}
                </div>
                <IoChevronDownOutline className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5 border-t border-gray-100">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CodeReviewerPage = () => {
    const [code, setCode]         = useState('');
    const [language, setLanguage] = useState('JavaScript');
    const [review, setReview]     = useState(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const textareaRef             = useRef(null);

    const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });

    const handleReview = async () => {
        if (!code.trim()) { setError('Please paste some code first.'); return; }
        try {
            setLoading(true); setError(''); setReview(null);
            const res = await axios.post(`${ServerURL}/api/code/review`, { code, language }, getHeaders());
            setReview(res.data.review);
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to get review. Please try again.');
        } finally { setLoading(false); }
    };

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        e.preventDefault();
        const ta = textareaRef.current;
        const start = ta.selectionStart;
        const newCode = code.substring(0, start) + '  ' + code.substring(ta.selectionEnd);
        setCode(newCode);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
    };

    const grade = review ? scoreGrade(review.overall_score) : null;
    const criticalCount = review?.bugs?.filter(b => b.severity === 'critical').length || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-6 py-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
                        <IoCodeSlashOutline className="text-2xl text-indigo-300" />
                    </div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight">AI Code Reviewer</h1>
                </div>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Paste any code and get instant AI-powered review — bugs, security issues, improvements, and a refactored version.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-6">

                    {/* LEFT – Editor */}
                    <div className="flex-1 flex flex-col gap-4">

                        {/* Toolbar */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <select value={language} onChange={e => setLanguage(e.target.value)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg border border-gray-200 focus:outline-none">
                                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                            </select>
                            <span className="text-xs text-gray-400 ml-auto">{code.split('\n').length} lines · {code.length} chars</span>
                            {code && <CopyBtn text={code} />}
                            {code && <button onClick={() => { setCode(''); setReview(null); }} className="text-xs font-bold text-red-400 hover:text-red-600 transition">Clear</button>}
                        </div>

                        {/* Code Editor */}
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 rounded-tl-2xl rounded-bl-2xl flex flex-col items-end py-4 pr-3 overflow-hidden pointer-events-none z-10">
                                {code.split('\n').map((_, i) => (
                                    <span key={i} className="text-xs text-gray-600 font-mono leading-6 select-none">{i + 1}</span>
                                ))}
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                onKeyDown={handleTabKey}
                                placeholder={`// Paste your ${language} code here...\n// Tab key works for indentation\n// Click "Review Code" to get AI feedback`}
                                className="w-full h-[500px] pl-16 pr-4 py-4 bg-gray-900 text-green-300 font-mono text-sm rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none leading-6 placeholder-gray-600"
                                spellCheck={false}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                                <IoWarningOutline /> {error}
                            </div>
                        )}

                        <button onClick={handleReview} disabled={loading || !code.trim()}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-lg rounded-2xl hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3">
                            {loading
                                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing Code…</>
                                : <><IoSparklesOutline className="text-yellow-300 text-xl" /> Review Code with AI</>}
                        </button>
                    </div>

                    {/* RIGHT – Results */}
                    <div className="w-[460px] shrink-0 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-180px)] pb-6">

                        {!review && !loading && (
                            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center flex flex-col items-center">
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5">
                                    <IoCodeSlashOutline className="text-indigo-300 text-4xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Review</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Paste your code on the left and click review to get instant AI feedback.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl border p-6 animate-pulse">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-20 h-20 rounded-full bg-gray-100 shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded w-full" />
                                            <div className="h-3 bg-gray-100 rounded w-5/6" />
                                        </div>
                                    </div>
                                </div>
                                {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border animate-pulse" />)}
                                <p className="text-center text-sm text-indigo-600 font-medium animate-pulse flex items-center justify-center gap-2">
                                    <IoSparklesOutline /> AI is reading your code carefully…
                                </p>
                            </div>
                        )}

                        {review && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">

                                {/* Score */}
                                <div className={`bg-gradient-to-br ${grade.bg} rounded-3xl p-6 text-white shadow-lg`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold opacity-80 mb-1">Code Quality</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-7xl font-extrabold">{grade.grade}</span>
                                                <span className="text-2xl opacity-70">({review.overall_score}/10)</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 text-right text-sm">
                                            <div className="bg-white/20 rounded-xl px-3 py-2">
                                                <p className="text-xs opacity-70">Complexity</p>
                                                <p className="font-bold">{review.complexity || '—'}</p>
                                            </div>
                                            <div className="bg-white/20 rounded-xl px-3 py-2">
                                                <p className="text-xs opacity-70">Maintainability</p>
                                                <p className="font-bold">{review.maintainability || '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed opacity-90">{review.summary}</p>
                                </div>

                                {/* Bugs */}
                                {review.bugs?.length > 0 && (
                                    <Section icon={<IoBugOutline />} title="Bugs Found" badge={review.bugs.length}
                                        badgeColor={criticalCount > 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                                        <div className="space-y-3 mt-4">
                                            {review.bugs.map((bug, i) => {
                                                const cfg = SEVERITY_CONFIG[bug.severity] || SEVERITY_CONFIG.info;
                                                return (
                                                    <div key={i} className={`border rounded-xl p-4 ${cfg.color}`}>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                                            <span className="text-xs font-bold uppercase tracking-wide">{cfg.label}</span>
                                                            {bug.line && <span className="text-xs font-mono bg-white/50 px-1.5 py-0.5 rounded ml-auto">Line {bug.line}</span>}
                                                        </div>
                                                        <p className="text-sm font-semibold">{bug.issue}</p>
                                                        {bug.fix && <p className="text-xs mt-1.5 opacity-80">✅ Fix: {bug.fix}</p>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Section>
                                )}

                                {/* Security */}
                                {review.security_issues?.length > 0 && (
                                    <Section icon={<IoShieldCheckmarkOutline />} title="Security Issues" badge={review.security_issues.length} badgeColor="bg-red-100 text-red-700">
                                        <div className="space-y-3 mt-4">
                                            {review.security_issues.map((s, i) => (
                                                <div key={i} className="border border-red-100 bg-red-50 rounded-xl p-4">
                                                    <p className="text-sm font-semibold text-red-800">{s.issue}</p>
                                                    {s.fix && <p className="text-xs text-red-600 mt-1.5">✅ Fix: {s.fix}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* Improvements */}
                                {review.improvements?.length > 0 && (
                                    <Section icon={<IoRocketOutline />} title="Improvements" badge={review.improvements.length} badgeColor="bg-indigo-100 text-indigo-700">
                                        <div className="space-y-3 mt-4">
                                            {review.improvements.map((imp, i) => (
                                                <div key={i} className="border border-indigo-100 bg-indigo-50 rounded-xl p-4">
                                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">{imp.area}</p>
                                                    <p className="text-sm text-indigo-900">{imp.suggestion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {/* Best Practices */}
                                {review.best_practices?.length > 0 && (
                                    <Section icon={<IoCheckmarkCircleOutline />} title="Best Practices" defaultOpen={false}>
                                        <ul className="space-y-2 mt-4">
                                            {review.best_practices.map((p, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <IoCheckmarkCircleOutline className="text-green-500 mt-0.5 shrink-0" /> {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </Section>
                                )}

                                {/* Refactored Code */}
                                {review.refactored_snippet && (
                                    <Section icon={<IoCodeSlashOutline />} title="Refactored Code" defaultOpen={false}>
                                        <div className="mt-4 relative">
                                            <div className="absolute top-3 right-3 z-10"><CopyBtn text={review.refactored_snippet} /></div>
                                            <pre className="bg-gray-900 text-green-300 font-mono text-xs rounded-xl p-4 overflow-x-auto leading-6 whitespace-pre-wrap">
                                                {review.refactored_snippet}
                                            </pre>
                                        </div>
                                    </Section>
                                )}

                                <button onClick={() => setReview(null)} className="flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition text-sm">
                                    <IoRefreshOutline /> Review Again
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeReviewerPage;
