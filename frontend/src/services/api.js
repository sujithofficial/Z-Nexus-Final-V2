import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    timeout: 15000,
});

// Add interceptor to include auth token
API.interceptors.request.use((config) => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
        const { token } = JSON.parse(adminInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => API.post('/admin/login', credentials),
    getStats: () => API.get('/admin/stats'),
};

export const eventService = {
    getAll: () => API.get('/events'),
    getById: (id) => API.get(`/events/${id}`),
    create: (data) => API.post('/events', data),
    update: (id, data) => API.put(`/events/${id}`, data),
    delete: (id) => API.delete(`/events/${id}`),
};

export const registrationService = {
    register: (formData) => API.post('/registrations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: () => API.get('/registrations'),
    updateStatus: (id, status) => API.put(`/registrations/${id}/status`, { status }),
};

export const associationService = {
    getAll: () => API.get('/association'),
    create: (formData) => API.post('/association', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => API.put(`/association/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => API.delete(`/association/${id}`),
};

export const staffService = {
    getAll: () => API.get('/staff'),
    create: (formData) => API.post('/staff', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => API.put(`/staff/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => API.delete(`/staff/${id}`),
};

export const galleryService = {
    getAll: () => API.get('/gallery'),
    upload: (formData) => API.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => API.delete(`/gallery/${id}`),
};

export const countdownService = {
    get: () => API.get('/countdown'),
    create: (data) => API.post('/countdown', data),
    update: (id, data) => API.put(`/countdown/${id}`, data),
    delete: (id) => API.delete(`/countdown/${id}`),
};

export const paymentQRService = {
    get: () => API.get('/payment-qr'),
    save: (formData) => API.post('/payment-qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const partnerService = {
    getAll: () => API.get('/partners'),
    create: (formData) => API.post('/partners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => API.put(`/partners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => API.delete(`/partners/${id}`),
};

export const contactService = {
    getAll: () => API.get('/contacts'),
    create: (formData) => API.post('/contacts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => API.put(`/contacts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => API.delete(`/contacts/${id}`),
};

export const getImageUrl = (image) => {
    if (!image) return "";
    
    // 1. If it's already a full Cloudinary/External URL, return it as-is
    if (image.startsWith("http")) {
        return image;
    }
    
    // 2. If it's a legacy local path, prepend the backend API URL
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
};

export default API;
