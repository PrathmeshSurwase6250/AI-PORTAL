import React, { useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import axios from "axios";

// Base Pages
import Home from './pages/home/Home'
import Jobs from './pages/jobs/Jobs'
import JobDetails from './pages/jobs/JobDetails'
import InterviewHome from './pages/interview/InterviewHome'
import Auth from './pages/auth/Auth'
import Contact from './pages/home/Contact'
import About from './pages/home/About'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Settings from './pages/settings/Settings'

// Common Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

// Application Management Pages
import MyApplications from './pages/applications/MyApplications'
import MyResumesPage from './pages/jobseeker/MyResumesPage'
import MyInterviewsPage from './pages/jobseeker/MyInterviewsPage'
import AIJobMatches from './pages/jobseeker/AIJobMatches'
import JobApplicants from './pages/applications/JobApplicants'

import JobseekerDashboard from './pages/jobseeker/Dashboard'
import ResumeBuilderPage from './pages/ai/ResumeBuilderPage'
import CodeReviewerPage from './pages/ai/CodeReviewerPage'

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminJobs from './pages/admin/Jobs'
import AdminResetRequests from './pages/admin/AdminResetRequests'
import AdminApplications from './pages/admin/Applications'
import AdminFeedback from './pages/admin/Feedback'

// Recruiter Layout & Pages
import DashboardLayout from './layouts/DashboardLayout'
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
      console.log("Error fetching user session:", error);
      // If token is invalid or expired, remove it so guards correctly redirect to /auth
      localStorage.removeItem("token");
      dispatch(setUserData(null));
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
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/interview" element={<ProtectedRoute><InterviewHome /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/dashboard" element={<ProtectedRoute><JobseekerDashboard /></ProtectedRoute>} />
        <Route path="/ai-resume" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
        <Route path="/ai-job-matching" element={<ProtectedRoute><AIJobMatches /></ProtectedRoute>} />
        <Route path="/code-reviewer" element={<ProtectedRoute><CodeReviewerPage /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Application Management Routes */}
        <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="/my-resumes" element={<ProtectedRoute><MyResumesPage /></ProtectedRoute>} />
        <Route path="/my-interviews" element={<ProtectedRoute><MyInterviewsPage /></ProtectedRoute>} />
        <Route path="/job-applications/:job_id" element={<ProtectedRoute><JobApplicants /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="reset-requests" element={<AdminResetRequests />} />
      </Route>

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={<DashboardLayout />}>
        <Route index element={<RecruiterDashboard />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
        <Route path="applicants" element={<RecruiterApplicants />} />
        <Route path="applicants/:jobId" element={<RecruiterApplicants />} />
        <Route path="company-profile" element={<CompanyProfile />} />
      </Route>
    </Routes>
  )
}

export default App;