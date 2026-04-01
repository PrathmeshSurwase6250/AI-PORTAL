import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyResumes, deleteResume, updateResume, getAiSuggestions } from '../../services/resumeApi';
import {
    IoDocumentTextOutline,
    IoTrashOutline,
    IoEyeOutline,
    IoPencilOutline,
    IoCloseOutline,
    IoAddOutline,
    IoPersonOutline,
    IoCodeSlashOutline,
    IoSchoolOutline,
    IoBriefcaseOutline,
    IoRibbonOutline,
    IoCheckmarkDoneOutline,
    IoSaveOutline,
    IoSparklesOutline,
    IoCheckmarkCircleOutline,
    IoWarningOutline,
    IoArrowUpOutline,
} from 'react-icons/io5';

// ─── Small helpers ────────────────────────────────────────────────────────────

const Tag = ({ text }) => (
    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
        {text}
    </span>
);

const SectionHeading = ({ icon, title }) => (
    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider mt-6 mb-3 pb-2 border-b border-gray-100">
        {icon} {title}
    </h3>
);

// ─── View / Edit modal ────────────────────────────────────────────────────────

const ResumeModal = ({ resume, onClose, onUpdated }) => {
    const [editMode, setEditMode] = useState(false);
    const [aiTab, setAiTab] = useState(false);          // toggle between Details / AI panels
    const [aiData, setAiData] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const handleGetSuggestions = async () => {
        if (aiData) { setAiTab(true); return; }         // already fetched
        try {
            setAiLoading(true);
            setAiError('');
            setAiTab(true);
            const res = await getAiSuggestions(resume._id);
            setAiData(res.suggestions);
        } catch (e) {
            setAiError('Failed to get suggestions. Check your AI API key and try again.');
        } finally {
            setAiLoading(false);
        }
    };
    const [saving, setSaving] = useState(false);

    // Editable draft – keep the same shape as the schema
    const [draft, setDraft] = useState(resume);

    // Helpers to update nested values
    const set = (path, value) => {
        setDraft(prev => {
            const next = { ...prev };
            const parts = path.split('.');
            let cur = next;
            for (let i = 0; i < parts.length - 1; i++) {
                cur[parts[i]] = { ...cur[parts[i]] };
                cur = cur[parts[i]];
            }
            cur[parts[parts.length - 1]] = value;
            return next;
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateResume(resume._id, draft);
            onUpdated(draft);
            setEditMode(false);
        } catch (e) {
            console.error(e);
            alert('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const pi = draft.personal_Information || {};
    const skills = draft.technical_skills || {};

    return (
        <div className="fixed inset-0 z-[200] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-heading font-extrabold text-gray-900">
                            {editMode ? '✏️ Edit Resume' : '📄 Resume Details'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-0.5">{pi.full_Name || 'Untitled'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Tab Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button onClick={() => { setAiTab(false); setEditMode(false); }} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${!aiTab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Details</button>
                        <button onClick={handleGetSuggestions} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1 ${aiTab ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:text-indigo-600'}`}>
                            <IoSparklesOutline /> AI Suggestions
                        </button>
                    </div>
                    {!aiTab && (
                        editMode ? (
                            <>
                                <button onClick={() => { setDraft(resume); setEditMode(false); }} className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-50 transition">
                                    <IoSaveOutline /> {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-100 transition">
                                <IoPencilOutline /> Edit
                            </button>
                        )
                    )}
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
                            <IoCloseOutline size={22} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-1 flex-1">

                {/* ══ AI SUGGESTIONS PANEL ══ */}
                {aiTab && (
                    <div>
                        {aiLoading && (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                                    <IoSparklesOutline className="absolute inset-0 m-auto text-indigo-500 text-2xl" />
                                </div>
                                <p className="text-gray-500 font-medium animate-pulse">Analyzing your resume with AI…</p>
                            </div>
                        )}
                        {aiError && !aiLoading && (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                                <IoWarningOutline className="text-red-400 text-3xl mx-auto mb-2" />
                                <p className="text-red-600 font-medium text-sm">{aiError}</p>
                                <button onClick={handleGetSuggestions} className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition">Retry</button>
                            </div>
                        )}
                        {aiData && !aiLoading && (
                            <div className="space-y-6">
                                {/* Score Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white text-center">
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Overall Score</p>
                                        <p className="text-5xl font-extrabold">{aiData.overall_score}<span className="text-2xl opacity-70">/10</span></p>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white text-center">
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">ATS Score</p>
                                        <p className="text-5xl font-extrabold">{aiData.ats_score}<span className="text-2xl opacity-70">%</span></p>
                                    </div>
                                </div>

                                {/* Summary Tip */}
                                {aiData.summary_tip && (
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                                        <IoSparklesOutline className="text-indigo-500 text-xl shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-indigo-800 text-sm mb-1">Summary Tip</p>
                                            <p className="text-indigo-700 text-sm leading-relaxed">{aiData.summary_tip}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Strengths */}
                                {aiData.strengths?.length > 0 && (
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5"><IoCheckmarkCircleOutline className="text-green-500" /> Strengths</p>
                                        <ul className="space-y-2">
                                            {aiData.strengths.map((s, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 rounded-xl px-3 py-2">
                                                    <IoCheckmarkCircleOutline className="text-green-500 shrink-0 mt-0.5" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Improvements */}
                                {aiData.improvements?.length > 0 && (
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5"><IoArrowUpOutline className="text-amber-500" /> Improvements</p>
                                        <div className="space-y-2">
                                            {aiData.improvements.map((imp, i) => (
                                                <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                                    <p className="font-bold text-amber-800 text-xs uppercase tracking-wide mb-0.5">{imp.area}</p>
                                                    <p className="text-sm text-amber-700">{imp.tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills to Add */}
                                {aiData.skills_to_add?.length > 0 && (
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm mb-2">💡 Recommended Skills to Add</p>
                                        <div className="flex flex-wrap gap-2">
                                            {aiData.skills_to_add.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold">+ {s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Missing Sections */}
                                {aiData.missing_sections?.length > 0 && (
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5"><IoWarningOutline className="text-red-400" /> Missing Sections</p>
                                        <div className="flex flex-wrap gap-2">
                                            {aiData.missing_sections.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Verbs */}
                                {aiData.action_verbs?.length > 0 && (
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm mb-2">🔤 Power Verbs to Use</p>
                                        <div className="flex flex-wrap gap-2">
                                            {aiData.action_verbs.map((v, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{v}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ══ DETAILS PANEL (only when not AI tab) ══ */}
                {!aiTab && (
                    <>
                    {/* ── Personal Info ── */}
                    <SectionHeading icon={<IoPersonOutline />} title="Personal Information" />
                    {editMode ? (
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                ['Full Name', 'personal_Information.full_Name', pi.full_Name],
                                ['Email', 'personal_Information.email', pi.email],
                                ['Phone', 'personal_Information.phone_number', pi.phone_number],
                                ['City', 'personal_Information.city', pi.city],
                            ].map(([label, path, val]) => (
                                <div key={path}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
                                    <input
                                        value={val || ''}
                                        onChange={e => set(path, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Name', pi.full_Name], ['Email', pi.email], ['Phone', pi.phone_number], ['City', pi.city]].map(([l, v]) => (
                                v ? <p key={l}><span className="font-semibold text-gray-600">{l}:</span> <span className="text-gray-800">{v}</span></p> : null
                            ))}
                        </div>
                    )}

                    {/* ── Career Objective ── */}
                    <SectionHeading icon={<IoRibbonOutline />} title="Professional Summary" />
                    {editMode ? (
                        <textarea
                            rows={4}
                            value={draft.career_Objective || ''}
                            onChange={e => set('career_Objective', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none"
                        />
                    ) : (
                        <p className="text-sm text-gray-700 leading-relaxed italic">
                            {draft.career_Objective || <span className="text-gray-400">No summary provided.</span>}
                        </p>
                    )}

                    {/* ── Technical Skills ── */}
                    <SectionHeading icon={<IoCodeSlashOutline />} title="Technical Skills" />
                    {editMode ? (
                        <div className="grid grid-cols-2 gap-3">
                            {['programming_language', 'frontend', 'backend', 'database', 'tools'].map(key => (
                                <div key={key}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 capitalize">{key.replace('_', ' ')}</label>
                                    <input
                                        value={(skills[key] || []).join(', ')}
                                        onChange={e => set(`technical_skills.${key}`, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                        placeholder="Comma separated…"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {[...(skills.programming_language || []), ...(skills.frontend || []), ...(skills.backend || []), ...(skills.database || []), ...(skills.tools || [])]
                                .filter(Boolean)
                                .map((s, i) => <Tag key={i} text={s} />)}
                            {!Object.values(skills).flat().length && <p className="text-gray-400 text-sm">No skills listed.</p>}
                        </div>
                    )}

                    {/* ── Education ── */}
                    {draft.education?.length > 0 && (
                        <>
                            <SectionHeading icon={<IoSchoolOutline />} title="Education" />
                            <div className="space-y-3">
                                {draft.education.map((edu, i) => (
                                    <div key={i} className="flex justify-between items-start text-sm">
                                        <div>
                                            <p className="font-bold text-gray-900">{edu.degree}</p>
                                            <p className="text-gray-500">{edu.college}</p>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── Experience ── */}
                    {draft.experience?.length > 0 && (
                        <>
                            <SectionHeading icon={<IoBriefcaseOutline />} title="Work Experience" />
                            <div className="space-y-4">
                                {draft.experience.map((exp, i) => (
                                    <div key={i} className="border-l-4 border-indigo-200 pl-4 text-sm">
                                        <p className="font-bold text-gray-900">{exp.role}</p>
                                        <p className="text-indigo-600 font-semibold">{exp.company_Name} <span className="text-gray-400 font-normal">· {exp.duration}</span></p>
                                        {exp.work_description && <p className="text-gray-600 mt-1 leading-relaxed">{exp.work_description}</p>}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── Achievements ── */}
                    {draft.achievements?.length > 0 && (
                        <>
                            <SectionHeading icon={<IoCheckmarkDoneOutline />} title="Achievements" />
                            <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                                {draft.achievements.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </>
                    )}
                    </>
                )}
                </div>
            </motion.div>
        </div>
    );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

const DeleteModal = ({ resume, onClose, onDeleted }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteResume(resume._id);
            onDeleted(resume._id);
            onClose();
        } catch (e) {
            console.error(e);
            alert('Failed to delete.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center"
            >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <IoTrashOutline className="text-red-500 text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Resume?</h2>
                <p className="text-gray-500 text-sm mb-8">
                    This will permanently delete the resume for <strong>{resume.personal_Information?.full_Name || 'this profile'}</strong>. This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition">
                        {loading ? 'Deleting…' : 'Yes, Delete'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const MyResumesPage = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewResume, setViewResume] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchResumes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMyResumes();
            setResumes(data.resumes || []);
        } catch {
            setResumes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchResumes(); }, [fetchResumes]);

    const handleUpdated = (updatedResume) => {
        setResumes(prev => prev.map(r => r._id === updatedResume._id ? { ...r, ...updatedResume } : r));
        setViewResume(prev => prev ? { ...prev, ...updatedResume } : prev);
    };

    const handleDeleted = (id) => {
        setResumes(prev => prev.filter(r => r._id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">My Resumes</h1>
                        <p className="text-gray-500 mt-1">View, edit or delete your saved resume profiles.</p>
                    </div>
                    <Link
                        to="/ai-resume"
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20"
                    >
                        <IoAddOutline size={20} />
                        Build New Resume
                    </Link>
                </div>

                {/* Resume Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-48" />
                        ))}
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-20 shadow-sm text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                            <IoDocumentTextOutline className="text-gray-300 text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Resumes Yet</h3>
                        <p className="text-gray-500 text-sm mb-6">Create your first AI-powered resume to get started.</p>
                        <Link to="/ai-resume" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md">
                            <IoAddOutline /> Build Your First Resume
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resumes.map((resume, idx) => {
                            const pi = resume.personal_Information || {};
                            const skills = [
                                ...(resume.technical_skills?.programming_language || []),
                                ...(resume.technical_skills?.frontend || []),
                                ...(resume.technical_skills?.backend || []),
                            ].filter(Boolean).slice(0, 5);

                            return (
                                <motion.div
                                    key={resume._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.07 }}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 hover:border-indigo-200 hover:shadow-md transition-all group"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
                                            {(pi.full_Name || 'R')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">
                                                {pi.full_Name || 'Untitled Resume'}
                                            </h2>
                                            <p className="text-gray-500 text-sm truncate">{pi.email || '—'}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Saved {new Date(resume.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    {resume.career_Objective && (
                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 italic bg-gray-50 px-3 py-2 rounded-xl">
                                            "{resume.career_Objective}"
                                        </p>
                                    )}

                                    {/* Skill Tags */}
                                    {skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {skills.map((s, i) => <Tag key={i} text={s} />)}
                                            {[
                                                ...(resume.technical_skills?.programming_language || []),
                                                ...(resume.technical_skills?.frontend || []),
                                                ...(resume.technical_skills?.backend || []),
                                            ].length > 5 && (
                                                <span className="px-2.5 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                                                    +{[...(resume.technical_skills?.programming_language || []), ...(resume.technical_skills?.frontend || []), ...(resume.technical_skills?.backend || [])].length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
                                        <button
                                            onClick={() => setViewResume(resume)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition"
                                        >
                                            <IoEyeOutline /> View
                                        </button>
                                        <button
                                            onClick={() => { setViewResume(resume); }}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition"
                                        >
                                            <IoPencilOutline /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(resume)}
                                            className="px-4 flex items-center justify-center border border-red-100 text-red-500 font-bold text-sm rounded-xl hover:bg-red-50 transition"
                                        >
                                            <IoTrashOutline />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {viewResume && (
                    <ResumeModal
                        resume={viewResume}
                        onClose={() => setViewResume(null)}
                        onUpdated={handleUpdated}
                    />
                )}
                {deleteTarget && (
                    <DeleteModal
                        resume={deleteTarget}
                        onClose={() => setDeleteTarget(null)}
                        onDeleted={handleDeleted}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyResumesPage;
