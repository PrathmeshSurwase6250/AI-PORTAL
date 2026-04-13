import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoCloseOutline } from 'react-icons/io5';
import JobForm from './JobForm';
import { updateJobPost } from '../../services/jobApi';

const EditJobModal = ({ job, isOpen, onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleUpdateJob = async (jobData) => {
        try {
            setLoading(true);
            setSuccessMsg('');

            const formData = new FormData();
            Object.keys(jobData).forEach(key => {
                if (jobData[key] !== null) {
                    formData.append(key, jobData[key]);
                }
            });

            await updateJobPost(job._id, formData);
            setSuccessMsg('Job successfully updated!');
            
            setTimeout(() => {
                onRefresh(); // refresh the table
                onClose(); // close the modal
            }, 1500);
        } catch (err) {
            console.error(err);
            alert("Failed to update job post.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-[2px] overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-gray-50 rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-100 my-8 overflow-hidden"
                >
                    <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-gray-900">Edit Job Post</h2>
                            <p className="text-gray-500 text-sm mt-1">Make changes to "{job?.job_title}"</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <IoCloseOutline size={26} />
                        </button>
                    </div>

                    <div className="p-6">
                        <JobForm 
                            initialData={job}
                            onSubmit={handleUpdateJob}
                            loading={loading}
                            successMsg={successMsg}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditJobModal;
