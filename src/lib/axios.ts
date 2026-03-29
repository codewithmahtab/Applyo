import axios from 'axios';
const axiosInstance = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
        : 'http://localhost:3000/api'
      : '/api',
  withCredentials: true,
});

export default axiosInstance;
