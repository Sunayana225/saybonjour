# SayBonjour! — Database Documentation

## Overview

SayBonjour uses **SQLite** via `better-sqlite3` for persistent server-side storage. The database file is located at:

```
backend/french_learning.db
```

The database is initialised automatically when the server starts.

---

## Tables

### 1. `users`

Stores registered user accounts.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user identifier |
| `name` | TEXT | NOT NULL | Display name |
| `email` | TEXT | UNIQUE NOT NULL | Email address (stored lowercase) |
| `password_hash` | TEXT | NOT NULL | PBKDF2 hash (10,000 iterations, `user_salt_v1`, sha512) |
| `cefr_level` | TEXT | DEFAULT `'A1'` | User's self-reported CEFR level (A1–C2) |
| `goal` | TEXT | DEFAULT `''` | Learning goal string |
| `daily_goal_mins` | INTEGER | DEFAULT `10` | Daily study time target in minutes |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last profile update time |

**Notes:**
- Passwords are hashed with PBKDF2-SHA512, 10,000 iterations, static salt `user_salt_v1`
- Emails are normalised to lowercase before storage and lookup
- `password_hash` is never returned in API responses (excluded via destructuring)

---

### 2. `phrases`

Stores French phrases organised by section. Used in the admin panel.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique phrase ID |
| `french` | TEXT | NOT NULL | French text of the phrase |
| `english` | TEXT | NOT NULL | English translation |
| `section_id` | INTEGER | FOREIGN KEY → phrase_sections.id | The section this phrase belongs to |

---

### 3. `phrase_sections`

Groups phrases into named categories.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique section ID |
| `title` | TEXT | NOT NULL | Section title |
| `description` | TEXT | | Optional description |

**Relationship:** One `phrase_section` → Many `phrases` (via `section_id`)

---

## JSON Data Files

These files live in `backend/data/` and are loaded into memory at runtime (not stored in SQLite):

### `articles.json`

Array of article sections, each containing learning articles.

```json
[
  {
    "id": 1,
    "title": "Section Name",
    "items": [
      {
        "id": 1,
        "title": "Article Title",
        "description": "Brief description",
        "difficulty": "Beginner | Intermediate | Advanced",
        "content": "Markdown-formatted article content",
        "author": "Author Name",
        "lastUpdated": "YYYY-MM-DD"
      }
    ]
  }
]
```

### `quizzes.json`

Array of quiz sections, each containing multiple-choice quizzes.

```json
[
  {
    "id": 1,
    "title": "Section Name",
    "items": [
      {
        "id": 1,
        "title": "Quiz Title",
        "description": "Brief description",
        "difficulty": "Beginner | Intermediate | Advanced",
        "questions": [
          {
            "id": 1,
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correct": 0
          }
        ]
      }
    ]
  }
]
```

**Note:** The `correct` field is a 0-based index into the `options` array.

### `sections.json`

Simple array of content section categories.

```json
[
  { "id": 1, "title": "French Basics" },
  { "id": 2, "title": "Grammar Fundamentals" }
]
```

---

## Frontend Data Files (localStorage-persisted)

These data files live in `src/data/` and are static JS modules. User progress data is stored in `localStorage`, not the server database.

| File | Content |
|------|---------|
| `conjugations.js` | 25 French verbs × 8 tenses |
| `grammarData.js` | A1–C2 grammar lessons with embedded quizzes |
| `readingData.js` | 5 reading passages (A1–B2) with comprehension questions |
| `sentenceData.js` | 12 sentence-arrange + 8 fill-in-blank exercises |
| `businessData.js` | Business vocab, phrases, dialogues, quiz |
| `slangData.js` | Slang expressions, verlan, formal vs informal, quiz |
| `storyData.js` | 2 interactive branching stories |
| `travelData.js` | Travel vocab, phrases, scenarios, quiz |
| `jokesData.js` | 12 French jokes with explanations |
| `writingData.js` | Email/letter templates, essay structures, connectors |

---

## localStorage Keys (Frontend)

All user progress is stored in the browser's `localStorage`:

| Key | Type | Description |
|-----|------|-------------|
| `saybonjour_progress` | JSON object | XP, level, streak, badges, skill XP, weekly/daily XP arrays |
| `saybonjour_daily` | JSON object | Daily challenge completion state per date |
| `saybonjour_daily_login` | String (date) | Last daily login reward claim date |
| `userToken` | String (JWT) | 30-day JWT for the logged-in user |
| `tr_scores` | JSON object | Typing Race high scores per category |
| `srs_deck` | JSON array | SRS (spaced repetition) vocabulary deck |
| `saybonjour_favorites_*` | JSON arrays | Saved favourites per content type |
| `saybonjour_bookmarks` | JSON array | Study tool bookmarks |
| `saybonjour_theme` | String | `'dark'` or `'light'` |

### `saybonjour_progress` Schema

```json
{
  "xp": 0,
  "level": 1,
  "streak": 0,
  "lastStudyDate": null,
  "totalWordsLearned": 0,
  "totalQuizzesTaken": 0,
  "totalLessonsRead": 0,
  "badges": [],
  "cefrLevel": "A1",
  "weeklyXP": [{ "date": "YYYY-MM-DD", "xp": 0 }],
  "dailyXP": [{ "date": "YYYY-MM-DD", "xp": 0 }],
  "skillXP": {
    "reading": 0,
    "grammar": 0,
    "vocabulary": 0,
    "games": 0,
    "challenges": 0,
    "stories": 0
  }
}
```

---

## API Endpoints

### Authentication

All admin routes require: `Authorization: Bearer <adminToken>`  
All user routes require: `X-User-Token: <userToken>`

### User Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/register` | None | Register new user |
| POST | `/api/users/login` | None | Login, returns JWT |
| GET | `/api/users/profile` | User | Get own profile |
| PUT | `/api/users/profile` | User | Update name/goal/level |

**Register body:**
```json
{ "name": "string", "email": "string", "password": "string (min 6 chars)" }
```

**Login body:**
```json
{ "email": "string", "password": "string" }
```

**Profile update body (all optional):**
```json
{ "name": "string", "goal": "string", "cefr_level": "A1|A2|B1|B2|C1|C2", "daily_goal_mins": 10 }
```

### Content Routes (Admin)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/articles` | None | All article sections |
| GET | `/api/quizzes` | None | All quiz sections |
| GET | `/api/sections` | None | Phrase sections list |
| GET | `/api/phrases` | None | All phrases |
| POST | `/api/phrases` | Admin | Create phrase |
| PUT | `/api/phrases/:id` | Admin | Update phrase |
| DELETE | `/api/phrases/:id` | Admin | Delete phrase |
| POST | `/api/phrase-sections` | Admin | Create section |
| PUT | `/api/phrase-sections/:id` | Admin | Update section |
| DELETE | `/api/phrase-sections/:id` | Admin | Delete section + phrases |

### Utility Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/csrf-token` | None | Returns CSRF token |
| GET | `/sitemap.xml` | None | SEO sitemap |
| GET | `/robots.txt` | None | SEO robots file |

---

## Security Notes

- Admin password is never stored in plaintext; set `ADMIN_PASSWORD_HASH` env var using the `backend/change-password.js` script
- User passwords use PBKDF2 with 10,000 iterations (more secure than the admin hash which uses 1,000)
- Passwords are compared using `crypto.timingSafeEqual` to prevent timing attacks
- JWT tokens expire after 30 days; `USER_JWT_SECRET` should be set in environment variables for token persistence across restarts
- Rate limiting: auth endpoints → 5 req/15min; general API → 100 req/15min; registration → 10 req/hour

---

## Initialisation

On server start:
1. `initUsersTable()` — creates `users` table if not exists
2. `initializeDemoData()` — creates `articles.json`, `quizzes.json`, `sections.json` if not present
3. The `phrases` and `phrase_sections` tables are created lazily via the admin API

To reset the database, delete `backend/french_learning.db` and restart the server.
