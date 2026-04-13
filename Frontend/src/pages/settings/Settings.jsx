import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IoSettingsOutline, IoLockClosedOutline, IoShieldCheckmarkOutline, IoPersonCircleOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ServerURL } from '../../App';

const Settings = () => {
    const userData = useSelector(state => state.auth?.userData);
    
    // Password Change State
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ text: "Passwords do not match!", type: 'error' });
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`${ServerURL}/api/auth/change-password`, 
                { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true 
                }
            );
            setMessage({ text: res.data.message, type: 'success' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || "Failed to update password.", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <IoSettingsOutline className="text-brand-600" /> Account Settings
                    </h1>
                    <p className="text-gray-500 mt-2">Manage your profile security and account preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Column: Profile Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                            <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-50 shadow-inner">
                                <IoPersonCircleOutline size={64} />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">{userData?.username || 'User'}</h3>
                            <p className="text-xs text-gray-400 font-medium truncate mb-4">{userData?.email}</p>
                            <div className="inline-flex px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-brand-100">
                                {userData?.role || 'Member'}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings Sections */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* Password Change Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
                                <IoShieldCheckmarkOutline className="text-indigo-500 text-xl" />
                                <h2 className="font-bold text-gray-900">Security & Password</h2>
                            </div>
                            
                            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                                {message.text && (
                                    <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Current Password</label>
                                    <div className="relative">
                                        <IoLockClosedOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                        <input 
                                            type="password" 
                                            required
                                            value={passwords.oldPassword}
                                            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                                            placeholder="••••••••" 
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">New Password</label>
                                        <div className="relative">
                                            <IoLockClosedOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                            <input 
                                                type="password" 
                                                required
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                                placeholder="••••••••" 
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Confirm New Password</label>
                                        <div className="relative">
                                            <IoLockClosedOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                            <input 
                                                type="password" 
                                                required
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                                placeholder="••••••••" 
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full sm:w-auto px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-md shadow-brand-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Update Password'}
                                </button>
                            </form>
                        </div>

                        {/* Account Info Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                            <h2 className="font-bold text-gray-900 mb-2">Login Method</h2>
                            <p className="text-sm text-gray-500">
                                {userData?.password ? (
                                    'You are logged in using Email and Password.'
                                ) : (
                                    'You are logged in via Google. Password management is handled by your Google Account.'
                                )}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
