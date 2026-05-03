import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, RotateCcw, Palette } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const COLORS = [
  { fr: 'rouge', en: 'red', hex: '#dc2626', culture: 'The colour of passion, danger, and the French poppy ("le coquelicot"). Also the colour of French letterboxes and the iconic Moulin Rouge. "Rouge de honte" = red with shame.' },
  { fr: 'bleu', en: 'blue', hex: '#2563eb', culture: 'France\'s national colour — "bleu blanc rouge" (the tricolore). "Avoir le blues" (to feel low) borrowed from English. "Bleu marine" = navy blue. "Un cordon bleu" = a highly skilled cook.' },
  { fr: 'vert', en: 'green', hex: '#16a34a', culture: '"Être dans le vert" = to be in the clear. "Un vert-de-gris" (verdigris) is the green patina on copper. "Donner le feu vert" = to give the green light (permission).' },
  { fr: 'jaune', en: 'yellow', hex: '#ca8a04', culture: 'The Gilets Jaunes (yellow vests) wore this colour in the 2018 protests. "Rire jaune" = to give a strained/forced laugh. Historically associated with cowardice and jealousy.' },
  { fr: 'orange', en: 'orange', hex: '#ea580c', culture: 'The fruit and the colour share the same name — both from the Persian "nārang". The town of Orange in Provence gave the fruit its European name.' },
  { fr: 'violet', en: 'purple / violet', hex: '#7c3aed', culture: '"Violet" = cooler purple (blue-purple). "Pourpre" = richer, warmer purple associated with royalty. "Se mettre en violet" = to mourn (in some regional traditions).' },
  { fr: 'rose', en: 'pink', hex: '#db2777', culture: 'French uses "rose" for pink — not a separate word. "Voir la vie en rose" = to see life positively (famous Édith Piaf song). "Rose bonbon" = candy pink (invariable adjective).' },
  { fr: 'blanc', en: 'white', hex: '#f8fafc', culture: '"Blanc" also means blank. "Un chèque en blanc" = a blank cheque. "Nuit blanche" = a sleepless night. "Mariage en blanc" = a white wedding. "Le drapeau blanc" = white flag of surrender.' },
  { fr: 'noir', en: 'black', hex: '#111827', culture: '"Le marché noir" = the black market. "Voir tout en noir" = to see everything negatively. "Nuit noire" = pitch black. "Le cinéma noir" / "le film noir" = the famous French noir genre.' },
  { fr: 'gris', en: 'grey', hex: '#6b7280', culture: '"Être gris(e)" = to be tipsy! (mild drunkenness). "Faire grise mine" = to look disappointed/grumpy. "Le temps est gris" = the weather is grey.' },
  { fr: 'marron', en: 'brown', hex: '#92400e', culture: '"Marron" = chestnut nut AND the colour brown. "Les marrons chauds / grillés" (roasted chestnuts) are an iconic Parisian winter street food. "Un marron" is also a punch (slang).' },
  { fr: 'beige', en: 'beige', hex: '#d4b896', culture: 'A French word adopted globally — from "beige", originally undyed natural wool fabric. Synonymous with a certain French understated elegance.' },
  { fr: 'turquoise', en: 'turquoise', hex: '#0891b2', culture: 'From "turquois" = Turkish stone, because the mineral arrived in Europe via Turkey. A fashionable colour in French design and jewellery.' },
  { fr: 'bordeaux', en: 'burgundy / wine red', hex: '#7c2d52', culture: 'Named after the Bordeaux wine region — the colour of dark red wine. "Bordeaux" is used as a colour name in English too. Essential in French autumn fashion.' },
  { fr: 'crème', en: 'cream / off-white', hex: '#fef3c7', culture: '"La crème de la crème" = the very best of the best (cream of the cream). The colour evokes French dairy richness — crème fraîche, crème pâtissière.' },
  { fr: 'ivoire', en: 'ivory', hex: '#f5f0e8', culture: '"Ivoire" = ivory tusk. "La Côte d\'Ivoire" (Ivory Coast) was named for its ivory trade. A classic French interior design colour.' },
  { fr: 'écarlate', en: 'scarlet', hex: '#be123c', culture: '"Écarlate de honte" = scarlet with shame — a vivid literary expression. Used in French literature more than in everyday speech.' },
  { fr: 'doré(e)', en: 'golden', hex: '#f59e0b', culture: '"La Côte Dorée" is a stretch of French coastline. "Les années dorées" = the golden years. "Doré(e)" agrees in gender: un chapeau doré / une couronne dorée.' },
  { fr: 'argenté(e)', en: 'silver / silvery', hex: '#9ca3af', culture: '"Argenté" from "argent" (silver AND money). "Un cheveux argenté" = a silver hair. "L\'âge argenté" = the silver generation (older people).' },
  { fr: 'écru', en: 'ecru / unbleached linen colour', hex: '#e8dcc8', culture: 'From "cru" (raw/unprocessed). A fashionable neutral in French fashion — neither white nor beige. Classic in French linen and jersey fabrics.' },
]

const SHADES = [
  { fr: 'foncé / sombre', en: 'dark', example: 'bleu foncé, vert foncé, rouge foncé', note: '"Foncé" = dark. Added AFTER the colour and invariable: "une veste bleu foncé" (not "bleue foncée").' },
  { fr: 'clair', en: 'light / pale', example: 'bleu clair, vert clair, rose clair', note: '"Clair" = light. Also invariable in compound: "des yeux bleu clair" = light blue eyes.' },
  { fr: 'vif / vive', en: 'bright / vivid', example: 'rouge vif, jaune vif, orange vif', note: '"Vif" agrees: "vif" (m), "vive" (f). "Rouge vif" = vivid red. "Vif" also means lively, sharp.' },
  { fr: 'pâle', en: 'pale', example: 'bleu pâle, rose pâle, vert pâle', note: '"Pâle" = pale. Invariable as a modifier. "Avoir les traits pâles" = to look pale-faced.' },
  { fr: 'fluo / fluorescent', en: 'fluorescent / neon', example: 'jaune fluo, rose fluo, orange fluo', note: '"Fluo" = fluorescent. Invariable. Very popular in French cycling gear!' },
  { fr: 'pastel', en: 'pastel', example: 'bleu pastel, vert pastel, lilas pastel', note: '"Pastel" = pastel shade. Always invariable. "Des tons pastels" = pastel tones.' },
]

const GRAMMAR_NOTES = [
  { title: 'Agreement (accord)', note: 'Most colours agree in gender and number with the noun they describe.', example: 'un stylo rouge · une robe rouge · des stylos rouges · des robes rouges' },
  { title: 'Compound colours — NO agreement', note: 'Compound colour names (colour + modifier) are INVARIABLE. This is a very common mistake.', example: 'une veste bleu marine · des chaussures bleu foncé · une robe rose bonbon' },
  { title: 'Nouns as colours — NO agreement', note: 'Colours derived from nouns (marron, orange, bordeaux, crème, ivoire, saumon, kaki) are invariable.', example: 'un chapeau marron · des chaussures orange · une robe bordeaux' },
  { title: 'Shade modifiers — position and agreement', note: '"Foncé", "clair", "vif", "pâle" are placed AFTER the colour. In compound use they are invariable.', example: 'bleu foncé (dark blue) · vert clair (light green) · rouge vif (bright red) · bleu pâle (pale blue)' },
  { title: '"De couleur" construction', note: 'An alternative: "de couleur + colour" — used when describing something\'s colour more formally.', example: 'une voiture de couleur rouge · des rideaux de couleur crème · un mur de couleur bleu ciel' },
]

const COLOR_PHRASES = [
  { fr: 'Elle portait une robe bordeaux et des chaussures beige.', en: 'She was wearing a burgundy dress and beige shoes.', note: '"Bordeaux" and "beige" are invariable — no agreement needed.' },
  { fr: 'Ses yeux sont bleu clair — très beaux.', en: 'Her eyes are light blue — very beautiful.', note: '"Bleu clair" = invariable compound colour.' },
  { fr: 'Voir la vie en rose — il est vraiment optimiste.', en: 'Seeing life through rose-tinted glasses — he\'s really optimistic.', note: '"Voir la vie en rose" = Édith Piaf\'s famous expression.' },
  { fr: 'Les Gilets Jaunes ont manifesté pendant des mois.', en: 'The Yellow Vests protested for months.', note: 'The 2018–2019 protest movement — named for the high-visibility yellow vest.' },
  { fr: 'Donne-moi le feu vert et je commence.', en: 'Give me the green light and I\'ll start.', note: '"Le feu vert" = permission to go ahead. Based on traffic lights.' },
  { fr: 'Le ciel est gris ce matin — il va pleuvoir.', en: 'The sky is grey this morning — it\'s going to rain.', note: 'Classic French weather sentence.' },
  { fr: 'J\'adore le bleu marine — c\'est élégant.', en: 'I love navy blue — it\'s elegant.', note: '"Bleu marine" = navy blue (invariable).' },
  { fr: 'Les murs de son appartement sont peints en blanc cassé.', en: 'The walls of his flat are painted off-white.', note: '"Blanc cassé" = off-white (broken white). A popular French interior colour.' },
  { fr: 'Rougir de honte — ses joues sont écarlates !', en: 'To blush with shame — her cheeks are scarlet!', note: '"Rougir" = to blush/go red. "Écarlate" = scarlet — vivid literary description.' },
  { fr: 'Quelle est ta couleur préférée ?', en: 'What is your favourite colour?', note: '"La couleur préférée" = favourite colour. Classic French conversation opener.' },
]

const QUIZ_QUESTIONS = COLORS.slice(0, 12).map(c => ({
  ...c,
  options: [c.en, ...COLORS.filter(o => o.fr !== c.fr).sort(() => Math.random() - 0.5).slice(0, 3).map(o => o.en)].sort(() => Math.random() - 0.5),
}))

export default function ColorsInFrench() {
  const [tab, setTab] = useState('colors')
  const [quizIdx, setQuizIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [quizDone, setQuizDone] = useState(false)
  const [questions] = useState(QUIZ_QUESTIONS)

  const handleQuizAnswer = (choice) => {
    if (feedback) return
    const correct = choice === questions[quizIdx].en
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) { setScore(s => s + 1); addXP(5, 'vocabulary') }
    setTimeout(() => {
      setFeedback(null)
      if (quizIdx + 1 >= questions.length) setQuizDone(true)
      else setQuizIdx(i => i + 1)
    }, 800)
  }

  const resetQuiz = () => { setQuizIdx(0); setScore(0); setFeedback(null); setQuizDone(false) }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="Colours in French | SayBonjour!" description="Learn French colour vocabulary with grammar rules, shades, phrases, cultural notes, and a quiz." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Colours in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les couleurs — with grammar rules, shades, phrases, and cultural context</p>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: 'colors', label: 'Colour Guide' },
            { id: 'shades', label: 'Shades & Modifiers' },
            { id: 'grammar', label: 'Grammar Rules' },
            { id: 'phrases', label: 'Phrases' },
            { id: 'quiz', label: 'Quick Quiz' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'colors' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {COLORS.map((color, i) => (
              <motion.div key={color.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <div className="w-10 h-10 rounded-xl border border-gray-200 dark:border-dark-warm-50 shrink-0" style={{ backgroundColor: color.hex }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 dark:text-cream-50">{color.fr}</span>
                    <SpeakButton text={color.fr} size="sm" />
                    <span className="text-xs text-gray-400">— {color.en}</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {color.culture}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'shades' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-2">
              💡 Shade modifiers go AFTER the colour in French, and compound colour + shade combinations are invariable (no agreement).
            </div>
            {SHADES.map((shade, i) => (
              <motion.div key={shade.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'vocabulary')}>
                <div className="flex items-center gap-3 mb-2">
                  <SpeakButton text={shade.fr} size="sm" />
                  <span className="font-bold text-burgundy-700 dark:text-burgundy-vibrant-300">{shade.fr}</span>
                  <span className="text-gray-400 text-sm">— {shade.en}</span>
                </div>
                <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5 mb-2">
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{shade.example}</p>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 italic">💡 {shade.note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'grammar' && (
          <div className="space-y-4">
            {GRAMMAR_NOTES.map((note, i) => (
              <motion.div key={note.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'grammar')}>
                <div className="flex items-center gap-2 mb-2">
                  <Palette size={16} className="text-burgundy-600" />
                  <h3 className="font-bold text-gray-900 dark:text-cream-50">{note.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{note.note}</p>
                <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5">
                  <p className="text-sm font-mono text-burgundy-700 dark:text-burgundy-vibrant-300">{note.example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {COLOR_PHRASES.map((phrase, i) => (
              <motion.div key={phrase.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={phrase.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{phrase.fr}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{phrase.en}</p>
                  {phrase.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {phrase.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'quiz' && !quizDone && (
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>{quizIdx + 1} / {questions.length}</span>
              <span>Score: <strong className="text-burgundy-600">{score}</strong></span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-dark-warm-200 h-1.5 rounded-full mb-6">
              <div className="h-full bg-burgundy-500 rounded-full transition-all" style={{ width: `${(quizIdx / questions.length) * 100}%` }} />
            </div>
            <motion.div key={quizIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border-2 border-gray-100 dark:border-dark-warm-50 p-8 mb-6 text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 border-2 border-gray-200" style={{ backgroundColor: questions[quizIdx].hex }} />
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-3xl font-bold font-playfair text-burgundy-600">{questions[quizIdx].fr}</p>
                <SpeakButton text={questions[quizIdx].fr} size="sm" />
              </div>
              <p className="text-gray-400 text-sm">What does this colour mean in English?</p>
            </motion.div>
            <div className="grid grid-cols-2 gap-3">
              {questions[quizIdx].options.map(opt => (
                <button key={opt} onClick={() => handleQuizAnswer(opt)} disabled={!!feedback}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-colors
                    ${feedback && opt === questions[quizIdx].en ? 'bg-emerald-50 border-emerald-400 text-emerald-700' :
                      !feedback ? 'bg-white dark:bg-dark-warm-100 border-gray-200 dark:border-dark-warm-50 text-gray-700 dark:text-gray-200 hover:border-burgundy-300' :
                      'bg-gray-50 dark:bg-dark-warm-200 border-gray-200 dark:border-dark-warm-50 text-gray-400'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'quiz' && quizDone && (
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-10 text-center">
            <div className="text-5xl mb-4">{score >= 10 ? '🎨' : score >= 7 ? '🖌️' : '📚'}</div>
            <h2 className="text-2xl font-bold font-playfair text-gray-900 dark:text-cream-50 mb-2">Quiz complete!</h2>
            <p className="text-gray-500 mb-6">Score: <strong className="text-burgundy-600">{score}/{questions.length}</strong></p>
            <button onClick={resetQuiz}
              className="px-6 py-3 bg-burgundy-600 text-white rounded-xl font-medium hover:bg-burgundy-700 transition-colors flex items-center gap-2 mx-auto">
              <RotateCcw size={15} /> Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
