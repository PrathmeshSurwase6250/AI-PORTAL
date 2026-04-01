import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ServerURL } from '../../App';
import { IoTrashOutline, IoPencilOutline } from 'react-icons/io5';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null); // id of user being edited
  const [newRole, setNewRole] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${ServerURL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${ServerURL}/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleUpdateRole = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${ServerURL}/api/admin/user-role/${id}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      setEditingRole(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">User NAME</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Email</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider">Role</th>
              <th className="py-4 px-6 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-16 float-right"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 font-medium">No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">{user.username}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{user.email}</td>
                  <td className="py-4 px-6 text-sm">
                    {editingRole === user._id ? (
                      <div className="flex items-center gap-2">
                        <select 
                          value={newRole} 
                          onChange={(e) => setNewRole(e.target.value)}
                          className="bg-white border border-gray-200 rounded-md text-xs py-1 px-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          <option value="jobseeker">Jobseeker</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button onClick={() => handleUpdateRole(user._id)} className="text-xs font-bold text-brand-600 hover:underline">Save</button>
                        <button onClick={() => setEditingRole(null)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                      </div>
                    ) : (
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                        user.role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-teal-50 text-teal-600'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => { setEditingRole(user._id); setNewRole(user.role); }}
                        className="text-gray-400 hover:text-brand-600 transition-colors"
                        title="Edit Role"
                      >
                        <IoPencilOutline size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete User"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
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

export default UsersTable;
