import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Inject the auth token into every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401s globally — clear tokens and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      // Only redirect if not already on an auth page
      if (!['/login', '/register'].some((p) => window.location.pathname.startsWith(p))) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth API ──────────────────────────────────────────────

export const authAPI = {
  signup: ({ email, username, password }) =>
    api.post('/api/v1/auth/signup', { email, username, password }),

  login: ({ email, password }) =>
    api.post('/api/v1/auth/login', { email, password }),

  refresh: (refreshToken) =>
    api.post('/api/v1/auth/refresh', { refresh_token: refreshToken }),

  logout: () =>
    api.post('/api/v1/auth/logout'),

  getProfile: () =>
    api.get('/api/v1/user/profile'),
}

export default api
