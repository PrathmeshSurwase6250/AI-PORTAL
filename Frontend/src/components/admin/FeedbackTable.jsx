import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ServerURL } from '../../App';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${ServerURL}/api/admin/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">User</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider w-full">Feedback Message</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-40"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-96"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-24 float-right"></div></td>
                </tr>
              ))
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-500 font-medium">No feedback received.</td>
              </tr>
            ) : (
              feedbacks.map(f => (
                <tr key={f._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm">
                    <div className="font-bold text-gray-900">{f.user?.username || 'Anonymous'}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{f.user?.email || ''}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-medium whitespace-normal max-w-xl">
                    "{f.message || f.feedbackMessage || 'No content provided.'}"
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400 text-right font-medium">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackTable;
