import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import axios from 'axios'
import SEO from '../components/SEO'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('/api/users/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Forgot Password | SayBonjour!" url="/forgot-password" noindex />
      <div className="min-h-[calc(100vh-60px)] flex bg-cream-50 dark:bg-dark-warm-300">

        <div className="hidden lg:block relative overflow-hidden" style={{ width: '58%' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-burgundy-900 via-burgundy-700 to-burgundy-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
          <div className="absolute top-8 left-8 z-10">
            <p className="text-white font-bold text-xl drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>SayBonjour!</p>
            <p className="text-white/70 text-xs mt-0.5 tracking-wider">French Learning Platform</p>
          </div>
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <p className="text-white/90 text-2xl font-bold leading-snug drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
              "Tout commence par un mot."
            </p>
            <p className="text-white/50 text-sm mt-2 tracking-widest uppercase">Everything starts with a word.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white dark:bg-dark-warm-100 px-8 py-16">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 mb-8 group transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to sign in
            </Link>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-7">
                    <div className="w-12 h-12 rounded-2xl bg-burgundy-100 dark:bg-burgundy-900/40 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50 mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Forgot password?
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Enter your email and we'll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          autoComplete="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                        {error}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 disabled:opacity-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? 'Sending…' : 'Send Reset Link'}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                    <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Check your inbox
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 leading-relaxed">
                    We've sent a password reset link to <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span>.
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-6 leading-relaxed">
                    The link expires in 1 hour. If you don't see it, check your spam folder.
                  </p>
                  <button
                    onClick={() => { setSent(false); setEmail('') }}
                    className="w-full py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
                  >
                    Try a different email
                  </button>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    <Link to="/login" className="text-burgundy-600 dark:text-burgundy-400 hover:underline">Back to sign in</Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}
