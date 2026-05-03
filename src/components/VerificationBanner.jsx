import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MailWarning, X, RefreshCw, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { useUser } from '../context/UserContext'

export default function VerificationBanner() {
  const { user, setUser } = useUser()
  const [dismissed, setDismissed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!user || user.email_verified || dismissed) return null

  const handleResend = async () => {
    setError('')
    setSending(true)
    try {
      await axios.post('/api/users/resend-verification', { email: user.email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50"
      >
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <MailWarning className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />

          <p className="text-sm text-amber-800 dark:text-amber-300 flex-1 min-w-0">
            <span className="font-medium">Verify your email</span>
            <span className="hidden sm:inline text-amber-700 dark:text-amber-400"> — check your inbox at <strong>{user.email}</strong> for the confirmation link.</span>
            <span className="inline sm:hidden text-amber-700 dark:text-amber-400"> — a confirmation link was sent to your inbox.</span>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            {sent ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-medium"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Sent!
              </motion.span>
            ) : (
              <button
                onClick={handleResend}
                disabled={sending}
                className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 disabled:opacity-50 transition-colors px-2.5 py-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800/30"
              >
                <RefreshCw className={`w-3 h-3 ${sending ? 'animate-spin' : ''}`} />
                {sending ? 'Sending…' : 'Resend email'}
              </button>
            )}

            {error && (
              <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
            )}

            <Link
              to="/verify-email"
              className="text-xs font-semibold text-amber-800 dark:text-amber-200 hover:underline px-1"
            >
              Help
            </Link>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
