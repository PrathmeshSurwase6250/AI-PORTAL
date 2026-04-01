import axios from 'axios';
import { ServerURL } from '../config/server';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    };
};

export const createResume = async (resumeData) => {
    const response = await axios.post(`${ServerURL}/api/resume/create`, resumeData, getHeaders());
    return response.data;
};

export const updateResume = async (resumeId, resumeData) => {
    const response = await axios.patch(`${ServerURL}/api/resume/resume/${resumeId}`, resumeData, getHeaders());
    return response.data;
};

export const getMyResumes = async () => {
    const response = await axios.get(`${ServerURL}/api/resume/showResumes`, getHeaders());
    return response.data;
};

export const getSingleResume = async (resumeId) => {
    const response = await axios.get(`${ServerURL}/api/resume/resume/${resumeId}`, getHeaders());
    return response.data;
};

export const deleteResume = async (resumeId) => {
    const response = await axios.delete(`${ServerURL}/api/resume/resume/${resumeId}`, getHeaders());
    return response.data;
};

export const getAiSuggestions = async (resumeId) => {
    const response = await axios.post(`${ServerURL}/api/resume/ai-suggest/${resumeId}`, {}, getHeaders());
    return response.data;
};
