import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import Database from 'better-sqlite3'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { body, validationResult } from 'express-validator'
import morgan from 'morgan'
import multer from 'multer'
import {
  generateSitemap,
  generateRobotsTxt,
  saveSitemap,
  saveRobotsTxt,
  seoConfig
} from './seo-utils.js'

// Load environment variables
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')

// Secure admin credentials - MUST be set via environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

// Helper function to hash passwords
const hashPassword = (password) => {
  return crypto.pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex')
}

// Helper function to verify passwords
const verifyPassword = (password, hash) => {
  const hashedPassword = crypto.pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex')
  return hashedPassword === hash
}

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Set()

// Security tracking
const failedLoginAttempts = new Map() // IP -> { count, lastAttempt }
const adminActions = [] // Store admin actions for auditing

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}))

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      // Log to console and could be extended to log to file
      console.log(`[${new Date().toISOString()}] ${message.trim()}`)
    }
  }
}))

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = req.ip || req.connection.remoteAddress
    console.log(`[SECURITY] Rate limit exceeded for IP: ${ip}`)
    res.status(429).json({
      error: 'Too many login attempts, please try again later.',
      retryAfter: '15 minutes'
    })
  }
})

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.'
  }
})

// Apply rate limiting
app.use('/api/auth', authLimiter)
app.use('/api', generalLimiter)

// Request size limits and body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── File Uploads (Multer) ────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'avatars')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(file.originalname).toLowerCase())
      ? path.extname(file.originalname).toLowerCase() : '.jpg'
    cb(null, `avatar_${req.userId || Date.now()}_${Date.now()}${ext}`)
  }
})
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype))
  }
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    /\.loca\.lt$/, // Allow all localtunnel domains
    /\.ngrok\.io$/, // Allow ngrok domains
    /\.tunnel\.me$/, // Allow tunnel.me domains
    /\.replit\.dev$/, // Allow Replit dev domains
    /\.repl\.co$/ // Allow Replit domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-User-Token']
}))

// Helper function to read JSON files
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, 'data', filename)
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }
    return []
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

// Helper function to write JSON files
const writeJsonFile = (filename, data) => {
  try {
    const dataDir = path.join(__dirname, 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    const filePath = path.join(dataDir, filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

// Initialize demo data if files don't exist
const initializeDemoData = () => {
  const articlesData = [
    {
      id: 1,
      title: 'French Basics',
      items: [
        {
          id: 1,
          title: 'French Alphabet and Pronunciation',
          description: 'Learn the French alphabet and basic pronunciation rules',
          difficulty: 'Beginner',
          content: `# French Alphabet and Pronunciation

The French alphabet consists of 26 letters, the same as English, but the pronunciation is quite different.

## The French Alphabet

**A** - /a/ (ah)  
**B** - /be/ (bay)  
**C** - /se/ (say)  
**D** - /de/ (day)  
**E** - /ə/ (uh)  

## Key Pronunciation Rules

1. **Silent Letters**: Many letters at the end of French words are silent
2. **Nasal Sounds**: French has several nasal vowel sounds
3. **The R Sound**: The French 'R' is rolled in the back of the throat

## Practice Words

- **Bonjour** /bon-ZHOOR/ - Hello
- **Merci** /mer-SEE/ - Thank you
- **Au revoir** /oh ruh-VWAHR/ - Goodbye

Remember: Practice makes perfect! Try to listen to native French speakers and repeat after them.`,
          author: 'Marie Dubois',
          lastUpdated: '2024-01-15'
        },
        {
          id: 2,
          title: 'Basic Greetings and Politeness',
          description: 'Essential phrases for everyday interactions',
          difficulty: 'Beginner',
          content: `# Basic Greetings and Politeness

Politeness is very important in French culture. Here are essential phrases you need to know.

## Greetings

- **Bonjour** - Hello (formal, used until evening)
- **Bonsoir** - Good evening
- **Salut** - Hi/Bye (informal)
- **Comment allez-vous?** - How are you? (formal)
- **Comment ça va?** - How are you? (informal)

## Politeness Expressions

- **S'il vous plaît** - Please (formal)
- **S'il te plaît** - Please (informal)
- **Merci** - Thank you
- **De rien** - You're welcome
- **Excusez-moi** - Excuse me (formal)
- **Pardon** - Sorry/Excuse me

## Cultural Tips

French people typically shake hands when meeting for the first time and kiss on both cheeks (la bise) with friends and family.`,
          author: 'Pierre Martin',
          lastUpdated: '2024-01-10'
        }
      ]
    },
    {
      id: 2,
      title: 'Grammar Fundamentals',
      items: [
        {
          id: 3,
          title: 'French Articles (Le, La, Les)',
          description: 'Understanding definite and indefinite articles',
          difficulty: 'Beginner',
          content: `# French Articles

Articles in French agree with the gender and number of the noun they modify.

## Definite Articles

- **Le** - masculine singular (le chat - the cat)
- **La** - feminine singular (la maison - the house)
- **Les** - plural for both genders (les chats - the cats)
- **L'** - before vowels (l'ami - the friend)

## Indefinite Articles

- **Un** - masculine singular (un chat - a cat)
- **Une** - feminine singular (une maison - a house)
- **Des** - plural for both genders (des chats - some cats)

## Examples

- Le livre (the book) - masculine
- La table (the table) - feminine
- Les enfants (the children) - plural
- Un homme (a man) - masculine
- Une femme (a woman) - feminine`,
          author: 'Sophie Laurent',
          lastUpdated: '2024-01-12'
        }
      ]
    }
  ]

  const quizzesData = [
    {
      id: 1,
      title: 'Basic French',
      items: [
        {
          id: 1,
          title: 'French Greetings Quiz',
          description: 'Test your knowledge of basic French greetings',
          difficulty: 'Beginner',
          questions: [
            {
              id: 1,
              question: 'How do you say "Hello" in French?',
              options: ['Bonjour', 'Bonsoir', 'Salut', 'Au revoir'],
              correct: 0
            },
            {
              id: 2,
              question: 'What does "Merci" mean?',
              options: ['Please', 'Thank you', 'Excuse me', 'Sorry'],
              correct: 1
            },
            {
              id: 3,
              question: 'How do you say "Good evening" in French?',
              options: ['Bonjour', 'Bonsoir', 'Bonne nuit', 'Salut'],
              correct: 1
            }
          ]
        },
        {
          id: 2,
          title: 'French Numbers 1-10',
          description: 'Quiz on basic French numbers',
          difficulty: 'Beginner',
          questions: [
            {
              id: 1,
              question: 'How do you say "five" in French?',
              options: ['quatre', 'cinq', 'six', 'sept'],
              correct: 1
            },
            {
              id: 2,
              question: 'What number is "huit"?',
              options: ['6', '7', '8', '9'],
              correct: 2
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Grammar',
      items: [
        {
          id: 3,
          title: 'French Articles Quiz',
          description: 'Test your understanding of le, la, les',
          difficulty: 'Intermediate',
          questions: [
            {
              id: 1,
              question: 'Which article goes with "maison" (house)?',
              options: ['le', 'la', 'les', 'un'],
              correct: 1
            }
          ]
        }
      ]
    }
  ]

  const sectionsData = [
    { id: 1, title: 'French Basics' },
    { id: 2, title: 'Grammar Fundamentals' },
    { id: 3, title: 'Vocabulary' },
    { id: 4, title: 'Conversation' }
  ]

  if (!fs.existsSync(path.join(__dirname, 'data', 'articles.json'))) {
    writeJsonFile('articles.json', articlesData)
  }
  if (!fs.existsSync(path.join(__dirname, 'data', 'quizzes.json'))) {
    writeJsonFile('quizzes.json', quizzesData)
  }
  if (!fs.existsSync(path.join(__dirname, 'data', 'sections.json'))) {
    writeJsonFile('sections.json', sectionsData)
  }
}

// Initialize demo data
initializeDemoData()

// Enhanced middleware to verify JWT token with security logging
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const ip = req.ip || req.connection.remoteAddress

  if (!token) {
    logSecurityEvent('TOKEN_MISSING', ip, {
      endpoint: req.path,
      method: req.method
    })
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logSecurityEvent('TOKEN_INVALID', ip, {
        endpoint: req.path,
        method: req.method,
        error: err.name
      })
      return res.status(403).json({ message: 'Invalid or expired token' })
    }

    // Log successful admin access
    logSecurityEvent('ADMIN_ACCESS', ip, {
      user: user.username,
      endpoint: req.path,
      method: req.method
    })

    req.user = user
    next()
  })
}

// Helper function to log admin actions
const logAdminAction = (action, user, ip, details = {}) => {
  const actionLog = {
    timestamp: new Date().toISOString(),
    action,
    user,
    ip,
    ...details
  }
  adminActions.push(actionLog)

  // Keep only last 1000 actions to prevent memory issues
  if (adminActions.length > 1000) {
    adminActions.splice(0, adminActions.length - 1000)
  }

  logSecurityEvent('ADMIN_ACTION', ip, actionLog)
}

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex')
  csrfTokens.add(token)
  
  // Clean up old tokens (keep only last 100)
  if (csrfTokens.size > 100) {
    const tokensArray = Array.from(csrfTokens)
    csrfTokens.clear()
    tokensArray.slice(-50).forEach(t => csrfTokens.add(t))
  }
  
  res.json({ csrfToken: token })
})

// Input validation middleware
const validateLogin = [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  body('csrfToken').isLength({ min: 1 }).withMessage('CSRF token is required')
]

// Helper function to log security events
const logSecurityEvent = (event, ip, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip,
    ...details
  }
  console.log(`[SECURITY] ${JSON.stringify(logEntry)}`)
  // In production, you would also write this to a secure log file
}

// Helper function to track failed login attempts
const trackFailedLogin = (ip) => {
  const now = Date.now()
  const attempts = failedLoginAttempts.get(ip) || { count: 0, lastAttempt: 0 }

  // Reset count if last attempt was more than 15 minutes ago
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0
  }

  attempts.count++
  attempts.lastAttempt = now
  failedLoginAttempts.set(ip, attempts)

  return attempts.count
}

// Auth routes
app.post('/api/auth/login', validateLogin, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const ip = req.ip || req.connection.remoteAddress
    logSecurityEvent('LOGIN_VALIDATION_FAILED', ip, { errors: errors.array() })
    return res.status(400).json({
      message: 'Invalid input',
      errors: errors.array()
    })
  }

  const { username, password, csrfToken } = req.body
  const ip = req.ip || req.connection.remoteAddress

  // Verify CSRF token
  if (!csrfToken || !csrfTokens.has(csrfToken)) {
    logSecurityEvent('CSRF_TOKEN_INVALID', ip, { username })
    return res.status(403).json({ message: 'Invalid CSRF token' })
  }

  // Remove used CSRF token
  csrfTokens.delete(csrfToken)

  // Check if admin credentials are configured
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    logSecurityEvent('ADMIN_CREDENTIALS_NOT_CONFIGURED', ip)
    return res.status(500).json({
      message: 'Server configuration error: Admin credentials not set'
    })
  }

  // Secure authentication with password hashing
  if (username === ADMIN_USERNAME && verifyPassword(password, ADMIN_PASSWORD_HASH)) {
    // Successful login
    logSecurityEvent('LOGIN_SUCCESS', ip, { username })

    // Clear failed attempts for this IP
    failedLoginAttempts.delete(ip)

    // Log admin action
    adminActions.push({
      timestamp: new Date().toISOString(),
      action: 'LOGIN',
      user: username,
      ip
    })

    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
    res.json({ token, message: 'Login successful' })
  } else {
    // Failed login
    const failedCount = trackFailedLogin(ip)
    logSecurityEvent('LOGIN_FAILED', ip, {
      username,
      failedAttempts: failedCount,
      reason: 'Invalid credentials'
    })

    res.status(401).json({ message: 'Invalid credentials' })
  }
})

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// Security status endpoint (admin only) - HIGHLY RESTRICTED
app.get('/api/security/status', authenticateToken, (req, res) => {
  const ip = req.ip || req.connection.remoteAddress

  // Double-check admin role
  if (!req.user || req.user.role !== 'admin') {
    logSecurityEvent('UNAUTHORIZED_SECURITY_ACCESS', ip, {
      user: req.user?.username || 'unknown',
      endpoint: '/api/security/status'
    })
    return res.status(403).json({ message: 'Admin access required' })
  }

  logAdminAction('VIEW_SECURITY_STATUS', req.user.username, ip)

  res.json({
    failedLoginAttempts: Array.from(failedLoginAttempts.entries()).map(([ip, data]) => ({
      ip,
      attempts: data.count,
      lastAttempt: new Date(data.lastAttempt).toISOString()
    })),
    recentAdminActions: adminActions.slice(-50), // Last 50 actions
    csrfTokensActive: csrfTokens.size,
    securityFeatures: {
      rateLimiting: true,
      helmet: true,
      csrf: true,
      logging: true,
      inputValidation: true
    }
  })
})

// Public routes
app.get('/api/articles', (req, res) => {
  const articles = readJsonFile('articles.json')
  res.json(articles)
})

app.get('/api/quizzes', (req, res) => {
  const quizzes = readJsonFile('quizzes.json')
  res.json(quizzes)
})

app.get('/api/sections', (req, res) => {
  const sections = readJsonFile('sections.json')
  res.json(sections)
})

// Phrase endpoints
app.get('/api/phrases', (req, res) => {
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const rows = db.prepare('SELECT * FROM phrases ORDER BY created_at DESC').all()
    db.close()
    res.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

app.get('/api/phrase-sections', (req, res) => {
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const rows = db.prepare('SELECT * FROM phrase_sections ORDER BY created_at ASC').all()
    db.close()
    res.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

// SEO Routes
app.get('/sitemap.xml', (req, res) => {
  try {
    const articles = readJsonFile('articles.json') || []
    const quizzes = readJsonFile('quizzes.json') || []
    const sitemap = generateSitemap(articles, quizzes)

    res.set('Content-Type', 'application/xml')
    res.send(sitemap)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).send('Error generating sitemap')
  }
})

app.get('/robots.txt', (req, res) => {
  try {
    const robotsTxt = generateRobotsTxt()
    res.set('Content-Type', 'text/plain')
    res.send(robotsTxt)
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    res.status(500).send('Error generating robots.txt')
  }
})

// Get SEO configuration
app.get('/api/seo-config', (req, res) => {
  res.json(seoConfig)
})

// Protected routes (admin only) - moved below with validation

// Input validation for articles
const validateArticle = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty level'),
  body('sectionId').isNumeric().withMessage('Section ID must be numeric'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
]

// Input validation for quizzes
const validateQuiz = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty level'),
  body('sectionId').isNumeric().withMessage('Section ID must be numeric'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
]

app.post('/api/articles', authenticateToken, validateArticle, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const ip = req.ip || req.connection.remoteAddress
    logAdminAction('CREATE_ARTICLE_VALIDATION_FAILED', req.user.username, ip, { errors: errors.array() })
    return res.status(400).json({
      message: 'Invalid input',
      errors: errors.array()
    })
  }

  const ip = req.ip || req.connection.remoteAddress
  const articles = readJsonFile('articles.json')
  const { title, description, difficulty, sectionId, content } = req.body

  const newArticle = {
    id: Date.now(),
    title,
    description,
    difficulty,
    content,
    author: req.user.username,
    lastUpdated: new Date().toISOString().split('T')[0]
  }

  const sectionIndex = articles.findIndex(section => section.id == sectionId)
  if (sectionIndex !== -1) {
    articles[sectionIndex].items.push(newArticle)
    writeJsonFile('articles.json', articles)

    logAdminAction('CREATE_ARTICLE', req.user.username, ip, {
      articleTitle: title,
      sectionId,
      articleId: newArticle.id
    })

    res.json({ message: 'Article created successfully', article: newArticle })
  } else {
    logAdminAction('CREATE_ARTICLE_FAILED', req.user.username, ip, {
      reason: 'Invalid section ID',
      sectionId
    })
    res.status(400).json({ message: 'Invalid section ID' })
  }
})

app.post('/api/quizzes', authenticateToken, validateQuiz, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const ip = req.ip || req.connection.remoteAddress
    logAdminAction('CREATE_QUIZ_VALIDATION_FAILED', req.user.username, ip, { errors: errors.array() })
    return res.status(400).json({
      message: 'Invalid input',
      errors: errors.array()
    })
  }

  const ip = req.ip || req.connection.remoteAddress
  const quizzes = readJsonFile('quizzes.json')
  const { title, description, difficulty, sectionId, questions } = req.body

  const newQuiz = {
    id: Date.now(),
    title,
    description,
    difficulty,
    questions
  }

  const sectionIndex = quizzes.findIndex(section => section.id == sectionId)
  if (sectionIndex !== -1) {
    quizzes[sectionIndex].items.push(newQuiz)
    writeJsonFile('quizzes.json', quizzes)

    logAdminAction('CREATE_QUIZ', req.user.username, ip, {
      quizTitle: title,
      sectionId,
      quizId: newQuiz.id,
      questionCount: questions.length
    })

    res.json({ message: 'Quiz created successfully', quiz: newQuiz })
  } else {
    logAdminAction('CREATE_QUIZ_FAILED', req.user.username, ip, {
      reason: 'Invalid section ID',
      sectionId
    })
    res.status(400).json({ message: 'Invalid section ID' })
  }
})

// Protected phrase endpoints
app.post('/api/phrases', authenticateToken, (req, res) => {
  try {
    const {
      title, description, french, english, literal, meaning, pronunciation,
      difficulty, usage, example, exampleTranslation, culturalNote, type, sectionId
    } = req.body

    const db = new Database(path.join(__dirname, 'french_learning.db'))

    // Get section title
    const section = db.prepare('SELECT title FROM phrase_sections WHERE id = ?').get(sectionId)
    const sectionTitle = section ? section.title : ''

    const stmt = db.prepare(`
      INSERT INTO phrases (
        title, description, french, english, literal, meaning, pronunciation,
        difficulty, usage, example, example_translation, cultural_note, type,
        section_id, section_title
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      title, description, french, english, literal, meaning, pronunciation,
      difficulty, usage, example, exampleTranslation, culturalNote, type,
      sectionId, sectionTitle
    )

    db.close()

    res.json({
      message: 'Phrase created successfully',
      phrase: { id: result.lastInsertRowid, title, french, english }
    })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

app.put('/api/phrases/:id', authenticateToken, (req, res) => {
  try {
    const phraseId = req.params.id
    const {
      title, description, french, english, literal, meaning, pronunciation,
      difficulty, usage, example, exampleTranslation, culturalNote, type, sectionId
    } = req.body

    const db = new Database(path.join(__dirname, 'french_learning.db'))

    // Get section title
    const section = db.prepare('SELECT title FROM phrase_sections WHERE id = ?').get(sectionId)
    const sectionTitle = section ? section.title : ''

    const stmt = db.prepare(`
      UPDATE phrases SET
        title = ?, description = ?, french = ?, english = ?, literal = ?,
        meaning = ?, pronunciation = ?, difficulty = ?, usage = ?, example = ?,
        example_translation = ?, cultural_note = ?, type = ?, section_id = ?,
        section_title = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    stmt.run(
      title, description, french, english, literal, meaning, pronunciation,
      difficulty, usage, example, exampleTranslation, culturalNote, type,
      sectionId, sectionTitle, phraseId
    )

    db.close()

    res.json({
      message: 'Phrase updated successfully',
      phrase: { id: phraseId, title, french, english }
    })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

app.delete('/api/phrases/:id', authenticateToken, (req, res) => {
  try {
    const phraseId = req.params.id
    const db = new Database(path.join(__dirname, 'french_learning.db'))

    const stmt = db.prepare('DELETE FROM phrases WHERE id = ?')
    stmt.run(phraseId)

    db.close()

    res.json({ message: 'Phrase deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

// Protected phrase section endpoints
app.post('/api/phrase-sections', authenticateToken, (req, res) => {
  try {
    const { title, description } = req.body

    const db = new Database(path.join(__dirname, 'french_learning.db'))

    const stmt = db.prepare(`
      INSERT INTO phrase_sections (title, description)
      VALUES (?, ?)
    `)

    const result = stmt.run(title, description)

    db.close()

    res.json({
      message: 'Phrase section created successfully',
      section: { id: result.lastInsertRowid, title, description }
    })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

app.put('/api/phrase-sections/:id', authenticateToken, (req, res) => {
  try {
    const sectionId = req.params.id
    const { title, description } = req.body

    const db = new Database(path.join(__dirname, 'french_learning.db'))

    const stmt = db.prepare(`
      UPDATE phrase_sections SET
        title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    stmt.run(title, description, sectionId)

    db.close()

    res.json({
      message: 'Phrase section updated successfully',
      section: { id: sectionId, title, description }
    })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

app.delete('/api/phrase-sections/:id', authenticateToken, (req, res) => {
  try {
    const sectionId = req.params.id
    const db = new Database(path.join(__dirname, 'french_learning.db'))

    // First delete all phrases in this section
    const deletePhrases = db.prepare('DELETE FROM phrases WHERE section_id = ?')
    deletePhrases.run(sectionId)

    // Then delete the section
    const deleteSection = db.prepare('DELETE FROM phrase_sections WHERE id = ?')
    deleteSection.run(sectionId)

    db.close()

    res.json({ message: 'Phrase section and associated phrases deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Database error' })
  }
})

// ─── User Account Routes ──────────────────────────────────────────────────────

const USER_JWT_SECRET = process.env.USER_JWT_SECRET || crypto.randomBytes(32).toString('hex')

const initUsersTable = () => {
  const db = new Database(path.join(__dirname, 'french_learning.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      cefr_level TEXT DEFAULT 'A1',
      goal TEXT DEFAULT '',
      daily_goal_mins INTEGER DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run()

  const addCol = (col, type) => {
    try { db.prepare(`ALTER TABLE users ADD COLUMN ${col} ${type}`).run() } catch {}
  }
  addCol('avatar_url', 'TEXT DEFAULT NULL')
  addCol('bio', 'TEXT DEFAULT NULL')
  addCol('learning_prefs', 'TEXT DEFAULT NULL')
  addCol('notification_prefs', 'TEXT DEFAULT NULL')
  addCol('ui_language', "TEXT DEFAULT 'en'")
  addCol('accessibility', 'TEXT DEFAULT NULL')
  addCol('weekly_goal_xp', 'INTEGER DEFAULT 500')
  addCol('oauth_provider', 'TEXT DEFAULT NULL')
  addCol('oauth_id', 'TEXT DEFAULT NULL')
  addCol('progress_data', 'TEXT DEFAULT NULL')

  db.prepare(`
    CREATE TABLE IF NOT EXISTS study_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT NULL,
      xp INTEGER DEFAULT 0,
      metadata TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      session_data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run()

  db.close()
}

try { initUsersTable() } catch (e) { console.error('Users table init error:', e.message) }

const hashUserPassword = (password) =>
  crypto.pbkdf2Sync(password, 'user_salt_v1', 10000, 64, 'sha512').toString('hex')

const verifyUserPassword = (password, hash) =>
  crypto.timingSafeEqual(
    Buffer.from(hashUserPassword(password), 'hex'),
    Buffer.from(hash, 'hex')
  )

const authenticateUser = (req, res, next) => {
  const token = req.headers['x-user-token']
  if (!token) return res.status(401).json({ message: 'Authentication required' })
  try {
    const decoded = jwt.verify(token, USER_JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const userRegisterLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 })

app.post('/api/users/register', userRegisterLimiter, (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' })
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email address' })
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase())
    if (existing) { db.close(); return res.status(409).json({ message: 'An account with this email already exists' }) }
    const hash = hashUserPassword(password)
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name.trim(), email.toLowerCase(), hash)
    const user = db.prepare('SELECT id, name, email, cefr_level, goal, daily_goal_mins, created_at FROM users WHERE id = ?').get(result.lastInsertRowid)
    db.close()
    const token = jwt.sign({ userId: user.id }, USER_JWT_SECRET, { expiresIn: '30d' })
    res.status(201).json({ token, user })
  } catch (e) {
    console.error('Register error:', e)
    res.status(500).json({ message: 'Registration failed' })
  }
})

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase())
    db.close()
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })
    let valid = false
    try { valid = verifyUserPassword(password, user.password_hash) } catch { valid = false }
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' })
    const token = jwt.sign({ userId: user.id }, USER_JWT_SECRET, { expiresIn: '30d' })
    const { password_hash, ...safeUser } = user
    res.json({ token, user: safeUser })
  } catch (e) {
    console.error('Login error:', e)
    res.status(500).json({ message: 'Login failed' })
  }
})

app.get('/api/users/profile', authenticateUser, (req, res) => {
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const user = db.prepare('SELECT id, name, email, cefr_level, goal, daily_goal_mins, avatar_url, bio, learning_prefs, notification_prefs, ui_language, accessibility, weekly_goal_xp, oauth_provider, created_at FROM users WHERE id = ?').get(req.userId)
    db.close()
    if (!user) return res.status(404).json({ message: 'User not found' })
    const parseJson = (v) => { try { return v ? JSON.parse(v) : null } catch { return null } }
    res.json({ user: { ...user, learning_prefs: parseJson(user.learning_prefs), notification_prefs: parseJson(user.notification_prefs), accessibility: parseJson(user.accessibility) } })
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

app.put('/api/users/profile', authenticateUser, (req, res) => {
  const { name, goal, cefr_level, daily_goal_mins, bio, avatar_url, learning_prefs, notification_prefs, ui_language, accessibility, weekly_goal_xp } = req.body
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const stringify = (v) => (v && typeof v === 'object') ? JSON.stringify(v) : (v || null)
    db.prepare(`UPDATE users SET
      name = COALESCE(?, name),
      goal = COALESCE(?, goal),
      cefr_level = COALESCE(?, cefr_level),
      daily_goal_mins = COALESCE(?, daily_goal_mins),
      bio = COALESCE(?, bio),
      avatar_url = COALESCE(?, avatar_url),
      learning_prefs = COALESCE(?, learning_prefs),
      notification_prefs = COALESCE(?, notification_prefs),
      ui_language = COALESCE(?, ui_language),
      accessibility = COALESCE(?, accessibility),
      weekly_goal_xp = COALESCE(?, weekly_goal_xp),
      updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(name || null, goal || null, cefr_level || null, daily_goal_mins || null,
           bio || null, avatar_url || null, stringify(learning_prefs), stringify(notification_prefs),
           ui_language || null, stringify(accessibility), weekly_goal_xp || null, req.userId)
    const user = db.prepare('SELECT id, name, email, cefr_level, goal, daily_goal_mins, avatar_url, bio, learning_prefs, notification_prefs, ui_language, accessibility, weekly_goal_xp, oauth_provider, created_at FROM users WHERE id = ?').get(req.userId)
    db.close()
    const parseJson = (v) => { try { return v ? JSON.parse(v) : null } catch { return null } }
    res.json({ user: { ...user, learning_prefs: parseJson(user.learning_prefs), notification_prefs: parseJson(user.notification_prefs), accessibility: parseJson(user.accessibility) } })
  } catch (e) {
    console.error('Profile update error:', e)
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

// ─── Extended User Account Routes ────────────────────────────────────────────

app.post('/api/users/upload-avatar', authenticateUser, avatarUpload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file provided or unsupported format' })
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const avatarUrl = `/uploads/avatars/${req.file.filename}`
    db.prepare('UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(avatarUrl, req.userId)
    db.close()
    res.json({ avatar_url: avatarUrl })
  } catch (e) {
    res.status(500).json({ message: 'Failed to save avatar' })
  }
})

app.put('/api/users/change-password', authenticateUser, (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword || newPassword.length < 6)
    return res.status(400).json({ message: 'Invalid password data' })
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.userId)
    if (!user) { db.close(); return res.status(404).json({ message: 'User not found' }) }
    let valid = false
    try { valid = verifyUserPassword(currentPassword, user.password_hash) } catch {}
    if (!valid) { db.close(); return res.status(401).json({ message: 'Current password is incorrect' }) }
    const newHash = hashUserPassword(newPassword)
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, req.userId)
    db.close()
    res.json({ message: 'Password changed successfully' })
  } catch (e) {
    res.status(500).json({ message: 'Failed to change password' })
  }
})

app.delete('/api/users/account', authenticateUser, (req, res) => {
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    db.prepare('DELETE FROM study_history WHERE user_id = ?').run(req.userId)
    db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(req.userId)
    db.prepare('DELETE FROM users WHERE id = ?').run(req.userId)
    db.close()
    res.json({ message: 'Account deleted successfully' })
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete account' })
  }
})

app.get('/api/users/export', authenticateUser, (req, res) => {
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const user = db.prepare('SELECT id, name, email, cefr_level, goal, daily_goal_mins, avatar_url, bio, learning_prefs, ui_language, weekly_goal_xp, created_at FROM users WHERE id = ?').get(req.userId)
    const history = db.prepare('SELECT type, title, description, xp, created_at FROM study_history WHERE user_id = ? ORDER BY created_at DESC').all(req.userId)
    const session = db.prepare('SELECT session_data, updated_at FROM user_sessions WHERE user_id = ?').get(req.userId)
    db.close()
    const parseJson = (v) => { try { return v ? JSON.parse(v) : null } catch { return null } }
    res.json({
      exported_at: new Date().toISOString(),
      profile: { ...user, learning_prefs: parseJson(user.learning_prefs) },
      study_history: history,
      last_session: session ? { ...session, session_data: parseJson(session.session_data) } : null,
    })
  } catch (e) {
    res.status(500).json({ message: 'Failed to export data' })
  }
})

app.get('/api/users/study-history', authenticateUser, (req, res) => {
  const limit = Math.min(200, parseInt(req.query.limit || '50'))
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const history = db.prepare('SELECT id, type, title, description, xp, metadata, created_at FROM study_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(req.userId, limit)
    db.close()
    res.json({ history: history.map(h => ({ ...h, metadata: h.metadata ? JSON.parse(h.metadata) : null })) })
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch study history' })
  }
})

app.post('/api/users/study-history', authenticateUser, (req, res) => {
  const { type, title, desc, xp, metadata } = req.body
  if (!type || !title) return res.status(400).json({ message: 'type and title required' })
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    db.prepare('INSERT INTO study_history (user_id, type, title, description, xp, metadata) VALUES (?, ?, ?, ?, ?, ?)')
      .run(req.userId, type, title, desc || null, xp || 0, metadata ? JSON.stringify(metadata) : null)
    db.close()
    res.json({ message: 'Event recorded' })
  } catch (e) {
    res.status(500).json({ message: 'Failed to record event' })
  }
})

app.get('/api/users/session', authenticateUser, (req, res) => {
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const row = db.prepare('SELECT session_data, updated_at FROM user_sessions WHERE user_id = ?').get(req.userId)
    db.close()
    if (!row) return res.json({ session: null })
    res.json({ session: JSON.parse(row.session_data), updated_at: row.updated_at })
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch session' })
  }
})

app.put('/api/users/session', authenticateUser, (req, res) => {
  const { session_data } = req.body
  if (!session_data) return res.status(400).json({ message: 'session_data required' })
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    db.prepare('INSERT OR REPLACE INTO user_sessions (user_id, session_data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
      .run(req.userId, JSON.stringify(session_data))
    db.close()
    res.json({ message: 'Session saved' })
  } catch (e) {
    res.status(500).json({ message: 'Failed to save session' })
  }
})

app.get('/api/users/progress-sync', authenticateUser, (req, res) => {
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const row = db.prepare('SELECT progress_data FROM users WHERE id = ?').get(req.userId)
    db.close()
    const progress = row?.progress_data ? JSON.parse(row.progress_data) : null
    res.json({ progress })
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch progress' })
  }
})

app.put('/api/users/progress-sync', authenticateUser, (req, res) => {
  const { progress } = req.body
  if (!progress) return res.status(400).json({ message: 'progress required' })
  try {
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    db.prepare('UPDATE users SET progress_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(JSON.stringify(progress), req.userId)
    db.close()
    res.json({ message: 'Progress synced' })
  } catch (e) {
    res.status(500).json({ message: 'Failed to sync progress' })
  }
})

app.post('/api/users/auth/google', async (req, res) => {
  const { credential } = req.body
  if (!credential) return res.status(400).json({ message: 'Google credential required' })
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  if (!GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google OAuth not configured on this server' })
  try {
    const tokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`)
    const payload = await tokenRes.json()
    if (payload.error || !payload.email_verified || payload.email_verified === 'false')
      return res.status(401).json({ message: 'Invalid Google token' })
    if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID)
      return res.status(401).json({ message: 'Token audience mismatch' })
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(payload.email.toLowerCase())
    if (!user) {
      const result = db.prepare('INSERT INTO users (name, email, password_hash, oauth_provider, oauth_id, avatar_url) VALUES (?, ?, ?, ?, ?, ?)')
        .run(payload.name || payload.email.split('@')[0], payload.email.toLowerCase(), 'OAUTH_GOOGLE', 'google', payload.sub, payload.picture || null)
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
    } else if (!user.oauth_provider) {
      db.prepare('UPDATE users SET oauth_provider = ?, oauth_id = ? WHERE id = ?').run('google', payload.sub, user.id)
    }
    db.close()
    const token = jwt.sign({ userId: user.id }, USER_JWT_SECRET, { expiresIn: '30d' })
    const { password_hash, progress_data, ...safeUser } = user
    const parseJson = (v) => { try { return v ? JSON.parse(v) : null } catch { return null } }
    res.json({ token, user: { ...safeUser, learning_prefs: parseJson(safeUser.learning_prefs), accessibility: parseJson(safeUser.accessibility) } })
  } catch (e) {
    console.error('Google auth error:', e)
    res.status(500).json({ message: 'Google authentication failed' })
  }
})

// ─── End User Account Routes ─────────────────────────────────────────────────

// ─── Verb Conjugation Routes ──────────────────────────────────────────────────

// GET /api/verbs/search?q=parl  — autocomplete suggestions (up to 12)
app.get('/api/verbs/search', (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase().trim()
    if (!q || q.length < 1) return res.json([])
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const rows = db.prepare(
      `SELECT infinitive, english, verb_group, is_irregular, frequency
       FROM verbs
       WHERE infinitive LIKE ?
       ORDER BY frequency ASC, infinitive ASC
       LIMIT 12`
    ).all(`${q}%`)
    db.close()
    res.json(rows)
  } catch (e) {
    console.error('Verb search error:', e)
    res.status(500).json({ error: 'Search failed' })
  }
})

// GET /api/verbs/list  — paginated list of all verbs (for the browse grid)
app.get('/api/verbs/list', (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1'))
    const limit = Math.min(200, parseInt(req.query.limit || '100'))
    const group = req.query.group || ''
    const offset = (page - 1) * limit
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const where = group ? 'WHERE verb_group = ?' : ''
    const params = group ? [group, limit, offset] : [limit, offset]
    const rows  = db.prepare(
      `SELECT infinitive, english, verb_group, is_irregular, frequency
       FROM verbs ${where}
       ORDER BY frequency ASC, infinitive ASC
       LIMIT ? OFFSET ?`
    ).all(...params)
    const total = db.prepare(`SELECT COUNT(*) as cnt FROM verbs ${where}`)
      .get(...(group ? [group] : [])).cnt
    db.close()
    res.json({ verbs: rows, total, page, limit })
  } catch (e) {
    console.error('Verb list error:', e)
    res.status(500).json({ error: 'List failed' })
  }
})

// GET /api/verbs/:infinitive  — full conjugation data for one verb
app.get('/api/verbs/:infinitive', (req, res) => {
  try {
    const infinitive = req.params.infinitive.toLowerCase().trim()
    const db = new Database(path.join(__dirname, 'french_learning.db'))
    const row = db.prepare('SELECT * FROM verbs WHERE infinitive = ?').get(infinitive)
    db.close()
    if (!row) return res.status(404).json({ error: 'Verb not found' })
    const parse = (s) => { try { return JSON.parse(s) } catch { return {} } }
    res.json({
      infinitive: row.infinitive,
      english:    row.english,
      group:      row.verb_group,
      frequency:  row.frequency,
      irregular:  row.is_irregular === 1,
      participe_passe:   row.participe_passe,
      participe_present: row.participe_present,
      notes: row.notes,
      tenses: {
        'présent':             parse(row.tense_present),
        'passé composé':       parse(row.tense_passe_compose),
        'imparfait':           parse(row.tense_imparfait),
        'futur simple':        parse(row.tense_futur),
        'conditionnel présent':parse(row.tense_conditionnel),
        'subjonctif présent':  parse(row.tense_subjonctif),
        'impératif':           parse(row.tense_imperatif),
        'passé simple':        parse(row.tense_passe_simple),
      }
    })
  } catch (e) {
    console.error('Verb lookup error:', e)
    res.status(500).json({ error: 'Lookup failed' })
  }
})

// ─── End Verb Conjugation Routes ──────────────────────────────────────────────

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

  // Security check
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    console.warn('⚠️  WARNING: Admin credentials not configured!')
    console.warn('⚠️  Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH environment variables')
    console.warn('⚠️  Admin login will not work until these are set')
  } else {
    console.log('✅ Admin credentials configured securely')
  }
})
