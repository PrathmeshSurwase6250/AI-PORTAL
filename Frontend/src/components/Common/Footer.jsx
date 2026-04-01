import React from 'react';
import { Link } from 'react-router-dom';
import { BsRobot } from 'react-icons/bs';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-brand-600 text-white p-2 rounded-lg">
                <BsRobot size={20} />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-gray-900">
                AI Portal
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The next generation AI platform for hiring. Accelerate your career with AI intelligence and smart job matching.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-brand-600 transition"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand-600 transition"><FaLinkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand-600 transition"><FaGithub size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-gray-900 mb-4">For Jobseekers</h3>
            <ul className="space-y-3">
              <li><Link to="/jobs" className="text-gray-500 hover:text-brand-600 text-sm transition">Browse Jobs</Link></li>
              <li><Link to="/resume" className="text-gray-500 hover:text-brand-600 text-sm transition">AI Resume Builder</Link></li>
              <li><Link to="/interview" className="text-gray-500 hover:text-brand-600 text-sm transition">Mock Interviews</Link></li>
              <li><Link to="/my-applications" className="text-gray-500 hover:text-brand-600 text-sm transition">Track Applications</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-gray-900 mb-4">For Employers</h3>
            <ul className="space-y-3">
              <li><Link to="/recruiter/post-job" className="text-gray-500 hover:text-brand-600 text-sm transition">Post a Job</Link></li>
              <li><Link to="/recruiter/dashboard" className="text-gray-500 hover:text-brand-600 text-sm transition">Recruiter Dashboard</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-brand-600 text-sm transition">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-brand-600 text-sm transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-brand-600 text-sm transition">Contact Support</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-brand-600 text-sm transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-brand-600 text-sm transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AI Portal. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">Made with <span className="text-red-500">♥</span> digitally</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
