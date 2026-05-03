const STORAGE_KEY = 'sb_feature_page_meta'

export function loadFeaturePageMeta() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveFeaturePageMeta(meta) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta))
  } catch {}
}

export function getPageMeta(route) {
  const all = loadFeaturePageMeta()
  return all[route] || { featured: false, isNew: false, hidden: false, adminNote: '', extraItems: [] }
}

export function setPageMeta(route, updates) {
  const all = loadFeaturePageMeta()
  all[route] = { ...getPageMeta(route), ...updates }
  saveFeaturePageMeta(all)
}

export function getExtraItems(route) {
  return getPageMeta(route).extraItems || []
}

export function setExtraItems(route, items) {
  setPageMeta(route, { extraItems: items })
}

export const ALL_FEATURE_PAGES = [
  { name: 'French Numbers', route: '/numbers', category: 'Vocabulary' },
  { name: 'French Colors', route: '/french-colors', category: 'Vocabulary' },
  { name: 'French Animals', route: '/french-animals', category: 'Vocabulary' },
  { name: 'French Body Parts', route: '/french-body-parts', category: 'Vocabulary' },
  { name: 'French Adjectives', route: '/french-adjectives', category: 'Vocabulary' },
  { name: 'French Food Guide', route: '/french-food', category: 'Vocabulary' },
  { name: 'French Food Vocabulary', route: '/french-food-vocab', category: 'Vocabulary' },
  { name: 'French Dates', route: '/french-dates', category: 'Vocabulary' },
  { name: 'French Nature', route: '/french-nature', category: 'Vocabulary' },
  { name: 'French Shopping', route: '/french-shopping', category: 'Vocabulary' },
  { name: 'French Holidays', route: '/french-holidays', category: 'Vocabulary' },
  { name: 'French Emotions', route: '/french-emotions', category: 'Vocabulary' },
  { name: 'French School Vocab', route: '/french-school', category: 'Vocabulary' },
  { name: 'French Family Vocab', route: '/french-family', category: 'Vocabulary' },
  { name: 'French Math Vocabulary', route: '/french-math', category: 'Vocabulary' },
  { name: 'French Weather', route: '/french-weather', category: 'Vocabulary' },
  { name: 'French Numbers Guide', route: '/french-numbers-guide', category: 'Vocabulary' },
  { name: 'French False Friends (Vocab)', route: '/french-false-friends-vocab', category: 'Vocabulary' },
  { name: 'French Hobbies', route: '/french-hobbies', category: 'Vocabulary' },
  { name: 'French Daily Routine', route: '/french-daily-routine', category: 'Vocabulary' },
  { name: 'French Opinions', route: '/french-opinions', category: 'Vocabulary' },
  { name: 'French Comparatives', route: '/french-comparatives', category: 'Vocabulary' },
  { name: 'French Conversation Topics', route: '/french-conversation-topics', category: 'Vocabulary' },
  { name: 'French Social Media', route: '/french-social-media', category: 'Vocabulary' },
  { name: 'French Time Expressions', route: '/french-time-expressions', category: 'Vocabulary' },
  { name: 'French Cinema', route: '/french-cinema', category: 'Vocabulary' },
  { name: 'French Colors Guide', route: '/french-colors-guide', category: 'Vocabulary' },
  { name: 'French Colors (Full)', route: '/colors', category: 'Vocabulary' },
  { name: 'Seasonal Vocabulary', route: '/seasonal-vocabulary', category: 'Vocabulary' },
  { name: 'Vocabulary Themes', route: '/vocabulary-themes', category: 'Vocabulary' },
  { name: 'Picture Vocabulary', route: '/picture-vocabulary', category: 'Vocabulary' },
  { name: 'Word of the Day', route: '/word-of-the-day', category: 'Vocabulary' },

  { name: 'Grammar', route: '/grammar', category: 'Grammar' },
  { name: 'French Verbs', route: '/french-verbs', category: 'Grammar' },
  { name: 'French Tenses', route: '/french-tenses', category: 'Grammar' },
  { name: 'French Negation', route: '/french-negation', category: 'Grammar' },
  { name: 'French Questions', route: '/french-questions', category: 'Grammar' },
  { name: 'French Prepositions', route: '/french-prepositions', category: 'Grammar' },
  { name: 'French Articles', route: '/french-articles', category: 'Grammar' },
  { name: 'French Relative Pronouns', route: '/french-relative-pronouns', category: 'Grammar' },
  { name: 'French Pronouns Guide', route: '/french-pronouns-guide', category: 'Grammar' },
  { name: 'French Interrogatives', route: '/french-question-words', category: 'Grammar' },
  { name: 'French Subjunctive', route: '/french-subjunctive', category: 'Grammar' },
  { name: 'French Passive Voice', route: '/french-passive-voice', category: 'Grammar' },
  { name: 'Tu vs Vous', route: '/tu-vs-vous', category: 'Grammar' },
  { name: 'Verb Conjugation Quiz', route: '/conjugation-quiz', category: 'Grammar' },
  { name: 'Verb Drills', route: '/verb-drills', category: 'Grammar' },
  { name: 'Gender Practice', route: '/gender-practice', category: 'Grammar' },
  { name: 'Grammar Tips', route: '/grammar-tips', category: 'Grammar' },
  { name: 'Phrasal Verbs', route: '/phrasal-verbs', category: 'Grammar' },

  { name: 'Pronunciation', route: '/pronunciation', category: 'Pronunciation' },
  { name: 'French Pronunciation Guide', route: '/french-pronunciation-guide', category: 'Pronunciation' },
  { name: 'French Accents Guide', route: '/french-accents-guide', category: 'Pronunciation' },
  { name: 'Regional Accents', route: '/regional-accents', category: 'Pronunciation' },
  { name: 'Tongue Twisters', route: '/tongue-twisters', category: 'Pronunciation' },
  { name: 'French Keyboard', route: '/french-keyboard', category: 'Pronunciation' },
  { name: 'Dictation', route: '/dictation', category: 'Pronunciation' },

  { name: 'Conversation', route: '/conversation', category: 'Speaking' },
  { name: 'French Gestures', route: '/french-gestures', category: 'Speaking' },
  { name: 'French Body Language', route: '/french-body-language', category: 'Speaking' },
  { name: 'French Etiquette', route: '/french-etiquette', category: 'Speaking' },
  { name: 'Language Exchange', route: '/language-exchange', category: 'Speaking' },

  { name: 'Culture', route: '/culture', category: 'Culture' },
  { name: 'French Art', route: '/french-art', category: 'Culture' },
  { name: 'French Poetry', route: '/french-poetry', category: 'Culture' },
  { name: 'French Literature', route: '/french-literature', category: 'Culture' },
  { name: 'French Architecture', route: '/french-architecture', category: 'Culture' },
  { name: 'French Fashion', route: '/french-fashion', category: 'Culture' },
  { name: 'French Café Culture', route: '/french-cafe', category: 'Culture' },
  { name: 'French Music', route: '/french-music', category: 'Culture' },
  { name: 'French Songs', route: '/french-songs', category: 'Culture' },
  { name: 'French Movies', route: '/french-movies', category: 'Culture' },
  { name: 'French Radio', route: '/french-radio', category: 'Culture' },
  { name: 'French Quotes', route: '/french-quotes', category: 'Culture' },
  { name: 'French Proverbs', route: '/proverbs', category: 'Culture' },
  { name: 'French Names Guide', route: '/french-names', category: 'Culture' },
  { name: 'French Jokes', route: '/jokes', category: 'Culture' },
  { name: 'Cultural Calendar', route: '/cultural-calendar', category: 'Culture' },
  { name: 'France Map', route: '/france-map', category: 'Culture' },
  { name: 'French Regional France', route: '/french-regions', category: 'Culture' },
  { name: 'French Philosophy', route: '/french-philosophy', category: 'Culture' },

  { name: 'Travel French', route: '/travel-french', category: 'Life & Work' },
  { name: 'French Travel', route: '/french-travel', category: 'Life & Work' },
  { name: 'French Transport', route: '/french-transport', category: 'Life & Work' },
  { name: 'French Directions', route: '/french-directions', category: 'Life & Work' },
  { name: 'Business French', route: '/business-french', category: 'Life & Work' },
  { name: 'French Business Vocabulary', route: '/french-business-vocab', category: 'Life & Work' },
  { name: 'French At Work', route: '/french-at-work', category: 'Life & Work' },
  { name: 'French Housing', route: '/french-housing', category: 'Life & Work' },
  { name: 'French Restaurant Guide', route: '/french-restaurant', category: 'Life & Work' },
  { name: 'French Cooking', route: '/french-cooking', category: 'Life & Work' },
  { name: 'French Sports', route: '/french-sports', category: 'Life & Work' },
  { name: 'French Health', route: '/french-health', category: 'Life & Work' },
  { name: 'French Medical', route: '/french-medical', category: 'Life & Work' },
  { name: 'French School System', route: '/french-school-system', category: 'Life & Work' },
  { name: 'French Technology', route: '/french-technology', category: 'Life & Work' },
  { name: 'French Environment', route: '/french-environment', category: 'Life & Work' },
  { name: 'French Politics', route: '/french-politics', category: 'Life & Work' },
  { name: 'French Politics Vocab', route: '/french-politics-vocab', category: 'Life & Work' },
  { name: 'French Love & Romance', route: '/french-love', category: 'Life & Work' },
  { name: 'French Slang', route: '/french-slang', category: 'Life & Work' },
  { name: 'Slang French', route: '/slang-french', category: 'Life & Work' },
  { name: 'French Idioms', route: '/idioms', category: 'Life & Work' },
  { name: 'False Friends', route: '/false-friends', category: 'Life & Work' },
  { name: 'False Friends Deep', route: '/false-friends-deep', category: 'Life & Work' },

  { name: 'Hangman', route: '/hangman', category: 'Games' },
  { name: 'Word Scramble', route: '/word-scramble', category: 'Games' },
  { name: 'Spelling Bee', route: '/spelling-bee', category: 'Games' },
  { name: 'Word Match', route: '/word-match', category: 'Games' },
  { name: 'Crossword', route: '/crossword', category: 'Games' },
  { name: 'Typing Race', route: '/typing-race', category: 'Games' },
  { name: 'Sentence Builder', route: '/sentence-builder', category: 'Games' },
  { name: 'Mini Flashcards', route: '/mini-flashcards', category: 'Games' },
  { name: 'Memory Boosters', route: '/memory-boosters', category: 'Games' },
  { name: 'Interactive Story', route: '/stories', category: 'Games' },
  { name: 'Daily Challenges', route: '/daily-challenges', category: 'Games' },

  { name: 'Reading Comprehension', route: '/reading', category: 'Skills' },
  { name: 'Listening Practice', route: '/listening-practice', category: 'Skills' },
  { name: 'Writing Templates', route: '/writing', category: 'Skills' },
  { name: 'Worksheets', route: '/worksheets', category: 'Skills' },
  { name: 'Quick Translator', route: '/quick-translator', category: 'Skills' },
  { name: 'DELF Prep', route: '/delf-prep', category: 'Skills' },
  { name: 'Levels', route: '/levels', category: 'Skills' },
  { name: 'Learning Path', route: '/learning-path', category: 'Skills' },
  { name: 'Study Tools', route: '/study-tools', category: 'Skills' },
  { name: 'Study Planner', route: '/study-planner', category: 'Skills' },
  { name: 'Study History', route: '/history', category: 'Skills' },
  { name: 'Phrase of the Day', route: '/phrase-of-the-day', category: 'Skills' },
  { name: 'Printable Sheets', route: '/printable-sheets', category: 'Skills' },
  { name: 'Vocabulary Export', route: '/vocabulary-export', category: 'Skills' },
]

export const CATEGORIES = [...new Set(ALL_FEATURE_PAGES.map(p => p.category))]
