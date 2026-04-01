import axios from 'axios';
import { ServerURL } from '../config/server';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    };
};

export const createJobPost = async (jobData) => {
    const response = await axios.post(`${ServerURL}/api/jobPosting/create-job-post`, jobData, getHeaders());
    return response.data;
};

export const updateJobPost = async (post_id, jobData) => {
    const response = await axios.put(`${ServerURL}/api/jobPosting/update-job-post/${post_id}`, jobData, getHeaders());
    return response.data;
};

export const deleteJobPost = async (post_id) => {
    const response = await axios.delete(`${ServerURL}/api/jobPosting/delete-job-post/${post_id}`, getHeaders());
    return response.data;
};

export const getAllJobs = async () => {
    const response = await axios.get(`${ServerURL}/api/jobPosting/show-all-posts`, getHeaders());
    return response.data;
};
