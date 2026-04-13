import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsRobot } from "react-icons/bs";
import { IoMailOutline, IoArrowBackOutline, IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerURL } from '../../App';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("none"); // none, pending, approved, rejected
    const [token, setToken] = useState(""); // Approval token
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 1. Initial Check: If email is in state, check if there's already a request
    const checkStatus = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${ServerURL}/api/auth/check-reset-status`, { email });
            setStatus(res.data.status);
            if (res.data.status === "approved") {
                setToken(res.data.token);
                setMessage("Your request has been APPROVED! You can now reset your password.");
            } else if (res.data.status === "pending") {
                setMessage("Your request is still pending admin approval. Please check back later.");
            } else if (res.data.status === "rejected") {
                setError("Your request was rejected by the Admin. Please contact support.");
            }
        } catch (err) {
            // No request found, status remains "none"
            setStatus("none");
            if (e) setError("No active request found. Please submit a new one below.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Submit New Request
    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${ServerURL}/api/auth/request-reset`, { email });
            setStatus(res.data.status);
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoToReset = () => {
        navigate('/reset-password', { state: { token, email } });
    };

    return (
        <div className='w-full min-h-screen py-12 relative flex items-center justify-center bg-brand-50'>
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-300/30 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl glass-panel shadow-xl'
            >
                <Link to="/auth" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 transition mb-8">
                    <IoArrowBackOutline /> Back to Login
                </Link>

                <div className='flex flex-col items-center justify-center gap-2 mb-6'>
                    <div className='bg-brand-600 text-white p-3 rounded-2xl shadow-lg mb-1'>
                        <BsRobot size={24} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-800 tracking-tight'>Reset Request</h1>
                </div>

                <p className='text-gray-500 text-center text-sm mb-8 px-4'>
                    {status === "none"
                        ? "Enter your email to request a password reset approval from the Administrator."
                        : "Check the status of your manual reset request below."}
                </p>

                <AnimatePresence mode='wait'>
                    {status === "none" ? (
                        <motion.form
                            key="request"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleRequest}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <IoMailOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Registered Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-gray-800"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-brand-500/20 disabled:opacity-70 mt-4 flex items-center justify-center"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Submit Reset Request"}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="status"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className={`p-6 rounded-2xl flex flex-col items-center text-center gap-4 ${status === "pending" ? "bg-amber-50 border border-amber-100" :
                                    status === "approved" ? "bg-green-50 border border-green-100" :
                                        "bg-red-50 border border-red-100"
                                }`}>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${status === "pending" ? "bg-amber-100 text-amber-600" :
                                        status === "approved" ? "bg-green-100 text-green-600" :
                                            "bg-red-100 text-red-600"
                                    }`}>
                                    {status === "pending" ? <IoTimeOutline className="animate-pulse" /> :
                                        status === "approved" ? <IoCheckmarkCircleOutline /> :
                                            <IoCloseCircleOutline />}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-900 capitalize">{status}</h3>
                                    <p className={`text-sm ${status === "pending" ? "text-amber-700" :
                                            status === "approved" ? "text-green-700" :
                                                "text-red-700"
                                        }`}>
                                        {message || error}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStatus("none")}
                                    className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition text-sm"
                                >
                                    New Request
                                </button>
                                {status === "approved" ? (
                                    <button
                                        onClick={handleGoToReset}
                                        className="flex-[2] py-3 px-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md shadow-brand-500/20 transition text-sm"
                                    >
                                        Go to Reset Page
                                    </button>
                                ) : (
                                    <button
                                        onClick={checkStatus}
                                        disabled={loading}
                                        className="flex-[2] py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition text-sm flex items-center justify-center"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Check Status"}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
