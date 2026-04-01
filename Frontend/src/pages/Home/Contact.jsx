import React, { useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { ServerURL } from '../../App';
import { useSelector } from 'react-redux';
import { IoChatbubbleEllipsesOutline, IoCheckmarkCircleOutline, IoStar, IoStarOutline, IoWarningOutline } from 'react-icons/io5';

const Contact = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackForm, setFeedbackForm] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });
    
    // Feedback requires user login per the backend schema
    const userData = useSelector((state) => state.user?.userData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userData) {
            setStatus({ type: 'error', text: 'You must be logged in to leave feedback!' });
            return;
        }

        if (rating === 0) {
            setStatus({ type: 'error', text: 'Please select a star rating.' });
            return;
        }

        if (!feedbackForm.trim()) {
            setStatus({ type: 'error', text: 'Please fill in the feedback description.' });
            return;
        }

        try {
            setLoading(true);
            setStatus({ type: '', text: '' });
            
            const token = localStorage.getItem('token');
            await axios.post(`${ServerURL}/api/feedback/feedback`, {
                feedback_Form: feedbackForm,
                rating: rating
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            setStatus({ type: 'success', text: 'Thank you! Your feedback has been sent.' });
            setRating(0);
            setFeedbackForm('');
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', text: err.response?.data?.message || 'Server error uploading feedback.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-12 pb-20">
            <div className="w-full max-w-4xl mx-auto px-6">
                
                <div className="text-center mb-12">
                    <IoChatbubbleEllipsesOutline className="text-5xl text-indigo-600 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight">
                        We'd Love Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Feedback</span>
                    </h1>
                    <p className="text-gray-500 mt-4 text-lg">
                        Help us improve your AI Portal experience. Let us know how we're doing!
                    </p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                >
                    {status.text && (
                        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            {status.type === 'error' ? <IoWarningOutline className="text-2xl" /> : <IoCheckmarkCircleOutline className="text-2xl" />}
                            <span className="font-bold">{status.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-gray-700 font-bold mb-3 text-center md:text-left">Rate your experience</label>
                            <div className="flex justify-center md:justify-start gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="text-4xl focus:outline-none transition-transform hover:scale-110"
                                    >
                                        {(hoverRating || rating) >= star ? (
                                            <IoStar className="text-yellow-400 drop-shadow-sm" />
                                        ) : (
                                            <IoStarOutline className="text-gray-300" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-3">Tell us more</label>
                            <textarea
                                rows="6"
                                value={feedbackForm}
                                onChange={(e) => setFeedbackForm(e.target.value)}
                                placeholder="What features do you love? What could we improve?"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-gray-700 font-medium placeholder-gray-400"
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 flex justify-center items-center"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
