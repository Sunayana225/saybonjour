import React, { useState } from 'react'
import { Lightbulb, Brain, Globe, Zap, ChevronDown, Menu, X, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

// ─── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'cognates',
    label: 'Cognates & False Friends',
    icon: Globe,
    emoji: '🌐',
    items: [
      {
        id: 'cognates-perfect',
        emoji: '🎯',
        title: 'Perfect Cognates',
        subtitle: 'Words that are identical in both languages',
        tip: 'These words look the same but often have different pronunciations. Focus on the French accent patterns!',
        type: 'cognates',
        examples: [
          { french: 'animal', english: 'animal', pronunciation: 'ah-nee-MAHL' },
          { french: 'restaurant', english: 'restaurant', pronunciation: 'res-toh-RAHN' },
          { french: 'garage', english: 'garage', pronunciation: 'gah-RAHZH' },
          { french: 'nature', english: 'nature', pronunciation: 'nah-TOOR' },
          { french: 'culture', english: 'culture', pronunciation: 'kool-TOOR' },
        ],
      },
      {
        id: 'cognates-near',
        emoji: '🔍',
        title: 'Near Cognates',
        subtitle: 'Words with slight spelling differences',
        tip: 'Look for patterns: -té often equals -ty, -que often equals -c, and accents usually indicate missing letters.',
        type: 'cognates',
        examples: [
          { french: 'musique', english: 'music', pronunciation: 'moo-ZEEK' },
          { french: 'théâtre', english: 'theater', pronunciation: 'tay-AH-truh' },
          { french: 'hôpital', english: 'hospital', pronunciation: 'oh-pee-TAHL' },
          { french: 'université', english: 'university', pronunciation: 'oo-nee-ver-see-TAY' },
          { french: 'liberté', english: 'liberty', pronunciation: 'lee-ber-TAY' },
        ],
      },
      {
        id: 'cognates-false',
        emoji: '⚠️',
        title: 'False Friends (Faux Amis)',
        subtitle: 'Words that look similar but mean different things',
        tip: 'Always double-check meanings! These tricky words can lead to embarrassing misunderstandings.',
        type: 'cognates',
        examples: [
          { french: 'actuellement', english: 'currently', falseEnglish: 'actually', pronunciation: 'ak-too-el-MAHN' },
          { french: 'librairie', english: 'bookstore', falseEnglish: 'library', pronunciation: 'lee-breh-REE' },
          { french: 'préservatif', english: 'condom', falseEnglish: 'preservative', pronunciation: 'pray-zer-vah-TEEF' },
          { french: 'rester', english: 'to stay', falseEnglish: 'to rest', pronunciation: 'res-TAY' },
          { french: 'sensible', english: 'sensitive', falseEnglish: 'sensible', pronunciation: 'sahn-SEE-bluh' },
        ],
      },
    ],
  },
  {
    id: 'idioms',
    label: 'Idiom Origins',
    icon: Lightbulb,
    emoji: '💡',
    items: [
      {
        id: 'idioms-animal',
        emoji: '🐾',
        title: 'Animal Idioms',
        subtitle: 'French expressions featuring our furry friends',
        tip: 'French loves animal metaphors! Learning these makes you sound more natural.',
        type: 'idioms',
        examples: [
          { french: 'Avoir un chat dans la gorge', literal: 'To have a cat in the throat', meaning: 'To have a frog in one\'s throat', origin: 'Cats were thought to cause throat irritation in medieval times' },
          { french: 'Poser un lapin', literal: 'To put down a rabbit', meaning: 'To stand someone up', origin: "From 19th century when 'lapin' meant a refusal to pay" },
          { french: 'Avoir d\'autres chats à fouetter', literal: 'To have other cats to whip', meaning: 'To have other fish to fry', origin: 'Medieval punishment reference, now means having more important things to do' },
        ],
      },
      {
        id: 'idioms-food',
        emoji: '🍽️',
        title: 'Food Idioms',
        subtitle: 'Expressions that are good enough to eat',
        tip: 'Food idioms often relate to the cultural significance of ingredients in French cuisine.',
        type: 'idioms',
        examples: [
          { french: 'Avoir la pêche', literal: 'To have the peach', meaning: 'To be in great shape / energetic', origin: 'Peaches symbolize health and vitality in French culture' },
          { french: 'Raconter des salades', literal: 'To tell salads', meaning: 'To tell lies / nonsense', origin: 'Salads are mixed up, like confused stories' },
          { french: 'C\'est du gâteau', literal: "It's cake", meaning: "It's a piece of cake", origin: 'Cake is easy and pleasant to eat' },
        ],
      },
      {
        id: 'idioms-body',
        emoji: '👤',
        title: 'Body Part Idioms',
        subtitle: 'Expressions using parts of the human body',
        tip: 'Body part idioms are universal but each language has unique interpretations!',
        type: 'idioms',
        examples: [
          { french: 'Coûter les yeux de la tête', literal: 'To cost the eyes of the head', meaning: 'To cost an arm and a leg', origin: 'Eyes are precious, representing something very valuable' },
          { french: 'Avoir le bras long', literal: 'To have a long arm', meaning: 'To have influence / connections', origin: 'Long arms can reach further, metaphor for extended influence' },
          { french: "Se mettre le doigt dans l'œil", literal: "To put one's finger in the eye", meaning: 'To be completely wrong', origin: 'Poking your eye would be a painful mistake' },
        ],
      },
    ],
  },
  {
    id: 'regional',
    label: 'Regional Differences',
    icon: Brain,
    emoji: '🗺️',
    items: [
      {
        id: 'regional-quebec',
        emoji: '🍁',
        title: 'Quebec vs. France',
        subtitle: 'Different words for the same modern things',
        tip: 'Quebec French often creates new French words while France borrows from English.',
        type: 'regional',
        variant: 'quebec',
        examples: [
          { variant: 'courriel', standard: 'e-mail', english: 'email', note: 'Quebec preserves French purity' },
          { variant: 'magasiner', standard: 'faire du shopping', english: 'to shop', note: "Quebec adapted English 'magazine'" },
          { variant: 'fin de semaine', standard: 'week-end', english: 'weekend', note: 'Quebec translates literally' },
          { variant: 'stationnement', standard: 'parking', english: 'parking', note: 'Quebec avoids English borrowings' },
          { variant: 'dépanneur', standard: 'épicerie de nuit', english: 'convenience store', note: "Quebec's unique term" },
        ],
      },
      {
        id: 'regional-belgian',
        emoji: '🇧🇪',
        title: 'Belgian French Specialties',
        subtitle: 'Unique expressions from our Belgian neighbours',
        tip: 'Belgian French shows Germanic influences and more logical number systems.',
        type: 'regional',
        variant: 'belgian',
        examples: [
          { variant: 'septante', standard: 'soixante-dix', english: 'seventy', note: 'Logical counting system' },
          { variant: 'nonante', standard: 'quatre-vingt-dix', english: 'ninety', note: 'Continues the logical pattern' },
          { variant: 'dracher', standard: 'pleuvoir fort', english: 'to rain heavily', note: 'From Dutch influence' },
          { variant: 'une fois', standard: 'donc', english: 'so / then', note: 'Germanic influence on sentence structure' },
          { variant: 'savoir', standard: 'pouvoir', english: 'can / to be able', note: "Different usage of 'to know'" },
        ],
      },
      {
        id: 'regional-swiss',
        emoji: '🏔️',
        title: 'Swiss French Particularities',
        subtitle: 'Alpine variations of the French language',
        tip: 'Swiss French preserves older French terms and has unique number words.',
        type: 'regional',
        variant: 'swiss',
        examples: [
          { variant: 'huitante', standard: 'quatre-vingts', english: 'eighty', note: 'Unique to Swiss French' },
          { variant: 'déjeuner', standard: 'petit-déjeuner', english: 'breakfast', note: 'Meal names shifted' },
          { variant: 'dîner', standard: 'déjeuner', english: 'lunch', note: 'Traditional French usage preserved' },
          { variant: 'souper', standard: 'dîner', english: 'dinner', note: 'Old French term maintained' },
          { variant: 'panosse', standard: 'serpillière', english: 'mop', note: 'Regional vocabulary' },
        ],
      },
    ],
  },
]

const SECTION_COLORS = {
  cognates: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  idioms:   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  regional: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}

// ─── Article: cognates ─────────────────────────────────────────────────────────
function CognatesArticle({ item }) {
  return (
    <div className="space-y-3">
      {item.examples.map((ex, i) => (
        <div key={i} className="bg-white dark:bg-dark-warm-200 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-burgundy-700 dark:text-burgundy-400 text-base">{ex.french}</span>
              <SpeakButton text={ex.french} size="sm" variant="ghost" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{ex.english}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Pronunciation: <span className="font-mono">{ex.pronunciation}</span>
          </p>
          {ex.falseEnglish && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">❌ Not: {ex.falseEnglish}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Article: idioms ───────────────────────────────────────────────────────────
function IdiomsArticle({ item }) {
  return (
    <div className="space-y-4">
      {item.examples.map((ex, i) => (
        <div key={i} className="bg-white dark:bg-dark-warm-200 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-burgundy-700 dark:text-burgundy-400">{ex.french}</span>
            <SpeakButton text={ex.french} size="sm" variant="ghost" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">Literal: {ex.literal}</p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Meaning: {ex.meaning}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2">
            💡 Origin: {ex.origin}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Article: regional ─────────────────────────────────────────────────────────
function RegionalArticle({ item }) {
  const variantLabel = item.variant === 'quebec' ? '🍁 Quebec' : item.variant === 'belgian' ? '🇧🇪 Belgian' : '🏔️ Swiss'
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 pb-1">
        <span>{variantLabel}</span>
        <span>Standard French</span>
        <span>English</span>
      </div>
      {item.examples.map((ex, i) => (
        <div key={i} className="bg-white dark:bg-dark-warm-200 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-burgundy-700 dark:text-burgundy-400 text-sm">{ex.variant}</span>
              <SpeakButton text={ex.variant} size="sm" variant="ghost" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-700 dark:text-gray-300">{ex.standard}</span>
              <SpeakButton text={ex.standard} size="sm" variant="ghost" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{ex.english}</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 italic border-t border-gray-100 dark:border-gray-700 pt-2">{ex.note}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Full article panel ────────────────────────────────────────────────────────
function ItemArticle({ item, sectionId }) {
  return (
    <article>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SECTION_COLORS[sectionId]}`}>
          {sectionId === 'cognates' ? 'Cognates' : sectionId === 'idioms' ? 'Idioms' : 'Regional'}
        </span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
          {item.examples.length} examples
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {item.emoji} {item.title}
      </h1>
      <p className="text-burgundy-600 dark:text-burgundy-400 font-medium mb-6">{item.subtitle}</p>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6" />

      {sectionId === 'cognates' && <CognatesArticle item={item} />}
      {sectionId === 'idioms' && <IdiomsArticle item={item} />}
      {sectionId === 'regional' && <RegionalArticle item={item} />}

      {/* Memory tip */}
      <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4 flex gap-3">
        <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Memory Tip</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">{item.tip}</p>
        </div>
      </div>
    </article>
  )
}

// ─── Welcome screen ────────────────────────────────────────────────────────────
function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 py-16">
      <div className="text-6xl mb-6">🧠</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Memory Boosters</h1>
      <p className="text-burgundy-600 dark:text-burgundy-400 font-semibold mb-4">Curiosités linguistiques</p>
      <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
        Discover cognates, false friends, idiom origins, and regional French variations that make vocabulary stick faster.
      </p>

      <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm w-full">
        {[
          { emoji: '🌐', label: 'Cognates & False Friends', count: 3 },
          { emoji: '💡', label: 'Idiom Origins', count: 3 },
          { emoji: '🗺️', label: 'Regional Differences', count: 3 },
        ].map(({ emoji, label, count }) => (
          <div key={label} className="bg-white dark:bg-dark-warm-100 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">{label}</p>
            <p className="text-xs font-bold text-gray-400 mt-1">{count} topics</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 dark:text-gray-500 mt-8 flex items-center gap-2">
        <span>←</span> Pick a topic from the sidebar to start
      </p>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function MemoryBoosters() {
  const [activeId, setActiveId] = useState(null)
  const [openSections, setOpenSections] = useState(
    Object.fromEntries(SECTIONS.map(s => [s.id, true]))
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSection = id =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))

  const handleSelect = id => {
    setActiveId(id)
    setSidebarOpen(false)
  }

  // Find active item + which section it belongs to
  let activeItem = null
  let activeSectionId = null
  for (const section of SECTIONS) {
    const found = section.items.find(it => it.id === activeId)
    if (found) { activeItem = found; activeSectionId = section.id; break }
  }

  return (
    <>
      <SEO
        title="French Memory Boosters — Cognates, Idioms & False Friends | SayBonjour!"
        description="Supercharge your French memory with cognates, false friends (faux amis), idioms, and cross-dialect comparisons."
        keywords="french cognates, french false friends, faux amis, french idioms, french expressions, learn french vocabulary fast"
        url="/memory-boosters"
      />

      <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 flex relative">

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <aside className={`fixed lg:sticky top-0 lg:top-20 left-0 h-screen lg:h-[calc(100vh-5rem)] w-60 bg-white dark:bg-dark-warm-100 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-40 lg:z-auto transition-transform duration-300 flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>

          {/* Mobile close */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700 lg:hidden">
            <span className="font-bold text-gray-900 dark:text-white text-sm">Topics</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-warm-200">
              <X size={16} />
            </button>
          </div>

          <nav className="p-3 pt-4">
            {SECTIONS.map(section => {
              const Icon = section.icon
              return (
                <div key={section.id} className="mb-1">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{section.emoji}</span>
                      <span className="text-gray-800 dark:text-gray-200 text-left leading-snug">{section.label}</span>
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 flex-shrink-0 ml-1 transition-transform duration-200 ${openSections[section.id] ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {openSections[section.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-1 mt-0.5 space-y-0.5 pb-2">
                          {section.items.map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 ${
                                activeId === item.id
                                  ? 'bg-burgundy-50 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-burgundy-300 font-semibold'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-warm-200 hover:text-gray-900 dark:hover:text-gray-100'
                              }`}
                            >
                              <span className="flex-shrink-0">{item.emoji}</span>
                              <span className="leading-snug">{item.title}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {/* Did You Know footer */}
            <div className="mt-4 mx-1 rounded-xl bg-gray-50 dark:bg-dark-warm-200 border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Star size={11} className="text-amber-500" /> Did You Know?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                English and French share over 30% of their vocabulary — giving you an instant head start!
              </p>
            </div>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Mobile breadcrumb */}
          <div className="lg:hidden sticky top-20 z-20 bg-white dark:bg-dark-warm-100 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-burgundy-600 dark:hover:text-burgundy-400 flex-shrink-0"
            >
              <Menu size={17} /> <span>Topics</span>
            </button>
            {activeItem && (
              <>
                <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">/</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{activeItem.title}</span>
              </>
            )}
          </div>

          <div className="px-6 py-10 lg:px-12 lg:py-10 max-w-2xl">
            <AnimatePresence mode="wait">
              {!activeId ? (
                <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Welcome />
                </motion.div>
              ) : (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ItemArticle item={activeItem} sectionId={activeSectionId} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  )
}
