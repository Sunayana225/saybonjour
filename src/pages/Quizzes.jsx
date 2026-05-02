import React, { useState, useEffect } from 'react'
import { Brain, Clock, Award, CheckCircle, XCircle } from 'lucide-react'
import ContentSidebar from '../components/ContentSidebar'
import BookmarkButton from '../components/BookmarkButton'
import axios from 'axios'
import SEO from '../components/SEO'

const Quizzes = () => {
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [expandedSections, setExpandedSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizState, setQuizState] = useState({ started: false, currentQuestion: 0, answers: [], completed: false, score: 0 })

  useEffect(() => { fetchQuizzes() }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes')
      setSections(response.data)
      if (response.data.length > 0) {
        const first = response.data[0]
        setExpandedSections([first.id])
        if (first.items.length > 0) { setSelectedSection(first.id); setSelectedItem(first.items[0].id); setSelectedQuiz(first.items[0]) }
      }
    } catch { setDemoData() } finally { setLoading(false) }
  }

  const setDemoData = () => {
    const demo = [
      { id: 1, title: 'Basic French', items: [
        { id: 1, title: 'French Greetings Quiz', description: 'Test your knowledge of basic French greetings', difficulty: 'Beginner',
          questions: [
            { id: 1, question: 'How do you say "Hello" in French?', options: ['Bonjour', 'Bonsoir', 'Salut', 'Au revoir'], correct: 0 },
            { id: 2, question: 'What does "Merci" mean?', options: ['Please', 'Thank you', 'Excuse me', 'Sorry'], correct: 1 },
            { id: 3, question: 'How do you say "Good evening" in French?', options: ['Bonjour', 'Bonsoir', 'Bonne nuit', 'Salut'], correct: 1 },
          ]},
        { id: 2, title: 'French Numbers 1-10', description: 'Quiz on basic French numbers', difficulty: 'Beginner',
          questions: [
            { id: 1, question: 'How do you say "five" in French?', options: ['quatre', 'cinq', 'six', 'sept'], correct: 1 },
            { id: 2, question: 'What number is "huit"?', options: ['6', '7', '8', '9'], correct: 2 },
          ]},
      ]},
      { id: 2, title: 'Grammar', items: [
        { id: 3, title: 'French Articles Quiz', description: 'Test your understanding of le, la, les', difficulty: 'Intermediate',
          questions: [{ id: 1, question: 'Which article goes with "maison" (house)?', options: ['le', 'la', 'les', 'un'], correct: 1 }]},
      ]},
    ]
    setSections(demo); setExpandedSections([1]); setSelectedSection(1); setSelectedItem(1); setSelectedQuiz(demo[0].items[0])
  }

  const handleToggleSection = (id) => setExpandedSections(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const handleItemSelect = (itemId) => {
    const quiz = sections.flatMap(s => s.items).find(i => i.id === itemId)
    const parent = sections.find(s => s.items.some(i => i.id === itemId))
    setSelectedQuiz(quiz); setSelectedItem(itemId)
    if (parent) setSelectedSection(parent.id)
    setQuizState({ started: false, currentQuestion: 0, answers: [], completed: false, score: 0 })
  }
  const startQuiz = () => setQuizState(p => ({ ...p, started: true, currentQuestion: 0, answers: [], completed: false, score: 0 }))
  const handleAnswer = (answerIndex) => {
    const newAnswers = [...quizState.answers]
    newAnswers[quizState.currentQuestion] = answerIndex
    const isLast = quizState.currentQuestion === selectedQuiz.questions.length - 1
    if (isLast) {
      const score = newAnswers.reduce((t, a, i) => t + (a === selectedQuiz.questions[i].correct ? 1 : 0), 0)
      setQuizState(p => ({ ...p, answers: newAnswers, completed: true, score }))
    } else {
      setQuizState(p => ({ ...p, answers: newAnswers, currentQuestion: p.currentQuestion + 1 }))
    }
  }
  const resetQuiz = () => setQuizState({ started: false, currentQuestion: 0, answers: [], completed: false, score: 0 })

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-warm-300">
      <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading quizzes...</p>
      </div>
    </div>
  )

  return (
    <>
      <SEO
        title={selectedQuiz ? `${selectedQuiz.title} | French Quiz | SayBonjour!` : "French Quizzes — Test Your Knowledge | SayBonjour!"}
        description={selectedQuiz
          ? `Take the "${selectedQuiz.title}" quiz and test your French. Instant feedback, score tracking, and explanations for every answer.`
          : "Test your French with hundreds of interactive quizzes covering grammar, vocabulary, verb conjugations, listening, and culture. Track your scores and improve over time."
        }
        keywords="french quizzes, french grammar quiz, french vocabulary quiz, french conjugation quiz, online french test, french language test, DELF practice"
        url="/quizzes"
        type={selectedQuiz ? "course" : "website"}
      />
      <div className="flex h-[calc(100vh-60px)] bg-gray-50 dark:bg-dark-warm-300">
        <ContentSidebar sections={sections} selectedSection={selectedSection} selectedItem={selectedItem}
          onSectionSelect={setSelectedSection} onItemSelect={handleItemSelect}
          expandedSections={expandedSections} onToggleSection={handleToggleSection} />
        <div className="flex-1 overflow-y-auto w-full md:w-auto">
          {selectedQuiz ? (
            <div className="max-w-4xl mx-auto p-8">
              {!quizState.started ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="flex items-start justify-center mb-4 relative">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50">{selectedQuiz.title}</h1>
                      <div className="absolute right-0 top-0"><BookmarkButton item={selectedQuiz} type="quizzes" variant="floating" size="lg" /></div>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{selectedQuiz.description}</p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
                      <div className="flex items-center space-x-1"><Brain size={16} /><span>{selectedQuiz.questions?.length || 0} Questions</span></div>
                      <div className="flex items-center space-x-1"><Clock size={16} /><span>~{(selectedQuiz.questions?.length || 0) * 2} minutes</span></div>
                      {selectedQuiz.difficulty && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedQuiz.difficulty === 'Beginner' ? 'bg-burgundy-100 text-burgundy-800 dark:bg-burgundy-900/30 dark:text-burgundy-300' : 'bg-burgundy-200 text-burgundy-800 dark:bg-burgundy-900/40 dark:text-burgundy-300'}`}>
                          {selectedQuiz.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={startQuiz} className="btn-primary text-lg px-8 py-3">Start Quiz</button>
                </div>
              ) : quizState.completed ? (
                <div className="text-center">
                  <Award size={64} className="text-burgundy-600 dark:text-burgundy-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-cream-50 mb-4">Quiz Completed!</h2>
                  <div className="text-6xl font-bold text-burgundy-600 dark:text-burgundy-400 mb-4">
                    {Math.round((quizState.score / selectedQuiz.questions.length) * 100)}%
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">You got {quizState.score} out of {selectedQuiz.questions.length} questions correct</p>
                  <div className="space-y-4 mb-8">
                    {selectedQuiz.questions.map((q, i) => (
                      <div key={q.id} className="bg-white dark:bg-dark-warm-100 border border-cream-200 dark:border-dark-warm-50 rounded-xl p-4 text-left shadow-sm">
                        <div className="flex items-start space-x-3">
                          {quizState.answers[i] === q.correct
                            ? <CheckCircle className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" size={20} />
                            : <XCircle className="text-red-500 dark:text-red-400 mt-1 flex-shrink-0" size={20} />}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-cream-50 mb-1">{q.question}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Correct: {q.options[q.correct]}</p>
                            {quizState.answers[i] !== q.correct && (
                              <p className="text-sm text-red-500 dark:text-red-400">Your answer: {q.options[quizState.answers[i]]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={resetQuiz} className="btn-primary">Take Quiz Again</button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-cream-50">Question {quizState.currentQuestion + 1} of {selectedQuiz.questions.length}</h2>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{selectedQuiz.title}</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-warm-200 rounded-full h-2 mb-6">
                      <div className="bg-burgundy-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((quizState.currentQuestion + 1) / selectedQuiz.questions.length) * 100}%` }} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-dark-warm-100 rounded-xl border border-cream-200 dark:border-dark-warm-50 p-8 shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-cream-50 mb-8">{selectedQuiz.questions[quizState.currentQuestion].question}</h3>
                    <div className="space-y-4">
                      {selectedQuiz.questions[quizState.currentQuestion].options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(index)}
                          className="w-full text-left p-4 border-2 border-gray-200 dark:border-dark-warm-50 rounded-lg hover:border-burgundy-400 dark:hover:border-burgundy-500 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-colors duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{String.fromCharCode(65 + index)}</span>
                            </div>
                            <span className="text-lg text-gray-800 dark:text-gray-100">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Brain size={48} className="text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-cream-50 mb-2">Select a Quiz</h2>
                <p className="text-gray-600 dark:text-gray-400">Choose a quiz from the sidebar to test your knowledge</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Quizzes
