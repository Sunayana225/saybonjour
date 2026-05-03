import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const ADJECTIVE_GROUPS = [
  {
    category: 'Personality & Character',
    level: 'A2',
    items: [
      { masc: 'gentil', fem: 'gentille', en: 'kind / nice', example: 'Il est très gentil avec ses amis.', note: 'Doubles the l in feminine: gentil → gentille.' },
      { masc: 'sympa(thique)', fem: 'sympa(thique)', en: 'friendly / likeable', example: "C'est une fille vraiment sympa.", note: 'Invariable in informal use — same form for all genders and numbers.' },
      { masc: 'intelligent', fem: 'intelligente', en: 'intelligent / clever', example: 'Elle est très intelligente.' },
      { masc: 'drôle', fem: 'drôle', en: 'funny / amusing', example: 'Tu es drôle ce soir.', note: 'Same form for masculine and feminine — ends in -e.' },
      { masc: 'sérieux', fem: 'sérieuse', en: 'serious / hardworking', example: 'Il est très sérieux dans son travail.', note: '-eux → -euse in feminine. Very productive pattern.' },
      { masc: 'généreux', fem: 'généreuse', en: 'generous', example: 'Ma grand-mère est très généreuse.' },
      { masc: 'courageux', fem: 'courageuse', en: 'brave / courageous', example: 'Elle a été très courageuse.' },
      { masc: 'paresseux', fem: 'paresseuse', en: 'lazy', example: 'Ne sois pas paresseux !' },
      { masc: 'timide', fem: 'timide', en: 'shy / timid', example: 'Il est timide avec les inconnus.', note: 'Same form for both genders — ends in -e.' },
      { masc: 'bavard', fem: 'bavarde', en: 'talkative / chatty', example: 'Ma sœur est très bavarde.' },
      { masc: 'curieux', fem: 'curieuse', en: 'curious / nosy', example: 'Les enfants sont toujours curieux.' },
      { masc: 'honnête', fem: 'honnête', en: 'honest', example: 'Sois honnête avec moi.', note: 'Same form for both genders.' },
      { masc: 'têtu', fem: 'têtue', en: 'stubborn / headstrong', example: "Il est têtu comme une mule.", note: '"Têtu comme une mule" = stubborn as a mule — a common French idiom.' },
      { masc: 'ambitieux', fem: 'ambitieuse', en: 'ambitious', example: 'Elle est très ambitieuse dans sa carrière.' },
      { masc: 'créatif', fem: 'créative', en: 'creative', example: "Tu as un esprit très créatif.", note: '-if → -ive in feminine. Pattern shared with: actif/active, naïf/naïve, sportif/sportive.' },
    ],
  },
  {
    category: 'Size & Appearance',
    level: 'A1',
    items: [
      { masc: 'grand', fem: 'grande', en: 'tall / big', example: "Il est grand pour son âge.", note: 'In BAGS — comes before the noun: "un grand homme" (a great man) vs "un homme grand" (a tall man).' },
      { masc: 'petit', fem: 'petite', en: 'small / short', example: 'Elle est petite mais dynamique.', note: 'In BAGS — before noun: "une petite maison". Also used affectionately: "mon petit" = my dear.' },
      { masc: 'beau', fem: 'belle', en: 'beautiful / handsome', example: "C'est un bel homme.", note: 'beau → bel before vowel or mute h: "un bel appartement". Feminine: belle.' },
      { masc: 'joli', fem: 'jolie', en: 'pretty / nice', example: "C'est une jolie robe." },
      { masc: 'mince', fem: 'mince', en: 'slim / thin', example: 'Elle est très mince.', note: 'Same form for both genders — ends in -e.' },
      { masc: 'gros', fem: 'grosse', en: 'big / fat / thick', example: 'Un gros problème !', note: 'Doubles consonant in feminine: -s → -sse. Also used figuratively: "un gros problème" = a big problem.' },
      { masc: 'vieux', fem: 'vieille', en: 'old (person/thing)', example: 'Un vieil ami de ma famille.', note: 'vieux → vieil before vowel/h. Irregular feminine: vieille. "Mon vieux" = old friend (affectionate).' },
      { masc: 'jeune', fem: 'jeune', en: 'young', example: 'Elle est encore très jeune.', note: 'Same form for both genders.' },
      { masc: 'nouveau', fem: 'nouvelle', en: 'new / fresh', example: 'Un nouvel appartement.', note: 'nouveau → nouvel before vowel/h. Placed before noun (BAGS).' },
      { masc: 'fort', fem: 'forte', en: 'strong / good at', example: 'Elle est forte en maths.', note: '"Fort en" = good at (a subject). "Il est fort en cuisine" = he\'s a great cook.' },
    ],
  },
  {
    category: 'Qualities & Properties',
    level: 'A2',
    items: [
      { masc: 'bon', fem: 'bonne', en: 'good', example: "C'est une bonne idée.", note: 'Doubles consonant: -n → -nne. Placed before noun (BAGS). "Bon" vs "bien" — bon modifies nouns, bien modifies verbs.' },
      { masc: 'mauvais', fem: 'mauvaise', en: 'bad', example: "C'est une mauvaise habitude." },
      { masc: 'long', fem: 'longue', en: 'long', example: "C'est un long voyage." },
      { masc: 'court', fem: 'courte', en: 'short (length)', example: 'Une robe courte.' },
      { masc: 'lourd', fem: 'lourde', en: 'heavy', example: 'Ce sac est très lourd.' },
      { masc: 'léger', fem: 'légère', en: 'light (weight) / gentle', example: 'Un repas léger.', note: '-er → -ère in feminine (accent change). Also: "un vent léger" = a gentle breeze.' },
      { masc: 'chaud', fem: 'chaude', en: 'hot / warm', example: "L'eau est bien chaude.", note: '"Avoir chaud" = to be hot (person). "Il fait chaud" = it\'s hot (weather). "Chaud" as adjective describes the thing, not the person.' },
      { masc: 'froid', fem: 'froide', en: 'cold', example: 'Il fait très froid ce matin.' },
      { masc: 'doux', fem: 'douce', en: 'soft / gentle / mild / sweet', example: 'Un tissu très doux.', note: '-oux → -ouce in feminine. Also: "le temps est doux" = the weather is mild.' },
      { masc: 'dur', fem: 'dure', en: 'hard / tough / difficult', example: "C'est dur comme travail." },
      { masc: 'propre', fem: 'propre', en: 'clean / own (different meaning before/after)', example: 'Ma propre chambre (my own room) / une chambre propre (a clean room).', note: 'Before noun: "own". After noun: "clean". Same form — context is everything.' },
      { masc: 'plein', fem: 'pleine', en: 'full', example: 'Le verre est plein.' },
      { masc: 'vide', fem: 'vide', en: 'empty', example: 'Le frigo est vide.', note: 'Same form for both genders.' },
    ],
  },
  {
    category: 'Opinion & Feeling',
    level: 'B1',
    items: [
      { masc: 'content', fem: 'contente', en: 'happy / pleased / satisfied', example: 'Je suis très content de ce résultat.' },
      { masc: 'triste', fem: 'triste', en: 'sad', example: "Elle est triste aujourd'hui.", note: 'Same form for both genders.' },
      { masc: 'fatigué', fem: 'fatiguée', en: 'tired / exhausted', example: 'Je suis complètement fatigué.', note: '"Crevé(e)" = exhausted (informal). "Épuisé(e)" = utterly drained.' },
      { masc: 'heureux', fem: 'heureuse', en: 'happy / joyful', example: "Elle a l'air très heureuse." },
      { masc: 'inquiet', fem: 'inquiète', en: 'worried / anxious', example: 'Je suis très inquiet pour toi.', note: '-et → -ète in feminine (accent change). "Je m\'inquiète" = I\'m worried (reflexive verb).' },
      { masc: 'fâché', fem: 'fâchée', en: 'angry / cross', example: 'Il est fâché contre moi.', note: '"Être fâché avec quelqu\'un" = to have fallen out with someone.' },
      { masc: 'surpris', fem: 'surprise', en: 'surprised', example: 'Elle était très surprise.', note: 'Note the -e added in feminine: surpris → surprise.' },
      { masc: 'ennuyeux', fem: 'ennuyeuse', en: 'boring / tedious', example: 'Ce film est vraiment ennuyeux.' },
      { masc: 'intéressant', fem: 'intéressante', en: 'interesting', example: "C'est un sujet très intéressant." },
      { masc: 'difficile', fem: 'difficile', en: 'difficult', example: "C'est difficile à expliquer.", note: 'Same form for both genders.' },
      { masc: 'passionnant', fem: 'passionnante', en: 'exciting / fascinating', example: "C'est une histoire passionnante." },
    ],
  },
  {
    category: 'Nationalities & Origin',
    level: 'A1',
    items: [
      { masc: 'français', fem: 'française', en: 'French', example: 'Il est français.', note: 'Lowercase when adjective: "il est français". Uppercase only as a noun: "un Français". Critical rule.' },
      { masc: 'anglais', fem: 'anglaise', en: 'English', example: 'Elle est anglaise.' },
      { masc: 'espagnol', fem: 'espagnole', en: 'Spanish', example: 'Mon ami est espagnol.' },
      { masc: 'allemand', fem: 'allemande', en: 'German', example: 'Elle est allemande.' },
      { masc: 'américain', fem: 'américaine', en: 'American', example: 'Il est américain.' },
      { masc: 'japonais', fem: 'japonaise', en: 'Japanese', example: "C'est un restaurant japonais." },
      { masc: 'chinois', fem: 'chinoise', en: 'Chinese', example: 'La cuisine chinoise est délicieuse.' },
      { masc: 'italien', fem: 'italienne', en: 'Italian', example: "C'est un chanteur italien.", note: '-ien → -ienne in feminine (doubles the n). Pattern: canadien/canadienne, coréen/coréenne.' },
      { masc: 'brésilien', fem: 'brésilienne', en: 'Brazilian', example: 'Elle est brésilienne.' },
      { masc: 'marocain', fem: 'marocaine', en: 'Moroccan', example: 'Le couscous est un plat marocain.' },
    ],
  },
  {
    category: 'B1+ Advanced Adjectives',
    level: 'B1',
    items: [
      { masc: 'épanoui', fem: 'épanouie', en: 'fulfilled / flourishing', example: 'Elle semble vraiment épanouie.', note: '"S\'épanouir" = to flourish, to bloom (verb). Used of careers, relationships, personal growth.' },
      { masc: 'déconcertant', fem: 'déconcertante', en: 'disconcerting / baffling', example: 'Sa réaction était déconcertante.' },
      { masc: 'poignant', fem: 'poignante', en: 'poignant / deeply moving', example: "C'est une histoire vraiment poignante.", note: 'From "poignarder" (to stab) — poignant originally meant "stabbing the heart". Now simply: deeply moving.' },
      { masc: 'subtil', fem: 'subtile', en: 'subtle', example: "C'est une différence très subtile.", note: 'The -l is silent in masculine but the -e in "subtile" makes the l audible. A common spelling trap.' },
      { masc: 'saisissant', fem: 'saisissante', en: 'striking / stunning', example: 'Une ressemblance saisissante.' },
      { masc: 'ingénieux', fem: 'ingénieuse', en: 'ingenious / clever', example: "C'est une solution ingénieuse." },
      { masc: 'bienveillant', fem: 'bienveillante', en: 'benevolent / kind-hearted', example: 'Un professeur très bienveillant.', note: '"Bienveillance" (kindness, goodwill) is a key concept in French education and workplace culture.' },
      { masc: 'navrant', fem: 'navrante', en: 'distressing / lamentable', example: "C'est navrant de voir ça.", note: '"Être navré" = to be deeply sorry. "Je suis navré" = I\'m terribly sorry (very formal, sincere apology).' },
    ],
  },
]

const GRAMMAR_RULES = [
  {
    rule: 'Basic agreement',
    desc: 'Adjectives in French must agree in gender (masculine/feminine) and number (singular/plural) with the noun they describe. Four forms are possible: masc sg, fem sg, masc pl, fem pl.',
    examples: [
      { fr: 'un chien noir', en: 'a black dog (masc sg)' },
      { fr: 'une voiture noire', en: 'a black car (fem sg)' },
      { fr: 'des chiens noirs', en: 'black dogs (masc pl)' },
      { fr: 'des voitures noires', en: 'black cars (fem pl)' },
    ],
  },
  {
    rule: 'BAGS — adjectives before the noun',
    desc: "Most adjectives follow the noun in French. BAGS adjectives (Beauty, Age, Goodness/Badness, Size) come BEFORE. Add: jeune, vieux, nouveau, petit, grand, bon, mauvais, beau, joli, gros.",
    examples: [
      { fr: 'un beau jardin', en: 'a beautiful garden (Beauty → before)' },
      { fr: 'un vieux château', en: 'an old castle (Age → before)' },
      { fr: 'une bonne idée', en: 'a good idea (Goodness → before)' },
      { fr: 'un grand homme', en: 'a great man (Size → before)' },
    ],
  },
  {
    rule: 'Feminine: -eux → -euse',
    desc: 'Adjectives ending in -eux or -oux form the feminine by changing to -euse or -ouse. This is a very productive pattern — master it for dozens of adjectives.',
    examples: [
      { fr: 'heureux → heureuse', en: 'happy (m/f)' },
      { fr: 'sérieux → sérieuse', en: 'serious (m/f)' },
      { fr: 'généreux → généreuse', en: 'generous (m/f)' },
      { fr: 'jaloux → jalouse', en: 'jealous (m/f)' },
    ],
  },
  {
    rule: 'Feminine: -if → -ive',
    desc: 'Adjectives ending in -if form the feminine with -ive. These often correspond to English adjectives ending in -ive.',
    examples: [
      { fr: 'actif → active', en: 'active (m/f)' },
      { fr: 'créatif → créative', en: 'creative (m/f)' },
      { fr: 'naïf → naïve', en: 'naive (m/f)' },
      { fr: 'positif → positive', en: 'positive (m/f)' },
    ],
  },
  {
    rule: 'Irregular feminine forms',
    desc: 'Key adjectives have completely irregular feminine forms — these must be memorised. They are all high-frequency adjectives.',
    examples: [
      { fr: 'beau → belle (bel before vowel)', en: 'beautiful / handsome' },
      { fr: 'vieux → vieille (vieil before vowel)', en: 'old' },
      { fr: 'nouveau → nouvelle (nouvel before vowel)', en: 'new' },
      { fr: 'blanc → blanche', en: 'white' },
    ],
  },
  {
    rule: "Adjectives that don't change",
    desc: "Some adjectives have the same form in masculine and feminine: those ending in -e (jeune, libre, calme, timide, triste). Also: compound colours, colour-nouns (marron, orange).",
    examples: [
      { fr: 'un homme triste / une femme triste', en: 'a sad man / a sad woman (same form)' },
      { fr: 'un livre utile / une méthode utile', en: 'a useful book / a useful method (same form)' },
      { fr: 'un sac orange / des sacs orange', en: 'an orange bag / orange bags (invariable)' },
      { fr: 'un ami calme / une amie calme', en: 'a calm friend m/f (same form)' },
    ],
  },
  {
    rule: 'Position changes meaning',
    desc: 'Some adjectives change meaning depending on whether they come before or after the noun. This is a subtle but important phenomenon in French.',
    examples: [
      { fr: 'un grand homme / un homme grand', en: 'a great man (important) / a tall man (height)' },
      { fr: 'ma propre chambre / ma chambre propre', en: 'my own room (possession) / my clean room (cleanliness)' },
      { fr: 'un certain âge / un fait certain', en: 'a certain age (vague) / a certain fact (definite)' },
      { fr: 'la dernière fois / la semaine dernière', en: 'the last time (final) / last week (previous)' },
    ],
  },
]

const IN_CONTEXT_SENTENCES = [
  {
    situation: 'Describing a person',
    fr: 'Il est petit, brun, avec des yeux verts — et très sympa.',
    en: 'He\'s short, dark-haired, with green eyes — and very friendly.',
    note: '"Brun" = dark-haired (not to be confused with "marron" for eyes). Physical + personality description together.',
  },
  {
    situation: 'Describing a colleague',
    fr: 'C\'est quelqu\'un de sérieux et de bienveillant — elle est très appréciée.',
    en: 'She\'s someone serious and kind-hearted — she\'s very well-liked.',
    note: '"Quelqu\'un de + adjective" = someone who is... Adjective after "de" is always masculine singular.',
  },
  {
    situation: 'Describing a place',
    fr: 'L\'appartement est grand, lumineux et bien situé — mais un peu cher.',
    en: 'The flat is big, bright and well-located — but a little expensive.',
    note: '"Lumineux" = bright/full of light. Property adjectives used in everyday conversation and apartment listings.',
  },
  {
    situation: 'Describing food',
    fr: 'Le repas était délicieux — la sauce était douce et parfumée.',
    en: 'The meal was delicious — the sauce was mild and fragrant.',
    note: '"Doux" (soft/mild) and "parfumé" (fragrant/flavourful) are key adjectives in French food vocabulary.',
  },
  {
    situation: 'Mixed nationality',
    fr: 'Mon père est français mais ma mère est irlandaise — je suis bilingue.',
    en: 'My father is French but my mother is Irish — I\'m bilingual.',
    note: 'Nationalities as adjectives are lowercase. "Bilingue" = same form for masc and fem.',
  },
  {
    situation: 'Expressing feeling',
    fr: 'Je suis vraiment contente — c\'est une bonne nouvelle, non ?',
    en: 'I\'m really pleased — it\'s good news, isn\'t it?',
    note: '"Contente" (feminine speaker). "Bonne nouvelle" — "bonne" before noun (BAGS). Gendered adjective on the speaker.',
  },
  {
    situation: 'Describing a film',
    fr: 'C\'était un film poignant et subtil — pas du tout ennuyeux.',
    en: 'It was a poignant and subtle film — not boring at all.',
    note: '"Pas du tout" = not at all. Two adjectives after the noun, connected with "et". Natural pattern.',
  },
  {
    situation: 'A new neighbour',
    fr: 'La nouvelle voisine est très curieuse — elle pose beaucoup de questions.',
    en: 'The new neighbour is very nosy — she asks a lot of questions.',
    note: '"Nouvelle" before noun (BAGS: new). "Curieuse" after the verb être. Two different positions in one sentence.',
  },
  {
    situation: 'Talking about weather',
    fr: 'Le temps est doux et nuageux — idéal pour une promenade.',
    en: 'The weather is mild and cloudy — ideal for a walk.',
    note: '"Nuageux" = cloudy. "Doux" for weather = mild (not hot, not cold). "Idéal" = same form for masc/fem.',
  },
  {
    situation: 'An old friend',
    fr: 'C\'est un vieil ami à moi — on se connaît depuis vingt ans.',
    en: 'He\'s an old friend of mine — we\'ve known each other for twenty years.',
    note: '"Vieil" (not vieux) before vowel. "Un vieil ami" — liaison with the vowel of "ami".',
  },
  {
    situation: 'Describing personality',
    fr: 'Elle est têtue mais honnête — on peut toujours compter sur elle.',
    en: "She's stubborn but honest — you can always count on her.",
    note: '"Têtue" (feminine). "Honnête" (same form, ends in -e). Two contrasting personality adjectives.',
  },
  {
    situation: 'A difficult situation',
    fr: 'La situation est difficile et inquiétante — on espère une solution rapide.',
    en: 'The situation is difficult and worrying — we\'re hoping for a quick solution.',
    note: '"Inquiétante" = worrying (fem, from "inquiétant"). "Rapide" = same form masc/fem. Real news/business vocabulary.',
  },
]

const LEVEL_COLORS = { A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-yellow-100 text-yellow-700', B2: 'bg-orange-100 text-orange-700' }

export default function FrenchAdjectives() {
  const [tab, setTab] = useState('vocab')
  const [activeGroup, setActiveGroup] = useState(0)
  const [activeRule, setActiveRule] = useState(0)
  const [showExamples, setShowExamples] = useState(true)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Adjectives | SayBonjour!" description="Learn essential French adjectives — personality, appearance, qualities, nationalities — with gender agreement rules, examples, and real sentences in context." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Adjectives</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les adjectifs — vocabulary, agreement rules, and real sentences in context</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'grammar', label: 'Grammar Rules' },
            { id: 'context', label: 'In Context' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'vocab' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {ADJECTIVE_GROUPS.map((g, i) => (
                <button key={g.category} onClick={() => { setActiveGroup(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${activeGroup === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {g.category}
                  <span className={`px-1 py-0.5 rounded text-xs ${activeGroup === i ? 'bg-white/20' : LEVEL_COLORS[g.level] || 'bg-gray-100 text-gray-600'}`}>{g.level}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 dark:text-cream-50">{ADJECTIVE_GROUPS[activeGroup].category}</h2>
              <button onClick={() => setShowExamples(!showExamples)}
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
                {showExamples ? 'Hide' : 'Show'} examples
              </button>
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="space-y-4">
                {ADJECTIVE_GROUPS[activeGroup].items.map((adj, i) => (
                  <motion.div key={adj.masc} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 dark:border-dark-warm-200 pb-3 last:border-0 cursor-pointer"
                    onClick={() => addXP(2, 'vocabulary')}>
                    <div className="flex items-start gap-2 mb-1">
                      <SpeakButton text={adj.masc} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-burgundy-700 dark:text-burgundy-vibrant-300 text-sm">{adj.masc}</span>
                          <span className="text-gray-400">/</span>
                          <span className="font-medium text-rose-600 dark:text-rose-400 text-sm">{adj.fem}</span>
                          <span className="text-xs text-gray-400">— {adj.en}</span>
                        </div>
                        {adj.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {adj.note}</p>}
                      </div>
                    </div>
                    {showExamples && adj.example && (
                      <div className="ml-7 flex items-center gap-2 bg-cream-50 dark:bg-dark-warm-200 rounded-lg px-3 py-1.5 mt-1">
                        <SpeakButton text={adj.example} size="sm" />
                        <p className="text-xs italic text-gray-500 dark:text-gray-400">"{adj.example}"</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'grammar' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {GRAMMAR_RULES.map((r, i) => (
                <button key={r.rule} onClick={() => { setActiveRule(i); addXP(3, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeRule === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {r.rule}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <h2 className="font-bold text-lg text-gray-900 dark:text-cream-50 mb-2">{GRAMMAR_RULES[activeRule].rule}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{GRAMMAR_RULES[activeRule].desc}</p>
              <div className="space-y-2">
                {GRAMMAR_RULES[activeRule].examples.map(ex => (
                  <div key={ex.fr} className="flex items-center gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5 cursor-pointer"
                    onClick={() => addXP(2, 'grammar')}>
                    <SpeakButton text={ex.fr} size="sm" />
                    <span className="text-sm font-medium text-burgundy-700 dark:text-burgundy-vibrant-300 italic">{ex.fr}</span>
                    <span className="text-xs text-gray-400">— {ex.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'context' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 mb-2 text-sm text-blue-800 dark:text-blue-300">
              These sentences show adjectives working in real French — notice gender agreement, word order, and natural phrasing in action.
            </div>
            {IN_CONTEXT_SENTENCES.map((s, i) => (
              <motion.div key={s.fr} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 cursor-pointer"
                onClick={() => addXP(3, 'grammar')}>
                <p className="text-xs font-semibold text-burgundy-600 dark:text-burgundy-vibrant-300 uppercase tracking-wide mb-2">{s.situation}</p>
                <div className="flex items-start gap-2 mb-2">
                  <SpeakButton text={s.fr} size="sm" />
                  <p className="font-medium text-sm italic text-gray-900 dark:text-cream-50">"{s.fr}"</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-7">{s.en}</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic ml-7">💡 {s.note}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
