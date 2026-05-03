import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, PenTool, Brain, Mic, Star, ChevronRight, Clock, Target, Menu, X, TrendingUp, MessageCircle, Laugh, Globe, Map, Zap, FileText, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import { getProgress } from '../utils/progress'

// ─── CEFR colour system (matches Grammar.jsx) ────────────────────────────────
const ACCENTS = {
  A1: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
    ring: 'ring-emerald-300 dark:ring-emerald-600',
    bar: 'bg-emerald-500',
    hero: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    sideActive: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-l-2 border-emerald-500',
  },
  A2: {
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
    ring: 'ring-blue-300 dark:ring-blue-600',
    bar: 'bg-blue-500',
    hero: 'from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/20 border-blue-200 dark:border-blue-800',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    sideActive: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-l-2 border-blue-500',
  },
  B1: {
    dot: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
    ring: 'ring-yellow-300 dark:ring-yellow-600',
    bar: 'bg-yellow-500',
    hero: 'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800',
    btn: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    sideActive: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-l-2 border-yellow-500',
  },
  B2: {
    dot: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-700',
    ring: 'ring-orange-300 dark:ring-orange-600',
    bar: 'bg-orange-500',
    hero: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border-orange-200 dark:border-orange-800',
    btn: 'bg-orange-600 hover:bg-orange-700 text-white',
    sideActive: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border-l-2 border-orange-500',
  },
  C1: {
    dot: 'bg-purple-500',
    text: 'text-purple-700 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700',
    ring: 'ring-purple-300 dark:ring-purple-600',
    bar: 'bg-purple-500',
    hero: 'from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/20 border-purple-200 dark:border-purple-800',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white',
    sideActive: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-l-2 border-purple-500',
  },
  C2: {
    dot: 'bg-rose-600',
    text: 'text-rose-700 dark:text-rose-400',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-700',
    ring: 'ring-rose-300 dark:ring-rose-600',
    bar: 'bg-rose-500',
    hero: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20 border-rose-200 dark:border-rose-800',
    btn: 'bg-rose-600 hover:bg-rose-700 text-white',
    sideActive: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-l-2 border-rose-500',
  },
}

// ─── Category icon map ────────────────────────────────────────────────────────
const CAT_ICONS = {
  Vocabulary: BookOpen,
  Grammar: PenTool,
  Speaking: Mic,
  Conversation: MessageCircle,
  'Reading & Writing': FileText,
  Reading: BookOpen,
  Writing: FileText,
  'Practice & Games': Brain,
  Practice: Brain,
  'Culture & Media': Globe,
  Culture: Globe,
  'Culture & Authentic Input': Globe,
  'Vocabulary & Style': BookOpen,
  'Advanced Practice': Zap,
  'Grammar Mastery': PenTool,
}

// ─── Level data ───────────────────────────────────────────────────────────────
const LEVELS = [
  {
    id: 'A1',
    name: 'Absolute Beginner',
    emoji: '🌱',
    description: 'Start from zero. Learn essential words, basic sentences, and how French sounds.',
    goal: 'Introduce yourself, count to 100, and handle simple greetings.',
    time: '4–6 weeks',
    topics: 18,
    categories: [
      {
        label: 'Vocabulary',
        items: [
          { title: 'Top 50 Essentials', sub: 'The most-used French words', link: '/vocabulary', badge: 'Start here' },
          { title: 'Common Nouns', sub: 'People, places, things', link: '/vocabulary' },
          { title: 'Numbers & Colours', sub: 'Count, describe, and name', link: '/vocabulary' },
        ],
      },
      {
        label: 'Grammar',
        items: [
          { title: 'Articles (le, la, les)', sub: 'Definite & indefinite articles', link: '/grammar' },
          { title: 'Basic Pronouns', sub: 'je, tu, il, elle, nous…', link: '/grammar' },
          { title: 'Present Tense (être, avoir)', sub: 'The two essential verbs', link: '/grammar' },
          { title: 'Regular -er Verbs', sub: 'Parler, manger, habiter…', link: '/grammar' },
        ],
      },
      {
        label: 'Speaking',
        items: [
          { title: 'French Sounds', sub: 'Core vowels and consonants', link: '/pronunciation', badge: 'Audio' },
          { title: 'Greetings & Farewells', sub: 'Bonjour, bonsoir, au revoir…', link: '/conversation', badge: 'Audio' },
        ],
      },
      {
        label: 'Practice & Games',
        items: [
          { title: 'Sentence Builder', sub: 'Construct your first sentences', link: '/sentence-builder' },
          { title: 'Travel Basics', sub: 'Airport, hotel, café phrases', link: '/travel-french' },
          { title: 'Beginner Stories', sub: 'Interactive A1 reading', link: '/stories' },
          { title: 'Word Match Game', sub: 'Match French to English', link: '/word-match' },
          { title: 'Daily Challenges', sub: 'Quick daily practice', link: '/daily-challenges' },
        ],
      },
    ],
  },
  {
    id: 'A2',
    name: 'Elementary',
    emoji: '🌿',
    description: 'Expand your toolkit. Learn verb conjugations, simple conversations, and everyday phrases.',
    goal: 'Describe your daily routine and understand short, simple texts.',
    time: '6–8 weeks',
    topics: 20,
    categories: [
      {
        label: 'Vocabulary',
        items: [
          { title: 'Essential Adjectives', sub: 'Describe people and things', link: '/vocabulary' },
          { title: 'Common Verbs', sub: 'Action words you need daily', link: '/vocabulary' },
          { title: 'Travel French', sub: 'Café, transport, shopping', link: '/travel-french', badge: 'A2 content' },
          { title: 'Everyday Phrases', sub: 'Natural spoken expressions', link: '/conversation' },
        ],
      },
      {
        label: 'Grammar',
        items: [
          { title: 'Negation (ne…pas)', sub: 'Making sentences negative', link: '/grammar' },
          { title: 'Forming Questions', sub: 'Est-ce que & inversion', link: '/grammar' },
          { title: 'Plural & Gender', sub: 'Masculine, feminine, plurals', link: '/grammar' },
          { title: 'Passé Composé Intro', sub: 'Talking about the past', link: '/grammar' },
        ],
      },
      {
        label: 'Reading & Writing',
        items: [
          { title: 'A2 Reading Passages', sub: 'Short dialogues & emails', link: '/reading' },
          { title: 'Interactive Stories (A2)', sub: 'Choose-your-path narratives', link: '/stories' },
        ],
      },
      {
        label: 'Practice & Games',
        items: [
          { title: 'Business French Intro', sub: 'Basic workplace phrases', link: '/business-french', badge: 'A2 level' },
          { title: 'Word Match Game', sub: 'Vocabulary reinforcement', link: '/word-match' },
          { title: 'Typing Race', sub: 'Spell and type A2 words', link: '/typing-race' },
          { title: 'Daily Challenges', sub: 'Daily vocab & grammar drills', link: '/daily-challenges' },
          { title: 'Beginner Quizzes', sub: 'Test your A2 knowledge', link: '/quizzes' },
        ],
      },
    ],
  },
  {
    id: 'B1',
    name: 'Intermediate',
    emoji: '🌳',
    description: 'Develop real fluency. Discuss familiar topics, express opinions, and handle travel situations.',
    goal: 'Handle most situations in a French-speaking country.',
    time: '8–12 weeks',
    topics: 22,
    categories: [
      {
        label: 'Grammar',
        items: [
          { title: 'Passé Composé vs Imparfait', sub: 'Two past tenses — how they differ', link: '/grammar' },
          { title: 'Subjunctive Mood', sub: 'Expressing doubt & emotion', link: '/grammar' },
          { title: 'Relative Clauses', sub: 'qui, que, dont, où…', link: '/grammar' },
          { title: 'Future Tense', sub: 'Talking about what will happen', link: '/grammar' },
        ],
      },
      {
        label: 'Vocabulary',
        items: [
          { title: 'Business French', sub: 'Professional vocabulary B1', link: '/business-french', badge: 'B1 level' },
          { title: 'Slang & Informal French', sub: 'Everyday spoken language', link: '/slang-french', badge: 'B1 slang' },
          { title: 'Idioms & Proverbs', sub: 'Phrase of the day', link: '/phrase-of-the-day' },
        ],
      },
      {
        label: 'Reading & Writing',
        items: [
          { title: 'B1 Reading Passages', sub: 'News articles & short stories', link: '/reading' },
          { title: 'Writing Templates', sub: 'Emails & formal letters', link: '/writing' },
          { title: 'Complex Sentence Builder', sub: 'Multi-clause B1 sentences', link: '/sentence-builder' },
        ],
      },
      {
        label: 'Practice & Games',
        items: [
          { title: 'Conversation Practice', sub: 'Everyday social situations', link: '/conversation' },
          { title: 'Pronunciation — Rhythm', sub: 'French intonation & liaison', link: '/pronunciation' },
          { title: 'Intermediate Quizzes', sub: 'B1-level knowledge tests', link: '/quizzes' },
          { title: 'Typing Race', sub: 'Speed & accuracy at B1', link: '/typing-race' },
        ],
      },
    ],
  },
  {
    id: 'B2',
    name: 'Upper Intermediate',
    emoji: '🦅',
    description: 'Reach near-fluency. Understand complex texts and converse comfortably with native speakers.',
    goal: 'Express yourself fluently and spontaneously on a wide range of topics.',
    time: '12–16 weeks',
    topics: 20,
    categories: [
      {
        label: 'Grammar',
        items: [
          { title: 'Advanced Subjunctive', sub: 'Complex clauses & nuance', link: '/grammar' },
          { title: 'Passive Voice', sub: 'Être + past participle structures', link: '/grammar' },
          { title: 'Conditional Tenses', sub: 'Hypothetical & polite expressions', link: '/grammar' },
          { title: 'All Conjugations', sub: 'Master every mood & tense', link: '/conjugate' },
        ],
      },
      {
        label: 'Vocabulary',
        items: [
          { title: 'Slang & Verlan', sub: 'Authentic informal & street French', link: '/slang-french', badge: 'B2 slang' },
          { title: 'Advanced Business French', sub: 'Professional fluency', link: '/business-french', badge: 'B2 level' },
          { title: 'Advanced Idioms', sub: 'Fixed expressions & proverbs', link: '/phrase-of-the-day' },
        ],
      },
      {
        label: 'Reading & Writing',
        items: [
          { title: 'B2 Reading Passages', sub: 'Complex articles & essays', link: '/reading' },
          { title: 'Advanced Writing', sub: 'Formal reports & arguments', link: '/writing' },
        ],
      },
      {
        label: 'Culture & Media',
        items: [
          { title: 'French Culture & Society', sub: 'Deep cultural understanding', link: '/culture' },
          { title: 'French Films & Music', sub: 'Authentic native-level content', link: '/media' },
          { title: 'Regional France', sub: 'Accents, dialects & geography', link: '/france-map' },
          { title: 'Conversation — Social', sub: 'Nuanced social situations', link: '/conversation' },
        ],
      },
    ],
  },
  {
    id: 'C1',
    name: 'Advanced',
    emoji: '🔥',
    description: 'Achieve high-level mastery. Use French fluently, flexibly, and effectively for all purposes.',
    goal: 'Produce well-structured, detailed text on complex subjects with ease.',
    time: '16–24 weeks',
    topics: 18,
    categories: [
      {
        label: 'Grammar Mastery',
        items: [
          { title: 'C1 Grammar Deep Dive', sub: 'Rare tenses & stylistic structures', link: '/grammar' },
          { title: 'Full Verb Conjugations', sub: 'All moods, voices & tenses', link: '/conjugate' },
          { title: 'Rhetorical Structures', sub: 'Argumentation & persuasion', link: '/grammar' },
        ],
      },
      {
        label: 'Vocabulary & Style',
        items: [
          { title: 'Advanced Idioms & Proverbs', sub: 'High-register fixed expressions', link: '/phrase-of-the-day' },
          { title: 'French Humour & Wordplay', sub: 'Jokes, puns & cultural wit', link: '/jokes' },
          { title: 'Slang & Argot', sub: 'Street French, verlan & youth slang', link: '/slang-french' },
        ],
      },
      {
        label: 'Reading & Writing',
        items: [
          { title: 'Advanced Reading Passages', sub: 'Literary & academic French', link: '/reading' },
          { title: 'Advanced Writing', sub: 'Essays, stories & creative texts', link: '/writing' },
        ],
      },
      {
        label: 'Culture & Authentic Input',
        items: [
          { title: 'French Cinema & Music', sub: 'Native-level film & song analysis', link: '/media' },
          { title: 'Cultural Deep Dive', sub: 'Philosophy, history & French art', link: '/culture' },
          { title: 'Pronunciation Mastery', sub: 'Accent, rhythm & intonation', link: '/pronunciation' },
          { title: 'Conversation — Advanced', sub: 'Complex discussion & debate', link: '/conversation' },
        ],
      },
    ],
  },
  {
    id: 'C2',
    name: 'Mastery',
    emoji: '👑',
    description: 'Near-native proficiency. Understand virtually everything and express yourself with precision.',
    goal: 'Speak and write with the nuance and elegance of an educated native speaker.',
    time: '24+ weeks',
    topics: 16,
    categories: [
      {
        label: 'Grammar Mastery',
        items: [
          { title: 'C2 Grammar Precision', sub: 'Idiomatic fluency & literary French', link: '/grammar' },
          { title: 'All Conjugations Mastered', sub: 'Every tense, every mood', link: '/conjugate' },
        ],
      },
      {
        label: 'Vocabulary & Style',
        items: [
          { title: 'Proverbs & Cultural Sayings', sub: 'Wisdom embedded in the language', link: '/phrase-of-the-day' },
          { title: 'French Humour & Wit', sub: 'Wordplay, irony & satire', link: '/jokes' },
          { title: 'Literary & Formal Register', sub: 'The French of books & speeches', link: '/writing' },
        ],
      },
      {
        label: 'Culture & Authentic Input',
        items: [
          { title: 'French Media — Native Level', sub: 'Films, music, radio, TV', link: '/media' },
          { title: 'Cultural Mastery', sub: 'Art, history, philosophy, society', link: '/culture' },
          { title: 'Regional Accents', sub: 'Dialects, patois & regional voices', link: '/france-map' },
          { title: 'Pronunciation — Native Rhythm', sub: 'Liaison, elision & prosody', link: '/pronunciation' },
        ],
      },
      {
        label: 'Advanced Practice',
        items: [
          { title: 'Creative Writing', sub: 'Essays, poetry & storytelling', link: '/writing' },
          { title: 'Master-Level Quizzes', sub: 'All-topic C2 challenges', link: '/quizzes' },
          { title: 'Complex Conversation', sub: 'Debate, diplomacy & nuance', link: '/conversation' },
        ],
      },
    ],
  },
]

// ─── Content card ─────────────────────────────────────────────────────────────
function ContentCard({ item, accent }) {
  return (
    <Link
      to={item.link}
      className="group flex items-start gap-3 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-100 hover:border-gray-300 dark:hover:border-dark-warm-100 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-800 dark:text-cream-100 group-hover:text-gray-900 dark:group-hover:text-white leading-tight">
            {item.title}
          </span>
          {item.badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${accent.badge}`}>
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{item.sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" />
    </Link>
  )
}

// ─── Category block ───────────────────────────────────────────────────────────
function CategoryBlock({ cat, accent }) {
  const Icon = CAT_ICONS[cat.label] || BookOpen
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent.badge}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-cream-100 text-sm tracking-wide uppercase">
          {cat.label}
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({cat.items.length})</span>
      </div>
      <div className="space-y-2">
        {cat.items.map(item => (
          <ContentCard key={item.title} item={item} accent={accent} />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Levels() {
  const progress = getProgress()
  const [activeId, setActiveId] = useState('A1')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeLevel = LEVELS.find(l => l.id === activeId)
  const accent = ACCENTS[activeId]

  const totalItems = LEVELS.reduce((sum, l) => sum + l.categories.reduce((s, c) => s + c.items.length, 0), 0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO
        title="French Levels A1–C2 | SayBonjour!"
        description="Find the right starting point for your French journey. Browse curated learning content organised by CEFR level — from absolute beginner A1 to native-level C2."
      />

      {/* ── Mobile sidebar toggle ── */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-200 sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-warm-100 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Open levels menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${accent.badge}`}>{activeId}</span>
          <span className="font-semibold text-gray-800 dark:text-cream-100 text-sm">{activeLevel.name}</span>
        </div>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-dark-warm-200 z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-warm-50">
                <span className="font-bold text-gray-900 dark:text-white text-sm">Choose Your Level</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-warm-100 text-gray-500">
                  <X size={16} />
                </button>
              </div>
              <nav className="p-3 flex-1 overflow-y-auto">
                <SidebarLevelList
                  levels={LEVELS}
                  activeId={activeId}
                  onSelect={id => { setActiveId(id); setSidebarOpen(false) }}
                  progress={progress}
                />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Two-panel layout ── */}
      <div className="flex relative max-w-7xl mx-auto">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-gray-200 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-200 py-6">
          <div className="px-4 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1 mb-3">CEFR Levels</p>
          </div>
          <nav className="px-2 flex-1">
            <SidebarLevelList
              levels={LEVELS}
              activeId={activeId}
              onSelect={setActiveId}
              progress={progress}
            />
          </nav>
          <div className="px-4 mt-4 pt-4 border-t border-gray-100 dark:border-dark-warm-50">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
              CEFR = Common European Framework of Reference for Languages
            </p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-5 py-8 lg:px-10 lg:py-10 max-w-3xl">

          {/* Level hero card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className={`rounded-2xl border bg-gradient-to-br ${accent.hero} p-6 mb-8`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{activeLevel.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${accent.badge}`}>{activeId}</span>
                          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">{activeLevel.name}</h1>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{activeLevel.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3 text-center">
                    <Target className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Goal</p>
                    <p className="text-xs text-gray-700 dark:text-gray-200 font-medium leading-snug">{activeLevel.goal}</p>
                  </div>
                  <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3 text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Duration</p>
                    <p className="text-xs text-gray-700 dark:text-gray-200 font-semibold">{activeLevel.time}</p>
                  </div>
                  <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-gray-500 dark:text-gray-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Topics</p>
                    <p className="text-xs text-gray-700 dark:text-gray-200 font-semibold">
                      {activeLevel.categories.reduce((s, c) => s + c.items.length, 0)} resources
                    </p>
                  </div>
                </div>

                {/* XP / current level hint */}
                {progress?.cefrLevel === activeId && (
                  <div className={`mt-4 flex items-center gap-2 text-xs font-semibold rounded-lg px-3 py-2 ${accent.badge}`}>
                    <Star className="w-3.5 h-3.5" />
                    This matches your current level — great choice!
                  </div>
                )}
              </div>

              {/* Category blocks */}
              {activeLevel.categories.map(cat => (
                <CategoryBlock key={cat.label} cat={cat} accent={accent} />
              ))}

              {/* Level navigation arrows */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200 dark:border-dark-warm-50">
                {(() => {
                  const idx = LEVELS.findIndex(l => l.id === activeId)
                  const prev = LEVELS[idx - 1]
                  const next = LEVELS[idx + 1]
                  return (
                    <>
                      {prev ? (
                        <button
                          onClick={() => setActiveId(prev.id)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                          <span>{prev.emoji} {prev.id} — {prev.name}</span>
                        </button>
                      ) : <div />}
                      {next ? (
                        <button
                          onClick={() => setActiveId(next.id)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group ml-auto"
                        >
                          <span>{next.emoji} {next.id} — {next.name}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ) : <div />}
                    </>
                  )
                })()}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

// ─── Sidebar level list ───────────────────────────────────────────────────────
function SidebarLevelList({ levels, activeId, onSelect, progress }) {
  return (
    <div className="space-y-1">
      {levels.map(level => {
        const accent = ACCENTS[level.id]
        const isActive = level.id === activeId
        const isCurrent = progress?.cefrLevel === level.id
        return (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
              isActive
                ? accent.sideActive
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-100'
            }`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{level.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${accent.badge}`}>
                  {level.id}
                </span>
                {isCurrent && (
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">You</span>
                )}
              </div>
              <p className={`text-xs mt-0.5 truncate font-medium ${isActive ? '' : 'text-gray-500 dark:text-gray-400'}`}>
                {level.name}
              </p>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
              {level.categories.reduce((s, c) => s + c.items.length, 0)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
