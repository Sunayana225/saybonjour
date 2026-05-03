import React, { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, BookOpen, Brain, Save, X, Settings, FolderPlus, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, FileText, Upload, Download, MessageCircle, Globe, Zap, Volume2, CheckCircle, Laugh, Plane, Briefcase, Flame, BookMarked, PenLine, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/AdminLogin'
import SpeakButton from '../components/SpeakButton'
import AdminContentPanel from '../components/AdminContentPanel'
import { loadPhrases, savePhrases, loadPhraseSections, savePhraseSections } from '../utils/phraseData'
import axios from 'axios'

const CONTENT_TABS = ['jokes', 'travel-vocab', 'business-vocab', 'slang', 'reading', 'writing', 'sentences']

const Admin = () => {
  const { isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('sections')
  const [articles, setArticles] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [sections, setSections] = useState([])
  const [worksheets, setWorksheets] = useState([])
  const [phrases, setPhrases] = useState([])
  const [phraseSections, setPhraseSections] = useState([])
  const [vocabWords, setVocabWords] = useState([])
  const [dailyVocab, setDailyVocab] = useState([])
  const [siteSettings, setSiteSettings] = useState({})
  const [vocabForm, setVocabForm] = useState({ french: '', english: '', category: 'Custom', list_name: 'Custom Words', difficulty: 'Beginner', notes: '' })
  const [dailyVocabForm, setDailyVocabForm] = useState({ french: '', english: '', category: 'General' })
  const [showVocabForm, setShowVocabForm] = useState(false)
  const [showDailyVocabForm, setShowDailyVocabForm] = useState(false)
  const [editingVocab, setEditingVocab] = useState(null)
  const [editingDailyVocab, setEditingDailyVocab] = useState(null)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    sectionId: '',
    content: '',
    questions: []
  })
  const [sectionFormData, setSectionFormData] = useState({
    title: '',
    description: ''
  })
  const [worksheetFormData, setWorksheetFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    category: 'Grammar',
    file: null,
    fileName: ''
  })
  const [phraseFormData, setPhraseFormData] = useState({
    title: '',
    description: '',
    french: '',
    english: '',
    literal: '',
    meaning: '',
    pronunciation: '',
    difficulty: 'Beginner',
    usage: '',
    example: '',
    exampleTranslation: '',
    culturalNote: '',
    type: 'proverb',
    sectionId: ''
  })
  const contentEditorRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
      // Initialize with sample worksheets
      setWorksheets([
        {
          id: 1,
          title: "French Verb Conjugations",
          description: "Practice common French verb conjugations with exercises and examples.",
          difficulty: "Beginner",
          category: "Grammar",
          fileName: "french-verbs-beginner.pdf"
        },
        {
          id: 2,
          title: "French Food Vocabulary",
          description: "Learn essential French food and cooking vocabulary with visual aids.",
          difficulty: "Intermediate",
          category: "Vocabulary",
          fileName: "french-food-vocabulary.pdf"
        },
        {
          id: 3,
          title: "French Pronunciation Guide",
          description: "Master French pronunciation with phonetic exercises and audio references.",
          difficulty: "Advanced",
          category: "Pronunciation",
          fileName: "french-pronunciation-advanced.pdf"
        }
      ])

      // Load phrase sections from localStorage
      const storedSections = loadPhraseSections()
      setPhraseSections(storedSections)

      // Load phrases from localStorage
      const storedPhrases = loadPhrases()
      setPhrases(storedPhrases)
    }
  }, [isAuthenticated])

  const getAdminToken = () => localStorage.getItem('adminToken')
  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${getAdminToken()}` } })

  const fetchData = async () => {
    try {
      const [articlesRes, quizzesRes, sectionsRes, phrasesRes, phraseSectionsRes, vocabRes, dailyRes, settingsRes] = await Promise.all([
        axios.get('/api/articles'),
        axios.get('/api/quizzes'),
        axios.get('/api/sections'),
        axios.get('/api/phrases'),
        axios.get('/api/phrase-sections'),
        axios.get('/api/admin/vocab-words', adminHeaders()).catch(() => ({ data: [] })),
        axios.get('/api/admin/daily-vocab', adminHeaders()).catch(() => ({ data: [] })),
        axios.get('/api/site-settings').catch(() => ({ data: {} })),
      ])

      setArticles(articlesRes.data.flatMap(section =>
        section.items.map(item => ({ ...item, sectionTitle: section.title, sectionId: section.id }))
      ))
      setQuizzes(quizzesRes.data.flatMap(section =>
        section.items.map(item => ({ ...item, sectionTitle: section.title, sectionId: section.id }))
      ))
      setSections(sectionsRes.data || [])
      setPhrases(phrasesRes.data || [])
      setPhraseSections(phraseSectionsRes.data || [])
      setVocabWords(vocabRes.data || [])
      setDailyVocab(dailyRes.data || [])
      setSiteSettings(settingsRes.data || {})
    } catch (error) {
      console.error('Failed to fetch data:', error)
      // Set demo data for development
      setDemoData()
    }
  }

  // ─── Vocab words CRUD ────────────────────────────────────────────────────────
  const handleVocabSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingVocab) {
        const res = await axios.put(`/api/admin/vocab-words/${editingVocab.id}`, vocabForm, adminHeaders())
        setVocabWords(prev => prev.map(w => w.id === editingVocab.id ? res.data : w))
      } else {
        const res = await axios.post('/api/admin/vocab-words', vocabForm, adminHeaders())
        setVocabWords(prev => [res.data, ...prev])
      }
      setShowVocabForm(false)
      setEditingVocab(null)
      setVocabForm({ french: '', english: '', category: 'Custom', list_name: 'Custom Words', difficulty: 'Beginner', notes: '' })
    } catch (err) { console.error(err) }
  }

  const handleEditVocab = (w) => {
    setEditingVocab(w)
    setVocabForm({ french: w.french, english: w.english, category: w.category, list_name: w.list_name, difficulty: w.difficulty, notes: w.notes || '' })
    setShowVocabForm(true)
  }

  const handleDeleteVocab = async (id) => {
    if (!confirm('Delete this word?')) return
    await axios.delete(`/api/admin/vocab-words/${id}`, adminHeaders())
    setVocabWords(prev => prev.filter(w => w.id !== id))
  }

  // ─── Daily vocab CRUD ─────────────────────────────────────────────────────────
  const handleDailyVocabSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDailyVocab) {
        const res = await axios.put(`/api/admin/daily-vocab/${editingDailyVocab.id}`, dailyVocabForm, adminHeaders())
        setDailyVocab(prev => prev.map(w => w.id === editingDailyVocab.id ? res.data : w))
      } else {
        const res = await axios.post('/api/admin/daily-vocab', dailyVocabForm, adminHeaders())
        setDailyVocab(prev => [res.data, ...prev])
      }
      setShowDailyVocabForm(false)
      setEditingDailyVocab(null)
      setDailyVocabForm({ french: '', english: '', category: 'General' })
    } catch (err) { console.error(err) }
  }

  const handleEditDailyVocab = (w) => {
    setEditingDailyVocab(w)
    setDailyVocabForm({ french: w.french, english: w.english, category: w.category })
    setShowDailyVocabForm(true)
  }

  const handleDeleteDailyVocab = async (id) => {
    if (!confirm('Delete this entry?')) return
    await axios.delete(`/api/admin/daily-vocab/${id}`, adminHeaders())
    setDailyVocab(prev => prev.filter(w => w.id !== id))
  }

  // ─── Site settings save ───────────────────────────────────────────────────────
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    try {
      await axios.put('/api/admin/site-settings', siteSettings, adminHeaders())
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2500)
    } catch (err) { console.error(err) }
  }

  const setDemoData = () => {
    setSections([
      { id: 1, title: 'French Basics', description: 'Essential French fundamentals for beginners' },
      { id: 2, title: 'Grammar Fundamentals', description: 'Core French grammar rules and structures' },
      { id: 3, title: 'Vocabulary Building', description: 'Expand your French vocabulary systematically' },
      { id: 4, title: 'Conversation Skills', description: 'Practice real-world French conversations' }
    ])
    
    setArticles([
      {
        id: 1,
        title: 'French Alphabet and Pronunciation',
        description: 'Learn the French alphabet and basic pronunciation rules',
        difficulty: 'Beginner',
        sectionId: 1,
        sectionTitle: 'French Basics',
        content: 'Sample content...',
        author: 'Admin',
        lastUpdated: '2024-01-15'
      }
    ])
    
    setQuizzes([
      {
        id: 1,
        title: 'French Greetings Quiz',
        description: 'Test your knowledge of basic French greetings',
        difficulty: 'Beginner',
        sectionId: 1,
        sectionTitle: 'French Basics',
        questions: [
          {
            id: 1,
            question: 'How do you say "Hello" in French?',
            options: ['Bonjour', 'Bonsoir', 'Salut', 'Au revoir'],
            correct: 0
          }
        ]
      }
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (activeTab === 'worksheets') {
      // Handle worksheet submission locally (in a real app, this would go to a server)
      const worksheetData = {
        id: editingItem ? editingItem.id : Date.now(),
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: worksheetFormData.category,
        file: worksheetFormData.file,
        fileName: worksheetFormData.fileName
      }

      if (editingItem) {
        setWorksheets(prev => prev.map(w => w.id === editingItem.id ? worksheetData : w))
      } else {
        setWorksheets(prev => [...prev, worksheetData])
      }

      resetForm()
      return
    }

    if (activeTab === 'phrases') {
      try {
        const endpoint = '/api/phrases'
        const method = editingItem ? 'PUT' : 'POST'
        const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint

        await axios({
          method,
          url,
          data: phraseFormData
        })

        fetchData()
        resetForm()
      } catch (error) {
        console.error('Failed to save phrase:', error)
      }
      return
    }

    if (activeTab === 'phrase-sections') {
      try {
        const endpoint = '/api/phrase-sections'
        const method = editingItem ? 'PUT' : 'POST'
        const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint

        await axios({
          method,
          url,
          data: {
            title: formData.title,
            description: formData.description
          }
        })

        fetchData()
        resetForm()
      } catch (error) {
        console.error('Failed to save phrase section:', error)
      }
      return
    }

    try {
      const endpoint = activeTab === 'articles' ? '/api/articles' : '/api/quizzes'
      const method = editingItem ? 'PUT' : 'POST'
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint

      await axios({
        method,
        url,
        data: formData
      })

      fetchData()
      resetForm()
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    if (activeTab === 'worksheets') {
      setWorksheets(prev => prev.filter(w => w.id !== id))
      return
    }

    if (activeTab === 'phrases') {
      try {
        await axios.delete(`/api/phrases/${id}`)
        fetchData()
      } catch (error) {
        console.error('Failed to delete phrase:', error)
      }
      return
    }

    if (activeTab === 'phrase-sections') {
      try {
        await axios.delete(`/api/phrase-sections/${id}`)
        fetchData()
      } catch (error) {
        console.error('Failed to delete phrase section:', error)
      }
      return
    }

    try {
      const endpoint = activeTab === 'articles' ? '/api/articles' : '/api/quizzes'
      await axios.delete(`${endpoint}/${id}`)
      fetchData()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)

    if (activeTab === 'worksheets') {
      setFormData({
        title: item.title,
        description: item.description,
        difficulty: item.difficulty,
        sectionId: '',
        content: '',
        questions: []
      })
      setWorksheetFormData({
        title: item.title,
        description: item.description,
        difficulty: item.difficulty,
        category: item.category,
        file: item.file,
        fileName: item.fileName
      })
    } else if (activeTab === 'phrases') {
      setPhraseFormData({
        title: item.title,
        description: item.description,
        french: item.french,
        english: item.english,
        literal: item.literal,
        meaning: item.meaning,
        pronunciation: item.pronunciation,
        difficulty: item.difficulty,
        usage: item.usage,
        example: item.example,
        exampleTranslation: item.exampleTranslation,
        culturalNote: item.culturalNote,
        type: item.type,
        sectionId: item.sectionId.toString()
      })
    } else if (activeTab === 'phrase-sections') {
      setFormData({
        title: item.title,
        description: item.description,
        difficulty: 'Beginner',
        sectionId: '',
        content: '',
        questions: []
      })
    } else {
      setFormData({
        title: item.title,
        description: item.description,
        difficulty: item.difficulty,
        sectionId: item.sectionId,
        content: item.content || '',
        questions: item.questions || []
      })
    }

    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'Beginner',
      sectionId: '',
      content: '',
      questions: []
    })
    setWorksheetFormData({
      title: '',
      description: '',
      difficulty: 'Beginner',
      category: 'Grammar',
      file: null,
      fileName: ''
    })
    setPhraseFormData({
      title: '',
      description: '',
      french: '',
      english: '',
      literal: '',
      meaning: '',
      pronunciation: '',
      difficulty: 'Beginner',
      usage: '',
      example: '',
      exampleTranslation: '',
      culturalNote: '',
      type: 'proverb',
      sectionId: ''
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { id: Date.now(), question: '', options: ['', '', '', ''], correct: 0 }
      ]
    }))
  }

  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }))
  }

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  // Section management functions
  const handleSectionSubmit = (e) => {
    e.preventDefault()
    if (editingSection) {
      setSections(prev => prev.map(section =>
        section.id === editingSection.id
          ? { ...section, ...sectionFormData }
          : section
      ))
    } else {
      const newSection = {
        id: Date.now(),
        ...sectionFormData
      }
      setSections(prev => [...prev, newSection])
    }
    resetSectionForm()
  }

  const handleEditSection = (section) => {
    setEditingSection(section)
    setSectionFormData({
      title: section.title,
      description: section.description || ''
    })
    setShowSectionForm(true)
  }

  const handleDeleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section? All associated content will be removed.')) {
      setSections(prev => prev.filter(section => section.id !== sectionId))
      setArticles(prev => prev.filter(article => article.sectionId !== sectionId))
      setQuizzes(prev => prev.filter(quiz => quiz.sectionId !== sectionId))
    }
  }

  const resetSectionForm = () => {
    setShowSectionForm(false)
    setEditingSection(null)
    setSectionFormData({
      title: '',
      description: ''
    })
  }

  // Rich text editor functions
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value)
    contentEditorRef.current?.focus()
  }

  const handleContentChange = () => {
    if (contentEditorRef.current) {
      setFormData(prev => ({
        ...prev,
        content: contentEditorRef.current.innerHTML
      }))
    }
  }

  const insertList = (ordered = false) => {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList'
    formatText(command)
  }

  const setAlignment = (alignment) => {
    const commands = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight'
    }
    formatText(commands[alignment])
  }

  // Enhanced editor functions
  const insertTable = () => {
    const rows = prompt('Number of rows:', '3')
    const cols = prompt('Number of columns:', '3')
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">'
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>'
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ccc;">Cell</td>'
        }
        tableHTML += '</tr>'
      }
      tableHTML += '</table>'
      formatText('insertHTML', tableHTML)
    }
  }

  const insertQuote = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const blockquote = document.createElement('blockquote')
      blockquote.style.cssText = 'border-left: 4px solid #800020; padding-left: 16px; margin: 16px 0; font-style: italic; color: #666;'
      try {
        range.surroundContents(blockquote)
      } catch (ex) {
        blockquote.appendChild(range.extractContents())
        range.insertNode(blockquote)
      }
      handleContentChange()
    }
  }

  const insertCodeBlock = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const code = document.createElement('code')
      code.style.cssText = 'background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace;'
      try {
        range.surroundContents(code)
      } catch (ex) {
        code.appendChild(range.extractContents())
        range.insertNode(code)
      }
      handleContentChange()
    }
  }

  const clearFormatting = () => {
    formatText('removeFormat')
    formatText('unlink')
  }

  const undoEdit = () => {
    formatText('undo')
  }

  const redoEdit = () => {
    formatText('redo')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
      </div>
    )
  }

  // Worksheet handlers
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setWorksheetFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }))
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleDownloadWorksheet = (worksheet) => {
    // In a real app, this would download from a server
    if (worksheet.file) {
      const url = URL.createObjectURL(worksheet.file)
      const a = document.createElement('a')
      a.href = url
      a.download = worksheet.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />
  }

  const currentItems = activeTab === 'articles' ? articles : activeTab === 'quizzes' ? quizzes : activeTab === 'worksheets' ? worksheets : activeTab === 'phrases' ? phrases : activeTab === 'phrase-sections' ? phraseSections : sections

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-cream-50">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your French learning content and sections</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-dark-warm-50 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'sections'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="inline-block w-4 h-4 mr-2" />
              Sections
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'articles'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="inline-block w-4 h-4 mr-2" />
              Articles
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'quizzes'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Brain className="inline-block w-4 h-4 mr-2" />
              Quizzes
            </button>
            <button
              onClick={() => setActiveTab('worksheets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'worksheets'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block w-4 h-4 mr-2" />
              Worksheets
            </button>
            <button
              onClick={() => setActiveTab('phrases')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'phrases'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="inline-block w-4 h-4 mr-2" />
              Phrases
            </button>
            <button
              onClick={() => setActiveTab('phrase-sections')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'phrase-sections'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FolderPlus className="inline-block w-4 h-4 mr-2" />
              Phrase Sections
            </button>
            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'vocabulary'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Volume2 className="inline-block w-4 h-4 mr-2" />
              Vocabulary
            </button>
            <button
              onClick={() => setActiveTab('daily-vocab')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'daily-vocab'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Zap className="inline-block w-4 h-4 mr-2" />
              Daily Vocab
            </button>
            <button
              onClick={() => setActiveTab('jokes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'jokes' ? 'border-burgundy-500 text-burgundy-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Laugh className="inline-block w-4 h-4 mr-2" />Jokes
            </button>
            <button
              onClick={() => setActiveTab('travel-vocab')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'travel-vocab' ? 'border-burgundy-500 text-burgundy-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Plane className="inline-block w-4 h-4 mr-2" />Travel
            </button>
            <button
              onClick={() => setActiveTab('business-vocab')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'business-vocab' ? 'border-burgundy-500 text-burgundy-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Briefcase className="inline-block w-4 h-4 mr-2" />Business
            </button>
            <button
              onClick={() => setActiveTab('slang')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'slang' ? 'border-burgundy-500 text-burgundy-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Flame className="inline-block w-4 h-4 mr-2" />Slang
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'reading' ? 'border-burgundy-500 text-burgundy-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <BookMarked className="inline-block w-4 h-4 mr-2" />Reading
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'writing' ? 'border-burgundy-500 text-burgundy-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <PenLine className="inline-block w-4 h-4 mr-2" />Writing
            </button>
            <button
              onClick={() => setActiveTab('sentences')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'sentences' ? 'border-burgundy-500 text-burgundy-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Layers className="inline-block w-4 h-4 mr-2" />Sentences
            </button>
            <a
              href="/admin/pages"
              className="py-2 px-1 border-b-2 border-transparent font-medium text-sm whitespace-nowrap text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center"
            >
              <Layers className="inline-block w-4 h-4 mr-2" />
              Feature Pages
            </a>
            <button
              onClick={() => setActiveTab('site-settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'site-settings'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe className="inline-block w-4 h-4 mr-2" />
              Site Settings
            </button>
          </nav>
        </div>

        {/* Content panels for new CMS tabs */}
        {CONTENT_TABS.includes(activeTab) && <AdminContentPanel activeTab={activeTab} />}

        {/* Add Button — only for list-based tabs */}
        {!['vocabulary', 'daily-vocab', 'site-settings', ...CONTENT_TABS].includes(activeTab) && (
          <div className="mb-6">
            <button
              onClick={() => activeTab === 'sections' ? setShowSectionForm(true) : setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size="md" />
              <span>Add {activeTab === 'sections' ? 'Section' : activeTab === 'articles' ? 'Article' : activeTab === 'quizzes' ? 'Quiz' : activeTab === 'worksheets' ? 'Worksheet' : 'Phrase'}</span>
            </button>
          </div>
        )}

        {/* ─── Vocabulary Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'vocabulary' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{vocabWords.length} custom word{vocabWords.length !== 1 ? 's' : ''} added</p>
              <button onClick={() => { setEditingVocab(null); setVocabForm({ french: '', english: '', category: 'Custom', list_name: 'Custom Words', difficulty: 'Beginner', notes: '' }); setShowVocabForm(true) }} className="btn-primary flex items-center space-x-2">
                <Plus size="md" /><span>Add Word</span>
              </button>
            </div>
            <div className="bg-amber-50 dark:bg-dark-warm-100 shadow rounded-md overflow-hidden">
              {vocabWords.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No custom vocabulary words yet. Add some to populate the Vocabulary page.</div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-dark-warm-50">
                  {vocabWords.map(w => (
                    <li key={w.id} className="px-4 py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-gray-900 dark:text-cream-50">{w.french}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-700 dark:text-gray-300">{w.english}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${w.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : w.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{w.difficulty}</span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">{w.list_name}</span>
                          {!w.active && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">Hidden</span>}
                        </div>
                        {w.notes && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{w.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <SpeakButton text={w.french} lang="fr-FR" size="sm" />
                        <button onClick={() => handleEditVocab(w)} className="text-burgundy-600 hover:text-burgundy-700"><Edit size={15} /></button>
                        <button onClick={() => handleDeleteVocab(w.id)} className="text-red-600 hover:text-red-700"><Trash2 size={15} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Vocab word form modal */}
            {showVocabForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
                <div className="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-amber-50 dark:bg-dark-warm-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-cream-50">{editingVocab ? 'Edit Word' : 'Add Vocabulary Word'}</h3>
                    <button onClick={() => setShowVocabForm(false)} className="text-gray-400 hover:text-gray-600"><X size="lg" /></button>
                  </div>
                  <form onSubmit={handleVocabSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">French *</label>
                        <input required value={vocabForm.french} onChange={e => setVocabForm(p => ({ ...p, french: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">English *</label>
                        <input required value={vocabForm.english} onChange={e => setVocabForm(p => ({ ...p, english: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">List Name</label>
                        <input value={vocabForm.list_name} onChange={e => setVocabForm(p => ({ ...p, list_name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <input value={vocabForm.category} onChange={e => setVocabForm(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                      <select value={vocabForm.difficulty} onChange={e => setVocabForm(p => ({ ...p, difficulty: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500">
                        <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                      <input value={vocabForm.notes} onChange={e => setVocabForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes or example sentence" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowVocabForm(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary flex items-center gap-2"><Save size={15} /> {editingVocab ? 'Update' : 'Add'} Word</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Daily Vocab Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'daily-vocab' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{dailyVocab.length} daily vocab entr{dailyVocab.length !== 1 ? 'ies' : 'y'}</p>
              <button onClick={() => { setEditingDailyVocab(null); setDailyVocabForm({ french: '', english: '', category: 'General' }); setShowDailyVocabForm(true) }} className="btn-primary flex items-center space-x-2">
                <Plus size="md" /><span>Add Entry</span>
              </button>
            </div>
            <div className="bg-amber-50 dark:bg-dark-warm-100 shadow rounded-md overflow-hidden">
              {dailyVocab.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No daily vocab entries yet. Add some to power the Daily Challenges vocab sprint.</div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-dark-warm-50">
                  {dailyVocab.map(w => (
                    <li key={w.id} className="px-4 py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-gray-900 dark:text-cream-50">{w.french}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-700 dark:text-gray-300">{w.english}</span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">{w.category}</span>
                          {!w.active && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">Hidden</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <SpeakButton text={w.french} lang="fr-FR" size="sm" />
                        <button onClick={() => handleEditDailyVocab(w)} className="text-burgundy-600 hover:text-burgundy-700"><Edit size={15} /></button>
                        <button onClick={() => handleDeleteDailyVocab(w.id)} className="text-red-600 hover:text-red-700"><Trash2 size={15} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {showDailyVocabForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
                <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-amber-50 dark:bg-dark-warm-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-cream-50">{editingDailyVocab ? 'Edit Entry' : 'Add Daily Vocab Entry'}</h3>
                    <button onClick={() => setShowDailyVocabForm(false)} className="text-gray-400 hover:text-gray-600"><X size="lg" /></button>
                  </div>
                  <form onSubmit={handleDailyVocabSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">French *</label>
                      <input required value={dailyVocabForm.french} onChange={e => setDailyVocabForm(p => ({ ...p, french: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">English *</label>
                      <input required value={dailyVocabForm.english} onChange={e => setDailyVocabForm(p => ({ ...p, english: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <input value={dailyVocabForm.category} onChange={e => setDailyVocabForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Food, Travel, Verbs…" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowDailyVocabForm(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary flex items-center gap-2"><Save size={15} /> {editingDailyVocab ? 'Update' : 'Add'} Entry</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Site Settings Tab ─────────────────────────────────────────────────── */}
        {activeTab === 'site-settings' && (
          <div className="bg-amber-50 dark:bg-dark-warm-100 shadow rounded-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-cream-50 mb-1">Site-Wide Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Edit the hero section copy, site name, and other global text.</p>
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
              {[
                { key: 'site_name', label: 'Site Name', placeholder: 'SayBonjour!' },
                { key: 'hero_title', label: 'Hero Title', placeholder: 'Say Bonjour to French!' },
                { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'Master French with interactive lessons…', multiline: true },
                { key: 'hero_cta_primary', label: 'Primary CTA Button', placeholder: 'Start Learning Free' },
                { key: 'hero_cta_secondary', label: 'Secondary CTA Button', placeholder: 'Explore Lessons' },
                { key: 'announcement_bar', label: 'Announcement Bar', placeholder: 'Leave blank to hide the bar', multiline: false },
                { key: 'footer_tagline', label: 'Footer Tagline', placeholder: 'Learn French with joy…' },
              ].map(({ key, label, placeholder, multiline }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  {multiline ? (
                    <textarea rows={3} value={siteSettings[key] || ''} onChange={e => setSiteSettings(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500" />
                  ) : (
                    <input type="text" value={siteSettings[key] || ''} onChange={e => setSiteSettings(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500" />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="btn-primary flex items-center gap-2"><Save size={15} /> Save Settings</button>
                {settingsSaved && (
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <CheckCircle size={15} /> Saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Content List — hidden for new CMS tabs */}
        {!['vocabulary', 'daily-vocab', 'site-settings', ...CONTENT_TABS].includes(activeTab) && (
        <div className="bg-amber-50 dark:bg-dark-warm-100 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {currentItems.map((item) => (
              <li key={item.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-cream-50 dark:text-cream-50">
                        {item.title}
                      </h3>
                      {activeTab !== 'sections' && (
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.difficulty === 'Beginner'
                              ? 'bg-green-100 text-green-800'
                              : item.difficulty === 'Intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.difficulty}
                          </span>
                          {activeTab === 'worksheets' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {item.category}
                            </span>
                          )}
                          {activeTab !== 'worksheets' && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {item.sectionTitle}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                    {activeTab === 'sections' && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {articles.filter(a => a.sectionId === item.id).length} articles, {' '}
                        {quizzes.filter(q => q.sectionId === item.id).length} quizzes
                      </div>
                    )}
                    {activeTab === 'worksheets' && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        File: {item.fileName || 'No file uploaded'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {activeTab === 'worksheets' && item.fileName && (
                      <button
                        onClick={() => handleDownloadWorksheet(item)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Download worksheet"
                      >
                        <Download size="md" />
                      </button>
                    )}
                    <button
                      onClick={() => activeTab === 'sections' ? handleEditSection(item) : handleEdit(item)}
                      className="text-burgundy-600 hover:text-burgundy-700"
                    >
                      <Edit size="md" />
                    </button>
                    <button
                      onClick={() => activeTab === 'sections' ? handleDeleteSection(item.id) : handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size="md" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
            <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-4xl shadow-lg rounded-md bg-amber-50 dark:bg-dark-warm-100 min-h-[calc(100vh-2rem)] sm:min-h-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-cream-50 dark:text-cream-50 pr-4">
                  {editingItem ? 'Edit' : 'Add'} {activeTab === 'articles' ? 'Article' : activeTab === 'quizzes' ? 'Quiz' : activeTab === 'worksheets' ? 'Worksheet' : 'Phrase'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X size="lg" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={activeTab === 'worksheets' ? worksheetFormData.title : formData.title}
                      onChange={(e) => {
                        if (activeTab === 'worksheets') {
                          setWorksheetFormData(prev => ({ ...prev, title: e.target.value }))
                        } else {
                          setFormData(prev => ({ ...prev, title: e.target.value }))
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                    />
                  </div>
                  
                  {activeTab !== 'worksheets' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Section
                      </label>
                      <select
                        required
                        value={formData.sectionId}
                        onChange={(e) => setFormData(prev => ({ ...prev, sectionId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                      >
                        <option value="">Select a section</option>
                        {sections.map(section => (
                          <option key={section.id} value={section.id}>
                            {section.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={activeTab === 'worksheets' ? worksheetFormData.description : formData.description}
                    onChange={(e) => {
                      if (activeTab === 'worksheets') {
                        setWorksheetFormData(prev => ({ ...prev, description: e.target.value }))
                      } else {
                        setFormData(prev => ({ ...prev, description: e.target.value }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={activeTab === 'worksheets' ? worksheetFormData.difficulty : formData.difficulty}
                    onChange={(e) => {
                      if (activeTab === 'worksheets') {
                        setWorksheetFormData(prev => ({ ...prev, difficulty: e.target.value }))
                      } else {
                        setFormData(prev => ({ ...prev, difficulty: e.target.value }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {activeTab === 'articles' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>

                    {/* Rich Text Editor Toolbar */}
                    <div className="border border-gray-300 dark:border-dark-warm-50 rounded-t-md bg-gray-50 dark:bg-dark-warm-200 p-2 flex flex-wrap gap-1">
                      {/* Text Formatting */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <button
                          type="button"
                          onClick={() => formatText('bold')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Bold"
                        >
                          <Bold size="md" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('italic')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Italic"
                        >
                          <Italic size="md" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('underline')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Underline"
                        >
                          <Underline size="md" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('strikeThrough')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Strikethrough"
                        >
                          <span className="text-sm font-bold line-through">S</span>
                        </button>
                      </div>

                      {/* Font Size */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <select
                          onChange={(e) => formatText('fontSize', e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-300 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 rounded"
                          defaultValue="3"
                        >
                          <option value="1">8pt</option>
                          <option value="2">10pt</option>
                          <option value="3">12pt</option>
                          <option value="4">14pt</option>
                          <option value="5">18pt</option>
                          <option value="6">24pt</option>
                          <option value="7">36pt</option>
                        </select>
                      </div>

                      {/* Text Color */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <input
                          type="color"
                          onChange={(e) => formatText('foreColor', e.target.value)}
                          className="w-8 h-8 border border-gray-300 dark:border-dark-warm-50 rounded cursor-pointer"
                          title="Text Color"
                        />
                        <input
                          type="color"
                          onChange={(e) => formatText('backColor', e.target.value)}
                          className="w-8 h-8 border border-gray-300 dark:border-dark-warm-50 rounded cursor-pointer ml-1"
                          title="Background Color"
                        />
                      </div>

                      {/* Alignment */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <button
                          type="button"
                          onClick={() => setAlignment('left')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Align Left"
                        >
                          <AlignLeft size="md" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAlignment('center')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Align Center"
                        >
                          <AlignCenter size="md" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAlignment('right')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Align Right"
                        >
                          <AlignRight size="md" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('justifyFull')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Justify"
                        >
                          <span className="text-sm font-bold">≡</span>
                        </button>
                      </div>

                      {/* Lists */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <button
                          type="button"
                          onClick={() => insertList(false)}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Bullet List"
                        >
                          <List size="md" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertList(true)}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Numbered List"
                        >
                          <ListOrdered size="md" />
                        </button>
                      </div>

                      {/* Indentation */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <button
                          type="button"
                          onClick={() => formatText('outdent')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Decrease Indent"
                        >
                          <span className="text-sm font-bold">⇤</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('indent')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Increase Indent"
                        >
                          <span className="text-sm font-bold">⇥</span>
                        </button>
                      </div>

                      {/* Line Height */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <select
                          onChange={(e) => {
                            const selection = window.getSelection()
                            if (selection.rangeCount > 0) {
                              const range = selection.getRangeAt(0)
                              const span = document.createElement('span')
                              span.style.lineHeight = e.target.value
                              try {
                                range.surroundContents(span)
                              } catch (ex) {
                                span.appendChild(range.extractContents())
                                range.insertNode(span)
                              }
                            }
                            handleContentChange()
                          }}
                          className="px-2 py-1 text-sm border border-gray-300 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 rounded"
                          defaultValue="1.5"
                        >
                          <option value="1">Single</option>
                          <option value="1.15">1.15</option>
                          <option value="1.5">1.5</option>
                          <option value="2">Double</option>
                          <option value="2.5">2.5</option>
                          <option value="3">Triple</option>
                        </select>
                      </div>

                      {/* Insert Elements */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter image URL:')
                            if (url) formatText('insertImage', url)
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Insert Image"
                        >
                          <span className="text-sm font-bold">🖼️</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter link URL:')
                            if (url) formatText('createLink', url)
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Insert Link"
                        >
                          <span className="text-sm font-bold">🔗</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('insertHorizontalRule')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Insert Horizontal Line"
                        >
                          <span className="text-sm font-bold">―</span>
                        </button>
                        <button
                          type="button"
                          onClick={insertTable}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Insert Table"
                        >
                          <span className="text-sm font-bold">⊞</span>
                        </button>
                      </div>

                      {/* Special Formatting */}
                      <div className="flex border-r border-gray-300 pr-2 mr-2">
                        <button
                          type="button"
                          onClick={insertQuote}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Quote Block"
                        >
                          <span className="text-sm font-bold">"</span>
                        </button>
                        <button
                          type="button"
                          onClick={insertCodeBlock}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Code Block"
                        >
                          <span className="text-sm font-bold">&lt;/&gt;</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('subscript')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Subscript"
                        >
                          <span className="text-sm font-bold">X₂</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('superscript')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Superscript"
                        >
                          <span className="text-sm font-bold">X²</span>
                        </button>
                      </div>

                      {/* Undo/Redo and Clear */}
                      <div className="flex">
                        <button
                          type="button"
                          onClick={undoEdit}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Undo"
                        >
                          <span className="text-sm font-bold">↶</span>
                        </button>
                        <button
                          type="button"
                          onClick={redoEdit}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Redo"
                        >
                          <span className="text-sm font-bold">↷</span>
                        </button>
                        <button
                          type="button"
                          onClick={clearFormatting}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Clear Formatting"
                        >
                          <span className="text-sm font-bold">🧹</span>
                        </button>
                      </div>
                    </div>

                    {/* Rich Text Editor Content Area */}
                    <div
                      ref={contentEditorRef}
                      contentEditable
                      onInput={handleContentChange}
                      onKeyDown={(e) => {
                        // Keyboard shortcuts
                        if (e.ctrlKey || e.metaKey) {
                          switch (e.key) {
                            case 'b':
                              e.preventDefault()
                              formatText('bold')
                              break
                            case 'i':
                              e.preventDefault()
                              formatText('italic')
                              break
                            case 'u':
                              e.preventDefault()
                              formatText('underline')
                              break
                            case 'z':
                              e.preventDefault()
                              if (e.shiftKey) {
                                redoEdit()
                              } else {
                                undoEdit()
                              }
                              break
                            case 'y':
                              e.preventDefault()
                              redoEdit()
                              break
                            case 'k':
                              e.preventDefault()
                              const url = prompt('Enter link URL:')
                              if (url) formatText('createLink', url)
                              break
                          }
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault()
                        const text = e.clipboardData.getData('text/plain')
                        document.execCommand('insertText', false, text)
                      }}
                      className="w-full min-h-[300px] px-3 py-2 border border-gray-300 dark:border-dark-warm-50 border-t-0 rounded-b-md focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500 bg-white dark:bg-dark-warm-100 dark:text-cream-50 prose prose-sm max-w-none"
                      style={{
                        maxHeight: '500px',
                        overflowY: 'auto',
                        lineHeight: '1.5',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />

                    {/* Character Count and Shortcuts */}
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <div>
                        Characters: {formData.content.replace(/<[^>]*>/g, '').length}
                      </div>
                      <div className="text-xs">
                        Shortcuts: <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-dark-warm-200 rounded">Ctrl+B</kbd> Bold,
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-dark-warm-200 rounded ml-1">Ctrl+I</kbd> Italic,
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-dark-warm-200 rounded ml-1">Ctrl+U</kbd> Underline,
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-dark-warm-200 rounded ml-1">Ctrl+K</kbd> Link,
                        <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-dark-warm-200 rounded ml-1">Ctrl+Z</kbd> Undo
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'worksheets' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={worksheetFormData.category}
                        onChange={(e) => setWorksheetFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                      >
                        <option value="Grammar">Grammar</option>
                        <option value="Vocabulary">Vocabulary</option>
                        <option value="Pronunciation">Pronunciation</option>
                        <option value="Reading">Reading</option>
                        <option value="Writing">Writing</option>
                        <option value="Listening">Listening</option>
                        <option value="Culture">Culture</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Upload PDF File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-amber-50 rounded-md font-medium text-burgundy-600 hover:text-burgundy-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-burgundy-500">
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept=".pdf"
                                className="sr-only"
                                onChange={handleFileUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                          {worksheetFormData.fileName && (
                            <p className="text-sm text-green-600 mt-2">
                              Selected: {worksheetFormData.fileName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'phrases' ? (
                  <div className="space-y-6">
                    {/* Title and Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={phraseFormData.title}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                          placeholder="e.g., Little by little, the bird builds its nest"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={phraseFormData.description}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                          placeholder="e.g., A French proverb about patience and persistence"
                        />
                      </div>
                    </div>

                    {/* French and English */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          French Phrase *
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            required
                            value={phraseFormData.french}
                            onChange={(e) => setPhraseFormData(prev => ({ ...prev, french: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                            placeholder="e.g., Petit à petit, l'oiseau fait son nid"
                          />
                          {phraseFormData.french && (
                            <SpeakButton
                              text={phraseFormData.french}
                              size="sm"
                              variant="default"
                            />
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          English Translation *
                        </label>
                        <input
                          type="text"
                          required
                          value={phraseFormData.english}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, english: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                          placeholder="e.g., Little by little, the bird builds its nest"
                        />
                      </div>
                    </div>

                    {/* Pronunciation and Meaning */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Pronunciation Guide
                        </label>
                        <input
                          type="text"
                          value={phraseFormData.pronunciation}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                          placeholder="e.g., puh-TEE ah puh-TEE, lwa-ZOH feh sohn NEE"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Literal Translation
                        </label>
                        <input
                          type="text"
                          value={phraseFormData.literal}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, literal: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                          placeholder="e.g., Little by little, the bird makes its nest"
                        />
                      </div>
                    </div>

                    {/* Meaning and Usage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Meaning/Interpretation *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={phraseFormData.meaning}
                        onChange={(e) => setPhraseFormData(prev => ({ ...prev, meaning: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        placeholder="e.g., Patience and persistence lead to success"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Usage Context
                      </label>
                      <textarea
                        rows={2}
                        value={phraseFormData.usage}
                        onChange={(e) => setPhraseFormData(prev => ({ ...prev, usage: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        placeholder="e.g., Used to encourage patience and steady progress"
                      />
                    </div>

                    {/* Example */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Example Sentence (French)
                        </label>
                        <div className="flex items-center space-x-2">
                          <textarea
                            rows={2}
                            value={phraseFormData.example}
                            onChange={(e) => setPhraseFormData(prev => ({ ...prev, example: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                            placeholder="e.g., Ne t'inquiète pas pour tes études. Petit à petit, l'oiseau fait son nid."
                          />
                          {phraseFormData.example && (
                            <SpeakButton
                              text={phraseFormData.example}
                              size="sm"
                              variant="ghost"
                            />
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Example Translation (English)
                        </label>
                        <textarea
                          rows={2}
                          value={phraseFormData.exampleTranslation}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, exampleTranslation: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                          placeholder="e.g., Don't worry about your studies. Little by little, the bird builds its nest."
                        />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Type *
                        </label>
                        <select
                          required
                          value={phraseFormData.type}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        >
                          <option value="proverb">Proverb</option>
                          <option value="idiom">Idiom</option>
                          <option value="expression">Expression</option>
                          <option value="saying">Saying</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section *
                        </label>
                        <select
                          required
                          value={phraseFormData.sectionId}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, sectionId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        >
                          <option value="">Select Section</option>
                          {phraseSections.map(section => (
                            <option key={section.id} value={section.id}>
                              {section.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Difficulty *
                        </label>
                        <select
                          required
                          value={phraseFormData.difficulty}
                          onChange={(e) => setPhraseFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    {/* Cultural Note */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cultural Note
                      </label>
                      <textarea
                        rows={3}
                        value={phraseFormData.culturalNote}
                        onChange={(e) => setPhraseFormData(prev => ({ ...prev, culturalNote: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        placeholder="e.g., This is a classic French proverb emphasizing the value of patience and gradual progress."
                      />
                    </div>
                  </div>
                ) : activeTab === 'phrase-sections' ? (
                  <div className="space-y-6">
                    {/* Title and Description for Phrase Sections */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Section Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        placeholder="e.g., Proverbs, Idioms, Expressions"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        placeholder="e.g., Traditional French proverbs and sayings"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Questions
                      </label>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="btn-secondary text-sm"
                      >
                        Add Question
                      </button>
                    </div>

                    {formData.questions.map((question, qIndex) => (
                      <div key={question.id} className="border border-gray-200 dark:border-dark-warm-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Question {qIndex + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size="md" />
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Enter question"
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 rounded-md mb-3 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                        />

                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.correct === oIndex}
                                onChange={() => updateQuestion(qIndex, 'correct', oIndex)}
                                className="text-burgundy-600"
                              />
                              <input
                                type="text"
                                placeholder={`Option ${oIndex + 1}`}
                                value={option}
                                onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Save size="md" />
                    <span>{editingItem ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Section Form Modal */}
        {showSectionForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-amber-50 dark:bg-dark-warm-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-cream-50 dark:text-cream-50">
                  {editingSection ? 'Edit' : 'Add'} Section
                </h3>
                <button
                  onClick={resetSectionForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size="lg" />
                </button>
              </div>

              <form onSubmit={handleSectionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    required
                    value={sectionFormData.title}
                    onChange={(e) => setSectionFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                    placeholder="e.g., French Basics, Grammar Fundamentals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={sectionFormData.description}
                    onChange={(e) => setSectionFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-warm-50 rounded-md bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                    placeholder="Describe what this section covers..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetSectionForm}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Save size="md" />
                    <span>{editingSection ? 'Update' : 'Create'} Section</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
