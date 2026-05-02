import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastSession, setLastSession] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      axios.defaults.headers.common['X-User-Token'] = token
      fetchProfile(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get('/api/users/profile', { headers: { 'X-User-Token': token } })
      setUser(res.data.user)
      loadSession(token)
    } catch {
      localStorage.removeItem('userToken')
      delete axios.defaults.headers.common['X-User-Token']
    } finally {
      setLoading(false)
    }
  }

  const loadSession = async (token) => {
    try {
      const res = await axios.get('/api/users/session', { headers: { 'X-User-Token': token } })
      if (res.data.session) setLastSession(res.data.session)
    } catch {}
  }

  const setToken = (token, userData) => {
    localStorage.setItem('userToken', token)
    axios.defaults.headers.common['X-User-Token'] = token
    setUser(userData)
  }

  const register = async (name, email, password) => {
    const res = await axios.post('/api/users/register', { name, email, password })
    const { token, user: userData } = res.data
    setToken(token, userData)
    return { success: true }
  }

  const login = async (email, password) => {
    const res = await axios.post('/api/users/login', { email, password })
    const { token, user: userData } = res.data
    setToken(token, userData)
    loadSession(token)
    return { success: true }
  }

  const loginWithGoogle = async (credential) => {
    const res = await axios.post('/api/users/auth/google', { credential })
    const { token, user: userData } = res.data
    setToken(token, userData)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('userToken')
    delete axios.defaults.headers.common['X-User-Token']
    setUser(null)
    setLastSession(null)
  }

  const updateProfile = async (updates) => {
    const token = localStorage.getItem('userToken')
    const res = await axios.put('/api/users/profile', updates, { headers: { 'X-User-Token': token } })
    setUser(res.data.user)
    return res.data.user
  }

  const uploadAvatar = async (file) => {
    const token = localStorage.getItem('userToken')
    const form = new FormData()
    form.append('avatar', file)
    const res = await axios.post('/api/users/upload-avatar', form, {
      headers: { 'X-User-Token': token, 'Content-Type': 'multipart/form-data' }
    })
    setUser(prev => ({ ...prev, avatar_url: res.data.avatar_url }))
    return res.data.avatar_url
  }

  const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('userToken')
    await axios.put('/api/users/change-password', { currentPassword, newPassword }, { headers: { 'X-User-Token': token } })
  }

  const deleteAccount = async () => {
    const token = localStorage.getItem('userToken')
    await axios.delete('/api/users/account', { headers: { 'X-User-Token': token } })
    logout()
  }

  const exportData = async () => {
    const token = localStorage.getItem('userToken')
    const res = await axios.get('/api/users/export', { headers: { 'X-User-Token': token } })
    return res.data
  }

  const recordStudyEvent = async (type, title, desc = '', xp = 0, metadata = null) => {
    const token = localStorage.getItem('userToken')
    if (!token) return
    try {
      await axios.post('/api/users/study-history', { type, title, desc, xp, metadata }, { headers: { 'X-User-Token': token } })
    } catch {}
  }

  const getStudyHistory = async (limit = 50) => {
    const token = localStorage.getItem('userToken')
    const res = await axios.get(`/api/users/study-history?limit=${limit}`, { headers: { 'X-User-Token': token } })
    return res.data.history || []
  }

  const saveSession = async (sessionData) => {
    const token = localStorage.getItem('userToken')
    if (!token) return
    try {
      await axios.put('/api/users/session', { session_data: sessionData }, { headers: { 'X-User-Token': token } })
      setLastSession(sessionData)
    } catch {}
  }

  const syncProgress = async (progressData) => {
    const token = localStorage.getItem('userToken')
    if (!token) return
    try {
      await axios.put('/api/users/progress-sync', { progress: progressData }, { headers: { 'X-User-Token': token } })
    } catch {}
  }

  const loadCloudProgress = async () => {
    const token = localStorage.getItem('userToken')
    if (!token) return null
    try {
      const res = await axios.get('/api/users/progress-sync', { headers: { 'X-User-Token': token } })
      return res.data.progress || null
    } catch { return null }
  }

  return (
    <UserContext.Provider value={{
      user, loading, lastSession,
      register, login, loginWithGoogle, logout, updateProfile,
      uploadAvatar, changePassword, deleteAccount, exportData,
      recordStudyEvent, getStudyHistory,
      saveSession, syncProgress, loadCloudProgress,
      setUser
    }}>
      {children}
    </UserContext.Provider>
  )
}
