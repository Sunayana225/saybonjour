import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react'
import axios from 'axios'
import SEO from '../components/SEO'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')

  const [status, setStatus] = useState(token ? 'verifying' : 'pending')
  const [resendEmail, setResendEmail] = useState(emailParam || '')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const [resendError, setResendError] = useState('')

  useEffect(() => {
    if (!token) return
    axios.get(`/api/users/verify-email?token=${token}`)
      .then(res => {
        setStatus(res.data.alreadyVerified ? 'already' : 'success')
        if (!res.data.alreadyVerified) setTimeout(() => navigate('/profile'), 3500)
      })
      .catch(err => {
        setStatus(err.response?.data?.message?.includes('expired') ? 'expired' : 'invalid')
      })
  }, [token])

  const handleResend = async (e) => {
    e.preventDefault()
    setResendError('')
    setResendLoading(true)
    try {
      await axios.post('/api/users/resend-verification', { email: resendEmail })
      setResendSent(true)
    } catch (err) {
      setResendError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      <SEO title="Verify Your Email | SayBonjour!" url="/verify-email" noindex />
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
              "Chaque voyage commence par un premier pas."
            </p>
            <p className="text-white/50 text-sm mt-2 tracking-widest uppercase">Every journey begins with a first step.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white dark:bg-dark-warm-100 px-8 py-16">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">

              {status === 'verifying' && (
                <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-burgundy-100 dark:bg-burgundy-900/30 flex items-center justify-center mx-auto mb-5">
                    <RefreshCw className="w-7 h-7 text-burgundy-600 dark:text-burgundy-400 animate-spin" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Verifying your email…
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Just a moment, please.</p>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Email confirmed!
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Your account is now fully active. Redirecting you to your profile…
                  </p>
                  <Link to="/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors text-sm">
                    Go to my profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}

              {status === 'already' && (
                <motion.div key="already" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Already verified
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Your email was already confirmed. You're all set!
                  </p>
                  <Link to="/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors text-sm">
                    Go to my profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}

              {(status === 'expired' || status === 'invalid') && (
                <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                    <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {status === 'expired' ? 'Link expired' : 'Invalid link'}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    {status === 'expired'
                      ? 'This verification link has expired. Enter your email below to get a fresh one.'
                      : 'This link is not valid. It may have already been used. Enter your email to request a new one.'}
                  </p>
                  <ResendForm
                    email={resendEmail} setEmail={setResendEmail}
                    loading={resendLoading} sent={resendSent} error={resendError}
                    onSubmit={handleResend}
                  />
                </motion.div>
              )}

              {status === 'pending' && (
                <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-12 h-12 rounded-2xl bg-burgundy-100 dark:bg-burgundy-900/40 flex items-center justify-center mb-5">
                    <Mail className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Check your inbox
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 leading-relaxed">
                    We've sent a confirmation link to
                    {emailParam
                      ? <> <span className="font-semibold text-gray-700 dark:text-gray-300">{emailParam}</span>.</>
                      : ' your email address.'}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-7 leading-relaxed">
                    Click the link in the email to activate your account. It expires in 24 hours. Don't see it? Check your spam folder.
                  </p>

                  <div className="border-t border-gray-100 dark:border-dark-warm-50 pt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Didn't receive it?</p>
                    {!resendSent ? (
                      <ResendForm
                        email={resendEmail} setEmail={setResendEmail}
                        loading={resendLoading} sent={resendSent} error={resendError}
                        onSubmit={handleResend}
                      />
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-400">New confirmation email sent!</p>
                      </motion.div>
                    )}
                  </div>

                  <p className="text-center text-sm text-gray-400 mt-6">
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

function ResendForm({ email, setEmail, loading, sent, error, onSubmit }) {
  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
        <p className="text-sm text-green-700 dark:text-green-400">New confirmation email sent! Check your inbox.</p>
      </motion.div>
    )
  }
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all"
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2">
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Sending…' : 'Resend confirmation email'}
      </button>
    </form>
  )
}
