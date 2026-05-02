import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, BookOpen, Brain, Heart, ChevronDown, MessageCircle, Lightbulb, FileText, Globe, Map, Film, BookMarked, GraduationCap, TrendingUp, Sun, Moon, User, LogOut, Zap, BookOpenCheck, Gamepad2, Plane, Laugh, PenLine } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFavoritesCounts } from '../utils/favorites'
import { getProgress } from '../utils/progress'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [isLearnOpen, setIsLearnOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useUser()
  const location = useLocation()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const update = () => {
      const counts = getFavoritesCounts()
      setFavoritesCount(Object.values(counts).reduce((s, c) => s + c, 0))
    }
    update()
    window.addEventListener('storage', update)
    window.addEventListener('favoritesUpdated', update)
    return () => { window.removeEventListener('storage', update); window.removeEventListener('favoritesUpdated', update) }
  }, [])

  useEffect(() => {
    const update = () => { const p = getProgress(); setXp(p.xp); setStreak(p.streak) }
    update()
    window.addEventListener('progressUpdated', update)
    return () => window.removeEventListener('progressUpdated', update)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setIsLearnOpen(false)
    setIsResourcesOpen(false)
    setIsUserOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Quizzes', href: '/quizzes', icon: Brain },
  ]

  const learnDropdown = [
    {
      category: 'Language Tools',
      items: [
        { name: 'Verb Conjugator', href: '/conjugate', icon: BookMarked, description: 'All tenses for 25+ verbs' },
        { name: 'Grammar A1–C2', href: '/grammar', icon: GraduationCap, description: 'CEFR-structured grammar lessons' },
        { name: 'Vocabulary SRS', href: '/vocabulary', icon: Brain, description: 'Spaced repetition flashcards' },
        { name: 'Study Tools', href: '/study-tools', icon: Lightbulb, description: 'Flashcards and bookmarks' },
        { name: 'Writing Templates', href: '/writing', icon: PenLine, description: 'Emails, letters & essays in French' },
      ]
    },
    {
      category: 'Practice',
      items: [
        { name: 'Reading Comprehension', href: '/reading', icon: BookOpenCheck, description: 'A1–B2 graded passages' },
        { name: 'Daily Challenges', href: '/daily-challenges', icon: Zap, description: 'New challenges every day' },
        { name: 'Interactive Stories', href: '/stories', icon: BookOpen, description: 'Choose-your-path French' },
        { name: 'Sentence Builder', href: '/sentence-builder', icon: FileText, description: 'Arrange & fill-in-blank' },
      ]
    },
    {
      category: 'Mini Games',
      items: [
        { name: 'Word Match Game', href: '/word-match', icon: Gamepad2, description: 'Match French & English words' },
        { name: 'Typing Race', href: '/typing-race', icon: Zap, description: 'Type translations fast!' },
      ]
    },
    {
      category: 'Specialist French',
      items: [
        { name: 'Business French', href: '/business-french', icon: GraduationCap, description: 'Professional vocabulary & dialogues' },
        { name: 'Slang & Informal', href: '/slang-french', icon: MessageCircle, description: 'Street French & verlan' },
        { name: 'Travel French', href: '/travel-french', icon: Plane, description: 'Survive & thrive while travelling' },
      ]
    }
  ]

  const resourcesDropdown = [
    {
      category: 'Core Learning',
      items: [{ name: 'Content & Resources', href: '/resources', icon: BookOpen, description: 'Articles, lessons, and materials' }]
    },
    {
      category: 'Quick Access',
      items: [
        { name: 'Phrase of the Day', href: '/phrase-of-the-day', icon: MessageCircle, description: 'Daily French phrases' },
        { name: 'Memory Boosters', href: '/memory-boosters', icon: Lightbulb, description: 'Cognates, idioms, and tips' },
        { name: 'Worksheets', href: '/worksheets', icon: FileText, description: 'Downloadable practice sheets' },
        { name: 'French Jokes', href: '/jokes', icon: Laugh, description: 'Humour & jeux de mots' },
      ]
    },
    {
      category: 'Culture & Media',
      items: [
        { name: 'Cultural Insights', href: '/culture', icon: Globe, description: 'French traditions and customs' },
        { name: 'Interactive France Map', href: '/france-map', icon: Map, description: 'Explore French regions' },
        { name: 'French in Media', href: '/media', icon: Film, description: 'Movies, music, and TV shows' },
      ]
    }
  ]

  const isActive = (path) => location.pathname === path
  const isLearnActive = () => learnDropdown.some(cat => cat.items.some(item => location.pathname === item.href))
  const isResourcesActive = () => resourcesDropdown.some(cat => cat.items.some(item => location.pathname === item.href))

  const navBg = isDark
    ? isScrolled ? 'rgba(28, 20, 20, 0.97)' : 'rgba(28, 20, 20, 0.98)'
    : isScrolled ? 'rgba(255, 252, 239, 0.95)' : 'rgba(255, 252, 239, 0.98)'

  const navLinkClass = (active) =>
    `flex items-center space-x-2 rounded-lg text-sm font-medium transition-all duration-300 relative px-3 py-2 ${
      active
        ? 'text-burgundy-600 dark:text-burgundy-400 bg-burgundy-100 dark:bg-burgundy-900/30'
        : 'text-burgundy-600 dark:text-cream-200 hover:text-burgundy-700 dark:hover:text-cream-50 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'
    }`

  const DropdownMenu = ({ categories, isOpen }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-0 mt-2 w-72 bg-cream-50 dark:bg-dark-warm-100 rounded-xl shadow-2xl border border-cream-200 dark:border-dark-warm-50 z-50"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <div className="py-3">
            {categories.map((category, ci) => (
              <div key={category.category} className={ci > 0 ? 'border-t border-cream-200 dark:border-dark-warm-50' : ''}>
                <div className="px-4 py-3">
                  <h4 className="text-xs font-semibold text-burgundy-500 dark:text-burgundy-400 uppercase tracking-wide mb-3">
                    {category.category}
                  </h4>
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link key={item.name} to={item.href}
                          className="flex items-start space-x-3 px-3 py-2 text-sm text-burgundy-700 dark:text-cream-100 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 rounded-lg transition-colors duration-200 group">
                          <Icon size={16} className="mt-0.5 text-burgundy-500 dark:text-burgundy-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-burgundy-400 dark:text-gray-400 mt-0.5">{item.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const initials = user ? (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : null

  return (
    <motion.nav className="navbar-fixed px-6 sm:px-8 lg:px-12 xl:px-16 py-3"
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
      <div
        className={`transition-all duration-500 ease-in-out ${isScrolled ? 'max-w-full mx-auto rounded-2xl border-2 border-burgundy-600 backdrop-blur-xl shadow-2xl' : 'w-full border-b-2 border-burgundy-600'}`}
        style={{ backgroundColor: navBg }}
      >
        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-14 px-8' : 'h-16 px-6 sm:px-8 lg:px-12 xl:px-16'}`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-1 group">
              <motion.div
                className={`rounded-lg flex items-center justify-center transition-all duration-500 ${isScrolled ? 'w-16 h-16' : 'w-20 h-20'}`}
                whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}
              >
                <img src="/logo.png" alt="SayBonjour Logo" className="w-full h-full object-contain" />
              </motion.div>
              <span className={`brand-font transition-all duration-500 group-hover:scale-105 ${isScrolled ? 'text-lg text-burgundy-600 dark:text-burgundy-400' : 'text-xl text-burgundy-600 dark:text-burgundy-400 group-hover:text-burgundy-700'}`}>
                SayBonjour!
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div key={item.name} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }} whileHover={{ y: -2 }}>
                  <Link to={item.href} className={navLinkClass(isActive(item.href))}>
                    {Icon && <Icon size={16} />}
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              )
            })}

            {/* Learn Dropdown */}
            <motion.div className="relative" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }} whileHover={{ y: -2 }}
              onMouseEnter={() => setIsLearnOpen(true)} onMouseLeave={() => setIsLearnOpen(false)}>
              <button className={navLinkClass(isLearnActive())}>
                <GraduationCap size={16} />
                <span>Learn</span>
                <motion.div animate={{ rotate: isLearnOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              <DropdownMenu categories={learnDropdown} isOpen={isLearnOpen} />
            </motion.div>

            {/* Resources Dropdown */}
            <motion.div className="relative" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }} whileHover={{ y: -2 }}
              onMouseEnter={() => setIsResourcesOpen(true)} onMouseLeave={() => setIsResourcesOpen(false)}>
              <button className={navLinkClass(isResourcesActive())}>
                <BookOpen size={16} />
                <span>Resources</span>
                <motion.div animate={{ rotate: isResourcesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              <DropdownMenu categories={resourcesDropdown} isOpen={isResourcesOpen} />
            </motion.div>

            {/* Progress */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }} whileHover={{ y: -2 }}>
              <Link to="/progress" className={navLinkClass(isActive('/progress'))}>
                <div className="relative">
                  <TrendingUp size={16} />
                  {streak > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[9px] font-bold">
                      {streak}
                    </span>
                  )}
                </div>
                <span>Progress</span>
              </Link>
            </motion.div>

            {/* Favorites */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }} whileHover={{ y: -2 }}>
              <Link to="/favorites" className={navLinkClass(isActive('/favorites'))}>
                <div className="relative">
                  <Heart size={16} className={favoritesCount > 0 ? 'fill-current' : ''} />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-burgundy-600 text-cream-50 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                  )}
                </div>
                <span>Favorites</span>
              </Link>
            </motion.div>

            {/* Dark mode toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-burgundy-600 dark:text-cream-200 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* User menu / login */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-burgundy-100 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-cream-50 text-sm font-medium hover:bg-burgundy-200 dark:hover:bg-burgundy-900/50 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-burgundy-600 text-cream-50 flex items-center justify-center text-xs font-bold">
                    {initials}
                  </div>
                  <span className="hidden lg:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {isUserOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-52 bg-cream-50 dark:bg-dark-warm-100 rounded-xl shadow-xl border border-cream-200 dark:border-dark-warm-50 z-50 py-2"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-4 py-2 border-b border-cream-200 dark:border-dark-warm-50 mb-1">
                        <div className="text-xs font-semibold text-gray-800 dark:text-cream-50 truncate">{user.name}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                        <div className="text-xs text-amber-600 font-medium mt-0.5">{xp} XP total</div>
                      </div>
                      <Link to="/profile" onClick={() => setIsUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-cream-100 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-colors">
                        <User size={14} /> My Profile
                      </Link>
                      <Link to="/daily-challenges" onClick={() => setIsUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-cream-100 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-colors">
                        <Zap size={14} /> Daily Challenges
                      </Link>
                      <div className="border-t border-cream-200 dark:border-dark-warm-50 mt-1 pt-1">
                        <button onClick={() => { logout(); setIsUserOpen(false) }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-burgundy-600 dark:text-cream-200 hover:text-burgundy-800 dark:hover:text-cream-50 px-3 py-2 rounded-lg hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="text-sm font-medium bg-burgundy-600 text-cream-50 px-4 py-2 rounded-xl hover:bg-burgundy-700 transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: dark mode toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme}
              className="p-2 rounded-lg text-burgundy-600 dark:text-cream-200 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <motion.button onClick={() => setIsOpen(!isOpen)}
              className="text-burgundy-600 dark:text-cream-200 hover:text-burgundy-700 focus:outline-none transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div className="md:hidden"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <div className="px-4 pt-4 pb-6 space-y-2 border-t border-burgundy-200 dark:border-burgundy-800">
                {/* User section */}
                {user ? (
                  <div className="flex items-center gap-3 bg-burgundy-50 dark:bg-burgundy-900/20 rounded-xl px-4 py-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-burgundy-600 text-cream-50 flex items-center justify-center text-sm font-bold">{initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-burgundy-800 dark:text-cream-50 truncate">{user.name}</div>
                      <div className="text-xs text-amber-600">{xp} XP · 🔥 {streak} day streak</div>
                    </div>
                    <button onClick={() => { logout(); setIsOpen(false) }} className="text-xs text-red-500 font-medium">Sign out</button>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-burgundy-600 dark:text-cream-50 border border-burgundy-300 rounded-xl">Log in</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium bg-burgundy-600 text-cream-50 rounded-xl">Sign up free</Link>
                  </div>
                )}

                {navigation.map((item) => (
                  <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive(item.href) ? 'text-burgundy-600 dark:text-burgundy-400 bg-burgundy-100 dark:bg-burgundy-900/30' : 'text-burgundy-600 dark:text-cream-200 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'}`}>
                    <span>{item.name}</span>
                  </Link>
                ))}

                <div className="px-4 py-2">
                  <h3 className="text-sm font-semibold text-burgundy-600 dark:text-burgundy-400 mb-2 flex items-center gap-2"><GraduationCap size={16} /><span>Learn</span></h3>
                  {learnDropdown.map(cat => (
                    <div key={cat.category} className="space-y-1 mb-2">
                      <div className="text-xs text-burgundy-400 dark:text-gray-400 uppercase tracking-wide px-2 mb-1">{cat.category}</div>
                      {cat.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive(item.href) ? 'text-burgundy-600 dark:text-burgundy-400 bg-burgundy-100 dark:bg-burgundy-900/30' : 'text-burgundy-600 dark:text-cream-200 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'}`}>
                            <Icon size={16} /><span>{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2">
                  <h3 className="text-sm font-semibold text-burgundy-600 dark:text-burgundy-400 mb-2 flex items-center gap-2"><BookOpen size={16} /><span>Resources</span></h3>
                  {resourcesDropdown.map(cat => (
                    <div key={cat.category} className="space-y-1 mb-2">
                      {cat.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive(item.href) ? 'text-burgundy-600 dark:text-burgundy-400 bg-burgundy-100 dark:bg-burgundy-900/30' : 'text-burgundy-600 dark:text-cream-200 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'}`}>
                            <Icon size={16} /><span>{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  ))}
                </div>

                <Link to="/progress" onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive('/progress') ? 'text-burgundy-600 dark:text-burgundy-400 bg-burgundy-100 dark:bg-burgundy-900/30' : 'text-burgundy-600 dark:text-cream-200 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'}`}>
                  <TrendingUp size={18} /><span>Progress</span>
                  {streak > 0 && <span className="ml-auto bg-amber-400 text-white text-xs rounded-full px-2 py-0.5 font-bold">🔥 {streak}</span>}
                </Link>

                <Link to="/favorites" onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive('/favorites') ? 'text-burgundy-600 dark:text-burgundy-400 bg-burgundy-100 dark:bg-burgundy-900/30' : 'text-burgundy-600 dark:text-cream-200 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'}`}>
                  <div className="relative"><Heart size={18} className={favoritesCount > 0 ? 'fill-current' : ''} /></div>
                  <span>Favorites</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
