import axios from 'axios'
import jwt from './userData'

const buildAuthorizationheader = () => {
  const token = jwt.getToken();
  return token ? `Bearer ${token}` : '';
}

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://codebreakapi.herokuapp.com' : 'http://localhost:3000',
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