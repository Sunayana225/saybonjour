import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Sparkles, EyeOff, Eye, StickyNote, Plus, Trash2, Edit2, Save, X, ExternalLink, Filter, ChevronDown, ArrowLeft, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/AdminLogin'
import {
  ALL_FEATURE_PAGES,
  CATEGORIES,
  loadFeaturePageMeta,
  saveFeaturePageMeta,
  getPageMeta,
  setPageMeta,
  getExtraItems,
  setExtraItems,
} from '../utils/featurePageData'

const BADGE_STYLES = {
  featured: 'bg-amber-100 text-amber-700 border border-amber-200',
  isNew: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  hidden: 'bg-gray-100 text-gray-500 border border-gray-200',
}

function PageCard({ page, meta, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [noteEdit, setNoteEdit] = useState(false)
  const [noteDraft, setNoteDraft] = useState(meta.adminNote || '')
  const [newItem, setNewItem] = useState({ fr: '', en: '', note: '' })
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editDraft, setEditDraft] = useState({ fr: '', en: '', note: '' })

  const extras = meta.extraItems || []

  const toggleFlag = (flag) => {
    onUpdate(page.route, { [flag]: !meta[flag] })
  }

  const saveNote = () => {
    onUpdate(page.route, { adminNote: noteDraft })
    setNoteEdit(false)
  }

  const addItem = () => {
    if (!newItem.fr.trim() || !newItem.en.trim()) return
    const updated = [...extras, { ...newItem, id: Date.now() }]
    onUpdate(page.route, { extraItems: updated })
    setNewItem({ fr: '', en: '', note: '' })
    setShowItemForm(false)
  }

  const deleteItem = (id) => {
    onUpdate(page.route, { extraItems: extras.filter(i => i.id !== id) })
  }

  const startEditItem = (item) => {
    setEditingItem(item.id)
    setEditDraft({ fr: item.fr, en: item.en, note: item.note || '' })
  }

  const saveEditItem = (id) => {
    onUpdate(page.route, { extraItems: extras.map(i => i.id === id ? { ...i, ...editDraft } : i) })
    setEditingItem(null)
  }

  return (
    <motion.div
      layout
      className={`bg-white dark:bg-dark-warm-100 rounded-xl border shadow-sm transition-all ${
        meta.hidden ? 'opacity-50 border-gray-200 dark:border-dark-warm-50' : 'border-gray-100 dark:border-dark-warm-50'
      }`}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-1 flex items-center gap-3 text-left min-w-0"
        >
          <ChevronDown
            size={16}
            className={`shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-800 dark:text-cream-50 truncate">{page.name}</span>
              {meta.featured && <span className={`text-xs px-1.5 py-0.5 rounded-full ${BADGE_STYLES.featured}`}>Featured</span>}
              {meta.isNew && <span className={`text-xs px-1.5 py-0.5 rounded-full ${BADGE_STYLES.isNew}`}>New</span>}
              {meta.hidden && <span className={`text-xs px-1.5 py-0.5 rounded-full ${BADGE_STYLES.hidden}`}>Hidden</span>}
              {extras.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  +{extras.length} items
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 font-mono">{page.route}</span>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            title="Toggle Featured"
            onClick={() => toggleFlag('featured')}
            className={`p-1.5 rounded-lg transition-colors ${meta.featured ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-400 hover:bg-amber-50'}`}
          >
            <Star size={14} fill={meta.featured ? 'currentColor' : 'none'} />
          </button>
          <button
            title="Toggle New"
            onClick={() => toggleFlag('isNew')}
            className={`p-1.5 rounded-lg transition-colors ${meta.isNew ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-50'}`}
          >
            <Sparkles size={14} />
          </button>
          <button
            title={meta.hidden ? 'Show Page' : 'Hide Page'}
            onClick={() => toggleFlag('hidden')}
            className={`p-1.5 rounded-lg transition-colors ${meta.hidden ? 'text-gray-500 bg-gray-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            {meta.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <a
            href={page.route}
            target="_blank"
            rel="noopener noreferrer"
            title="View Page"
            className="p-1.5 rounded-lg text-gray-400 hover:text-burgundy-600 hover:bg-burgundy-50 transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-dark-warm-50 pt-3 space-y-4">

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <StickyNote size={11} /> Admin Note
                  </span>
                  {!noteEdit && (
                    <button onClick={() => { setNoteEdit(true); setNoteDraft(meta.adminNote || '') }} className="text-xs text-burgundy-600 hover:underline">
                      {meta.adminNote ? 'Edit' : 'Add note'}
                    </button>
                  )}
                </div>
                {noteEdit ? (
                  <div className="flex gap-2">
                    <textarea
                      value={noteDraft}
                      onChange={e => setNoteDraft(e.target.value)}
                      rows={2}
                      placeholder="Internal note visible only to admins..."
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400 resize-none"
                    />
                    <div className="flex flex-col gap-1">
                      <button onClick={saveNote} className="p-1.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors">
                        <Save size={13} />
                      </button>
                      <button onClick={() => setNoteEdit(false)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {meta.adminNote || 'No note set.'}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Plus size={11} /> Extra Vocabulary Items
                  </span>
                  <button
                    onClick={() => setShowItemForm(f => !f)}
                    className="text-xs bg-burgundy-600 text-white px-2 py-1 rounded-lg hover:bg-burgundy-700 transition-colors flex items-center gap-1"
                  >
                    <Plus size={11} /> Add Item
                  </button>
                </div>

                <AnimatePresence>
                  {showItemForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="bg-gray-50 dark:bg-dark-warm-200 rounded-lg p-3 mb-3 space-y-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={newItem.fr}
                          onChange={e => setNewItem(p => ({ ...p, fr: e.target.value }))}
                          placeholder="French"
                          className="px-2 py-1.5 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                        />
                        <input
                          value={newItem.en}
                          onChange={e => setNewItem(p => ({ ...p, en: e.target.value }))}
                          placeholder="English"
                          className="px-2 py-1.5 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                        />
                      </div>
                      <input
                        value={newItem.note}
                        onChange={e => setNewItem(p => ({ ...p, note: e.target.value }))}
                        placeholder="Cultural note (optional)"
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setShowItemForm(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button onClick={addItem} className="px-3 py-1.5 text-xs bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors flex items-center gap-1">
                          <Save size={11} /> Save Item
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {extras.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No extra items added yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {extras.map(item => (
                      <div key={item.id} className="bg-gray-50 dark:bg-dark-warm-200 rounded-lg px-3 py-2">
                        {editingItem === item.id ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={editDraft.fr}
                                onChange={e => setEditDraft(p => ({ ...p, fr: e.target.value }))}
                                className="px-2 py-1 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                              />
                              <input
                                value={editDraft.en}
                                onChange={e => setEditDraft(p => ({ ...p, en: e.target.value }))}
                                className="px-2 py-1 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                              />
                            </div>
                            <input
                              value={editDraft.note}
                              onChange={e => setEditDraft(p => ({ ...p, note: e.target.value }))}
                              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                            />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setEditingItem(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={13} /></button>
                              <button onClick={() => saveEditItem(item.id)} className="p-1 text-burgundy-600 hover:text-burgundy-800"><Save size={13} /></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-gray-800 dark:text-cream-50">{item.fr}</span>
                              <span className="text-gray-400 mx-1.5">→</span>
                              <span className="text-sm text-gray-600 dark:text-gray-300">{item.en}</span>
                              {item.note && <p className="text-xs text-amber-600 italic mt-0.5">{item.note}</p>}
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => startEditItem(item)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors"><Edit2 size={12} /></button>
                              <button onClick={() => deleteItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AdminFeaturePages() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [meta, setMeta] = useState({})
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [filterFlag, setFilterFlag] = useState('all')

  useEffect(() => {
    setMeta(loadFeaturePageMeta())
  }, [])

  const handleUpdate = (route, updates) => {
    const current = meta[route] || { featured: false, isNew: false, hidden: false, adminNote: '', extraItems: [] }
    const updated = { ...current, ...updates }
    const newMeta = { ...meta, [route]: updated }
    setMeta(newMeta)
    saveFeaturePageMeta(newMeta)
  }

  const getPageMetaLocal = (route) => {
    return meta[route] || { featured: false, isNew: false, hidden: false, adminNote: '', extraItems: [] }
  }

  const filtered = ALL_FEATURE_PAGES.filter(page => {
    const pageMeta = getPageMetaLocal(page.route)
    const matchSearch = page.name.toLowerCase().includes(search.toLowerCase()) || page.route.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || page.category === activeCategory
    const matchFlag =
      filterFlag === 'all' ? true :
      filterFlag === 'featured' ? pageMeta.featured :
      filterFlag === 'new' ? pageMeta.isNew :
      filterFlag === 'hidden' ? pageMeta.hidden :
      filterFlag === 'extras' ? (pageMeta.extraItems || []).length > 0 : true
    return matchSearch && matchCategory && matchFlag
  })

  const totalFeatured = ALL_FEATURE_PAGES.filter(p => getPageMetaLocal(p.route).featured).length
  const totalNew = ALL_FEATURE_PAGES.filter(p => getPageMetaLocal(p.route).isNew).length
  const totalHidden = ALL_FEATURE_PAGES.filter(p => getPageMetaLocal(p.route).hidden).length
  const totalWithExtras = ALL_FEATURE_PAGES.filter(p => (getPageMetaLocal(p.route).extraItems || []).length > 0).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-burgundy-600 transition-colors">
            <ArrowLeft size={16} /> Back to Admin
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50 flex items-center gap-2">
            <BookOpen size={24} className="text-burgundy-600" />
            Feature Pages Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage all {ALL_FEATURE_PAGES.length} feature pages — mark as featured, new, or hidden, add extra vocab items, and leave admin notes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Featured', count: totalFeatured, icon: Star, color: 'amber', flag: 'featured' },
            { label: 'New', count: totalNew, icon: Sparkles, color: 'emerald', flag: 'new' },
            { label: 'Hidden', count: totalHidden, icon: EyeOff, color: 'gray', flag: 'hidden' },
            { label: 'With Extra Items', count: totalWithExtras, icon: Plus, color: 'blue', flag: 'extras' },
          ].map(stat => (
            <button
              key={stat.flag}
              onClick={() => setFilterFlag(f => f === stat.flag ? 'all' : stat.flag)}
              className={`text-left p-3 rounded-xl border transition-all ${
                filterFlag === stat.flag
                  ? `bg-${stat.color}-50 border-${stat.color}-200 dark:bg-${stat.color}-900/20`
                  : 'bg-white dark:bg-dark-warm-100 border-gray-100 dark:border-dark-warm-50 hover:border-gray-200'
              }`}
            >
              <stat.icon size={16} className={`text-${stat.color}-500 mb-1`} />
              <div className={`text-xl font-bold text-${stat.color}-600`}>{stat.count}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-warm-100 rounded-xl border border-gray-100 dark:border-dark-warm-50 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search pages by name or route..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-burgundy-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2 text-xs text-gray-400">
          Showing {filtered.length} of {ALL_FEATURE_PAGES.length} pages
          {filterFlag !== 'all' && (
            <button onClick={() => setFilterFlag('all')} className="ml-2 text-burgundy-600 hover:underline">Clear filter</button>
          )}
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map(page => (
              <PageCard
                key={page.route}
                page={page}
                meta={getPageMetaLocal(page.route)}
                onUpdate={handleUpdate}
              />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Filter size={32} className="mx-auto mb-2 opacity-40" />
              <p>No pages match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
