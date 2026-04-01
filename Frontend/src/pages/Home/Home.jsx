import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IoSparklesSharp, IoCodeWorking, IoBriefcaseOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { BsRobot, BsArrowRight } from 'react-icons/bs';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-10 left-[15%] w-72 h-72 bg-brand-400/20 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute top-20 right-[15%] w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 mb-8 shadow-sm"
        >
          <IoSparklesSharp className="text-brand-500" />
          <span>The next generation AI platform for hiring</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-heading font-extrabold text-gray-900 tracking-tight leading-tight mb-6 max-w-4xl"
        >
          Accelerate your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">AI Intelligence</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed"
        >
          Whether you're looking for your dream job or the perfect candidate, our AI-powered portal streamlines resume building, interviewing, and job matching.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
            Get Started <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 font-medium rounded-full border border-gray-200 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center">
            Explore Jobs
          </Link>
        </motion.div>
      </section>

      {/* Trusted By Section (Infinite Marquee) */}
      <section className="w-full py-12 bg-white border-y border-gray-100 overflow-hidden flex flex-col items-center">
        <h3 className="text-gray-500 font-medium mb-8">
          <span className="text-brand-600 font-bold">Trusted</span> by Industry Veterans
        </h3>
        <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-scroll gap-20 pr-20 items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
            {/* Duplicated for seamless loop */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 font-serif text-xl font-bold tracking-widest text-[#d32f2f]">
                  ADITYA BIRLA
                </div>
                <div className="flex items-center font-bold text-2xl tracking-tighter text-[#000]">
                  amazon
                </div>
                <div className="flex items-center font-black text-2xl tracking-tight text-[#ff0000]">
                  boAt
                </div>
                <div className="flex items-center gap-1 font-sans text-xl font-medium tracking-wide text-[#555]">
                  <span className="text-[#e22d2c] font-bold">CK</span> BIRLA GROUP
                </div>
                <div className="flex items-center font-serif italic font-bold text-3xl tracking-tight text-[#e31837]">
                  Coca-Cola
                </div>
                <div className="flex items-center font-bold italic text-2xl text-[#2874f0]">
                  Flipkart <span className="ml-1 bg-[#ffe500] text-[#2874f0] text-xs px-1 py-0.5 not-italic rounded-sm">f</span>
                </div>
                <div className="flex items-center font-serif text-2xl tracking-[0.2em] text-[#000]">
                  L'ORÉAL
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-gray-500 text-lg">Our suite of AI tools is designed to give you an unfair advantage in the modern job market.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<IoBriefcaseOutline size={28} />}
              title="Smart Job Matching"
              description="Our AI analyzes your skills and experience to find the perfect job opportunities that align with your career goals."
              delay={0.1}
            />
            <FeatureCard 
              icon={<IoDocumentTextOutline size={28} />}
              title="AI Resume Builder"
              description="Instantly generate and optimize your resume using AI algorithms trained on thousands of successful candidate profiles."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BsRobot size={28} />}
              title="Mock Interviews"
              description="Practice with our AI interviewer that adapts to your target role and provides real-time feedback on confidence and correctness."
              delay={0.3}
            />
            <FeatureCard 
              icon={<IoCodeWorking size={28} />}
              title="AI Code Review"
              description="For technical roles, get your code snippets and projects analyzed instantly to prepare for technical rounds."
              delay={0.4}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
