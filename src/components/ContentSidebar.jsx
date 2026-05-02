import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ContentSidebar = ({
  sections,
  selectedSection,
  selectedItem,
  onSectionSelect,
  onItemSelect,
  expandedSections,
  onToggleSection
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when item is selected
  const handleItemSelect = (sectionId, itemId) => {
    onSectionSelect(sectionId)
    onItemSelect(itemId)
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  const SidebarContent = () => (
    <div className="h-full overflow-y-auto">
      <div className="p-3 sm:p-4 border-b border-burgundy-200 dark:border-burgundy-vibrant-600">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-burgundy-900 dark:text-cream-50">Topics</h2>
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-burgundy-100 dark:hover:bg-burgundy-vibrant-600 transition-colors"
            >
              <X size={20} className="text-burgundy-600 dark:text-cream-50" />
            </button>
          )}
        </div>
      </div>

      <div className="py-2">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-burgundy-100 dark:border-burgundy-vibrant-600">
            <button
              onClick={() => onToggleSection(section.id)}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-left hover:scale-105 transition-transform duration-200"
            >
              <span className="font-medium text-sm sm:text-base text-burgundy-900 dark:text-cream-50">{section.title}</span>
              {expandedSections.includes(section.id) ? (
                <ChevronDown size={16} className="text-burgundy-600 dark:text-cream-50" />
              ) : (
                <ChevronRight size={16} className="text-burgundy-600 dark:text-cream-50" />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-burgundy-800 dark:bg-burgundy-900 overflow-hidden"
                >
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(section.id, item.id)}
                      className={`sidebar-item ${
                        selectedSection === section.id && selectedItem === item.id
                          ? 'active'
                          : ''
                      }`}
                    >
                      <div className="pl-3 sm:pl-4">
                        <div className="font-medium text-xs sm:text-sm text-gray-900 dark:text-cream-50">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-gray-600 dark:text-cream-200 mt-1 line-clamp-2">
                            {item.description}
                          </div>
                        )}
                        {item.difficulty && (
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.difficulty === 'Beginner'
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                : item.difficulty === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            }`}>
                              {item.difficulty}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-20 left-4 z-40 bg-burgundy-600 text-white p-3 rounded-full shadow-lg md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={20} />
        </motion.button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-cream-50 dark:bg-burgundy-900 border-r border-burgundy-200 dark:border-burgundy-vibrant-600 z-50 md:hidden"
              >
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop sidebar
  return (
    <div className="hidden md:block w-80 bg-cream-50 dark:bg-burgundy-900 border-r border-burgundy-200 dark:border-burgundy-vibrant-600 h-full">
      <SidebarContent />
    </div>
  )
}

export default ContentSidebar
