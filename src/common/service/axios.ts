import axios from "axios"
import { parseCookies } from "nookies";
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

export function getAPIClient(ctx?: any) {
  const { 'nextauth.token': token } = parseCookies(ctx)
  
  const api = axios.create({
    baseURL: process.env.API_URL || 'http://127.0.0.1:3000'
  })

  api.interceptors.request.use(config => {
    return config;
  })

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return api;
}