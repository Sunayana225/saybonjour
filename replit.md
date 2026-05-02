# SayBonjour! - French Learning Platform

## Overview
An interactive French learning platform called "SayBonjour!" with a React/Vite frontend and Express.js backend. Includes user accounts, dark mode, daily challenges, mini-games, reading comprehension, skill assessment onboarding, rank tiers, XP multipliers, and a full learning suite spanning Phase 1, Phase 2, and Phase 3 features.

## Architecture

### Frontend
- **Framework**: React 18 + Vite 4
- **Port**: 5000 (dev server on 0.0.0.0)
- **Routing**: react-router-dom v6
- **Styling**: Tailwind CSS (dark mode via `.dark` class on `<html>`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **SEO**: react-helmet-async

### Backend
- **Framework**: Express.js
- **Port**: 3001 (localhost)
- **Database**: SQLite via better-sqlite3 (file: `backend/french_learning.db`)
- **Auth**: JWT tokens — separate admin JWT (`Authorization: Bearer`) and user JWT (`X-User-Token`)
- **Security**: Helmet, rate limiting, input validation, PBKDF2 password hashing (10,000 iterations, `user_salt_v1`)
- **Logging**: Morgan

### Data Storage
- JSON files for articles, quizzes, sections: `backend/data/`
- SQLite DB tables: `phrases`, `phrase_sections`, `users`, `verbs`
- `verbs` table: 7,003 French verbs populated via `mlconjug3` Python library (`backend/populate_verbs.py`)
- See `backend/DATABASE.md` for full database documentation

## Key Files
- `vite.config.js` - Vite config with proxy to backend at localhost:3001
- `backend/server.js` - Express server; user routes at line ~941 (1300+ lines)
- `backend/DATABASE.md` - Full database and API documentation
- `src/App.jsx` - Main React app: HelmetProvider → ThemeProvider → AccessibilityProvider → I18nProvider → AuthProvider → UserProvider → Router (34 routes)
- `src/context/ThemeContext.jsx` - Dark mode toggle; persists to localStorage; adds `dark` class to `<html>`
- `src/context/UserContext.jsx` - Full user auth (register, login, google OAuth, avatar upload, password change, delete, export, study history, sessions, progress sync)
- `src/context/AuthContext.jsx` - Admin-only JWT auth (unchanged)
- `src/context/AccessibilityContext.jsx` - Font size, dyslexia font, high contrast, reduce motion (localStorage-backed, CSS class toggling on `<html>`)
- `src/context/i18nContext.jsx` - EN/FR toggle with full strings dictionary and `t(key)` helper
- `src/utils/progress.js` - XP, streaks, levels, badges, rank tiers, XP multipliers, daily login reward
- `src/utils/srs.js` - SM-2 spaced repetition algorithm

## Pages (34 routes)

### Core
- `/` - Home (hero, features, animated background)
- `/login` - User login + Google OAuth + Apple (coming soon)
- `/signup` - User registration + Google OAuth + Apple (coming soon)
- `/profile` - 3-tab profile: Overview/Edit/Learning Style, avatar upload, bio, badges
- `/onboarding` - 4-step skill assessment (goal → daily time → learning style → CEFR quiz)
- `/progress` - Learning Dashboard (XP bar, heatmap, skill breakdown, rank, badges)
- `/favorites` - Saved favorites
- `/learning-path` - CEFR personalised learning path (A1→C2, expandable modules)
- `/history` - Study history: activity heatmap + timeline, session stats, filter by type
- `/settings` - Account Settings: 5 tabs (Preferences, Notifications, Accessibility, Security, Data & Privacy)
- `*` - 404 Not Found page

### Learn
- `/grammar` - Grammar Hub A1–C2 (CEFR structured, dark-mode quizzes)
- `/vocabulary` - SRS Vocabulary Builder (SM-2 spaced repetition)
- `/conjugate` - Verb Conjugation tool (25 verbs, 8 tenses)
- `/study-tools` - Flashcards and bookmarks
- `/writing` - Writing Templates (emails, formal letters, essays, connectors) — **Phase 3**
- `/reading` - Reading comprehension passages A1–B2
- `/daily-challenges` - 3 daily challenges (vocab sprint, grammar quiz, translation)
- `/stories` - Interactive choose-your-path French stories
- `/sentence-builder` - Arrange words & fill-in-blank exercises
- `/word-match` - Timed word matching mini-game
- `/typing-race` - Type French translations fast
- `/business-french` - Professional vocabulary, phrases, dialogues, quiz
- `/slang-french` - Street French, verlan, informal register, quiz
- `/travel-french` - Travel vocab, phrases, real scenarios, quiz — **Phase 3**

### Resources
- `/resources` - Articles and learning content
- `/quizzes` - Interactive quizzes (fetched from backend)
- `/culture` - French culture and customs
- `/media` - Movies, music, TV show recommendations
- `/memory-boosters` - Cognates, idioms, mnemonics
- `/france-map` - Interactive map of French regions
- `/worksheets` - Downloadable practice sheets
- `/phrase-of-the-day` - Daily French phrase
- `/jokes` - French jokes & humour with punchlines and vocab notes — **Phase 3**

### Admin
- `/admin` - Comprehensive CMS (requires admin login via `Authorization: Bearer` header)
  - Tabs: Sections, Articles, Quizzes, Worksheets, Phrases, Phrase Sections, Vocabulary, Daily Vocab, Site Settings
  - **Vocabulary tab**: CRUD for custom vocab words (`custom_vocab_words` table) — French, English, list name, category, difficulty, notes; SpeakButton preview
  - **Daily Vocab tab**: CRUD for daily challenge vocab entries (`custom_daily_vocab` table) — French, English, category; SpeakButton preview
  - **Site Settings tab**: Edit hero title, hero subtitle, site name, CTA buttons, announcement bar, footer tagline (persisted to `site_settings` table)
  - Admin password: `Admin@123`

## Feature Modules

### User Accounts (`/api/users/*`)
- `POST /api/users/register` — creates account, returns JWT (30d)
- `POST /api/users/login` — validates credentials, returns JWT (30d)
- `POST /api/users/google` — Google OAuth via GSI ID token; creates or fetches account
- `GET /api/users/profile` — authenticated via `X-User-Token` header
- `PUT /api/users/profile` — update name, goal, cefr_level, daily_goal_mins, bio, learning_style, study_reminder, weekly_xp_goal, notification_prefs, onboarding_complete
- `POST /api/users/upload-avatar` — multipart/form-data avatar upload (multer); stored in `backend/uploads/`
- `POST /api/users/change-password` — PBKDF2 verify + re-hash
- `DELETE /api/users/delete` — full account deletion (user + history + sessions)
- `GET /api/users/export` — returns all user data as JSON (GDPR export)
- `GET /api/users/study-history` — fetch all study events for user
- `POST /api/users/study-history` — record a study event (type, xp, duration, topic)
- `GET /api/users/session` — fetch latest saved session state
- `PUT /api/users/session` — save session state (page, progress, timestamp)
- `GET /api/users/progress-sync` — fetch synced progress blob
- `PUT /api/users/progress-sync` — push progress blob (device sync)

### DB Tables (SQLite)
- `users` — 20+ columns incl. bio, avatar_url, learning_style, study_reminder, weekly_xp_goal, notification_prefs, onboarding_complete, google_id
- `study_history` — id, user_id, type, xp_gained, duration_mins, topic, created_at
- `user_sessions` — id, user_id, page, progress_data, updated_at
- `site_settings` — key, value, updated_at (pre-seeded with 7 hero/site settings defaults)
- `custom_vocab_words` — id, french, english, category, list_name, difficulty, notes, active, created_at
- `custom_daily_vocab` — id, french, english, category, active, created_at

### Accessibility (`/settings` → Accessibility tab + AccessibilityContext)
- **Font size**: small / medium / large / x-large — CSS `font-size` on `<html>` root
- **Dyslexia font**: OpenDyslexic font loaded from CDN; `.dyslexia-font` class on `<html>`
- **High contrast**: `.high-contrast` class + CSS filter
- **Reduce motion**: `.reduce-motion` class; disables all CSS animations/transitions

### Internationalisation (I18nContext)
- EN / FR / ES 3-way cycle; full strings dictionary in `src/context/i18nContext.jsx`
- `useI18n()` hook returns `{ t, lang, setLang, toggle }` — `t('key')` returns translated string
- Language persists to localStorage key `saybonjour_lang`
- Navbar desktop: dropdown selector (EN/FR/ES); mobile: tap button cycles EN→FR→ES→EN

### Google OAuth
- Frontend: Google GSI script loaded in `index.html`; uses `window.google.accounts.id.prompt()` One Tap
- Backend: `POST /api/users/google` verifies ID token via `https://oauth2.googleapis.com/tokeninfo`
- Set `VITE_GOOGLE_CLIENT_ID` env var to enable; graceful error if not configured

### Progress & XP (`src/utils/progress.js`)
- `addXP(amount, reason)` — adds XP with streak multiplier, updates skillXP, weeklyXP, dailyXP
- `getXPMultiplier(streak)` — returns 1x / 2x (streak≥3) / 3x (streak≥7)
- `SKILL_MAP` — maps reason strings to skill categories (reading, grammar, vocabulary, games, challenges, stories)
- `claimDailyLoginReward()` — +10 XP once per calendar day

### Rank Tiers
- Bronze: 0–499 XP
- Silver: 500–1499 XP
- Gold: 1500–2999 XP
- Platinum: 3000–5999 XP
- Diamond: 6000+ XP

### Dark Mode
- ThemeContext toggles `dark` class on `document.documentElement`
- All pages and components have full dark mode CSS coverage

### Navbar
- Closes all dropdowns + mobile menu on route change
- Learn dropdown (4 sections): Language Tools (5 items), Practice (4 items), Mini Games (2 items), Specialist French (3 items)
- Resources dropdown (3 sections): Core Learning, Quick Access (4 items incl. Jokes), Culture & Media
- User avatar menu (logged in) or Login/Signup buttons

## Data Files
- `src/data/conjugations.js` — 25 verbs, 8 tenses
- `src/data/grammarData.js` — A1–C2 grammar curriculum with quizzes
- `src/data/readingData.js` — 5 French passages (A1×2, A2, B1, B2) with questions
- `src/data/sentenceData.js` — 12 arrange exercises + 8 fill-in-blank exercises
- `src/data/businessData.js` — Business vocabulary, phrases, dialogues, quiz
- `src/data/slangData.js` — Slang expressions, verlan, formal vs informal, quiz
- `src/data/storyData.js` — 2 interactive branching stories
- `src/data/travelData.js` — 44 vocab words, 6 phrase categories, 4 scenarios, 6-question quiz
- `src/data/jokesData.js` — 12 French jokes (Puns/Wordplay/Classic) with punchlines, vocab, cultural notes
- `src/data/writingData.js` — 4 email templates, 2 letter templates, 2 essay structures, 8 connectors

## Database Documentation
Full documentation at `backend/DATABASE.md`:
- SQLite tables: `users`, `phrases`, `phrase_sections`
- JSON data files: `articles.json`, `quizzes.json`, `sections.json`
- All localStorage keys and `saybonjour_progress` schema
- All API endpoints with request/response shapes
- Security notes and initialisation process

## Environment Variables
- `PORT` — Backend port (default 3001)
- `NODE_ENV` — Environment
- `JWT_SECRET` — Admin JWT secret (auto-generated if not set)
- `USER_JWT_SECRET` — User JWT secret (auto-generated if not set; causes logouts on restart if unset)
- `ADMIN_USERNAME` — Admin login username
- `ADMIN_PASSWORD_HASH` — PBKDF2 hashed admin password
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth Client ID (optional; enables Google Sign-In button)

## Development
- Run both frontend and backend: `npm run dev:full`
- Frontend only: `npm run dev`
- Backend only: `npm run server`

## Workflow
- **Start application**: `npm run dev:full` on port 5000 (webview)

## Deployment
- Target: VM (needed for SQLite file persistence)
- Build: `npm run build`
- Run: `bash -c "node backend/server.js & npx vite preview --host 0.0.0.0 --port 5000"`

## PWA
- `public/site.webmanifest` — PWA manifest (name, icons, theme colour)
- `public/favicon.svg` — SVG favicon (burgundy background, B lettermark)
- `index.html` references favicon.svg, site.webmanifest

## Bug Fixes Applied (May 2026)
### Double Padding Removed
- Removed redundant `pt-16`/`pt-20` from 16 page root divs — `App.jsx`'s `<main className="pt-20">` already handles navbar offset.
  - Fixed pages: Admin, BusinessFrench, Culture (×2), DailyChallenges, Favorites, InteractiveStory, NotFound, Profile, Progress, ReadingComprehension, SentenceBuilder, SlangFrench, StudyTools, TypingRace, WordMatch.

### Framer Motion Opacity Fix
- Changed `initial={{ opacity: 0 }}` to `initial={{ opacity: 1 }}` on below-fold `whileInView` elements in Home.jsx Features section and CTA section — prevents invisible text when IntersectionObserver fires slowly.

### Internal Navigation Fixed
- Replaced all `<a href="/...">` internal links with `<Link to="...">` in Home.jsx (footer, 9 links), Favorites.jsx (5 links).

### Light Mode Text Contrast
- Fixed bento section, category headers, section-gradient classes in index.css — replaced `@apply text-gray-*` with direct hex CSS values for reliable light mode contrast.

### Dark Mode Coverage — Pages
- Admin.jsx: Full dark mode (bg, text, form labels, inputs, selects, modals, toolbar, borders, kbd badges).
- Conjugate.jsx: Search input, dropdown list, suggestion highlight text, active/hover states.
- SlangFrench.jsx: Fallback register badge background/text.
- FranceMap.jsx: Close button icon.
- MemoryBoosters.jsx: Example label text.
- PhraseOfTheDay.jsx: Pronunciation text.
- StudyTools.jsx: Tab border.
- Worksheets.jsx: Divider border.

### Dark Mode Coverage — Components
- AdminLogin.jsx: Full dark mode (bg, heading, subtitle, form inputs, CSRF text).
- SpeakButton.jsx: Disabled state background.
- Navbar.jsx: Search result description text.
- SEO.jsx: Default image changed from `/og-image.jpg` to `null`; og:image and twitter:image meta tags are now conditionally rendered only when a valid image is provided (eliminates 404 errors).

### OG Image 404 Fix
- Removed non-existent `image="/og-home.jpg"` prop from Home.jsx SEO.
- Removed non-existent `image="/og-resources.jpg"` prop from Resources.jsx SEO.
- SEO component now skips `og:image`/`twitter:image` when no image is provided.

## Known Constraints
- favicon.png files (32×32, apple-touch) not present — SVG fallback in use
- `logo.png` referenced in Navbar but served from Replit environment (not in public/)
- APK/mobile: Capacitor is the recommended path to wrap this as an Android APK; requires Android Studio (not available in Replit sandbox)
- `USER_JWT_SECRET` not set as env var means users get logged out on every server restart
