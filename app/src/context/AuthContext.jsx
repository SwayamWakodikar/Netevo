import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI, setAuthToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Initialization ──
  useEffect(() => {
    setLoading(false)
  }, [])

  // ── Persist auth state to memory ──
  const persistAuth = useCallback((authData) => {
    const { user: userData, token: accessToken, refresh_token: rToken } = authData
    setUser(userData)
    setToken(accessToken)
    setRefreshToken(rToken)
    setAuthToken(accessToken)
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
    }
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    setAuthToken(null)
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
