import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, ExternalLink, ChevronDown, ChevronUp, BookOpen, Mic2, Globe2 } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const SONGS = [
  {
    title: 'La Vie en Rose',
    artist: 'Édith Piaf',
    year: '1947',
    level: 'B1',
    genre: 'Chanson',
    theme: 'Love',
    excerpt: {
      lyrics: 'Quand il me prend dans ses bras,\nIl me parle tout bas,\nJe vois la vie en rose.',
      translation: 'When he takes me in his arms,\nHe speaks to me softly,\nI see life through rose-coloured glasses.',
    },
    vocabulary: [
      { fr: 'les bras', en: 'arms' },
      { fr: 'tout bas', en: 'very softly / in a whisper' },
      { fr: 'la vie en rose', en: 'life through rose-coloured glasses (optimistic view)' },
      { fr: 'prendre dans ses bras', en: 'to take in one\'s arms / to embrace' },
      { fr: 'parler bas', en: 'to speak softly / to whisper' },
    ],
    grammar: 'Notice the present tense used throughout — "quand il me prend" uses the indicative, not subjunctive. "Il me parle" uses the indirect object pronoun "me" before the verb.',
    why: 'Édith Piaf\'s most famous song, recorded in 1947 — perfect for practising nasal vowels (en, an) and the pronoun system. The phrase "la vie en rose" is now used in French everyday speech to describe optimism.',
    youtube: 'https://www.youtube.com/results?search_query=La+Vie+en+Rose+Edith+Piaf',
    difficulty: 'Medium',
    culturalNote: 'Édith Piaf (1915–1963), nicknamed "La Môme Piaf" (The Little Sparrow), rose from extreme poverty to become France\'s greatest popular singer. This song was covered by Louis Armstrong and later used in the 2001 film Amélie.',
  },
  {
    title: 'Ne Me Quitte Pas',
    artist: 'Jacques Brel',
    year: '1959',
    level: 'B2',
    genre: 'Chanson',
    theme: 'Heartbreak',
    excerpt: {
      lyrics: 'Ne me quitte pas\nIl faut oublier\nTout peut s\'oublier\nQui s\'enfuit déjà.',
      translation: 'Don\'t leave me\nWe must forget\nEverything can be forgotten\nThat is already fleeing.',
    },
    vocabulary: [
      { fr: 'quitter', en: 'to leave / to quit' },
      { fr: 'oublier', en: 'to forget' },
      { fr: 's\'enfuir', en: 'to flee / to run away' },
      { fr: 'il faut', en: 'it is necessary / one must' },
      { fr: 's\'oublier', en: 'to be forgotten / to forget oneself' },
    ],
    grammar: 'The imperative "ne me quitte pas" — negative imperative places the pronoun between "ne" and the verb. "Tout peut s\'oublier" uses the reflexive passive construction — everything can forget itself = everything can be forgotten.',
    why: 'Widely considered one of the greatest French songs ever — rich vocabulary and emotional intensity. Used to practice the negative imperative and the pronoun placement rule.',
    youtube: 'https://www.youtube.com/results?search_query=Ne+Me+Quitte+Pas+Jacques+Brel',
    difficulty: 'Hard',
    culturalNote: 'Jacques Brel (1929–1978) was Belgian but is claimed by France as a titan of French chanson. He retired from performing in 1966 at the height of his fame, then sailed to the Marquesas Islands. This song has been covered 100+ times in every language.',
  },
  {
    title: 'Alors on Danse',
    artist: 'Stromae',
    year: '2009',
    level: 'B1',
    genre: 'Électro',
    theme: 'Modern life',
    excerpt: {
      lyrics: 'Qui dit étude dit travail\nDit weekend, dit qu\'on s\'en fout\nDit grande école, dit promo\nDit chômage et insomnie.',
      translation: 'Who says study says work\nSays weekend, says we don\'t care\nSays elite school, says promotion\nSays unemployment and insomnia.',
    },
    vocabulary: [
      { fr: 'le chômage', en: 'unemployment' },
      { fr: 's\'en foutre', en: 'to not care (informal)' },
      { fr: 'l\'insomnie', en: 'insomnia' },
      { fr: 'la grande école', en: 'elite university (e.g. Sciences Po, HEC)' },
      { fr: 'la promo', en: 'promotion (informal for "promotion")' },
    ],
    grammar: 'Heavy use of indirect speech: "qui dit X, dit Y" — a rhetorical pattern meaning "what comes with X comes with Y". The chain structure creates a relentless building effect that mimics modern life\'s pressures.',
    why: 'A Belgian electro-pop hit that conquered all of Europe — catchy rhythm makes repetitive vocabulary stick naturally. Brilliant for understanding informal French speech patterns and social commentary.',
    youtube: 'https://www.youtube.com/results?search_query=Stromae+Alors+on+Danse',
    difficulty: 'Medium',
    culturalNote: 'Stromae (Paul Van Haver, born 1985) is Belgian of Rwandan origin. "Alors on Danse" reached number 1 in 19 countries. He is one of the most innovative French-language artists of the 21st century, blending electro with deeply personal storytelling.',
  },
  {
    title: 'Les Champs-Élysées',
    artist: 'Joe Dassin',
    year: '1969',
    level: 'A2',
    genre: 'Pop',
    theme: 'Paris',
    excerpt: {
      lyrics: 'Je m\'baladais sur l\'avenue\nLe cœur ouvert à l\'inconnu\nJ\'avais envie de dire bonjour\nÀ n\'importe qui.',
      translation: 'I was strolling down the avenue\nWith my heart open to the unknown\nI wanted to say hello\nTo anyone.',
    },
    vocabulary: [
      { fr: 'se balader', en: 'to stroll / to wander' },
      { fr: 'l\'inconnu(e)', en: 'unknown / stranger' },
      { fr: 'avoir envie de', en: 'to feel like / to want to' },
      { fr: 'n\'importe qui', en: 'anyone / just anybody' },
      { fr: 'le cœur ouvert', en: 'open-hearted / with an open heart' },
    ],
    grammar: 'The imparfait tense throughout: "je m\'baladais", "j\'avais" — typical for setting a scene or describing a state of mind in the past. "Je m\'baladais" is a contraction of "je me baladais" — common in sung French.',
    why: 'One of the easiest classic French songs for A2 learners — great for hearing natural conversational French and the imparfait tense used to describe a relaxed past scene.',
    youtube: 'https://www.youtube.com/results?search_query=Les+Champs+Elysees+Joe+Dassin',
    difficulty: 'Easy',
    culturalNote: 'Joe Dassin (1938–1980) was American-born but became one of France\'s most beloved pop singers. Les Champs-Élysées is still played at every French school party and summer event — it is the unofficial anthem of French optimism.',
  },
  {
    title: 'Papaoutai',
    artist: 'Stromae',
    year: '2013',
    level: 'B1',
    genre: 'Pop / Électro',
    theme: 'Family',
    excerpt: {
      lyrics: 'Dis-moi où t\'es\nDis-moi où t\'es, papa\nOù t\'es, papa\nOù t\'es ?',
      translation: 'Tell me where you are\nTell me where you are, dad\nWhere are you, dad\nWhere are you?',
    },
    vocabulary: [
      { fr: 'papa', en: 'dad / father' },
      { fr: 'dis-moi', en: 'tell me (imperative of dire)' },
      { fr: 'où', en: 'where' },
      { fr: 't\'es', en: 'you are (informal — tu es contracted)' },
      { fr: 'Où t\'es ?', en: 'Where are you? (very informal spoken French)' },
    ],
    grammar: 'The title "Papaoutai" is a contraction of "papa, où t\'es ?" — a perfect example of informal spoken French contracting "tu es" → "t\'es". This elision is extremely common in speech but never written formally.',
    why: 'A moving song about absent fathers — demonstrates how French contracts and elides words in natural speech. Essential for understanding the gap between written and spoken French.',
    youtube: 'https://www.youtube.com/results?search_query=Stromae+Papaoutai',
    difficulty: 'Medium',
    culturalNote: 'Stromae\'s own father was killed in the 1994 Rwandan genocide when Stromae was 10. This intensely personal song explores the lasting absence of a father figure and its effect on a child\'s identity.',
  },
  {
    title: 'L\'Hymne à l\'amour',
    artist: 'Édith Piaf',
    year: '1950',
    level: 'B2',
    genre: 'Chanson',
    theme: 'Love',
    excerpt: {
      lyrics: 'Le ciel bleu sur nous peut s\'effondrer\nEt la terre peut bien s\'écrouler\nPeu m\'importe si tu m\'aimes.',
      translation: 'The blue sky above us may collapse\nAnd the earth may well crumble\nI don\'t care as long as you love me.',
    },
    vocabulary: [
      { fr: 's\'effondrer', en: 'to collapse / to fall apart' },
      { fr: 's\'écrouler', en: 'to crumble / to fall down' },
      { fr: 'peu m\'importe', en: 'it matters little to me / I don\'t care' },
      { fr: 'le ciel', en: 'the sky' },
      { fr: 'la terre', en: 'the earth' },
    ],
    grammar: '"Peu m\'importe" is a fixed expression meaning "I don\'t care". "Peut s\'effondrer" uses the modal "pouvoir" + reflexive infinitive. The conditional mood throughout expresses hypothetical catastrophes.',
    why: 'Rich conditional and hypothetical structures — ideal for B2 learners exploring complex sentence patterns. Piaf wrote this after the tragic death of her lover Marcel Cerdan in a 1949 plane crash.',
    youtube: 'https://www.youtube.com/results?search_query=Hymne+a+l+amour+Piaf',
    difficulty: 'Hard',
    culturalNote: 'Piaf composed this song for Marcel Cerdan, world middleweight boxing champion and her great love, who died in a plane crash on the way to visit her in New York. She reportedly sang it publicly for the first time just days after learning of his death.',
  },
  {
    title: 'Je veux',
    artist: 'Zaz',
    year: '2010',
    level: 'A2',
    genre: 'Chanson / Pop',
    theme: 'Happiness',
    excerpt: {
      lyrics: 'Je veux de l\'amour, de la joie, de la bonne humeur\nCe n\'est pas votre argent qui fera mon bonheur\nMoi je veux crever la main sur le cœur.',
      translation: 'I want love, joy, and good spirits\nIt\'s not your money that will make me happy\nI want to die (live to the full) with my hand on my heart.',
    },
    vocabulary: [
      { fr: 'la joie', en: 'joy' },
      { fr: 'la bonne humeur', en: 'good mood / good spirits' },
      { fr: 'le bonheur', en: 'happiness' },
      { fr: 'crever', en: 'to burst / to die (informal) / to live intensely' },
      { fr: 'avoir la main sur le cœur', en: 'to be generous / honest (hand on heart)' },
    ],
    grammar: '"Je veux" + infinitive = I want to + verb. "Ce n\'est pas... qui" = a cleft sentence emphasising the subject: "it is not money THAT will...". Note "votre argent" (your money) — using "vous" (formal/plural) to address society.',
    why: 'An anthem of authentic happiness over materialism — wonderful A2 song for learning "je veux" + noun and infinitive constructions. Zaz\'s distinctive raspy voice is instantly recognisable.',
    youtube: 'https://www.youtube.com/results?search_query=Zaz+Je+veux',
    difficulty: 'Easy',
    culturalNote: 'Zaz (Isabelle Geffroy, born 1980) launched from the streets of Paris as a busker and became a global star with this debut single. Her neo-chanson style — influenced by Piaf but modern — won her a generation of fans worldwide and helped revive traditional French chanson.',
  },
  {
    title: 'Boum !',
    artist: 'Charles Trenet',
    year: '1938',
    level: 'A1',
    genre: 'Chanson',
    theme: 'Joy',
    excerpt: {
      lyrics: 'Boum !\nQuand notre cœur fait boum\nTout avec lui dit boum\nEt c\'est l\'amour qui s\'éveille.',
      translation: 'Boom!\nWhen our heart goes boom\nEverything with it says boom\nAnd it\'s love awakening.',
    },
    vocabulary: [
      { fr: 'le cœur', en: 'the heart' },
      { fr: 's\'éveiller', en: 'to awaken / to wake up' },
      { fr: 'l\'amour', en: 'love' },
      { fr: 'tout', en: 'everything' },
      { fr: 'avec lui', en: 'with it / with him' },
    ],
    grammar: '"Quand notre cœur fait boum" — "faire" here used onomatopoeically: "to go boom". "C\'est l\'amour qui s\'éveille" — another cleft sentence construction: "it is love that awakens". Excellent A1 sentence for learning "c\'est... qui".',
    why: 'The simplest classic French chanson — brilliant for absolute beginners. Short sentences, present tense, repetition. Charles Trenet\'s joy is infectious, making it easy to sing along.',
    youtube: 'https://www.youtube.com/results?search_query=Charles+Trenet+Boum',
    difficulty: 'Easy',
    culturalNote: 'Charles Trenet (1913–2001), nicknamed "Le Fou Chantant" (The Singing Madman), was one of the most joyful French artists of the 20th century. He also wrote "La Mer" (1946), one of the most beautiful French songs ever composed.',
  },
  {
    title: 'Formidable',
    artist: 'Stromae',
    year: '2013',
    level: 'B2',
    genre: 'Électro',
    theme: 'Heartbreak',
    excerpt: {
      lyrics: 'T\'étais formidable, j\'étais fort minable\nOn méritait vraiment, vraiment pas ça\nC\'était formidable.',
      translation: 'You were wonderful, I was truly awful\nWe really, truly didn\'t deserve this\nIt was wonderful.',
    },
    vocabulary: [
      { fr: 'formidable', en: 'wonderful / great (false friend — NOT "formidable" as in terrifying)' },
      { fr: 'minable', en: 'awful / pathetic / shabby' },
      { fr: 'mériter', en: 'to deserve / to merit' },
      { fr: 'vraiment', en: 'really / truly' },
      { fr: 't\'étais', en: 'you were (tu étais, informal contracted form)' },
    ],
    grammar: 'Heavy use of imparfait: "t\'étais", "j\'étais", "c\'était" — the tense of ongoing past states and nostalgia. The contrast "formidable / fort minable" is a wordplay: "fort minable" sounds like "formidable" — Stromae\'s brilliant phonetic trick.',
    why: 'A masterpiece of wordplay and the imparfait tense. Stromae filmed this as a drunk man on the streets of Brussels. A false friend alert: "formidable" in French means wonderful, not terrifying!',
    youtube: 'https://www.youtube.com/results?search_query=Stromae+Formidable',
    difficulty: 'Hard',
    culturalNote: 'The music video was filmed guerrilla-style on the streets of Brussels — Stromae genuinely appeared to be drunk and heartbroken, confusing passers-by. It won multiple awards and has over 600 million YouTube views.',
  },
  {
    title: 'La Mer',
    artist: 'Charles Trenet',
    year: '1946',
    level: 'B1',
    genre: 'Chanson',
    theme: 'Nature',
    excerpt: {
      lyrics: 'La mer\nQu\'on voit danser le long des golfes clairs\nA des reflets d\'argent\nLa mer.',
      translation: 'The sea\nThat we see dancing along the bright bays\nHas silver reflections\nThe sea.',
    },
    vocabulary: [
      { fr: 'la mer', en: 'the sea' },
      { fr: 'le golfe', en: 'the bay / gulf' },
      { fr: 'les reflets', en: 'reflections / glints' },
      { fr: 'l\'argent', en: 'silver (also: money)' },
      { fr: 'danser', en: 'to dance' },
    ],
    grammar: '"La mer qu\'on voit danser" — relative pronoun "que" + infinitive "danser" after a perception verb ("voir"). This construction "voir + noun + infinitive" = to see something doing an action. "A des reflets" = uses "avoir" for "to have/possess".',
    why: 'One of the most poetic French songs ever written — originally composed in 20 minutes on a train. Essential for B1 learners studying the relative pronoun "que" and the verb "voir" with an infinitive.',
    youtube: 'https://www.youtube.com/results?search_query=La+Mer+Charles+Trenet',
    difficulty: 'Medium',
    culturalNote: 'Trenet wrote "La Mer" in 1943 during a train journey along the Mediterranean coast. It was so unusual at the time that his label refused to record it for three years. It has since been translated into 30+ languages and is the second most recorded French song in history.',
  },
]

const GRAMMAR_PATTERNS = [
  {
    pattern: 'The Imparfait — Setting a Scene',
    level: 'A2–B1',
    desc: 'The imparfait describes ongoing past states, habits, or atmospheres — like painting a background. Many French songs use it to describe lost moments or nostalgia.',
    examples: [
      { song: 'Les Champs-Élysées', fr: 'Je m\'baladais sur l\'avenue…', en: 'I was strolling down the avenue…', note: 'Sets the scene — ongoing action in the past' },
      { song: 'Formidable', fr: 'T\'étais formidable, j\'étais fort minable…', en: 'You were wonderful, I was truly awful…', note: 'Describes states — what they were like during a relationship' },
      { song: 'La Vie en Rose', fr: 'Quand il me prenait dans ses bras…', en: 'When he used to take me in his arms…', note: 'Recurring past action — whenever this happened' },
    ],
    rule: 'Use the imparfait (not passé composé) for: background descriptions, repeated past actions, emotions/states, and interrupted actions. Songs love the imparfait for nostalgia.',
  },
  {
    pattern: 'The Negative Imperative',
    level: 'A2',
    desc: 'Commands telling someone NOT to do something. The pronoun goes between "ne" and the verb in negative imperatives — the opposite of English.',
    examples: [
      { song: 'Ne Me Quitte Pas', fr: 'Ne me quitte pas !', en: 'Don\'t leave me!', note: '"Me" comes after "ne", before "quitte" — standard negative imperative order' },
      { song: 'Ne Me Quitte Pas', fr: 'Ne me quitte pas, je t\'en supplie…', en: 'Don\'t leave me, I beg you…', note: '"Je t\'en supplie" = I beg you — very strong emotional register' },
    ],
    rule: '"Ne + [pronoun] + verb + pas" for negative imperative. Compare: "Quitte-moi" (leave me) → "Ne me quitte pas" (don\'t leave me). The pronoun flips its position.',
  },
  {
    pattern: 'Spoken French Contractions',
    level: 'A2–B1',
    desc: 'Songs often reflect how French people actually speak — contracting words that formal writing keeps separate. This is the gap between "le français écrit" and "le français parlé".',
    examples: [
      { song: 'Papaoutai', fr: 'Où t\'es ?', en: 'Where are you?', note: '"Tu es" → "t\'es" — the elision of "tu" before a vowel sound. Very common in spoken French.' },
      { song: 'Les Champs-Élysées', fr: 'Je m\'baladais…', en: 'I was strolling…', note: '"Je me baladais" → "je m\'baladais" — even further elision in song and casual speech' },
      { song: 'Alors on Danse', fr: 'Qu\'on s\'en fout', en: 'That we don\'t care', note: '"On s\'en fout" = we don\'t give a damn — informal contraction of "en foutre"' },
    ],
    rule: 'In spoken French: "tu es" → "t\'es", "je me" → "j\'me", "il y a" → "y\'a". Songs are a great way to train your ear for these contractions which are essential for comprehension.',
  },
  {
    pattern: 'Je veux + infinitive',
    level: 'A1–A2',
    desc: 'The most basic way to express desires — "vouloir" (to want) + an infinitive verb. Songs using "je veux" are perfect for A1 learners.',
    examples: [
      { song: 'Je veux', fr: 'Je veux de l\'amour, de la joie…', en: 'I want love, joy…', note: '"Je veux de + noun" = I want some...' },
      { song: 'Je veux', fr: 'Moi je veux crever la main sur le cœur.', en: 'I want to live fully with my hand on my heart.', note: '"Je veux + infinitive" = I want to... The most common desire construction' },
      { song: 'Ne Me Quitte Pas', fr: 'Il faut oublier…', en: 'We/One must forget…', note: '"Il faut + infinitive" = it is necessary to... Another key modal structure' },
    ],
    rule: '"Vouloir + infinitive" works for all persons: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent. One of the most essential French grammar structures for A1–A2.',
  },
  {
    pattern: 'C\'est... qui / que — Cleft Sentences',
    level: 'B1',
    desc: 'French uses "c\'est... qui/que" to put emphasis on a particular part of a sentence — equivalent to English "it\'s... that/who".',
    examples: [
      { song: 'Je veux', fr: 'Ce n\'est pas votre argent qui fera mon bonheur.', en: 'It\'s not your money that will make me happy.', note: '"Ce n\'est pas... qui" — negative cleft emphasising that money is NOT the answer' },
      { song: 'Boum !', fr: 'C\'est l\'amour qui s\'éveille.', en: 'It\'s love that awakens.', note: '"C\'est... qui" — stresses that love is specifically what awakens' },
    ],
    rule: 'Use "c\'est [element] qui" when the emphasised element is the subject; use "c\'est [element] que" when it is the object. "C\'est lui qui a appelé" (it was HIM who called — subject). "C\'est lui que j\'ai vu" (it was HIM that I saw — object).',
  },
]

const MUSIC_CULTURE = [
  {
    title: 'La Chanson Française',
    emoji: '🎭',
    period: '1920s–present',
    desc: 'The backbone of French musical identity — lyric-driven songs in which words matter as much as melody. Artists like Piaf, Brel, Brassens and Aznavour elevated popular song to poetry. "La chanson" values wit, melancholy, irony, and emotional depth. Still beloved and influential.',
    artists: ['Édith Piaf', 'Jacques Brel', 'Georges Brassens', 'Charles Aznavour', 'Barbara', 'Charles Trenet'],
    tip: '"La chanson à texte" = lyric-focused chanson where the words are paramount — France\'s equivalent of the singer-songwriter tradition.',
  },
  {
    title: 'La Variété Française',
    emoji: '🎤',
    period: '1960s–1990s',
    desc: 'More commercial French pop — catchy, accessible, often romantically themed. Hugely popular on French radio and in supermarkets. Artists like Joe Dassin, Michel Sardou, Dalida, and France Gall represent this sound. Variété is sometimes looked down on by intellectuals but beloved by millions.',
    artists: ['Joe Dassin', 'Dalida', 'Michel Sardou', 'France Gall', 'Claude François', 'Mireille Mathieu'],
    tip: '"La variété" is what plays in French pharmacies, petrol stations, and on the radio — warm, familiar, and impossible to hate.',
  },
  {
    title: 'Le Hip-Hop & Rap Français',
    emoji: '🎧',
    period: '1990s–present',
    desc: 'France has the second-largest hip-hop market in the world after the US. Artists like MC Solaar, IAM, NTM, and later Booba and PNL have created a rich, lyric-dense tradition. French rap is famous for complex wordplay ("le flow"), political commentary, and vivid Parisian slang.',
    artists: ['MC Solaar', 'IAM', 'Suprême NTM', 'Booba', 'PNL', 'Damso', 'Nekfeu'],
    tip: '"Le verlan" = a French slang that reverses syllables — "l\'envers" → "le verlan". Many verlan words (meuf, keum, laisse béton) have entered mainstream French.',
  },
  {
    title: 'L\'Électro Française',
    emoji: '🎛️',
    period: '2000s–present',
    desc: 'France has produced some of the world\'s most influential electronic music. Daft Punk (Thomas Bangalter and Guy-Manuel de Homem-Christo) pioneered the "French Touch" — warm, funky electronic music with a house foundation. Stromae brought a uniquely literary, emotionally complex electro-chanson.',
    artists: ['Daft Punk', 'Stromae', 'Air', 'Justice', 'Cassius', 'Kavinsky'],
    tip: '"French Touch" refers to the late 1990s Parisian house movement centred on Daft Punk, Air, and Cassius — characterised by warm synthesis, funk samples, and sophisticated production.',
  },
  {
    title: 'Le Jazz Manouche',
    emoji: '🎸',
    period: '1930s–present',
    desc: 'Invented by Django Reinhardt (born into a Romani family in Belgium), Jazz Manouche is a uniquely French-European style blending jazz with Romani ("gypsy") guitar tradition. Django\'s dazzling speed and inventiveness inspired jazz guitarists globally — despite having lost the use of two fingers in a fire.',
    artists: ['Django Reinhardt', 'Stéphane Grappelli', 'Bireli Lagrene', 'Angelo Debarre', 'Dorado Schmitt'],
    tip: '"Le Hot Club de France" — founded in 1932 — was the first jazz club in France and the home of Django and violinist Stéphane Grappelli. Still performing today in tribute bands.',
  },
  {
    title: 'La Nouvelle Chanson (21st Century)',
    emoji: '✨',
    period: '2000s–present',
    desc: 'A renaissance of French chanson traditions blended with modern production — Zaz, Carla Bruni (yes, the former first lady), Benjamin Biolay, Vincent Delerm, and Mathieu Chedid (M). These artists revived the literary chanson for a new generation, blending acoustic instruments with contemporary themes.',
    artists: ['Zaz', 'Carla Bruni', 'Benjamin Biolay', 'M (Mathieu Chedid)', 'Vincent Delerm', 'Keren Ann'],
    tip: '"Nouvelle chanson" was partly a reaction against the domination of Anglo-American pop — a conscious effort to keep French musical identity alive in the 21st century.',
  },
]

const ALL_VOCAB = SONGS.flatMap(s => s.vocabulary.map(v => ({ ...v, song: s.title, artist: s.artist })))
const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2']
const DIFFICULTY = ['All', 'Easy', 'Medium', 'Hard']
const LEVEL_COLORS = { A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-yellow-100 text-yellow-700', B2: 'bg-orange-100 text-orange-700' }

export default function FrenchSongs() {
  const [tab, setTab] = useState('songs')
  const [level, setLevel] = useState('All')
  const [diff, setDiff] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [activePattern, setActivePattern] = useState(0)

  const filtered = SONGS.filter(s =>
    (level === 'All' || s.level === level) &&
    (diff === 'All' || s.difficulty === diff)
  )

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Songs for Learning | SayBonjour!" description="Learn French through iconic songs — lyrics, translations, vocabulary, grammar, music culture, and grammar patterns found in song." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Songs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Chansons françaises — learn through music: 10 essential songs, vocabulary, grammar patterns, and French music culture</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'songs', label: '🎵 Song Library' },
            { id: 'vocab', label: '📖 Vocabulary' },
            { id: 'grammar', label: '🧠 Grammar in Songs' },
            { id: 'culture', label: '🎭 Music Culture' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'songs' && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-5">
              💡 Each song includes lyrics with pronunciation, key vocabulary, a grammar point, and a cultural note. Filter by level or difficulty to find the right song for you.
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${level === l ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {l}
                </button>
              ))}
              {DIFFICULTY.map(d => (
                <button key={d} onClick={() => setDiff(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${diff === d ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {d}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.map((song, i) => {
                const isOpen = expanded === song.title
                return (
                  <motion.div key={song.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 overflow-hidden">
                    <button onClick={() => { setExpanded(isOpen ? null : song.title); if (!isOpen) addXP(5, 'listening') }}
                      className="w-full text-left px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shrink-0">
                        <Music size={22} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-bold text-gray-900 dark:text-cream-50 truncate">{song.title}</h2>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${LEVEL_COLORS[song.level]}`}>{song.level}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${song.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : song.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{song.difficulty}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist} · {song.year} · {song.genre}</p>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                    </button>

                    {isOpen && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pb-6 border-t border-gray-50 dark:border-dark-warm-200 pt-4 space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Excerpt — French</p>
                            <div className="space-y-1">
                              {song.excerpt.lyrics.split('\n').map((line, li) => (
                                <div key={li} className="flex items-center gap-2">
                                  <SpeakButton text={line} size="sm" />
                                  <p className="text-sm text-gray-800 dark:text-cream-50 font-medium italic">{line}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">English translation</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{song.excerpt.translation}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key vocabulary</p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {song.vocabulary.map(v => (
                              <div key={v.fr} className="bg-burgundy-50 dark:bg-burgundy-vibrant-600/10 border border-burgundy-100 dark:border-burgundy-vibrant-600/20 rounded-lg px-3 py-2 flex items-center gap-2"
                                onClick={() => addXP(2, 'vocabulary')}>
                                <SpeakButton text={v.fr} size="sm" />
                                <div className="text-sm min-w-0">
                                  <span className="font-medium text-burgundy-700 dark:text-burgundy-vibrant-300">{v.fr}</span>
                                  <span className="text-gray-400 mx-1">—</span>
                                  <span className="text-gray-600 dark:text-gray-400 text-xs">{v.en}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">🧠 Grammar point</p>
                          <p className="text-amber-800 dark:text-amber-300">{song.grammar}</p>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-3 text-sm">
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">Why study this song?</p>
                          <p className="text-emerald-800 dark:text-emerald-300">{song.why}</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm">
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">🎭 Cultural note</p>
                          <p className="text-blue-800 dark:text-blue-300 leading-relaxed">{song.culturalNote}</p>
                        </div>

                        <a href={song.youtube} target="_blank" rel="noopener noreferrer"
                          onClick={() => addXP(3, 'listening')}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                          <ExternalLink size={14} /> Listen on YouTube
                        </a>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {tab === 'vocab' && (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-5">
              All key vocabulary from all 10 songs in one place — {ALL_VOCAB.length} words and expressions. Click any word to hear it pronounced.
            </div>
            <div className="space-y-2">
              {ALL_VOCAB.map((item, i) => (
                <motion.div key={`${item.fr}-${item.song}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                  onClick={() => addXP(2, 'vocabulary')}>
                  <SpeakButton text={item.fr} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                      <span className="text-xs text-gray-400">— {item.en}</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">from "{item.song}" — {item.artist}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'grammar' && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-5">
              💡 Songs are a powerful way to internalise grammar — you absorb patterns without realising it. Each grammar point here is illustrated with real lines from the songs above.
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {GRAMMAR_PATTERNS.map((p, i) => (
                <button key={p.pattern} onClick={() => { setActivePattern(i); addXP(4, 'grammar') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activePattern === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {p.pattern}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-start gap-3 mb-2">
                <BookOpen size={18} className="text-burgundy-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-bold text-lg text-gray-900 dark:text-cream-50 font-playfair">{GRAMMAR_PATTERNS[activePattern].pattern}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${LEVEL_COLORS[GRAMMAR_PATTERNS[activePattern].level.split('–')[0]] || 'bg-gray-100 text-gray-600'}`}>{GRAMMAR_PATTERNS[activePattern].level}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{GRAMMAR_PATTERNS[activePattern].desc}</p>

              <div className="space-y-3 mb-5">
                {GRAMMAR_PATTERNS[activePattern].examples.map((ex, i) => (
                  <motion.div key={ex.fr} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-3"
                    onClick={() => addXP(2, 'grammar')}>
                    <p className="text-xs text-gray-400 mb-1 italic">from "{ex.song}"</p>
                    <div className="flex items-center gap-2 mb-1">
                      <SpeakButton text={ex.fr} size="sm" />
                      <p className="font-medium text-sm text-gray-900 dark:text-cream-50 italic">"{ex.fr}"</p>
                    </div>
                    <p className="text-xs text-gray-400 ml-7">{ex.en}</p>
                    {ex.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-1 ml-7">💡 {ex.note}</p>}
                  </motion.div>
                ))}
              </div>

              <div className="bg-burgundy-50 dark:bg-burgundy-vibrant-600/10 border border-burgundy-100 dark:border-burgundy-vibrant-600/20 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-burgundy-700 dark:text-burgundy-vibrant-300 uppercase tracking-wide mb-1">Rule summary</p>
                <p className="text-sm text-burgundy-800 dark:text-burgundy-vibrant-200 leading-relaxed">{GRAMMAR_PATTERNS[activePattern].rule}</p>
              </div>
            </div>
          </>
        )}

        {tab === 'culture' && (
          <>
            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-700 rounded-xl px-4 py-3 text-sm text-purple-800 dark:text-purple-300 mb-5">
              Understanding French music history helps you understand French culture — chanson is as central to French identity as cinema, literature, and gastronomy.
            </div>
            <div className="space-y-5">
              {MUSIC_CULTURE.map((genre, i) => (
                <motion.div key={genre.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6"
                  onClick={() => addXP(4, 'vocabulary')}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{genre.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg font-playfair text-gray-900 dark:text-cream-50">{genre.title}</h3>
                      <p className="text-xs text-gray-400">{genre.period}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{genre.desc}</p>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key artists</p>
                    <div className="flex flex-wrap gap-2">
                      {genre.artists.map(a => (
                        <div key={a} className="flex items-center gap-1.5 bg-cream-50 dark:bg-dark-warm-200 border border-gray-100 dark:border-dark-warm-50 rounded-full px-3 py-1">
                          <Mic2 size={12} className="text-burgundy-500" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 text-xs text-amber-700 dark:text-amber-400 italic">
                    💡 {genre.tip}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
