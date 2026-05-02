import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, BookOpen, ChevronDown, ChevronUp, Info, Loader2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'

const API = '/api'

const TENSES = [
  'présent', 'passé composé', 'imparfait', 'futur simple',
  'conditionnel présent', 'subjonctif présent', 'impératif', 'passé simple',
]
const PRONOUNS = ['je', 'tu', 'il', 'nous', 'vous', 'ils']
const IMPERATIVE_PRONOUNS = ['tu', 'nous', 'vous']

const tenseLabels = {
  'présent': 'Présent',
  'passé composé': 'Passé Composé',
  'imparfait': 'Imparfait',
  'futur simple': 'Futur Simple',
  'conditionnel présent': 'Conditionnel',
  'subjonctif présent': 'Subjonctif',
  'impératif': 'Impératif',
  'passé simple': 'Passé Simple (Literary)',
}
const tenseDescriptions = {
  'présent': 'Ongoing or habitual actions, states',
  'passé composé': 'Completed past actions',
  'imparfait': 'Past habits, background, ongoing past',
  'futur simple': 'Future actions and predictions',
  'conditionnel présent': 'Hypothetical, polite requests',
  'subjonctif présent': 'Doubt, emotion, obligation',
  'impératif': 'Commands and instructions',
  'passé simple': 'Narrative past (formal/literary)',
}
const groupColors = {
  '-er': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  '-ir': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  '-re': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'irregular': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
}

const POPULAR = ['avoir', 'être', 'aller', 'faire', 'pouvoir', 'vouloir', 'savoir', 'venir', 'parler', 'finir']

const TenseTable = ({ tense, conjugations }) => {
  const pronounList = tense === 'impératif' ? IMPERATIVE_PRONOUNS : PRONOUNS
  return (
    <div className="overflow-hidden rounded-lg border border-cream-200 dark:border-dark-warm-50">
      <table className="w-full text-sm">
        <tbody>
          {pronounList.map((pronoun, i) => {
            const form = conjugations[pronoun] || '—'
            return (
              <tr key={pronoun} className={i % 2 === 0 ? 'bg-cream-50 dark:bg-dark-warm-200' : 'bg-white dark:bg-dark-warm-100'}>
                <td className="px-3 py-2 text-burgundy-600 dark:text-burgundy-400 font-medium w-24 border-r border-cream-200 dark:border-dark-warm-50">
                  {tense === 'impératif' ? pronoun : (pronoun === 'il' ? 'il/elle/on' : pronoun === 'ils' ? 'ils/elles' : pronoun)}
                </td>
                <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">
                  {form}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const Conjugate = () => {
  const [search, setSearch]               = useState('')
  const [selectedVerb, setSelectedVerb]   = useState('avoir')
  const [verbData, setVerbData]           = useState(null)
  const [verbLoading, setVerbLoading]     = useState(false)
  const [verbError, setVerbError]         = useState(null)
  const [suggestions, setSuggestions]     = useState([])
  const [sugLoading, setSugLoading]       = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [expandedTenses, setExpandedTenses] = useState(['présent', 'passé composé', 'imparfait', 'futur simple'])

  const suggestTimer = useRef(null)

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback((q) => {
    clearTimeout(suggestTimer.current)
    if (!q) { setSuggestions([]); return }
    suggestTimer.current = setTimeout(async () => {
      setSugLoading(true)
      try {
        const res = await fetch(`${API}/verbs/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setSuggestions(Array.isArray(data) ? data : [])
      } catch { setSuggestions([]) }
      setSugLoading(false)
    }, 150)
  }, [])

  // Fetch full verb data
  const fetchVerb = useCallback(async (v) => {
    setVerbLoading(true)
    setVerbError(null)
    try {
      const res = await fetch(`${API}/verbs/${encodeURIComponent(v)}`)
      if (!res.ok) throw new Error('Verb not found')
      const data = await res.json()
      setVerbData(data)
    } catch (e) {
      setVerbError(e.message)
      setVerbData(null)
    }
    setVerbLoading(false)
  }, [])

  useEffect(() => { fetchVerb('avoir') }, [])

  const handleSelectVerb = (v) => {
    setSelectedVerb(v)
    setSearch(v)
    setShowSuggestions(false)
    setExpandedTenses(['présent', 'passé composé', 'imparfait', 'futur simple'])
    fetchVerb(v)
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearch(val)
    setActiveIndex(-1)
    setShowSuggestions(true)
    fetchSuggestions(val.toLowerCase().trim())
  }

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && search.trim()) handleSelectVerb(search.trim().toLowerCase())
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectVerb(suggestions[activeIndex].infinitive)
      } else if (search.trim()) {
        handleSelectVerb(search.trim().toLowerCase())
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  const highlightMatch = (text, query) => {
    if (!query) return <span>{text}</span>
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return <span>{text}</span>
    return (
      <span>
        {text.slice(0, idx)}
        <span className="font-bold text-gray-900 dark:text-cream-50">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </span>
    )
  }

  const toggleTense = (tense) => setExpandedTenses(prev =>
    prev.includes(tense) ? prev.filter(t => t !== tense) : [...prev, tense])
  const expandAll  = () => setExpandedTenses([...TENSES])
  const collapseAll = () => setExpandedTenses([])

  return (
    <>
      <SEO
        title="French Verb Conjugation Tool | SayBonjour"
        description="Look up conjugations for any of 7,000+ French verbs across all tenses."
        keywords="french verb conjugation, conjugate french verbs"
        url="/conjugate"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">

        {/* Hero / Search */}
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center bg-cream-50/20 text-cream-50 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4 mr-2" /> Conjugation Tool
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                French Verb Conjugator
              </h1>
              <p className="text-cream-100 text-lg max-w-xl mx-auto mb-2">
                Look up any French verb — all tenses, all pronouns, irregular forms highlighted.
              </p>
              <p className="text-cream-200 text-sm mb-8 opacity-80">7,000+ verbs available</p>

              {/* Search box */}
              <div className="relative max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-burgundy-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => { setShowSuggestions(true); if (search) fetchSuggestions(search) }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                    placeholder="Type a verb (e.g. parler, vouloir, écrire...)"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 dark:text-cream-50 bg-white dark:bg-dark-warm-100 shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                  />
                  {sugLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy-400 animate-spin" />
                  )}
                </div>
                <AnimatePresence>
                  {showSuggestions && search.trim().length > 0 && (suggestions.length > 0 || sugLoading) && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.99 }}
                      transition={{ duration: 0.1 }}
                      className="absolute top-full mt-1 w-full bg-white dark:bg-dark-warm-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-warm-50 z-50 overflow-hidden py-1"
                    >
                      {sugLoading && suggestions.length === 0 ? (
                        <div className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                          Searching...
                        </div>
                      ) : (
                        suggestions.map((v, i) => (
                          <button
                            key={v.infinitive}
                            onMouseDown={() => handleSelectVerb(v.infinitive)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                              i === activeIndex ? 'bg-burgundy-50 dark:bg-burgundy-900/30' : 'hover:bg-gray-50 dark:hover:bg-dark-warm-200'
                            }`}
                          >
                            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="flex-1 text-gray-700 dark:text-gray-200">
                              {highlightMatch(v.infinitive, search.trim())}
                            </span>
                            {v.english && (
                              <span className="text-gray-400 text-xs italic flex-shrink-0">{v.english}</span>
                            )}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Popular verbs bar */}
        <div className="bg-white dark:bg-dark-warm-100 border-b border-cream-200 dark:border-dark-warm-50 py-3 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mr-1">Popular:</span>
            {POPULAR.map(v => (
              <button key={v} onClick={() => handleSelectVerb(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedVerb === v
                    ? 'bg-burgundy-600 text-cream-50'
                    : 'bg-cream-100 dark:bg-dark-warm-200 text-burgundy-700 dark:text-burgundy-400 hover:bg-burgundy-100 dark:hover:bg-burgundy-900/30'
                }`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Conjugation result */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {verbLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-burgundy-600 animate-spin" />
              <span className="ml-3 text-gray-500 dark:text-gray-400">Loading conjugations...</span>
            </div>
          )}

          {verbError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl text-red-700 dark:text-red-300 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Verb not found. Try searching for a different verb.</p>
            </div>
          )}

          {!verbLoading && verbData && (
            <motion.div key={selectedVerb} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Verb info card */}
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-sm border border-cream-200 dark:border-dark-warm-50 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-burgundy-800 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {verbData.infinitive}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${groupColors[verbData.group] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {verbData.group}
                      </span>
                      {verbData.irregular
                        ? (String(verbData.group).toLowerCase() !== 'irregular' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            irregular
                          </span>
                        ))
                        : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            regular
                          </span>
                        )
                      }
                      {verbData.frequency < 9999 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-warm-200 px-2 py-0.5 rounded-full">
                          #{verbData.frequency} most common
                        </span>
                      )}
                    </div>
                    {verbData.english && (
                      <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{verbData.english}</p>
                    )}
                    {(verbData.participe_passe || verbData.participe_present) && (
                      <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {verbData.participe_passe && (
                          <span><span className="font-medium text-gray-600 dark:text-gray-300">pp:</span> {verbData.participe_passe}</span>
                        )}
                        {verbData.participe_present && (
                          <span><span className="font-medium text-gray-600 dark:text-gray-300">prés.:</span> {verbData.participe_present}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={expandAll} className="text-xs px-3 py-1.5 bg-burgundy-50 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-burgundy-400 rounded-lg hover:bg-burgundy-100 dark:hover:bg-burgundy-900/50 transition-colors">
                      Expand all
                    </button>
                    <button onClick={collapseAll} className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-warm-50 transition-colors">
                      Collapse all
                    </button>
                  </div>
                </div>
                {verbData.notes && (
                  <div className="mt-4 flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" /><p>{verbData.notes}</p>
                  </div>
                )}
              </div>

              {/* Tense grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TENSES.map(tense => {
                  const conjugations = verbData.tenses[tense] || {}
                  const isExpanded = expandedTenses.includes(tense)
                  const hasData = Object.keys(conjugations).length > 0
                  return (
                    <motion.div key={tense} className="bg-white dark:bg-dark-warm-100 rounded-xl shadow-sm border border-cream-200 dark:border-dark-warm-50 overflow-hidden" layout>
                      <button onClick={() => toggleTense(tense)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 dark:hover:bg-dark-warm-200 transition-colors">
                        <div className="text-left">
                          <div className="font-semibold text-burgundy-800 dark:text-cream-50 text-sm">{tenseLabels[tense]}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{tenseDescriptions[tense]}</div>
                        </div>
                        <div className="text-burgundy-500 ml-2">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                            <div className="px-4 pb-4">
                              {hasData
                                ? <TenseTable tense={tense} conjugations={conjugations} />
                                : <p className="text-sm text-gray-400 dark:text-gray-500 italic py-2">No {tense} form available.</p>
                              }
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </>
  )
}

export default Conjugate
