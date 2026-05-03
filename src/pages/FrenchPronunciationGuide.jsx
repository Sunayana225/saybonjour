import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, AlertCircle } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const SOUNDS = [
  {
    category: 'Nasal Vowels',
    desc: 'French has nasal vowels — air passes through both the nose and mouth simultaneously. There is no exact English equivalent. These are among the most distinctive French sounds.',
    sounds: [
      { symbol: 'an / en / am / em', example: 'dans, centre, chambre, temps, enfant', tip: 'Open mouth, tongue low, air through nose. Like "don" but more open. Do NOT pronounce the "n" at the end.' },
      { symbol: 'in / ain / ein / un / ym', example: 'vin, pain, plein, lundi, sympathique', tip: 'Shorter and more nasal than "an". Like "van" said with air through the nose. Lips barely spread.' },
      { symbol: 'on / om', example: 'bon, tomber, pont, nombril', tip: 'Round the lips as if saying "oh", then nasalise. "bon" sounds like a nasal "bo-n" — but the n is swallowed into nasality.' },
    ],
  },
  {
    category: 'Silent Letters',
    desc: 'Many French letters are silent — especially at the end of words. This is one of the most important rules for French pronunciation and one of the most misunderstood by beginners.',
    sounds: [
      { symbol: 'Final consonants (most)', example: 'vous [voo], est [eh], grand [grahn], chaud [shoh]', tip: 'Most final consonants are silent. Key exceptions: CaReFuL (C, R, F, L are usually pronounced at the end). "Avec" = avek ✓. "Paris" = paree ✓ (silent S).' },
      { symbol: 'Final -e (schwa or silent)', example: 'table [tabl], grande [grahnd], sage [sazh]', tip: 'Final -e is silent, but it makes the PRECEDING consonant audible. "grand" [grahn] vs "grande" [grahnd] — the d becomes audible.' },
      { symbol: '-s and -x plural endings', example: 'les amis [lay zamee], deux enfants [duh zahn-fahn]', tip: 'The s is silent — but causes LIAISON (see next section) before vowels. "Les amis" → the s links as /z/.' },
      { symbol: 'Silent -h', example: 'l\'homme [lom], l\'heure [luhr], l\'hôtel [lotel]', tip: 'Most French h is completely silent ("h muet") — elision and liaison occur. Some h is "aspiré" (h aspiré) — no elision: "le hibou" (not "l\'hibou").' },
    ],
  },
  {
    category: 'Liaison',
    desc: 'Liaison: when a normally silent final consonant is pronounced because the NEXT word begins with a vowel or silent h. It connects words smoothly — the hallmark of fluent French.',
    sounds: [
      { symbol: 'les enfants', example: '[lay zahn-fahn]', tip: 'The s of "les" becomes /z/ before "enfants" (vowel). Liaison is MANDATORY with articles + noun.' },
      { symbol: 'vous avez', example: '[voo zavay]', tip: 'The s of "vous" links to "avez". Mandatory liaison after pronouns + verb.' },
      { symbol: 'un ami', example: '[uhn nami]', tip: 'The n of "un" links to "ami". The n is pronounced.' },
      { symbol: 'est-il / sont-ils', example: '[ay til] / [son til]', tip: 'Inversion liaison — t links in questions. "Mange-t-il" = does he eat? (extra t inserted).' },
      { symbol: 'grand homme', example: '[grahn tom]', tip: 'The d of "grand" becomes /t/ before "homme". Liaison consonants change: -d → /t/.' },
    ],
  },
  {
    category: 'The French R',
    desc: 'The French "r" is one of the most difficult sounds for English speakers. It is pronounced deep in the throat — nothing like the English "r".',
    sounds: [
      { symbol: 'r (standard Parisian)', example: 'rouge, Paris, merci, rue', tip: 'A soft fricative at the back of the throat. Imagine LIGHTLY gargling water, or clearing your throat gently. Start by saying "h" very softly — then add voice.' },
      { symbol: 'rr (stronger)', example: 'terre, beurre, erreur, horrible', tip: 'Same position, slightly stronger. Practice with "Paris" — the r between the two syllables is your target.' },
      { symbol: 'Rolled r (southern France)', example: 'In Toulouse, Marseille, rural areas', tip: 'Southern France uses a trilled (rolled) r like Spanish — perfectly acceptable. Paris uses the uvular (back-of-throat) r. Both are correct.' },
    ],
  },
  {
    category: 'U vs OU',
    desc: 'One of the most important distinctions for English speakers. French has two distinct rounded vowels: "u" (like no English sound) and "ou" (like English "oo").',
    sounds: [
      { symbol: 'u [y]', example: 'tu, lune, rue, vu, sûr', tip: 'Round your lips as if saying "oo" (like "boot"), but SAY "ee". The result is neither — it\'s the French "u". Practise "tu" slowly: form "oo" shape, then say "ee".' },
      { symbol: 'ou [u]', example: 'tout, vous, courir, bonjour, loupe', tip: 'This is the standard "oo" sound as in "boot". Much easier for English speakers. Both lips round forward.' },
    ],
  },
  {
    category: 'Elision',
    desc: 'Elision: dropping the final vowel of a short word when the next word begins with a vowel or silent h. It is always obligatory — you cannot say "je aime" in standard French.',
    sounds: [
      { symbol: 'je → j\'', example: 'j\'aime, j\'ai, j\'habite, j\'arrive', tip: '"Je aime" is WRONG. Always j\'aime [zhem]. Obligatory before vowel.' },
      { symbol: 'le / la → l\'', example: 'l\'ami, l\'école, l\'hôtel, l\'eau', tip: 'Elision of le/la before vowel or silent h. "La amie" → "l\'amie".' },
      { symbol: 'de → d\'', example: 'd\'accord, d\'abord, d\'habitude, d\'ici', tip: '"De accord" is wrong. Always d\'accord [dakor]. "Par d\'ici" = from around here.' },
      { symbol: 'ne → n\'', example: 'n\'est pas, n\'avez pas, n\'importe pas', tip: '"Ne" elides before vowel: "ce n\'est pas" → [suh neh pah].' },
    ],
  },
  {
    category: 'Accent Pronunciation',
    desc: 'French accents are not decorative — they change pronunciation and sometimes meaning. A text without accents is like a text without punctuation.',
    sounds: [
      { symbol: 'é (accent aigu)', example: 'été, café, beauté, préfère, école', tip: 'A clear "ay" sound /e/. Like the English word "say" but shorter and crisper. Never diphthonged.' },
      { symbol: 'è / ê (grave / circumflex)', example: 'père, fête, être, après, crème', tip: 'An open "eh" sound /ɛ/. Like "bed" in English. Slightly more open than "é".' },
      { symbol: 'â / ô (circumflex on a/o)', example: 'château, forêt, côte, rôle', tip: 'Longer, more back vowels. "â" → open [ɑ]. "ô" → closed [o]. Subtle but audible to native speakers.' },
      { symbol: 'ç (cédille)', example: 'français, leçon, ça, garçon, façon', tip: 'Always /s/. "Français" = frahn-SAY. Without cedilla: C before a/o/u = /k/ (carotte, comment, cul).' },
    ],
  },
]

const MINIMAL_PAIRS = [
  { a: 'tu', b: 'tout', aEn: 'you', bEn: 'all / everything', aPron: '[ty]', bPron: '[tu]', tip: 'The classic u vs ou contrast. Round lips: "tu" uses French u [y]; "tout" uses ou [u].' },
  { a: 'vu', b: 'vous', aEn: 'seen (past participle)', bEn: 'you (formal/plural)', aPron: '[vy]', bPron: '[vu]', tip: 'Another u vs ou contrast. "Vu" = French u. "Vous" = ou /u/.' },
  { a: 'vin', b: 'vent', aEn: 'wine', bEn: 'wind', aPron: '[vɛ̃]', bPron: '[vɑ̃]', tip: '"vin" = nasal "in" sound. "vent" = nasal "an" sound (more open). Both nasal, different quality.' },
  { a: 'bon', b: 'beau', aEn: 'good', bEn: 'beautiful', aPron: '[bɔ̃]', bPron: '[bo]', tip: '"bon" = nasal "on". "beau" = open oral "oh". The nasalisation is the difference.' },
  { a: 'pain', b: 'pin', aEn: 'bread', bEn: 'pine tree', aPron: '[pɛ̃]', bPron: '[pɛ̃]', tip: 'Actually both are the same nasal vowel! Context distinguishes them. This pair catches learners out.' },
  { a: 'su', b: 'sous', aEn: '(past part. of savoir)', bEn: 'under', aPron: '[sy]', bPron: '[su]', tip: 'French u vs ou. "Su" = mouth like "oo" but say "ee". "Sous" = standard "oo".' },
  { a: 'cou', b: 'queue', aEn: 'neck', bEn: 'tail / queue', aPron: '[ku]', bPron: '[kø]', tip: '"cou" = "koo". "queue" = the French "eu" sound [ø] — round lips for "oo", say "eh".' },
  { a: 'le', b: 'la', aEn: 'the (masc)', bEn: 'the (fem)', aPron: '[lə]', bPron: '[la]', tip: '"le" = schwa [ə] — the neutral reduced vowel. "la" = open [a]. The schwa is unique to French.' },
  { a: 'son', b: 'sans', aEn: 'his/her', bEn: 'without', aPron: '[sɔ̃]', bPron: '[sɑ̃]', tip: '"son" = nasal "on" [õ]. "sans" = nasal "an" [ã]. More open for "sans".' },
  { a: 'poule', b: 'pool', aEn: 'hen', bEn: 'swimming pool', aPron: '[pul]', bPron: '[pul]', tip: 'Same pronunciation! Context is everything. "La poule" and "la piscine" are safer options.' },
]

const TIPS_FOR_ENGLISH = [
  { title: 'Don\'t stress the last syllable', detail: 'English is a stress-timed language — you stress random syllables. French uses EQUAL weight on all syllables, with a very light stress on the LAST syllable of a phrase. "BONjour" is wrong. "bonJOUR" — but barely. Keep each syllable even.' },
  { title: 'Nasal vowels: swallow the N', detail: 'The N/M in nasal vowels (an, in, on, un) is NOT pronounced as a consonant. The letter nasalises the vowel. "Pain" = [pɛ̃] — the n nasalises the vowel but disappears. Do NOT say "pan-n" or "peh-in".' },
  { title: 'French R: don\'t use English R', detail: 'The English "r" (retroflex) sounds foreign and comical to French ears. The French r is fricative — formed at the very back of the throat (uvula). Practice by saying "h" with your throat and adding voice. It takes weeks of practice but transforms your accent.' },
  { title: 'Link words together in French', detail: 'English separates words. French links them into breath groups (groupes rythmiques). "Les enfants arrivent" is not three separate words — it\'s one continuous sound: [lay zahn fahn tah reev]. Practice linking words across boundaries.' },
  { title: 'Final -e changes everything', detail: 'The mute -e at the end of a word is crucial. "Grand" [grahn] has a silent d. "Grande" [grahnd] — the d is now pronounced. "Chaud" = [shoh]. "Chaude" = [shohd]. This is how French marks gender in speech.' },
  { title: 'É vs È: keep them distinct', detail: '"É" (accent aigu) = closed /e/ — like "ay" in "say" but shorter. "È" (accent grave) = open /ɛ/ — like "e" in "bed". "Été" [eté] has both. This distinction matters: "le marché" vs "il marchait" are different.' },
]

export default function FrenchPronunciationGuide() {
  const [tab, setTab] = useState('sounds')
  const [activeSound, setActiveSound] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Pronunciation Guide | SayBonjour!" description="Master French pronunciation — nasal vowels, silent letters, liaison, the French R, u vs ou, elision, and tips for English speakers." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Pronunciation Guide</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La prononciation — master the sounds that make French unmistakably French</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'sounds', label: 'Sound Rules' },
            { id: 'pairs', label: 'Minimal Pairs' },
            { id: 'tips', label: 'Tips for English Speakers' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'sounds' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {SOUNDS.map((s, i) => (
                <button key={s.category} onClick={() => { setActiveSound(i); addXP(3, 'listening') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSound === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {s.category}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <h2 className="font-bold text-lg text-gray-900 dark:text-cream-50 font-playfair mb-1">{SOUNDS[activeSound].category}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{SOUNDS[activeSound].desc}</p>
              <div className="space-y-4">
                {SOUNDS[activeSound].sounds.map((s, i) => (
                  <motion.div key={s.symbol} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="border border-gray-100 dark:border-dark-warm-200 rounded-xl p-4" onClick={() => addXP(2, 'listening')}>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm bg-cream-100 dark:bg-dark-warm-200 px-2 py-0.5 rounded font-bold text-burgundy-700 dark:text-burgundy-vibrant-300">{s.symbol}</code>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <SpeakButton text={s.example.split(',')[0].trim()} size="sm" />
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">{s.example}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-lg px-3 py-2">
                      <p className="text-xs text-amber-700 dark:text-amber-300">💡 {s.tip}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'pairs' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-2">
              Minimal pairs differ by just ONE sound. Use these to train your ear — click the speak buttons to hear the difference.
            </div>
            {MINIMAL_PAIRS.map((pair, i) => (
              <motion.div key={pair.a} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(2, 'listening')}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <SpeakButton text={pair.a} size="sm" />
                      <span className="font-bold text-xl text-burgundy-700 dark:text-burgundy-vibrant-300 font-playfair">{pair.a}</span>
                    </div>
                    <p className="text-xs text-gray-400">{pair.aEn}</p>
                    {pair.aPron && <p className="text-xs text-gray-300 font-mono mt-0.5">{pair.aPron}</p>}
                  </div>
                  <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <SpeakButton text={pair.b} size="sm" />
                      <span className="font-bold text-xl text-burgundy-700 dark:text-burgundy-vibrant-300 font-playfair">{pair.b}</span>
                    </div>
                    <p className="text-xs text-gray-400">{pair.bEn}</p>
                    {pair.bPron && <p className="text-xs text-gray-300 font-mono mt-0.5">{pair.bPron}</p>}
                  </div>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {pair.tip}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'tips' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-2">
              These are the key things English speakers need to UN-learn to sound more French. Each tip addresses a deep habit from English.
            </div>
            {TIPS_FOR_ENGLISH.map((tip, i) => (
              <motion.div key={tip.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(4, 'listening')}>
                <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip.detail}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
