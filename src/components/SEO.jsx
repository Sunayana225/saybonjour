import React from 'react'
import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://saybonjour.com'
const SITE_NAME = 'SayBonjour!'
const SITE_AUTHOR = 'Sunayana' // homepage author name used for structured data
const DEFAULT_TITLE = 'SayBonjour! — Learn French Online | Interactive French Learning Platform'
const DEFAULT_DESC  = 'Master French with SayBonjour! — interactive lessons, quizzes, vocabulary tools, cultural insights, and daily challenges. Free French learning for all levels.'
const DEFAULT_KEYS  = 'learn french, french lessons online, french vocabulary, french grammar, french quizzes, french culture, saybonjour'

const SEO = ({
  title       = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords    = DEFAULT_KEYS,
  image       = null,
  url         = '',
  type        = 'website',
  author      = SITE_NAME,
  publishedTime,
  modifiedTime,
  section,
  tags        = [],
  noindex     = false,
  canonical,
}) => {
  const fullUrl      = `${SITE_URL}${url}`
  const canonicalUrl = canonical || fullUrl
  const imageUrl     = image
    ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
    : `${SITE_URL}/og-default.png`

  /* ── Structured data ─────────────────────────── */

  // Home page: emit full site-level schemas
  const isHome = type === 'website' && url === ''
  const organizationSchema = isHome ? {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    name: SITE_NAME,
    description: 'Interactive French Learning Platform',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: ['https://instagram.com/saybonjour'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'French Language Courses',
      itemListElement: [
        { '@type': 'Course', name: 'French Grammar A1–C2', url: `${SITE_URL}/grammar` },
        { '@type': 'Course', name: 'French Vocabulary SRS', url: `${SITE_URL}/vocabulary` },
        { '@type': 'Course', name: 'French Quizzes',       url: `${SITE_URL}/quizzes`    },
      ],
    },
  } : null

  const websiteSchema = isHome ? {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESC,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/resources?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  } : null

  // If this is the home page, emit a Person schema for the site author
  const homeAuthorSchema = isHome ? {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_AUTHOR,
    jobTitle: 'Founder',
    affiliation: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    // Fill these with real profile URLs to strengthen identity signals
    sameAs: [
      'https://twitter.com/your_profile',
      'https://www.linkedin.com/in/your_profile',
      'https://instagram.com/your_profile'
    ]
  } : null

  // Course pages
  const courseSchema = type === 'course' ? {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    educationalLevel: 'Beginner to Advanced',
    inLanguage: 'fr',
    teaches: 'French Language',
    courseMode: 'online',
    isAccessibleForFree: true,
    url: canonicalUrl,
  } : null

  // Article pages
  const articleSchema = type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    author: { '@type': 'Organization', name: author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    articleSection: section,
    keywords: tags.join(', '),
    inLanguage: 'en',
    about: { '@type': 'Thing', name: 'French Language Learning' },
  } : null

  // Emit a Person schema for author (non-visible) so search engines can associate a named author
  // If you prefer the author to be a Person rather than an Organization set `author` prop accordingly.
  const authorPersonSchema = author ? {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author,
    url: canonicalUrl, // points to this page; can be changed to an author profile URL if desired
  } : null

  // Default WebPage schema for all other pages
  const webPageSchema = !isHome && type !== 'course' && type !== 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    inLanguage: 'en',
    about: { '@type': 'Thing', name: 'French Language Learning' },
  } : null

  return (
    <Helmet>
      {/* Core */}
      <title>{title}</title>
      <meta name="description"   content={description} />
      <meta name="keywords"      content={keywords}    />
      <meta name="author"        content={author}      />
      <link rel="canonical"      href={canonicalUrl}   />
      <meta name="robots"        content={noindex ? 'noindex,nofollow' : 'index,follow'} />

      {/* Open Graph */}
      <meta property="og:type"        content={type}        />
      <meta property="og:title"       content={title}       />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={imageUrl}    />
      <meta property="og:url"         content={canonicalUrl}/>
      <meta property="og:site_name"   content={SITE_NAME}   />
      <meta property="og:locale"      content="en_US"       />

      {/* Article OG extras */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter / X */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title}               />
      <meta name="twitter:description" content={description}         />
      <meta name="twitter:image"       content={imageUrl}            />
      <meta name="twitter:site"        content="@saybonjour"         />

      {/* Branding */}
      <meta name="theme-color"        content="#800020" />
      <meta name="application-name"   content={SITE_NAME} />

      {/* Structured data (only emit what's needed for this page type) */}
      {organizationSchema && (
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      )}
      {websiteSchema && (
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      )}
      {homeAuthorSchema && (
        <script type="application/ld+json">{JSON.stringify(homeAuthorSchema)}</script>
      )}
      {courseSchema && (
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      )}
      {articleSchema && (
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      )}
      {authorPersonSchema && (
        <script type="application/ld+json">{JSON.stringify(authorPersonSchema)}</script>
      )}
      {webPageSchema && (
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      )}
    </Helmet>
  )
}

export default SEO
