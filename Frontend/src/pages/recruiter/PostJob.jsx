import React, { useState } from 'react';
import JobForm from '../../components/Jobs/JobForm';
import { createJobPost } from '../../services/jobApi';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleCreateJob = async (jobData) => {
        try {
            setLoading(true);
            setSuccessMsg('');
            await createJobPost(jobData);
            setSuccessMsg('Job successfully posted! Redirecting to Dashboard...');
            setTimeout(() => {
                navigate('/recruiter');
            }, 2000);
        } catch (err) {
            console.error(err);
            alert("Failed to create job post. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">Post a New Job</h1>
                <p className="text-gray-500 mt-2">Publish an open role to the AI Portal to start finding top talent immediately.</p>
            </div>

            <JobForm 
                onSubmit={handleCreateJob}
                loading={loading}
                successMsg={successMsg}
            />
        </div>
    );
};

export default PostJob;
