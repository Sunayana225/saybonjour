import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEO = ({
  title = "SayBonjour - Learn French Online | Interactive French Learning Platform",
  description = "Master French with SayBonjour - the comprehensive online French learning platform. Interactive lessons, quizzes, cultural insights, and more. Start your French journey today!",
  keywords = "learn french, french lessons, french language, online french course, french grammar, french vocabulary, french culture, french learning platform, saybonjour",
  image = null,
  url = "",
  type = "website",
  author = "SayBonjour Team",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  canonical
}) => {
  const siteUrl = "https://saybonjour.com" // Replace with your actual domain
  const fullUrl = `${siteUrl}${url}`
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : null

  // Structured Data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SayBonjour",
    "description": "Interactive French Learning Platform",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "sameAs": [
      "https://instagram.com/saybonjour"
    ]
  }

  // Structured Data for Educational Organization
  const educationalSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "SayBonjour",
    "description": "Online French Learning Platform",
    "url": siteUrl,
    "educationalCredentialAwarded": "French Language Proficiency",
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "French Language Certificate",
      "description": "Certificate of completion for French language courses"
    }
  }

  // Structured Data for Course (if it's a course page)
  const courseSchema = type === 'course' ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "SayBonjour"
    },
    "educationalLevel": "Beginner to Advanced",
    "inLanguage": "fr",
    "teaches": "French Language",
    "courseMode": "online",
    "isAccessibleForFree": true
  } : null

  // Structured Data for Article (if it's an article page)
  const articleSchema = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": fullImageUrl,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "SayBonjour",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.svg`
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "articleSection": section,
    "keywords": tags.join(', '),
    "inLanguage": "en",
    "about": {
      "@type": "Thing",
      "name": "French Language Learning"
    }
  } : null

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SayBonjour",
    "url": siteUrl,
    "description": "Interactive French Learning Platform",
    "inLanguage": "en",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {fullImageUrl && <meta property="og:image" content={fullImageUrl} />}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="SayBonjour" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific OG tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
          <meta property="article:author" content={author} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {fullImageUrl && <meta name="twitter:image" content={fullImageUrl} />}
      <meta name="twitter:site" content="@saybonjour" />
      <meta name="twitter:creator" content="@saybonjour" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#800020" />
      <meta name="msapplication-TileColor" content="#800020" />
      <meta name="application-name" content="SayBonjour" />
      
      {/* Language and Geo */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(educationalSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {courseSchema && (
        <script type="application/ld+json">
          {JSON.stringify(courseSchema)}
        </script>
      )}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
