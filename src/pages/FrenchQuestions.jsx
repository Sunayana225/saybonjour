import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, MessageSquare } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const QUESTION_WORDS = [
  { fr: 'qui', en: 'who / whom', examples: [
    { fr: 'Qui est-ce ?', en: 'Who is it?' },
    { fr: 'Tu parles de qui ?', en: 'Who are you talking about?' },
    { fr: 'Avec qui travailles-tu ?', en: 'Who do you work with?' },
    { fr: 'C\'est qui, le responsable ?', en: 'Who is the person in charge?', note: '"C\'est qui" = informal.' },
  ]},
  { fr: 'que / quoi', en: 'what', examples: [
    { fr: 'Que faites-vous dans la vie ?', en: 'What do you do for a living?', note: '"Que + inversion" = formal.' },
    { fr: 'Qu\'est-ce que tu fais ?', en: 'What are you doing?', note: '"Est-ce que" = neutral spoken form.' },
    { fr: 'C\'est quoi ça ?', en: 'What is that?', note: '"C\'est quoi" = very informal.' },
    { fr: 'De quoi as-tu besoin ?', en: 'What do you need?', note: '"Avoir besoin de" = to need.' },
  ]},
  { fr: 'quand', en: 'when', examples: [
    { fr: 'Quand est-ce que vous partez ?', en: 'When are you leaving?' },
    { fr: 'Depuis quand habites-tu ici ?', en: 'Since when have you lived here?', note: '"Depuis quand" = since when.' },
    { fr: 'Jusqu\'à quand restez-vous ?', en: 'Until when are you staying?', note: '"Jusqu\'à quand" = until when.' },
    { fr: 'C\'est pour quand ?', en: 'When is it for? / When do you need it by?' },
  ]},
  { fr: 'où', en: 'where', examples: [
    { fr: 'Où habitez-vous ?', en: 'Where do you live?', note: '"Où + inversion" = formal.' },
    { fr: 'D\'où viens-tu ?', en: 'Where are you from?', note: '"D\'où" = from where.' },
    { fr: 'Où est-ce qu\'on se retrouve ?', en: 'Where shall we meet?', note: '"Se retrouver" = to meet up.' },
    { fr: 'Tu vas où comme ça ?', en: 'Where are you off to?', note: 'Very informal word order.' },
  ]},
  { fr: 'pourquoi', en: 'why', examples: [
    { fr: 'Pourquoi est-ce que tu pleures ?', en: 'Why are you crying?' },
    { fr: 'Pourquoi n\'est-il pas venu ?', en: 'Why didn\'t he come?', note: '"N\'est-il pas" = formal inversion.' },
    { fr: 'Parce que j\'étais fatigué(e).', en: 'Because I was tired.', note: '"Parce que" answers "pourquoi".' },
    { fr: 'C\'est pour ça que je t\'appelle.', en: 'That\'s why I\'m calling you.', note: '"C\'est pour ça que" = that\'s why.' },
  ]},
  { fr: 'comment', en: 'how', examples: [
    { fr: 'Comment ça marche ?', en: 'How does it work?', note: '"Ça marche !" alone = great! / sounds good!' },
    { fr: 'Comment tu t\'appelles ?', en: 'What\'s your name?', note: 'Lit: "how do you call yourself?"' },
    { fr: 'Comment est-ce qu\'on dit ça en français ?', en: 'How do you say that in French?' },
    { fr: 'Comment ? Répète, s\'il te plaît.', en: 'Sorry? Please repeat.', note: '"Comment ?" alone = pardon? (polite).' },
  ]},
  { fr: 'combien (de)', en: 'how many / how much', examples: [
    { fr: 'Combien ça coûte ?', en: 'How much does that cost?', note: '"C\'est combien ?" = how much is it?' },
    { fr: 'Combien de personnes y a-t-il ?', en: 'How many people are there?', note: '"Combien de" + noun (no article).' },
    { fr: 'Depuis combien de temps ?', en: 'For how long?', note: 'With present tense in French.' },
    { fr: 'Tu en veux combien ?', en: 'How many/much do you want?', note: '"En" replaces the noun already mentioned.' },
  ]},
  { fr: 'quel / quelle / quels / quelles', en: 'which / what (adjective)', examples: [
    { fr: 'Quel film tu préfères ?', en: 'Which film do you prefer?', note: '"Quel" agrees: quel (m), quelle (f), quels/quelles (pl).' },
    { fr: 'Quelle heure est-il ?', en: 'What time is it?', note: '"Quelle" = feminine, agrees with "heure".' },
    { fr: 'Quel est ton numéro de téléphone ?', en: 'What is your phone number?', note: '"Quel est" = what is (with "être").' },
    { fr: 'Quelles sont tes matières préférées ?', en: 'What are your favourite subjects?', note: '"Quelles" = feminine plural.' },
  ]},
  { fr: 'lequel / laquelle / lesquels / lesquelles', en: 'which one(s) (pronoun)', examples: [
    { fr: 'Lequel tu veux ?', en: 'Which one do you want? (m)', note: '"Lequel" replaces a masculine noun already mentioned.' },
    { fr: 'Laquelle de ces robes te plaît ?', en: 'Which of these dresses do you like?', note: '"Laquelle" = feminine.' },
    { fr: 'Lesquels préfères-tu ?', en: 'Which ones do you prefer? (m pl)', note: '"Lesquels" = masculine plural.' },
    { fr: 'Auquel de tes amis penses-tu ?', en: 'Which of your friends are you thinking of?', note: '"Auquel" = à + lequel (contracted).' },
  ]},
]

const QUESTION_FORMS = [
  {
    form: 'Intonation',
    level: 'A1',
    desc: 'Just raise your voice at the end — the most natural spoken method. No word order change.',
    examples: [
      { fr: 'Tu viens ?', en: 'Are you coming?' },
      { fr: 'Il parle français ?', en: 'Does he speak French?' },
      { fr: 'Vous avez une table ?', en: 'Do you have a table?' },
      { fr: 'C\'est ouvert le dimanche ?', en: 'Is it open on Sunday?' },
    ],
    note: 'Used by virtually all French speakers in conversation. Grammatically correct and entirely natural.',
  },
  {
    form: 'Est-ce que…',
    level: 'A1',
    desc: 'Add "est-ce que" before a normal statement. Subject and verb remain in normal order. Works at all levels of formality.',
    examples: [
      { fr: 'Est-ce que tu viens ?', en: 'Are you coming?' },
      { fr: 'Est-ce qu\'il parle français ?', en: 'Does he speak French?', note: '"Est-ce qu\'" before a vowel.' },
      { fr: 'Pourquoi est-ce que tu pars si tôt ?', en: 'Why are you leaving so early?' },
      { fr: 'Quand est-ce qu\'on mange ?', en: 'When do we eat?' },
    ],
    note: 'The most versatile form — "est-ce que" is pronounced "ess-kuh". The safest choice for any context.',
  },
  {
    form: 'Subject-verb inversion',
    level: 'B1',
    desc: 'Invert the verb and subject pronoun with a hyphen. A "-t-" is inserted between vowels for pronunciation.',
    examples: [
      { fr: 'Viens-tu ?', en: 'Are you coming?' },
      { fr: 'Parle-t-il français ?', en: 'Does he speak French?', note: '"-t-" inserted: parle + il → parle-t-il.' },
      { fr: 'Avez-vous une table ?', en: 'Do you have a table?' },
      { fr: 'Où habite-t-elle ?', en: 'Where does she live?', note: 'habite + elle → habite-t-elle.' },
    ],
    note: 'Formal — used in written French, official contexts, and formal speech. The "-t-" is called "t euphonique".',
  },
  {
    form: 'n\'est-ce pas ?',
    level: 'A2',
    desc: 'Tag question added at the end. One universal tag for all contexts — equivalent to "isn\'t it?", "right?", "don\'t you?", "aren\'t they?".',
    examples: [
      { fr: 'C\'est beau, n\'est-ce pas ?', en: 'It\'s beautiful, isn\'t it?' },
      { fr: 'Tu viens, n\'est-ce pas ?', en: 'You\'re coming, aren\'t you?' },
      { fr: 'Il fait chaud aujourd\'hui, n\'est-ce pas ?', en: 'It\'s warm today, isn\'t it?' },
      { fr: 'Vous êtes Madame Dupont, n\'est-ce pas ?', en: 'You\'re Madame Dupont, aren\'t you?' },
    ],
    note: 'Very elegant — one tag for all. More formal than "hein ?" A great asset for B2+ learners.',
  },
  {
    form: 'Hein ? / Non ?',
    level: 'A2',
    desc: 'Casual spoken equivalents of n\'est-ce pas — added to the end of a statement in informal speech.',
    examples: [
      { fr: 'C\'est bien, hein ?', en: 'It\'s good, right?', note: '"Hein" = very colloquial. Often untranslatable.' },
      { fr: 'Tu viens, non ?', en: 'You\'re coming, right?', note: '"Non ?" = a soft challenge or confirmation request.' },
      { fr: 'C\'est pas grave, hein ?', en: 'It\'s not serious, is it?', note: '"C\'est pas" = informal shortening of "ce n\'est pas".' },
    ],
    note: '"Hein" is very informal — don\'t use in formal contexts. "Non ?" is slightly more standard.',
  },
]

const COMMON_MISTAKES = [
  { mistake: 'Je suis d\'accord ?', correct: 'Tu es d\'accord ?', explanation: 'You can\'t ask if "I agree" — the question is always directed at the other person. "Êtes-vous d\'accord ?" = formal.' },
  { mistake: 'Pourquoi tu n\'es pas venu ? Parce que.', correct: 'Parce que j\'étais malade.', explanation: '"Parce que" must be followed by a full clause — you can\'t end a sentence with it, unlike English "because".' },
  { mistake: 'Comment tu t\'appelles-tu ?', correct: 'Comment tu t\'appelles ? OR Comment t\'appelles-tu ?', explanation: 'Don\'t mix informal word order AND inversion. Choose one form: intonation OR inversion, not both.' },
  { mistake: 'C\'est quoi ton nom ?', correct: 'C\'est quoi ton prénom ? / Comment tu t\'appelles ?', explanation: '"C\'est quoi ton nom ?" is very informal and a bit blunt. "Comment t\'appelles-tu ?" is more natural.' },
  { mistake: 'Qu\'est-ce que c\'est ton avis ?', correct: 'Quel est ton avis ? / Qu\'est-ce que tu en penses ?', explanation: '"Qu\'est-ce que c\'est" = what is this (thing). For opinions: "Quel est ton avis ?" or "Qu\'est-ce que tu penses ?"' },
]

const LEVEL_COLORS = { A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-yellow-100 text-yellow-700' }

export default function FrenchQuestions() {
  const [activeForm, setActiveForm] = useState(0)
  const [activeWord, setActiveWord] = useState(0)
  const [tab, setTab] = useState('forms')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Questions | SayBonjour!" description="Master asking questions in French — question words, intonation, est-ce que, inversion, tag questions, and common mistakes." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Asking Questions in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les questions — 5 question forms, all question words, and common mistakes</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'forms', label: 'Question Forms' },
            { id: 'words', label: 'Question Words' },
            { id: 'mistakes', label: 'Common Mistakes' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'forms' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {QUESTION_FORMS.map((f, i) => (
                <button key={f.form} onClick={() => { setActiveForm(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${activeForm === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {f.form}
                  <span className={`text-xs px-1 py-0.5 rounded font-medium ${activeForm === i ? 'bg-white/20 text-white' : LEVEL_COLORS[f.level]}`}>{f.level}</span>
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="mb-4">
                <h2 className="font-bold text-xl text-gray-900 dark:text-cream-50 font-playfair">{QUESTION_FORMS[activeForm].form}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{QUESTION_FORMS[activeForm].desc}</p>
              </div>
              <div className="space-y-3 mb-4">
                {QUESTION_FORMS[activeForm].examples.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-3 flex items-start gap-3"
                    onClick={() => addXP(2, 'grammar')}>
                    <SpeakButton text={ex.fr} size="sm" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-cream-50 italic">"{ex.fr}"</p>
                      <p className="text-xs text-gray-400">{ex.en}</p>
                      {ex.note && <p className="text-xs text-amber-500 italic">{ex.note}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Note</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{QUESTION_FORMS[activeForm].note}</p>
              </div>
            </div>
          </>
        )}

        {tab === 'words' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {QUESTION_WORDS.map((w, i) => (
                <button key={w.fr} onClick={() => { setActiveWord(i); addXP(2, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-sm font-mono font-bold transition-colors ${activeWord === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {w.fr}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <SpeakButton text={QUESTION_WORDS[activeWord].fr} size="md" />
                <span className="font-bold text-2xl text-burgundy-700 dark:text-burgundy-vibrant-300 font-playfair">{QUESTION_WORDS[activeWord].fr}</span>
                <span className="text-gray-400">= {QUESTION_WORDS[activeWord].en}</span>
              </div>
              <div className="space-y-3">
                {QUESTION_WORDS[activeWord].examples.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2.5"
                    onClick={() => addXP(2, 'vocabulary')}>
                    <SpeakButton text={ex.fr} size="sm" />
                    <div>
                      <p className="text-sm italic text-gray-700 dark:text-gray-300">"{ex.fr}"</p>
                      <p className="text-xs text-gray-400">{ex.en}</p>
                      {ex.note && <p className="text-xs text-amber-500 italic">{ex.note}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'mistakes' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-2">
              These are the most common question-related errors made by French learners.
            </div>
            {COMMON_MISTAKES.map((item, i) => (
              <motion.div key={item.mistake} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'grammar')}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-red-500 font-bold text-sm mt-0.5">✗</span>
                  <div>
                    <p className="text-sm line-through text-red-400 font-mono">"{item.mistake}"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-emerald-500 font-bold text-sm mt-0.5">✓</span>
                  <div>
                    <SpeakButton text={item.correct} size="sm" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium font-mono mt-1">"{item.correct}"</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">{item.explanation}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
