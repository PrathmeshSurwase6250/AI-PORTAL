import React from 'react';
import { motion } from 'motion/react';
import { IoRocketOutline, IoShieldCheckmarkOutline, IoTrendingUpOutline, IoCodeSlashOutline } from 'react-icons/io5';
import { BsRobot } from 'react-icons/bs';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-12 pb-20">
            <div className="w-full max-w-6xl mx-auto px-6">
                
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="w-20 h-20 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-brand-500/30"
                    >
                        <BsRobot />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 tracking-tight mb-4">
                        Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Hiring</span> with AI
                    </h1>
                    <p className="text-gray-500 mt-4 text-xl max-w-3xl mx-auto leading-relaxed">
                        We built the AI Portal to bridge the gap between incredible talent and forward-thinking companies. By leveraging cutting-edge Artificial Intelligence, we eliminate bias and accelerate the connection process.
                    </p>
                </div>

                {/* Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center"
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                            <IoRocketOutline />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Empowering Candidates</h3>
                        <p className="text-gray-500 leading-relaxed">
                            From intelligent AI Resume generation to lifelike Mock Interviews, we give every candidate the tools to perform at their absolute best.
                        </p>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center"
                    >
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                            <IoShieldCheckmarkOutline />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Pipelines</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Recruiters gain access to pre-vetted skill metrics driven by our machine learning modules, drastically reducing hiring cycle time.
                        </p>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center"
                    >
                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                            <IoTrendingUpOutline />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Data Driven Growth</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Through continuous feedback and analytic tracking, both seekers and organizations can visualize macro market trends in real time.
                        </p>
                    </motion.div>

                </div>

                {/* Tech Stack Banner */}
                <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                    
                    <IoCodeSlashOutline className="text-5xl text-gray-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-heading font-extrabold mb-4">Built for the Modern Web</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Our platform is engineered using a robust MERN stack architecture integrated seamlessly with Large Language Models and framer-motion UI mechanics.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-bold border border-slate-700">MongoDB</span>
                        <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-bold border border-slate-700">Express.js</span>
                        <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-bold border border-slate-700">React + Vite</span>
                        <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-bold border border-slate-700">Node</span>
                        <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-bold border border-slate-700">Tailwind CSS 4</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
