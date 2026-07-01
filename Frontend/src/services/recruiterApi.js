import axios from 'axios';
import { ServerURL } from '../config/server';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    };
};

export const getRecruiterStats = async () => {
    const response = await axios.get(`${ServerURL}/api/recruiter/dashboard`, getHeaders());
    return response.data;
};

export const getRecruiterJobs = async () => {
    const response = await axios.get(`${ServerURL}/api/recruiter/jobs`, getHeaders());
    return response.data;
};

export const getJobApplicants = async (jobId) => {
    const response = await axios.get(`${ServerURL}/api/recruiter/applicants/${jobId}`, getHeaders());
    return response.data;
};

export const updateApplicantStatus = async (applicationId, status) => {
    const response = await axios.patch(`${ServerURL}/api/recruiter/application/${applicationId}`, { status }, getHeaders());
    return response.data;
};
