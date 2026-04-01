import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoDownloadOutline, IoSaveOutline, IoChevronDownOutline, IoAddCircleOutline, IoTrashOutline } from 'react-icons/io5';

import TemplateModern from '../../components/ResumeTemplates/TemplateModern';
import TemplateCreative from '../../components/ResumeTemplates/TemplateCreative';
import TemplateATS from '../../components/ResumeTemplates/TemplateATS';

import { createResume } from '../../services/resumeApi';

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
                    <div className="p-5 border-t border-gray-200">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const ResumeBuilderPage = () => {
    // Top-level View State
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [activeTab, setActiveTab] = useState('personal');
    const [isSaving, setIsSaving] = useState(false);

    const printRef = useRef(null);

    // Initial Empty Data Shape matching Backend Schema exactly
    const [formData, setFormData] = useState({
        personal_Information: { full_Name: '', phone_number: '', email: '', city: '', linkedin_Profile: { url: '' }, github: { url: '' } },
        career_Objective: '',
        technical_skills: { programming_language: [], frontend: [], backend: [], database: [], tools: [] },
        education: [],
        project: [],
        experience: [],
        certifications: [],
        achievements: [],
        softSkills: [],
        languages: []
    });

    // Handlers for Personal Info
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        if (name === 'linkedin_Profile' || name === 'github') {
            setFormData({
                ...formData,
                personal_Information: { ...formData.personal_Information, [name]: { url: value } }
            });
        } else {
            setFormData({
                ...formData,
                personal_Information: { ...formData.personal_Information, [name]: value }
            });
        }
    };

    // Generic Handlers for Arrays (Experience, Projects, Education)
    const addArrayItem = (key, itemShape) => {
        setFormData({ ...formData, [key]: [...formData[key], itemShape] });
    };

    const removeArrayItem = (key, index) => {
        const newArr = [...formData[key]];
        newArr.splice(index, 1);
        setFormData({ ...formData, [key]: newArr });
    };

    const updateArrayItem = (key, index, field, value) => {
        const newArr = [...formData[key]];
        newArr[index][field] = value;
        setFormData({ ...formData, [key]: newArr });
    };

    // Handlers for Comma Separated Arrays (Skills, Achievements)
    const handleCommaArrayChange = (key, subKey, value) => {
        const arr = value.split(',').map(s => s.trim()).filter(Boolean);
        if (subKey) {
            setFormData({ ...formData, [key]: { ...formData[key], [subKey]: arr } });
        } else {
            setFormData({ ...formData, [key]: arr });
        }
    };

    // Actions
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        
        // Temporarily replace body with print content
        document.body.innerHTML = printContents;
        window.print();
        // Restore body
        document.body.innerHTML = originalContents;
        window.location.reload(); // Quick restore of React bindings
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await createResume(formData);
            alert("Resume Saved Successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save resume. Make sure you are logged in.");
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-4 pb-10 px-4 md:px-8">
            
            {/* Header Toolbar */}
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 mb-6 flex justify-between items-center z-10">
                <div className="flex flex-col">
                    <h1 className="text-xl font-heading font-extrabold text-gray-900 tracking-tight">AI Resume Studio</h1>
                    <span className="text-sm text-gray-500">Live preview mapping directly to standard formats.</span>
                </div>
                
                <div className="flex gap-4 items-center">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['modern', 'creative', 'ats'].map(tpl => (
                            <button 
                                key={tpl}
                                onClick={() => setSelectedTemplate(tpl)}
                                className={`px-4 py-2 text-sm font-bold rounded-lg capitalize transition ${selectedTemplate === tpl ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {tpl}
                            </button>
                        ))}
                    </div>
                    
                    <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition flex items-center gap-2">
                        {isSaving ? 'Saving...' : <><IoSaveOutline /> Save Profile</>}
                    </button>
                    <button onClick={handlePrint} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-md shadow-indigo-500/20">
                        <IoDownloadOutline /> Download PDF
                    </button>
                </div>
            </div>

            {/* Split Screen Application */}
            <div className="flex gap-8 h-[calc(100vh-140px)]">
                
                {/* LEFT PANE: Data Editor */}
                <div className="w-[35%] overflow-y-auto pr-2 custom-scrollbar pb-20">
                    
                    <AccordionTab id="personal" title="Personal Details" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">Full Name</label>
                                <input type="text" name="full_Name" value={formData.personal_Information.full_Name} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">Email</label>
                                    <input type="email" name="email" value={formData.personal_Information.email} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 mb-1 block">Phone</label>
                                    <input type="text" name="phone_number" value={formData.personal_Information.phone_number} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">City, Country</label>
                                <input type="text" name="city" value={formData.personal_Information.city} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">LinkedIn URL</label>
                                <input type="text" name="linkedin_Profile" value={formData.personal_Information.linkedin_Profile?.url} onChange={handlePersonalChange} className="w-full p-2.5 border rounded-lg bg-gray-50" />
                            </div>
                        </div>
                    </AccordionTab>

                    <AccordionTab id="objective" title="Professional Summary" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <textarea 
                            rows="4" 
                            value={formData.career_Objective} 
                            onChange={(e) => setFormData({ ...formData, career_Objective: e.target.value })} 
                            className="w-full p-3 border rounded-lg bg-gray-50 text-sm" 
                            placeholder="A brief summary of your expertise..."
                        ></textarea>
                    </AccordionTab>

                    <AccordionTab id="experience" title="Work Experience" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-6">
                            {formData.experience.map((exp, index) => (
                                <div key={index} className="p-4 border border-gray-100 bg-gray-50 rounded-xl relative">
                                    <button onClick={() => removeArrayItem('experience', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><IoTrashOutline /></button>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <input type="text" placeholder="Job Title" value={exp.role} onChange={e => updateArrayItem('experience', index, 'role', e.target.value)} className="w-full p-2 border rounded-lg" />
                                        <input type="text" placeholder="Company" value={exp.company_Name} onChange={e => updateArrayItem('experience', index, 'company_Name', e.target.value)} className="w-full p-2 border rounded-lg" />
                                    </div>
                                    <input type="text" placeholder="Duration (e.g. Jan 2020 - Present)" value={exp.duration} onChange={e => updateArrayItem('experience', index, 'duration', e.target.value)} className="w-full p-2 border rounded-lg mb-3" />
                                    <textarea placeholder="Work Description..." rows="3" value={exp.work_description} onChange={e => updateArrayItem('experience', index, 'work_description', e.target.value)} className="w-full p-2 border rounded-lg text-sm"></textarea>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('experience', { role: '', company_Name: '', duration: '', work_description: '' })} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                                <IoAddCircleOutline /> Add Experience
                            </button>
                        </div>
                    </AccordionTab>

                    <AccordionTab id="education" title="Education" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-6">
                            {formData.education.map((edu, index) => (
                                <div key={index} className="p-4 border border-gray-100 bg-gray-50 rounded-xl relative">
                                    <button onClick={() => removeArrayItem('education', index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><IoTrashOutline /></button>
                                    <input type="text" placeholder="Degree (e.g. B.S. Computer Science)" value={edu.degree} onChange={e => updateArrayItem('education', index, 'degree', e.target.value)} className="w-full p-2 border rounded-lg mb-3" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="College/University" value={edu.college} onChange={e => updateArrayItem('education', index, 'college', e.target.value)} className="w-full p-2 border rounded-lg" />
                                        <input type="text" placeholder="Graduation Year" value={edu.year} onChange={e => updateArrayItem('education', index, 'year', e.target.value)} className="w-full p-2 border rounded-lg" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('education', { degree: '', college: '', year: '' })} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                                <IoAddCircleOutline /> Add Education
                            </button>
                        </div>
                    </AccordionTab>

                    <AccordionTab id="skills" title="Skills & Achievements" activeTab={activeTab} setActiveTab={setActiveTab}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">Programming Languages (Comma separated)</label>
                                <input type="text" placeholder="e.g. JavaScript, Python" value={formData.technical_skills.programming_language?.join(', ')} onChange={e => handleCommaArrayChange('technical_skills', 'programming_language', e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">Frontend Frameworks</label>
                                <input type="text" placeholder="e.g. React, Vue" value={formData.technical_skills.frontend?.join(', ')} onChange={e => handleCommaArrayChange('technical_skills', 'frontend', e.target.value)} className="w-full p-2.5 border rounded-lg bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">Achievements</label>
                                <textarea rows="3" placeholder="e.g. Won hackathon, Published paper" value={formData.achievements?.join(', ')} onChange={e => handleCommaArrayChange('achievements', null, e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 text-sm"></textarea>
                            </div>
                        </div>
                    </AccordionTab>

                </div>

                {/* RIGHT PANE: Live Template Viewer */}
                <div className="flex-1 overflow-y-auto bg-gray-400 p-8 rounded-2xl flex justify-center custom-scrollbar">
                    
                    {/* The A4 Wrapper Print Target */}
                    <div ref={printRef} className="w-[816px] min-h-[1056px] shadow-2xl bg-white origin-top box-border scale-[0.6] sm:scale-[0.8] lg:scale-100 transition-transform">
                        {selectedTemplate === 'modern' && <TemplateModern data={formData} />}
                        {selectedTemplate === 'creative' && <TemplateCreative data={formData} />}
                        {selectedTemplate === 'ats' && <TemplateATS data={formData} />}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ResumeBuilderPage;
