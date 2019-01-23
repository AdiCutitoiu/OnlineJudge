import axios from 'axios'
import jwt from './userData'

const buildAuthorizationheader = () => {
    const token = jwt.getToken();
    return token ? `Bearer ${token}` : '';
}

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        common: {
            'Authorization': buildAuthorizationheader()
        }
    }
});

export default function () {
    api.defaults.headers.common['Authorization'] = buildAuthorizationheader();
    return api;
}