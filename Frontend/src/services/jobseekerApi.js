import axios from 'axios';
import { ServerURL } from '../config/server';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    };
};

export const getDashboardStats = async () => {
    const response = await axios.get(`${ServerURL}/api/jobseeker/dashboard`, getHeaders());
    return response.data;
};

export const getMyResumes = async () => {
    const response = await axios.get(`${ServerURL}/api/jobseeker/resumes`, getHeaders());
    return response.data;
};

export const getMyInterviews = async () => {
    const response = await axios.get(`${ServerURL}/api/jobseeker/interviews`, getHeaders());
    return response.data;
};

export const getInterviewPerformances = async () => {
    const response = await axios.get(`${ServerURL}/api/jobseeker/interview-performances`, getHeaders());
    return response.data;
};
