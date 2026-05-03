import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const ACCENT_TYPES = [
  {
    accent: 'é — Accent aigu',
    symbol: '´',
    sound: 'Closed "ay" sound — like "say" but shorter and crisper. Never a diphthong.',
    words: [
      { fr: 'été', en: 'summer' },
      { fr: 'café', en: 'coffee' },
      { fr: 'beauté', en: 'beauty' },
      { fr: 'société', en: 'society' },
      { fr: 'passé', en: 'past (adj)' },
      { fr: 'télévision', en: 'television' },
    ],
    rules: [
      'Only appears on the letter "e" — never on a, o, u, i',
      'Always produces the closed /e/ sound — like "say" but shorter',
      'Very common on past participles of -ER verbs: mangé, parlé, aimé, arrivé',
      'Used to differentiate: "a" (has) vs "à" (at/to) — accent changes meaning',
      'Forms past tense: "j\'ai parlé" (I spoke). "Nous avons mangé" (We ate)',
    ],
  },
  {
    accent: 'è — Accent grave (on e)',
    symbol: '`',
    sound: 'Open "eh" sound — like "bed". More open than é. Also on à and où (meaning change only).',
    words: [
      { fr: 'père', en: 'father' },
      { fr: 'mère', en: 'mother' },
      { fr: 'frère', en: 'brother' },
      { fr: 'crème', en: 'cream' },
      { fr: 'après', en: 'after' },
      { fr: 'problème', en: 'problem' },
    ],
    rules: [
      'On "e": produces the open /ɛ/ sound — as in "bed" or "set"',
      'On "a": à (preposition "at/to") vs a (verb "has") — no pronunciation change, just meaning',
      'On "u": où (where) vs ou (or) — no pronunciation change, just meaning',
      'Appears before a double consonant in some verb forms: il lève, il mène',
      '"À" is one of the most used French prepositions — never forget the accent!',
    ],
  },
  {
    accent: 'ê — Accent circonflexe (on e)',
    symbol: '^',
    sound: 'Open "eh" sound — similar to è, often slightly longer. Also appears on â, î, ô, û.',
    words: [
      { fr: 'être', en: 'to be' },
      { fr: 'forêt', en: 'forest' },
      { fr: 'fête', en: 'party / feast' },
      { fr: 'même', en: 'same / even' },
      { fr: 'tête', en: 'head' },
      { fr: 'fenêtre', en: 'window' },
    ],
    rules: [
      'The circumflex often marks a historic "s" that was dropped: forêt = "forest", fête = "feast"',
      'On â: a more back/open sound than simple "a". "Château" vs "chaton"',
      'On ô: a closed/rounded "oh". "Rôle", "côte", "drôle"',
      '"dû" (past part. of devoir) vs "du" (partitive article) — meaning changed',
      '"sûr" (certain/safe) vs "sur" (on/over) — meaning changed by circumflex',
    ],
  },
  {
    accent: 'ç — Cédille',
    symbol: '¸',
    sound: 'Always an /s/ sound — never /k/ — before a, o, or u.',
    words: [
      { fr: 'français', en: 'French' },
      { fr: 'ça', en: 'that / it (informal)' },
      { fr: 'garçon', en: 'boy / waiter' },
      { fr: 'façon', en: 'way / manner' },
      { fr: 'leçon', en: 'lesson' },
      { fr: 'reçu', en: 'received' },
    ],
    rules: [
      'Only on the letter "c" — never on any other letter',
      'Used before a, o, u to make "c" sound as /s/ (otherwise c = /k/ before a/o/u)',
      'Not needed before e, i, y — c is already /s/ there: "ceci" [suh-see], "cire" [seer]',
      'Very common in -cer verb conjugations: "je reçois", "il reçoit", "vous reçûtes"',
      'Common in nationality/language adjectives: "français", "provençal", "alsacien"',
    ],
  },
  {
    accent: 'ë, ï, ü — Tréma',
    symbol: '¨',
    sound: 'The vowel carrying the tréma is pronounced SEPARATELY from the preceding vowel — they do not merge.',
    words: [
      { fr: 'Noël', en: 'Christmas', note: 'No-EL — the ë is separate from the o' },
      { fr: 'naïf / naïve', en: 'naive', note: 'Na-EEF — the ï is separate from the a' },
      { fr: 'Citroën', en: 'Citroën (brand)', note: 'Sit-ro-EN — the ë separates from o' },
      { fr: 'ambiguë', en: 'ambiguous (fem)', note: 'The ë is sounded separately from u' },
      { fr: 'coïncidence', en: 'coincidence', note: 'Co-in-cidence — not "coin-cidence"' },
    ],
    rules: [
      'The tréma means: this vowel is pronounced separately from the previous vowel',
      '"oë" without tréma = one sound; with tréma = two sounds: "No-ël" not "Noel"',
      'Common in proper names: Citroën, Noël, Joëlle, Maëlys',
      'The 2016 French spelling reform moved some trémas (oignon→ognon) but usage is mixed',
      'Very common in borrowed words and names from Latin and Greek roots',
    ],
  },
]

const ACCENT_MISTAKES = [
  {
    wrong: 'Je suis alle au marche.',
    right: 'Je suis allé au marché.',
    explain: 'Without the accents, "allé" and "marché" lose their pronunciation markers — and the past participle ending on -é is invisible. Accents are essential in written French.',
    level: 'Common',
  },
  {
    wrong: 'Il a mange une pomme.',
    right: 'Il a mangé une pomme.',
    explain: '"Mangé" without the accent looks like "mange" (present tense: he eats). The accent aigu on the -é signals the past participle. It changes the meaning of the sentence.',
    level: 'Critical',
  },
  {
    wrong: 'Ou allez-vous ?',
    right: 'Où allez-vous ?',
    explain: '"Ou" = or. "Où" = where. Without the accent, "Ou allez-vous ?" reads as "Or are you going?" — a nonsense sentence. This one accent changes the entire question.',
    level: 'Critical',
  },
  {
    wrong: 'Je vais a Paris.',
    right: 'Je vais à Paris.',
    explain: '"a" (without accent) = has (verb avoir). "à" (with accent) = to/at. "Je vais a Paris" would be parsed as "I go has Paris" — grammatically broken.',
    level: 'Critical',
  },
  {
    wrong: 'Ma mere et mon pere sont la.',
    right: 'Ma mère et mon père sont là.',
    explain: '"Mere" and "pere" without accents look wrong and the open è sound is lost. "La" without accent = the (article). "Là" = there (adverb). Missing accents change a clear sentence to an ambiguous one.',
    level: 'Common',
  },
  {
    wrong: 'C\'est sur qu\'il viendra.',
    right: 'C\'est sûr qu\'il viendra.',
    explain: '"Sur" = on/over. "Sûr" = certain/sure. Without the circumflex, you\'re writing "it\'s on that he\'ll come" instead of "it\'s certain that he\'ll come".',
    level: 'Common',
  },
  {
    wrong: 'Il a du travailler jusqu\'a minuit.',
    right: 'Il a dû travailler jusqu\'à minuit.',
    explain: '"Du" = of the (partitive article). "Dû" = had to (past participle of devoir). Without the circumflex, "il a du travailler" = "he has of-the to-work" — meaningless.',
    level: 'Advanced',
  },
  {
    wrong: 'Je voudrais un cafe, s\'il vous plait.',
    right: 'Je voudrais un café, s\'il vous plaît.',
    explain: '"Café" without é looks incomplete — the final syllable loses its clear pronunciation. "Plaît" (pleases/please) without the circumflex is also wrong. These are among the most written French words — always accent them.',
    level: 'Common',
  },
]

const ACCENT_PHRASES = [
  { fr: 'Répétez, s\'il vous plaît.', en: 'Repeat, please.', note: 'Both "répétez" (with é) and "plaît" (with î) carry key accents.' },
  { fr: 'À bientôt !', en: 'See you soon!', note: '"À" = preposition (at/to). "Bientôt" has a circumflex — signals the dropped historic "s" (bistosto).' },
  { fr: 'Il a déjà mangé.', en: 'He has already eaten.', note: '"Déjà" uses two accents: é and à. "Mangé" = past participle with é.' },
  { fr: 'Où est la bibliothèque ?', en: 'Where is the library?', note: '"Où" = where (accent grave). "Bibliothèque" — the è marks the open vowel sound.' },
  { fr: 'C\'est différent, en français !', en: 'It\'s different, in French!', note: '"Français" requires the cédilla: ç. Without it, it would read as "francais" with a hard /k/ sound.' },
  { fr: 'Ma sœur préfère le thé noir.', en: 'My sister prefers black tea.', note: '"Sœur" uses the oe ligature. "Préfère" has both é and è. "Thé" ends with é.' },
  { fr: 'C\'est sûr — il est très occupé.', en: 'It\'s certain — he\'s very busy.', note: '"Sûr" (circumflex = certain). "Très" (grave = very). "Occupé" (aigu = past part.).' },
  { fr: 'Noël, c\'est le vingt-cinq décembre.', en: 'Christmas is the twenty-fifth of December.', note: '"Noël" uses tréma — the ë is pronounced separately. "Décembre" has é.' },
  { fr: 'J\'ai reçu une lettre de la mairie.', en: 'I received a letter from the town hall.', note: '"Reçu" uses the cédilla: ç. "Mairie" = town hall (accent-free here).' },
  { fr: 'Elle est très créative — c\'est étonnant !', en: 'She\'s very creative — it\'s amazing!', note: '"Très" (è), "créative" (é), "étonnant" (é). French writing is accent-rich.' },
]

const TYPING_TIPS = [
  { key: 'é', mac: 'Option + e, then e', windows: 'Alt + 0233', phone: 'Hold "e" key' },
  { key: 'è', mac: 'Option + `, then e', windows: 'Alt + 0232', phone: 'Hold "e" key' },
  { key: 'ê', mac: 'Option + i, then e', windows: 'Alt + 0234', phone: 'Hold "e" key' },
  { key: 'ë', mac: 'Option + u, then e', windows: 'Alt + 0235', phone: 'Hold "e" key' },
  { key: 'à', mac: 'Option + `, then a', windows: 'Alt + 0224', phone: 'Hold "a" key' },
  { key: 'â', mac: 'Option + i, then a', windows: 'Alt + 0226', phone: 'Hold "a" key' },
  { key: 'ç', mac: 'Option + c', windows: 'Alt + 0231', phone: 'Hold "c" key' },
  { key: 'ù', mac: 'Option + `, then u', windows: 'Alt + 0249', phone: 'Hold "u" key' },
  { key: 'û', mac: 'Option + i, then u', windows: 'Alt + 0251', phone: 'Hold "u" key' },
  { key: 'î', mac: 'Option + i, then i', windows: 'Alt + 0238', phone: 'Hold "i" key' },
  { key: 'ï', mac: 'Option + u, then i', windows: 'Alt + 0239', phone: 'Hold "i" key' },
  { key: 'ô', mac: 'Option + i, then o', windows: 'Alt + 0244', phone: 'Hold "o" key' },
]

const MISTAKE_COLORS = {
  Critical: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700',
  Common: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700',
  Advanced: 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-700',
}

const MISTAKE_BADGE = {
  Critical: 'bg-red-100 text-red-700',
  Common: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-purple-100 text-purple-700',
}

export default function FrenchAccents() {
  const [activeAccent, setActiveAccent] = useState(0)
  const [tab, setTab] = useState('accents')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Accents Guide | SayBonjour!" description="Master French accents — accent aigu, grave, circonflexe, cédille, tréma — with sounds, rules, common mistakes, and example phrases." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Accents Guide</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les accents — é, è, ê, ç, ë — pronunciation, rules, mistakes, and example phrases</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-6">
          💡 <strong>Accents are not optional in French.</strong> They change pronunciation AND meaning. "ou" (or) vs "où" (where), "a" (has) vs "à" (at) — missing an accent can make your writing nonsensical.
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'accents', label: 'Accent Types' },
            { id: 'phrases', label: 'Accents in Context' },
            { id: 'mistakes', label: 'Common Mistakes' },
            { id: 'typing', label: 'How to Type' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); addXP(3, 'vocabulary') }}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'accents' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {ACCENT_TYPES.map((a, i) => (
                <button key={a.accent} onClick={() => { setActiveAccent(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeAccent === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {a.accent.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-3xl font-mono text-burgundy-700 dark:text-burgundy-vibrant-300">{ACCENT_TYPES[activeAccent].accent.split('—')[0].trim()}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 bg-cream-50 dark:bg-dark-warm-200 rounded-lg px-3 py-2">Sound: <span className="font-medium text-gray-700 dark:text-gray-200">{ACCENT_TYPES[activeAccent].sound}</span></p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Examples</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                {ACCENT_TYPES[activeAccent].words.map((w, i) => (
                  <motion.div key={w.fr} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2 text-center cursor-pointer"
                    onClick={() => addXP(2, 'vocabulary')}>
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <SpeakButton text={w.fr} size="sm" />
                      <span className="font-bold text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{w.fr}</span>
                    </div>
                    <p className="text-xs text-gray-400">{w.en}</p>
                    {w.note && <p className="text-xs text-amber-500 italic">{w.note}</p>}
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Rules & Notes</p>
                <ul className="space-y-1.5">
                  {ACCENT_TYPES[activeAccent].rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-burgundy-500 shrink-0 mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-2">
              These phrases are packed with French accents — notice how each one changes pronunciation or meaning.
            </div>
            {ACCENT_PHRASES.map((phrase, i) => (
              <motion.div key={phrase.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3 cursor-pointer"
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

        {tab === 'mistakes' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-sm text-red-800 dark:text-red-300 mb-2">
              ⚠️ These are the most common accent mistakes made by learners. In some cases a missing accent changes the meaning completely.
            </div>
            {ACCENT_MISTAKES.map((item, i) => (
              <motion.div key={item.wrong} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border p-5 cursor-pointer ${MISTAKE_COLORS[item.level]}`}
                onClick={() => addXP(3, 'vocabulary')}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${MISTAKE_BADGE[item.level]}`}>{item.level}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white/70 dark:bg-dark-warm-100/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">✗ Wrong</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic">{item.wrong}</p>
                  </div>
                  <div className="bg-white/70 dark:bg-dark-warm-100/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">✓ Correct</p>
                    <div className="flex items-center gap-1">
                      <SpeakButton text={item.right} size="sm" />
                      <p className="text-sm font-medium text-gray-800 dark:text-cream-50 italic">{item.right}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.explain}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'typing' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="grid grid-cols-1 gap-2">
                {TYPING_TIPS.map((tip, i) => (
                  <motion.div key={tip.key} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-4 gap-2 items-center border-b border-gray-50 dark:border-dark-warm-200 pb-2 last:border-0 cursor-pointer"
                    onClick={() => addXP(2, 'vocabulary')}>
                    <div className="flex items-center gap-1.5">
                      <SpeakButton text={tip.key} size="sm" />
                      <span className="font-bold text-xl font-mono text-burgundy-700 dark:text-burgundy-vibrant-300">{tip.key}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <p className="font-medium text-gray-700 dark:text-gray-300">Mac</p>
                      <p>{tip.mac}</p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <p className="font-medium text-gray-700 dark:text-gray-300">Windows</p>
                      <p>{tip.windows}</p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <p className="font-medium text-gray-700 dark:text-gray-300">Phone</p>
                      <p>{tip.phone}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
              <p className="text-sm text-amber-800 dark:text-amber-300">💡 <strong>Best tip:</strong> For frequent French typing, install a French keyboard input method ("AZERTY") on your OS, or use a custom "French (International)" keyboard layout that gives easier access to accented characters. Google Docs also autocorrects many French accents automatically.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">📱 <strong>Phone users:</strong> On all modern smartphones, hold any vowel or "c" key to reveal accent options as a pop-up. Hold "e" to see: é, è, ê, ë, and more. Hold "c" to see ç. This works on both iOS and Android.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
