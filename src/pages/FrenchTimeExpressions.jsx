import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const TELLING_TIME = [
  { time: '12:00', fr: 'Il est midi.', en: 'It\'s noon.', note: '"Midi" = noon. "Minuit" = midnight. Both are masculine.' },
  { time: '00:00', fr: 'Il est minuit.', en: 'It\'s midnight.', note: '"À minuit pile" = exactly at midnight. "Passer la nuit à..." = to stay up all night.' },
  { time: '1:00', fr: 'Il est une heure.', en: 'It\'s one o\'clock.', note: '"Une heure" is feminine — the only time using "une" not "un".' },
  { time: '2:15', fr: 'Il est deux heures et quart.', en: 'It\'s quarter past two.', note: '"Et quart" = quarter past. Always "et quart" not "quinze".' },
  { time: '3:30', fr: 'Il est trois heures et demie.', en: 'It\'s half past three.', note: '"Et demie" = half past. "Demi" takes feminine -e because "heure" is feminine.' },
  { time: '4:45', fr: 'Il est cinq heures moins le quart.', en: 'It\'s quarter to five.', note: '"Moins le quart" = quarter to. Note: "moins LE quart" — the article is required.' },
  { time: '5:10', fr: 'Il est cinq heures dix.', en: 'It\'s ten past five.', note: 'Minutes past the hour: just add the number after "heures".' },
  { time: '6:50', fr: 'Il est sept heures moins dix.', en: 'It\'s ten to seven.', note: '"Moins dix" = minus ten. Think of the next hour then subtract.' },
  { time: '14:00', fr: 'Il est quatorze heures.', en: 'It\'s 2pm (14:00 — 24hr clock)', note: 'French uses 24-hour clock officially: timetables, TV schedules, official appointments.' },
  { time: '16:30', fr: 'Il est seize heures trente.', en: 'It\'s 4:30pm (16:30)', note: '"16h30" on French timetables. Pronounced "seize heures trente".' },
  { time: '20:30', fr: 'Il est vingt heures trente.', en: 'It\'s 8:30pm (20:30)', note: 'TV prime time in France = "le prime" = 20h50 (after the news at 20h).' },
  { time: '?', fr: 'Quelle heure est-il ?', en: 'What time is it?', note: 'Formal. Informal: "T\'as l\'heure ?" = Have you got the time? "Il est quelle heure ?" = what time is it?' },
]

const TIME_VOCAB = [
  { fr: 'une seconde', en: 'a second', note: '"Deux secondes !" = Just a second! (informal for "wait a moment").' },
  { fr: 'une minute', en: 'a minute', note: '"Une minute, s\'il vous plaît." = One minute please. "En quelques minutes" = in a few minutes.' },
  { fr: 'un quart d\'heure', en: 'a quarter of an hour', note: '"Dans un quart d\'heure" = in 15 minutes. "Le quart d\'heure de politesse" = arriving 15 min late (acceptable at social events).' },
  { fr: 'une demi-heure', en: 'half an hour', note: '"Dans une demi-heure" = in half an hour. "Toutes les demi-heures" = every half-hour.' },
  { fr: 'une heure', en: 'an hour', note: '"Environ une heure" = about an hour. "Deux heures de route" = a two-hour drive.' },
  { fr: 'un jour / une journée', en: 'a day', note: '"Un jour" = a day counted. "Une journée" = a full day experienced. "Bonne journée !" = Have a good day!' },
  { fr: 'une semaine', en: 'a week', note: '"La semaine prochaine" = next week. "En semaine" = on weekdays (not weekend). "Toutes les semaines" = every week.' },
  { fr: 'une quinzaine', en: 'a fortnight / about two weeks', note: 'From "quinze" (fifteen). "Dans une quinzaine de jours" = in about two weeks. Very common in French.' },
  { fr: 'un mois', en: 'a month', note: '"Le mois dernier / prochain" = last / next month. "Tous les mois" = every month. "En fin de mois" = at the end of the month (payday!).' },
  { fr: 'un trimestre', en: 'a quarter / school term (3 months)', note: 'French schools have 3 trimesters. Companies report "les résultats du trimestre" = quarterly results.' },
  { fr: 'un semestre', en: 'a half-year / semester (6 months)', note: 'French universities use semesters. "Le premier semestre" = Sept–Jan. "Le deuxième semestre" = Feb–June.' },
  { fr: 'un an / une année', en: 'a year', note: '"Un an" = a year counted ("ça fait un an"). "Une année" = a full year experienced ("cette année" = this year, "bonne année !" = Happy New Year!).' },
  { fr: 'une décennie', en: 'a decade', note: '"Les années 80" = the 1980s. "Ces dernières décennies" = in recent decades.' },
  { fr: 'un siècle', en: 'a century', note: '"Le 21e siècle" = the 21st century. "Ça fait des siècles !" = it\'s been ages! (informal hyperbole).' },
  { fr: 'une époque', en: 'an era / period (in time)', note: '"À cette époque" = at that time. "L\'époque moderne" = the modern era. "À l\'époque" = back then.' },
  { fr: 'un millénaire', en: 'a millennium', note: '"Le nouveau millénaire" = the new millennium. Rarely used in conversation but important in historical contexts.' },
]

const TIME_PHRASES = [
  { fr: 'Quelle heure est-il ?', en: 'What time is it?', note: 'Formal. Informal: "T\'as l\'heure ?" or "Il est quelle heure ?".' },
  { fr: 'Il est l\'heure.', en: 'It\'s time.', note: '"Il est l\'heure de partir." = It\'s time to leave. "C\'est l\'heure !" = Time\'s up!' },
  { fr: 'en avance', en: 'early / ahead of time', note: '"Arriver en avance" = to arrive early. "Être en avance sur son temps" = to be ahead of one\'s time.' },
  { fr: 'en retard', en: 'late / behind time', note: 'The French have a concept of "le quart d\'heure de politesse" — arriving 15 min late is socially acceptable at dinner parties.' },
  { fr: 'à l\'heure', en: 'on time', note: '"Être à l\'heure" = to be on time. "Le train est à l\'heure" = the train is on time. "Pile à l\'heure" = exactly on time.' },
  { fr: 'tout à l\'heure', en: 'in a moment / just now / earlier', note: 'Context-dependent! Can mean PAST ("je l\'ai vu tout à l\'heure" = I saw him just now) OR FUTURE ("à tout à l\'heure !" = see you later!).' },
  { fr: 'tout de suite', en: 'immediately / right away', note: '"J\'arrive tout de suite !" = I\'m coming right away! "Tout de suite" = right now, no delay.' },
  { fr: 'dans un instant', en: 'in a moment', note: '"Dans un instant" = in just a moment. More polite than "tout de suite" — implies a very short wait.' },
  { fr: 'entre-temps', en: 'in the meantime / meanwhile', note: '"Entre-temps, je vais préparer le dîner." = In the meantime, I\'ll prepare dinner. Connecting two simultaneous timeframes.' },
  { fr: 'à cette époque', en: 'at that time / back then', note: '"À cette époque, je vivais à Paris." = Back then, I was living in Paris. Use for historical or personal past.' },
  { fr: 'désormais', en: 'from now on / henceforth', note: '"Désormais, tout va changer." = From now on, everything will change. Formal — common in news and official language.' },
  { fr: 'autrefois', en: 'in the past / once upon a time', note: '"Autrefois, on voyageait en diligence." = In the past, people travelled by stagecoach. Literary/formal.' },
  { fr: 'de nos jours', en: 'nowadays / these days', note: '"De nos jours, tout va trop vite." = Nowadays, everything moves too fast. A classic generational complaint.' },
  { fr: 'dorénavant', en: 'from now on (formal)', note: '"Dorénavant, veuillez utiliser cette adresse." = From now on, please use this address. Very formal register.' },
]

const DEPUIS_PENDANT_IL_Y_A = [
  {
    word: 'depuis',
    en: 'since / for (ongoing)',
    colour: 'emerald',
    examples: [
      { fr: 'J\'étudie le français depuis 6 mois.', en: 'I have been studying French for 6 months (and still am).' },
      { fr: 'Elle travaille ici depuis 2019.', en: 'She has been working here since 2019.' },
      { fr: 'Depuis quand ?', en: 'Since when? / For how long?' },
      { fr: 'Depuis longtemps.', en: 'For a long time.' },
    ],
    note: 'Use "depuis" + PRESENT tense for actions that started in the past and are STILL ongoing. This is the opposite of English which uses "for + perfect tense".',
    warning: 'Do NOT use passé composé with "depuis" for ongoing actions. "J\'ai étudié depuis 6 mois" = WRONG if you\'re still studying.',
  },
  {
    word: 'pendant',
    en: 'during / for (completed period)',
    colour: 'blue',
    examples: [
      { fr: 'J\'ai étudié le français pendant 6 mois.', en: 'I studied French for 6 months (finished).' },
      { fr: 'Pendant les vacances, je suis resté(e) chez moi.', en: 'During the holidays, I stayed home.' },
      { fr: 'Il a plu pendant toute la semaine.', en: 'It rained all week.' },
      { fr: 'Pendant combien de temps ?', en: 'For how long? (completed)' },
    ],
    note: 'Use "pendant" for completed actions — a defined duration that is now OVER. Typically used with passé composé or with a noun referring to a period.',
    warning: '"Pendant" cannot describe something that is still happening. Use "depuis" for ongoing situations.',
  },
  {
    word: 'il y a',
    en: 'ago (point in the past)',
    colour: 'purple',
    examples: [
      { fr: 'Il a commencé il y a 6 mois.', en: 'He started 6 months ago.' },
      { fr: 'Il y a longtemps, j\'ai vécu à Lyon.', en: 'A long time ago, I lived in Lyon.' },
      { fr: 'Je l\'ai vu il y a deux jours.', en: 'I saw him two days ago.' },
      { fr: 'Il y a combien de temps ?', en: 'How long ago?' },
    ],
    note: '"Il y a" + duration = ago. It always refers to a PAST POINT in time. "Il y a" signals how far back in time something happened.',
    warning: 'Don\'t confuse "il y a" (ago) with "depuis" (for, since). "Il y a 3 ans" = 3 years ago. "Depuis 3 ans" = for 3 years (still ongoing).',
  },
  {
    word: 'dans',
    en: 'in (future time)',
    colour: 'amber',
    examples: [
      { fr: 'Je pars dans deux heures.', en: 'I\'m leaving in two hours.' },
      { fr: 'Dans trois semaines, ce sera fini.', en: 'In three weeks, it will be over.' },
      { fr: 'Il reviendra dans un mois.', en: 'He\'ll be back in a month.' },
      { fr: 'Dans combien de temps ?', en: 'In how long? (future)' },
    ],
    note: '"Dans" + duration = in (future). It measures future time — how long until something happens.',
    warning: 'Don\'t confuse "dans" (future: in 2 hours) with "en" (duration needed: done in 2 hours). "Je fais ça en 5 minutes" = I can do it in 5 minutes.',
  },
]

const COLOUR_MAP = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-200 dark:border-emerald-700', text: 'text-emerald-800 dark:text-emerald-300', badge: 'bg-emerald-100 text-emerald-700' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-800 dark:text-blue-300', badge: 'bg-blue-100 text-blue-700' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', border: 'border-purple-200 dark:border-purple-700', text: 'text-purple-800 dark:text-purple-300', badge: 'bg-purple-100 text-purple-700' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-700', text: 'text-amber-800 dark:text-amber-300', badge: 'bg-amber-100 text-amber-700' },
}

export default function FrenchTimeExpressions() {
  const [tab, setTab] = useState('clock')
  const [activeDP, setActiveDP] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Time Expressions | SayBonjour!" description="Master French time — telling the time, time vocabulary, depuis vs pendant vs il y a, and time phrases." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Time Expressions in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">L\'heure et le temps — telling time, vocabulary, phrases, and depuis / pendant / il y a / dans</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'clock', label: 'Telling Time' },
            { id: 'vocab', label: 'Time Vocabulary' },
            { id: 'phrases', label: 'Time Phrases' },
            { id: 'since', label: 'Depuis / Pendant / Il y a' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'clock' && (
          <div className="space-y-2">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-4">
              💡 French uses a 12-hour clock in conversation and a 24-hour clock officially (on timetables, TV schedules, official appointments). "Et quart" = quarter past · "Et demie" = half past · "Moins le quart" = quarter to.
            </div>
            {TELLING_TIME.map((t, i) => (
              <motion.div key={t.time} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <span className="font-mono font-bold text-sm text-gray-400 w-12 shrink-0 mt-0.5">{t.time}</span>
                <SpeakButton text={t.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{t.fr}</p>
                  <p className="text-xs text-gray-400">{t.en}</p>
                  {t.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {t.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'vocab' && (
          <div className="space-y-2">
            {TIME_VOCAB.map((item, i) => (
              <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={item.fr} size="sm" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                    <span className="text-xs text-gray-400">— {item.en}</span>
                  </div>
                  {item.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {item.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {TIME_PHRASES.map((p, i) => (
              <motion.div key={p.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={p.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{p.fr}"</p>
                  <p className="text-xs text-gray-400 mt-0.5">— {p.en}</p>
                  {p.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {p.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'since' && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-5">
              💡 "Depuis", "pendant", "il y a", and "dans" all relate to time duration — but each is used in a very specific context. Confusing them is one of the most common mistakes at B1–B2 level.
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {DEPUIS_PENDANT_IL_Y_A.map((d, i) => (
                <button key={d.word} onClick={() => { setActiveDP(i); addXP(4, 'grammar') }}
                  className={`px-3 py-2 rounded-xl text-sm font-mono font-bold transition-colors ${activeDP === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50'}`}>
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
                    className="flex items-center gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5"
                    onClick={() => addXP(2, 'grammar')}>
                    <SpeakButton text={ex.fr} size="sm" />
                    <div>
                      <p className="font-medium text-sm italic text-gray-900 dark:text-cream-50">"{ex.fr}"</p>
                      <p className="text-xs text-gray-400">{ex.en}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Key rule</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{DEPUIS_PENDANT_IL_Y_A[activeDP].note}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">⚠ Common mistake</p>
                <p className="text-sm text-red-800 dark:text-red-300">{DEPUIS_PENDANT_IL_Y_A[activeDP].warning}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
