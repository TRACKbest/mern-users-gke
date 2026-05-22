import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const gradeService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
gradeService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getGrades = () => gradeService.get('/grades');
export const getGradeById = (id) => gradeService.get(`/grades/${id}`);
export const createGrade = (gradeData) => gradeService.post('/grades', gradeData);
export const updateGrade = (id, gradeData) => gradeService.put(`/grades/${id}`, gradeData);
export const deleteGrade = (id) => gradeService.delete(`/grades/${id}`);
export const getGradeStats = () => gradeService.get('/grades/stats');

export default {
  getGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
  getGradeStats
};