import axios from 'axios';
import config from './config.js';

const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem('accessToken');
        if (token) request.headers.Authorization = `Bearer ${token}`;
        return request;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;