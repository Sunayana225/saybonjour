import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const ARTICLE_TYPES = [
  {
    name: 'Definite articles — Les articles définis',
    level: 'A1',
    desc: 'Used when referring to a specific thing, something already known, or making a general statement about a whole category.',
    articles: [
      { form: 'le', use: 'masculine singular', example: 'le chat', exEn: 'the cat', extraEx: 'le soleil, le temps, le café' },
      { form: 'la', use: 'feminine singular', example: 'la maison', exEn: 'the house', extraEx: 'la France, la liberté, la table' },
      { form: 'l\'', use: 'before vowel or silent h', example: 'l\'ami, l\'hôtel', exEn: 'the friend, the hotel', extraEx: 'l\'eau, l\'amour, l\'heure' },
      { form: 'les', use: 'plural (all genders)', example: 'les enfants', exEn: 'the children', extraEx: 'les Français, les hommes, les idées' },
    ],
    note: 'Also used for general statements about entire categories: "J\'aime le chocolat" = I like chocolate (in general). English says "I like chocolate" (no article); French requires "le chocolat". This is a major difference.',
    contractions: [
      { original: 'à + le', result: 'au', example: 'Je vais au marché.', en: 'I\'m going to the market.' },
      { original: 'à + les', result: 'aux', example: 'Je parle aux enfants.', en: 'I\'m speaking to the children.' },
      { original: 'de + le', result: 'du', example: 'Le chat du voisin.', en: 'The neighbour\'s cat.' },
      { original: 'de + les', result: 'des', example: 'Les chiens des voisins.', en: 'The neighbours\' dogs.' },
    ],
    keyRules: [
      'Never use "à le" — always contract to "au".',
      '"J\'aime le français" = I like French (in general). The definite article marks generalisation.',
      'Countries are usually feminine in French: la France, la Chine, l\'Espagne — unless they end in a consonant (le Japon, le Portugal).',
    ],
  },
  {
    name: 'Indefinite articles — Les articles indéfinis',
    level: 'A1',
    desc: 'Used when introducing something for the first time, referring to a non-specific thing, or saying "a" or "some".',
    articles: [
      { form: 'un', use: 'masculine singular', example: 'un chat', exEn: 'a cat', extraEx: 'un homme, un livre, un café' },
      { form: 'une', use: 'feminine singular', example: 'une maison', exEn: 'a house', extraEx: 'une femme, une idée, une heure' },
      { form: 'des', use: 'plural (all genders)', example: 'des chats', exEn: '(some) cats', extraEx: 'des enfants, des livres, des amis' },
    ],
    note: 'Critical rule: In NEGATIVE sentences, un/une/des all become "de" (or "d\'" before a vowel). "Je n\'ai pas de chat." (I don\'t have a cat.) "Il n\'y a pas d\'eau." (There\'s no water.)',
    contractions: [],
    keyRules: [
      'After negation: un/une/des → "de" or "d\'". This is one of the most common mistakes.',
      '"Des" has no exact equivalent in English — "some" or no article at all.',
      '"C\'est un médecin" = He is a doctor (with indefinite article). Saying profession after "il est" drops the article: "Il est médecin."',
    ],
  },
  {
    name: 'Partitive articles — Les articles partitifs',
    level: 'A2',
    desc: 'Used with uncountable nouns — food, drink, abstract qualities — to say "some" (an unspecified amount of something).',
    articles: [
      { form: 'du', use: 'masculine singular', example: 'du pain', exEn: 'some bread / bread', extraEx: 'du vin, du café, du courage' },
      { form: 'de la', use: 'feminine singular', example: 'de la musique', exEn: 'some music / music', extraEx: 'de la soupe, de la patience, de la pluie' },
      { form: 'de l\'', use: 'before vowel or silent h', example: 'de l\'eau', exEn: 'some water / water', extraEx: 'de l\'huile, de l\'air, de l\'argent' },
      { form: 'des', use: 'plural (countable/uncountable)', example: 'des légumes', exEn: 'some vegetables', extraEx: 'des épinards, des nouvelles, des progrès' },
    ],
    note: 'After negation: ALL partitives become "de/d\'". "Je ne bois pas de café." (I don\'t drink coffee.) "Il n\'y a pas d\'eau." Note: "de" has no article — this is the standard negation rule.',
    contractions: [],
    keyRules: [
      'Partitives are used for quantities you can\'t count: "de la patience", "du courage", "de l\'eau".',
      'After negation: "du/de la/de l\'/des" → "de/d\'".',
      'English often uses NO article: "I drink coffee" = "Je bois du café" (you need the partitive).',
      '"Manger du chocolat" = to eat (some) chocolate. "J\'aime le chocolat" = I like chocolate (in general).',
    ],
  },
]

const COMMON_MISTAKES = [
  { mistake: 'Je mange la soupe pour le déjeuner.', correct: 'Je mange de la soupe pour le déjeuner.', explanation: 'Soup is uncountable — use partitive "de la". "La soupe" would mean a specific soup already mentioned.' },
  { mistake: 'Je n\'ai pas un chien.', correct: 'Je n\'ai pas de chien.', explanation: 'After negation, un/une always become "de". This is non-negotiable in standard French.' },
  { mistake: 'Je vais à le cinéma.', correct: 'Je vais au cinéma.', explanation: '"à + le" MUST contract to "au". "À le" is incorrect in French.' },
  { mistake: 'J\'aime chocolats en général.', correct: 'J\'aime le chocolat.', explanation: 'For general likes/dislikes, French uses the definite article. "J\'aime le chocolat" = I like chocolate in general.' },
  { mistake: 'Il est un médecin.', correct: 'Il est médecin. / C\'est un médecin.', explanation: 'With "être" + profession (no adjective), drop the article: "il est médecin". With "c\'est", keep it: "c\'est un médecin".' },
  { mistake: 'Je bois du café pas de sucre.', correct: 'Je bois du café sans sucre.', explanation: '"Sans" (without) + noun: no article needed. "Sans sucre" = without sugar.' },
  { mistake: 'Elle a le courage de demander.', correct: 'Elle a du courage pour demander.', explanation: 'Uncountable abstract quality = partitive. "Du courage" = (some) courage. "Le courage" would refer to a specific act of courage previously mentioned.' },
  { mistake: 'Les enfants de la France aiment les vacances.', correct: 'Les enfants français / Les enfants en France aiment les vacances.', explanation: '"Les enfants de la France" is clunky. Better: use an adjective or a preposition.' },
]

const SENTENCE_EXAMPLES = [
  { fr: 'Je bois du café le matin.', en: 'I drink coffee in the morning.', analysis: '"du café" = partitive (uncountable). "le matin" = definite article (the morning = mornings in general).' },
  { fr: 'J\'aime le café mais je ne bois pas de café le soir.', en: 'I like coffee but I don\'t drink coffee in the evening.', analysis: '"le café" = I like coffee (in general). "pas de café" = negation removes the partitive.' },
  { fr: 'Il y a des étudiants dans la classe.', en: 'There are students in the classroom.', analysis: '"des étudiants" = indefinite plural (some students). "la classe" = definite (specific classroom).' },
  { fr: 'Il n\'y a pas d\'étudiants aujourd\'hui.', en: 'There are no students today.', analysis: '"des" → "d\'" after negation. "Pas d\'" before vowel.' },
  { fr: 'Nous allons au marché du village.', en: 'We\'re going to the village market.', analysis: '"au marché" = à + le → au. "du village" = de + le → du.' },
  { fr: 'Je parle aux enfants des voisins.', en: 'I\'m talking to the neighbours\' children.', analysis: '"aux enfants" = à + les → aux. "des voisins" = de + les → des.' },
  { fr: 'Elle a de la patience et du talent.', en: 'She has patience and talent.', analysis: '"de la patience" = partitive feminine. "du talent" = partitive masculine (uncountable qualities).' },
  { fr: 'Le soleil, la lune et les étoiles brillent.', en: 'The sun, moon and stars shine.', analysis: 'Definite articles — "the" sun, moon, stars (referring to the known entities).' },
  { fr: 'C\'est un livre, pas une revue.', en: 'It\'s a book, not a magazine.', analysis: '"un livre" = indefinite masculine. "une revue" = indefinite feminine.' },
  { fr: 'Je n\'ai pas de voiture mais j\'ai un vélo.', en: 'I don\'t have a car but I have a bicycle.', analysis: '"pas de voiture" = negation removes article. "un vélo" = affirmative keeps article.' },
]

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
}

export default function FrenchArticles() {
  const [activeType, setActiveType] = useState(0)
  const [tab, setTab] = useState('articles')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Articles | SayBonjour!" description="Master French articles — le/la/les, un/une/des, du/de la — with rules, contractions, common mistakes, and example sentences." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Articles</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les articles — definite, indefinite, and partitive — with real examples</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'articles', label: 'Article Types' },
            { id: 'mistakes', label: 'Common Mistakes' },
            { id: 'sentences', label: 'Example Sentences' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'articles' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {ARTICLE_TYPES.map((t, i) => (
                <button key={t.name} onClick={() => { setActiveType(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeType === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {t.name.split('—')[0].trim()}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-bold text-lg font-playfair text-gray-900 dark:text-cream-50">{ARTICLE_TYPES[activeType].name.split('—')[1].trim()}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[ARTICLE_TYPES[activeType].level]}`}>{ARTICLE_TYPES[activeType].level}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{ARTICLE_TYPES[activeType].desc}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {ARTICLE_TYPES[activeType].articles.map((a, i) => (
                  <motion.div key={a.form} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-3" onClick={() => addXP(2, 'grammar')}>
                    <div className="flex items-center gap-2 mb-1">
                      <SpeakButton text={`${a.form} — ${a.example}`} size="sm" />
                      <span className="font-bold text-xl font-mono text-burgundy-700 dark:text-burgundy-vibrant-300">{a.form}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{a.use}</p>
                    <p className="text-sm italic text-gray-600 dark:text-gray-300">{a.example} <span className="text-gray-400">({a.exEn})</span></p>
                    {a.extraEx && <p className="text-xs text-gray-400 mt-1 italic">Also: {a.extraEx}</p>}
                  </motion.div>
                ))}
              </div>

              {ARTICLE_TYPES[activeType].contractions.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Contractions (obligatory)</p>
                  <div className="space-y-2">
                    {ARTICLE_TYPES[activeType].contractions.map(c => (
                      <div key={c.result} className="flex items-center gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2">
                        <span className="font-mono text-sm text-gray-400">{c.original}</span>
                        <span className="text-gray-300">→</span>
                        <span className="font-bold font-mono text-burgundy-700 dark:text-burgundy-vibrant-300">{c.result}</span>
                        <SpeakButton text={c.example} size="sm" />
                        <span className="text-xs italic text-gray-500 dark:text-gray-400">{c.example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Key rule</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{ARTICLE_TYPES[activeType].note}</p>
              </div>

              {ARTICLE_TYPES[activeType].keyRules && (
                <ul className="space-y-1">
                  {ARTICLE_TYPES[activeType].keyRules.map((r, i) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                      <span className="text-burgundy-500 shrink-0 mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {tab === 'mistakes' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-800 dark:text-red-300 mb-2">
              These are the most common article errors made by English-speaking learners of French.
            </div>
            {COMMON_MISTAKES.map((m, i) => (
              <motion.div key={m.mistake} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'grammar')}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl px-3 py-2">
                    <p className="text-xs text-red-500 font-bold mb-1">✗ Wrong</p>
                    <p className="text-sm italic text-red-700 dark:text-red-300">{m.mistake}</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl px-3 py-2">
                    <p className="text-xs text-emerald-500 font-bold mb-1">✓ Correct</p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={m.correct} size="sm" />
                      <p className="text-sm italic text-emerald-700 dark:text-emerald-300">{m.correct}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {m.explanation}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'sentences' && (
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-2">
              Each sentence below shows articles in action — with grammatical analysis. Click a sentence to hear it spoken.
            </div>
            {SENTENCE_EXAMPLES.map((ex, i) => (
              <motion.div key={ex.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3"
                onClick={() => addXP(2, 'grammar')}>
                <SpeakButton text={ex.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-burgundy-700 dark:text-burgundy-vibrant-300">"{ex.fr}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.en}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {ex.analysis}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
