import React, { useEffect, useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { I18nProvider } from './context/i18nContext'
import AnnouncementBar from './components/AnnouncementBar'
import AccountSettings from './pages/AccountSettings'
import LearningPath from './pages/LearningPath'
import StudyHistory from './pages/StudyHistory'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Resources from './pages/Resources'
import Quizzes from './pages/Quizzes'
import StudyTools from './pages/StudyTools'
import Culture from './pages/Culture'
import Media from './pages/Media.jsx'
import MemoryBoosters from './pages/MemoryBoosters.jsx'
import FranceMap from './pages/FranceMap.jsx'
import Worksheets from './pages/Worksheets.jsx'
import PhraseOfTheDay from './pages/PhraseOfTheDay.jsx'
import Favorites from './pages/Favorites.jsx'
import Admin from './pages/Admin'
import Conjugate from './pages/Conjugate'
import Grammar from './pages/Grammar'
import Vocabulary from './pages/Vocabulary'
import Progress from './pages/Progress'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import DailyChallenges from './pages/DailyChallenges'
import WordMatch from './pages/WordMatch'
import ReadingComprehension from './pages/ReadingComprehension'
import TypingRace from './pages/TypingRace'
import SentenceBuilder from './pages/SentenceBuilder'
import BusinessFrench from './pages/BusinessFrench'
import SlangFrench from './pages/SlangFrench'
import InteractiveStory from './pages/InteractiveStory'
import TravelFrench from './pages/TravelFrench'
import FrenchJokes from './pages/FrenchJokes'
import WritingTemplates from './pages/WritingTemplates'
import NotFound from './pages/NotFound'
import { claimDailyLoginReward } from './utils/progress'

const DailyLoginReward = () => {
  useEffect(() => {
    const reward = claimDailyLoginReward()
    if (reward) {
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-6 right-6 z-50 bg-amber-400 text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm flex items-center gap-2'
      toast.innerHTML = `<span>🎁</span> <span>Daily login reward: +${reward} XP!</span>`
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3500)
    }
  }, [])
  return null
}

function App() {
  const [barVisible, setBarVisible] = useState(false)
  const handleBarVisibility = useCallback((v) => setBarVisible(v), [])

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AccessibilityProvider>
          <I18nProvider>
        <AuthProvider>
          <UserProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <DailyLoginReward />
              <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 transition-colors duration-300">
                <Navbar />
                <AnnouncementBar onVisibilityChange={handleBarVisibility} />
                <main style={{ paddingTop: barVisible ? '96px' : '60px' }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/quizzes" element={<Quizzes />} />
                    <Route path="/study-tools" element={<StudyTools />} />
                    <Route path="/culture" element={<Culture />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/memory-boosters" element={<MemoryBoosters />} />
                    <Route path="/france-map" element={<FranceMap />} />
                    <Route path="/worksheets" element={<Worksheets />} />
                    <Route path="/phrase-of-the-day" element={<PhraseOfTheDay />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/conjugate" element={<Conjugate />} />
                    <Route path="/grammar" element={<Grammar />} />
                    <Route path="/vocabulary" element={<Vocabulary />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/daily-challenges" element={<DailyChallenges />} />
                    <Route path="/word-match" element={<WordMatch />} />
                    <Route path="/reading" element={<ReadingComprehension />} />
                    <Route path="/typing-race" element={<TypingRace />} />
                    <Route path="/sentence-builder" element={<SentenceBuilder />} />
                    <Route path="/business-french" element={<BusinessFrench />} />
                    <Route path="/slang-french" element={<SlangFrench />} />
                    <Route path="/stories" element={<InteractiveStory />} />
                    <Route path="/travel-french" element={<TravelFrench />} />
                    <Route path="/jokes" element={<FrenchJokes />} />
                    <Route path="/writing" element={<WritingTemplates />} />
                    <Route path="/learning-path" element={<LearningPath />} />
                    <Route path="/history" element={<StudyHistory />} />
                    <Route path="/settings" element={<AccountSettings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </UserProvider>
        </AuthProvider>
          </I18nProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
