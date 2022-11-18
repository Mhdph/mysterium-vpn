import axios from 'axios';

export const baseUrl = 'http://92.42.46.74:3000/api/v1';

const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'http://92.42.46.74:3000/api/v1',
});

export const getProxy = async () => {
  const response = await api.get('/proxy', {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const getIdentityFn = async () => {
  const response = await api.get('/identity/myst', {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const deleteIdentityFn = async (identityId: string) => {
  const response = await api.delete<any>(`/identity/myst/${identityId}`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const createIdentityFn = async (formData: FormData) => {
  const response = await api.post<any>(`/identity/myst`, formData, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

// provider

export const getAllProviderFn = async () => {
  const response = await api.get('/provider/myst', {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};
