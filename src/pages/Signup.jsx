import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useUser } from '../context/UserContext'
import SEO from '../components/SEO'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { register, loginWithGoogle } = useUser()
  const navigate = useNavigate()

  const handleGoogleSignUp = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) { setError('Google Sign-In requires VITE_GOOGLE_CLIENT_ID to be configured.'); return }
    if (!window.google) { setError('Google Sign-In is loading — please try again in a moment.'); return }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setGoogleLoading(true)
        try {
          await loginWithGoogle(response.credential)
          navigate('/onboarding')
        } catch (err) {
          setError(err.response?.data?.message || 'Google sign-in failed.')
          setGoogleLoading(false)
        }
      }
    })
    window.google.accounts.id.prompt()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Create a Free Account | SayBonjour!" url="/signup" noindex />
      <div className="min-h-[calc(100vh-60px)] flex bg-white dark:bg-dark-warm-100">

        {/* ── Left panel: AI illustration ── */}
        <div className="hidden lg:block relative overflow-hidden" style={{ width: '58%' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-burgundy-900 via-burgundy-700 to-burgundy-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
          <div className="absolute top-8 left-8 z-10">
            <p className="text-white font-bold text-xl drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>SayBonjour!</p>
            <p className="text-white/70 text-xs mt-0.5 tracking-wider">French Learning Platform</p>
          </div>
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <p className="text-white/90 text-2xl font-bold leading-snug drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
              "La langue est la route vers le cœur d'un peuple."
            </p>
            <p className="text-white/50 text-sm mt-2 tracking-widest uppercase">Language is the road to a people's heart.</p>
          </div>
        </div>

        {/* ── Right panel: Form ── */}
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-dark-warm-100 px-8 py-16 overflow-y-auto">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:hidden text-center mb-8">
              <p className="text-lg font-bold text-burgundy-800 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>SayBonjour!</p>
            </div>

            <div className="mb-7">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50 mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                Bienvenue !
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Start your French journey today — it's free</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all"
                    placeholder="Marie Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
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
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <span className="animate-spin text-base">⏳</span> : <UserPlus className="w-4 h-4" />}
                {loading ? 'Creating account...' : 'Create Free Account'}
              </motion.button>
            </form>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-warm-50" />
              <span className="text-xs text-gray-400 whitespace-nowrap">or sign up with</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-warm-50" />
            </div>

            <div className="mt-4 space-y-2.5">
              <button onClick={handleGoogleSignUp} disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-warm-200 disabled:opacity-50 transition-colors bg-white dark:bg-dark-warm-100">
                {googleLoading ? <span className="text-base animate-spin">⏳</span> : (
                  <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                )}
                {googleLoading ? 'Connecting...' : 'Continue with Google'}
              </button>

              <button type="button"
                onClick={() => setError('Apple Sign In is coming soon. Please use email/password or Google.')}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors bg-white dark:bg-dark-warm-100">
                <svg width="17" height="20" viewBox="0 0 814 1000" fill="currentColor" className="opacity-70">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 465.1 47.6 237.1 186.9 156.2 219.5 138.2 262.3 128.4 299.5 128.4c89 0 130.3 47.2 200.7 47.2 68.1 0 120.6-47.2 201.5-47.2 38.5 0 81.3 10.7 109.4 28.1z"/>
                  <path d="M549.4 85.7c-18.3 23.3-41.7 40.3-67.8 53.3-1.9 1-3.8 1.5-5.8 1.5-3.8 0-7.6-2.6-7.6-6.3 0-3.4 2.6-6.7 6.5-9.4 22.2-15.2 38.5-30.8 50.7-48.7 13.7-19.8 22.3-42.3 22.3-66.9 0-4.2 2.7-7.3 6.7-7.3 2 0 4.4.8 6.4 2.6 15.4 14.4 24.8 34.5 24.8 58.1 0 9.8-2 19.2-6.3 28.4-9.1 20.4-22.6 37.9-29.9 44.7z"/>
                </svg>
                Continue with Apple <span className="text-xs text-gray-400">(coming soon)</span>
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              By signing up you agree to our <span className="underline cursor-pointer hover:text-gray-600">terms of service</span>.
            </p>

            <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-burgundy-600 font-semibold hover:underline">Sign in</Link>
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-warm-50">
              <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wide">Everything included, free</p>
              <div className="space-y-2.5">
                {[
                  '7,000+ French verbs & conjugations',
                  'Spaced repetition vocabulary builder',
                  'Grammar lessons A1 → C2',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-4 h-4 rounded-full bg-burgundy-100 dark:bg-burgundy-900/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-burgundy-600 dark:text-burgundy-400 text-xs font-bold">✓</span>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
