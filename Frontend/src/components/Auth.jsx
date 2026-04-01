import React, { use } from 'react'

import { useSelector } from "react-redux";
import { useEffect } from "react";
import {FaTimes} from 'react-icons/fa'

const Auth = ({close}) => {
    const {userData} =useSelector((state) => state.user);
    useEffect(() => {
        if (userData) {
            close();
            }   
    }, [userData, close]);
  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4 py-6'>
        <div className='relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
            <button  onClick={close} className='absolute top-8 right-5 text-gray-600 hover:text-black text-xl'>
                <FaTimes size={18}/>
            </button>
            < Auth isModel={true} />
        </div>
    </div>
  )
}

export default Auth 