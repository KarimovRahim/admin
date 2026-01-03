import axios from 'axios';

export const axiosRequest =axios.create({
  baseURL: '/api', // import.meta.env.VITE_LOGIN_API
  headers: {
    'Content-Type' : 'application/json',
  },
})