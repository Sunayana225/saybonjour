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
import VerifyEmail from './pages/VerifyEmail'
import VerificationBanner from './components/VerificationBanner'
import StreakSaver from './components/StreakSaver'
import ProgressSyncToast from './components/ProgressSyncToast'
import LevelUpToast from './components/LevelUpToast'
import BadgeToast from './components/BadgeToast'
import XPGainPopup from './components/XPGainPopup'
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
import Pronunciation from './pages/Pronunciation'
import Conversation from './pages/Conversation'
import Levels from './pages/Levels'
import NotFound from './pages/NotFound'
import FrenchNumbers from './pages/FrenchNumbers'
import Games from './pages/Games'
import Hangman from './pages/Hangman'
import WordScramble from './pages/WordScramble'
import SpellingBee from './pages/SpellingBee'
import Dictation from './pages/Dictation'
import CulturalCalendar from './pages/CulturalCalendar'
import FalseFriends from './pages/FalseFriends'
import TongueTwisters from './pages/TongueTwisters'
import VocabularyThemes from './pages/VocabularyThemes'
import VerbDrills from './pages/VerbDrills'
import Leaderboard from './pages/Leaderboard'
import Achievements from './pages/Achievements'
import StudyPlanner from './pages/StudyPlanner'
import GenderPractice from './pages/GenderPractice'
import Crossword from './pages/Crossword'
import PictureVocabulary from './pages/PictureVocabulary'
import VocabularyExport from './pages/VocabularyExport'
import PrintableSheets from './pages/PrintableSheets'
import HighScores from './pages/HighScores'
import FrenchKeyboard from './pages/FrenchKeyboard'
import FrenchProverbs from './pages/FrenchProverbs'
import GrammarTips from './pages/GrammarTips'
import FrenchSongs from './pages/FrenchSongs'
import FrenchMovies from './pages/FrenchMovies'
import QuickTranslator from './pages/QuickTranslator'
import WordOfTheDay from './pages/WordOfTheDay'
import FrenchRadio from './pages/FrenchRadio'
import RegionalAccents from './pages/RegionalAccents'
import FrenchFoodGuide from './pages/FrenchFoodGuide'
import DELFPrep from './pages/DELFPrep'
import VerbConjugationQuiz from './pages/VerbConjugationQuiz'
import ListeningPractice from './pages/ListeningPractice'
import FrenchQuotes from './pages/FrenchQuotes'
import PhrasalVerbs from './pages/PhrasalVerbs'
import FrenchIdiomsPage from './pages/FrenchIdiomsPage'
import MiniFlashcards from './pages/MiniFlashcards'
import NotificationCenter from './pages/NotificationCenter'
import FrenchArt from './pages/FrenchArt'
import FrenchPoetry from './pages/FrenchPoetry'
import FrenchGestures from './pages/FrenchGestures'
import FrenchNamesGuide from './pages/FrenchNamesGuide'
import ColorsInFrench from './pages/ColorsInFrench'
import SeasonalVocabulary from './pages/SeasonalVocabulary'
import FalseFriendsDeep from './pages/FalseFriendsDeep'
import LanguageExchange from './pages/LanguageExchange'
import FrenchFashion from './pages/FrenchFashion'
import FrenchArchitecture from './pages/FrenchArchitecture'
import FrenchLiterature from './pages/FrenchLiterature'
import FrenchBodyLanguage from './pages/FrenchBodyLanguage'
import FrenchMathVocab from './pages/FrenchMathVocab'
import FrenchWeather from './pages/FrenchWeather'
import FrenchEmotions from './pages/FrenchEmotions'
import FrenchSchoolVocab from './pages/FrenchSchoolVocab'
import FrenchFamilyVocab from './pages/FrenchFamilyVocab'
import FrenchAtWork from './pages/FrenchAtWork'
import FrenchRestaurantGuide from './pages/FrenchRestaurantGuide'
import FrenchSports from './pages/FrenchSports'
import FrenchPolitics from './pages/FrenchPolitics'
import FrenchPhilosophy from './pages/FrenchPhilosophy'
import FrenchTechnology from './pages/FrenchTechnology'
import FrenchEnvironment from './pages/FrenchEnvironment'
import FrenchHealth from './pages/FrenchHealth'
import FrenchTravel from './pages/FrenchTravel'
import FrenchHousing from './pages/FrenchHousing'
import FrenchCooking from './pages/FrenchCooking'
import FrenchTransport from './pages/FrenchTransport'
import FrenchMusic from './pages/FrenchMusic'
import FrenchSlang from './pages/FrenchSlang'
import FrenchNegation from './pages/FrenchNegation'
import FrenchQuestions from './pages/FrenchQuestions'
import FrenchColors from './pages/FrenchColors'
import FrenchDates from './pages/FrenchDates'
import FrenchAdjectives from './pages/FrenchAdjectives'
import FrenchAnimals from './pages/FrenchAnimals'
import FrenchCafeCulture from './pages/FrenchCafeCulture'
import FrenchPrepositions from './pages/FrenchPrepositions'
import FrenchBodyParts from './pages/FrenchBodyParts'
import FrenchNature from './pages/FrenchNature'
import FrenchShoppingVocab from './pages/FrenchShoppingVocab'
import FrenchHolidays from './pages/FrenchHolidays'
import FrenchPronunciationGuide from './pages/FrenchPronunciationGuide'
import FrenchEtiquette from './pages/FrenchEtiquette'
import FrenchTuVous from './pages/FrenchTuVous'
import FrenchVerbs from './pages/FrenchVerbs'
import FrenchTenses from './pages/FrenchTenses'
import FrenchDirections from './pages/FrenchDirections'
import FrenchSchoolSystem from './pages/FrenchSchoolSystem'
import FrenchMedical from './pages/FrenchMedical'
import FrenchLoveRomance from './pages/FrenchLoveRomance'
import FrenchBusiness2 from './pages/FrenchBusiness2'
import FrenchHobbies from './pages/FrenchHobbies'
import FrenchArticles from './pages/FrenchArticles'
import FrenchWeeklyRoutine from './pages/FrenchWeeklyRoutine'
import FrenchOpinions from './pages/FrenchOpinions'
import FrenchFoodVocab from './pages/FrenchFoodVocab'
import FrenchComparatives from './pages/FrenchComparatives'
import FrenchRelativePronouns from './pages/FrenchRelativePronouns'
import FrenchNumbers2 from './pages/FrenchNumbers2'
import FrenchFalseFriends from './pages/FrenchFalseFriends'
import FrenchPronounsGuide from './pages/FrenchPronounsGuide'
import FrenchInterrogatives from './pages/FrenchInterrogatives'
import FrenchAccents from './pages/FrenchAccents'
import FrenchSubjunctive from './pages/FrenchSubjunctive'
import FrenchPassiveVoice from './pages/FrenchPassiveVoice'
import FrenchConversationTopics from './pages/FrenchConversationTopics'
import FrenchRegionalFrance from './pages/FrenchRegionalFrance'
import FrenchSocialMedia from './pages/FrenchSocialMedia'
import FrenchPoliticsVocab from './pages/FrenchPoliticsVocab'
import FrenchTimeExpressions from './pages/FrenchTimeExpressions'
import FrenchCinema from './pages/FrenchCinema'
import FrenchWeather2 from './pages/FrenchWeather2'
import FrenchColors2 from './pages/FrenchColors2'
import FrenchTransport2 from './pages/FrenchTransport2'
import AdminFeaturePages from './pages/AdminFeaturePages'
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
              <LevelUpToast />
              <BadgeToast />
              <XPGainPopup />
              <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 transition-colors duration-300">
                <Navbar />
                <AnnouncementBar onVisibilityChange={handleBarVisibility} />
                <VerificationBanner />
                <StreakSaver />
                <ProgressSyncToast />
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
                    <Route path="/verify-email" element={<VerifyEmail />} />
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
                    <Route path="/pronunciation" element={<Pronunciation />} />
                    <Route path="/conversation" element={<Conversation />} />
                    <Route path="/levels" element={<Levels />} />
                    <Route path="/numbers" element={<FrenchNumbers />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/hangman" element={<Hangman />} />
                    <Route path="/word-scramble" element={<WordScramble />} />
                    <Route path="/spelling-bee" element={<SpellingBee />} />
                    <Route path="/dictation" element={<Dictation />} />
                    <Route path="/cultural-calendar" element={<CulturalCalendar />} />
                    <Route path="/false-friends" element={<FalseFriends />} />
                    <Route path="/tongue-twisters" element={<TongueTwisters />} />
                    <Route path="/vocabulary-themes" element={<VocabularyThemes />} />
                    <Route path="/verb-drills" element={<VerbDrills />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/study-planner" element={<StudyPlanner />} />
                    <Route path="/gender-practice" element={<GenderPractice />} />
                    <Route path="/crossword" element={<Crossword />} />
                    <Route path="/picture-vocabulary" element={<PictureVocabulary />} />
                    <Route path="/vocabulary-export" element={<VocabularyExport />} />
                    <Route path="/printable-sheets" element={<PrintableSheets />} />
                    <Route path="/high-scores" element={<HighScores />} />
                    <Route path="/french-keyboard" element={<FrenchKeyboard />} />
                    <Route path="/proverbs" element={<FrenchProverbs />} />
                    <Route path="/grammar-tips" element={<GrammarTips />} />
                    <Route path="/french-songs" element={<FrenchSongs />} />
                    <Route path="/french-movies" element={<FrenchMovies />} />
                    <Route path="/quick-translator" element={<QuickTranslator />} />
                    <Route path="/word-of-the-day" element={<WordOfTheDay />} />
                    <Route path="/french-radio" element={<FrenchRadio />} />
                    <Route path="/regional-accents" element={<RegionalAccents />} />
                    <Route path="/french-food" element={<FrenchFoodGuide />} />
                    <Route path="/delf-prep" element={<DELFPrep />} />
                    <Route path="/conjugation-quiz" element={<VerbConjugationQuiz />} />
                    <Route path="/listening-practice" element={<ListeningPractice />} />
                    <Route path="/french-quotes" element={<FrenchQuotes />} />
                    <Route path="/phrasal-verbs" element={<PhrasalVerbs />} />
                    <Route path="/idioms" element={<FrenchIdiomsPage />} />
                    <Route path="/mini-flashcards" element={<MiniFlashcards />} />
                    <Route path="/notifications" element={<NotificationCenter />} />
                    <Route path="/french-art" element={<FrenchArt />} />
                    <Route path="/french-poetry" element={<FrenchPoetry />} />
                    <Route path="/french-gestures" element={<FrenchGestures />} />
                    <Route path="/french-names" element={<FrenchNamesGuide />} />
                    <Route path="/colors" element={<ColorsInFrench />} />
                    <Route path="/seasonal-vocabulary" element={<SeasonalVocabulary />} />
                    <Route path="/false-friends-deep" element={<FalseFriendsDeep />} />
                    <Route path="/language-exchange" element={<LanguageExchange />} />
                    <Route path="/french-fashion" element={<FrenchFashion />} />
                    <Route path="/french-architecture" element={<FrenchArchitecture />} />
                    <Route path="/french-literature" element={<FrenchLiterature />} />
                    <Route path="/french-body-language" element={<FrenchBodyLanguage />} />
                    <Route path="/french-math" element={<FrenchMathVocab />} />
                    <Route path="/french-weather" element={<FrenchWeather />} />
                    <Route path="/french-emotions" element={<FrenchEmotions />} />
                    <Route path="/french-school" element={<FrenchSchoolVocab />} />
                    <Route path="/french-family" element={<FrenchFamilyVocab />} />
                    <Route path="/french-at-work" element={<FrenchAtWork />} />
                    <Route path="/french-restaurant" element={<FrenchRestaurantGuide />} />
                    <Route path="/french-sports" element={<FrenchSports />} />
                    <Route path="/french-politics" element={<FrenchPolitics />} />
                    <Route path="/french-philosophy" element={<FrenchPhilosophy />} />
                    <Route path="/french-technology" element={<FrenchTechnology />} />
                    <Route path="/french-environment" element={<FrenchEnvironment />} />
                    <Route path="/french-health" element={<FrenchHealth />} />
                    <Route path="/french-travel" element={<FrenchTravel />} />
                    <Route path="/french-housing" element={<FrenchHousing />} />
                    <Route path="/french-cooking" element={<FrenchCooking />} />
                    <Route path="/french-transport" element={<FrenchTransport />} />
                    <Route path="/french-music" element={<FrenchMusic />} />
                    <Route path="/french-slang" element={<FrenchSlang />} />
                    <Route path="/french-negation" element={<FrenchNegation />} />
                    <Route path="/french-questions" element={<FrenchQuestions />} />
                    <Route path="/french-colors" element={<FrenchColors />} />
                    <Route path="/french-dates" element={<FrenchDates />} />
                    <Route path="/french-adjectives" element={<FrenchAdjectives />} />
                    <Route path="/french-animals" element={<FrenchAnimals />} />
                    <Route path="/french-cafe" element={<FrenchCafeCulture />} />
                    <Route path="/french-prepositions" element={<FrenchPrepositions />} />
                    <Route path="/french-body-parts" element={<FrenchBodyParts />} />
                    <Route path="/french-nature" element={<FrenchNature />} />
                    <Route path="/french-shopping" element={<FrenchShoppingVocab />} />
                    <Route path="/french-holidays" element={<FrenchHolidays />} />
                    <Route path="/french-pronunciation-guide" element={<FrenchPronunciationGuide />} />
                    <Route path="/french-etiquette" element={<FrenchEtiquette />} />
                    <Route path="/tu-vs-vous" element={<FrenchTuVous />} />
                    <Route path="/french-verbs" element={<FrenchVerbs />} />
                    <Route path="/french-tenses" element={<FrenchTenses />} />
                    <Route path="/french-directions" element={<FrenchDirections />} />
                    <Route path="/french-school-system" element={<FrenchSchoolSystem />} />
                    <Route path="/french-medical" element={<FrenchMedical />} />
                    <Route path="/french-love" element={<FrenchLoveRomance />} />
                    <Route path="/french-business-vocab" element={<FrenchBusiness2 />} />
                    <Route path="/french-hobbies" element={<FrenchHobbies />} />
                    <Route path="/french-articles" element={<FrenchArticles />} />
                    <Route path="/french-daily-routine" element={<FrenchWeeklyRoutine />} />
                    <Route path="/french-opinions" element={<FrenchOpinions />} />
                    <Route path="/french-food-vocab" element={<FrenchFoodVocab />} />
                    <Route path="/french-comparatives" element={<FrenchComparatives />} />
                    <Route path="/french-relative-pronouns" element={<FrenchRelativePronouns />} />
                    <Route path="/french-numbers-guide" element={<FrenchNumbers2 />} />
                    <Route path="/french-false-friends-vocab" element={<FrenchFalseFriends />} />
                    <Route path="/french-pronouns-guide" element={<FrenchPronounsGuide />} />
                    <Route path="/french-question-words" element={<FrenchInterrogatives />} />
                    <Route path="/french-accents-guide" element={<FrenchAccents />} />
                    <Route path="/french-subjunctive" element={<FrenchSubjunctive />} />
                    <Route path="/french-passive-voice" element={<FrenchPassiveVoice />} />
                    <Route path="/french-conversation-topics" element={<FrenchConversationTopics />} />
                    <Route path="/french-regions" element={<FrenchRegionalFrance />} />
                    <Route path="/french-social-media" element={<FrenchSocialMedia />} />
                    <Route path="/french-politics-vocab" element={<FrenchPoliticsVocab />} />
                    <Route path="/french-time-expressions" element={<FrenchTimeExpressions />} />
                    <Route path="/french-cinema" element={<FrenchCinema />} />
                    <Route path="/french-weather-2" element={<FrenchWeather2 />} />
                    <Route path="/french-colors-guide" element={<FrenchColors2 />} />
                    <Route path="/french-transport-2" element={<FrenchTransport2 />} />
                    <Route path="/admin/pages" element={<AdminFeaturePages />} />
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
