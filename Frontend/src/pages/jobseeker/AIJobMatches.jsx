import React from 'react';
import SuggestedJobs from '../../components/home/SuggestedJobs';
import { motion } from 'motion/react';
import { IoSparklesOutline } from 'react-icons/io5';

const AIJobMatches = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
                        <IoSparklesOutline /> AI Powered Matching
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight">
                        Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-brand-500">Career Matches</span>
                    </h1>
                    <p className="text-gray-500 mt-4 text-lg">
                        Our AI analyzes your skills, experience, and resume to find the perfect opportunities that align with your career goals.
                    </p>
                </motion.div>

                {/* Main Component */}
                <SuggestedJobs />

                {/* Additional Info / CTA */}
                <div className="mt-12 p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Not seeing the right roles?</h3>
                        <p className="text-gray-500 text-sm">Update your resume to provide our AI with more context about your latest projects, skills, and achievements for even better accuracy.</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => window.location.href='/ai-resume'}
                            className="px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                        >
                            Update AI Resume
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AIJobMatches;
