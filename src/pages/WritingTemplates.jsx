import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, FileText, BookOpen, Copy, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react'
import SEO from '../components/SEO'
import { emailTemplates, letterTemplates, essayStructures, usefulConnectors } from '../data/writingData'

const TABS = [
  { id: 'emails', label: 'Emails', icon: Mail },
  { id: 'letters', label: 'Letters', icon: FileText },
  { id: 'essays', label: 'Essays', icon: BookOpen },
]

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  A2: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  B1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  B2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  C1: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

const REGISTER_COLORS = {
  Formal: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300',
  Informal: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-all"
    >
      {copied ? <><CheckCheck size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Copy template</>}
    </button>
  )
}

function TemplateCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const [phrasesOpen, setPhrasesOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 py-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${LEVEL_COLORS[item.level]}`}>{item.level}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${REGISTER_COLORS[item.register]}`}>{item.register}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{item.title}</h3>
        <p className="text-sm text-burgundy-600 font-medium mb-2">{item.titleFr}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{item.context}</p>
      </div>

      {/* Template */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
        >
          <span>View Template</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-6 pb-4">
                <div className="flex justify-end mb-2">
                  <CopyButton text={item.template} />
                </div>
                <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-dark-warm-200 rounded-xl p-4 whitespace-pre-wrap font-mono leading-relaxed border border-gray-200 dark:border-gray-600 overflow-x-auto">
                  {item.template}
                </pre>
                {item.notes && (
                  <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-3">
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">📌 {item.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Key Phrases */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setPhrasesOpen(!phrasesOpen)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
        >
          <span>Key phrases ({item.keyPhrases.length})</span>
          {phrasesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {phrasesOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-6 pb-5">
                <div className="space-y-2">
                  {item.keyPhrases.map((ph, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{ph.fr}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:max-w-[45%]">{ph.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EssayCard({ essay }) {
  const [expandedPart, setExpandedPart] = useState(null)

  return (
    <div className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 py-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${LEVEL_COLORS[essay.level]}`}>{essay.level}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{essay.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{essay.context}</p>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        {essay.structure.map((part, pi) => (
          <div key={pi}>
            <button
              onClick={() => setExpandedPart(expandedPart === pi ? null : pi)}
              className="w-full px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-burgundy-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{pi + 1}</span>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{part.part}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{part.label}</p>
                </div>
              </div>
              {expandedPart === pi ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            <AnimatePresence>
              {expandedPart === pi && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{part.description}</p>
                    <div className="space-y-2">
                      {part.phrases.map((ph, phi) => (
                        <div key={phi} className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-2.5">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{ph}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WritingTemplates() {
  const [activeTab, setActiveTab] = useState('emails')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 py-12 px-4">
      <SEO
        title="French Writing Templates — Emails, Letters & Essays | SayBonjour!"
        description="Practise French writing with structured templates for formal emails, personal letters, and DELF-style essays. Includes vocabulary connectors and copy-to-clipboard functionality."
        keywords="french writing templates, french email template, french letter template, french essay writing, DELF writing practice, formal french writing"
        url="/writing-templates"
      />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-5xl mb-4">✍️</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Writing Templates</h1>
          <p className="text-burgundy-600 font-medium mb-3">Modèles d'écriture</p>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Ready-to-use templates for French emails, formal letters, and academic essays — with key phrases, structural guides, and cultural tips.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeTab === id
                  ? 'bg-burgundy-600 text-white shadow-md'
                  : 'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 hover:bg-burgundy-50 dark:hover:bg-dark-warm-200 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'emails' && (
            <motion.div key="emails" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Click any template to expand it. Use the copy button to paste directly into your email client.</p>
              {emailTemplates.map(item => <TemplateCard key={item.id} item={item} />)}
            </motion.div>
          )}

          {activeTab === 'letters' && (
            <motion.div key="letters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">French formal letters follow a very specific layout. Expand a template to see the full structure.</p>
              {letterTemplates.map(item => <TemplateCard key={item.id} item={item} />)}
            </motion.div>
          )}

          {activeTab === 'essays' && (
            <motion.div key="essays" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Click each section of an essay structure to see example phrases and transitions.</p>
              <div className="space-y-5 mb-8">
                {essayStructures.map(essay => <EssayCard key={essay.id} essay={essay} />)}
              </div>

              {/* Connectors */}
              <div className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Useful Connectors</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Linking words and phrases to make your writing flow naturally.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {usefulConnectors.map((c, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-burgundy-600 uppercase tracking-wide mb-1">{c.category}</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{c.fr}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
