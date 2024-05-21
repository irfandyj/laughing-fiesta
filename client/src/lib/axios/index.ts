import axios, { AxiosInstance } from 'axios';

export { Endpoints } from './endpoints';

const API_BASE_URL = 'http://localhost:3000';

let api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Extend axios instance to accept a method
// to replace the Authorization header
export interface AuthenticatedAxios extends AxiosInstance {
  replaceAuthorizationHeader: (token: string) => void;
}
/** Axios with Tokens */
export function createAxios(token: string) {
  const instance: Partial<AuthenticatedAxios> = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    withCredentials: true,
  });

  // Fullfill the type
  instance.replaceAuthorizationHeader = replaceAuthorizationHeader as AuthenticatedAxios;

  return instance as AuthenticatedAxios;
}

/**
 * Axios Helper
 */
export function replaceAuthorizationHeader(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export { api }
