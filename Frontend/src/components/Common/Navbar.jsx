import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useDispatch, useSelector } from 'react-redux';
import { FaUserAstronaut, FaTimes, FaBars } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ServerURL } from '../../App';
import axios from 'axios';
import { setUserData } from '../../redux/userSlice';
import { useEffect } from 'react';

const Navbar = () => {
    // Make sure we select from 'user' reducer assuming store.js uses { user: userReducer }
    const { userData } = useSelector((state) => state.user || state.auth);
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Close menu on route change
    useEffect(() => {
        setShowMenu(false);
        setShowMobileMenu(false);
    }, [location.pathname]);

    const handlelogout = async () => {
        try {
            await axios.get(ServerURL + "/api/auth/logout", { withCredentials: true });
            localStorage.removeItem("token");
            dispatch(setUserData(null));
            navigate("/auth");
            setShowMenu(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className='sticky top-0 z-50 pt-4 px-4 flex justify-center '>
            <div className='w-full max-w-6xl glass-panel rounded-[24px] px-8 py-3 flex justify-between items-center relative '>
                <Link to="/" className='flex items-center gap-3 cursor-pointer group'>
                    <div className='bg-brand-600 text-white p-2 rounded-lg group-hover:bg-brand-700 transition'> <BsRobot size={22} className='text-white' /> </div>
                    <h1 className='font-heading font-bold text-xl tracking-tight hidden md:block text-gray-900'>AI Portal</h1>
                </Link>

                <div className='hidden md:flex items-center gap-2 relative'>
                    <Link to="/" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>Home</Link>
                    <Link to="/about" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>About</Link>
                    
                    {/* Hide these from recruiters */}
                    {userData?.role !== 'recruiter' && userData?.role !== 'admin' && (
                        <>
                            <Link to="/jobs" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>Jobs</Link>
                            <Link to="/ai-job-matching" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>AI Matches</Link>
                            <Link to="/ai-resume" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>AI Resume</Link>
                            <Link to="/interview" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>AI Interviewer</Link>
                            <Link to="/code-reviewer" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>Code Review</Link>
                        </>
                    )}

                    {/* Show these specifically to recruiters in the standard nav */}
                    {userData?.role === 'recruiter' && (
                        <>
                            <Link to="/recruiter/post-job" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>Post Job</Link>
                            <Link to="/recruiter/manage-jobs" className='px-4 py-2 rounded-full text-md font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition'>Manage Jobs</Link>
                        </>
                    )}
                </div>

                <div className='flex items-center gap-4 relative '>
                    {userData ? (
                        <div className='relative'>
                            <button className='w-10 h-10 bg-brand-600 hover:bg-brand-700 transition shadow-md shadow-brand-500/30 text-white rounded-full flex items-center justify-center font-bold text-lg' onClick={() => setShowMenu(!showMenu)}>
                                {userData?.username ? userData.username.charAt(0).toUpperCase() : <FaUserAstronaut size={18} />}
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className='absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden'>
                                        <div className='px-4 py-3 border-b border-gray-100 mb-2'>
                                            <p className='text-sm font-semibold text-gray-900 truncate'>{userData.username || 'User'}</p>
                                            <p className='text-xs text-gray-500 truncate'>{userData.email}</p>
                                        </div>
                                        <button 
                                            className='block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition' 
                                            onClick={() => {
                                                if (userData.role === 'recruiter') navigate("/recruiter");
                                                else if (userData.role === 'admin') navigate("/admin");
                                                else navigate("/dashboard");
                                            }}
                                        >
                                            Dashboard
                                        </button>
                                        <button 
                                            className='block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition'
                                            onClick={() => navigate("/settings")}
                                        >
                                            Settings
                                        </button>
                                        <button className='block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition mt-1' onClick={handlelogout}>
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/auth" className="btn-secondary text-sm hidden sm:flex">Log in</Link>
                            <Link to="/auth" className="btn-primary text-sm">Join Now</Link>
                        </div>
                    )}
                    
                    {/* Mobile Hamburger Button */}
                    <button 
                        className='md:hidden w-10 h-10 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center hover:bg-brand-100 transition'
                        onClick={() => setShowMobileMenu(true)}
                    >
                        <FaBars size={18} />
                    </button>
                </div>
            </div>

            {/* Full Screen Mobile Menu Drawer */}
            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className='fixed inset-0 z-[100] bg-white flex flex-col pt-6 px-6 md:hidden'
                    >
                        {/* Header of mobile menu */}
                        <div className='flex justify-between items-center mb-8'>
                            <Link to="/" className='flex items-center gap-3 cursor-pointer group' onClick={() => setShowMobileMenu(false)}>
                                <div className='bg-brand-600 text-white p-2 rounded-lg'> <BsRobot size={22} className='text-white' /> </div>
                                <h1 className='font-heading font-bold text-xl tracking-tight text-gray-900'>AI Portal</h1>
                            </Link>
                            <button 
                                className='w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Navigation Links (Vertical) */}
                        <div className='flex flex-col gap-6 overflow-y-auto pb-20'>
                            <Link to="/" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>Home</Link>
                            <Link to="/about" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>About</Link>
                            
                            {userData?.role !== 'recruiter' && userData?.role !== 'admin' && (
                                <>
                                    <Link to="/jobs" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>Jobs</Link>
                                    <Link to="/ai-job-matching" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>AI Matches</Link>
                                    <Link to="/ai-resume" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>AI Resume</Link>
                                    <Link to="/interview" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>AI Interviewer</Link>
                                    <Link to="/code-reviewer" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>Code Review</Link>
                                </>
                            )}
                            
                            {userData?.role === 'recruiter' && (
                                <>
                                    <Link to="/recruiter/post-job" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>Post Job</Link>
                                    <Link to="/recruiter/manage-jobs" className='text-2xl font-bold text-gray-800 hover:text-brand-600 transition' onClick={() => setShowMobileMenu(false)}>Manage Jobs</Link>
                                </>
                            )}
                            
                            {!userData && (
                                <div className='mt-8 flex flex-col gap-4'>
                                    <Link to="/auth" className="btn-secondary w-full text-center py-4 text-lg" onClick={() => setShowMobileMenu(false)}>Log in</Link>
                                    <Link to="/auth" className="btn-primary w-full text-center py-4 text-lg shadow-lg shadow-brand-500/30" onClick={() => setShowMobileMenu(false)}>Join Now</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Navbar