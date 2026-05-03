import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Copy, CheckCircle2, Trash2, Volume2, Keyboard } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

const ACCENT_GROUPS = [
  {
    label: 'à / â (A)',
    chars: ['à', 'â', 'À', 'Â'],
    note: 'à = preposition (to/at: "je vais à Paris"). â = circumflex A, mostly poetic or historical.',
    examples: ['à Paris', 'là-bas', 'voilà', 'à bientôt'],
  },
  {
    label: 'é / è / ê / ë (E)',
    chars: ['é', 'è', 'ê', 'ë', 'É', 'È', 'Ê', 'Ë'],
    note: 'é = /ay/ (café, étudier). è = /eh/ (très, père). ê ≈ /eh/ (forêt, être). ë = diaeresis (Noël, naïve — rare).',
    examples: ['un café', 'très bien', 'la forêt', 'il est là'],
  },
  {
    label: 'î / ï (I)',
    chars: ['î', 'ï', 'Î', 'Ï'],
    note: 'î = circumflex I (île, gîte, boîte). ï = diaeresis (naïf, Noël — shows the vowels are separate).',
    examples: ['une île', 'naïf', 'une boîte', 'un gîte'],
  },
  {
    label: 'ô / œ / o (O)',
    chars: ['ô', 'œ', 'Ô', 'Œ'],
    note: 'ô = longer O sound (rôle, côte). œ = ligature (œuf = egg, cœur = heart, sœur = sister, nœud = knot).',
    examples: ['un œuf', 'le cœur', 'ma sœur', 'un rôle'],
  },
  {
    label: 'ù / û / ü (U)',
    chars: ['ù', 'û', 'ü', 'Ù', 'Û', 'Ü'],
    note: 'ù = ONLY in "où" (where). û = circumflex U (sûr, flûte, dû). ü = rare diaeresis (Noël, ambiguë).',
    examples: ['où vas-tu ?', 'c\'est sûr', 'une flûte', 'il est dû'],
  },
  {
    label: 'ç (cedilla)',
    chars: ['ç', 'Ç'],
    note: 'ç = soft C sound /s/ before a, o, u (ça, français, façon, garçon). Without cedilla, C before a/o/u = /k/.',
    examples: ['ça va ?', 'un garçon', 'le français', 'une façon'],
  },
  {
    label: 'æ / Æ (rare)',
    chars: ['æ', 'Æ'],
    note: 'æ = rare Latin ligature used in loanwords: curriculum vitæ. Very uncommon in everyday French.',
    examples: ['curriculum vitæ'],
  },
]

const KEYBOARD_SHORTCUTS = [
  { os: 'Windows', shortcuts: [
    { keys: 'Alt + 0233', char: 'é', word: 'café' },
    { keys: 'Alt + 0232', char: 'è', word: 'père' },
    { keys: 'Alt + 0234', char: 'ê', word: 'forêt' },
    { keys: 'Alt + 0224', char: 'à', word: 'là' },
    { keys: 'Alt + 0231', char: 'ç', word: 'garçon' },
    { keys: 'Alt + 0249', char: 'ù', word: 'où' },
  ]},
  { os: 'Mac', shortcuts: [
    { keys: 'Option + E, then E', char: 'é', word: 'café' },
    { keys: 'Option + `, then E', char: 'è', word: 'père' },
    { keys: 'Option + I, then E', char: 'ê', word: 'forêt' },
    { keys: 'Option + `, then A', char: 'à', word: 'à Paris' },
    { keys: 'Option + C', char: 'ç', word: 'garçon' },
    { keys: 'Option + `, then U', char: 'ù', word: 'où' },
  ]},
]

const EXAMPLE_SENTENCES = [
  { fr: 'Voilà où j\'habite.', en: 'There\'s where I live.' },
  { fr: 'Il préfère être à Paris.', en: 'He prefers to be in Paris.' },
  { fr: 'Ça va très bien, merci !', en: 'I\'m very well, thank you!' },
  { fr: 'Quelle heure est-il ?', en: 'What time is it?' },
  { fr: 'C\'est un cœur généreux.', en: 'It\'s a generous heart.' },
  { fr: 'Ma sœur habite sur une île.', en: 'My sister lives on an island.' },
  { fr: 'Un garçon français mange un œuf.', en: 'A French boy eats an egg.' },
  { fr: 'La forêt est magnifique en été.', en: 'The forest is magnificent in summer.' },
  { fr: 'Je suis né à Montréal en été.', en: 'I was born in Montreal in summer.' },
  { fr: 'C\'est sûr — il viendra demain.', en: 'It\'s certain — he\'ll come tomorrow.' },
  { fr: 'Où est la gare, s\'il vous plaît ?', en: 'Where is the station, please?' },
  { fr: 'Nous étudions le français avec plaisir.', en: 'We study French with pleasure.' },
]

const ACCENT_RULES = [
  { rule: 'é (accent aigu) — only on E', note: 'The acute accent (accent aigu) ONLY appears on "e" in French. It always makes the /ay/ sound. Common in: café, été, préférer, étudier, société. Very frequent.' },
  { rule: 'è, à, ù (accent grave) — meaning vs sound', note: 'The grave accent on "e" (è) = /eh/ sound (père, mère, très). On "a" (à) and "u" (ù), the grave accent distinguishes words: à (to) vs a (has), où (where) vs ou (or). No sound change for à/ù.' },
  { rule: 'â, ê, î, ô, û (circumflex) — historical long vowel', note: 'The circumflex (accent circonflexe) marks a historically long vowel — often where an "s" was dropped in Old French: forêt (forest), hôpital (hospital), île (isle), fête (feast), bête (beast). It subtly changes vowel quality.' },
  { rule: 'ë, ï, ü (tréma) — separate vowels', note: 'The diaeresis (tréma) means two adjacent vowels are pronounced separately: Noël = No-el, naïf = na-if. Common in names: Zoë, Raphaël, Aloïs.' },
  { rule: 'ç (cédille) — soft C', note: 'The cedilla makes C soft (/s/) before a, o, u: ça (that), garçon (boy), façon (way), leçon (lesson). Without it, C before a/o/u = /k/ sound: car (because), comme (like), cul-de-sac.' },
  { rule: 'Capital letters — accents are NOT optional', note: 'A common mistake: French accents are REQUIRED on capital letters. "ÉCOLE" not "ECOLE". "À PARIS" not "A PARIS". Omitting accents on capitals was once acceptable (typewriter era) but is now incorrect.' },
]

export default function FrenchKeyboard() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('keyboard')
  const textareaRef = useRef(null)

  const insertChar = (char) => {
    const ta = textareaRef.current
    if (!ta) { setText(t => t + char); return }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newText = text.slice(0, start) + char + text.slice(end)
    setText(newText)
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + char.length; ta.focus() }, 0)
  }

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const clear = () => setText('')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Accent Keyboard | SayBonjour!" description="Type French accented characters — à, é, ê, ü, ç, œ — with keyboard shortcuts and pronunciation notes." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Accent Keyboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Clavier accent français — type accented characters, learn the rules, and master shortcuts</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'keyboard', label: 'Keyboard' },
            { id: 'rules', label: 'Accent Rules' },
            { id: 'shortcuts', label: 'Keyboard Shortcuts' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'keyboard' && (
          <>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Keyboard size={16} /> Your text
                </label>
                <div className="flex gap-2">
                  {text && <SpeakButton text={text} size="sm" />}
                  <button onClick={copy} disabled={!text}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-dark-warm-50 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 disabled:opacity-40 transition-colors">
                    {copied ? <><CheckCircle2 size={13} className="text-emerald-500" /> Copied!</> : <><Copy size={13} /> Copy</>}
                  </button>
                  <button onClick={clear} disabled={!text}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-dark-warm-50 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 disabled:opacity-40 transition-colors">
                    <Trash2 size={13} /> Clear
                  </button>
                </div>
              </div>
              <textarea ref={textareaRef} value={text} onChange={e => setText(e.target.value)} rows={4}
                placeholder="Type here, then click accent buttons below to insert characters..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-warm-50 bg-cream-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:border-burgundy-400 text-sm resize-none" />
            </div>

            <div className="space-y-4 mb-8">
              {ACCENT_GROUPS.map(group => (
                <div key={group.label} className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{group.label}</span>
                      <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5 max-w-lg">💡 {group.note}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {group.chars.map(char => (
                      <motion.button key={char} onClick={() => insertChar(char)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-200 dark:border-dark-warm-50 bg-cream-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 font-bold text-lg hover:border-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-vibrant-600/10 hover:text-burgundy-700 dark:hover:text-burgundy-vibrant-300 transition-colors">
                        {char}
                      </motion.button>
                    ))}
                  </div>
                  {group.examples && (
                    <div className="flex flex-wrap gap-2">
                      {group.examples.map(ex => (
                        <button key={ex} onClick={() => { const ta = textareaRef.current; if (ta) { const start = ta.selectionStart; const newText = text.slice(0, start) + ex + text.slice(ta.selectionEnd); setText(newText); setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + ex.length; ta.focus() }, 0) } else setText(t => t + ex) }}
                          className="text-xs px-2 py-1 bg-cream-50 dark:bg-dark-warm-200 rounded-md border border-gray-200 dark:border-dark-warm-50 text-burgundy-600 dark:text-burgundy-vibrant-300 hover:border-burgundy-300 transition-colors font-mono">
                          {ex}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <h2 className="font-semibold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
                <Volume2 size={18} className="text-burgundy-600" /> Example sentences — click to load and listen
              </h2>
              <div className="space-y-2">
                {EXAMPLE_SENTENCES.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <SpeakButton text={s.fr} size="sm" />
                    <button onClick={() => setText(s.fr)}
                      className="flex-1 text-left px-4 py-2.5 rounded-xl border border-gray-100 dark:border-dark-warm-50 bg-cream-50 dark:bg-dark-warm-200 text-gray-700 dark:text-gray-200 text-sm hover:border-burgundy-300 hover:bg-burgundy-50 dark:hover:bg-burgundy-vibrant-600/10 transition-colors group flex items-center justify-between">
                      <div>
                        <span className="font-medium">{s.fr}</span>
                        <span className="text-xs text-gray-400 ml-2">— {s.en}</span>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-burgundy-500 shrink-0">Load →</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'rules' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-2">
              💡 French accents are not optional — they change meaning and pronunciation. Omitting them is a spelling error, not just a stylistic choice.
            </div>
            {ACCENT_RULES.map((rule, i) => (
              <motion.div key={rule.rule} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
                <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-2">{rule.rule}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{rule.note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'shortcuts' && (
          <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              💡 On mobile: long-press a letter key (e.g. "e") to see accent options. This works on iOS and Android keyboards.
            </div>
            {KEYBOARD_SHORTCUTS.map((os, i) => (
              <div key={os.os} className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
                <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-4">{os.os}</h3>
                <div className="space-y-3">
                  {os.shortcuts.map(s => (
                    <div key={s.char} className="flex items-center gap-3">
                      <span className="font-bold text-2xl text-burgundy-600 w-8">{s.char}</span>
                      <kbd className="text-xs bg-cream-50 dark:bg-dark-warm-200 border border-gray-200 dark:border-dark-warm-50 rounded px-2 py-1 font-mono text-gray-700 dark:text-gray-300 shrink-0">{s.keys}</kbd>
                      <span className="text-xs text-gray-400 italic">e.g. {s.word}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> Set your keyboard input to "French (France)" or "French (AZERTY)" to type accents naturally. AZERTY keyboards have é, è, à, ù directly on the keys.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
