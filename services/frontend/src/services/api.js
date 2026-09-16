import axios from 'axios';

const api = axios.create({
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AUTH_URL = 'http://localhost:8001/api/auth';
const CATALOG_URL = 'http://localhost:8002/api/products';
const ORDER_URL = 'http://localhost:3003/api/orders';
const PAYMENT_URL = 'http://localhost:3004/api/payments';
const NOTIFICATION_URL = 'http://localhost:3005/api/notifications';

export const authAPI = {
  login: (data) => api.post(`${AUTH_URL}/login/`, data),
  register: (data) => api.post(`${AUTH_URL}/register/`, data),
  getProfile: () => api.get(`${AUTH_URL}/profile/`),
  updateProfile: (data) => api.put(`${AUTH_URL}/profile/`, data),
  validateToken: () => api.post(`${AUTH_URL}/validate/`),
};

export const catalogAPI = {
  getProducts: (params) => api.get(CATALOG_URL, { params }),
  getProduct: (id) => api.get(`${CATALOG_URL}/${id}`),
  searchProducts: (query) => api.get(`${CATALOG_URL}/search`, { params: { q: query } }),
  getCategories: () => api.get(`${CATALOG_URL}/categories`),
  getProductsByCategory: (category) => api.get(`${CATALOG_URL}/category/${category}`),
  createProduct: (data) => api.post(CATALOG_URL, data),
  updateProduct: (id, data) => api.put(`${CATALOG_URL}/${id}`, data),
  deleteProduct: (id) => api.delete(`${CATALOG_URL}/${id}`),
};

export const orderAPI = {
  createOrder: (data) => api.post(ORDER_URL, data),
  getOrders: () => api.get(ORDER_URL),
  getOrder: (id) => api.get(`${ORDER_URL}/${id}`),
  updateOrderStatus: (id, status) => api.patch(`${ORDER_URL}/${id}/status`, { status }),
  cancelOrder: (id) => api.post(`${ORDER_URL}/${id}/cancel`),
};

export const paymentAPI = {
  processPayment: (data) => api.post(PAYMENT_URL, data),
  getPayment: (id) => api.get(`${PAYMENT_URL}/${id}`),
  getPaymentByOrder: (orderId) => api.get(`${PAYMENT_URL}/order/${orderId}`),
  getUserPayments: () => api.get(PAYMENT_URL),
};

export const notificationAPI = {
  getUserNotifications: () => api.get(NOTIFICATION_URL),
  getUnreadCount: () => api.get(`${NOTIFICATION_URL}/unread/count`),
  markAsRead: (id) => api.patch(`${NOTIFICATION_URL}/${id}/read`),
  markAllAsRead: () => api.patch(`${NOTIFICATION_URL}/read/all`),
};

export default api;
