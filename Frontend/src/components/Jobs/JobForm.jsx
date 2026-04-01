import React, { useState, useEffect } from 'react';
import { IoBriefcaseOutline, IoLocationOutline, IoCashOutline, IoBusinessOutline, IoCheckmarkCircleOutline, IoGitBranchOutline, IoPeopleOutline } from 'react-icons/io5';

const JobForm = ({ initialData = null, onSubmit, loading, successMsg }) => {
    const [formData, setFormData] = useState({
        job_title: '',
        company_name: '',
        company_location: '',
        company_type: '',
        job_position: '',
        salary: '',
        job_type: 'full-time',
        numberOfOpening: 1,
        experience: '',
        required_skills: '',
        company_information: '',
        educational_qualification: '',
        role_about: '',
        role_responsibilities: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                job_title: initialData.job_title || '',
                company_name: initialData.company_name || '',
                company_location: initialData.company_location || '',
                company_type: initialData.company_type || '',
                job_position: initialData.job_position || '',
                salary: initialData.salary || '',
                job_type: initialData.job_type || 'full-time',
                numberOfOpening: initialData.numberOfOpening || 1,
                experience: initialData.experience || '',
                required_skills: Array.isArray(initialData.required_skills) ? initialData.required_skills.join(', ') : (initialData.required_skills || ''),
                company_information: Array.isArray(initialData.company_information) ? initialData.company_information.join(', ') : (initialData.company_information || ''),
                educational_qualification: Array.isArray(initialData.educational_qualification) ? initialData.educational_qualification.join(', ') : (initialData.educational_qualification || ''),
                role_about: initialData.role_about || '',
                role_responsibilities: initialData.role_responsibilities || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert comma-separated string fields to arrays natively before passing payload to backend
        const submissionData = { ...formData };
        
        if (typeof submissionData.required_skills === 'string') {
            submissionData.required_skills = submissionData.required_skills.split(',').map(s => s.trim()).filter(s => s);
        }
        if (typeof submissionData.company_information === 'string') {
            submissionData.company_information = submissionData.company_information.split(',').map(s => s.trim()).filter(s => s);
        }
        if (typeof submissionData.educational_qualification === 'string') {
            submissionData.educational_qualification = submissionData.educational_qualification.split(',').map(s => s.trim()).filter(s => s);
        }
        
        // Number Parsing
        submissionData.numberOfOpening = parseInt(submissionData.numberOfOpening, 10) || 1;
        
        onSubmit(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            {successMsg && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100">
                    <IoCheckmarkCircleOutline className="text-xl" />
                    <span className="font-bold">{successMsg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                
                {/* 1. Job Details Block */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                    <div className="relative">
                        <IoBriefcaseOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            name="job_title" 
                            value={formData.job_title} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. Senior Frontend Developer" 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Position Level / Code</label>
                    <div className="relative">
                        <IoGitBranchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            name="job_position" 
                            value={formData.job_position} 
                            onChange={handleChange} 
                            placeholder="e.g. L4, Mid-Level, Manager" 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                    <div className="relative">
                        <IoBusinessOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            name="company_name" 
                            value={formData.company_name} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. AI Innovations Corp" 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Company Type / Sector</label>
                    <input 
                        type="text" 
                        name="company_type" 
                        value={formData.company_type} 
                        onChange={handleChange} 
                        required 
                        placeholder="e.g. Series A Startup, FinTech" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                    <div className="relative">
                        <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            name="company_location" 
                            value={formData.company_location} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. San Francisco, CA (or Remote)" 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Salary Estimate</label>
                    <div className="relative">
                        <IoCashOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            name="salary" 
                            value={formData.salary} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. $120k - $150k" 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Logistics */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                    <select 
                        name="job_type" 
                        value={formData.job_type} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                    >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                    </select>
                </div>

                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Number of Openings</label>
                    <div className="relative">
                        <IoPeopleOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="number" 
                            min="1"
                            name="numberOfOpening" 
                            value={formData.numberOfOpening} 
                            onChange={handleChange} 
                            required 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Arrays & Large Texts */}
            <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Qualifications & Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Experience Required (Years)</label>
                        <input 
                            type="text" 
                            name="experience" 
                            value={formData.experience} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. 3-5 years" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Educational Qualifications (Comma Sep)</label>
                        <input 
                            type="text" 
                            name="educational_qualification" 
                            value={formData.educational_qualification} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. BSc Computer Science, Master's Degree" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Required Skills (Comma Sep)</label>
                    <input 
                        type="text" 
                        name="required_skills" 
                        value={formData.required_skills} 
                        onChange={handleChange} 
                        required 
                        placeholder="e.g. React, Node.js, Next.js" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Company Information Highlights (Comma Sep)</label>
                    <input 
                        type="text" 
                        name="company_information" 
                        value={formData.company_information} 
                        onChange={handleChange} 
                        placeholder="e.g. Series A Funded, Fully Remote Culture, Health Benefits" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Role About / Description</label>
                    <textarea 
                        name="role_about" 
                        value={formData.role_about} 
                        onChange={handleChange} 
                        required 
                        rows="4" 
                        placeholder="High level overview describing what the actual job is and its impact..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                    ></textarea>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Core Responsibilities</label>
                    <textarea 
                        name="role_responsibilities" 
                        value={formData.role_responsibilities} 
                        onChange={handleChange} 
                        required 
                        rows="5" 
                        placeholder="What will the candidate do day-to-day?"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                    ></textarea>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-500/20 flex items-center justify-center min-w-[160px]"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        initialData ? 'Update Job Post' : 'Post New Job'
                    )}
                </button>
            </div>
        </form>
    );
};

export default JobForm;
