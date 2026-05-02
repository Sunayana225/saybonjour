import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export const seoConfig = {
  siteUrl:            'https://saybonjour.com',
  siteName:           'SayBonjour!',
  defaultTitle:       'SayBonjour! — Learn French Online | Interactive French Learning Platform',
  defaultDescription: 'Master French with SayBonjour! — interactive lessons, quizzes, vocabulary, cultural insights, and daily challenges. Free French learning for all levels.',
  defaultKeywords:    'learn french, french lessons online, french vocabulary, french grammar, french quizzes, french culture',
  author:             'SayBonjour! Team',
  twitterHandle:      '@saybonjour',
}

// All public routes with SEO metadata
const STATIC_PAGES = [
  { url: '/',                  priority: '1.0', changefreq: 'weekly'  },
  { url: '/resources',         priority: '0.9', changefreq: 'daily'   },
  { url: '/quizzes',           priority: '0.9', changefreq: 'daily'   },
  { url: '/grammar',           priority: '0.9', changefreq: 'weekly'  },
  { url: '/vocabulary',        priority: '0.9', changefreq: 'weekly'  },
  { url: '/conjugate',         priority: '0.8', changefreq: 'monthly' },
  { url: '/sentence-builder',  priority: '0.8', changefreq: 'monthly' },
  { url: '/reading',           priority: '0.8', changefreq: 'weekly'  },
  { url: '/culture',           priority: '0.8', changefreq: 'weekly'  },
  { url: '/media',             priority: '0.8', changefreq: 'weekly'  },
  { url: '/france-map',        priority: '0.7', changefreq: 'monthly' },
  { url: '/travel-french',     priority: '0.8', changefreq: 'monthly' },
  { url: '/business-french',   priority: '0.8', changefreq: 'monthly' },
  { url: '/slang-french',      priority: '0.7', changefreq: 'monthly' },
  { url: '/jokes',             priority: '0.6', changefreq: 'monthly' },
  { url: '/study-tools',       priority: '0.7', changefreq: 'weekly'  },
  { url: '/daily-challenges',  priority: '0.7', changefreq: 'daily'   },
  { url: '/phrase-of-the-day', priority: '0.7', changefreq: 'daily'   },
  { url: '/stories',           priority: '0.7', changefreq: 'weekly'  },
  { url: '/typing-race',       priority: '0.6', changefreq: 'monthly' },
  { url: '/word-match',        priority: '0.6', changefreq: 'monthly' },
  { url: '/memory-boosters',   priority: '0.6', changefreq: 'monthly' },
  { url: '/worksheets',        priority: '0.7', changefreq: 'weekly'  },
  { url: '/writing-templates', priority: '0.6', changefreq: 'monthly' },
  { url: '/learning-path',     priority: '0.5', changefreq: 'weekly'  },
]

export const generateSitemap = (articles = [], quizzes = []) => {
  const { siteUrl } = seoConfig
  const today = new Date().toISOString().split('T')[0]

  const articlePages = articles.flatMap(section =>
    (section.items || []).map(article => ({
      url:        `/resources/${article.id}`,
      priority:   '0.8',
      changefreq: 'monthly',
      lastmod:    article.lastUpdated || today,
    }))
  )

  const quizPages = quizzes.flatMap(section =>
    (section.items || []).map(quiz => ({
      url:        `/quizzes/${quiz.id}`,
      priority:   '0.7',
      changefreq: 'monthly',
      lastmod:    quiz.lastUpdated || today,
    }))
  )

  const allPages = [
    ...STATIC_PAGES.map(p => ({ ...p, lastmod: today })),
    ...articlePages,
    ...quizPages,
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(p => `  <url>
    <loc>${siteUrl}${p.url}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export const generateRobotsTxt = () => {
  const { siteUrl } = seoConfig
  return `User-agent: *
Allow: /

# Private / user-specific areas — no indexing needed
Disallow: /admin
Disallow: /api/
Disallow: /settings
Disallow: /profile
Disallow: /history
Disallow: /learning-path
Disallow: /favorites
Disallow: /progress
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /onboarding

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml`
}

export const generateArticleStructuredData = (article, section) => {
  const { siteUrl, siteName, author } = seoConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Organization', name: article.author || author },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` },
    },
    datePublished: article.createdAt || article.lastUpdated,
    dateModified:  article.lastUpdated,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/resources/${article.id}` },
    articleSection: section?.title || 'French Learning',
    keywords: ['French', 'Language Learning', article.difficulty, section?.title].filter(Boolean).join(', '),
    inLanguage: 'en',
    about: { '@type': 'Thing', name: 'French Language Learning' },
    educationalLevel: article.difficulty,
    learningResourceType: 'Article',
  }
}

export const generateCourseStructuredData = (quiz, section) => {
  const { siteUrl, siteName } = seoConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: quiz.title,
    description: quiz.description,
    provider: { '@type': 'Organization', name: siteName, url: siteUrl },
    educationalLevel: quiz.difficulty,
    inLanguage: 'fr',
    teaches: 'French Language',
    courseMode: 'online',
    isAccessibleForFree: true,
    url: `${siteUrl}/quizzes/${quiz.id}`,
    about: { '@type': 'Thing', name: section?.title || 'French Language' },
  }
}

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  const { siteUrl } = seoConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.url}`,
    })),
  }
}

export const saveSitemap = (articles = [], quizzes = []) => {
  try {
    const sitemap  = generateSitemap(articles, quizzes)
    const publicDir = path.join(__dirname, '..', 'public')
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
    console.log('✅ Sitemap generated successfully')
    return true
  } catch (err) {
    console.error('❌ Error generating sitemap:', err)
    return false
  }
}

export const saveRobotsTxt = () => {
  try {
    const robotsTxt = generateRobotsTxt()
    const publicDir  = path.join(__dirname, '..', 'public')
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt)
    console.log('✅ Robots.txt generated successfully')
    return true
  } catch (err) {
    console.error('❌ Error generating robots.txt:', err)
    return false
  }
}
