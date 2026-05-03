import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, ExternalLink, Mic2 } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const STATIONS = [
  {
    name: 'France Inter',
    genre: 'Talk / News / Culture',
    level: 'B2–C1',
    description: 'France\'s premier public radio station — news, culture, debate, and comedy. Rich standard French.',
    url: 'https://www.radiofrance.fr/franceinter/direct',
    why: 'Excellent articulation, journalistic French, diverse topics. Great for B2+ learners.',
    icon: '📻',
    tags: ['News', 'Culture', 'Podcasts'],
    tip: 'Tune in at 7am for the flagship morning show "Le 7/9" — clear, accessible journalism.',
  },
  {
    name: 'France Info',
    genre: 'News / Current affairs',
    level: 'B2–C2',
    description: 'Rolling 24-hour news station. Fast-paced, dense vocabulary, current affairs.',
    url: 'https://www.radiofrance.fr/franceinfo/direct',
    why: 'Essential for advanced learners — authentic news French at natural speed.',
    icon: '📰',
    tags: ['News', 'Live'],
    tip: 'The news updates repeat every 15 minutes — great for catching words you missed.',
  },
  {
    name: 'France Culture',
    genre: 'Arts / Philosophy / History',
    level: 'C1–C2',
    description: 'Intellectual radio covering arts, science, philosophy, and history. Rich vocabulary.',
    url: 'https://www.radiofrance.fr/franceculture/direct',
    why: 'Challenging but rewarding — great for learning academic and literary French registers.',
    icon: '🎭',
    tags: ['Culture', 'Podcasts', 'Academic'],
    tip: 'The podcast "Les Chemins de la Philosophie" is available for free download — dense but superb.',
  },
  {
    name: 'Chérie FM',
    genre: 'Pop music',
    level: 'A2–B1',
    description: 'Popular music station with French and international pop hits. Light, fun listening.',
    url: 'https://www.cheriefm.fr/direct',
    why: 'Great for beginners — music has predictable vocabulary and you can follow lyrics.',
    icon: '🎵',
    tags: ['Music', 'Pop'],
    tip: 'Listen to the DJ announcements between songs — short, clear French at a natural pace.',
  },
  {
    name: 'RTL',
    genre: 'Entertainment / News',
    level: 'B1–B2',
    description: 'Popular commercial radio with news, celebrity interviews, entertainment and music.',
    url: 'https://www.rtl.fr/direct',
    why: 'More casual register than France Inter — good middle ground for intermediate learners.',
    icon: '🎙️',
    tags: ['Entertainment', 'News'],
    tip: 'RTL\'s morning show "On refait le monde" features lively debate — great for colloquial French.',
  },
  {
    name: 'Radio Nova',
    genre: 'Music / Culture',
    level: 'B1–B2',
    description: 'Alternative and world music station with cultural programming. Relaxed tone.',
    url: 'https://www.nova.fr/radiolive/',
    why: 'Diverse music and laid-back presenters — good exposure to informal French.',
    icon: '🌍',
    tags: ['Music', 'Alternative'],
    tip: 'Nova\'s presenters use a warm, informal style — perfect for picking up contemporary French speech.',
  },
  {
    name: 'BFM TV Radio',
    genre: 'Breaking news',
    level: 'B2–C1',
    description: 'The French equivalent of rolling news TV/radio — fast headlines and live reports.',
    url: 'https://www.bfmtv.com/en-direct/',
    why: 'Authentic journalistic French at native speed — pushes listening comprehension.',
    icon: '⚡',
    tags: ['News', 'Live'],
    tip: 'BFM\'s ticker headlines at the bottom of the screen help you read while listening.',
  },
  {
    name: 'France Musique',
    genre: 'Classical music',
    level: 'All levels',
    description: 'Classical and contemporary music with cultured but accessible French commentary.',
    url: 'https://www.radiofrance.fr/francemusique/direct',
    why: 'Music is universal — listen for announcements and presenter commentary.',
    icon: '🎼',
    tags: ['Classical', 'Music'],
    tip: 'Concert announcements ("ce soir, à 20h…") are short and formulaic — great for beginners.',
  },
]

const PODCASTS = [
  {
    name: 'Français Authentique',
    host: 'Johan Tekfak',
    level: 'B1–C1',
    description: 'A hugely popular podcast for French learners — real, natural French at varying speeds. Johan also offers slowed, transcript versions of episodes.',
    url: 'https://www.francaisauthentique.com',
    episodes: '300+',
    icon: '🎓',
    tip: 'Start with the "Apprendre le français" series — designed specifically for immersive learning.',
  },
  {
    name: 'Coffee Break French',
    host: 'Radio Lingua',
    level: 'A1–B2',
    description: 'Scottish-produced podcast teaching French in bite-sized episodes with clear explanations. Structured as a complete course.',
    url: 'https://coffeebreakfrench.com',
    episodes: '200+',
    icon: '☕',
    tip: 'Perfect for commutes — each episode is 20–30 minutes and standalone.',
  },
  {
    name: 'InnerFrench',
    host: 'Hugo Cotton',
    level: 'B1–C1',
    description: 'Immersive content in French only — culture, society, and language topics spoken clearly at an intermediate pace.',
    url: 'https://innerfrench.com',
    episodes: '100+',
    icon: '🇫🇷',
    tip: 'Hugo speaks at a carefully measured pace — not too slow, not native speed. Ideal for B1+.',
  },
  {
    name: 'Le Monde Audio',
    host: 'Le Monde',
    level: 'C1–C2',
    description: 'Journalism from France\'s newspaper of record, read aloud — perfect for advanced learners who want to combine reading and listening.',
    url: 'https://www.lemonde.fr/podcasts/',
    episodes: 'Daily',
    icon: '📄',
    tip: 'Read the article first, then listen — the dual input dramatically improves comprehension.',
  },
  {
    name: 'Le Mouv\'',
    host: 'Radio France',
    level: 'A2–B2',
    description: 'Youth-oriented Radio France station featuring French and international music with young, relaxed presenters.',
    url: 'https://www.radiofrance.fr/lemouv/direct',
    episodes: 'Live',
    icon: '🎶',
    tip: 'The presenters use youth slang ("ouf", "chelou", "genre") — great for contemporary French.',
  },
  {
    name: 'Choses à Savoir',
    host: 'Olivier Turbat',
    level: 'B2–C1',
    description: 'Daily 5-minute podcast answering curious questions ("Did you know…?"). Clear, expressive French on fascinating topics.',
    url: 'https://www.chosesasavoir.com',
    episodes: '2,000+',
    icon: '🧠',
    tip: 'Each episode is just 5 minutes — perfect for daily practice. Topics include history, science, and culture.',
  },
]

const RADIO_VOCAB = [
  { fr: 'une émission', en: 'a programme / broadcast', note: '"Émettre" = to broadcast. "Une émission de radio" = a radio programme. "Émettre sur la fréquence de" = to broadcast on the frequency.' },
  { fr: 'un animateur / une animatrice', en: 'a presenter / host', note: '"Animateur" literally means "one who animates". "Un présentateur" is also used, especially for news.' },
  { fr: 'une chronique', en: 'a regular slot / column / feature', note: 'A recurring segment within a programme. "La chronique culture" = the culture slot. "Le chroniqueur" = the person who delivers it.' },
  { fr: 'un auditeur / une auditrice', en: 'a listener', note: '"Les auditeurs" = the listeners (the audience). "Les téléspectateurs" = TV viewers.' },
  { fr: 'les ondes', en: 'the airwaves (literally: waves)', note: '"Sur les ondes" = on the airwaves. "Les grandes ondes" = long wave. "La modulation de fréquence (FM)" = FM.' },
  { fr: 'en direct', en: 'live (broadcast)', note: '"En direct de Paris" = live from Paris. "En différé" = pre-recorded. "En direct" vs "en différé" is a crucial distinction.' },
  { fr: 'une rediffusion', en: 'a repeat broadcast', note: '"Ce programme est une rediffusion" = this is a repeat. Also: "un replay" (increasingly used for catch-up).' },
  { fr: 'une interview / un entretien', en: 'an interview', note: '"Interview" is the journalistic term. "Un entretien" is more formal and intimate. Both are common.' },
  { fr: 'la météo (du jour)', en: 'the weather forecast', note: '"La météo" is short for "la météorologie". "La météo est sur la une" = the forecast is on channel one.' },
  { fr: 'un bulletin d\'information', en: 'a news bulletin', note: '"Le flash info" or "les infos" colloquially. "Un flash d\'actualité" = a news flash (breaking).' },
  { fr: 'un jingle', en: 'a jingle / radio ident', note: 'The word "jingle" is used in French — borrowed directly from English. "La signature sonore" = audio logo.' },
  { fr: 'une fréquence', en: 'a frequency (FM/AM)', note: '"France Inter se diffuse sur 87.8" = France Inter broadcasts on 87.8. "Changer de fréquence" = to retune.' },
  { fr: 'un podcast', en: 'a podcast', note: 'The word "podcast" is fully adopted in French. "Balado" is the Canadian French term (from "baladeur" = walkman).' },
  { fr: 'le replay / le rattrapage', en: 'catch-up / on-demand listening', note: '"Radio France" offers "le podcast de rattrapage" for all its programmes. "Réécouter" = to listen again.' },
]

const LISTENING_TIPS = [
  {
    emoji: '🎯',
    title: 'The 15-Minute Daily Rule',
    desc: 'Research shows that 15 minutes of daily authentic French listening beats 2 hours once a week. Build a habit: France Inter\'s morning news while having breakfast, or a podcast on your commute. Consistency is everything.',
  },
  {
    emoji: '📝',
    title: 'Listen First, Then Read',
    desc: 'For news podcasts, try listening to the episode first without the transcript. Note words you catch. Then read the transcript and listen again. This trains your ear to decode natural speech patterns rather than relying on text.',
  },
  {
    emoji: '🔁',
    title: 'Shadow and Repeat',
    desc: 'Shadowing — repeating what a presenter says a half-second behind them — is one of the most powerful pronunciation tools. Use radio stations with clear speakers (France Inter, RFI Monde). It feels strange at first, but it works.',
  },
  {
    emoji: '📻',
    title: 'RFI — The Language Learner\'s Secret',
    desc: 'Radio France Internationale (RFI) broadcasts worldwide and has a dedicated "Journal en français facile" (Daily news in easy French) — 10 minutes of current news at a slower, clearer pace. Free daily at rfi.fr.',
  },
  {
    emoji: '🧠',
    title: 'Don\'t Try to Understand Everything',
    desc: 'Native French speech is fast and full of liaison, elision, and informal contractions. Beginning listeners should aim for the main topic and tone, not word-for-word comprehension. This tolerance for ambiguity is a learnable skill.',
  },
  {
    emoji: '🎵',
    title: 'Use Music for Pronunciation',
    desc: 'French pop music (Stromae, Angèle, Zaz) teaches liaison and rhythm naturally. Songs repeat the same phrases — ideal for absorption. Look up the lyrics on Genius.fr and read along while you listen.',
  },
]

const LEVEL_COLORS = {
  'A2–B1': 'bg-blue-100 text-blue-700',
  'B1–B2': 'bg-yellow-100 text-yellow-700',
  'B2–C1': 'bg-orange-100 text-orange-700',
  'C1–C2': 'bg-purple-100 text-purple-700',
  'B1–C1': 'bg-yellow-100 text-yellow-700',
  'A1–B2': 'bg-blue-100 text-blue-700',
  'All levels': 'bg-gray-100 text-gray-700',
  'B2–C2': 'bg-orange-100 text-orange-700',
}

export default function FrenchRadio() {
  const [tab, setTab] = useState('radio')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Radio & Podcasts | SayBonjour!" description="Discover the best French radio stations and podcasts for language learners at every level — with listening tips and radio vocabulary." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Radio & Podcasts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Écouter pour apprendre — tune in and learn</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-6">
          <strong>Listening is the fastest path to fluency.</strong> French radio and podcasts expose you to authentic speech at natural pace — liaison, elision, and rhythm all in one. Start at your level and push up gradually.
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: 'radio', label: '📻 Radio Stations' },
            { id: 'podcasts', label: '🎙️ Podcasts' },
            { id: 'vocab', label: '📖 Radio Vocabulary' },
            { id: 'tips', label: '💡 Listening Tips' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); addXP(3, 'listening') }}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'radio' && (
          <div className="space-y-4">
            {STATIONS.map((station, i) => (
              <motion.div key={station.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4"
                onClick={() => addXP(2, 'listening')}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burgundy-100 to-burgundy-200 dark:from-burgundy-vibrant-600/20 dark:to-burgundy-vibrant-600/10 flex items-center justify-center text-3xl shrink-0">
                  {station.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-bold text-gray-900 dark:text-cream-50">{station.name}</h2>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${LEVEL_COLORS[station.level] || 'bg-gray-100 text-gray-700'}`}>{station.level}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{station.genre}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{station.description}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">💡 {station.why}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic mb-3">🎯 Tip: {station.tip}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {station.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-dark-warm-200 border border-gray-200 dark:border-dark-warm-50 rounded-full text-gray-500 dark:text-gray-400">{tag}</span>
                    ))}
                    <a href={station.url} target="_blank" rel="noopener noreferrer"
                      onClick={e => { e.stopPropagation(); addXP(5, 'listening') }}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-600 text-white rounded-lg text-xs font-medium hover:bg-burgundy-700 transition-colors">
                      <ExternalLink size={12} /> Listen live
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'podcasts' && (
          <div className="space-y-4">
            {PODCASTS.map((pod, i) => (
              <motion.div key={pod.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4"
                onClick={() => addXP(2, 'listening')}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-900/10 flex items-center justify-center text-3xl shrink-0">
                  {pod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h2 className="font-bold text-gray-900 dark:text-cream-50">{pod.name}</h2>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${LEVEL_COLORS[pod.level] || 'bg-gray-100 text-gray-700'}`}>{pod.level}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">by {pod.host} · {pod.episodes} episodes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{pod.description}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic mb-3">🎯 Tip: {pod.tip}</p>
                  <a href={pod.url} target="_blank" rel="noopener noreferrer"
                    onClick={e => { e.stopPropagation(); addXP(5, 'listening') }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors">
                    <ExternalLink size={12} /> Visit website
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'vocab' && (
          <div className="space-y-2">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-3">
              💡 Knowing this vocabulary will help you understand what presenters are talking about when they discuss their own medium — radio meta-language.
            </div>
            {RADIO_VOCAB.map((item, i) => (
              <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3 cursor-pointer"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={item.fr} size="sm" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">— {item.en}</span>
                  </div>
                  {item.note && <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 italic">💡 {item.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'tips' && (
          <div className="space-y-4">
            {LISTENING_TIPS.map((tip, i) => (
              <motion.div key={tip.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4 cursor-pointer"
                onClick={() => addXP(4, 'listening')}>
                <span className="text-3xl shrink-0">{tip.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
