import React, { useState, useEffect } from 'react'
import { Calendar, BookOpen } from 'lucide-react'
import ContentSidebar from '../components/ContentSidebar'
import BookmarkButton from '../components/BookmarkButton'
import axios from 'axios'
import SEO from '../components/SEO'

const Resources = () => {
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [expandedSections, setExpandedSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles')
      setSections(response.data)
      
      // Auto-expand first section and select first article
      if (response.data.length > 0) {
        const firstSection = response.data[0]
        setExpandedSections([firstSection.id])
        if (firstSection.items.length > 0) {
          setSelectedSection(firstSection.id)
          setSelectedItem(firstSection.items[0].id)
          setSelectedArticle(firstSection.items[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
      // Fallback to demo data
      setDemoData()
    } finally {
      setLoading(false)
    }
  }

  const setDemoData = () => {
    const demoSections = [
      {
        id: 1,
        title: 'French Basics',
        items: [
          {
            id: 1,
            title: 'French Alphabet and Pronunciation',
            description: 'Learn the French alphabet and basic pronunciation rules',
            difficulty: 'Beginner',
            content: `
# French Alphabet and Pronunciation

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

Remember: Practice makes perfect! Try to listen to native French speakers and repeat after them.
            `,
            author: 'Marie Dubois',
            lastUpdated: '2024-01-15'
          },
          {
            id: 2,
            title: 'Basic Greetings and Politeness',
            description: 'Essential phrases for everyday interactions',
            difficulty: 'Beginner',
            content: `
# Basic Greetings and Politeness

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

French people typically shake hands when meeting for the first time and kiss on both cheeks (la bise) with friends and family.
            `,
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
            content: `
# French Articles

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
- Une femme (a woman) - feminine
            `,
            author: 'Sophie Laurent',
            lastUpdated: '2024-01-12'
          }
        ]
      }
    ]
    
    setSections(demoSections)
    setExpandedSections([1])
    setSelectedSection(1)
    setSelectedItem(1)
    setSelectedArticle(demoSections[0].items[0])
  }

  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleItemSelect = (itemId) => {
    const article = sections
      .flatMap(section => section.items)
      .find(item => item.id === itemId)
    setSelectedArticle(article)
    setSelectedItem(itemId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    )
  }

  // Dynamic SEO based on selected article
  const seoTitle = selectedArticle
    ? `${selectedArticle.title} | French Resources - SayBonjour`
    : "French Learning Resources | Articles & Lessons - SayBonjour"

  const seoDescription = selectedArticle
    ? `${selectedArticle.description} - Learn French with comprehensive articles and lessons on SayBonjour platform.`
    : "Access comprehensive French learning resources, articles, and lessons organized by topics and skill levels. Master French grammar, vocabulary, and culture with SayBonjour."

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={selectedArticle
          ? `french ${selectedArticle.title.toLowerCase()}, ${selectedArticle.difficulty?.toLowerCase()} french, french lessons, learn french`
          : "french resources, french articles, french lessons, learn french, french grammar, french vocabulary, french learning materials"
        }
        url="/resources"
        type={selectedArticle ? "article" : "website"}
        publishedTime={selectedArticle?.lastUpdated}
        section="French Learning"
        tags={selectedArticle ? [selectedArticle.difficulty, "French", "Language Learning"] : ["French", "Resources", "Learning"]}
      />
      <div className="flex h-[calc(100vh-60px)] bg-white dark:bg-dark-warm-300">
      <ContentSidebar
        sections={sections}
        selectedSection={selectedSection}
        selectedItem={selectedItem}
        onSectionSelect={setSelectedSection}
        onItemSelect={handleItemSelect}
        expandedSections={expandedSections}
        onToggleSection={handleToggleSection}
      />

      <div className="flex-1 overflow-y-auto w-full md:w-auto">
        {selectedArticle ? (
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50 flex-1">
                  {selectedArticle.title}
                </h1>
                <BookmarkButton
                  item={selectedArticle}
                  type="articles"
                  variant="floating"
                  size="lg"
                />
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                {selectedArticle.lastUpdated && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Updated {selectedArticle.lastUpdated}</span>
                  </div>
                )}
                {selectedArticle.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedArticle.difficulty === 'Beginner'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : selectedArticle.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {selectedArticle.difficulty}
                  </span>
                )}
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div
                className="leading-relaxed text-gray-800 dark:text-gray-200 rich-content"
                style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.7' }}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const content = selectedArticle.content || 'No content available.'

                    // Check if content is already HTML (contains HTML tags)
                    const isHTML = /<[a-z][\s\S]*>/i.test(content)

                    if (isHTML) {
                      // Content is already HTML from rich text editor, return as-is
                      return content
                    } else {
                      // Content is markdown, apply transformations
                      return content
                        // First handle headers to avoid conflicts
                        .replace(/^# ([^\n]+)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8 leading-tight">$1</h1>')
                        .replace(/^## ([^\n]+)/gm, '<h2 class="text-2xl font-bold text-burgundy-700 mt-8 mb-4 border-l-4 border-burgundy-500 pl-4 leading-tight">$1</h2>')
                        .replace(/^### ([^\n]+)/gm, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3 leading-tight">$1</h3>')
                        // Handle bold text
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-burgundy-800 bg-burgundy-50 px-2 py-1 rounded">$1</strong>')
                        // Handle bullet points
                        .replace(/^- ([^\n]+)/gm, '<div class="flex items-start mb-3 ml-4"><span class="w-2 h-2 bg-burgundy-500 rounded-full mt-3 mr-4 flex-shrink-0"></span><span class="text-gray-700 text-base">$1</span></div>')
                        // Handle numbered lists
                        .replace(/^(\d+)\. ([^\n]+)/gm, '<div class="flex items-start mb-3 ml-4"><span class="w-7 h-7 bg-burgundy-100 text-burgundy-700 rounded-full text-sm font-bold flex items-center justify-center mr-4 flex-shrink-0 mt-1">$1</span><span class="text-gray-700 text-base">$2</span></div>')
                        // Handle line breaks and spacing
                        .replace(/\n\n/g, '<div class="mb-6"></div>')
                        .replace(/\n/g, '<br>')
                    }
                  })()
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-cream-50 mb-2">
                Select an Article
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a topic from the sidebar to start learning
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Resources
