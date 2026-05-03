import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const NEGATION_TYPES = [
  {
    type: 'ne…pas',
    meaning: 'not (general negation)',
    rule: 'ne + verb + pas — the most common form',
    level: 'A1',
    examples: [
      { pos: 'Je mange.', neg: 'Je ne mange pas.', en: 'I don\'t eat.' },
      { pos: 'Elle parle anglais.', neg: 'Elle ne parle pas anglais.', en: 'She doesn\'t speak English.' },
      { pos: 'Nous comprenons.', neg: 'Nous ne comprenons pas.', en: 'We don\'t understand.' },
      { pos: 'Il est médecin.', neg: 'Il n\'est pas médecin.', en: 'He\'s not a doctor.' },
    ],
    note: 'Before a vowel or h, ne → n\'. Example: il n\'a pas, elle n\'est pas. In informal speech the ne is often dropped entirely: "Je mange pas."',
  },
  {
    type: 'ne…jamais',
    meaning: 'never',
    rule: 'ne + verb + jamais',
    level: 'A2',
    examples: [
      { pos: 'Elle fume.', neg: 'Elle ne fume jamais.', en: 'She never smokes.' },
      { pos: 'Tu mens.', neg: 'Tu ne mens jamais.', en: 'You never lie.' },
      { pos: 'Il voyage.', neg: 'Il ne voyage jamais.', en: 'He never travels.' },
      { pos: 'Je bois du vin.', neg: 'Je ne bois jamais de vin.', en: 'I never drink wine.' },
    ],
    note: '"Jamais" alone (without ne) means "ever" in questions: "Tu as jamais essayé ?" = "Have you ever tried?" Also: "Jamais de la vie !" = "Never in my life!"',
  },
  {
    type: 'ne…plus',
    meaning: 'no longer / not anymore',
    rule: 'ne + verb + plus',
    level: 'A2',
    examples: [
      { pos: 'Je travaille là-bas.', neg: 'Je ne travaille plus là-bas.', en: 'I no longer work there.' },
      { pos: 'Il habite à Paris.', neg: 'Il n\'habite plus à Paris.', en: 'He doesn\'t live in Paris anymore.' },
      { pos: 'Nous avons du lait.', neg: 'Nous n\'avons plus de lait.', en: 'We don\'t have any more milk.' },
      { pos: 'Elle aime le foot.', neg: 'Elle n\'aime plus le foot.', en: 'She no longer likes football.' },
    ],
    note: 'Common in everyday speech: "C\'est plus pareil" = "It\'s not the same anymore." The s in "plus" is silent when used as negation.',
  },
  {
    type: 'ne…rien',
    meaning: 'nothing / not anything',
    rule: 'ne + verb + rien',
    level: 'A2',
    examples: [
      { pos: 'Je vois quelque chose.', neg: 'Je ne vois rien.', en: 'I don\'t see anything / I see nothing.' },
      { pos: 'Elle dit quelque chose.', neg: 'Elle ne dit rien.', en: 'She says nothing.' },
      { pos: 'Il fait quelque chose.', neg: 'Il ne fait rien.', en: 'He\'s not doing anything.' },
      { pos: 'J\'entends quelque chose.', neg: 'Je n\'entends rien.', en: 'I don\'t hear anything.' },
    ],
    note: '"Rien" can be subject: "Rien ne va" = "Nothing is working / everything is wrong." Also a common cultural phrase: "De rien !" = "You\'re welcome!" (lit. it\'s nothing).',
  },
  {
    type: 'ne…personne',
    meaning: 'nobody / not anyone',
    rule: 'ne + verb + personne',
    level: 'B1',
    examples: [
      { pos: 'Je connais quelqu\'un ici.', neg: 'Je ne connais personne ici.', en: 'I don\'t know anyone here.' },
      { pos: 'Elle a appelé quelqu\'un.', neg: 'Elle n\'a appelé personne.', en: 'She hasn\'t called anyone.' },
      { pos: 'Il voit quelqu\'un.', neg: 'Il ne voit personne.', en: 'He doesn\'t see anyone.' },
      { pos: 'Tu cherches quelqu\'un ?', neg: 'Je ne cherche personne.', en: 'I\'m not looking for anyone.' },
    ],
    note: '"Personne" comes AFTER the past participle in compound tenses. As subject: "Personne n\'est venu" = "Nobody came." Grammatically, "personne" is always singular.',
  },
  {
    type: 'ne…que',
    meaning: 'only',
    rule: 'ne + verb + que + [restricted element]',
    level: 'B1',
    examples: [
      { pos: 'J\'ai un euro.', neg: 'Je n\'ai qu\'un euro.', en: 'I only have one euro.' },
      { pos: 'Il mange le dessert.', neg: 'Il ne mange que le dessert.', en: 'He only eats dessert.' },
      { pos: 'Elle parle français.', neg: 'Elle ne parle que français.', en: 'She only speaks French.' },
      { pos: 'Nous avons deux jours.', neg: 'Nous n\'avons que deux jours.', en: 'We only have two days.' },
    ],
    note: '"Ne…que" is NOT a true negative — it means "only". Articles remain: "Je n\'ai qu\'un euro" (not "de"). Informal alternative: "Je ne parle que français" = "Seulement le français."',
  },
  {
    type: 'ne…ni…ni',
    meaning: 'neither…nor',
    rule: 'ne + verb + ni [X] + ni [Y]',
    level: 'B1',
    examples: [
      { pos: 'Il boit du café et du thé.', neg: 'Il ne boit ni café ni thé.', en: 'He drinks neither coffee nor tea.' },
      { pos: 'Elle aime le sport et la musique.', neg: 'Elle n\'aime ni le sport ni la musique.', en: 'She likes neither sport nor music.' },
      { pos: 'J\'ai un frère et une sœur.', neg: 'Je n\'ai ni frère ni sœur.', en: 'I have neither a brother nor a sister.' },
    ],
    note: 'After ni, partitive and indefinite articles (un, une, du, de la, des) are omitted. Definite articles (le, la, les) remain. "Ni l\'un ni l\'autre" = neither of them.',
  },
  {
    type: 'ne…aucun(e)',
    meaning: 'no / not a single / none',
    rule: 'ne + verb + aucun/aucune + noun',
    level: 'B1',
    examples: [
      { pos: 'J\'ai des amis ici.', neg: 'Je n\'ai aucun ami ici.', en: 'I have no friends here.' },
      { pos: 'Il y a des solutions.', neg: 'Il n\'y a aucune solution.', en: 'There\'s no solution at all.' },
      { pos: 'Elle a des regrets.', neg: 'Elle n\'a aucun regret.', en: 'She has no regrets whatsoever.' },
      { pos: 'Tu as des idées.', neg: 'Tu n\'as aucune idée.', en: 'You have no idea.' },
    ],
    note: '"Aucun" agrees in gender with the noun (aucun/aucune). Always singular — never "aucuns" unless the noun only exists in plural (aucuns frais = no fees). Stronger than "pas de".',
  },
]

const COMPOUND_TENSE_RULES = [
  {
    type: 'ne…pas in passé composé',
    structure: 'ne + auxiliary + pas + past participle',
    example: { pos: 'J\'ai mangé.', neg: 'Je n\'ai pas mangé.', en: 'I didn\'t eat.' },
    note: 'The "pas" goes BETWEEN the auxiliary (avoir/être) and the past participle. Never after the past participle.',
    more: [
      { neg: 'Elle n\'est pas venue.', en: 'She didn\'t come.' },
      { neg: 'Nous n\'avons pas compris.', en: 'We didn\'t understand.' },
    ],
  },
  {
    type: 'ne…jamais in passé composé',
    structure: 'ne + auxiliary + jamais + past participle',
    example: { pos: 'J\'ai essayé.', neg: 'Je n\'ai jamais essayé.', en: 'I\'ve never tried.' },
    note: '"Jamais" sits between the auxiliary and past participle — same position as "pas".',
    more: [
      { neg: 'Elle n\'a jamais voyagé seule.', en: 'She\'s never travelled alone.' },
      { neg: 'Ils n\'ont jamais appris le français.', en: 'They\'ve never learnt French.' },
    ],
  },
  {
    type: 'ne…rien in passé composé',
    structure: 'ne + auxiliary + rien + past participle',
    example: { pos: 'J\'ai dit quelque chose.', neg: 'Je n\'ai rien dit.', en: 'I said nothing.' },
    note: '"Rien" also goes BEFORE the past participle in compound tenses.',
    more: [
      { neg: 'Elle n\'a rien compris.', en: 'She understood nothing.' },
      { neg: 'Ils n\'ont rien mangé.', en: 'They ate nothing.' },
    ],
  },
  {
    type: 'ne…personne in passé composé',
    structure: 'ne + auxiliary + past participle + personne',
    example: { pos: 'J\'ai vu quelqu\'un.', neg: 'Je n\'ai vu personne.', en: 'I saw nobody.' },
    note: '⚠️ EXCEPTION: "Personne" comes AFTER the past participle — unlike pas, jamais, rien which come before.',
    more: [
      { neg: 'Elle n\'a appelé personne.', en: 'She called nobody.' },
      { neg: 'Nous n\'avons rencontré personne.', en: 'We met nobody.' },
    ],
  },
  {
    type: 'ne…plus in passé composé',
    structure: 'ne + auxiliary + plus + past participle',
    example: { pos: 'Il a travaillé là-bas.', neg: 'Il n\'a plus travaillé là-bas.', en: 'He no longer worked there.' },
    note: '"Plus" goes before the past participle, same as "pas". Common in perfect tense narratives.',
    more: [
      { neg: 'Elle n\'a plus voulu partir.', en: 'She no longer wanted to leave.' },
      { neg: 'Je n\'ai plus eu peur.', en: 'I was no longer afraid.' },
    ],
  },
]

const SPOKEN_SHORTCUTS = [
  { standard: 'Je ne sais pas.', spoken: 'Je sais pas. / Chais pas.', note: 'Dropping "ne" is extremely common in spoken French — even in educated register.' },
  { standard: 'Je ne comprends pas.', spoken: 'Je comprends pas.', note: 'Standard in casual speech — perfectly natural.' },
  { standard: 'Ce n\'est pas grave.', spoken: 'C\'est pas grave.', note: 'Heard constantly in everyday French. "C\'est pas grave" = don\'t worry about it.' },
  { standard: 'Tu ne peux pas.', spoken: 'Tu peux pas.', note: 'Casual usage — fine with friends and colleagues.' },
  { standard: 'Il n\'y a pas.', spoken: 'Y\'a pas. / Il y a pas.', note: '"Y\'a pas" is very informal. "Y\'a pas de problème" = no problem at all.' },
  { standard: 'Je ne veux pas.', spoken: 'Je veux pas.', note: 'Common in both adult and child speech.' },
  { standard: 'Elle n\'est pas là.', spoken: 'Elle est pas là.', note: 'Natural in phone conversations and casual contexts.' },
  { standard: 'On ne sait jamais.', spoken: 'On sait jamais.', note: '"On sait jamais" = you never know — a very common French expression.' },
  { standard: 'Je n\'ai plus faim.', spoken: 'J\'ai plus faim.', note: 'The s in "plus" is silent here. Careful: context makes meaning clear.' },
  { standard: 'Il ne fait rien.', spoken: 'Il fait rien.', note: '"Il fait rien" vs "Il ne fait rien" — identical meaning, different register.' },
]

const COMMON_ERRORS = [
  {
    wrong: 'Je ne mange pas de le pain.',
    right: 'Je ne mange pas de pain.',
    explain: 'After negation (ne…pas), partitive and indefinite articles (du, de la, des, un, une) become just "de" (or "d\'" before a vowel). Never "de le" or "de les".',
  },
  {
    wrong: 'Je n\'ai pas mangé pas.',
    right: 'Je n\'ai pas mangé.',
    explain: 'Don\'t double up "pas". In compound tenses, "pas" goes between the auxiliary and past participle — only once.',
  },
  {
    wrong: 'Je ne veux personne pas voir.',
    right: 'Je ne veux voir personne.',
    explain: '"Personne" should follow the infinitive directly. The structure is: ne + conjugated verb + [infinitive + personne]. Never mix pas and personne together.',
  },
  {
    wrong: 'Je ne jamais mange là.',
    right: 'Je ne mange jamais là.',
    explain: '"Jamais" must follow the conjugated verb, not precede it. "Je ne jamais mange" is incorrect word order.',
  },
  {
    wrong: 'Il n\'a personne vu.',
    right: 'Il n\'a vu personne.',
    explain: '"Personne" in compound tenses goes AFTER the past participle (unlike "rien", "pas", "jamais" which go before it).',
  },
  {
    wrong: 'Je ne veux pas rien.',
    right: 'Je ne veux rien. / Je ne veux pas quelque chose.',
    explain: 'Double negatives are not used in French this way. "Pas rien" is a contradiction. Use either "ne…pas" or "ne…rien" — not both together.',
  },
]

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
}

export default function FrenchNegation() {
  const [activeType, setActiveType] = useState(0)
  const [tab, setTab] = useState('types')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Negation | SayBonjour!" description="Master French negation — ne pas, ne jamais, ne plus, ne rien, ne personne, ne que, ni, aucun — with compound tense rules, spoken shortcuts, and common errors." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Negation</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La négation — ne…pas, ne…jamais, ne…plus, ne…rien, and all the rest</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-6">
          💡 French negation wraps around the verb: <strong>ne</strong> before, <strong>pas / jamais / rien…</strong> after. In spoken French, the <em>ne</em> is almost always dropped — but in writing and formal speech, keep both parts.
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'types', label: 'Negation Types' },
            { id: 'compound', label: 'Compound Tenses' },
            { id: 'spoken', label: 'Spoken Shortcuts' },
            { id: 'errors', label: 'Common Errors' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); addXP(3, 'grammar') }}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'types' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {NEGATION_TYPES.map((n, i) => (
                <button key={n.type} onClick={() => { setActiveType(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors font-mono ${activeType === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {n.type}
                </button>
              ))}
            </div>

            {NEGATION_TYPES[activeType] && (
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-bold text-xl text-burgundy-700 dark:text-burgundy-vibrant-300">{NEGATION_TYPES[activeType].type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[NEGATION_TYPES[activeType].level]}`}>{NEGATION_TYPES[activeType].level}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{NEGATION_TYPES[activeType].meaning}</p>
                <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2 mb-4 text-sm font-mono text-gray-700 dark:text-gray-300">
                  {NEGATION_TYPES[activeType].rule}
                </div>

                <div className="space-y-3 mb-4">
                  {NEGATION_TYPES[activeType].examples.map((ex, i) => (
                    <motion.div key={ex.neg} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="grid grid-cols-2 gap-3" onClick={() => addXP(2, 'grammar')}>
                      <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2 flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 italic">{ex.pos}</span>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl px-3 py-2 flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <X size={12} className="text-red-400 shrink-0" />
                            <span className="text-sm font-medium text-gray-800 dark:text-cream-50 italic">{ex.neg}</span>
                            <SpeakButton text={ex.neg} size="sm" />
                          </div>
                          <span className="text-xs text-gray-400 ml-4">{ex.en}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Note</p>
                  <p className="text-amber-800 dark:text-amber-300">{NEGATION_TYPES[activeType].note}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => setActiveType(i => Math.max(0, i - 1))} disabled={activeType === 0}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors">
                    ← Previous
                  </button>
                  <button onClick={() => setActiveType(i => Math.min(NEGATION_TYPES.length - 1, i + 1))} disabled={activeType === NEGATION_TYPES.length - 1}
                    className="flex-1 py-2.5 rounded-xl bg-burgundy-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-burgundy-700 transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'compound' && (
          <div className="space-y-5">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
              In compound tenses (passé composé, plus-que-parfait…), negation wraps around the <strong>auxiliary</strong> (avoir/être) — not around the whole verb phrase. Exception: "personne" always goes after the past participle.
            </div>
            {COMPOUND_TENSE_RULES.map((rule, i) => (
              <motion.div key={rule.type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'grammar')}>
                <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{rule.type}</h3>
                <div className="font-mono text-xs bg-cream-50 dark:bg-dark-warm-200 text-burgundy-700 dark:text-burgundy-vibrant-300 px-3 py-1.5 rounded-lg inline-block mb-3">{rule.structure}</div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2 flex items-center gap-2">
                    <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 italic">{rule.example.pos}</span>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-xl px-3 py-2 flex items-center gap-2">
                    <X size={12} className="text-red-400 shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-800 dark:text-cream-50 italic">{rule.example.neg}</span>
                        <SpeakButton text={rule.example.neg} size="sm" />
                      </div>
                      <p className="text-xs text-gray-400">{rule.example.en}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  {rule.more.map(m => (
                    <div key={m.neg} className="flex items-center gap-2">
                      <SpeakButton text={m.neg} size="sm" />
                      <p className="text-sm italic text-gray-700 dark:text-gray-300">"{m.neg}"</p>
                      <span className="text-xs text-gray-400">— {m.en}</span>
                    </div>
                  ))}
                </div>
                <p className={`text-xs italic ${rule.note.startsWith('⚠️') ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {rule.note.startsWith('⚠️') ? rule.note : `💡 ${rule.note}`}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'spoken' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-2">
              In everyday spoken French, the <strong>ne</strong> is almost always dropped. You\'ll still use it in writing and formal speech, but in conversation omitting it sounds natural — even educated native speakers do it constantly.
            </div>
            {SPOKEN_SHORTCUTS.map((s, i) => (
              <motion.div key={s.standard} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(2, 'grammar')}>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">Written / formal</p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={s.standard} size="sm" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">{s.standard}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-3 py-2 border border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs text-emerald-600 mb-0.5">Spoken</p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={s.spoken.split('.')[0]} size="sm" />
                      <p className="text-sm font-medium text-gray-800 dark:text-cream-50 italic">{s.spoken}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {s.note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'errors' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-sm text-red-800 dark:text-red-300 mb-2">
              ⚠️ These are the most common negation mistakes made by English speakers learning French. Most stem from incorrect article use or wrong word order.
            </div>
            {COMMON_ERRORS.map((err, i) => (
              <motion.div key={err.wrong} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'grammar')}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-xl px-3 py-2">
                    <p className="text-xs text-red-500 font-bold mb-1">✗ Wrong</p>
                    <p className="text-sm text-red-700 dark:text-red-300 font-mono italic">{err.wrong}</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-3 py-2">
                    <p className="text-xs text-emerald-500 font-bold mb-1">✓ Correct</p>
                    <div className="flex items-center gap-1.5">
                      <SpeakButton text={err.right.split('.')[0]} size="sm" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 font-mono italic">{err.right}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {err.explain}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
