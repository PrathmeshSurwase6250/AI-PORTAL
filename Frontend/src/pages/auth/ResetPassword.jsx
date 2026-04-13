import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BsRobot } from "react-icons/bs";
import { IoLockClosedOutline, IoCheckmarkCircleOutline, IoArrowBackOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerURL } from '../../App';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, email } = location.state || {}; // Obtain from ForgotPassword approval status
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Security Check: If no token, redirect back
    if (!token) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center bg-brand-50 p-6'>
                <div className='bg-white p-10 rounded-3xl shadow-xl text-center max-w-md'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Unauthorized Access</h2>
                    <p className='text-gray-500 mb-6'>You must have an approved reset request to view this page.</p>
                    <Link to="/forgot-password" size="sm" className='bg-brand-600 text-white px-6 py-3 rounded-xl font-bold'>
                        Go to Request Page
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match!");
        }
        
        setLoading(true);
        setError("");

        try {
            await axios.post(`${ServerURL}/api/auth/reset-password-manual`, { token, password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/auth');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen py-12 relative flex items-center justify-center bg-brand-50'>
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-300/30 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl glass-panel shadow-xl'
            >
                <div className='flex flex-col items-center justify-center gap-2 mb-6'>
                    <div className='bg-brand-600 text-white p-3 rounded-2xl shadow-lg mb-1'>
                        <BsRobot size={24} />
                    </div>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IoCheckmarkCircleOutline size={48} />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Success!</h1>
                        <p className='text-gray-500 mb-8'>Your password has been reset successfully. Redirecting to login...</p>
                        <Link to="/auth" className="text-brand-600 font-bold hover:underline">Click here if not redirected</Link>
                    </div>
                ) : (
                    <>
                        <h1 className='text-3xl font-bold text-center leading-tight mb-2 text-gray-800 tracking-tight'>
                            Set New Password
                        </h1>
                        <p className='text-gray-500 text-center text-sm mb-4 px-4'>
                            Account: <span className='font-bold text-gray-800'>{email}</span>
                        </p>
                        <p className='text-gray-500 text-center text-xs mb-8 px-4'>
                            Your request has been approved by the Administrator. Please set a new strong password.
                        </p>

                        {error && (
                            <div className="mb-6 s-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium p-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <IoLockClosedOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                <input 
                                    type="password" 
                                    required 
                                    placeholder="New Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-gray-800" 
                                />
                            </div>

                            <div className="relative">
                                <IoLockClosedOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                <input 
                                    type="password" 
                                    required 
                                    placeholder="Confirm Password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-gray-800" 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-brand-500/20 disabled:opacity-70 mt-4 flex items-center justify-center"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
