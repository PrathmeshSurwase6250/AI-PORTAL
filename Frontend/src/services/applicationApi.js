import axios from 'axios';
import { ServerURL } from '../config/server';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    };
};

export const applyForJob = async (job_id, resume_id, interview_id = null) => {
    const payload = interview_id ? { job_id, resume_id, interview_id } : { job_id, resume_id };
    const response = await axios.post(`${ServerURL}/api/application/apply`, payload, getHeaders());
    return response.data;
};

export const getMyApplications = async () => {
    const response = await axios.get(`${ServerURL}/api/application/my-applications`, getHeaders());
    return response.data;
};

export const getJobApplicants = async (job_id) => {
    const response = await axios.get(`${ServerURL}/api/application/job-applications/${job_id}`, getHeaders());
    return response.data;
};

export const updateApplicationStatus = async (application_id, status) => {
    const response = await axios.patch(`${ServerURL}/api/application/update-status/${application_id}`, { status }, getHeaders());
    return response.data;
};

export const checkApplication = async (job_id) => {
    const response = await axios.get(`${ServerURL}/api/application/check/${job_id}`, getHeaders());
    return response.data;
};

export const withdrawApplication = async (job_id) => {
    const response = await axios.delete(`${ServerURL}/api/application/withdraw/${job_id}`, getHeaders());
    return response.data;
};
