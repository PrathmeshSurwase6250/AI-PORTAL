import React from 'react';
import UsersTable from '../../components/admin/UsersTable';

const Users = () => {
    return (
        <div>
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Manage Users</h1>
                    <p className="text-gray-500 mt-1">View, update roles, and manage all users on the platform.</p>
                </div>
            </div>

            <UsersTable />
        </div>
    );
};

export default Users;
