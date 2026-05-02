import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useUser } from '../context/UserContext'
import SEO from '../components/SEO'

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  y: (i * 23 + 7) % 65,
  size: (i % 3) + 1,
  dur: 2 + (i % 4),
  delay: (i % 5) * 0.6,
}))

const BUTTERFLIES = [
  { id: 0, color: '#ff9de2', wing2: '#f472b6', scale: 1.0, x: [55, 95, 135, 95, 55], y: [110, 65, 110, 155, 110], dur: 8, delay: 0.5 },
  { id: 1, color: '#93c5fd', wing2: '#60a5fa', scale: 0.75, x: [45, 100, 155, 100, 45], y: [150, 90, 150, 210, 150], dur: 11, delay: 2.2 },
  { id: 2, color: '#86efac', wing2: '#4ade80', scale: 0.85, x: [75, 130, 120, 65, 75], y: [80, 125, 185, 135, 80], dur: 7.5, delay: 3.8 },
  { id: 3, color: '#fde68a', wing2: '#fbbf24', scale: 0.7, x: [125, 155, 115, 75, 125], y: [75, 130, 200, 140, 75], dur: 9.5, delay: 1.2 },
  { id: 4, color: '#d8b4fe', wing2: '#a78bfa', scale: 0.65, x: [65, 35, 75, 135, 65], y: [145, 95, 55, 95, 145], dur: 12, delay: 0 },
  { id: 5, color: '#fb923c', wing2: '#f97316', scale: 0.7, x: [115, 150, 135, 85, 115], y: [195, 155, 95, 115, 195], dur: 8.5, delay: 4.6 },
  { id: 6, color: '#f9a8d4', wing2: '#ec4899', scale: 0.6, x: [90, 50, 95, 150, 90], y: [55, 90, 170, 110, 55], dur: 10, delay: 6 },
]

const FRENCH_WORDS = ['Bonjour', 'Merci', 'Amour', 'Paris', 'Liberté', 'Belle']

function ButterflyShape({ color, wing2, scale = 1 }) {
  const w = 44 * scale
  const h = 32 * scale
  return (
    <svg width={w} height={h} viewBox="0 0 44 32" fill="none">
      <ellipse cx="11" cy="12" rx="10" ry="12" fill={color} opacity="0.9" transform="rotate(-25 11 12)" />
      <ellipse cx="33" cy="12" rx="10" ry="12" fill={color} opacity="0.9" transform="rotate(25 33 12)" />
      <ellipse cx="10" cy="22" rx="7" ry="8" fill={wing2} opacity="0.75" transform="rotate(20 10 22)" />
      <ellipse cx="34" cy="22" rx="7" ry="8" fill={wing2} opacity="0.75" transform="rotate(-20 34 22)" />
      <ellipse cx="22" cy="16" rx="2.5" ry="9" fill="#1e1b4b" opacity="0.85" />
      <line x1="20" y1="8" x2="15" y2="1" stroke="#1e1b4b" strokeWidth="1" strokeLinecap="round" />
      <line x1="24" y1="8" x2="29" y2="1" stroke="#1e1b4b" strokeWidth="1" strokeLinecap="round" />
      <circle cx="15" cy="0.5" r="1.2" fill="#1e1b4b" />
      <circle cx="29" cy="0.5" r="1.2" fill="#1e1b4b" />
    </svg>
  )
}

function EiffelTower() {
  return (
    <svg viewBox="0 0 180 290" width="160" height="272" fill="none">
      <defs>
        <linearGradient id="towerGradL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a77e2d" />
          <stop offset="50%" stopColor="#e8c565" />
          <stop offset="100%" stopColor="#a77e2d" />
        </linearGradient>
        <filter id="glowL">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M15 285 Q30 240 75 165" stroke="url(#towerGradL)" strokeWidth="9" strokeLinecap="round" />
      <path d="M165 285 Q150 240 105 165" stroke="url(#towerGradL)" strokeWidth="9" strokeLinecap="round" />
      <path d="M30 255 Q90 245 150 255" stroke="url(#towerGradL)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M42 225 Q90 215 138 225" stroke="url(#towerGradL)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <path d="M55 198 Q90 190 125 198" stroke="url(#towerGradL)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <rect x="62" y="158" width="56" height="11" rx="3" fill="url(#towerGradL)" />
      <rect x="58" y="162" width="64" height="5" rx="2" fill="url(#towerGradL)" opacity="0.4" />
      <path d="M65 158 Q72 120 85 90" stroke="url(#towerGradL)" strokeWidth="7" strokeLinecap="round" />
      <path d="M115 158 Q108 120 95 90" stroke="url(#towerGradL)" strokeWidth="7" strokeLinecap="round" />
      <path d="M70 140 Q90 133 110 140" stroke="url(#towerGradL)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M76 118 Q90 113 104 118" stroke="url(#towerGradL)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <rect x="77" y="84" width="26" height="9" rx="2.5" fill="url(#towerGradL)" />
      <rect x="74" y="87" width="32" height="4" rx="2" fill="url(#towerGradL)" opacity="0.4" />
      <path d="M79 84 L88 35" stroke="url(#towerGradL)" strokeWidth="5" strokeLinecap="round" />
      <path d="M101 84 L92 35" stroke="url(#towerGradL)" strokeWidth="5" strokeLinecap="round" />
      <path d="M82 65 Q90 62 98 65" stroke="url(#towerGradL)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M84 50 Q90 48 96 50" stroke="url(#towerGradL)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <rect x="83" y="29" width="14" height="7" rx="2" fill="url(#towerGradL)" />
      <line x1="90" y1="29" x2="90" y2="5" stroke="url(#towerGradL)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="90" cy="4" r="4" fill="#ffd700" filter="url(#glowL)" />
      <motion.circle
        cx="90" cy="4" r="4"
        fill="#ffd700"
        opacity="0.6"
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        style={{ originX: '90px', originY: '4px' }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { login, loginWithGoogle } = useUser()
  const navigate = useNavigate()

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) { setError('Google Sign-In requires VITE_GOOGLE_CLIENT_ID to be configured.'); return }
    if (!window.google) { setError('Google Sign-In is loading — please try again in a moment.'); return }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setGoogleLoading(true)
        try {
          await loginWithGoogle(response.credential)
          navigate('/profile')
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
    setLoading(true)
    try {
      await login(email, password)
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Log In | SayBonjour" url="/login" />
      <div className="min-h-screen flex">

        {/* ── Left panel: Paris night scene ── */}
        <div
          className="hidden lg:flex flex-col relative overflow-hidden"
          style={{
            width: '58%',
            background: 'linear-gradient(150deg, #050520 0%, #0f0a2e 25%, #1e0a3c 55%, #12021a 100%)',
          }}
        >
          {/* Stars */}
          {STARS.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{ width: s.size, height: s.size, left: `${s.x}%`, top: `${s.y}%` }}
              animate={{ opacity: [0.15, 0.9, 0.15] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
            />
          ))}

          {/* Moon */}
          <motion.div
            className="absolute top-10 right-14 w-16 h-16 rounded-full"
            style={{ background: 'radial-gradient(circle at 38% 38%, #fffde7, #fff59d, #fdd835)' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 65% 65%, rgba(0,0,0,0.15) 0%, transparent 70%)' }} />
          </motion.div>

          {/* Floating French words */}
          {FRENCH_WORDS.map((word, i) => (
            <motion.span
              key={word}
              className="absolute select-none pointer-events-none font-light"
              style={{
                color: 'rgba(255,255,255,0.07)',
                fontSize: '1.1rem',
                left: `${8 + i * 16}%`,
                top: `${12 + (i % 3) * 14}%`,
                letterSpacing: '0.1em',
              }}
              animate={{ y: [0, -18, 0], opacity: [0.04, 0.13, 0.04] }}
              transition={{ duration: 5 + i * 0.7, repeat: Infinity, delay: i * 1.1 }}
            >
              {word}
            </motion.span>
          ))}

          {/* Tower + butterflies */}
          <div className="absolute inset-0 flex items-end justify-center pb-12">
            <div className="relative">
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-6 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.4), transparent)', filter: 'blur(10px)' }}
              />
              <EiffelTower />
              {BUTTERFLIES.map(b => (
                <motion.div
                  key={b.id}
                  className="absolute top-0 left-0 pointer-events-none"
                  animate={{ x: b.x, y: b.y, rotate: [0, 12, -8, 6, 0] }}
                  transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div
                    animate={{ scaleX: [1, -1, 1] }}
                    transition={{ duration: b.dur * 0.22, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ButterflyShape color={b.color} wing2={b.wing2} scale={b.scale} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(10,20,40,0.9) 0%, transparent 100%)' }}
          />

          <div className="absolute top-8 left-8 z-10">
            <p className="text-white font-bold text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>SayBonjour!</p>
            <p className="text-white/40 text-xs mt-0.5 tracking-wider">French Learning Platform</p>
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center z-10">
            <p className="text-white/30 text-xs tracking-widest uppercase">Apprenez · Explorez · Grandissez</p>
          </div>
        </div>

        {/* ── Right panel: Form ── */}
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-dark-warm-100 px-8 py-16">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile brand */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-4xl mb-2">🗼</div>
              <p className="text-lg font-bold text-burgundy-800 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>SayBonjour!</p>
            </div>

            <div className="mb-7">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50 mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                Bon retour !
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to continue your French journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <span className="text-xs text-burgundy-600 dark:text-burgundy-400 cursor-pointer hover:underline">Forgot password?</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all"
                    placeholder="••••••••"
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
                {loading ? <span className="animate-spin text-base">⏳</span> : <LogIn className="w-4 h-4" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-warm-50" />
              <span className="text-xs text-gray-400 whitespace-nowrap">or continue with</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-warm-50" />
            </div>

            <div className="mt-4 space-y-2.5">
              <button onClick={handleGoogleSignIn} disabled={googleLoading}
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

            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-burgundy-600 font-semibold hover:underline">Create one free</Link>
            </p>

            {/* Stats / social proof */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-warm-50">
              <p className="text-xs text-gray-400 text-center mb-4 uppercase tracking-wide">Trusted by learners worldwide</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { num: '7K+', label: 'French verbs' },
                  { num: 'A1–C2', label: 'All levels' },
                  { num: '100%', label: 'Free' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl p-3">
                    <p className="text-burgundy-700 dark:text-burgundy-400 font-bold text-sm">{s.num}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
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
