import React, { useState, useEffect } from 'react';
import { IoBriefcaseOutline, IoPeopleOutline, IoTrendingUpOutline, IoAddCircleOutline } from 'react-icons/io5';
import { getRecruiterStats } from '../../services/recruiterApi';

const Dashboard = () => {
    const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getRecruiterStats();
                setStats({ 
                    activeJobs: data.totalJobs || 0, 
                    totalApplicants: data.totalApplication || 0 
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Recruiter Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back! Here's a quick overview of your hiring pipeline.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-indigo-50 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-indigo-50 text-indigo-600">
                            <IoBriefcaseOutline />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-500 text-sm font-semibold tracking-wide uppercase mb-1">Active Postings</span>
                            <h3 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                                {loading ? '-' : stats.activeJobs}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-teal-50 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-teal-50 text-teal-600">
                            <IoPeopleOutline />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-500 text-sm font-semibold tracking-wide uppercase mb-1">Total Candidates</span>
                            <h3 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                                {loading ? '-' : stats.totalApplicants}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-orange-50 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-orange-50 text-orange-600">
                            <IoTrendingUpOutline />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-500 text-sm font-semibold tracking-wide uppercase mb-1">Hire Rate</span>
                            <h3 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                                4.2%
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <IoAddCircleOutline />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Need a new addition?</h3>
                    <p className="text-gray-500 text-sm mb-6">Create a well-crafted job post and let our AI match you with the perfect candidates from our talent pool.</p>
                    <a href="/recruiter/post-job" className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition w-max mx-auto">
                        Post New Job
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
