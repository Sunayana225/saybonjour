import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Film, Star } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const CINEMA_VOCAB = [
  { fr: 'un film', en: 'a film / movie' },
  { fr: 'un cinéma', en: 'a cinema' },
  { fr: 'un acteur / une actrice', en: 'an actor / actress' },
  { fr: 'un réalisateur / une réalisatrice', en: 'a director' },
  { fr: 'le scénario', en: 'the screenplay / script' },
  { fr: 'une séance', en: 'a screening / showing' },
  { fr: 'la séance de minuit', en: 'the midnight showing' },
  { fr: 'une salle obscure', en: 'a cinema / dark room', note: 'Poetic term for a movie theatre' },
  { fr: 'sous-titré(e)', en: 'subtitled' },
  { fr: 'en version originale (VO)', en: 'in original language (with subtitles)', note: 'French cinemas show both VO (original) and VF (dubbed) versions' },
  { fr: 'en version française (VF)', en: 'dubbed in French' },
  { fr: 'la bande-annonce', en: 'the trailer' },
  { fr: 'une critique / une review', en: 'a review / critique' },
  { fr: 'un chef-d\'œuvre', en: 'a masterpiece' },
  { fr: 'une sortie en salle', en: 'a cinema release' },
  { fr: 'le Festival de Cannes', en: 'the Cannes Film Festival', note: 'One of the world\'s most prestigious film festivals — held every May in Cannes' },
  { fr: 'la Palme d\'Or', en: 'the Palme d\'Or', note: 'Top prize at Cannes — the most coveted award in French cinema' },
  { fr: 'les César', en: 'the César Awards', note: 'France\'s equivalent of the Oscars — held each February' },
]

const GREAT_FRENCH_FILMS = [
  { title: 'Les Quatre Cents Coups', director: 'François Truffaut', year: '1959', genre: 'Drama', desc: 'A landmark of the French New Wave — the story of misunderstood teenage Antoine Doinel. One of the greatest films ever made.', level: 'B1' },
  { title: 'Amélie (Le Fabuleux Destin d\'Amélie Poulain)', director: 'Jean-Pierre Jeunet', year: '2001', genre: 'Romantic Comedy', desc: 'A whimsical Parisian romantic comedy beloved worldwide. Perfect for French learners — visually rich and full of Parisian life.', level: 'A2' },
  { title: 'La Haine', director: 'Mathieu Kassovitz', year: '1995', genre: 'Drama', desc: 'A visceral look at life in the Parisian suburbs (les banlieues) over 24 hours. Shot in black and white. Raw French vernacular.', level: 'B2' },
  { title: 'Les Misérables', director: 'Ladj Ly', year: '2019', genre: 'Drama', desc: 'Not the musical — a gripping modern drama set in the Paris suburbs, echoing Hugo\'s novel. Palme d\'Or jury prize.', level: 'B2' },
  { title: 'Intouchables', director: 'Nakache & Toledano', year: '2011', genre: 'Comedy-Drama', desc: 'The highest-grossing French film of all time. An unlikely friendship between a wealthy quadriplegic and his carer from the banlieue.', level: 'A2' },
  { title: 'Le Grand Bleu', director: 'Luc Besson', year: '1988', genre: 'Drama / Adventure', desc: 'A visually stunning film about competitive free-diving and the sea. A cult classic in France.', level: 'B1' },
  { title: 'Le Dîner de Cons', director: 'Francis Veber', year: '1998', genre: 'Comedy', desc: 'A sharp comedy of errors — a dinner where guests must bring an "idiot." Superb for learning colloquial French.', level: 'B1' },
  { title: 'Portrait de la Jeune Fille en Feu', director: 'Céline Sciamma', year: '2019', genre: 'Period Drama', desc: 'A masterful historical romance between a painter and her subject. Stunning and widely acclaimed.', level: 'B2' },
]

const LEVEL_COLORS = { A2: 'bg-blue-100 text-blue-700', B1: 'bg-yellow-100 text-yellow-700', B2: 'bg-orange-100 text-orange-700' }

const TALKING_ABOUT_FILMS = [
  { fr: 'Tu as vu… ?', en: 'Have you seen…?' },
  { fr: 'Je l\'ai trouvé(e) excellent(e) / nul(le).', en: 'I found it excellent / terrible.' },
  { fr: 'L\'histoire m\'a touché(e).', en: 'The story moved me.' },
  { fr: 'Les acteurs jouent bien.', en: 'The actors perform well.' },
  { fr: 'La mise en scène est remarquable.', en: 'The direction / staging is remarkable.' },
  { fr: 'Ça vaut le coup d\'aller le voir.', en: 'It\'s worth going to see it.' },
  { fr: 'Je te le recommande vivement.', en: 'I strongly recommend it to you.' },
  { fr: 'C\'est un peu lent au début mais ça vaut la peine.', en: 'It\'s a bit slow at the start but worth it.' },
]

export default function FrenchCinema() {
  const [tab, setTab] = useState('vocab')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Cinema | SayBonjour!" description="French cinema vocabulary, classic and contemporary French films, and phrases for talking about movies." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Cinema</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Le cinéma français — vocabulary, classic films, and how to talk about them</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[{ id: 'vocab', label: 'Cinema Vocab' }, { id: 'films', label: 'Must-See Films' }, { id: 'talking', label: 'Talking About Films' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'vocab' && (
          <div className="space-y-2">
            {CINEMA_VOCAB.map((item, i) => (
              <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={item.fr} size="sm" />
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                    <span className="text-xs text-gray-400">— {item.en}</span>
                  </div>
                  {item.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {item.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'films' && (
          <div className="space-y-4">
            {GREAT_FRENCH_FILMS.map((film, i) => (
              <motion.div key={film.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(4, 'vocabulary')}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <SpeakButton text={film.title} size="sm" />
                    <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair">{film.title}</h3>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${LEVEL_COLORS[film.level]}`}>{film.level}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{film.director} · {film.year} · {film.genre}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{film.desc}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'talking' && (
          <div className="space-y-3">
            {TALKING_ABOUT_FILMS.map((p, i) => (
              <motion.div key={p.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3">
                <SpeakButton text={p.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{p.fr}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.en}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
