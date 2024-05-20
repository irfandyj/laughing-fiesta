import axios from 'axios';

export { Endpoints } from './endpoints';

const API_BASE_URL = 'http://localhost:3000';
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
