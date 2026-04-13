import React, { useState, useEffect } from 'react';
import { IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import axios from 'axios';
import { ServerURL } from '../../App';

const AdminResetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${ServerURL}/api/admin/reset-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data.requests);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem("token");
            const endpoint = action === 'approve' ? 'approve-reset' : 'reject-reset';
            await axios.patch(`${ServerURL}/api/admin/${endpoint}/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh list
            fetchRequests();
        } catch (err) {
            alert("Failed to " + action + " request.");
        }
    };

    const filteredRequests = requests.filter(req => 
        req.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Password Reset Requests</h1>
                    <p className="text-gray-500 mt-2">Manage and approve manual password recovery requests.</p>
                </div>
                
                <div className="relative group max-w-sm w-full">
                    <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-sm text-gray-700" 
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Requested On</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                                        <p className="mt-4 text-gray-400 font-medium">Loading requests...</p>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic">
                                        No pending reset requests found.
                                    </td>
                                </tr>
                            ) : filteredRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                                <IoPersonOutline />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{req.email}</p>
                                                <p className="text-xs text-gray-400 font-medium">ID: {req._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <IoTimeOutline className="text-lg" />
                                            <span className="text-sm font-medium">
                                                {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                                            Pending Approval
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 translate-x-0 opacity-100 lg:translate-x-4 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-300">
                                            <button 
                                                onClick={() => handleAction(req._id, 'reject')}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Reject Request"
                                            >
                                                <IoCloseCircleOutline size={22} />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req._id, 'approve')}
                                                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Approve Reset"
                                            >
                                                <IoCheckmarkCircleOutline size={22} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminResetRequests;
