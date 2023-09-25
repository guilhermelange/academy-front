import { Cookies } from "react-cookie";
import { getAPIClient } from "./axios";

export const api = getAPIClient()

export const resources = (process.env.API_URL || 'http://127.0.0.1:3000') + '/static/'

export default function setTokenApi(token: any) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const cookies = new Cookies();
    cookies.set('token', token);
}