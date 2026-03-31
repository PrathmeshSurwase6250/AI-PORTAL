import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import InterviewHome from './pages/InterviewHome'
import Auth from './pages/Auth'
export const ServerURL = 'http://localhost:3000'

import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        ServerURL + "/api/user/current-user",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      dispatch(setUserData(res.data));

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<InterviewHome />} />
      <Route path="/interview" element={<InterviewHome />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App;