import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoBriefcaseOutline, IoPeopleOutline, IoStatsChartOutline, IoAddCircleOutline } from 'react-icons/io5';

const RecruiterSidebar = () => {
    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
            <div className="p-6 border-b border-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">R</div>
                    <span className="text-xl font-heading font-extrabold text-gray-900 tracking-tight">Recruiter<span className="text-indigo-600">Pro</span></span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Menu</p>
                <NavLink 
                    to="/recruiter" 
                    end
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                    <IoStatsChartOutline className="text-lg" /> Dashboard
                </NavLink>
                <NavLink 
                    to="/recruiter/post-job" 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                    <IoAddCircleOutline className="text-lg" /> Post New Job
                </NavLink>
                <NavLink 
                    to="/recruiter/manage-jobs" 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                    <IoBriefcaseOutline className="text-lg" /> Manage Jobs
                </NavLink>
                <NavLink 
                    to="/recruiter/applicants" 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                    <IoPeopleOutline className="text-lg" /> Applicants
                </NavLink>
                
            </nav>
        </aside>
    );
};

export default RecruiterSidebar;
