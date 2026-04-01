import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../services/jobApi';
import { checkApplication, withdrawApplication } from '../services/applicationApi';
import { motion, AnimatePresence } from 'motion/react';
import { IoArrowBackOutline, IoBriefcaseOutline, IoLocationOutline, IoCashOutline, IoBusinessOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import ApplyJobModal from '../components/applications/ApplyJobModal';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const [jobData, appData] = await Promise.all([
                    getJobById(id),
                    checkApplication(id).catch(() => ({ applied: false }))
                ]);
                setJob(jobData.job);
                setHasApplied(appData.applied);
            } catch (err) {
                console.error(err);
                setError('Failed to load job details. The job may have been removed.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    // Toggle: apply or withdraw
    const handleApplyToggle = async () => {
        if (!hasApplied) {
            // Open apply modal
            setIsApplyModalOpen(true);
            return;
        }
        // Withdraw
        try {
            setApplyLoading(true);
            await withdrawApplication(id);
            setHasApplied(false);
        } catch (err) {
            console.error('Withdraw failed:', err);
        } finally {
            setApplyLoading(false);
        }
    };

    // Called after successful submit from ApplyJobModal
    const handleApplySuccess = () => {
        setHasApplied(true);
        setIsApplyModalOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading job details...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-32 px-4 text-center">
                <IoBusinessOutline className="text-gray-300 text-6xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "Job not found"}</h2>
                <button onClick={() => navigate('/jobs')} className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl shadow-md hover:bg-black transition font-bold">Back to Jobs</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/jobs')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-brand-600 font-bold text-sm mb-6 transition-colors"
                >
                    <IoArrowBackOutline />
                    Back to all jobs
                </button>

                {/* Hero Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-bl-full -z-10 opacity-50"></div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-2 shrink-0 flex items-center justify-center">
                                <img 
                                    src={job.company_logo?.url || "https://img.freepik.com/premium-vector/creative-elegant-minimalistic-logo-design-vector-any-brand-business-company_1253202-134378.jpg"} 
                                    alt={job.company_name} 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                                    {job.job_title}
                                </h1>
                                <p className="text-lg font-medium text-brand-600 mb-1">{job.company_name}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleApplyToggle}
                            disabled={applyLoading}
                            className={`w-full md:w-auto px-8 py-3.5 font-bold rounded-xl transition-all flex justify-center items-center gap-2 shrink-0 ${
                                hasApplied
                                    ? 'bg-green-600 text-white hover:bg-red-600 hover:shadow-lg shadow-green-500/30'
                                    : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg shadow-brand-500/30'
                            }`}
                        >
                            {applyLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : hasApplied ? (
                                <><IoCheckmarkCircleOutline size={18} /> Applied — Click to Withdraw</>
                            ) : (
                                'Apply Now'
                            )}
                        </button>
                    </div>

                    {/* Meta Info Bar */}
                    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-x-8 gap-y-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <IoLocationOutline />
                            </div>
                            <span className="font-medium text-sm">{job.company_location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <IoBriefcaseOutline />
                            </div>
                            <span className="font-medium text-sm capitalize">{job.job_type || 'Full-time'} · {job.experience || 'Entry Level'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <IoCashOutline />
                            </div>
                            <span className="font-medium text-sm">{job.salary || 'Salary Not Disclosed'}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Content Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content (Left, 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* About Role */}
                        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">About the Role</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                                {job.role_about || "No role description provided."}
                            </p>
                        </motion.section>

                        {/* Responsibilities */}
                        {job.role_responsibilities && (
                            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Key Responsibilities</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                                    {job.role_responsibilities}
                                </p>
                            </motion.section>
                        )}
                        
                        {/* Skills Required */}
                        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.required_skills && job.required_skills.length > 0 ? (
                                    job.required_skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-bold flex items-center gap-1.5">
                                            <IoCheckmarkCircleOutline className="text-brand-500" />
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No specific skills listed.</span>
                                )}
                            </div>
                        </motion.section>

                    </div>

                    {/* Sidebar Content (Right, 1/3) */}
                    <div className="space-y-8">
                        
                        {/* About Company */}
                        <motion.section initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">About {job.company_name}</h2>
                            <div className="space-y-3 mb-6">
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md uppercase tracking-wide">
                                    {job.company_type || 'Tech Company'}
                                </span>
                            </div>
                            <ul className="space-y-4">
                                {job.company_information && job.company_information.length > 0 ? (
                                    job.company_information.map((info, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0"></div>
                                            <span>{info}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No company information provided.</p>
                                )}
                            </ul>
                        </motion.section>

                        {/* Education */}
                        {job.educational_qualification && job.educational_qualification.length > 0 && (
                            <motion.section initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Education</h2>
                                <ul className="space-y-3">
                                    {job.educational_qualification.map((edu, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 font-medium flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-sm bg-gray-300"></div>
                                            {edu}
                                        </li>
                                    ))}
                                </ul>
                            </motion.section>
                        )}
                        
                    </div>

                </div>
            </div>

            {/* Apply Modal Instance */}
            <AnimatePresence>
                                {isApplyModalOpen && (
                    <ApplyJobModal 
                        job={job} 
                        onClose={handleApplySuccess} 
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default JobDetails;
