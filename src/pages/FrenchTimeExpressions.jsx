import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const TELLING_TIME = [
  { time: '12:00', fr: 'Il est midi.', en: 'It\'s noon.' },
  { time: '00:00', fr: 'Il est minuit.', en: 'It\'s midnight.' },
  { time: '1:00', fr: 'Il est une heure.', en: 'It\'s one o\'clock.' },
  { time: '2:15', fr: 'Il est deux heures et quart.', en: 'It\'s quarter past two.' },
  { time: '3:30', fr: 'Il est trois heures et demie.', en: 'It\'s half past three.' },
  { time: '4:45', fr: 'Il est cinq heures moins le quart.', en: 'It\'s quarter to five.' },
  { time: '5:10', fr: 'Il est cinq heures dix.', en: 'It\'s ten past five.' },
  { time: '6:50', fr: 'Il est sept heures moins dix.', en: 'It\'s ten to seven.' },
  { time: '14:00', fr: 'Il est quatorze heures.', en: 'It\'s 2pm (14:00 — 24hr clock)', note: 'French often uses 24hr clock officially' },
  { time: '20:30', fr: 'Il est vingt heures trente.', en: 'It\'s 8:30pm (20:30)' },
]

const TIME_VOCAB = [
  { fr: 'une seconde', en: 'a second' },
  { fr: 'une minute', en: 'a minute' },
  { fr: 'une heure', en: 'an hour' },
  { fr: 'une demi-heure', en: 'half an hour' },
  { fr: 'un quart d\'heure', en: 'a quarter of an hour' },
  { fr: 'un jour / une journée', en: 'a day', note: '"Un jour" = a day (duration); "une journée" = a (full) day (content)' },
  { fr: 'une semaine', en: 'a week' },
  { fr: 'une quinzaine', en: 'a fortnight / two weeks', note: 'From "quinze" (fifteen) — 15-day period' },
  { fr: 'un mois', en: 'a month' },
  { fr: 'un trimestre', en: 'a quarter / term (3 months)' },
  { fr: 'un an / une année', en: 'a year', note: '"Un an" = a year (count); "une année" = a (full) year (content/quality)' },
  { fr: 'une décennie', en: 'a decade' },
  { fr: 'un siècle', en: 'a century' },
]

const TIME_PHRASES = [
  { fr: 'Quelle heure est-il ?', en: 'What time is it?' },
  { fr: 'Il est l\'heure.', en: 'It\'s time.' },
  { fr: 'en avance', en: 'early / ahead of time' },
  { fr: 'en retard', en: 'late / behind time', note: 'The French have a reputation for being slightly late — "le quart d\'heure de politesse"' },
  { fr: 'à l\'heure', en: 'on time' },
  { fr: 'tout à l\'heure', en: 'in a moment / just now / earlier', note: 'Context-dependent! Can mean past or future!' },
  { fr: 'tout de suite', en: 'immediately / right away' },
  { fr: 'dans un instant', en: 'in a moment' },
  { fr: 'depuis', en: 'since / for (ongoing)', note: '"Je vis ici depuis 5 ans" = I\'ve lived here for 5 years (and still do)' },
  { fr: 'il y a', en: 'ago', note: '"Il y a 3 ans" = 3 years ago. Different from "depuis"!' },
  { fr: 'pendant', en: 'during / for (completed)', note: '"J\'ai étudié pendant 2 ans" = I studied for 2 years (completed)' },
  { fr: 'dans', en: 'in (future)', note: '"Dans 2 heures" = in 2 hours (from now)' },
]

const DEPUIS_PENDANT_IL_Y_A = [
  {
    word: 'depuis',
    en: 'since / for (ongoing)',
    examples: [
      { fr: 'J\'étudie le français depuis 6 mois.', en: 'I have been studying French for 6 months (and still am).' },
      { fr: 'Depuis quand ?', en: 'Since when? / For how long?' },
    ],
    note: 'Use with present or imperfect — describes ongoing action from past to now.',
  },
  {
    word: 'pendant',
    en: 'during / for (completed)',
    examples: [
      { fr: 'J\'ai étudié le français pendant 6 mois.', en: 'I studied French for 6 months (finished).' },
      { fr: 'Pendant les vacances, je suis resté(e) chez moi.', en: 'During the holidays, I stayed home.' },
    ],
    note: 'Use with completed actions. Often with past tense.',
  },
  {
    word: 'il y a',
    en: 'ago',
    examples: [
      { fr: 'Il a commencé il y a 6 mois.', en: 'He started 6 months ago.' },
      { fr: 'Il y a longtemps, j\'ai vécu à Lyon.', en: 'A long time ago, I lived in Lyon.' },
    ],
    note: 'Always refers to past time. "Il y a + duration" = ago.',
  },
]

export default function FrenchTimeExpressions() {
  const [tab, setTab] = useState('clock')
  const [activeDP, setActiveDP] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Time Expressions | SayBonjour!" description="Master French time — telling the time, time vocabulary, depuis vs pendant vs il y a, and time phrases." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Time Expressions in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">L\'heure et le temps — telling time, vocabulary, and depuis/pendant/il y a</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[{ id: 'clock', label: 'Telling Time' }, { id: 'vocab', label: 'Time Vocabulary' }, { id: 'phrases', label: 'Time Phrases' }, { id: 'since', label: 'Depuis vs Pendant' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'clock' && (
          <div className="space-y-2">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-4">
              💡 French uses a 12-hour clock in conversation and a 24-hour clock officially. "Et quart" = quarter past, "et demie" = half past, "moins le quart" = quarter to.
            </div>
            {TELLING_TIME.map((t, i) => (
              <motion.div key={t.time} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-center gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <span className="font-mono font-bold text-sm text-gray-400 w-12 shrink-0">{t.time}</span>
                <SpeakButton text={t.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{t.fr}</p>
                  <p className="text-xs text-gray-400">{t.en}</p>
                  {t.note && <p className="text-xs text-amber-500 italic">{t.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'vocab' && (
          <div className="grid sm:grid-cols-2 gap-3">
            {TIME_VOCAB.map((item, i) => (
              <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-3 flex items-start gap-2">
                <SpeakButton text={item.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</p>
                  <p className="text-xs text-gray-400">{item.en}</p>
                  {item.note && <p className="text-xs text-amber-500 italic">{item.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {TIME_PHRASES.map((p, i) => (
              <motion.div key={p.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3">
                <SpeakButton text={p.fr} size="sm" />
                <div>
                  <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{p.fr}</span>
                  <span className="text-xs text-gray-400 ml-2">— {p.en}</span>
                  {p.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {p.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'since' && (
          <>
            <div className="flex gap-2 mb-5">
              {DEPUIS_PENDANT_IL_Y_A.map((d, i) => (
                <button key={d.word} onClick={() => setActiveDP(i)}
                  className={`flex-1 py-2 rounded-xl text-sm font-mono font-bold transition-colors ${activeDP === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50'}`}>
                  {d.word}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono font-bold text-2xl text-burgundy-700 dark:text-burgundy-vibrant-300">{DEPUIS_PENDANT_IL_Y_A[activeDP].word}</span>
                <span className="text-sm text-gray-400">— {DEPUIS_PENDANT_IL_Y_A[activeDP].en}</span>
              </div>
              <div className="space-y-3 mb-4">
                {DEPUIS_PENDANT_IL_Y_A[activeDP].examples.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5">
                    <SpeakButton text={ex.fr} size="sm" />
                    <div>
                      <p className="font-medium text-sm italic text-gray-900 dark:text-cream-50">"{ex.fr}"</p>
                      <p className="text-xs text-gray-400">{ex.en}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Key rule</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{DEPUIS_PENDANT_IL_Y_A[activeDP].note}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
