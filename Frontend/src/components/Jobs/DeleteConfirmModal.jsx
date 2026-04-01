import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoWarningOutline } from 'react-icons/io5';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, jobTitle, loading }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                        <IoWarningOutline size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Job Post?</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Are you sure you want to permanently delete <strong className="text-gray-900">"{jobTitle}"</strong>? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-500/20 transition flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Delete'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
