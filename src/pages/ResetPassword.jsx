import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import axios from 'axios'
import SEO from '../components/SEO'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) setError('Invalid or missing reset token. Please request a new reset link.')
  }, [token])

  const strength = (() => {
    if (password.length === 0) return 0
    let s = 0
    if (password.length >= 6) s++
    if (password.length >= 10) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][strength]
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-500'][strength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await axios.post('/api/users/reset-password', { token, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Reset Password | SayBonjour!" url="/reset-password" noindex />
      <div className="min-h-[calc(100vh-60px)] flex bg-cream-50 dark:bg-dark-warm-300">

        {/* Left panel */}
        <div className="hidden lg:block relative overflow-hidden" style={{ width: '58%' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-burgundy-900 via-burgundy-700 to-burgundy-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
          <div className="absolute top-8 left-8 z-10">
            <p className="text-white font-bold text-xl drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>SayBonjour!</p>
            <p className="text-white/70 text-xs mt-0.5 tracking-wider">French Learning Platform</p>
          </div>
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <p className="text-white/90 text-2xl font-bold leading-snug drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
              "Un nouveau départ commence ici."
            </p>
            <p className="text-white/50 text-sm mt-2 tracking-widest uppercase">A fresh start begins here.</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-dark-warm-100 px-8 py-16">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Password updated!
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Your password has been changed. Redirecting you to sign in…
                  </p>
                  <Link to="/login" className="inline-block px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors text-sm">
                    Sign in now
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-7">
                    <div className="w-12 h-12 rounded-2xl bg-burgundy-100 dark:bg-burgundy-900/40 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50 mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Set new password
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Choose a strong password for your account.
                    </p>
                  </div>

                  {!token ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">Invalid reset link</p>
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                          <Link to="/forgot-password" className="underline">Request a new one</Link>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all"
                            placeholder="Min. 6 characters"
                          />
                          <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {password.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200 dark:bg-dark-warm-50'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{strengthLabel}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            autoComplete="new-password"
                            className={`w-full pl-10 pr-10 py-3 border rounded-xl text-sm bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all ${
                              confirm && password !== confirm
                                ? 'border-red-400 dark:border-red-600'
                                : confirm && password === confirm
                                ? 'border-green-400 dark:border-green-600'
                                : 'border-gray-200 dark:border-dark-warm-50'
                            }`}
                            placeholder="Repeat your password"
                          />
                          <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {confirm && password !== confirm && (
                          <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                        )}
                      </div>

                      {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                          {error}
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 disabled:opacity-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </motion.button>

                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <Link to="/forgot-password" className="text-burgundy-600 dark:text-burgundy-400 hover:underline">
                          Request a new link
                        </Link>
                      </p>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}
