import api from './api';

export const startTimer = (data) => api.post('/time-entries', data);

export const stopTimer = (id) => api.put(`/time-entries/${id}/stop`);

export const createManualEntry = (data) => api.post('/time-entries/manual', data);

export const getTimeEntries = (params) => api.get('/time-entries', { params });

export const getActiveTimer = () => api.get('/time-entries/active');

export const getTimeSummary = (period) => api.get('/time-entries/summary', { params: { period } });

export const updateTimeEntry = (id, data) => api.put(`/time-entries/${id}`, data);

export const deleteTimeEntry = (id) => api.delete(`/time-entries/${id}`);

export const getAllTimeEntries = (params) => api.get('/time-entries/all', { params });
