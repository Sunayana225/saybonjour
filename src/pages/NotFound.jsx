import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found | SayBonjour" url="/404" />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-8xl mb-6">🇫🇷</div>
          <h1 className="text-6xl font-black text-burgundy-600 dark:text-burgundy-400 mb-2">404</h1>
          <p className="text-2xl font-bold text-gray-800 dark:text-cream-50 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Oops! Page not found.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
            <em>"On ne trouve pas ce qu'on cherche."</em><br />
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-cream-50 border border-cream-300 dark:border-dark-warm-50 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-dark-warm-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default NotFound
