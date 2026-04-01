import React, { useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import axios from "axios";

// Base Pages
import Home from './pages/Home/Home'
import Jobs from './pages/Jobs'
import InterviewHome from './pages/InterviewHome'
import Auth from './pages/Auth'
import Contact from './pages/Home/Contact'
import About from './pages/Home/About'

// Common Components
import Navbar from './components/Common/Navbar'
import Footer from './components/Common/Footer'

// Application Management Pages
import MyApplications from './pages/applications/MyApplications'
import JobApplicants from './pages/applications/JobApplicants'

import JobseekerDashboard from './pages/jobseeker/Dashboard'
import ResumeBuilderPage from './pages/ai/ResumeBuilderPage'

// Admin Layout & Pages
import AdminLayout from './pages/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminJobs from './pages/admin/Jobs'
import AdminApplications from './pages/admin/Applications'
import AdminFeedback from './pages/admin/Feedback'

// Recruiter Layout & Pages
import DashboardLayout from './pages/layout/DashboardLayout'
import RecruiterDashboard from './pages/recruiter/Dashboard'
import PostJob from './pages/recruiter/PostJob'
import ManageJobs from './pages/recruiter/ManageJobs'
import RecruiterApplicants from './pages/recruiter/Applicants'
import CompanyProfile from './pages/recruiter/CompanyProfile'

// Configuration
export const ServerURL = 'http://localhost:3000'

// A small layout strictly for the public/jobseeker pages
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        ServerURL + "/api/user/current-user",
        {
          headers: { Authorization: `Bearer ${token}` },
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
      {/* Public / Jobseeker Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/interview" element={<InterviewHome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<JobseekerDashboard />} />
        <Route path="/ai-resume" element={<ResumeBuilderPage />} />

        {/* Application Management Routes */}
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/job-applications/:job_id" element={<JobApplicants />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="feedback" element={<AdminFeedback />} />
      </Route>

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={<DashboardLayout />}>
        <Route index element={<RecruiterDashboard />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
        <Route path="applicants" element={<RecruiterApplicants />} />
        <Route path="company-profile" element={<CompanyProfile />} />
      </Route>
    </Routes>
  )
}

export default App;