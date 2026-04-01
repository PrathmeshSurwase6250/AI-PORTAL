import React, { useState } from 'react';
import { BsRobot } from "react-icons/bs";
import { IoSparklesSharp, IoMailOutline, IoLockClosedOutline, IoPersonOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerURL } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // UI State
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "jobseeker"
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ADMIN_EMAIL = "prathameshsurwase6250@gmail.com";
  const ADMIN_PASS  = "9322124068@p";

  const handleStandardAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      let result;

      if (isLogin) {
        // If admin credentials typed in normal form — use admin-login endpoint silently
        if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASS) {
          result = await axios.post(
            ServerURL + '/api/auth/admin-login',
            { email: formData.email, password: formData.password },
            { withCredentials: true }
          );
        } else {
          result = await axios.post(
            ServerURL + '/api/auth/login',
            { email: formData.email, password: formData.password },
            { withCredentials: true }
          );
        }
      } else {
        // SIGNUP
        result = await axios.post(
          ServerURL + '/api/auth/sign',
          formData,
          { withCredentials: true }
        );
      }

      localStorage.setItem("token", result.data.accessToken);

      const userRes = await axios.get(ServerURL + "/api/user/current-user", {
        headers: { Authorization: `Bearer ${result.data.accessToken}` },
        withCredentials: true
      });

      dispatch(setUserData(userRes.data));
      if (userRes.data?.role === 'recruiter') {
        navigate('/recruiter');
      } else if (userRes.data?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await signInWithPopup(auth, provider);
      let firebaseUser = response.user;
      let username = firebaseUser.displayName;
      let email = firebaseUser.email;

      let authResult;
      // Silent Admin check for Google Auth too
      if (email === ADMIN_EMAIL) {
        authResult = await axios.post(
          ServerURL + '/api/auth/admin-login',
          { email: email, password: ADMIN_PASS }, // password is required by controller
          { withCredentials: true }
        );
      } else {
        authResult = await axios.post(
          ServerURL + '/api/auth/google',
          { username, email },
          { withCredentials: true }
        );
      }

      localStorage.setItem("token", authResult.data.accessToken);

      const userRes = await axios.get(ServerURL + "/api/user/current-user", {
        headers: { Authorization: `Bearer ${authResult.data.accessToken}` },
        withCredentials: true
      });

      dispatch(setUserData(userRes.data));
      if (userRes.data?.role === 'recruiter') {
        navigate('/recruiter');
      } else if (userRes.data?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen py-12 relative flex items-center justify-center overflow-x-hidden bg-brand-50'>
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl glass-panel shadow-xl'
      >
        <div className='flex flex-col items-center justify-center gap-2 mb-6'>
          <div className='bg-brand-600 text-white p-3 rounded-2xl shadow-lg shadow-brand-500/30 mb-1'>
            <BsRobot size={24} />
          </div>
          <h2 className='font-heading font-bold text-xl text-gray-900 tracking-tight'>AI Portal</h2>
        </div>

        <h1 className='text-3xl font-bold text-center leading-tight mb-2 text-gray-800 tracking-tight'>
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className='text-gray-500 text-center text-sm mb-6'>
          {isLogin ? "Please enter your details to sign in." : "Join us and revolutionize your hiring process."}
        </p>

        {/* Auth Toggle Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button" 
            onClick={() => { setIsLogin(true); setErrorMsg(""); }} 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button 
            type="button" 
            onClick={() => { setIsLogin(false); setErrorMsg(""); }} 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Standard Email/Password Form */}
        <form onSubmit={handleStandardAuth} className="space-y-4 mb-6">
          
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                <div className="relative">
                  <IoPersonOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} required placeholder="Full Name" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-gray-800" />
                </div>
                
                <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1">
                  <button type="button" onClick={() => setFormData({...formData, role: 'jobseeker'})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.role === 'jobseeker' ? 'bg-white shadow-sm text-brand-600 border border-gray-100' : 'text-gray-500'}`}>Job Seeker</button>
                  <button type="button" onClick={() => setFormData({...formData, role: 'recruiter'})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.role === 'recruiter' ? 'bg-white shadow-sm text-brand-600 border border-gray-100' : 'text-gray-500'}`}>Recruiter</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <IoMailOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email Address" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-gray-800" />
          </div>

          <div className="relative">
            <IoLockClosedOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="Password" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-gray-800" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand-500/20 disabled:opacity-70 mt-4 flex items-center justify-center">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Or continue with</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Google Auth Fallback */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleAuth}
          className='w-full bg-white border border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-3 py-3 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow-md transition-all disabled:opacity-70'
        >
          <FcGoogle size={22} />
          <span>Google</span>
        </button>



      </motion.div>
    </div>
  )
}

export default Auth;