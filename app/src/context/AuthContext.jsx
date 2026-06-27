import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Hydrate from localStorage on mount ──
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('access_token')
      const storedRefresh = localStorage.getItem('refresh_token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setRefreshToken(storedRefresh)
        setUser(JSON.parse(storedUser))
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Persist auth state to localStorage ──
  const persistAuth = useCallback((authData) => {
    const { user: userData, token: accessToken, refresh_token: rToken } = authData
    setUser(userData)
    setToken(accessToken)
    setRefreshToken(rToken)

    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', rToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  // ── Signup ──
  const signup = useCallback(async ({ email, username, password }) => {
    const response = await authAPI.signup({ email, username, password })
    persistAuth(response.data)
    return response.data
  }, [persistAuth])

  // ── Login ──
  const login = useCallback(async ({ email, password }) => {
    const response = await authAPI.login({ email, password })
    persistAuth(response.data)
    return response.data
  }, [persistAuth])

  // ── Logout ──
  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch {
      // Even if the API call fails, clear local state
    }
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }, [])

  // ── Refresh tokens ──
  const refresh = useCallback(async () => {
    if (!refreshToken) return false
    try {
      const response = await authAPI.refresh(refreshToken)
      persistAuth(response.data)
      return true
    } catch {
      await logout()
      return false
    }
  }, [refreshToken, persistAuth, logout])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
