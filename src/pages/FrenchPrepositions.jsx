import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const PREPOSITIONS = [
  {
    prep: 'à',
    meanings: ['at', 'to', 'in (cities)'],
    level: 'A1',
    examples: [
      { fr: 'Je suis à Paris.', en: 'I\'m in Paris.' },
      { fr: 'Je vais à l\'école.', en: 'I\'m going to school.' },
      { fr: 'Il arrive à midi.', en: 'He arrives at noon.' },
      { fr: 'une tasse à café', en: 'a coffee cup (intended use — vs tasse de café = cup of coffee)' },
      { fr: 'Je parle à Marie.', en: 'I\'m talking to Marie.' },
      { fr: 'C\'est facile à faire.', en: 'It\'s easy to do.' },
    ],
    note: 'à + le → au | à + les → aux. Used with cities (à Paris, à Londres). For purpose/intended use: "une machine à laver" = a washing machine.',
    tricky: 'à vs. de: "une tasse à café" (coffee cup — it\'s for coffee) vs. "une tasse de café" (a cup of coffee — it contains coffee). The preposition changes the meaning entirely.',
  },
  {
    prep: 'de',
    meanings: ['of', 'from', 'about', 'some'],
    level: 'A1',
    examples: [
      { fr: 'Je viens de France.', en: 'I come from France.' },
      { fr: 'Le livre de Marie.', en: 'Marie\'s book.' },
      { fr: 'Il parle de son travail.', en: 'He talks about his work.' },
      { fr: 'une tasse de café', en: 'a cup of coffee (contents)' },
      { fr: 'J\'ai besoin de toi.', en: 'I need you.' },
      { fr: 'C\'est difficile de choisir.', en: 'It\'s difficult to choose.' },
    ],
    note: 'de + le → du | de + les → des. Used with feminine and vowel-starting countries (de France, d\'Espagne, des États-Unis). With expressions of quantity: "beaucoup de", "peu de".',
    tricky: 'After a negation, du/de la/des → de: "Je mange du pain" → "Je ne mange pas de pain". This catches almost every learner out.',
  },
  {
    prep: 'en',
    meanings: ['in (months, years, countries)', 'by (transport)', 'made of'],
    level: 'A2',
    examples: [
      { fr: 'Je suis en France.', en: 'I\'m in France.' },
      { fr: 'Il va en voiture.', en: 'He goes by car.' },
      { fr: 'en été / en janvier / en 2024', en: 'in summer / in January / in 2024' },
      { fr: 'une table en bois', en: 'a wooden table (made of wood)' },
      { fr: 'Je serai là en dix minutes.', en: 'I\'ll be there in ten minutes.' },
      { fr: 'Elle est en train de lire.', en: 'She is in the process of reading.' },
    ],
    note: 'Use "en" with feminine countries (en France, en Espagne), months, seasons, years, materials, and transport without an article. "En train de + infinitif" = currently doing something.',
    tricky: '"En" vs "dans": "en France" = the country generally; "dans le Midi" = inside a specific region. "Il part dans dix minutes" (future — in exactly 10 mins) vs "en dix minutes" (it takes 10 minutes).',
  },
  {
    prep: 'dans',
    meanings: ['in (inside)', 'in (time — future count)', 'into'],
    level: 'A2',
    examples: [
      { fr: 'Le chat est dans la boîte.', en: 'The cat is in the box.' },
      { fr: 'Il revient dans une heure.', en: 'He\'ll be back in an hour (from now).' },
      { fr: 'Je suis dans le train.', en: 'I\'m on the train (physically inside it).' },
      { fr: 'dans les années 80', en: 'in the 80s (during that decade)' },
    ],
    note: '"Dans" = physically inside a defined space. "Il part dans cinq minutes" = he leaves in five minutes (from now, counting forward). Different from "en cinq minutes" (duration).',
    tricky: '"Dans" vs "en" for transport: "dans le train/bus" = you\'re physically inside the vehicle. "en train/en bus" = by train/bus (the mode). "Je suis dans le train" ≠ "Je voyage en train".',
  },
  {
    prep: 'sur',
    meanings: ['on', 'on top of', 'about (topics)', 'out of (fractions)'],
    level: 'A1',
    examples: [
      { fr: 'Le livre est sur la table.', en: 'The book is on the table.' },
      { fr: 'sur Internet', en: 'on the internet' },
      { fr: 'un livre sur la France', en: 'a book about France' },
      { fr: 'six étudiants sur dix', en: 'six students out of ten' },
      { fr: 'sur la droite / sur la gauche', en: 'on the right / on the left' },
    ],
    note: '"Sur" for surfaces (on a table), topics (a book about), proportions (6 out of 10), and directions (on the right).',
    tricky: '"Sur" vs "à": "à droite" = to the right; "sur la droite" = on the right (slightly more specific, indicating a position). Both are commonly used.',
  },
  {
    prep: 'sous',
    meanings: ['under', 'beneath', 'below'],
    level: 'A1',
    examples: [
      { fr: 'Le chien dort sous la table.', en: 'The dog sleeps under the table.' },
      { fr: 'sous la pluie', en: 'in the rain (lit. under the rain)' },
      { fr: 'sous pression', en: 'under pressure' },
      { fr: 'sous le règne de Napoléon', en: 'under Napoleon\'s reign' },
    ],
    note: 'Contrast: sur (on top) vs sous (underneath). Also used figuratively: "sous pression" = under pressure, "sous-entendu" = implied (lit. under-heard).',
    tricky: 'English "in the rain" = French "sous la pluie" (under the rain). French thinks of rain as overhead — something you\'re underneath. Same for "sous la neige", "sous le soleil".',
  },
  {
    prep: 'avec',
    meanings: ['with'],
    level: 'A1',
    examples: [
      { fr: 'Je viens avec toi.', en: 'I\'m coming with you.' },
      { fr: 'Il mange avec une fourchette.', en: 'He eats with a fork.' },
      { fr: 'avec plaisir !', en: 'with pleasure!' },
      { fr: 'avec soin', en: 'with care / carefully' },
    ],
    note: '"Avec" never contracts with articles. Contrast: sans (without). "Avec" can mean "accompanied by" or "using a tool/instrument".',
    tricky: '"Avec" doesn\'t always match English "with". "Parler avec quelqu\'un" = talk with someone. "Parler à quelqu\'un" = talk to someone. Both exist but mean slightly different things.',
  },
  {
    prep: 'sans',
    meanings: ['without'],
    level: 'A2',
    examples: [
      { fr: 'Sans toi, je suis perdu(e).', en: 'Without you, I\'m lost.' },
      { fr: 'un café sans sucre', en: 'a coffee without sugar' },
      { fr: 'sans hésiter', en: 'without hesitating' },
      { fr: 'sans abri', en: 'homeless (without shelter)' },
    ],
    note: 'After "sans", use infinitive (not gerund): "sans hésiter" = without hesitating. "Sans" often corresponds to English prefixes un-, -less, or dis-.',
    tricky: '"Sans" + infinitive = English "-ing without": "Il est parti sans dire au revoir" = he left without saying goodbye. Never use a gerund form after "sans" in French.',
  },
  {
    prep: 'pour',
    meanings: ['for', 'in order to', 'in favour of'],
    level: 'A1',
    examples: [
      { fr: 'C\'est un cadeau pour toi.', en: 'It\'s a gift for you.' },
      { fr: 'Je travaille pour vivre.', en: 'I work to live (in order to).' },
      { fr: 'pour toujours', en: 'forever' },
      { fr: 'Je suis pour cette idée.', en: 'I\'m in favour of this idea.' },
      { fr: 'partir pour une semaine', en: 'to leave for a week (duration of departure)' },
    ],
    note: '"Pour + infinitive" expresses purpose: pour apprendre = in order to learn. "Pour + duration" for trips: "je pars pour trois jours" = I\'m leaving for three days.',
    tricky: '"Pendant" vs "pour" for duration: "j\'ai étudié pendant deux heures" (I studied for two hours — completed) vs "je vais rester pour deux jours" (I\'m staying for two days — upcoming/planned).',
  },
  {
    prep: 'par',
    meanings: ['by', 'through', 'per', 'because of'],
    level: 'B1',
    examples: [
      { fr: 'Il a été écrit par Victor Hugo.', en: 'It was written by Victor Hugo.' },
      { fr: 'deux fois par semaine', en: 'twice a week' },
      { fr: 'par la fenêtre', en: 'through the window' },
      { fr: 'par politesse', en: 'out of politeness' },
      { fr: 'par curiosité', en: 'out of curiosity' },
    ],
    note: '"Par" used for passive voice agent, frequency (per week/day), movement through a space, and reason/motivation.',
    tricky: 'Passive voice: agent is "par" for actions but "de" for states/emotions: "Il est respecté DE tous" (he is respected by all) vs "Il a été arrêté PAR la police" (he was arrested by the police).',
  },
  {
    prep: 'avant',
    meanings: ['before (time)'],
    level: 'A2',
    examples: [
      { fr: 'Je me lève avant sept heures.', en: 'I get up before seven.' },
      { fr: 'avant de partir', en: 'before leaving' },
      { fr: 'avant tout', en: 'above all / first of all' },
    ],
    note: '"Avant de + infinitif" = before doing. "Avant que + subjonctif" = before (someone else) does. "Avant tout" = first and foremost.',
    tricky: '"Avant" (before in time) vs "devant" (in front of in space). "Avant la réunion" = before the meeting. "Devant la porte" = in front of the door.',
  },
  {
    prep: 'après',
    meanings: ['after (time)', 'behind (space — less common)'],
    level: 'A2',
    examples: [
      { fr: 'après le dîner', en: 'after dinner' },
      { fr: 'après avoir mangé', en: 'after eating (having eaten)' },
      { fr: 'l\'un après l\'autre', en: 'one after the other' },
    ],
    note: '"Après + avoir/être + past participle" = after having done. Very common: "après avoir mangé, je me suis reposé" = after eating, I rested.',
    tricky: '"Après" for time; "derrière" for space. English "after" covers both — French separates them. "Après la classe" = after class. "Derrière l\'école" = behind the school.',
  },
  {
    prep: 'chez',
    meanings: ['at/to someone\'s home or place', 'among (a group/culture)'],
    level: 'A1',
    examples: [
      { fr: 'Je vais chez Pierre.', en: 'I\'m going to Pierre\'s (home/place).' },
      { fr: 'Je suis chez moi.', en: 'I\'m at home.' },
      { fr: 'chez le médecin', en: 'at the doctor\'s' },
      { fr: 'C\'est courant chez les Français.', en: 'It\'s common among the French.' },
    ],
    note: '"Chez" has no exact English equivalent — it implies the home/territory/world of the person. "Chez" = at/to X\'s place, at X\'s shop, among X\'s people.',
    tricky: 'One of the most uniquely French prepositions. "Je rentre chez moi" = I\'m going home (to my home). There\'s no equivalent in English — "to my home" is longer and less elegant.',
  },
  {
    prep: 'pendant',
    meanings: ['during', 'for (completed duration)'],
    level: 'A2',
    examples: [
      { fr: 'pendant les vacances', en: 'during the holidays' },
      { fr: 'J\'ai attendu pendant deux heures.', en: 'I waited for two hours.' },
      { fr: 'pendant que tu dormais', en: 'while you were sleeping' },
    ],
    note: '"Pendant" for completed or specified durations in the past. Contrast with "depuis" (ongoing) and "pour" (planned/future).',
    tricky: 'The pendant/depuis/pour distinction is crucial: "J\'ai travaillé pendant trois ans" (I worked for three years — done). "Je travaille depuis trois ans" (I\'ve been working for three years — still going). "Je pars pour trois ans" (I\'m leaving for three years — future plan).',
  },
  {
    prep: 'depuis',
    meanings: ['since', 'for (ongoing duration)'],
    level: 'A2',
    examples: [
      { fr: 'J\'habite ici depuis cinq ans.', en: 'I\'ve been living here for five years.' },
      { fr: 'Il pleut depuis ce matin.', en: 'It has been raining since this morning.' },
      { fr: 'depuis longtemps', en: 'for a long time' },
    ],
    note: 'CRITICAL: "Depuis" + present tense (NOT past) for ongoing actions. "J\'attends depuis une heure" = I\'ve been waiting for an hour (and still am).',
    tricky: 'English "for" + perfect tense → French "depuis" + PRESENT tense. "I have lived here for 10 years" = "J\'habite ici depuis 10 ans". This is one of the most common mistakes French learners make.',
  },
  {
    prep: 'entre',
    meanings: ['between', 'among'],
    level: 'A2',
    examples: [
      { fr: 'entre Paris et Lyon', en: 'between Paris and Lyon' },
      { fr: 'entre amis', en: 'among friends' },
      { fr: 'entre nous', en: 'between us / between you and me' },
      { fr: 'Il est arrivé entre midi et deux.', en: 'He arrived between noon and two.' },
    ],
    note: '"Entre" for space between two things/people or time between two moments. "Entre nous" = confidentially between us.',
    tricky: '"Entre" vs "parmi": "entre" = between two specific things; "parmi" = among (more than two, within a larger group). "Entre les deux" = between the two. "Parmi les étudiants" = among the students.',
  },
]

const PLACES_GUIDE = [
  { label: 'Cities — use à', examples: [{ fr: 'à Paris', en: 'in/to Paris' }, { fr: 'à Londres', en: 'in/to London' }, { fr: 'à New York', en: 'in/to New York' }], rule: 'Always "à" for cities, regardless of gender.' },
  { label: 'Feminine countries — use en', examples: [{ fr: 'en France', en: 'in/to France' }, { fr: 'en Espagne', en: 'in/to Spain' }, { fr: 'en Italie', en: 'in/to Italy' }, { fr: 'en Angleterre', en: 'in/to England' }], rule: 'Most countries ending in -e are feminine: France, Espagne, Italie, Allemagne, Australie.' },
  { label: 'Masculine countries — use au / aux', examples: [{ fr: 'au Japon', en: 'in/to Japan' }, { fr: 'au Portugal', en: 'in/to Portugal' }, { fr: 'au Mexique', en: 'in/to Mexico' }, { fr: 'aux États-Unis', en: 'in/to the United States' }], rule: '"au" for singular masculine, "aux" for plural. Most countries not ending in -e are masculine.' },
  { label: 'Exception — vowel-starting masculine → en', examples: [{ fr: 'en Iran', en: 'in/to Iran' }, { fr: 'en Irak', en: 'in/to Iraq' }, { fr: 'en Israël', en: 'in/to Israel' }], rule: 'Masculine countries starting with a vowel use "en" to avoid the "au + vowel" collision.' },
  { label: 'French regions — use en (feminine) or dans le (masculine)', examples: [{ fr: 'en Normandie', en: 'in Normandy' }, { fr: 'en Bretagne', en: 'in Brittany' }, { fr: 'dans le Midi', en: 'in the South of France' }, { fr: 'dans le Périgord', en: 'in the Périgord' }], rule: 'Feminine regions: "en". Masculine regions: "dans le". Check if it starts with a vowel: "en Ardèche" (vowel).' },
  { label: 'From countries', examples: [{ fr: 'de France', en: 'from France (feminine)' }, { fr: 'du Japon', en: 'from Japan (masculine)' }, { fr: 'des États-Unis', en: 'from the United States (plural)' }, { fr: 'd\'Angleterre', en: 'from England (feminine)' }], rule: '"de" for feminine (de France), "du" for masculine (du Japon), "des" for plural (des États-Unis), "d\'" before a vowel.' },
]

const COMMON_MISTAKES = [
  {
    mistake: 'depuis + past tense',
    wrong: 'J\'ai habité ici depuis dix ans.',
    right: 'J\'habite ici depuis dix ans.',
    explanation: '"Depuis" with an ongoing action requires the PRESENT tense. The past tense + depuis implies the action has ended. Present + depuis = still happening now.',
  },
  {
    mistake: 'pendant/pour/depuis confusion',
    wrong: 'J\'ai étudié depuis deux heures. (if it\'s over)',
    right: 'J\'ai étudié pendant deux heures.',
    explanation: '"Pendant" = completed duration (I studied for 2h — finished). "Depuis" = ongoing since a point. "Pour" = planned duration (I\'m going for 2 weeks).',
  },
  {
    mistake: 'au vs. en for countries',
    wrong: 'Je vais en Japon.',
    right: 'Je vais au Japon.',
    explanation: 'Masculine singular countries take "au" (au Japon, au Canada, au Maroc). Only feminine or vowel-starting countries take "en".',
  },
  {
    mistake: 'Forgetting de → Ø after negation',
    wrong: 'Je ne mange pas du pain.',
    right: 'Je ne mange pas de pain.',
    explanation: 'After a negation, partitive articles (du, de la, de l\', des) become simple "de". "Je mange du pain" → "Je ne mange pas de pain".',
  },
  {
    mistake: 'Using "avant" when "devant" is needed',
    wrong: 'Il est devant sept heures.',
    right: 'Il est avant sept heures. / Il est devant la maison.',
    explanation: '"Avant" = before in TIME. "Devant" = in front of in SPACE. These are the French equivalents of two different English words.',
  },
  {
    mistake: 'chez + article instead of chez + person',
    wrong: 'Je vais chez la maison de Marc.',
    right: 'Je vais chez Marc.',
    explanation: '"Chez" already contains the idea of "home/place of" — never use an article after it. "Chez Marc" = to Marc\'s place.',
  },
  {
    mistake: 'après + infinitive instead of past infinitive',
    wrong: 'après manger',
    right: 'après avoir mangé',
    explanation: '"Après" requires the past infinitive (après avoir/être + past participle). "Avant de" uses a simple infinitive. "Après avoir mangé" = after having eaten.',
  },
]

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
}

export default function FrenchPrepositions() {
  const [activePrep, setActivePrep] = useState(0)
  const [tab, setTab] = useState('preps')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Prepositions | SayBonjour!" description="Master French prepositions — à, de, en, dans, sur, avec, pour, par, chez, depuis, pendant, entre — with examples, country guide, and common mistakes." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Prepositions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les prépositions — the small words that make all the difference</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'preps', label: 'All Prepositions' },
            { id: 'places', label: 'Countries & Places' },
            { id: 'mistakes', label: 'Common Mistakes' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'preps' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {PREPOSITIONS.map((p, i) => (
                <button key={p.prep} onClick={() => { setActivePrep(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-sm font-mono font-bold transition-colors ${activePrep === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {p.prep}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono font-bold text-3xl text-burgundy-700 dark:text-burgundy-vibrant-300">{PREPOSITIONS[activePrep].prep}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[PREPOSITIONS[activePrep].level]}`}>{PREPOSITIONS[activePrep].level}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{PREPOSITIONS[activePrep].meanings.join(' / ')}</p>

              <div className="space-y-2 mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Examples</p>
                {PREPOSITIONS[activePrep].examples.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5 cursor-pointer"
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
                <p className="text-sm text-amber-800 dark:text-amber-300">{PREPOSITIONS[activePrep].note}</p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">⚠️ Tricky distinction</p>
                <p className="text-sm text-red-800 dark:text-red-300">{PREPOSITIONS[activePrep].tricky}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setActivePrep(i => Math.max(0, i - 1))} disabled={activePrep === 0}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors">
                ← Previous
              </button>
              <button onClick={() => { setActivePrep(i => Math.min(PREPOSITIONS.length - 1, i + 1)); addXP(2, 'grammar') }} disabled={activePrep === PREPOSITIONS.length - 1}
                className="flex-1 py-2.5 rounded-xl bg-burgundy-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-burgundy-700 transition-colors">
                Next →
              </button>
            </div>
          </>
        )}

        {tab === 'places' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-2">
              <p className="text-sm text-amber-800 dark:text-amber-300">French uses different prepositions for different types of places — the gender and starting letter of the country/region determine which to use.</p>
            </div>
            {PLACES_GUIDE.map((group, i) => (
              <motion.div key={group.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 cursor-pointer"
                onClick={() => addXP(3, 'grammar')}>
                <h3 className="font-bold text-gray-900 dark:text-cream-50 mb-2">{group.label}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.examples.map(ex => (
                    <div key={ex.fr} className="flex items-center gap-1.5 bg-cream-50 dark:bg-dark-warm-200 rounded-lg px-3 py-1.5">
                      <SpeakButton text={ex.fr} size="sm" />
                      <div>
                        <span className="text-sm font-medium text-burgundy-700 dark:text-burgundy-vibrant-300">{ex.fr}</span>
                        <span className="text-xs text-gray-400 ml-1">— {ex.en}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {group.rule}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'mistakes' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The most common preposition errors made by English speakers — learn these and you\'ll sound immediately more natural.</p>
            {COMMON_MISTAKES.map((item, i) => (
              <motion.div key={item.mistake} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 cursor-pointer"
                onClick={() => addXP(4, 'grammar')}>
                <h3 className="font-bold text-gray-800 dark:text-cream-50 mb-3">⚠️ {item.mistake}</h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl px-3 py-2">
                    <p className="text-xs font-bold text-red-500 mb-1">✗ Wrong</p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={item.wrong} size="sm" />
                      <p className="text-sm italic text-red-700 dark:text-red-400">{item.wrong}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700 rounded-xl px-3 py-2">
                    <p className="text-xs font-bold text-emerald-600 mb-1">✓ Correct</p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={item.right} size="sm" />
                      <p className="text-sm italic text-emerald-700 dark:text-emerald-400">{item.right}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.explanation}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
