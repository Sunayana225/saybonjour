import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const PRONOUN_SECTIONS = [
  {
    name: 'Subject Pronouns',
    level: 'A1',
    desc: 'Replace the subject of the verb — who or what performs the action.',
    pronouns: [
      { fr: 'je', en: 'I', note: 'Becomes "j\'" before a vowel or mute h: j\'ai, j\'aime, j\'habite. Always lowercase unless starting a sentence.' },
      { fr: 'tu', en: 'you (informal singular)', note: 'Used with friends, family, children, peers. Using "tu" with a stranger or authority figure can seem presumptuous.' },
      { fr: 'il', en: 'he / it (masc)', note: 'Also used for masculine inanimate objects: "Le livre — il est intéressant." = The book — it\'s interesting.' },
      { fr: 'elle', en: 'she / it (fem)', note: 'Also for feminine objects: "La voiture — elle est rouge." French assigns gender to ALL nouns.' },
      { fr: 'on', en: 'we / one / people (informal)', note: '"On" is extremely common in spoken French for "we". "On y va ?" = Shall we go? Conjugates like "il/elle".' },
      { fr: 'nous', en: 'we (formal/written)', note: 'More formal than "on". Common in writing and formal speech. "Nous allons" vs "on va" — same meaning, different register.' },
      { fr: 'vous', en: 'you (formal singular or any plural)', note: 'Can be formal singular (vouvoyer) OR any plural. Context determines. "Vous" = the safe default with any adult stranger.' },
      { fr: 'ils', en: 'they (masc or mixed group)', note: 'Used for all-male groups AND mixed groups. "Ils" applies even if 99 women and 1 man are in the group.' },
      { fr: 'elles', en: 'they (all-female group only)', note: 'Only used when the ENTIRE group is female. One male in the group = "ils". This is a frequent point of French grammar controversy.' },
    ],
  },
  {
    name: 'Direct Object Pronouns',
    level: 'A2',
    desc: 'Replace the direct object — what/who receives the action directly, without a preposition. Come BEFORE the conjugated verb.',
    pronouns: [
      { fr: 'me (m\')', en: 'me', note: 'Becomes "m\'" before a vowel: "Il m\'aime." = He loves me.' },
      { fr: 'te (t\')', en: 'you (informal)', note: '"Tu me vois ?" = Can you see me? "Je te vois." = I can see you.' },
      { fr: 'le (l\')', en: 'him / it (masc)', note: '"Je le connais." = I know him. "Je le lis." = I\'m reading it (masc noun). "l\'" before vowel.' },
      { fr: 'la (l\')', en: 'her / it (fem)', note: '"Je la connais." = I know her. "Je la lis." = I\'m reading it (fem noun). "l\'" before vowel.' },
      { fr: 'nous', en: 'us', note: '"Elle nous invite." = She\'s inviting us. Same form as subject pronoun.' },
      { fr: 'vous', en: 'you (formal/plural)', note: '"Je vous remercie." = I thank you. Used in formal and plural contexts.' },
      { fr: 'les', en: 'them', note: '"Je les connais." = I know them. "Je les aime." = I love them. Works for masculine, feminine, mixed groups.' },
    ],
    examples: [
      { fr: 'Je le vois.', en: 'I see him / I see it.' },
      { fr: 'Tu la connais ?', en: 'Do you know her?' },
      { fr: 'Elle nous invite.', en: 'She\'s inviting us.' },
      { fr: 'Je les aime.', en: 'I love them.' },
      { fr: 'Il m\'appelle tous les jours.', en: 'He calls me every day.' },
      { fr: 'Je ne le comprends pas.', en: 'I don\'t understand him/it.' },
    ],
  },
  {
    name: 'Indirect Object Pronouns',
    level: 'B1',
    desc: 'Replace indirect objects — to/for whom the action is done. Used with verbs that take "à": parler à, donner à, téléphoner à, écrire à.',
    pronouns: [
      { fr: 'me (m\')', en: 'to me', note: '"Il me parle." = He speaks to me. Unstressed form — must stay near the verb.' },
      { fr: 'te (t\')', en: 'to you (informal)', note: '"Je te téléphone ce soir." = I\'ll call you tonight.' },
      { fr: 'lui', en: 'to him / to her', note: 'Note: "lui" covers BOTH masculine and feminine. "Je lui parle." = I speak to him OR to her.' },
      { fr: 'nous', en: 'to us', note: '"Il nous écrit." = He writes to us. Same as subject and direct object form.' },
      { fr: 'vous', en: 'to you (formal/plural)', note: '"Je vous enverrai un email." = I\'ll send you an email.' },
      { fr: 'leur', en: 'to them', note: '"Je leur explique." = I explain to them. Don\'t confuse "leur" (indirect object) with "les" (direct object).' },
    ],
    examples: [
      { fr: 'Je lui parle.', en: 'I\'m speaking to him/her.' },
      { fr: 'Il leur écrit.', en: 'He writes to them.' },
      { fr: 'Elle me donne le livre.', en: 'She gives me the book.' },
      { fr: 'Tu lui as téléphoné ?', en: 'Did you call him/her?' },
      { fr: 'Je vous enverrai les détails.', en: 'I\'ll send you the details.' },
    ],
  },
  {
    name: 'Reflexive Pronouns',
    level: 'A2',
    desc: 'Used with reflexive verbs ("verbes pronominaux") — where the subject and object are the same person. Always placed between subject and verb.',
    pronouns: [
      { fr: 'me', en: 'myself', note: '"Je me lève." = I get (myself) up. Huge category in French — hundreds of reflexive verbs.' },
      { fr: 'te', en: 'yourself', note: '"Tu te rappelles ?" = Do you remember? (lit. do you recall to yourself?)' },
      { fr: 'se', en: 'himself / herself / itself / themselves', note: '"Il se lave." = He washes himself. "Elles s\'appellent." = They call themselves (their names are).' },
      { fr: 'nous', en: 'ourselves', note: '"Nous nous aimons." = We love each other. Reflexive "nous" can also mean reciprocal.' },
      { fr: 'vous', en: 'yourself/yourselves', note: '"Vous vous souvenez ?" = Do you remember?' },
    ],
    examples: [
      { fr: 'Je me lève à 7h.', en: 'I get up at 7.' },
      { fr: 'Il se lave les mains.', en: 'He washes his hands.' },
      { fr: 'Nous nous amusons bien.', en: 'We\'re having fun.' },
      { fr: 'Elle s\'appelle Marie.', en: 'Her name is Marie (she calls herself Marie).' },
      { fr: 'Ils se téléphonent chaque soir.', en: 'They call each other every evening.' },
    ],
  },
  {
    name: 'Stressed Pronouns',
    level: 'A2',
    desc: 'Used after prepositions, in comparisons, for emphasis, and in short answers. Also called "pronoms toniques" or "pronoms disjoints".',
    pronouns: [
      { fr: 'moi', en: 'me / I (stressed)', note: '"C\'est pour moi." = It\'s for me. "Moi, j\'adore le cinéma." = As for me, I love cinema.' },
      { fr: 'toi', en: 'you (stressed)', note: '"C\'est à toi." = It\'s your turn. "Toi et moi" = you and me.' },
      { fr: 'lui', en: 'him', note: '"C\'est lui." = It\'s him. "Avec lui" = with him. Note: same form as indirect object pronoun.' },
      { fr: 'elle', en: 'her', note: '"C\'est elle." = It\'s her. "Chez elle" = at her place.' },
      { fr: 'nous', en: 'us', note: '"C\'est pour nous." = It\'s for us. "Entre nous" = between us.' },
      { fr: 'vous', en: 'you (formal/plural)', note: '"C\'est à vous." = It\'s your turn/it belongs to you.' },
      { fr: 'eux', en: 'them (masc)', note: '"C\'est eux." = It\'s them. "Avec eux" = with them.' },
      { fr: 'elles', en: 'them (fem)', note: '"C\'est elles." = It\'s them (all female group). "Chez elles" = at their place.' },
    ],
    examples: [
      { fr: 'C\'est pour moi.', en: 'It\'s for me.' },
      { fr: 'Chez toi ou chez moi ?', en: 'At your place or mine?' },
      { fr: 'Il est plus grand que lui.', en: 'He\'s taller than him.' },
      { fr: 'Moi, je préfère le café.', en: 'I prefer coffee (for my part).' },
      { fr: 'C\'est elle qui a raison.', en: 'She\'s the one who\'s right.' },
    ],
  },
  {
    name: 'Y and En',
    level: 'B1',
    desc: 'Two special pronouns that replace prepositional phrases. Both come before the verb (like other object pronouns).',
    pronouns: [
      { fr: 'y', en: 'there / at it / to it', note: '"J\'y vais" = I\'m going there. Replaces "à + place or thing". Also used with verbs: penser à, croire à, réfléchir à.' },
      { fr: 'en', en: 'of it / some / from there', note: '"J\'en veux" = I want some. Replaces "de + noun" or a quantity. Also: "J\'en viens" = I\'m coming from there.' },
    ],
    examples: [
      { fr: 'J\'y vais ce soir.', en: 'I\'m going there tonight.' },
      { fr: 'Tu y penses ?', en: 'Are you thinking about it?' },
      { fr: 'J\'en ai besoin.', en: 'I need some / I need it.' },
      { fr: 'Il en parle souvent.', en: 'He talks about it often.' },
      { fr: 'On en a assez.', en: 'We have enough of it.' },
      { fr: 'J\'y habite depuis 3 ans.', en: 'I\'ve been living there for 3 years.' },
    ],
  },
]

const PRONOUN_ORDER = [
  { pos: 1, pronouns: ['me', 'te', 'se', 'nous', 'vous'], label: 'Reflexive / 1st & 2nd person', note: 'me/te/se/nous/vous always come first' },
  { pos: 2, pronouns: ['le', 'la', 'les'], label: 'Direct object (3rd person)', note: 'Direct objects of 3rd person: le/la/les' },
  { pos: 3, pronouns: ['lui', 'leur'], label: 'Indirect object (3rd person)', note: 'To him/her/them: lui/leur' },
  { pos: 4, pronouns: ['y'], label: '"Y" — place or à + thing', note: '"Y" comes before "en"' },
  { pos: 5, pronouns: ['en'], label: '"En" — de + noun or quantity', note: '"En" is always last (before the verb)' },
]

const PRONOUN_ORDER_EXAMPLES = [
  { fr: 'Il me le donne.', en: 'He gives it to me.', breakdown: 'me (to me) + le (it/direct)' },
  { fr: 'Elle lui en parle.', en: 'She talks to him/her about it.', breakdown: 'lui (to him/her) + en (about it)' },
  { fr: 'Je l\'y ai vu.', en: 'I saw him/it there.', breakdown: 'l\' (him/it) + y (there)' },
  { fr: 'Il nous en a donné.', en: 'He gave us some.', breakdown: 'nous (to us) + en (some)' },
  { fr: 'Elle se le rappelle.', en: 'She remembers it.', breakdown: 'se (reflexive) + le (it)' },
]

const COMMON_MISTAKES = [
  {
    mistake: 'Using "lui" for direct objects',
    wrong: 'Je lui vois.',
    right: 'Je le vois. / Je la vois.',
    en: 'I see him/her.',
    explanation: '"Lui" is only for INDIRECT objects (to him/her). For direct objects, use "le" (masc) or "la" (fem). "Voir" takes a direct object — no "à" involved.',
  },
  {
    mistake: 'Wrong placement in negative sentences',
    wrong: 'Je le ne veux pas.',
    right: 'Je ne le veux pas.',
    en: 'I don\'t want it.',
    explanation: 'The object pronoun stays between "ne" and the verb. The order is: ne + pronoun + verb + pas.',
  },
  {
    mistake: 'Confusing "leur" (indirect) with "les" (direct)',
    wrong: 'Je les ai expliqué le problème.',
    right: 'Je leur ai expliqué le problème.',
    en: 'I explained the problem to them.',
    explanation: '"Expliquer" takes an indirect object (expliquer à quelqu\'un). So use "leur" (to them), not "les" (them as direct object).',
  },
  {
    mistake: 'Forgetting agreement with "les" in past tense',
    wrong: 'Je les ai vu.',
    right: 'Je les ai vus. / Je les ai vues.',
    en: 'I saw them.',
    explanation: 'When a direct object pronoun precedes a verb in passé composé, the past participle agrees in gender and number. "Les" = plural → add "s". If fem → "vues".',
  },
  {
    mistake: 'Using "on" placement wrong in negation',
    wrong: 'On n\'y vais pas.',
    right: 'On n\'y va pas.',
    en: 'We\'re not going there.',
    explanation: '"On" conjugates like "il/elle" — so "on va" not "on vais". The "y" goes after "ne" before the verb: on n\'y va pas.',
  },
  {
    mistake: 'Mixing up "y" and "en" for locations',
    wrong: 'J\'en vais — je viens de Paris.',
    right: 'J\'en viens. / J\'y vais.',
    en: 'I come from there. / I\'m going there.',
    explanation: '"Y" = going TO a place (à + place). "En" = coming FROM a place (de + place). "J\'y vais" = going there. "J\'en viens" = coming from there.',
  },
]

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
}

export default function FrenchPronounsGuide() {
  const [activeSection, setActiveSection] = useState(0)
  const [tab, setTab] = useState('types')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Pronouns Guide | SayBonjour!" description="Master all French pronouns — subject, direct/indirect object, reflexive, stressed, y and en — with examples, order rules, and common mistakes." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Pronouns Guide</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les pronoms — subject, object, reflexive, stressed, y, en, order rules, and common mistakes</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'types', label: 'Pronoun Types' },
            { id: 'order', label: 'Pronoun Order' },
            { id: 'mistakes', label: 'Common Mistakes' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'types' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {PRONOUN_SECTIONS.map((s, i) => (
                <button key={s.name} onClick={() => { setActiveSection(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${activeSection === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {s.name}
                  <span className={`text-xs px-1 py-0.5 rounded font-bold ${activeSection === i ? 'bg-white/20 text-white' : LEVEL_COLORS[s.level]}`}>{s.level}</span>
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-bold text-xl font-playfair text-gray-900 dark:text-cream-50">{PRONOUN_SECTIONS[activeSection].name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[PRONOUN_SECTIONS[activeSection].level]}`}>{PRONOUN_SECTIONS[activeSection].level}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{PRONOUN_SECTIONS[activeSection].desc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {PRONOUN_SECTIONS[activeSection].pronouns.map((p, i) => (
                  <motion.div key={p.fr} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2.5"
                    onClick={() => addXP(2, 'grammar')}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <SpeakButton text={p.fr} size="sm" />
                      <span className="font-bold text-base font-mono text-burgundy-700 dark:text-burgundy-vibrant-300">{p.fr}</span>
                      <span className="text-xs text-gray-400 ml-1">— {p.en}</span>
                    </div>
                    {p.note && <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-0.5">💡 {p.note}</p>}
                  </motion.div>
                ))}
              </div>

              {PRONOUN_SECTIONS[activeSection].examples && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Examples</p>
                  {PRONOUN_SECTIONS[activeSection].examples.map((ex, i) => (
                    <div key={ex.fr} className="flex items-center gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5"
                      onClick={() => addXP(2, 'grammar')}>
                      <SpeakButton text={ex.fr} size="sm" />
                      <div>
                        <p className="font-medium text-sm italic text-gray-900 dark:text-cream-50">"{ex.fr}"</p>
                        <p className="text-xs text-gray-400">{ex.en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setActiveSection(i => Math.max(0, i - 1))} disabled={activeSection === 0}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors">
                ← Previous
              </button>
              <button onClick={() => { setActiveSection(i => Math.min(PRONOUN_SECTIONS.length - 1, i + 1)); addXP(3, 'grammar') }} disabled={activeSection === PRONOUN_SECTIONS.length - 1}
                className="flex-1 py-2.5 rounded-xl bg-burgundy-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-burgundy-700 transition-colors">
                Next →
              </button>
            </div>
          </>
        )}

        {tab === 'order' && (
          <div className="space-y-5">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              💡 When you use multiple pronouns in the same sentence, there is a strict order they must follow. Memorise this sequence.
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">French pronoun order (before the verb)</p>
              <div className="flex flex-wrap gap-2 items-center justify-center mb-4">
                {PRONOUN_ORDER.map((pos, i) => (
                  <React.Fragment key={pos.pos}>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{pos.pos}</div>
                      <div className="flex gap-1">
                        {pos.pronouns.map(p => (
                          <span key={p} className="font-mono font-bold text-sm bg-burgundy-50 dark:bg-burgundy-vibrant-900/10 text-burgundy-700 dark:text-burgundy-vibrant-300 border border-burgundy-200 dark:border-burgundy-vibrant-700 rounded-lg px-2 py-1">{p}</span>
                        ))}
                      </div>
                    </div>
                    {i < PRONOUN_ORDER.length - 1 && <span className="text-gray-300 font-bold">→</span>}
                  </React.Fragment>
                ))}
                <span className="text-gray-300 font-bold">→</span>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">VERB</div>
                  <span className="font-mono font-bold text-sm bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-1">verb</span>
                </div>
              </div>
              <div className="space-y-2">
                {PRONOUN_ORDER.map((pos, i) => (
                  <div key={pos.pos} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-burgundy-100 dark:bg-burgundy-vibrant-900/20 text-burgundy-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{pos.pos}</span>
                    <div>
                      <span className="font-medium text-gray-800 dark:text-cream-50">{pos.label}</span>
                      <span className="text-gray-400 text-xs ml-2">— {pos.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Examples with multiple pronouns</p>
              <div className="space-y-3">
                {PRONOUN_ORDER_EXAMPLES.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3"
                    onClick={() => addXP(3, 'grammar')}>
                    <SpeakButton text={ex.fr} size="sm" />
                    <div>
                      <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{ex.fr}"</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.en}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {ex.breakdown}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
              <strong>In negative sentences:</strong> ne + [pronoun(s)] + verb + pas. Example: "Il ne me le donne pas." = He doesn\'t give it to me.
            </div>
          </div>
        )}

        {tab === 'mistakes' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-800 dark:text-red-300 mb-2">
              These are the most common pronoun errors made by English-speaking learners. Recognising and correcting them is key to sounding natural.
            </div>
            {COMMON_MISTAKES.map((item, i) => (
              <motion.div key={item.mistake} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(4, 'grammar')}>
                <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-3">{item.mistake}</h3>
                <div className="grid sm:grid-cols-2 gap-2 mb-3">
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-xl px-3 py-2.5">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">✗ Wrong</p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={item.wrong} size="sm" />
                      <p className="text-sm italic text-red-700 dark:text-red-300 font-medium">{item.wrong}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-3 py-2.5">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide mb-1">✓ Correct</p>
                    <div className="flex items-center gap-2">
                      <SpeakButton text={item.right} size="sm" />
                      <p className="text-sm italic text-emerald-700 dark:text-emerald-300 font-medium">{item.right}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic mb-2">"{item.en}"</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">💡 {item.explanation}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
