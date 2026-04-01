import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoCloseOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import ResumeSelector from './ResumeSelector';
import InterviewSelector from './InterviewSelector';
import { applyForJob } from '../../services/applicationApi';

const ApplyJobModal = ({ job, onClose }) => {
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [success, setSuccess] = useState(false);

  const handleApply = async () => {
    if (!selectedResumeId) {
      setStatusMessage({ type: 'error', text: 'Please select a resume first.' });
      return;
    }

    try {
      setLoading(true);
      setStatusMessage({ type: '', text: '' });
      
      await applyForJob(job._id, selectedResumeId, selectedInterviewId);
      
      setSuccess(true);
      setStatusMessage({ type: 'success', text: 'Successfully applied for this position!' });
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to apply. Please try again or check if you already applied.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900">Apply for Role</h2>
              <p className="text-gray-500 text-sm mt-1">{job?.job_title} at {job?.company_name}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>

          <div className="p-6">
            {success ? (
              <div className="flex flex-col items-center justify-center py-10">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <IoCheckmarkCircleOutline className="text-green-500 text-7xl mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Sent!</h3>
                <p className="text-gray-500 text-center text-sm">
                  The hiring team will review your profile shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Select Resume</h3>
                
                <ResumeSelector 
                  selectedResumeId={selectedResumeId} 
                  onSelectResume={setSelectedResumeId} 
                />

                <InterviewSelector
                    selectedInterviewId={selectedInterviewId}
                    onSelectInterview={setSelectedInterviewId}
                />

                {statusMessage.text && (
                  <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {statusMessage.text}
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApply}
                    disabled={loading || !selectedResumeId}
                    className="flex-1 px-4 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-brand-500/20 flex justify-center items-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Submit Application'}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplyJobModal;
