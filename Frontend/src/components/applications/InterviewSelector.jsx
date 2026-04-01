import React, { useState, useEffect } from 'react';
import { getMyInterviews } from '../../services/interviewApi';
import { IoBarChartOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const InterviewSelector = ({ onSelectInterview, selectedInterviewId }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getMyInterviews();
        // Assuming backend returns an array under `interviews` key
        const fetchedInterviews = res.interviews || [];
        // Only show completed interviews
        const completedInterviews = fetchedInterviews.filter(i => i.status === 'completed' || i.status === 'Completed' || i.finalScore > 0);
        setInterviews(completedInterviews);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-3">
        <div className="h-16 bg-gray-100 rounded-xl w-full"></div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-gray-500 text-sm font-medium">No completed interview practice sessions.</p>
        <p className="text-gray-400 text-xs mt-1">Stand out by taking an AI interview test first!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 mt-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Attach Interview Score (Optional)</h3>
        {selectedInterviewId && (
            <button onClick={() => onSelectInterview(null)} className="text-xs text-brand-600 hover:underline">Clear Selection</button>
        )}
      </div>

      {interviews.map(interview => (
        <div 
          key={interview._id}
          onClick={() => onSelectInterview(selectedInterviewId === interview._id ? null : interview._id)}
          className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
            selectedInterviewId === interview._id 
              ? 'border-brand-500 bg-brand-50 shadow-sm' 
              : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
          }`}
        >
          <div className={`p-2 rounded-lg ${selectedInterviewId === interview._id ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'}`}>
            <IoBarChartOutline size={20} />
          </div>
          <div className="flex-1">
            <p className={`font-medium text-sm capitalize ${selectedInterviewId === interview._id ? 'text-brand-900' : 'text-gray-700'}`}>
              {interview.role} ({interview.mode})
            </p>
            <p className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${interview.finalScore >= 7 ? 'bg-green-100 text-green-700' : interview.finalScore >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    Score: {interview.finalScore}/10
                </span>
                <span className="text-xs text-gray-400">{new Date(interview.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
          {selectedInterviewId === interview._id && (
            <IoCheckmarkCircleOutline className="text-brand-600 text-xl" />
          )}
        </div>
      ))}
    </div>
  );
};

export default InterviewSelector;
