import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { ServerURL } from '../../App';
import { IoSparklesOutline, IoLocationOutline, IoBriefcaseOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const SuggestedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await axios.get(`${ServerURL}/api/jobPosting/suggested`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (res.data.success) {
                    setJobs(res.data.suggestedJobs);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                console.error("Failed to fetch suggestions:", err);
                setError("Unable to load suggestions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm" />
                ))}
            </div>
        );
    }

    if (error || jobs.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-gray-200 text-center mb-10">
                <IoSparklesOutline className="text-gray-300 text-4xl mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">AI Job Matching</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    {error || "Create a resume using our AI builder to see tailored job recommendations that match your skills."}
                </p>
                {(!error && jobs.length === 0) && (
                    <Link to="/ai-resume" className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition">
                        Go to Resume Builder
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-heading font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <IoSparklesOutline className="text-indigo-500" /> Matches For You
                    </h2>
                    <p className="text-sm text-gray-500">AI-powered suggestions based on your resume</p>
                </div>
                <Link to="/jobs" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                    Browse All <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, idx) => (
                    <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col"
                    >
                        {/* Match Score Badge */}
                        <div className="absolute top-0 right-0">
                            <div className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-lg">
                                {job.matchScore}% Match
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <img 
                                src={job.company_logo?.url ? (job.company_logo.url.startsWith('http') ? job.company_logo.url : `${ServerURL}${job.company_logo.url}`) : 'https://img.freepik.com/premium-vector/creative-elegant-minimalistic-logo-design-vector-any-brand-business-company_1253202-134378.jpg'} 
                                alt={job.company_name} 
                                className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100"
                            />
                            <div className="flex-1 min-w-0 pr-12">
                                <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">
                                    {job.job_title}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium truncate">{job.company_name}</p>
                            </div>
                        </div>

                        <div className="space-y-2 mt-auto">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <IoLocationOutline className="text-indigo-400" /> {job.company_location}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <IoBriefcaseOutline className="text-indigo-400" /> {job.job_type}
                                </span>
                            </div>

                            <div className="pt-3 border-t border-gray-50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Why this matches:</p>
                                <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2">
                                    "{job.matchReason}"
                                </p>
                            </div>

                            <Link 
                                to={`/jobs/${job._id}`}
                                className="mt-4 w-full py-2.5 bg-gray-50 group-hover:bg-indigo-600 text-gray-700 group-hover:text-white font-bold rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                View Details <IoChevronForwardOutline />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedJobs;
