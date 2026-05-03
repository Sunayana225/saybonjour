import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, ChevronDown, ChevronUp, Star } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const FILMS = [
  {
    title: 'Amélie (Le Fabuleux Destin d\'Amélie Poulain)',
    year: 2001,
    director: 'Jean-Pierre Jeunet',
    genre: 'Comédie romantique',
    level: 'B1',
    emoji: '🌸',
    summary: 'Amélie, a shy Montmartre waitress, secretly orchestrates the lives of others to bring them happiness while struggling to find her own. Visually stunning, whimsical, and uniquely French.',
    why: 'Essential French cultural touchstone. Accessible language for learners. Iconic Montmartre setting. Audrey Tautou\'s performance is a masterclass in wordless expression.',
    vocab: [{ fr: 'fabuleux/fabuleuse', en: 'fabulous' }, { fr: 'le destin', en: 'destiny / fate' }, { fr: 'orchestrer', en: 'to orchestrate' }, { fr: 'timide', en: 'shy' }],
  },
  {
    title: 'Les Intouchables',
    year: 2011,
    director: 'Olivier Nakache & Éric Toledano',
    genre: 'Comédie dramatique',
    level: 'B1',
    emoji: '🤝',
    summary: 'Philippe, a wealthy tetraplegic aristocrat, hires Driss, a young man from a housing estate, as his carer. Based on a true story. One of France\'s highest-grossing films ever (20+ million viewers in France alone).',
    why: 'Hilarious, moving, and a perfect window into French class and culture. Clear, modern French dialogue with some banlieue slang. Outstanding for intermediate learners.',
    vocab: [{ fr: 'intouchable', en: 'untouchable' }, { fr: 'tétraplégique', en: 'tetraplegic' }, { fr: 'la banlieue', en: 'the suburb / housing estate' }, { fr: 'l\'auxiliaire de vie', en: 'a live-in carer' }],
  },
  {
    title: 'La Haine',
    year: 1995,
    director: 'Mathieu Kassovitz',
    genre: 'Drame',
    level: 'C1',
    emoji: '🗺️',
    summary: 'Twenty-four hours in the lives of three young men from the Parisian banlieue following a riot. Shot in stunning black and white. A landmark of French cinema — still profoundly relevant 30 years later.',
    why: 'Raw, powerful, and essential for understanding French social issues. Warning: heavy verlan, argot, and extremely colloquial speech throughout. C1 minimum recommended.',
    vocab: [{ fr: 'la haine', en: 'hate / hatred' }, { fr: 'le banlieusard', en: 'someone from the suburbs' }, { fr: 'le verlan', en: 'French back-slang (reversed words)' }, { fr: 'un émeute', en: 'a riot' }],
  },
  {
    title: 'Bienvenue chez les Ch\'tis',
    year: 2008,
    director: 'Dany Boon',
    genre: 'Comédie',
    level: 'B2',
    emoji: '🏔️',
    summary: 'A post office manager is transferred to northern France as punishment — and discovers its unexpectedly warm-hearted community. Features the genuine Ch\'ti regional dialect of Picardie.',
    why: 'France\'s highest-grossing domestic film ever (20.5m tickets). Great for discovering regional French accents, stereotypes, and the gap between French preconceptions and reality.',
    vocab: [{ fr: 'le Ch\'ti', en: 'person / dialect from northern France' }, { fr: 'la mutation', en: 'a transfer / posting' }, { fr: 'le dépaysement', en: 'feeling of being in unfamiliar surroundings' }, { fr: 'l\'accent', en: 'accent' }],
  },
  {
    title: 'Portrait de la Jeune Fille en Feu',
    year: 2019,
    director: 'Céline Sciamma',
    genre: 'Drame historique / Romance',
    level: 'B2',
    emoji: '🎨',
    summary: 'An artist is commissioned to paint a wedding portrait of a young Breton woman without her knowledge. Set in 18th-century Brittany. Won Best Screenplay at Cannes. Critically acclaimed worldwide.',
    why: 'Beautifully spoken, measured French — ideal for intermediate-advanced learners. Rich vocabulary around art, observation, and identity. Outstanding cinematography.',
    vocab: [{ fr: 'le portrait', en: 'portrait' }, { fr: 'le pinceau', en: 'paintbrush' }, { fr: 'le regard', en: 'the gaze / look' }, { fr: 'le consentement', en: 'consent' }],
  },
  {
    title: 'Le Dîner de Cons',
    year: 1998,
    director: 'Francis Veber',
    genre: 'Comédie',
    level: 'B2',
    emoji: '😂',
    summary: 'A Parisian publisher who hosts cruel dinner parties where guests bring an idiot meets his match when he invites a passionate collector of matchstick models. A timeless French farce with extraordinary wordplay.',
    why: 'Brilliant wordplay, fast dialogue, and a masterclass in French comedy writing. The humour relies on misunderstanding and social class — deeply revealing of French culture.',
    vocab: [{ fr: 'un con / une conne', en: 'an idiot (very colloquial)' }, { fr: 'un dîner', en: 'a dinner' }, { fr: 'une allumette', en: 'a matchstick' }, { fr: 'se moquer de', en: 'to mock / make fun of' }],
  },
  {
    title: 'Un Prophète',
    year: 2009,
    director: 'Jacques Audiard',
    genre: 'Drame criminel',
    level: 'C1',
    emoji: '⚖️',
    summary: 'A young Franco-Arab man enters prison as a small-time criminal and emerges six years later as a powerful figure. Grand Prix winner at Cannes. Considered one of the greatest French films of the 21st century.',
    why: 'A masterpiece of modern French cinema. Exposes France\'s prison system, ethnic tensions, and organised crime. Multiple languages used (French, Corsican, Arabic) — complex but rewarding.',
    vocab: [{ fr: 'la prison', en: 'prison' }, { fr: 'le détenu', en: 'a prisoner / inmate' }, { fr: 'le clan', en: 'a clan / gang' }, { fr: 'la liberté conditionnelle', en: 'parole' }],
  },
  {
    title: 'The Artist',
    year: 2011,
    director: 'Michel Hazanavicius',
    genre: 'Comédie romantique / Muet',
    level: 'A2',
    emoji: '🎬',
    summary: 'A silent black-and-white film set in 1920s Hollywood, about a fading silent film star and a rising young actress. Won 5 Oscars including Best Picture — the first French film to do so. Almost entirely without dialogue.',
    why: 'The perfect film for absolute beginners — almost no spoken French! The few dialogue cards are simple. The film is an extraordinary technical and artistic achievement. A love letter to cinema.',
    vocab: [{ fr: 'muet/muette', en: 'silent / mute' }, { fr: 'le cinéma muet', en: 'silent cinema' }, { fr: 'la vedette', en: 'a (film) star' }, { fr: 'le déclin', en: 'decline' }],
  },
  {
    title: 'Deux Jours, Une Nuit',
    year: 2014,
    director: 'Jean-Pierre & Luc Dardenne',
    genre: 'Drame social',
    level: 'B1',
    emoji: '💼',
    summary: 'Sandra (Marion Cotillard) has one weekend to convince her colleagues to vote for her to keep her job rather than take a bonus. Based on real economic pressures facing workers. Palme d\'Or nominee.',
    why: 'Clear, natural, modern spoken French. Deeply human story about solidarity, dignity and economic hardship. Marion Cotillard speaks in understated, accessible French throughout.',
    vocab: [{ fr: 'la solidarité', en: 'solidarity' }, { fr: 'la prime', en: 'a bonus' }, { fr: 'licencier', en: 'to make redundant / lay off' }, { fr: 'convaincre', en: 'to convince' }],
  },
  {
    title: 'Ma Nuit Chez Maud',
    year: 1969,
    director: 'Éric Rohmer',
    genre: 'Drame philosophique',
    level: 'C1',
    emoji: '🕯️',
    summary: 'A Catholic engineer spends the night in an apartment with a divorcée, discussing morality, chance, and faith. Part of Rohmer\'s "Six Moral Tales". Nominated for two Oscars. Dazzlingly intelligent.',
    why: 'Extraordinary for advanced learners — dense, literary French full of philosophical vocabulary. Conversations range across Pascal, religion, love and moral choice. Slow cinema at its finest.',
    vocab: [{ fr: 'la morale', en: 'morality' }, { fr: 'le hasard', en: 'chance / coincidence' }, { fr: 'la foi', en: 'faith' }, { fr: 'le dilemme', en: 'a dilemma' }],
  },
  {
    title: 'Les Misérables (2019)',
    year: 2019,
    director: 'Ladj Ly',
    genre: 'Drame social',
    level: 'B2',
    emoji: '🏙️',
    summary: 'A new police officer joins a unit in Montfermeil (Victor Hugo\'s setting for Les Misérables) and witnesses an incident that spirals out of control. César Award for Best Film. Oscar-nominated.',
    why: 'A stunning portrait of contemporary France — police, banlieue youth, ethnic community tensions. Filmed on location in real housing estates. Powerful, urgent French cinema.',
    vocab: [{ fr: 'la banlieue', en: 'suburb / housing estate' }, { fr: 'le maintien de l\'ordre', en: 'law enforcement / keeping order' }, { fr: 'l\'injustice', en: 'injustice' }, { fr: 'la bavure policière', en: 'police blunder / brutality' }],
  },
]

const CINEMA_VOCAB = [
  { fr: 'un film', en: 'a film / movie', note: '"Regarder un film" = to watch a film. "Tourner un film" = to shoot a film.' },
  { fr: 'une séance', en: 'a screening / showing', note: '"La séance de 20h" = the 8pm showing. "La prochaine séance" = the next showing.' },
  { fr: 'la salle (de cinéma)', en: 'cinema / screen room', note: '"Une multiplex" = a multiplex with many screens. "Un cinéma d\'art et essai" = an arthouse cinema.' },
  { fr: 'la version originale (VO)', en: 'original version (with subtitles)', note: 'Always choose VO for language learning! "VOSTF" = version originale sous-titrée en français.' },
  { fr: 'la version française (VF)', en: 'dubbed French version', note: 'French dubbing is high quality. Many French people grew up watching Hollywood films in VF only.' },
  { fr: 'les sous-titres', en: 'subtitles', note: '"Sous-titres en français" = French subtitles. "VOSTF" = original language, French subtitles — ideal for learners.' },
  { fr: 'un réalisateur / une réalisatrice', en: 'a film director', note: '"Réaliser" = to direct. "La réalisation" = direction. "Auteur cinema" = director-as-author — a French concept.' },
  { fr: 'un acteur / une actrice', en: 'an actor / actress', note: '"Un acteur de renom" = a well-known actor. "Un second rôle" = a supporting role. "Un figurant" = an extra.' },
  { fr: 'la bande-annonce', en: 'the trailer', note: '"Regarder la bande-annonce" = to watch the trailer. "La BA" = informal abbreviation.' },
  { fr: 'le scénario', en: 'the screenplay / script', note: '"Écrire le scénario" = to write the script. "Un scénariste" = a screenwriter. "La table ronde de scénaristes" = writers\' room.' },
  { fr: 'la bande originale', en: 'the original soundtrack', note: '"La BO" = informal. "La musique du film" = film music. "Le compositeur" = the composer.' },
  { fr: 'le festival de Cannes', en: 'Cannes Film Festival', note: 'The world\'s most prestigious film festival — held every May since 1946. "La Croisette" = the famous promenade.' },
  { fr: 'la Palme d\'Or', en: 'top prize at Cannes', note: 'Literally "golden palm". The ultimate honour in world cinema. France\'s Jeunet, Haneke, and Dardenne brothers have won multiple Palmes.' },
  { fr: 'les Césars', en: 'France\'s national film awards', note: 'The French equivalent of the Oscars, awarded since 1976. Named after sculptor César. Held at the Olympia, Paris.' },
  { fr: 'un chef-d\'œuvre', en: 'a masterpiece', note: '"Un chef-d\'œuvre du cinéma français" = a masterpiece of French cinema. "Ce film est un chef-d\'œuvre absolu" = this film is an absolute masterpiece.' },
  { fr: 'la Nouvelle Vague', en: 'the French New Wave', note: '1950s–60s movement (Godard, Truffaut, Varda, Chabrol) that revolutionised world cinema with handheld cameras, improvisation, and social realism.' },
  { fr: 'un film d\'auteur', en: 'an auteur / arthouse film', note: '"Le cinéma d\'auteur" = director-driven, personal cinema. France invented this concept — the director is the "author" of the film.' },
  { fr: 'la critique', en: 'the (film) review / criticism', note: '"Les critiques" = critics. "Les Cahiers du Cinéma" = France\'s legendary film criticism magazine, founded 1951.' },
]

const CINEMA_PHRASES = [
  { fr: 'Tu as vu le dernier film de Sciamma ?', en: 'Have you seen Sciamma\'s latest film?', note: '"Le dernier film de" = the latest film by (a director). "As-tu vu..." = formal. "T\'as vu..." = very casual.' },
  { fr: 'Je préfère les films en version originale sous-titrée.', en: 'I prefer films in original version with subtitles.', note: '"VOSTF" = VO sous-titrée en français. The best way to learn French from films.' },
  { fr: 'Ce film m\'a vraiment touché(e) — je n\'ai pas pu retenir mes larmes.', en: 'This film really moved me — I couldn\'t hold back my tears.', note: '"Toucher" = to move emotionally. "Retenir ses larmes" = to hold back tears. "J\'ai pleuré comme une madeleine" = I cried my eyes out.' },
  { fr: 'L\'actrice principale est absolument époustouflante.', en: 'The lead actress is absolutely breathtaking.', note: '"Époustouflant(e)" = breathtaking / mind-blowing. "La performance est remarquable" = the performance is remarkable.' },
  { fr: 'Je voudrais deux places pour la séance de 19h, s\'il vous plaît.', en: 'Two tickets for the 7pm showing, please.', note: '"Deux places" = two seats/tickets. "La séance de 19h" = the 7pm showing.' },
  { fr: 'C\'est quoi le film du moment dont tout le monde parle ?', en: 'What\'s the film everyone\'s talking about right now?', note: '"Du moment" = of the moment / right now. "Dont tout le monde parle" = that everyone\'s talking about.' },
  { fr: 'Ce réalisateur a un style vraiment reconnaissable.', en: 'This director has a really recognisable style.', note: '"Un style reconnaissable" = a recognisable style. "La patte du réalisateur" = the director\'s signature touch.' },
  { fr: 'La bande originale est magnifique — ça colle parfaitement aux images.', en: 'The soundtrack is beautiful — it fits the images perfectly.', note: '"Coller à" = to fit/match perfectly. "Les images" = the visuals/footage.' },
  { fr: 'Il paraît que c\'est basé sur une histoire vraie.', en: 'Apparently it\'s based on a true story.', note: '"Il paraît que" = apparently / it seems that. "Basé sur une histoire vraie" = based on a true story.' },
  { fr: 'Je n\'ai pas accroché — le rythme était trop lent pour moi.', en: 'It didn\'t grab me — the pace was too slow for me.', note: '"Ne pas accrocher" = not to get into it / not to be grabbed. "Le rythme" = the pace/rhythm of the film.' },
]

const LEVEL_COLORS = {
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  B2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  C1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
}

export default function FrenchMovies() {
  const [expanded, setExpanded] = useState(null)
  const [tab, setTab] = useState('films')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Films | SayBonjour!" description="Discover essential French films with language notes, plot summaries, and vocabulary — from Amélie to La Haine." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Films</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Le cinéma français — essential films for learners and culture lovers, from A2 to C1</p>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: 'films', label: 'Essential Films' },
            { id: 'vocab', label: 'Cinema Vocabulary' },
            { id: 'phrases', label: 'Film Phrases' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'films' && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 text-sm text-amber-800 dark:text-amber-300">
              💡 Level guide: <strong>A2</strong> = beginner friendly · <strong>B1</strong> = intermediate · <strong>B2</strong> = upper-intermediate · <strong>C1</strong> = advanced. Always watch in VO (original version) for maximum learning.
            </div>
            <div className="space-y-4">
              {FILMS.map((film, i) => {
                const isOpen = expanded === film.title
                return (
                  <motion.div key={film.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 overflow-hidden">
                    <button onClick={() => { setExpanded(isOpen ? null : film.title); if (!isOpen) addXP(5, 'vocabulary') }}
                      className="w-full text-left px-6 py-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-700/20 dark:to-gray-700/20 flex items-center justify-center text-3xl shrink-0">{film.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${LEVEL_COLORS[film.level]}`}>{film.level}</span>
                          <span className="text-xs text-gray-400 italic">{film.genre}</span>
                          <span className="text-xs text-gray-400">({film.year})</span>
                        </div>
                        <h2 className="font-bold text-gray-900 dark:text-cream-50 font-playfair text-sm leading-tight">{film.title}</h2>
                        <p className="text-xs text-gray-400">Dir. {film.director}</p>
                      </div>
                      {isOpen ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-6 pb-6 border-t border-gray-50 dark:border-dark-warm-200 pt-4 space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{film.summary}</p>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-3 text-sm">
                              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Why watch it for French?</p>
                              <p className="text-emerald-800 dark:text-emerald-300">{film.why}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Key vocabulary</p>
                              <div className="flex flex-wrap gap-2">
                                {film.vocab.map(v => (
                                  <div key={v.fr} className="flex items-center gap-1.5 bg-cream-50 dark:bg-dark-warm-200 rounded-lg px-3 py-1.5"
                                    onClick={() => addXP(2, 'vocabulary')}>
                                    <SpeakButton text={v.fr} size="sm" />
                                    <span className="text-sm text-burgundy-700 dark:text-burgundy-vibrant-300 font-medium">{v.fr}</span>
                                    <span className="text-xs text-gray-400">— {v.en}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {tab === 'vocab' && (
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
            <h2 className="font-semibold text-gray-800 dark:text-cream-50 mb-5">Cinema vocabulary — Le vocabulaire du cinéma</h2>
            <div className="space-y-3">
              {CINEMA_VOCAB.map((v, i) => (
                <motion.div key={v.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 border-b border-gray-50 dark:border-dark-warm-200 pb-3 last:border-0"
                  onClick={() => addXP(2, 'vocabulary')}>
                  <SpeakButton text={v.fr} size="sm" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{v.fr}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">— {v.en}</span>
                    </div>
                    {v.note && <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 italic">💡 {v.note}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {CINEMA_PHRASES.map((phrase, i) => (
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
      </div>
    </div>
  )
}
