import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerURL } from '../../App';
import StatCard from '../../components/admin/StatCard';
import { IoPeopleOutline, IoBriefcaseOutline, IoDocumentTextOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUser: 0,
        totalJobs: 0,
        totalApplication: 0,
        totalFeedback: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${ServerURL}/api/admin/dasboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                // Handle different possible payload structures from backend
                const data = res.data;
                setStats({
                    totalUser: data.totalUser || data.users || 0,
                    totalJobs: data.totalJobs || data.jobs || 0,
                    totalApplication: data.totalApplication || data.applications || 0,
                    totalFeedback: data.totalFeedback || data.feedbacks || 0
                });
            } catch (err) {
                console.error("Error fetching admin stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">System Overview</h1>
                <p className="text-gray-500 mt-1">Monitor your platform's growth and activity metrics.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUser.toLocaleString()}
                        icon={<IoPeopleOutline className="text-blue-600" />}
                        colorClass="bg-blue-50"
                        delay={0.1}
                    />
                    <StatCard
                        title="Active Jobs"
                        value={stats.totalJobs.toLocaleString()}
                        icon={<IoBriefcaseOutline className="text-indigo-600" />}
                        colorClass="bg-indigo-50"
                        delay={0.2}
                    />
                    <StatCard
                        title="Applications"
                        value={stats.totalApplication.toLocaleString()}
                        icon={<IoDocumentTextOutline className="text-teal-600" />}
                        colorClass="bg-teal-50"
                        delay={0.3}
                    />
                    <StatCard
                        title="Feedback"
                        value={stats.totalFeedback.toLocaleString()}
                        icon={<IoChatbubbleEllipsesOutline className="text-purple-600" />}
                        colorClass="bg-purple-50"
                        delay={0.4}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
