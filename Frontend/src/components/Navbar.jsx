import React, { useState } from 'react'
import { motion } from "motion/react"
import { useDispatch, useSelector } from 'react-redux';
import {FaUserAstronaut} from "react-icons/fa";
import Aiportal from "../assets/Aiportal.png";
import { useNavigate } from 'react-router-dom';
import { ServerURL } from '../App';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';

const Navbar = () => {

    const userData = useSelector((state) => state.auth.userData);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handlelogout = async ()=>{
        try{
            await axios.get(ServerURL + "/api/auth/logout", { withCredentials: true });
            dispatch(setUserData(null));
            navigate("/auth");
            setShowMenu(false);
        }catch(err){
            console.log(err);
        }
    }
  
  return (
    <motion.div initial={{ opacity: 0 ,y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{duration : 0.4}} className='bg-[#f3f3f3] pt-4 px-4 flex justify-center '>
        <div className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative '>
            <div className='flex items-center gap-3 cursor-pointer'>
                <div className='text-white p-2 rounded-lg'> <img src={Aiportal} className='w-6 h-6 object-contain'    alt="Aiportal" /> </div>
                <h1 className='font-semibond hidden md:block text-lg '>AI Portal</h1>
            </div>
            <div className='flex items-center gap-6 relative '>
                <div className='relative'>
                    <button className='flex items-center gap-2 px-4 py-2 rounded-full text-md hover:text-blue-600 transition'>Home</button>
                </div>
            </div>
            <div className='flex items-center gap-6 relative '>
                <div className='relative'>
                    <button className='flex items-center gap-2 px-4 py-2 rounded-full text-md hover:text-blue-600 transition'>Jobs</button>
                </div>
            </div>
            <div className='flex items-center gap-6 relative '>
                <div className='relative'>
                    <button className='flex items-center gap-2 px-4 py-2 rounded-full text-md hover:text-blue-600 transition'>AI Resume</button>
                </div>
            </div>
            <div className='flex items-center gap-6 relative '>
                <div className='relative'>
                    <button className='flex items-center gap-2 px-4 py-2 rounded-full text-md hover:text-blue-600 transition'>AI Resume Analyzer</button>
                </div>
            </div>
            <div className='flex items-center gap-6 relative '>
                <div className='relative'>
                    <button className='flex items-center gap-2 px-4 py-2 rounded-full text-md hover:text-blue-600 transition'>AI Code Reviewer</button>
                </div>
            </div>
             <div className='flex items-center gap-6 relative '>
                <div className='relative'>
                    <button className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold' onClick={()=>{setShowMenu(!showMenu)} }>
                    {userData?.name
                      ? userData.name.charAt(0).toUpperCase()
                      : <FaUserAstronaut />}
                    </button>

                    {showMenu && (
                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-5 z-50'>
                            <button className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600' onClick={()=>navigate("/auth")}>Profile</button>
                            <button className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600'>Settings</button>
                            <button className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600' onClick={handlelogout}>Logout</button>
                             </div>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default Navbar   