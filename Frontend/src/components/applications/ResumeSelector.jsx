import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ServerURL } from '../../config/server';
import { IoDocumentTextOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const ResumeSelector = ({ onSelectResume, selectedResumeId }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${ServerURL}/api/resume/showResumes`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setResumes(res.data.resumes || []);
      } catch (err) {
        console.error("Error fetching resumes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-3">
        <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
        <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-6 bg-brand-50 rounded-2xl border border-brand-100 border-dashed">
        <IoDocumentTextOutline className="text-brand-300 mx-auto text-4xl mb-2" />
        <p className="text-brand-800 text-sm font-medium mb-3">No resumes uploaded yet.</p>
        <button className="text-xs font-bold text-white bg-brand-600 px-4 py-2 rounded-full hover:bg-brand-700 transition">
          Build AI Resume
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
      {resumes.map(resume => (
        <div 
          key={resume._id}
          onClick={() => onSelectResume(resume._id)}
          className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
            selectedResumeId === resume._id 
              ? 'border-brand-500 bg-brand-50 shadow-sm' 
              : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
          }`}
        >
          <div className={`p-2 rounded-lg ${selectedResumeId === resume._id ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'}`}>
            <IoDocumentTextOutline size={20} />
          </div>
          <div className="flex-1">
            <p className={`font-medium text-sm ${selectedResumeId === resume._id ? 'text-brand-900' : 'text-gray-700'}`}>
              {resume?.professionalSummary?.substring(0, 30) || 'My Resume Document'}...
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Updated {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
          {selectedResumeId === resume._id && (
            <IoCheckmarkCircleOutline className="text-brand-600 text-xl" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumeSelector;
