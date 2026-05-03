import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const VERB_GROUPS = [
  {
    group: '-ER verbs (1st group)',
    rule: 'The largest group — ~90% of all French verbs. Drop -er, add: -e, -es, -e, -ons, -ez, -ent',
    model: 'parler (to speak)',
    conjugation: [
      { pronoun: 'je', form: 'parle', note: 'No final s — unlike English "speaks"' },
      { pronoun: 'tu', form: 'parles', note: 'Added -s for tu' },
      { pronoun: 'il/elle', form: 'parle', note: 'Same as je — both silent final -e' },
      { pronoun: 'nous', form: 'parlons', note: '-ons ending — reliable for all verbs' },
      { pronoun: 'vous', form: 'parlez', note: '-ez ending — also used as imperative: "Parlez !"' },
      { pronoun: 'ils/elles', form: 'parlent', note: 'Silent -ent — never pronounced!' },
    ],
    otherVerbs: [
      { v: 'aimer', en: 'to love/like' }, { v: 'travailler', en: 'to work' },
      { v: 'habiter', en: 'to live (in a place)' }, { v: 'manger', en: 'to eat' },
      { v: 'regarder', en: 'to watch' }, { v: 'écouter', en: 'to listen' },
      { v: 'chercher', en: 'to look for' }, { v: 'arriver', en: 'to arrive' },
      { v: 'rester', en: 'to stay' }, { v: 'donner', en: 'to give' },
    ],
    note: '~90% of French verbs follow this -ER pattern. Every new verb invented in French (such as "tweeter", "googler") joins this group.',
    warning: 'Spelling changes: "manger" → "nous mangeons" (add e before -ons to keep the soft g sound). "commencer" → "nous commençons" (cedilla to keep soft c).',
  },
  {
    group: '-IR verbs (2nd group)',
    rule: 'Regular -IR verbs. Drop -ir, add: -is, -is, -it, -issons, -issez, -issent',
    model: 'finir (to finish)',
    conjugation: [
      { pronoun: 'je', form: 'finis', note: '-is ending for je and tu' },
      { pronoun: 'tu', form: 'finis', note: 'Same as je for -IR verbs' },
      { pronoun: 'il/elle', form: 'finit', note: '-it ending — note the t' },
      { pronoun: 'nous', form: 'finissons', note: '-iss- inserted in nous/vous/ils forms' },
      { pronoun: 'vous', form: 'finissez', note: '-issez — the -iss- is distinctive' },
      { pronoun: 'ils/elles', form: 'finissent', note: '-issent — the -iss- before -ent' },
    ],
    otherVerbs: [
      { v: 'choisir', en: 'to choose' }, { v: 'grandir', en: 'to grow (up)' },
      { v: 'réussir', en: 'to succeed' }, { v: 'obéir', en: 'to obey' },
      { v: 'rougir', en: 'to blush' }, { v: 'vieillir', en: 'to grow old' },
      { v: 'nourrir', en: 'to feed/nourish' }, { v: 'saisir', en: 'to seize/grasp' },
    ],
    note: 'These "regular" -IR verbs always insert -iss- before the nous/vous/ils endings. This is the key identifier.',
    warning: 'TRAP: "partir" (to leave) and "dormir" (to sleep) are -IR verbs but do NOT follow this pattern — they are irregular (je pars, je dors). Always check before assuming.',
  },
  {
    group: '-RE verbs (3rd group)',
    rule: 'Drop -re, add: -s, -s, (nothing!), -ons, -ez, -ent',
    model: 'vendre (to sell)',
    conjugation: [
      { pronoun: 'je', form: 'vends', note: '-s ending for je' },
      { pronoun: 'tu', form: 'vends', note: 'Same -s as je' },
      { pronoun: 'il/elle', form: 'vend', note: 'NO ending — just the stem. "il vend" not "il vende"!' },
      { pronoun: 'nous', form: 'vendons', note: '-ons — same as all verbs' },
      { pronoun: 'vous', form: 'vendez', note: '-ez — same as all verbs' },
      { pronoun: 'ils/elles', form: 'vendent', note: '-ent — silent as always' },
    ],
    otherVerbs: [
      { v: 'attendre', en: 'to wait for' }, { v: 'entendre', en: 'to hear' },
      { v: 'descendre', en: 'to go down' }, { v: 'répondre', en: 'to reply' },
      { v: 'perdre', en: 'to lose' }, { v: 'rendre', en: 'to give back' },
      { v: 'confondre', en: 'to confuse' }, { v: 'tendre', en: 'to hold out' },
    ],
    note: 'The il/elle form has NO ending — just the bare stem. This is unique to -RE verbs. Never add a spurious -e or -t.',
    warning: 'TRAP: "prendre" (to take) is -RE but irregular: je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent (double-n in ils form!).',
  },
]

const ESSENTIAL_IRREGULARS = [
  {
    verb: 'être (to be)',
    note: 'The most important verb in French. Used in tenses, descriptions, nationality, profession, and feelings. "Je suis fatigué" = I am tired.',
    forms: [
      { p: 'je', f: 'suis' }, { p: 'tu', f: 'es' }, { p: 'il/elle', f: 'est' },
      { p: 'nous', f: 'sommes' }, { p: 'vous', f: 'êtes' }, { p: 'ils/elles', f: 'sont' },
    ],
    examples: ['"Je suis professeur." — I am a teacher.', '"Nous sommes en retard." — We are late.', '"Ils sont fatigués." — They are tired.'],
  },
  {
    verb: 'avoir (to have)',
    note: 'Used to express possession AND as the auxiliary for most past tenses (passé composé). "J\'ai mangé" = I ate (I have eaten).',
    forms: [
      { p: 'je', f: 'ai' }, { p: 'tu', f: 'as' }, { p: 'il/elle', f: 'a' },
      { p: 'nous', f: 'avons' }, { p: 'vous', f: 'avez' }, { p: 'ils/elles', f: 'ont' },
    ],
    examples: ['"J\'ai deux enfants." — I have two children.', '"Elle a faim." — She is hungry (lit. has hunger).', '"Nous avons visité Paris." — We visited Paris.'],
  },
  {
    verb: 'aller (to go)',
    note: 'Irregular despite ending in -ER. Also used for the near future: "je vais manger" = I\'m going to eat.',
    forms: [
      { p: 'je', f: 'vais' }, { p: 'tu', f: 'vas' }, { p: 'il/elle', f: 'va' },
      { p: 'nous', f: 'allons' }, { p: 'vous', f: 'allez' }, { p: 'ils/elles', f: 'vont' },
    ],
    examples: ['"Je vais bien, merci." — I\'m fine, thanks.', '"On va au marché ?" — Shall we go to the market?', '"Il va pleuvoir." — It\'s going to rain.'],
  },
  {
    verb: 'faire (to do / make)',
    note: 'Extremely versatile — used for weather ("il fait chaud"), sports ("faire du sport"), and dozens of fixed expressions.',
    forms: [
      { p: 'je', f: 'fais' }, { p: 'tu', f: 'fais' }, { p: 'il/elle', f: 'fait' },
      { p: 'nous', f: 'faisons' }, { p: 'vous', f: 'faites' }, { p: 'ils/elles', f: 'font' },
    ],
    examples: ['"Il fait beau aujourd\'hui." — The weather is nice today.', '"Qu\'est-ce que tu fais ?" — What are you doing?', '"Ils font la cuisine." — They are cooking.'],
  },
  {
    verb: 'vouloir (to want)',
    note: 'Key for politeness: "je voudrais" (conditional) = I would like — much softer than "je veux" which can sound demanding.',
    forms: [
      { p: 'je', f: 'veux' }, { p: 'tu', f: 'veux' }, { p: 'il/elle', f: 'veut' },
      { p: 'nous', f: 'voulons' }, { p: 'vous', f: 'voulez' }, { p: 'ils/elles', f: 'veulent' },
    ],
    examples: ['"Je voudrais un café, s\'il vous plaît." — I\'d like a coffee, please.', '"Tu veux venir ?" — Do you want to come?', '"Ils veulent partir tôt." — They want to leave early.'],
  },
  {
    verb: 'pouvoir (can / to be able to)',
    note: 'Used for ability and permission. "Je peux" = I can. "Est-ce que je peux…?" = Can I…? Note: "puis-je" is more formal.',
    forms: [
      { p: 'je', f: 'peux' }, { p: 'tu', f: 'peux' }, { p: 'il/elle', f: 'peut' },
      { p: 'nous', f: 'pouvons' }, { p: 'vous', f: 'pouvez' }, { p: 'ils/elles', f: 'peuvent' },
    ],
    examples: ['"Vous pouvez répéter, s\'il vous plaît ?" — Can you repeat please?', '"Je ne peux pas venir." — I can\'t come.', '"Ils peuvent nous aider." — They can help us.'],
  },
  {
    verb: 'devoir (must / to have to)',
    note: 'Expresses obligation and necessity. "Je dois" = I must / I have to. In the conditional: "je devrais" = I should.',
    forms: [
      { p: 'je', f: 'dois' }, { p: 'tu', f: 'dois' }, { p: 'il/elle', f: 'doit' },
      { p: 'nous', f: 'devons' }, { p: 'vous', f: 'devez' }, { p: 'ils/elles', f: 'doivent' },
    ],
    examples: ['"Je dois partir maintenant." — I have to leave now.', '"Tu dois travailler plus." — You must work more.', '"On devrait essayer." — We should try.'],
  },
  {
    verb: 'savoir (to know a fact/how to)',
    note: 'Know a fact or how to do something. Contrast with "connaître" (to know a person/place). "Je sais nager" = I know how to swim.',
    forms: [
      { p: 'je', f: 'sais' }, { p: 'tu', f: 'sais' }, { p: 'il/elle', f: 'sait' },
      { p: 'nous', f: 'savons' }, { p: 'vous', f: 'savez' }, { p: 'ils/elles', f: 'savent' },
    ],
    examples: ['"Je ne sais pas." — I don\'t know.', '"Sais-tu conduire ?" — Do you know how to drive?', '"Ils savent la vérité." — They know the truth.'],
  },
  {
    verb: 'venir (to come)',
    note: 'Also used for the recent past: "je viens de manger" = I have just eaten (I just ate). "Venir de + infinitive" = to have just done something.',
    forms: [
      { p: 'je', f: 'viens' }, { p: 'tu', f: 'viens' }, { p: 'il/elle', f: 'vient' },
      { p: 'nous', f: 'venons' }, { p: 'vous', f: 'venez' }, { p: 'ils/elles', f: 'viennent' },
    ],
    examples: ['"Je viens de France." — I come from France.', '"Il vient d\'arriver." — He has just arrived.', '"Viens avec moi !" — Come with me!'],
  },
  {
    verb: 'prendre (to take)',
    note: 'Highly frequent — used for transport, meals, decisions. "Prendre le bus", "prendre un café", "prendre une décision". The ils/elles form doubles the n.',
    forms: [
      { p: 'je', f: 'prends' }, { p: 'tu', f: 'prends' }, { p: 'il/elle', f: 'prend' },
      { p: 'nous', f: 'prenons' }, { p: 'vous', f: 'prenez' }, { p: 'ils/elles', f: 'prennent' },
    ],
    examples: ['"Je prends le métro." — I take the metro.', '"Qu\'est-ce que tu prends ?" — What are you having? (at a café)', '"Ils prennent leur temps." — They are taking their time.'],
  },
]

const REFLEXIVE_VERBS = [
  { fr: 'se lever', en: 'to get up', example: 'Je me lève à sept heures.', exEn: 'I get up at seven o\'clock.', note: 'Reflexive verbs use a matching pronoun (me/te/se/nous/vous/se). "Se" = oneself.' },
  { fr: 'se coucher', en: 'to go to bed', example: 'Il se couche tard le vendredi.', exEn: 'He goes to bed late on Fridays.', note: '"Coucher" = to lay/put down. "Se coucher" = to lay oneself down = go to bed.' },
  { fr: 's\'appeler', en: 'to be called / named', example: 'Je m\'appelle Sophie.', exEn: 'My name is Sophie. (I am called Sophie.)', note: 'Spelling change: "s\'appeler" doubles the l in most forms: je m\'appelle, tu t\'appelles.' },
  { fr: 'se réveiller', en: 'to wake up', example: 'Elle se réveille à six heures.', exEn: 'She wakes up at six o\'clock.', note: '"Réveiller" = to wake (someone). "Se réveiller" = to wake up (oneself).' },
  { fr: 'se laver', en: 'to wash (oneself)', example: 'Nous nous lavons avant de sortir.', exEn: 'We wash before going out.', note: '"Se laver les mains / les cheveux" = to wash one\'s hands / hair.' },
  { fr: 'se dépêcher', en: 'to hurry (up)', example: 'Dépêchez-vous ! Nous sommes en retard.', exEn: 'Hurry up! We are late.', note: 'Very common imperative: "Dépêche-toi !" (informal) / "Dépêchez-vous !" (formal/plural).' },
  { fr: 's\'habiller', en: 'to get dressed', example: 'Je m\'habille vite le matin.', exEn: 'I get dressed quickly in the morning.', note: '"Déshabiller" = to undress someone. "Se déshabiller" = to undress oneself.' },
  { fr: 'se souvenir (de)', en: 'to remember', example: 'Tu te souviens de lui ?', exEn: 'Do you remember him?', note: 'From "venir" family — conjugates like venir: je me souviens, tu te souviens, il se souvient.' },
]

const VERB_PHRASES = [
  { fr: 'Je voudrais apprendre le français couramment.', en: 'I would like to learn French fluently.', note: '"Voudrais" = conditional of vouloir — polite and aspirational.' },
  { fr: 'Tu sais parler espagnol ?', en: 'Do you know how to speak Spanish?', note: '"Savoir + infinitive" = to know how to do something.' },
  { fr: 'Il faut travailler dur pour réussir.', en: 'One must work hard to succeed.', note: '"Il faut" = it is necessary / one must. Impersonal expression with "falloir". Very common.' },
  { fr: 'Je viens de finir mon travail.', en: 'I have just finished my work.', note: '"Venir de + infinitive" = to have just done something. A key recent-past construction.' },
  { fr: 'Qu\'est-ce que tu es en train de faire ?', en: 'What are you (in the middle of) doing?', note: '"Être en train de + infinitive" = to be in the process of doing. The French present continuous.' },
  { fr: 'Elle a l\'air fatiguée — ça va ?', en: 'She looks tired — is she okay?', note: '"Avoir l\'air + adjective" = to look/seem. Note: the adjective can agree with the subject (fatiguée).' },
  { fr: 'On ferait mieux de partir maintenant.', en: 'We\'d better leave now.', note: '"Faire mieux de + infinitive" = to be better off doing something. Very natural French.' },
  { fr: 'Ça m\'est égal — comme tu veux.', en: 'It\'s all the same to me — whatever you want.', note: '"Ça m\'est égal" = I don\'t mind. "Comme tu veux" = as you wish.' },
  { fr: 'Il ne faut pas confondre "savoir" et "connaître".', en: 'You must not confuse "savoir" and "connaître".', note: '"Savoir" = know facts/how to. "Connaître" = know a person, place, or thing personally.' },
  { fr: 'Je n\'arrive pas à comprendre cette règle.', en: 'I can\'t manage to understand this rule.', note: '"Arriver à + infinitive" = to manage to do something. A very useful construction for expressing difficulty.' },
  { fr: 'Elle vient de se lever — elle est encore ensommeillée.', en: 'She has just got up — she\'s still sleepy.', note: '"Venir de + infinitive" combined with a reflexive verb. "Ensommeillé(e)" = drowsy/sleepy.' },
  { fr: 'Nous devons nous dépêcher — le train part dans dix minutes.', en: 'We must hurry — the train leaves in ten minutes.', note: '"Devoir + se dépêcher" = must hurry. Reflexive verb in infinitive after modal: "se" stays.' },
]

const VERB_TIPS = [
  {
    title: 'The Silent -ENT Rule',
    emoji: '🔇',
    desc: 'The ils/elles ending "-ent" is ALWAYS silent. "Ils parlent", "ils finissent", "ils vendent" — the -ent never changes the pronunciation. This means je/il/elle/ils often sound identical in -ER verbs. Context tells you who is speaking.',
  },
  {
    title: 'savoir vs connaître',
    emoji: '🧠',
    desc: 'Two verbs meaning "to know" — both essential, both different. "Savoir" = to know a fact or how to do something ("je sais que...", "je sais nager"). "Connaître" = to know a person, place or thing personally ("je connais Paris", "je connais Marie"). Never mix them.',
  },
  {
    title: 'The Near Future: aller + infinitive',
    emoji: '⏩',
    desc: '"Je vais manger" (I\'m going to eat), "il va pleuvoir" (it\'s going to rain) — this near-future construction is used constantly in spoken French, often replacing the proper future tense. Master "aller" and you have an instant future tense.',
  },
  {
    title: 'The Recent Past: venir de + infinitive',
    emoji: '⏮️',
    desc: '"Je viens de manger" (I have just eaten), "elle vient d\'arriver" (she has just arrived). This is the most natural way to express something that happened moments ago — much more common in conversation than the passé composé for very recent events.',
  },
  {
    title: 'Reflexive verbs in the passé composé',
    emoji: '🔄',
    desc: 'ALL reflexive verbs use être (not avoir) in the passé composé: "je me suis levé(e)" (I got up), "elle s\'est habillée" (she got dressed). The past participle must agree with the subject in gender and number.',
  },
  {
    title: 'Modal verbs + infinitive',
    emoji: '🔗',
    desc: 'Modal verbs (vouloir, pouvoir, devoir, savoir, falloir) are always followed by an infinitive: "je veux partir", "tu peux venir", "il doit travailler". The main verb stays in the infinitive — never conjugated again.',
  },
]

export default function FrenchVerbs() {
  const [tab, setTab] = useState('groups')
  const [activeGroup, setActiveGroup] = useState(0)
  const [activeIrr, setActiveIrr] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Verb Groups | SayBonjour!" description="Master French verb groups — -ER, -IR, -RE regular verbs, essential irregular verbs, reflexive verbs, and key verb patterns." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Verb Groups</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les groupes de verbes — regular verbs, irregular verbs, reflexive verbs, and key patterns</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-6">
          <strong>Quick guide:</strong> French has 3 verb groups by infinitive ending (-ER, -IR, -RE), plus irregular verbs that follow their own rules. The good news: ~90% of verbs are -ER verbs, and all new verbs join this group.
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'groups', label: 'Regular Verbs' },
            { id: 'irregulars', label: 'Irregular Verbs' },
            { id: 'reflexive', label: 'Reflexive Verbs' },
            { id: 'phrases', label: 'In Context' },
            { id: 'tips', label: 'Key Tips' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); addXP(3, 'grammar') }}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'groups' && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {VERB_GROUPS.map((g, i) => (
                <button key={g.group} onClick={() => { setActiveGroup(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium font-mono transition-colors ${activeGroup === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {g.group.split(' ')[0]}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <h2 className="font-bold text-lg text-gray-900 dark:text-cream-50 font-playfair mb-1">{VERB_GROUPS[activeGroup].group}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{VERB_GROUPS[activeGroup].rule}</p>
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Model: <span className="text-burgundy-600">{VERB_GROUPS[activeGroup].model}</span></p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {VERB_GROUPS[activeGroup].conjugation.map((c, i) => (
                  <motion.div key={c.pronoun} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2 text-center cursor-pointer"
                    onClick={() => addXP(2, 'grammar')}>
                    <p className="text-xs text-gray-400 mb-0.5">{c.pronoun}</p>
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <SpeakButton text={`${c.pronoun} ${c.form}`} size="sm" />
                      <p className="font-bold text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{c.form}</p>
                    </div>
                    {c.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">{c.note}</p>}
                  </motion.div>
                ))}
              </div>
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Other {VERB_GROUPS[activeGroup].group.split(' ')[0]} verbs</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {VERB_GROUPS[activeGroup].otherVerbs.map(item => (
                    <div key={item.v} className="flex items-center gap-1 bg-cream-50 dark:bg-dark-warm-200 rounded-lg px-2 py-1 cursor-pointer"
                      onClick={() => addXP(2, 'vocabulary')}>
                      <SpeakButton text={item.v} size="sm" />
                      <div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{item.v}</span>
                        <span className="text-xs text-gray-400 ml-1">— {item.en}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Note</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{VERB_GROUPS[activeGroup].note}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">⚠️ Watch Out</p>
                <p className="text-sm text-red-800 dark:text-red-300">{VERB_GROUPS[activeGroup].warning}</p>
              </div>
            </div>
          </>
        )}

        {tab === 'irregulars' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {ESSENTIAL_IRREGULARS.map((v, i) => (
                <button key={v.verb} onClick={() => { setActiveIrr(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium font-mono transition-colors ${activeIrr === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {v.verb.split(' ')[0]}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <h2 className="font-bold text-lg text-gray-900 dark:text-cream-50 font-playfair mb-2">{ESSENTIAL_IRREGULARS[activeIrr].verb}</h2>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-amber-800 dark:text-amber-300">💡 {ESSENTIAL_IRREGULARS[activeIrr].note}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {ESSENTIAL_IRREGULARS[activeIrr].forms.map((f, i) => (
                  <motion.div key={f.p} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2 text-center cursor-pointer"
                    onClick={() => addXP(2, 'grammar')}>
                    <p className="text-xs text-gray-400 mb-0.5">{f.p}</p>
                    <div className="flex items-center justify-center gap-1">
                      <SpeakButton text={`${f.p} ${f.f}`} size="sm" />
                      <p className="font-bold text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{f.f}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">In use</p>
                <div className="space-y-2">
                  {ESSENTIAL_IRREGULARS[activeIrr].examples.map((ex, i) => (
                    <div key={i} className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2">
                      <SpeakButton text={ex.split(' — ')[0].replace(/^"/, '').replace(/"$/, '')} size="sm" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-0.5">{ex}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'reflexive' && (
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-2">
              <strong>Reflexive verbs</strong> (verbes pronominaux) include a reflexive pronoun that changes with the subject: me / te / se / nous / vous / se. They describe actions done to oneself, or actions that are inherently reciprocal.
            </div>
            {REFLEXIVE_VERBS.map((item, i) => (
              <motion.div key={item.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 cursor-pointer"
                onClick={() => addXP(3, 'grammar')}>
                <div className="flex items-start gap-3 mb-2">
                  <SpeakButton text={item.fr} size="sm" />
                  <div>
                    <span className="font-bold text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">— {item.en}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-1 ml-8">
                  <SpeakButton text={item.example} size="sm" />
                  <p className="text-sm italic text-gray-700 dark:text-cream-100">"{item.example}"</p>
                </div>
                <p className="text-xs text-gray-400 ml-8 mb-1">{item.exEn}</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic ml-8">💡 {item.note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {VERB_PHRASES.map((phrase, i) => (
              <motion.div key={phrase.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3 cursor-pointer"
                onClick={() => addXP(2, 'grammar')}>
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

        {tab === 'tips' && (
          <div className="space-y-4">
            {VERB_TIPS.map((tip, i) => (
              <motion.div key={tip.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4 cursor-pointer"
                onClick={() => addXP(4, 'grammar')}>
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
