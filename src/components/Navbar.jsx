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
import { getHappyHourStatus, formatMins } from '../utils/happyHour'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import { useI18n } from '../context/i18nContext'

const SEARCH_INDEX = [
  { label: 'Verb Conjugator', desc: 'All tenses for 25+ verbs', href: '/conjugate', category: 'Language Tools' },
  { label: 'Grammar A1–C2', desc: 'CEFR-structured grammar lessons', href: '/grammar', category: 'Language Tools' },
  { label: 'Vocabulary SRS', desc: 'Spaced repetition flashcards', href: '/vocabulary', category: 'Language Tools' },
  { label: 'Study Tools', desc: 'Flashcards and bookmarks', href: '/study-tools', category: 'Language Tools' },
  { label: 'Writing Templates', desc: 'Emails, letters & essays', href: '/writing', category: 'Language Tools' },
  { label: 'Vocabulary Themes', desc: 'Learn by topic — food, family, home', href: '/vocabulary-themes', category: 'Language Tools' },
  { label: 'Verb Drills', desc: 'Timed conjugation practice', href: '/verb-drills', category: 'Language Tools' },
  { label: 'Grammar Tips', desc: 'Quick grammar wins with mini-quizzes', href: '/grammar-tips', category: 'Language Tools' },
  { label: 'Gender Practice', desc: 'Le ou la? Master noun genders', href: '/gender-practice', category: 'Language Tools' },
  { label: 'French Keyboard', desc: 'Type accented characters easily', href: '/french-keyboard', category: 'Language Tools' },
  { label: 'Quick Translator', desc: 'French phrase lookup tool', href: '/quick-translator', category: 'Language Tools' },
  { label: 'Vocabulary Export', desc: 'Download word lists as CSV or Anki', href: '/vocabulary-export', category: 'Language Tools' },
  { label: 'Reading Comprehension', desc: 'A1–B2 graded passages', href: '/reading', category: 'Practice' },
  { label: 'Daily Challenges', desc: 'New challenges every day', href: '/daily-challenges', category: 'Practice' },
  { label: 'Interactive Stories', desc: 'Choose-your-path French', href: '/stories', category: 'Practice' },
  { label: 'Sentence Builder', desc: 'Arrange & fill-in-blank exercises', href: '/sentence-builder', category: 'Practice' },
  { label: 'Dictation', desc: 'Listen and write French sentences', href: '/dictation', category: 'Practice' },
  { label: 'Study Planner', desc: 'Plan your weekly study schedule', href: '/study-planner', category: 'Practice' },
  { label: 'DELF / DALF Prep', desc: 'Exam preparation A1–C2', href: '/delf-prep', category: 'Practice' },
  { label: 'Word Match Game', desc: 'Match French & English words', href: '/word-match', category: 'Games' },
  { label: 'Typing Race', desc: 'Type French translations fast!', href: '/typing-race', category: 'Games' },
  { label: 'Hangman', desc: 'Guess French words letter by letter', href: '/hangman', category: 'Games' },
  { label: 'Word Scramble', desc: 'Unscramble French words', href: '/word-scramble', category: 'Games' },
  { label: 'Spelling Bee', desc: 'Hear and spell French words', href: '/spelling-bee', category: 'Games' },
  { label: 'French Numbers', desc: 'Learn numbers, ordinals, and time', href: '/numbers', category: 'Games' },
  { label: 'Crossword', desc: 'French vocabulary crossword puzzles', href: '/crossword', category: 'Games' },
  { label: 'Picture Vocabulary', desc: 'Match emoji pictures to French words', href: '/picture-vocabulary', category: 'Games' },
  { label: 'High Scores', desc: 'Your personal best scores', href: '/high-scores', category: 'Games' },
  { label: 'Business French', desc: 'Professional vocabulary & dialogues', href: '/business-french', category: 'Specialist' },
  { label: 'Slang & Informal French', desc: 'Street French & verlan', href: '/slang-french', category: 'Specialist' },
  { label: 'Travel French', desc: 'Essential travel vocab & phrases', href: '/travel-french', category: 'Specialist' },
  { label: 'French Food Guide', desc: 'Cuisine vocabulary & restaurant phrases', href: '/french-food', category: 'Specialist' },
  { label: 'Regional Accents', desc: 'Paris to Québec — accent guide', href: '/regional-accents', category: 'Specialist' },
  { label: 'Quizzes', desc: 'Interactive French quizzes', href: '/quizzes', category: 'Learn' },
  { label: 'Content & Resources', desc: 'Articles, lessons, and materials', href: '/resources', category: 'Resources' },
  { label: 'Word of the Day', desc: 'Beautiful new French word daily', href: '/word-of-the-day', category: 'Resources' },
  { label: 'Phrase of the Day', desc: 'Daily French phrases', href: '/phrase-of-the-day', category: 'Resources' },
  { label: 'French Proverbs', desc: '20+ proverbs with context & audio', href: '/proverbs', category: 'Resources' },
  { label: 'Memory Boosters', desc: 'Cognates, idioms, and tips', href: '/memory-boosters', category: 'Resources' },
  { label: 'Worksheets', desc: 'Downloadable practice sheets', href: '/worksheets', category: 'Resources' },
  { label: 'Printable Sheets', desc: 'Print vocab tables & conjugation grids', href: '/printable-sheets', category: 'Resources' },
  { label: 'French Jokes', desc: 'Humour & jeux de mots', href: '/jokes', category: 'Resources' },
  { label: 'False Friends', desc: 'Faux amis — tricky look-alike words', href: '/false-friends', category: 'Resources' },
  { label: 'Tongue Twisters', desc: 'Virelangues pronunciation practice', href: '/tongue-twisters', category: 'Resources' },
  { label: 'Cultural Insights', desc: 'French traditions and customs', href: '/culture', category: 'Culture & Media' },
  { label: 'Cultural Calendar', desc: 'French holidays and traditions by month', href: '/cultural-calendar', category: 'Culture & Media' },
  { label: 'Interactive France Map', desc: 'Explore French regions', href: '/france-map', category: 'Culture & Media' },
  { label: 'French in Media', desc: 'Movies, music, and TV shows', href: '/media', category: 'Culture & Media' },
  { label: 'French Songs', desc: 'Learn through iconic French music', href: '/french-songs', category: 'Culture & Media' },
  { label: 'French Movies', desc: 'Cinema français for language learners', href: '/french-movies', category: 'Culture & Media' },
  { label: 'French Radio & Podcasts', desc: 'Best stations and podcasts for learners', href: '/french-radio', category: 'Culture & Media' },
  { label: 'Leaderboard', desc: 'See how you rank globally', href: '/leaderboard', category: 'Account' },
  { label: 'Achievements', desc: 'Your badges and trophies', href: '/achievements', category: 'Account' },
  { label: 'Progress Dashboard', desc: 'Track XP, streaks, and badges', href: '/progress', category: 'Account' },
  { label: 'Favorites', desc: 'Your saved content', href: '/favorites', category: 'Account' },
  { label: 'My Profile', desc: 'Account settings and stats', href: '/profile', category: 'Account' },
  { label: 'High Scores', desc: 'Personal best scores across all games', href: '/high-scores', category: 'Account' },
  { label: 'Notifications', desc: 'Study reminders and activity updates', href: '/notifications', category: 'Account' },
  { label: 'French Idioms', desc: '25+ common idioms with explanations', href: '/idioms', category: 'Resources' },
  { label: 'Mini Flashcards', desc: 'Quick vocabulary flashcard decks', href: '/mini-flashcards', category: 'Resources' },
  { label: 'Listening Practice', desc: 'Graded French audio comprehension A1–B2', href: '/listening-practice', category: 'Practice' },
  { label: 'French Quotes', desc: 'Famous quotes from French thinkers', href: '/french-quotes', category: 'Resources' },
  { label: 'Verb Constructions', desc: 'Phrasal patterns — avoir, faire, se + verb', href: '/phrasal-verbs', category: 'Language Tools' },
  { label: 'French Art', desc: 'Masterpieces and art vocabulary', href: '/french-art', category: 'Culture & Media' },
  { label: 'Conjugation Quiz', desc: 'Test all tenses with instant feedback', href: '/conjugation-quiz', category: 'Practice' },
  { label: 'Games Hub', desc: 'All French learning games in one place', href: '/games', category: 'Games' },
]

const LEARN_COLUMNS = [
  {
    heading: 'Language Tools',
    items: [
      { name: 'Verb Conjugator', href: '/conjugate', icon: BookMarked, desc: 'All tenses for 25+ verbs' },
      { name: 'Grammar A1–C2', href: '/grammar', icon: GraduationCap, desc: 'CEFR-structured lessons' },
      { name: 'Grammar Tips', href: '/grammar-tips', icon: Lightbulb, desc: 'Quick wins & mini-quizzes' },
      { name: 'Vocabulary SRS', href: '/vocabulary', icon: Brain, desc: 'Spaced repetition cards' },
      { name: 'Vocabulary Themes', href: '/vocabulary-themes', icon: BookOpen, desc: 'Learn by topic' },
      { name: 'Gender Practice', href: '/gender-practice', icon: Brain, desc: 'Le ou la? Master genders' },
      { name: 'Verb Drills', href: '/verb-drills', icon: Zap, desc: 'Timed conjugation practice' },
      { name: 'Writing Templates', href: '/writing', icon: PenLine, desc: 'Emails, letters & essays' },
      { name: 'French Keyboard', href: '/french-keyboard', icon: FileText, desc: 'Type accented characters' },
      { name: 'Quick Translator', href: '/quick-translator', icon: Globe, desc: 'Phrase lookup tool' },
    ],
  },
  {
    heading: 'Practice',
    items: [
      { name: 'Reading Comprehension', href: '/reading', icon: BookOpenCheck, desc: 'A1–B2 graded passages' },
      { name: 'Dictation', href: '/dictation', icon: MessageCircle, desc: 'Listen & write' },
      { name: 'Listening Practice', href: '/listening-practice', icon: MessageCircle, desc: 'Audio comprehension A1–B2' },
      { name: 'Daily Challenges', href: '/daily-challenges', icon: Zap, desc: 'New challenges every day' },
      { name: 'Interactive Stories', href: '/stories', icon: BookOpen, desc: 'Choose-your-path French' },
      { name: 'Sentence Builder', href: '/sentence-builder', icon: FileText, desc: 'Arrange & fill-in-blank' },
      { name: 'Conjugation Quiz', href: '/conjugation-quiz', icon: Brain, desc: 'Test all tenses — instant feedback' },
      { name: 'Study Planner', href: '/study-planner', icon: Lightbulb, desc: 'Plan your schedule' },
      { name: 'DELF / DALF Prep', href: '/delf-prep', icon: GraduationCap, desc: 'Exam prep A1–C2' },
    ],
  },
  {
    heading: null,
    subSections: [
      {
        heading: 'Mini Games',
        items: [
          { name: 'Games Hub', href: '/games', icon: Gamepad2, desc: 'Browse all 14 games' },
          { name: 'Word Match', href: '/word-match', icon: Gamepad2, desc: 'Match French & English' },
          { name: 'Typing Race', href: '/typing-race', icon: Zap, desc: 'Type translations fast!' },
          { name: 'Hangman', href: '/hangman', icon: Gamepad2, desc: 'Guess the French word' },
          { name: 'Word Scramble', href: '/word-scramble', icon: Gamepad2, desc: 'Unscramble French words' },
          { name: 'Crossword', href: '/crossword', icon: Gamepad2, desc: 'French vocabulary crossword' },
          { name: 'Picture Vocabulary', href: '/picture-vocabulary', icon: Brain, desc: 'Match pictures to words' },
          { name: 'Spelling Bee', href: '/spelling-bee', icon: Gamepad2, desc: 'Hear & spell French' },
          { name: 'French Numbers', href: '/numbers', icon: Brain, desc: 'Numbers, time & ordinals' },
        ],
      },
      {
        heading: 'Specialist French',
        items: [
          { name: 'Business French', href: '/business-french', icon: GraduationCap, desc: 'Professional vocab' },
          { name: 'Slang & Informal', href: '/slang-french', icon: MessageCircle, desc: 'Street French & verlan' },
          { name: 'Travel French', href: '/travel-french', icon: Plane, desc: 'Travel vocab & phrases' },
          { name: 'French Food Guide', href: '/french-food', icon: Globe, desc: 'Cuisine & restaurant phrases' },
          { name: 'Regional Accents', href: '/regional-accents', icon: Map, desc: 'Paris to Québec accents' },
          { name: 'Verb Constructions', href: '/phrasal-verbs', icon: BookOpen, desc: 'Avoir, faire, se + verb' },
          { name: 'French Idioms', href: '/idioms', icon: Lightbulb, desc: '25+ idiomatic expressions' },
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
      { name: 'Leaderboard', href: '/leaderboard', icon: TrendingUp, desc: 'See global rankings' },
      { name: 'Achievements', href: '/achievements', icon: GraduationCap, desc: 'Your badges & trophies' },
      { name: 'High Scores', href: '/high-scores', icon: TrendingUp, desc: 'Your personal bests' },
    ],
  },
  {
    heading: 'Daily & Reference',
    items: [
      { name: 'Word of the Day', href: '/word-of-the-day', icon: Lightbulb, desc: 'Beautiful French word daily' },
      { name: 'Phrase of the Day', href: '/phrase-of-the-day', icon: MessageCircle, desc: 'Daily French phrases' },
      { name: 'French Proverbs', href: '/proverbs', icon: BookOpen, desc: '20+ proverbs & context' },
      { name: 'French Quotes', href: '/french-quotes', icon: BookOpen, desc: 'Famous quotes from great minds' },
      { name: 'French Idioms', href: '/idioms', icon: Lightbulb, desc: '25+ idiomatic expressions' },
      { name: 'Mini Flashcards', href: '/mini-flashcards', icon: BookOpen, desc: 'Quick vocabulary review' },
      { name: 'Memory Boosters', href: '/memory-boosters', icon: Lightbulb, desc: 'Cognates, idioms & tips' },
      { name: 'False Friends', href: '/false-friends', icon: Lightbulb, desc: 'Faux amis to watch out for' },
      { name: 'Tongue Twisters', href: '/tongue-twisters', icon: MessageCircle, desc: 'Virelangues practice' },
      { name: 'Worksheets', href: '/worksheets', icon: FileText, desc: 'Practice sheets' },
      { name: 'Printable Sheets', href: '/printable-sheets', icon: FileText, desc: 'Print vocab & conjugation' },
      { name: 'Vocabulary Export', href: '/vocabulary-export', icon: FileText, desc: 'Download as CSV / Anki' },
      { name: 'French Jokes', href: '/jokes', icon: Laugh, desc: 'Humour & jeux de mots' },
    ],
  },
  {
    heading: 'Culture & Media',
    items: [
      { name: 'Cultural Insights', href: '/culture', icon: Globe, desc: 'French traditions' },
      { name: 'Cultural Calendar', href: '/cultural-calendar', icon: Globe, desc: 'Holidays & events' },
      { name: 'France Map', href: '/france-map', icon: Map, desc: 'Explore French regions' },
      { name: 'French in Media', href: '/media', icon: Film, desc: 'Movies, music & TV' },
      { name: 'French Songs', href: '/french-songs', icon: Film, desc: 'Learn through music' },
      { name: 'French Movies', href: '/french-movies', icon: Film, desc: 'Cinema français' },
      { name: 'French Radio', href: '/french-radio', icon: Globe, desc: 'Stations & podcasts' },
      { name: 'French Art', href: '/french-art', icon: Globe, desc: 'Masterpieces & art vocab' },
    ],
  },
]

const LEARN_ALL_HREFS = LEARN_COLUMNS.flatMap(col =>
  col.items ? col.items.map(i => i.href) : col.subSections.flatMap(s => s.items.map(i => i.href))
)
const RESOURCES_ALL_HREFS = RESOURCES_COLUMNS.flatMap(col => col.items.map(i => i.href))

const checkDailyChallengesDone = () => {
  try {
    const store = JSON.parse(localStorage.getItem('saybonjour_daily')) || {}
    const todayKey = new Date().toISOString().split('T')[0]
    const t = store[todayKey] || {}
    return !!(t.vocab && t.quiz && t.translation)
  } catch { return false }
}

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
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [dailyChallengesDone, setDailyChallengesDone] = useState(checkDailyChallengesDone)
  const [happyHour, setHappyHour] = useState(() => getHappyHourStatus())

  const learnTimer = useRef(null)
  const resourcesTimer = useRef(null)
  const userMenuRef = useRef(null)
  const langRef = useRef(null)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useUser()
  const { lang, setLang } = useI18n()
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
    const update = () => { const p = getProgress(); setXp(p.xp); setStreak(p.streak); setLevel(p.level) }
    update()
    window.addEventListener('progressUpdated', update)
    return () => window.removeEventListener('progressUpdated', update)
  }, [])

  useEffect(() => {
    const update = () => setDailyChallengesDone(checkDailyChallengesDone())
    update()
    window.addEventListener('progressUpdated', update)
    window.addEventListener('storage', update)
    return () => { window.removeEventListener('progressUpdated', update); window.removeEventListener('storage', update) }
  }, [])

  useEffect(() => {
    const tick = () => setHappyHour(getHappyHourStatus())
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
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
      if (langRef.current && !langRef.current.contains(e.target)) setIsLangOpen(false)
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
        ? isScrolled ? 'text-burgundy-400' : 'text-burgundy-300'
        : isScrolled
          ? 'text-gray-300 hover:text-white hover:bg-white/5'
          : 'text-gray-200 hover:text-white hover:bg-white/10'
    }`

  const MegaMenuColumn = ({ col, isLast, dailyChallengesDone }) => {
    const renderItem = (item) => {
      const Icon = item.icon
      const isDaily = item.href === '/daily-challenges'
      return (
        <Link key={item.href} to={item.href}
          className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all group ${isActive(item.href) ? 'bg-burgundy-900/30' : 'hover:bg-gray-700/50'}`}>
          <div className="w-7 h-7 flex-shrink-0 rounded-md bg-gray-800 border border-gray-700/60 flex items-center justify-center group-hover:border-burgundy-700/60 group-hover:bg-burgundy-900/20 transition-colors">
            <Icon size={13} className="text-burgundy-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-gray-100 whitespace-nowrap leading-none">{item.name}</p>
              {isDaily && !dailyChallengesDone && (
                <span className="flex-shrink-0 text-[9px] font-bold bg-amber-400 text-gray-900 rounded-full px-1.5 py-0.5 leading-none uppercase tracking-wide">
                  Today
                </span>
              )}
              {isDaily && dailyChallengesDone && (
                <span className="flex-shrink-0 text-[9px] font-bold bg-emerald-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                  ✓ Done
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 leading-none mt-1 truncate">{item.desc}</p>
          </div>
        </Link>
      )
    }

    if (col.subSections) {
      return (
        <div className={`${isLast ? '' : 'border-r border-gray-700/60 pr-7'}`}>
          {col.subSections.map((sub) => (
            <div key={sub.heading} className="mb-5 last:mb-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-burgundy-400 mb-2.5 px-2.5">{sub.heading}</p>
              <div className="space-y-0.5">
                {sub.items.map(renderItem)}
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div className={`${isLast ? '' : 'border-r border-gray-700/60 pr-7'}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-burgundy-400 mb-2.5 px-2.5">{col.heading}</p>
        <div className="space-y-0.5">
          {col.items.map(renderItem)}
        </div>
      </div>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`transition-all duration-300 ${
        isScrolled
          ? 'mx-4 mt-3 rounded-2xl shadow-xl border border-gray-700 bg-gray-900'
          : 'border-b border-white/10 bg-transparent'
      }`}>
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
                <button className={`relative ${navItemCls(isLearnActive())}`}>
                  <GraduationCap size={15} />
                  Learn
                  <ChevronDown size={13} className={`transition-transform duration-200 ${isLearnOpen ? 'rotate-180' : ''}`} />
                  {!dailyChallengesDone && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                    </span>
                  )}
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
                      className="absolute top-full left-0 mt-2 z-50 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6"
                      style={{ width: '900px' }}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {LEARN_COLUMNS.map((col, i) => (
                          <MegaMenuColumn key={i} col={col} isLast={i === LEARN_COLUMNS.length - 1} dailyChallengesDone={dailyChallengesDone} />
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
                      className="absolute top-full left-0 mt-2 z-50 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6"
                      style={{ width: '860px' }}
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

              {/* Happy Hour pill */}
              <AnimatePresence>
                {happyHour.active && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.85, x: -8 }}
                    transition={{ duration: 0.2 }}
                    title={`${happyHour.label} — ${Math.min(4, 1 + happyHour.multiplierBonus)}× XP on all activities!`}
                  >
                    <Link to="/daily-challenges"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 shadow-md hover:from-amber-300 hover:to-orange-300 transition-all"
                    >
                      <Zap size={12} className="flex-shrink-0" />
                      <span>Happy Hour · {(1 + happyHour.multiplierBonus)}× XP</span>
                      <span className="opacity-70">· {formatMins(happyHour.endsInMins)}</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side: search + theme + auth */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <div className={`flex items-center transition-all duration-300 rounded-xl border ${
                  isSearchOpen
                    ? `w-56 border-burgundy-500 ${isScrolled ? 'bg-gray-800' : 'bg-white'}`
                    : isScrolled
                      ? 'w-9 border-transparent bg-gray-800 cursor-pointer hover:bg-gray-700'
                      : 'w-9 border-transparent bg-black/8 cursor-pointer hover:bg-black/12'
                }`}>
                  <button
                    onClick={() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50) }}
                    className={`flex-shrink-0 w-9 h-9 flex items-center justify-center ${isScrolled ? 'text-gray-400' : 'text-gray-600'}`}
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
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
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

              {/* Language selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setIsLangOpen(o => !o)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors text-[11px] font-bold tracking-wider ${isScrolled ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-black/5'}`}
                  title="Switch language"
                >
                  {lang.toUpperCase()}
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-gray-900 rounded-xl shadow-xl border border-gray-700 z-50 py-1 overflow-hidden"
                    >
                      {[
                        { code: 'en', label: '🇬🇧 English' },
                        { code: 'fr', label: '🇫🇷 Français' },
                        { code: 'es', label: '🇪🇸 Español' },
                      ].map(({ code, label }) => (
                        <button
                          key={code}
                          onClick={() => { setLang(code); setIsLangOpen(false) }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${lang === code ? 'bg-burgundy-900/30 text-burgundy-300' : 'text-gray-300 hover:bg-gray-800'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${isScrolled ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-black/5'}`}
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
                        <div className="px-4 py-2.5 border-b border-gray-700 mb-1">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-semibold text-amber-400">Lv.{level}</span>
                              <span className="text-[10px] text-gray-500">{xp} / {level * 500} XP</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                                style={{ width: `${Math.min(100, ((xp - (level - 1) * 500) / 500) * 100)}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5">{Math.max(0, level * 500 - xp)} XP to Lv.{level + 1}</p>
                          </div>
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

            {/* Mobile right: lang + theme toggle + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'fr' : lang === 'fr' ? 'es' : 'en')}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[11px] font-bold tracking-wider"
                title="Switch language"
              >
                {lang.toUpperCase()}
              </button>
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

                {/* Happy Hour banner (mobile) */}
                {happyHour.active && (
                  <Link to="/daily-challenges" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 font-bold text-sm mb-2">
                    <Zap size={15} className="flex-shrink-0" />
                    <span className="flex-1">Happy Hour — {1 + happyHour.multiplierBonus}× XP active!</span>
                    <span className="text-xs font-semibold opacity-75">{formatMins(happyHour.endsInMins)} left</span>
                  </Link>
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
