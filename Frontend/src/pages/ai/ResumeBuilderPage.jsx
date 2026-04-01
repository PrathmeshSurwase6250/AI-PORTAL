import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import {
    IoDownloadOutline, IoSaveOutline, IoChevronDownOutline,
    IoAddCircleOutline, IoTrashOutline, IoSparklesOutline,
    IoCheckmarkCircleOutline, IoWarningOutline, IoArrowUpOutline,
} from 'react-icons/io5';

import TemplateModern   from '../../components/ResumeTemplates/TemplateModern';
import TemplateCreative from '../../components/ResumeTemplates/TemplateCreative';
import TemplateATS      from '../../components/ResumeTemplates/TemplateATS';

import { createResume } from '../../services/resumeApi';
import { ServerURL }    from '../../config/server';

// ── Shared helpers ─────────────────────────────────────────────────────────────
const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true,
});

// ── Small reusable "⚡ Generate" button ────────────────────────────────────────
const GenBtn = ({ loading, onClick, label = 'Generate' }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50 shrink-0"
    >
        {loading
            ? <div className="w-3 h-3 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            : <IoSparklesOutline />
        }
        {loading ? 'Generating…' : label}
    </button>
);

// ── Accordion ─────────────────────────────────────────────────────────────────
const AccordionTab = ({ id, title, children, activeTab, setActiveTab }) => (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden bg-white">
        <button
            type="button"
            onClick={() => setActiveTab(activeTab === id ? '' : id)}
            className="w-full px-5 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
        >
            <span className="font-bold text-gray-800">{title}</span>
            <IoChevronDownOutline className={`transition-transform ${activeTab === id ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
            {activeTab === id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 border-t border-gray-200">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// ── AI field-generate call ─────────────────────────────────────────────────────
const generateField = async (field, context) => {
    const res = await axios.post(`${ServerURL}/api/resume/ai-generate`, { field, context }, getHeaders());
    return res.data.content;
};

// ── Real-time AI Suggestions Panel ────────────────────────────────────────────
const AISuggestionsPanel = ({ formData }) => {
    const [aiData, setAiData]   = useState(null);
    const [status, setStatus]   = useState('idle');
    const debounceRef           = useRef(null);
    const prevDataRef           = useRef('');

    const getSnapshot = useCallback((fd) => {
        const pi = fd.personal_Information || {};
        const sk = fd.technical_skills || {};
        return JSON.stringify({
            name: pi.full_Name, summary: fd.career_Objective,
            skills: [...(sk.programming_language||[]), ...(sk.frontend||[]), ...(sk.backend||[])],
            edu: fd.education?.length, exp: fd.experience?.length,
            proj: fd.project?.length, achieve: fd.achievements?.length,
        });
    }, []);

    const analyse = useCallback(async (fd) => {
        try {
            setStatus('loading');
            const res = await axios.post(`${ServerURL}/api/resume/ai-realtime`, { formData: fd }, getHeaders());
            setAiData(res.data.suggestions);
            setStatus('done');
        } catch (err) {
            console.error('Realtime AI error:', err.response?.data || err.message);
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        const snap = getSnapshot(formData);
        if (snap === prevDataRef.current) return;
        prevDataRef.current = snap;
        clearTimeout(debounceRef.current);
        const pi = formData.personal_Information || {};
        if (!pi.full_Name && !formData.career_Objective) return;
        setStatus('loading');
        debounceRef.current = setTimeout(() => analyse(formData), 2200);
        return () => clearTimeout(debounceRef.current);
    }, [formData, analyse, getSnapshot]);

    const scoreColor = (s) => s >= 8 ? 'text-green-600' : s >= 5 ? 'text-amber-500' : 'text-red-500';
    const atsColor   = (s) => s >= 75 ? 'bg-green-500' : s >= 50 ? 'bg-amber-400' : 'bg-red-400';

    return (
        <div className="w-[260px] shrink-0 flex flex-col gap-3 overflow-y-auto pb-20">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <IoSparklesOutline className="text-yellow-300 text-lg" />
                    <h3 className="font-bold text-sm">Live AI Coach</h3>
                    {status === 'loading' && <div className="ml-auto w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {status === 'done'    && <IoCheckmarkCircleOutline className="ml-auto text-green-300" />}
                </div>
                <p className="text-xs text-white/70">
                    {status === 'idle'    && 'Start typing to get live feedback…'}
                    {status === 'loading' && 'Analyzing your resume…'}
                    {status === 'done'    && 'Auto-updates as you type'}
                    {status === 'error'   && 'AI unavailable — check API key'}
                </p>
            </div>

            {aiData && (
                <motion.div key={JSON.stringify(aiData)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-2xl border p-3 text-center shadow-sm">
                            <p className="text-xs text-gray-400 font-semibold mb-0.5">Score</p>
                            <p className={`text-3xl font-extrabold ${scoreColor(aiData.score)}`}>{aiData.score}<span className="text-sm text-gray-400">/10</span></p>
                        </div>
                        <div className="bg-white rounded-2xl border p-3 text-center shadow-sm">
                            <p className="text-xs text-gray-400 font-semibold mb-0.5">ATS</p>
                            <p className={`text-3xl font-extrabold ${scoreColor(Math.round(aiData.ats/10))}`}>{aiData.ats}<span className="text-sm text-gray-400">%</span></p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border p-3 shadow-sm">
                        <p className="text-xs font-bold text-gray-500 mb-2">ATS Bar</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div className={`h-full rounded-full ${atsColor(aiData.ats)}`} initial={{ width: 0 }} animate={{ width: `${aiData.ats}%` }} transition={{ duration: 0.6 }} />
                        </div>
                    </div>

                    {aiData.quick_wins?.length > 0 && (
                        <div className="bg-white rounded-2xl border p-3 shadow-sm">
                            <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5"><IoArrowUpOutline className="text-amber-500" /> Quick Wins</p>
                            <ul className="space-y-1.5">
                                {aiData.quick_wins.map((tip, i) => (
                                    <li key={i} className="text-xs text-gray-600 bg-amber-50 rounded-lg px-2.5 py-2 border border-amber-100">{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {aiData.missing?.length > 0 && (
                        <div className="bg-white rounded-2xl border p-3 shadow-sm">
                            <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5"><IoWarningOutline className="text-red-400" /> Missing</p>
                            <div className="flex flex-wrap gap-1.5">
                                {aiData.missing.map((item, i) => (
                                    <span key={i} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-full font-semibold">{item}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {aiData.skills_to_add?.length > 0 && (
                        <div className="bg-white rounded-2xl border p-3 shadow-sm">
                            <p className="text-xs font-bold text-gray-700 mb-2">💡 Add Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                                {aiData.skills_to_add.map((s, i) => (
                                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-full font-semibold">+ {s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {status === 'idle' && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                    <IoSparklesOutline className="text-gray-200 text-4xl mx-auto mb-2" />
                    <p className="text-xs text-gray-400 leading-relaxed">Fill in your name or summary and AI feedback appears automatically.</p>
                </div>
            )}
            {status === 'loading' && !aiData && (
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl border animate-pulse" />)}
                </div>
            )}
        </div>
    );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const ResumeBuilderPage = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [activeTab, setActiveTab]               = useState('personal');
    const [isSaving, setIsSaving]                 = useState(false);
    const [genLoading, setGenLoading]             = useState({}); // { fieldKey: true/false }
    const printRef = useRef(null);

    const [formData, setFormData] = useState({
        personal_Information: { full_Name: '', phone_number: '', email: '', city: '', linkedin_Profile: { url: '' }, github: { url: '' } },
        career_Objective: '',
        technical_skills: { programming_language: [], frontend: [], backend: [], database: [], tools: [] },
        education: [], project: [], experience: [], certifications: [], achievements: [], softSkills: [], languages: []
    });

    // ── Form helpers ───────────────────────────────────────────────────────────
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        if (name === 'linkedin_Profile' || name === 'github') {
            setFormData({ ...formData, personal_Information: { ...formData.personal_Information, [name]: { url: value } } });
        } else {
            setFormData({ ...formData, personal_Information: { ...formData.personal_Information, [name]: value } });
        }
    };
    const addArrayItem    = (key, shape) => setFormData({ ...formData, [key]: [...formData[key], shape] });
    const removeArrayItem = (key, idx)   => { const a = [...formData[key]]; a.splice(idx, 1); setFormData({ ...formData, [key]: a }); };
    const updateArrayItem = (key, idx, field, val) => { const a = [...formData[key]]; a[idx][field] = val; setFormData({ ...formData, [key]: a }); };
    const handleCommaArrayChange = (key, subKey, value) => {
        const arr = value.split(',').map(s => s.trim()).filter(Boolean);
        if (subKey) setFormData({ ...formData, [key]: { ...formData[key], [subKey]: arr } });
        else        setFormData({ ...formData, [key]: arr });
    };

    // ── AI generate helper ─────────────────────────────────────────────────────
    const loadKey = (k, v) => setGenLoading(p => ({ ...p, [k]: v }));

    const skills = [
        ...(formData.technical_skills.programming_language || []),
        ...(formData.technical_skills.frontend || []),
        ...(formData.technical_skills.backend  || []),
    ].join(', ');

    const handleGenSummary = async () => {
        loadKey('summary', true);
        try {
            const role = formData.experience[0]?.role || '';
            const text = await generateField('summary', {
                name: formData.personal_Information.full_Name, role, skills,
                experience: formData.experience.length > 0 ? `${formData.experience.length} jobs` : 'fresher',
            });
            setFormData(p => ({ ...p, career_Objective: text }));
        } catch (e) { alert('AI failed: ' + (e.response?.data?.message || e.message)); }
        finally { loadKey('summary', false); }
    };

    const handleGenObjective = async () => {
        loadKey('objective', true);
        try {
            const role = formData.experience[0]?.role || 'Software Developer';
            const text = await generateField('career_objective', { role, skills });
            setFormData(p => ({ ...p, career_Objective: text }));
        } catch (e) { alert('AI failed'); }
        finally { loadKey('objective', false); }
    };

    const handleGenWorkDesc = async (idx) => {
        const key = `work_${idx}`;
        loadKey(key, true);
        try {
            const exp = formData.experience[idx];
            const text = await generateField('work_description', {
                role: exp.role, company: exp.company_Name, duration: exp.duration, extra: skills,
            });
            updateArrayItem('experience', idx, 'work_description', text);
        } catch (e) { alert('AI failed'); }
        finally { loadKey(key, false); }
    };

    const handleGenAchievements = async () => {
        loadKey('achieve', true);
        try {
            const role = formData.experience[0]?.role || 'Software Developer';
            const text = await generateField('achievements', { role, skills });
            setFormData(p => ({ ...p, achievements: text.split(',').map(s => s.trim()).filter(Boolean) }));
        } catch (e) { alert('AI failed'); }
        finally { loadKey('achieve', false); }
    };

    const handleGenSkills = async () => {
        loadKey('skills', true);
        try {
            const role = formData.experience[0]?.role || 'Software Developer';
            const text = await generateField('skills', { role });
            const arr  = text.split(',').map(s => s.trim()).filter(Boolean);
            setFormData(p => ({ ...p, technical_skills: { ...p.technical_skills, programming_language: arr.slice(0, 5), frontend: arr.slice(5, 8), backend: arr.slice(8) } }));
        } catch (e) { alert('AI failed'); }
        finally { loadKey('skills', false); }
    };

    // ── Actions ────────────────────────────────────────────────────────────────
    const handlePrint = () => {
        const html = printRef.current.innerHTML;
        const orig = document.body.innerHTML;
        document.body.innerHTML = html;
        window.print();
        document.body.innerHTML = orig;
        window.location.reload();
    };
    const handleSave = async () => {
        try { setIsSaving(true); await createResume(formData); alert('Saved!'); }
        catch (e) { alert('Failed to save.'); }
        finally { setIsSaving(false); }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-4 pb-10 px-4 md:px-6">

            {/* ── Toolbar ─────────────────────────────────────────────────────── */}
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 mb-5 flex justify-between items-center z-10">
                <div>
                    <h1 className="text-xl font-heading font-extrabold text-gray-900 tracking-tight">AI Resume Studio</h1>
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <IoSparklesOutline className="text-indigo-500" /> ⚡ Generate buttons fill any field instantly with AI
                    </span>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['modern', 'creative', 'ats'].map(tpl => (
                            <button key={tpl} onClick={() => setSelectedTemplate(tpl)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition ${selectedTemplate === tpl ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>
                                {tpl}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={isSaving} className="px-4 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition flex items-center gap-2 text-sm">
                        {isSaving ? 'Saving…' : <><IoSaveOutline /> Save</>}
                    </button>
                    <button onClick={handlePrint} className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-md shadow-indigo-500/20 text-sm">
                        <IoDownloadOutline /> PDF
                    </button>
                </div>
            </div>

            {/* ── Three-column Layout ──────────────────────────────────────────── */}
            <div className="flex gap-5 h-[calc(100vh-130px)]">

                {/* LEFT: Editor */}
                <div className="w-[310px] shrink-0 overflow-y-auto pr-1 custom-scrollbar pb-20">

                    {/* ── Personal Info ── */}
                    <AccordionTab id="personal" title="Personal Details" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">Full Name</label>
                                <input type="text" name="full_Name" value={formData.personal_Information.full_Name} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">Email</label>
                                    <input type="email" name="email" value={formData.personal_Information.email} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">Phone</label>
                                    <input type="text" name="phone_number" value={formData.personal_Information.phone_number} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">City</label>
                                <input type="text" name="city" value={formData.personal_Information.city} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">LinkedIn URL</label>
                                <input type="text" name="linkedin_Profile" value={formData.personal_Information.linkedin_Profile?.url} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                            </div>
                        </div>
                    </AccordionTab>

                    {/* ── Professional Summary ── */}
                    <AccordionTab id="objective" title="Professional Summary" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-gray-600">Summary</label>
                            <div className="flex gap-2">
                                <GenBtn loading={genLoading.summary}   onClick={handleGenSummary}   label="From Experience" />
                                <GenBtn loading={genLoading.objective} onClick={handleGenObjective} label="Fresh Grad" />
                            </div>
                        </div>
                        {(genLoading.summary || genLoading.objective) && (
                            <div className="mb-2 text-xs text-indigo-600 flex items-center gap-1.5 animate-pulse">
                                <IoSparklesOutline /> AI is writing your summary…
                            </div>
                        )}
                        <textarea
                            rows="5"
                            value={formData.career_Objective}
                            onChange={(e) => setFormData({ ...formData, career_Objective: e.target.value })}
                            className="w-full p-3 border rounded-lg bg-gray-50 text-sm"
                            placeholder="Click ⚡ Generate above or type your own summary…"
                        />
                    </AccordionTab>

                    {/* ── Work Experience ── */}
                    <AccordionTab id="experience" title="Work Experience" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-5">
                            {formData.experience.map((exp, idx) => (
                                <div key={idx} className="p-3 border border-gray-100 bg-gray-50 rounded-xl relative">
                                    <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><IoTrashOutline /></button>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <input placeholder="Job Title" value={exp.role} onChange={e => updateArrayItem('experience', idx, 'role', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                        <input placeholder="Company" value={exp.company_Name} onChange={e => updateArrayItem('experience', idx, 'company_Name', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                    </div>
                                    <input placeholder="Duration (e.g. Jan 2020 – Present)" value={exp.duration} onChange={e => updateArrayItem('experience', idx, 'duration', e.target.value)} className="w-full p-2 border rounded-lg mb-2 text-sm" />
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-bold text-gray-500">Description</label>
                                        <GenBtn loading={genLoading[`work_${idx}`]} onClick={() => handleGenWorkDesc(idx)} label="⚡ Auto-fill" />
                                    </div>
                                    <textarea placeholder="Click ⚡ Auto-fill or describe your responsibilities…" rows="3" value={exp.work_description} onChange={e => updateArrayItem('experience', idx, 'work_description', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('experience', { role: '', company_Name: '', duration: '', work_description: '' })} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center gap-2 text-sm">
                                <IoAddCircleOutline /> Add Experience
                            </button>
                        </div>
                    </AccordionTab>

                    {/* ── Education ── */}
                    <AccordionTab id="education" title="Education" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-5">
                            {formData.education.map((edu, idx) => (
                                <div key={idx} className="p-3 border border-gray-100 bg-gray-50 rounded-xl relative">
                                    <button onClick={() => removeArrayItem('education', idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><IoTrashOutline /></button>
                                    <input placeholder="Degree" value={edu.degree} onChange={e => updateArrayItem('education', idx, 'degree', e.target.value)} className="w-full p-2 border rounded-lg mb-2 text-sm" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input placeholder="College/University" value={edu.college} onChange={e => updateArrayItem('education', idx, 'college', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                        <input placeholder="Year" value={edu.year} onChange={e => updateArrayItem('education', idx, 'year', e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('education', { degree: '', college: '', year: '' })} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center gap-2 text-sm">
                                <IoAddCircleOutline /> Add Education
                            </button>
                        </div>
                    </AccordionTab>

                    {/* ── Skills & Achievements ── */}
                    <AccordionTab id="skills" title="Skills & Achievements" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-gray-600">Programming Languages</label>
                                    <GenBtn loading={genLoading.skills} onClick={handleGenSkills} label="⚡ Auto-fill All" />
                                </div>
                                <input type="text" placeholder="e.g. JavaScript, Python" value={formData.technical_skills.programming_language?.join(', ')} onChange={e => handleCommaArrayChange('technical_skills', 'programming_language', e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">Frontend</label>
                                <input type="text" placeholder="e.g. React, Vue" value={formData.technical_skills.frontend?.join(', ')} onChange={e => handleCommaArrayChange('technical_skills', 'frontend', e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">Backend</label>
                                <input type="text" placeholder="e.g. Node.js, Express" value={formData.technical_skills.backend?.join(', ')} onChange={e => handleCommaArrayChange('technical_skills', 'backend', e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-gray-600">Achievements</label>
                                    <GenBtn loading={genLoading.achieve} onClick={handleGenAchievements} label="⚡ Generate" />
                                </div>
                                <textarea rows="3" placeholder="Click ⚡ Generate or type your achievements…" value={formData.achievements?.join(', ')} onChange={e => handleCommaArrayChange('achievements', null, e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 text-sm" />
                            </div>
                        </div>
                    </AccordionTab>
                </div>

                {/* CENTER: Live Preview */}
                <div className="flex-1 overflow-y-auto bg-gray-400 p-6 rounded-2xl flex justify-center custom-scrollbar">
                    <div ref={printRef} className="w-[816px] min-h-[1056px] shadow-2xl bg-white origin-top box-border scale-[0.55] sm:scale-[0.7] lg:scale-90 transition-transform">
                        {selectedTemplate === 'modern'   && <TemplateModern   data={formData} />}
                        {selectedTemplate === 'creative' && <TemplateCreative data={formData} />}
                        {selectedTemplate === 'ats'      && <TemplateATS      data={formData} />}
                    </div>
                </div>

                {/* RIGHT: Live AI Suggestions */}
                <AISuggestionsPanel formData={formData} />

            </div>
        </div>
    );
};

export default ResumeBuilderPage;
