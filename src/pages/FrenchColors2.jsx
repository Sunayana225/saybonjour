import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const BASIC_COLORS = [
  { fr: 'rouge', en: 'red', hex: '#DC2626', emoji: '🔴' },
  { fr: 'bleu / bleue', en: 'blue', hex: '#2563EB', emoji: '🔵' },
  { fr: 'vert / verte', en: 'green', hex: '#16A34A', emoji: '🟢' },
  { fr: 'jaune', en: 'yellow', hex: '#CA8A04', emoji: '🟡' },
  { fr: 'orange', en: 'orange', hex: '#EA580C', emoji: '🟠', note: 'Invariable — never changes for gender/number' },
  { fr: 'violet / violette', en: 'purple / violet', hex: '#7C3AED', emoji: '🟣' },
  { fr: 'rose', en: 'pink', hex: '#DB2777', emoji: '🌸', note: 'Invariable in standard usage' },
  { fr: 'noir / noire', en: 'black', hex: '#171717', emoji: '⚫' },
  { fr: 'blanc / blanche', en: 'white', hex: '#F5F5F5', emoji: '⚪' },
  { fr: 'gris / grise', en: 'grey', hex: '#6B7280', emoji: '🩶' },
  { fr: 'marron', en: 'brown', hex: '#92400E', emoji: '🟤', note: 'Invariable — marron (no change for feminine/plural)' },
  { fr: 'beige', en: 'beige', hex: '#D4B896', emoji: '🏜️', note: 'Invariable' },
]

const NUANCED_COLORS = [
  { fr: 'bleu marine', en: 'navy blue', note: 'Invariable when compound: des chemises bleu marine' },
  { fr: 'bleu ciel', en: 'sky blue' },
  { fr: 'bleu roi', en: 'royal blue' },
  { fr: 'vert émeraude', en: 'emerald green' },
  { fr: 'vert olive', en: 'olive green' },
  { fr: 'rouge bordeaux', en: 'burgundy red' },
  { fr: 'rouge vermillon', en: 'vermilion red' },
  { fr: 'jaune moutarde', en: 'mustard yellow' },
  { fr: 'gris anthracite', en: 'charcoal grey' },
  { fr: 'rose bonbon', en: 'candy pink' },
  { fr: 'crème', en: 'cream coloured', note: 'Invariable' },
  { fr: 'doré / dorée', en: 'golden / gold coloured' },
  { fr: 'argenté / argentée', en: 'silver coloured' },
  { fr: 'turquoise', en: 'turquoise', note: 'Invariable' },
]

const COLOR_RULES = [
  {
    rule: 'Adjective agreement',
    desc: 'Most colour adjectives agree in gender and number with the noun they modify.',
    examples: [
      { fr: 'un chat noir', en: 'a black cat (masc sg)' },
      { fr: 'une robe noire', en: 'a black dress (fem sg)' },
      { fr: 'des chats noirs', en: 'black cats (masc pl)' },
      { fr: 'des roses rouges', en: 'red roses (fem pl)' },
    ],
  },
  {
    rule: 'Invariable colours',
    desc: 'Colours derived from nouns (marron, orange, beige, turquoise, rose in some usages) are invariable — they don\'t change.',
    examples: [
      { fr: 'une chemise marron', en: 'a brown shirt' },
      { fr: 'des chemises marron', en: 'brown shirts (not marrons)' },
      { fr: 'une voiture orange', en: 'an orange car' },
      { fr: 'des voitures orange', en: 'orange cars (not oranges)' },
    ],
  },
  {
    rule: 'Compound colours',
    desc: 'When a colour is modified by a second word (bleu marine, vert foncé), both remain invariable.',
    examples: [
      { fr: 'des chaussures bleu marine', en: 'navy blue shoes' },
      { fr: 'une veste vert foncé', en: 'a dark green jacket' },
      { fr: 'des yeux bleu-gris', en: 'blue-grey eyes' },
    ],
  },
]

const FRENCH_TRICOLOR = [
  { color: 'Bleu', hex: '#0055A4', meaning: 'Liberty — representing Paris and its people' },
  { color: 'Blanc', hex: '#FFFFFF', meaning: 'Equality — the royal white of the Bourbon dynasty' },
  { color: 'Rouge', hex: '#EF4135', meaning: 'Fraternity — the colour of the revolutionary militia' },
]

export default function FrenchColors2() {
  const [tab, setTab] = useState('colors')
  const [activeRule, setActiveRule] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Colors | SayBonjour!" description="French color vocabulary — basic colors, nuanced shades, grammar rules, and the French tricolor." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Colours in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les couleurs — basic colours, shades, grammar rules, and culture</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[{ id: 'colors', label: 'Basic Colours' }, { id: 'nuanced', label: 'Shades & Nuances' }, { id: 'rules', label: 'Grammar Rules' }, { id: 'flag', label: 'Tricolore' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'colors' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BASIC_COLORS.map((color, i) => (
              <motion.div key={color.fr} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 overflow-hidden cursor-pointer"
                onClick={() => addXP(2, 'vocabulary')}>
                <div className="h-12 w-full" style={{ backgroundColor: color.hex }} />
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <SpeakButton text={color.fr.split('/')[0].trim()} size="sm" />
                    <p className="font-bold text-sm text-gray-900 dark:text-cream-50">{color.fr}</p>
                  </div>
                  <p className="text-xs text-gray-400">{color.en}</p>
                  {color.note && <p className="text-xs text-amber-500 italic mt-0.5">{color.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'nuanced' && (
          <div className="grid sm:grid-cols-2 gap-3">
            {NUANCED_COLORS.map((color, i) => (
              <motion.div key={color.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-3 flex items-center gap-2">
                <SpeakButton text={color.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{color.fr}</p>
                  <p className="text-xs text-gray-400">{color.en}</p>
                  {color.note && <p className="text-xs text-amber-500 italic">{color.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'rules' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {COLOR_RULES.map((r, i) => (
                <button key={r.rule} onClick={() => { setActiveRule(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeRule === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {r.rule}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <h2 className="font-bold text-lg font-playfair text-gray-900 dark:text-cream-50 mb-2">{COLOR_RULES[activeRule].rule}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{COLOR_RULES[activeRule].desc}</p>
              <div className="space-y-2">
                {COLOR_RULES[activeRule].examples.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5">
                    <SpeakButton text={ex.fr} size="sm" />
                    <span className="font-medium text-sm italic text-gray-900 dark:text-cream-50">"{ex.fr}"</span>
                    <span className="text-xs text-gray-400 ml-auto">— {ex.en}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'flag' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <h2 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-4 text-center">Le drapeau tricolore 🇫🇷</h2>
              <div className="flex rounded-xl overflow-hidden h-20 mb-5 shadow">
                {FRENCH_TRICOLOR.map(c => (
                  <div key={c.color} className="flex-1" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {FRENCH_TRICOLOR.map((c, i) => (
                  <motion.div key={c.color} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="text-center">
                    <div className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-gray-200" style={{ backgroundColor: c.hex }} />
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <SpeakButton text={c.color} size="sm" />
                      <p className="font-bold text-sm text-gray-900 dark:text-cream-50">{c.color}</p>
                    </div>
                    <p className="text-xs text-gray-400">{c.meaning}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
              <p className="text-sm text-amber-800 dark:text-amber-300">💡 The tricolour was adopted during the French Revolution. The vertical arrangement (rather than horizontal like many flags) is distinctive. The motto "Liberté, Égalité, Fraternité" accompanies it as France\'s national motto.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
