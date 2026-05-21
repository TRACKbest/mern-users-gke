import api from './api';

export const getGrades = (params) => api.get('/grades', { params });

export const createGrade = (data) => api.post('/grades', data);

export const updateGrade = (id, data) => api.put(`/grades/${id}`, data);

export const deleteGrade = (id) => api.delete(`/grades/${id}`);

export const getGradeById = (id) => api.get(`/grades/${id}`);

export const getGradeStats = (params) => api.get('/grades/stats', { params });

export const getAllGrades = (params) => api.get('/grades/all', { params });