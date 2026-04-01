import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoNotificationsOutline, IoSearchOutline, IoMenuOutline } from 'react-icons/io5';
import { FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerURL } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/userSlice';

const AdminNavbar = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user?.userData);

  const handleLogout = async () => {
    try {
      await axios.get(`${ServerURL}/api/auth/logout`, { withCredentials: true });
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      navigate("/auth");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 h-16 ml-0 md:ml-64 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all">
      {/* Search / Toggle */}
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50" onClick={toggleSidebar}>
          <IoMenuOutline size={24} />
        </button>
        <div className="hidden md:flex items-center relative w-full max-w-sm">
          <IoSearchOutline className="absolute left-3 text-gray-400 text-lg" />
          <input 
            type="text" 
            placeholder="Search users, jobs, applications..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 focus:bg-white transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-brand-600 rounded-full hover:bg-brand-50 transition-colors">
          <IoNotificationsOutline size={22} className="relative z-10" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center border border-brand-200 shadow-sm">
              <FaUserShield size={14} />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-sm font-bold text-gray-900">{userData?.username || 'Admin'}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Superadmin</span>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 origin-top-right ring-1 ring-black/5"
              >
                <div className="px-5 py-3 border-b border-gray-50 mb-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                    <FaUserShield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{userData?.username || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{userData?.email || 'admin@aiportal.com'}</p>
                  </div>
                </div>
                
                <div className="px-2">
                  <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-xl transition-colors">My Profile</button>
                  <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-xl transition-colors">System Settings</button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
