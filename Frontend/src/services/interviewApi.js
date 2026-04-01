import axios from 'axios';
import { ServerURL } from '../config/server';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    };
};

export const getMyInterviews = async () => {
    const response = await axios.get(`${ServerURL}/api/interview/my-interviews`, getHeaders());
    return response.data;
};
