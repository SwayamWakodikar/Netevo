import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

let currentToken = null

export const setAuthToken = (token) => {
  currentToken = token
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      currentToken = null
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
