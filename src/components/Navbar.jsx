import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu, X, BookOpen, Brain, ChevronDown, MessageCircle, Lightbulb, FileText,
  Globe, Map, Film, BookMarked, GraduationCap, TrendingUp, Sun, Moon, User,
  LogOut, Zap, BookOpenCheck, Gamepad2, Plane, Laugh, PenLine, Search, Heart, X as XIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFavoritesCounts } from '../utils/favorites'
import { getProgress } from '../utils/progress'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'

const SEARCH_INDEX = [
  { label: 'Verb Conjugator', desc: 'All tenses for 25+ verbs', href: '/conjugate', category: 'Language Tools' },
  { label: 'Grammar A1–C2', desc: 'CEFR-structured grammar lessons', href: '/grammar', category: 'Language Tools' },
  { label: 'Vocabulary SRS', desc: 'Spaced repetition flashcards', href: '/vocabulary', category: 'Language Tools' },
  { label: 'Study Tools', desc: 'Flashcards and bookmarks', href: '/study-tools', category: 'Language Tools' },
  { label: 'Writing Templates', desc: 'Emails, letters & essays', href: '/writing', category: 'Language Tools' },
  { label: 'Reading Comprehension', desc: 'A1–B2 graded passages', href: '/reading', category: 'Practice' },
  { label: 'Daily Challenges', desc: 'New challenges every day', href: '/daily-challenges', category: 'Practice' },
  { label: 'Interactive Stories', desc: 'Choose-your-path French', href: '/stories', category: 'Practice' },
  { label: 'Sentence Builder', desc: 'Arrange & fill-in-blank exercises', href: '/sentence-builder', category: 'Practice' },
  { label: 'Word Match Game', desc: 'Match French & English words', href: '/word-match', category: 'Games' },
  { label: 'Typing Race', desc: 'Type French translations fast!', href: '/typing-race', category: 'Games' },
  { label: 'Business French', desc: 'Professional vocabulary & dialogues', href: '/business-french', category: 'Specialist' },
  { label: 'Slang & Informal French', desc: 'Street French & verlan', href: '/slang-french', category: 'Specialist' },
  { label: 'Travel French', desc: 'Essential travel vocab & phrases', href: '/travel-french', category: 'Specialist' },
  { label: 'Quizzes', desc: 'Interactive French quizzes', href: '/quizzes', category: 'Learn' },
  { label: 'Content & Resources', desc: 'Articles, lessons, and materials', href: '/resources', category: 'Resources' },
  { label: 'Phrase of the Day', desc: 'Daily French phrases', href: '/phrase-of-the-day', category: 'Resources' },
  { label: 'Memory Boosters', desc: 'Cognates, idioms, and tips', href: '/memory-boosters', category: 'Resources' },
  { label: 'Worksheets', desc: 'Downloadable practice sheets', href: '/worksheets', category: 'Resources' },
  { label: 'French Jokes', desc: 'Humour & jeux de mots', href: '/jokes', category: 'Resources' },
  { label: 'Cultural Insights', desc: 'French traditions and customs', href: '/culture', category: 'Culture & Media' },
  { label: 'Interactive France Map', desc: 'Explore French regions', href: '/france-map', category: 'Culture & Media' },
  { label: 'French in Media', desc: 'Movies, music, and TV shows', href: '/media', category: 'Culture & Media' },
  { label: 'Progress Dashboard', desc: 'Track XP, streaks, and badges', href: '/progress', category: 'Account' },
  { label: 'Favorites', desc: 'Your saved content', href: '/favorites', category: 'Account' },
  { label: 'My Profile', desc: 'Account settings and stats', href: '/profile', category: 'Account' },
]

const LEARN_COLUMNS = [
  {
    heading: 'Language Tools',
    items: [
      { name: 'Verb Conjugator', href: '/conjugate', icon: BookMarked, desc: 'All tenses for 25+ verbs' },
      { name: 'Grammar A1–C2', href: '/grammar', icon: GraduationCap, desc: 'CEFR-structured lessons' },
      { name: 'Vocabulary SRS', href: '/vocabulary', icon: Brain, desc: 'Spaced repetition cards' },
      { name: 'Study Tools', href: '/study-tools', icon: Lightbulb, desc: 'Flashcards & bookmarks' },
      { name: 'Writing Templates', href: '/writing', icon: PenLine, desc: 'Emails, letters & essays' },
    ],
  },
  {
    heading: 'Practice',
    items: [
      { name: 'Reading Comprehension', href: '/reading', icon: BookOpenCheck, desc: 'A1–B2 graded passages' },
      { name: 'Daily Challenges', href: '/daily-challenges', icon: Zap, desc: 'New challenges every day' },
      { name: 'Interactive Stories', href: '/stories', icon: BookOpen, desc: 'Choose-your-path French' },
      { name: 'Sentence Builder', href: '/sentence-builder', icon: FileText, desc: 'Arrange & fill-in-blank' },
    ],
  },
  {
    heading: null,
    subSections: [
      {
        heading: 'Mini Games',
        items: [
          { name: 'Word Match', href: '/word-match', icon: Gamepad2, desc: 'Match French & English' },
          { name: 'Typing Race', href: '/typing-race', icon: Zap, desc: 'Type translations fast!' },
        ],
      },
      {
        heading: 'Specialist French',
        items: [
          { name: 'Business French', href: '/business-french', icon: GraduationCap, desc: 'Professional vocab' },
          { name: 'Slang & Informal', href: '/slang-french', icon: MessageCircle, desc: 'Street French & verlan' },
          { name: 'Travel French', href: '/travel-french', icon: Plane, desc: 'Travel vocab & phrases' },
        ],
      },
    ],
  },
]

const RESOURCES_COLUMNS = [
  {
    heading: 'Core Learning',
    items: [
      { name: 'Content & Resources', href: '/resources', icon: BookOpen, desc: 'Articles & materials' },
      { name: 'Quizzes', href: '/quizzes', icon: Brain, desc: 'Interactive French quizzes' },
    ],
  },
  {
    heading: 'Quick Access',
    items: [
      { name: 'Phrase of the Day', href: '/phrase-of-the-day', icon: MessageCircle, desc: 'Daily French phrases' },
      { name: 'Memory Boosters', href: '/memory-boosters', icon: Lightbulb, desc: 'Cognates, idioms & tips' },
      { name: 'Worksheets', href: '/worksheets', icon: FileText, desc: 'Practice sheets' },
      { name: 'French Jokes', href: '/jokes', icon: Laugh, desc: 'Humour & jeux de mots' },
    ],
  },
  {
    heading: 'Culture & Media',
    items: [
      { name: 'Cultural Insights', href: '/culture', icon: Globe, desc: 'French traditions' },
      { name: 'France Map', href: '/france-map', icon: Map, desc: 'Explore French regions' },
      { name: 'French in Media', href: '/media', icon: Film, desc: 'Movies, music & TV' },
    ],
  },
]

const LEARN_ALL_HREFS = LEARN_COLUMNS.flatMap(col =>
  col.items ? col.items.map(i => i.href) : col.subSections.flatMap(s => s.items.map(i => i.href))
)
const RESOURCES_ALL_HREFS = RESOURCES_COLUMNS.flatMap(col => col.items.map(i => i.href))

function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong className="text-burgundy-600 dark:text-burgundy-400">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [isLearnOpen, setIsLearnOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const learnTimer = useRef(null)
  const resourcesTimer = useRef(null)
  const userMenuRef = useRef(null)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useUser()
  const location = useLocation()

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
    setIsSearchOpen(false)
    setSearchQuery('')
  }, [location.pathname])

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const openLearn = () => { clearTimeout(learnTimer.current); setIsLearnOpen(true); setIsResourcesOpen(false) }
  const closeLearn = () => { learnTimer.current = setTimeout(() => setIsLearnOpen(false), 120) }
  const openResources = () => { clearTimeout(resourcesTimer.current); setIsResourcesOpen(true); setIsLearnOpen(false) }
  const closeResources = () => { resourcesTimer.current = setTimeout(() => setIsResourcesOpen(false), 120) }

  const searchResults = searchQuery.trim().length > 1
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : []

  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const handleSearchSelect = (href) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    navigate(href)
  }

  const handleSearchKey = (e) => {
    if (e.key === 'Escape') { setIsSearchOpen(false); setSearchQuery('') }
    if (e.key === 'Enter' && searchResults.length > 0) handleSearchSelect(searchResults[0].href)
  }

  const isActive = (path) => location.pathname === path
  const isLearnActive = () => LEARN_ALL_HREFS.includes(location.pathname)
  const isResourcesActive = () => RESOURCES_ALL_HREFS.includes(location.pathname)

  const initials = user ? (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : null

  const navItemCls = (active) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? 'text-burgundy-400'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`

  const MegaMenuColumn = ({ col, isLast }) => {
    if (col.subSections) {
      return (
        <div className={`${isLast ? '' : 'border-r border-gray-700 pr-6'}`}>
          {col.subSections.map((sub) => (
            <div key={sub.heading} className="mb-5 last:mb-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-burgundy-400 mb-2 px-1">{sub.heading}</p>
              <div className="space-y-0.5">
                {sub.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} to={item.href}
                      className={`flex items-start gap-3 px-2 py-2 rounded-lg transition-all group ${isActive(item.href) ? 'bg-burgundy-900/20' : 'hover:bg-gray-700/40'}`}>
                      <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-gray-700 flex items-center justify-center group-hover:bg-burgundy-900/30 transition-colors">
                        <Icon size={13} className="text-burgundy-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-100 leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 leading-tight mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div className={`${isLast ? '' : 'border-r border-gray-700 pr-6'}`}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-burgundy-400 mb-3 px-1">{col.heading}</p>
        <div className="space-y-0.5">
          {col.items.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-start gap-3 px-2 py-2 rounded-lg transition-all group ${isActive(item.href) ? 'bg-burgundy-900/20' : 'hover:bg-gray-700/40'}`}>
                <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-gray-700 flex items-center justify-center group-hover:bg-burgundy-900/30 transition-colors">
                  <Icon size={13} className="text-burgundy-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100 leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-400 leading-tight mt-0.5">{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`transition-all duration-300 ${
        isScrolled
          ? 'mx-4 mt-3 rounded-2xl shadow-xl border border-gray-700'
          : 'shadow-sm border-b border-gray-700'
      } bg-gray-900`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15" style={{ height: '60px' }}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <motion.div
                className="w-8 h-8 rounded-xl flex-shrink-0"
                whileHover={{ scale: 1.08, rotate: 4 }} transition={{ duration: 0.2 }}
              >
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect width="40" height="40" rx="10" fill="#800020"/>
                  <path d="M13 10h8.5c2.2 0 3.9.5 5 1.5 1.1 1 1.6 2.3 1.6 3.9 0 1.1-.3 2-.8 2.7-.5.7-1.2 1.2-2.1 1.5 1.1.3 2 .9 2.6 1.7.7.8 1 1.9 1 3.1 0 1.8-.6 3.2-1.8 4.2-1.2 1-2.9 1.4-5.1 1.4H13V10zm4 8.6h4c.9 0 1.6-.2 2.1-.6.5-.4.7-1 .7-1.8 0-.8-.2-1.4-.7-1.8-.5-.4-1.2-.6-2.1-.6H17v4.8zm0 9.2h4.5c1 0 1.8-.2 2.3-.7.6-.5.8-1.1.8-2 0-.9-.3-1.6-.8-2-.5-.5-1.3-.7-2.3-.7H17v5.4z" fill="#fffcef"/>
                </svg>
              </motion.div>
              <span className="brand-font text-xl text-burgundy-400 group-hover:text-burgundy-300 transition-colors leading-none">
                SayBonjour!
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={navItemCls(isActive('/'))}>Home</Link>
              <Link to="/quizzes" className={navItemCls(isActive('/quizzes'))}>Quizzes</Link>

              {/* Learn mega-menu trigger */}
              <div className="relative" onMouseEnter={openLearn} onMouseLeave={closeLearn}>
                <button className={navItemCls(isLearnActive())}>
                  <GraduationCap size={15} />
                  Learn
                  <ChevronDown size={13} className={`transition-transform duration-200 ${isLearnOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLearnOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => clearTimeout(learnTimer.current)}
                      onMouseLeave={closeLearn}
                      className="absolute top-full left-0 mt-2 z-50 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-5"
                      style={{ width: '680px' }}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {LEARN_COLUMNS.map((col, i) => (
                          <MegaMenuColumn key={i} col={col} isLast={i === LEARN_COLUMNS.length - 1} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources mega-menu trigger */}
              <div className="relative" onMouseEnter={openResources} onMouseLeave={closeResources}>
                <button className={navItemCls(isResourcesActive())}>
                  <BookOpen size={15} />
                  Resources
                  <ChevronDown size={13} className={`transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isResourcesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => clearTimeout(resourcesTimer.current)}
                      onMouseLeave={closeResources}
                      className="absolute top-full left-0 mt-2 z-50 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-5"
                      style={{ width: '600px' }}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {RESOURCES_COLUMNS.map((col, i) => (
                          <MegaMenuColumn key={i} col={col} isLast={i === RESOURCES_COLUMNS.length - 1} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/progress" className={navItemCls(isActive('/progress'))}>
                <TrendingUp size={15} />
                Progress
                {streak > 0 && (
                  <span className="ml-0.5 bg-amber-400 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                    🔥{streak}
                  </span>
                )}
              </Link>

              <Link to="/favorites" className={navItemCls(isActive('/favorites'))}>
                <Heart size={15} className={favoritesCount > 0 ? 'fill-current text-burgundy-600' : ''} />
                Favorites
                {favoritesCount > 0 && (
                  <span className="bg-burgundy-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Right side: search + theme + auth */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <div className={`flex items-center transition-all duration-300 rounded-xl border ${
                  isSearchOpen
                    ? 'w-56 border-burgundy-500 bg-gray-800'
                    : 'w-9 border-transparent bg-gray-800 cursor-pointer hover:bg-gray-700'
                }`}>
                  <button
                    onClick={() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50) }}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-gray-400"
                  >
                    <Search size={15} />
                  </button>
                  {isSearchOpen && (
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKey}
                      placeholder="Search..."
                      className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-400 outline-none pr-2"
                    />
                  )}
                  {isSearchOpen && searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="flex-shrink-0 pr-2 text-gray-400 hover:text-gray-600">
                      <XIcon size={13} />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isSearchOpen && searchQuery.trim().length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden"
                    >
                      {searchResults.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">No results found</div>
                      ) : (
                        <div className="py-2 max-h-80 overflow-y-auto">
                          {Object.entries(groupedResults).map(([category, items]) => (
                            <div key={category}>
                              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-burgundy-400 bg-gray-800">
                                {category}
                              </div>
                              {items.map(item => (
                                <button key={item.href} onClick={() => handleSearchSelect(item.href)}
                                  className="w-full text-left px-4 py-2.5 hover:bg-burgundy-900/20 transition-colors flex items-center gap-3">
                                  <Search size={13} className="text-gray-400 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-100">
                                      {highlightMatch(item.label, searchQuery)}
                                    </p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-800 transition-colors"
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Auth */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-burgundy-900/30 border border-burgundy-700/50 hover:bg-burgundy-900/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-burgundy-600 text-cream-50 flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-cream-50 max-w-[72px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${isUserOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isUserOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.13 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-gray-900 rounded-xl shadow-xl border border-gray-700 z-50 py-2"
                      >
                        <div className="px-4 py-2 border-b border-gray-700 mb-1">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <p className="text-xs text-amber-500 font-medium mt-0.5">{xp} XP total</p>
                        </div>
                        <Link to="/profile" onClick={() => setIsUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors">
                          <User size={14} /> My Profile
                        </Link>
                        <Link to="/daily-challenges" onClick={() => setIsUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors">
                          <Zap size={14} /> Daily Challenges
                        </Link>
                        <div className="border-t border-gray-700 mt-1 pt-1">
                          <button onClick={() => { logout(); setIsUserOpen(false) }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 w-full text-left transition-colors">
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login"
                  className="px-4 py-2 rounded-xl bg-burgundy-600 hover:bg-burgundy-700 text-white text-sm font-medium transition-colors shadow-sm">
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile right: theme toggle + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <AnimatePresence mode="wait">
                  {isOpen
                    ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.div>
                    : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.div>
                  }
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-gray-700"
            >
              <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
                {/* Search (mobile) */}
                <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2 mb-3">
                  <Search size={14} className="text-gray-400 flex-shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKey}
                    placeholder="Search pages..."
                    className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-400 outline-none"
                  />
                </div>
                {searchQuery.trim().length > 1 && searchResults.length > 0 && (
                  <div className="mb-2 rounded-xl border border-gray-700 overflow-hidden">
                    {searchResults.slice(0, 5).map(item => (
                      <button key={item.href} onClick={() => { handleSearchSelect(item.href); setIsOpen(false) }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-800 flex gap-2 items-center border-b border-gray-700 last:border-0">
                        <Search size={12} className="text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-100">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* User info / auth */}
                {user ? (
                  <div className="flex items-center gap-3 bg-burgundy-900/20 rounded-xl px-4 py-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-burgundy-600 text-cream-50 flex items-center justify-center text-sm font-bold">{initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-amber-500">{xp} XP · 🔥 {streak} day streak</p>
                    </div>
                    <button onClick={() => { logout(); setIsOpen(false) }} className="text-xs text-red-500 font-medium">Sign out</button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-2.5 text-sm font-medium bg-burgundy-600 text-white rounded-xl mb-2">
                    Sign in
                  </Link>
                )}

                {/* Core links */}
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Quizzes', href: '/quizzes' },
                  { name: 'Progress', href: '/progress' },
                  { name: 'Favorites', href: '/favorites' },
                ].map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.href) ? 'bg-burgundy-900/20 text-burgundy-400' : 'text-gray-200 hover:bg-gray-800'}`}>
                    {item.name}
                  </Link>
                ))}

                {/* Learn section */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-1">Learn</p>
                  {LEARN_COLUMNS.flatMap(col =>
                    col.items
                      ? col.items
                      : col.subSections.flatMap(s => s.items)
                  ).map(item => {
                    const Icon = item.icon
                    return (
                      <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${isActive(item.href) ? 'bg-burgundy-900/20 text-burgundy-400' : 'text-gray-200 hover:bg-gray-800'}`}>
                        <Icon size={15} className="text-burgundy-400 flex-shrink-0" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>

                {/* Resources section */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-1">Resources</p>
                  {RESOURCES_COLUMNS.flatMap(col => col.items).map(item => {
                    const Icon = item.icon
                    return (
                      <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${isActive(item.href) ? 'bg-burgundy-900/20 text-burgundy-400' : 'text-gray-200 hover:bg-gray-800'}`}>
                        <Icon size={15} className="text-burgundy-500 flex-shrink-0" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
