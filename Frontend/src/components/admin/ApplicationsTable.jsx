import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ServerURL } from '../../App';
import { IoDocumentTextOutline } from 'react-icons/io5';

const ApplicationsTable = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${ServerURL}/api/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Applicant Name</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Applied Job</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Resume</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-40"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                </tr>
              ))
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 font-medium">No applications found.</td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">{app.user?.username || 'Unknown Applicant'}</td>
                  <td className="py-4 px-6 text-sm font-medium text-brand-600">{app.job?.job_title || 'Unknown Job'}</td>
                  <td className="py-4 px-6 text-sm">
                    {app.resume ? (
                      <button className="flex items-center gap-2 text-gray-500 hover:text-brand-600 bg-gray-50 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-gray-100 transition-colors">
                        <IoDocumentTextOutline /> View Resume
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">No Resume</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      app.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                      app.status === 'accepted' ? 'bg-green-50 text-green-600' :
                      app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {app.status || 'pending'}
                    </span>
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

export default ApplicationsTable;
