import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const TENSES = [
  {
    name: 'Présent',
    en: 'Present tense',
    level: 'A1',
    use: 'Actions happening now, habits, general truths. Also used for actions that started in the past and continue now (with "depuis").',
    formula: 'Verb stem + present endings (-e, -es, -e, -ons, -ez, -ent for -er verbs)',
    examples: [
      { fr: 'Je mange une pomme.', en: 'I am eating an apple / I eat an apple.' },
      { fr: 'Elle travaille à Paris depuis cinq ans.', en: 'She has been working in Paris for five years.' },
      { fr: 'Nous aimons la musique classique.', en: 'We love classical music.' },
      { fr: 'Il pleut souvent en novembre à Paris.', en: 'It often rains in November in Paris.' },
    ],
    tip: 'The French present covers both "I eat" and "I am eating" — one tense does both jobs. With "depuis" (for/since), it also covers the English present perfect continuous: "J\'habite ici depuis 2015" = I have been living here since 2015.',
    irregular: 'Key irregulars: être (suis/es/est/sommes/êtes/sont), avoir (ai/as/a/avons/avez/ont), aller (vais/vas/va/allons/allez/vont), faire (fais/fais/fait/faisons/faites/font)',
  },
  {
    name: 'Passé composé',
    en: 'Perfect tense (completed past)',
    level: 'A2',
    use: 'Completed past actions — specific events, things that happened once, completed sequences. Used in conversation and informal writing.',
    formula: 'avoir / être (présent) + past participle',
    examples: [
      { fr: 'J\'ai mangé une pizza hier soir.', en: 'I ate a pizza last night.' },
      { fr: 'Elle est allée au cinéma samedi.', en: 'She went to the cinema on Saturday.' },
      { fr: 'Nous avons vu ce film trois fois.', en: 'We have seen this film three times.' },
      { fr: 'Les enfants se sont couchés tôt.', en: 'The children went to bed early.' },
    ],
    tip: 'Uses "être" with Dr & Mrs Vandertramp verbs (aller, venir, partir, arriver, naître, mourir, etc.) AND all reflexive verbs. With être, the past participle agrees with the subject. With avoir, it agrees only if a direct object precedes the verb.',
    irregular: 'Key past participles: avoir → eu, être → été, faire → fait, prendre → pris, voir → vu, pouvoir → pu, vouloir → voulu, savoir → su, mettre → mis, écrire → écrit',
  },
  {
    name: 'Imparfait',
    en: 'Imperfect tense (past description)',
    level: 'A2',
    use: 'Ongoing past states, habits, descriptions, background in stories. "Used to" or "was doing" in English.',
    formula: 'nous-stem (present) + -ais, -ais, -ait, -ions, -iez, -aient',
    examples: [
      { fr: 'Je mangeais une pomme quand il est arrivé.', en: 'I was eating an apple when he arrived.' },
      { fr: 'Quand j\'étais enfant, j\'habitais à Lyon.', en: 'When I was a child, I lived in Lyon.' },
      { fr: 'Il faisait beau ce jour-là.', en: 'The weather was nice that day.' },
      { fr: 'Nous allions à la plage chaque été.', en: 'We used to go to the beach every summer.' },
    ],
    tip: 'Imparfait = background / ongoing. Passé composé = foreground / event. Both appear together in narrative. Only irregular imparfait: être → j\'étais (stem: ét-). All others use the nous present stem.',
    irregular: 'Only être is irregular: étais, étais, était, étions, étiez, étaient. Note: "j\'avais" (I had), "je faisais" (I was doing) are regular imparfait forms.',
  },
  {
    name: 'Plus-que-parfait',
    en: 'Pluperfect (had done)',
    level: 'B1',
    use: 'An action completed BEFORE another past action. "Had done" in English. Essential for storytelling and reported speech.',
    formula: 'avoir / être (imparfait) + past participle',
    examples: [
      { fr: 'Il avait déjà mangé quand je suis arrivé.', en: 'He had already eaten when I arrived.' },
      { fr: 'Elle était partie avant que j\'arrive.', en: 'She had left before I arrived.' },
      { fr: 'J\'avais étudié le français avant de venir en France.', en: 'I had studied French before coming to France.' },
      { fr: 'Nous n\'avions jamais vu ça.', en: 'We had never seen that.' },
    ],
    tip: 'Think of it as the "had done" tense — one step further back than the passé composé. The same être/avoir rules apply as for passé composé. Very common in novels and reported speech.',
    irregular: 'Same past participles as passé composé. With être: elle était arrivée (agreement), ils étaient partis. With avoir: ils avaient vu, nous avions pris.',
  },
  {
    name: 'Futur proche',
    en: 'Near future (going to)',
    level: 'A1',
    use: 'Imminent or planned future actions — equivalent to English "going to". The most common future in everyday speech.',
    formula: 'aller (présent) + infinitive',
    examples: [
      { fr: 'Je vais manger une pomme.', en: 'I\'m going to eat an apple.' },
      { fr: 'Elle va partir demain matin.', en: 'She\'s going to leave tomorrow morning.' },
      { fr: 'Nous allons voir ce film ce soir.', en: 'We\'re going to see this film tonight.' },
      { fr: 'Il ne va pas pleuvoir aujourd\'hui.', en: 'It\'s not going to rain today.' },
    ],
    tip: 'Much more common than the simple future (futur simple) in everyday conversation. "Aller + infinitive" is the go-to future in speech. Use futur simple for more formal or distant future events.',
    irregular: 'The only "irregularity" is aller itself: je vais, tu vas, il va, nous allons, vous allez, ils vont. The second verb stays in the infinitive — no changes.',
  },
  {
    name: 'Futur simple',
    en: 'Simple future (will)',
    level: 'B1',
    use: 'Future events (formal/written contexts), predictions, conditions (after "si" clauses in the main clause), promises.',
    formula: 'Infinitive (for -er/-ir) or irregular stem + -ai, -as, -a, -ons, -ez, -ont',
    examples: [
      { fr: 'Je mangerai une pomme demain.', en: 'I will eat an apple tomorrow.' },
      { fr: 'S\'il fait beau, nous sortirons.', en: 'If the weather is nice, we will go out.' },
      { fr: 'Elle partira en juillet pour les grandes vacances.', en: 'She will leave in July for the summer holidays.' },
      { fr: 'Un jour, vous comprendrez.', en: 'One day, you will understand.' },
    ],
    tip: 'Used in formal writing, news reporting, literary texts, and for emphasis. In speech, "futur proche" is preferred. IMPORTANT: after "si" (if) you use présent, NOT futur — "Si je peux, je viendrai" (If I can, I will come).',
    irregular: 'Key irregular stems: être → ser-, avoir → aur-, aller → ir-, faire → fer-, venir → viendr-, pouvoir → pourr-, vouloir → voudr-, savoir → saur-, voir → verr-, tenir → tiendr-',
  },
  {
    name: 'Conditionnel présent',
    en: 'Conditional (would)',
    level: 'B1',
    use: 'Hypothetical situations (what WOULD happen), polite requests, reported speech in past, journalistic hedging.',
    formula: 'Future stem + imperfect endings: -ais, -ais, -ait, -ions, -iez, -aient',
    examples: [
      { fr: 'Je voudrais un café, s\'il vous plaît.', en: 'I would like a coffee, please.' },
      { fr: 'Si j\'avais plus d\'argent, je voyagerais davantage.', en: 'If I had more money, I would travel more.' },
      { fr: 'Il a dit qu\'il viendrait.', en: 'He said he would come.' },
      { fr: 'Le président serait prêt à négocier. (journalism)', en: 'The president is reportedly ready to negotiate.' },
    ],
    tip: '"Je voudrais" is the polite way to order or make a request — far gentler than "je veux". In hypothetical "if" sentences: si + imparfait → conditionnel (NOT futur). Journalists use conditionnel to indicate unconfirmed information.',
    irregular: 'Same irregular stems as futur simple: être → ser- (serais), avoir → aur- (aurais), aller → ir- (irais), faire → fer- (ferais). Same endings throughout.',
  },
  {
    name: 'Conditionnel passé',
    en: 'Past conditional (would have done)',
    level: 'B2',
    use: 'What WOULD HAVE happened (but didn\'t). Regrets, criticism, unfulfilled hypotheticals.',
    formula: 'avoir / être (conditionnel présent) + past participle',
    examples: [
      { fr: 'J\'aurais mangé si j\'avais eu le temps.', en: 'I would have eaten if I had had the time.' },
      { fr: 'Elle serait venue si elle avait pu.', en: 'She would have come if she could have.' },
      { fr: 'Tu aurais dû me le dire !', en: 'You should have told me!' },
      { fr: 'Si j\'avais su, j\'aurais agi différemment.', en: 'If I had known, I would have acted differently.' },
    ],
    tip: '"Aurais dû" (should have), "aurais pu" (could have), "aurais voulu" (would have wanted) — all very common in everyday speech. The structure for "if" is: si + plus-que-parfait → conditionnel passé.',
    irregular: 'With être: elle serait partie (agreement required), ils seraient venus. With avoir: nous aurions pu, vous auriez dû. Same past participle rules as passé composé.',
  },
  {
    name: 'Passé simple',
    en: 'Simple past (literary)',
    level: 'B2',
    use: 'Completed past actions in FORMAL writing only — novels, historical texts, official documents. Not used in speech.',
    formula: '-er verbs: -ai, -as, -a, -âmes, -âtes, -èrent | -ir/-re: -is, -is, -it, -îmes, -îtes, -irent',
    examples: [
      { fr: 'Il mangea lentement puis se leva.', en: 'He ate slowly then stood up.' },
      { fr: 'Elle naquit à Paris en 1789.', en: 'She was born in Paris in 1789.' },
      { fr: 'Les révolutionnaires prirent la Bastille.', en: 'The revolutionaries took the Bastille.' },
      { fr: 'Il mourut sans avoir revu sa patrie.', en: 'He died without having seen his homeland again.' },
    ],
    tip: 'You will READ passé simple in French literature constantly — but you will NEVER be expected to speak it. Recognise it by its distinctive endings. When reading, it functions like passé composé: a completed past action.',
    irregular: 'Major irregulars: être → fut (il fut), avoir → eut (il eut), faire → fit (il fit), voir → vit (il vit), venir → vint (il vint), pouvoir → put (il put), prendre → prit (il prit)',
  },
  {
    name: 'Subjonctif',
    en: 'Subjunctive mood',
    level: 'B2',
    use: 'Doubt, emotion, necessity, opinion — after certain expressions and conjunctions. A mood, not a tense.',
    formula: 'ils-stem (present) + -e, -es, -e, -ions, -iez, -ent',
    examples: [
      { fr: 'Il faut que tu viennes à la réunion.', en: 'You must come to the meeting.' },
      { fr: 'Je veux que tu sois là pour moi.', en: 'I want you to be there for me.' },
      { fr: 'Bien qu\'il soit tard, je reste.', en: 'Although it\'s late, I\'m staying.' },
      { fr: 'C\'est dommage que vous ne puissiez pas venir.', en: 'It\'s a shame you can\'t come.' },
    ],
    tip: 'Triggered after: il faut que, vouloir que, bien que, pour que, avant que, douter que, regretter que, être content que. Key irregulars: être → sois/soit/soient, avoir → aie/ait/aient.',
    irregular: 'Irregular: être (sois, sois, soit, soyons, soyez, soient), avoir (aie, aies, ait, ayons, ayez, aient), aller (aille, ailles, aille, allions, alliez, aillent), faire (fasse), pouvoir (puisse), vouloir (veuille)',
  },
]

const COMPARISON = [
  {
    title: 'Passé composé vs. Imparfait',
    subtitle: 'The most important distinction in French',
    en1: 'Passé composé: what HAPPENED (events, actions, completed facts)',
    en2: 'Imparfait: what WAS HAPPENING / how things WERE (background, description, habits)',
    pairs: [
      { pc: 'Il a plu hier.', imp: 'Il pleuvait tout le temps.', pcEn: 'It rained yesterday. (event)', impEn: 'It was always raining. (habit/description)' },
      { pc: 'J\'ai mangé.', imp: 'Je mangeais quand tu as appelé.', pcEn: 'I ate. (completed action)', impEn: 'I was eating when you called. (ongoing background)' },
      { pc: 'Elle est tombée.', imp: 'Elle était fatiguée.', pcEn: 'She fell. (event)', impEn: 'She was tired. (state/description)' },
    ],
    tip: 'Think: passé composé = the movie\'s key scenes. Imparfait = the setting, lighting, and atmosphere.',
  },
  {
    title: 'Futur proche vs. Futur simple',
    subtitle: 'Two ways to say "will" in French',
    en1: 'Futur proche (aller + inf): immediate plans, spoken French, near certainty',
    en2: 'Futur simple: formal writing, distant future, predictions, literary style',
    pairs: [
      { pc: 'Je vais partir dans dix minutes.', imp: 'Je partirai demain matin.', pcEn: 'I\'m leaving in ten minutes. (imminent)', impEn: 'I will leave tomorrow morning. (more distant)' },
      { pc: 'Ça va être difficile.', imp: 'Ce sera difficile.', pcEn: 'It\'s going to be difficult. (spoken)', impEn: 'It will be difficult. (written/formal)' },
    ],
    tip: 'In everyday speech, "futur proche" sounds more natural. "Futur simple" sounds more formal — use it in writing, news, or for dramatic effect.',
  },
  {
    title: 'Conditionnel présent vs. Conditionnel passé',
    subtitle: 'Would vs. Would have',
    en1: 'Conditionnel présent: what WOULD happen (hypothetical present/future)',
    en2: 'Conditionnel passé: what WOULD HAVE happened (hypothetical past — it didn\'t)',
    pairs: [
      { pc: 'Si j\'avais de l\'argent, j\'achèterais une maison.', imp: 'Si j\'avais eu de l\'argent, j\'aurais acheté une maison.', pcEn: 'If I had money, I would buy a house. (current hypothesis)', impEn: 'If I had had money, I would have bought a house. (past regret)' },
      { pc: 'Tu devrais faire du sport.', imp: 'Tu aurais dû faire du sport.', pcEn: 'You should exercise. (advice)', impEn: 'You should have exercised. (past criticism)' },
    ],
    tip: '"Aurais dû" (should have), "aurais pu" (could have), "aurais voulu" (would have wanted) are among the most common phrases in French conversation.',
  },
]

const SEQUENCE_CHART = [
  { tense: 'Plus-que-parfait', signal: 'had done (furthest back)', example: 'Il avait mangé...', color: 'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300', step: 1 },
  { tense: 'Passé composé / Passé simple', signal: 'did / happened', example: '...quand il est arrivé.', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300', step: 2 },
  { tense: 'Imparfait', signal: 'was doing / used to', example: 'Il faisait beau.', color: 'bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300', step: 2 },
  { tense: 'Présent', signal: 'now', example: 'Je suis à Paris.', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300', step: 3 },
  { tense: 'Futur proche', signal: 'going to (immediate)', example: 'Je vais partir.', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300', step: 4 },
  { tense: 'Futur simple', signal: 'will (distant/formal)', example: 'Je partirai.', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300', step: 5 },
]

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  B2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
}

export default function FrenchTenses() {
  const [activeTense, setActiveTense] = useState(0)
  const [tab, setTab] = useState('tenses')
  const [activeComparison, setActiveComparison] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Tenses | SayBonjour!" description="Master French tenses — présent, passé composé, imparfait, plus-que-parfait, futur, conditionnel, subjonctif — with examples, tips, and comparisons." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Tenses</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les temps — 10 tenses with examples, tips, and key comparisons</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'tenses', label: 'All Tenses' },
            { id: 'compare', label: 'Key Comparisons' },
            { id: 'timeline', label: 'Timeline View' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'tenses' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {TENSES.map((t, i) => (
                <button key={t.name} onClick={() => { setActiveTense(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTense === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {t.name}
                  <span className={`px-1 py-0.5 rounded text-xs font-bold ${activeTense === i ? 'bg-white/20 text-white' : LEVEL_COLORS[t.level]}`}>{t.level}</span>
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-bold text-xl font-playfair text-gray-900 dark:text-cream-50">{TENSES[activeTense].name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[TENSES[activeTense].level]}`}>{TENSES[activeTense].level}</span>
                </div>
                <p className="text-sm text-burgundy-600 dark:text-burgundy-vibrant-300 italic">{TENSES[activeTense].en}</p>
              </div>

              <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">When to use</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{TENSES[activeTense].use}</p>
              </div>

              <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Formula</p>
                <p className="text-sm font-mono text-burgundy-700 dark:text-burgundy-vibrant-300">{TENSES[activeTense].formula}</p>
              </div>

              <div className="space-y-2 mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Examples</p>
                {TENSES[activeTense].examples.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 border border-gray-100 dark:border-dark-warm-200 rounded-xl px-4 py-3 cursor-pointer"
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
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Key tip</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{TENSES[activeTense].tip}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">🔡 Irregular forms</p>
                <p className="text-sm text-blue-800 dark:text-blue-300">{TENSES[activeTense].irregular}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setActiveTense(i => Math.max(0, i - 1))} disabled={activeTense === 0}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors">
                ← Previous
              </button>
              <button onClick={() => { setActiveTense(i => Math.min(TENSES.length - 1, i + 1)); addXP(2, 'grammar') }} disabled={activeTense === TENSES.length - 1}
                className="flex-1 py-2.5 rounded-xl bg-burgundy-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-burgundy-700 transition-colors">
                Next →
              </button>
            </div>
          </>
        )}

        {tab === 'compare' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {COMPARISON.map((c, i) => (
                <button key={c.title} onClick={() => { setActiveComparison(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeComparison === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {c.title.split(' vs. ').join(' vs. ')}
                </button>
              ))}
            </div>

            {(() => {
              const c = COMPARISON[activeComparison]
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-bold text-xl font-playfair text-gray-900 dark:text-cream-50 mb-1">{c.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{c.subtitle}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">First tense</p>
                      <p className="text-sm text-blue-800 dark:text-blue-300">{c.en1}</p>
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-700 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-1">Second tense</p>
                      <p className="text-sm text-violet-800 dark:text-violet-300">{c.en2}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {c.pairs.map((pair, i) => (
                      <div key={pair.pc} className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4">
                        <div className="grid sm:grid-cols-2 gap-2">
                          <div className="flex items-start gap-2 cursor-pointer" onClick={() => addXP(2, 'grammar')}>
                            <SpeakButton text={pair.pc} size="sm" />
                            <div>
                              <p className="text-sm font-medium italic text-blue-700 dark:text-blue-300">"{pair.pc}"</p>
                              <p className="text-xs text-gray-400">{pair.pcEn}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 cursor-pointer" onClick={() => addXP(2, 'grammar')}>
                            <SpeakButton text={pair.imp} size="sm" />
                            <div>
                              <p className="text-sm font-medium italic text-violet-700 dark:text-violet-300">"{pair.imp}"</p>
                              <p className="text-xs text-gray-400">{pair.impEn}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Remember</p>
                    <p className="text-sm text-amber-800 dark:text-amber-300">{c.tip}</p>
                  </div>
                </motion.div>
              )
            })()}
          </div>
        )}

        {tab === 'timeline' && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">French tenses arranged on the timeline — from furthest past to future. Click any to learn more.</p>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-300 via-green-300 to-orange-300 dark:from-violet-700 dark:via-green-700 dark:to-orange-700" />
              <div className="space-y-3 ml-10">
                {SEQUENCE_CHART.map((item, i) => (
                  <motion.div key={item.tense} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className={`relative rounded-xl px-4 py-3 border cursor-pointer ${item.color} border-current border-opacity-30`}
                    onClick={() => {
                      const idx = TENSES.findIndex(t => t.name.toLowerCase().includes(item.tense.toLowerCase().split(' ')[0]))
                      if (idx >= 0) { setActiveTense(idx); setTab('tenses') }
                      addXP(3, 'grammar')
                    }}>
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-current bg-white dark:bg-dark-warm-300" />
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-sm">{item.tense}</p>
                        <p className="text-xs opacity-70">{item.signal}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <SpeakButton text={item.example} size="sm" />
                        <p className="font-mono text-xs italic opacity-80">{item.example}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">Tap any tense to open its full explanation →</p>
          </div>
        )}
      </div>
    </div>
  )
}
