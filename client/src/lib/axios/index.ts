import axios from 'axios';

export { Endpoints } from './endpoints';

const API_BASE_URL = 'http://localhost:3000';

let api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Axios Helper
 */
export function replaceAuthorizationHeader(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export { api }
