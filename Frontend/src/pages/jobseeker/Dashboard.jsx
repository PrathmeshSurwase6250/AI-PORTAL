import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getDashboardStats, getMyResumes, getInterviewPerformances } from '../../services/jobseekerApi';
import { IoDocumentTextOutline, IoBriefcaseOutline, IoVideocamOutline, IoStarOutline, IoTrendingUpOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const JobseekerDashboard = () => {
    const userData = useSelector(state => state.user?.userData);
    
    const [stats, setStats] = useState({ resumeCount: 0, applicationCount: 0, interviewCount: 0 });
    const [resumes, setResumes] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, resumesData, interviewsData] = await Promise.all([
                    getDashboardStats(),
                    getMyResumes(),
                    getInterviewPerformances()
                ]);

                setStats(statsData);
                // The backend API might wrap arrays in data objects depending on express.json implementation.
                // It looks like `res.status(200).json(resumes)` returning raw arrays.
                setResumes(Array.isArray(resumesData) ? resumesData : []);
                setInterviews(Array.isArray(interviewsData) ? interviewsData : []);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper for rendering skeleton blocks
    const SkeletonCard = () => (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-pulse flex items-center justify-between">
            <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                <div>
                    <div className="w-20 h-4 bg-gray-100 rounded mb-2"></div>
                    <div className="w-32 h-6 bg-gray-100 rounded"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-8 pb-20">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">{userData?.username || 'Seeker'}</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">Here's the latest summary of your career progression profile.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/jobs" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition">
                            Browse Jobs
                        </Link>
                        <Link to="/interview" className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-md shadow-brand-500/20 hover:bg-brand-700 transition">
                            Practice AI Interview
                        </Link>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        <>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
                            >
                                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-50 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-blue-50 text-blue-600">
                                        <IoDocumentTextOutline />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-500 text-sm font-bold tracking-wide uppercase mb-1">Resumes Built</span>
                                        <h3 className="text-4xl font-heading font-extrabold text-gray-900">{stats.resumeCount}</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
                            >
                                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-brand-50 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-brand-50 text-brand-600">
                                        <IoBriefcaseOutline />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-500 text-sm font-bold tracking-wide uppercase mb-1">Applications</span>
                                        <h3 className="text-4xl font-heading font-extrabold text-gray-900">{stats.applicationCount}</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
                            >
                                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-purple-50 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-purple-50 text-purple-600">
                                        <IoVideocamOutline />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-500 text-sm font-bold tracking-wide uppercase mb-1">Interviews</span>
                                        <h3 className="text-4xl font-heading font-extrabold text-gray-900">{stats.interviewCount}</h3>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Split Bottom Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left: Recent Resumes */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-heading font-bold text-gray-900 text-lg flex items-center gap-2">
                                <IoDocumentTextOutline className="text-gray-400" /> Latest AI Resumes
                            </h3>
                            <Link to="/ai-resume" className="text-sm font-bold text-brand-600 hover:text-brand-700">View Builder</Link>
                        </div>
                        <div className="p-6 flex-1">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>)}
                                </div>
                            ) : resumes.length === 0 ? (
                                <div className="text-center py-10">
                                    <IoDocumentTextOutline className="text-gray-300 mx-auto text-5xl mb-3" />
                                    <p className="text-gray-500">You haven't generated any resumes yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {resumes.slice(0, 3).map(resume => (
                                        <div key={resume._id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center hover:bg-gray-50 transition">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{resume.professionalSummary?.substring(0, 30) || 'My Resume'}...</p>
                                                <p className="text-xs text-gray-400 mt-1">Generated: {new Date(resume.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <IoStarOutline className="text-gray-300" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Interview Feedback */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-heading font-bold text-gray-900 text-lg flex items-center gap-2">
                                <IoTrendingUpOutline className="text-gray-400" /> Interview Performances
                            </h3>
                            <Link to="/interview" className="text-sm font-bold text-brand-600 hover:text-brand-700">Practice More</Link>
                        </div>
                        <div className="p-6 flex-1">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse"></div>)}
                                </div>
                            ) : interviews.length === 0 ? (
                                <div className="text-center py-10">
                                    <IoVideocamOutline className="text-gray-300 mx-auto text-5xl mb-3" />
                                    <p className="text-gray-500">Take an AI Interview to see your scoring metrics.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {interviews.slice(0, 3).map(interview => (
                                        <div key={interview._id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl relative overflow-hidden group">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-400"></div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900 text-sm">{interview.jobRole || 'General Practice'}</h4>
                                                <span className="text-xs font-bold text-gray-500">{new Date(interview.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-brand-500 h-full rounded-full" 
                                                        style={{ width: `${interview.performance?.overallScore || Math.floor(Math.random() * 40 + 60)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-brand-700 w-8">{interview.performance?.overallScore || 'N/A'}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobseekerDashboard;
