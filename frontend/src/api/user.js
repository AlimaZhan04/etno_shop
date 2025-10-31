import axiosInstance from './axios.js';
import config from './config.js';

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    localStorage.setItem(config.TOKEN_KEY, response.data.token);
    return response.data.user;
};

export const loginUser = async (userData) => {
    const response = await axiosInstance.post('/auth/login', userData);
    localStorage.setItem(config.TOKEN_KEY, response.data.token);
    return response.data.user;
};

export const getMe = async () => {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
};