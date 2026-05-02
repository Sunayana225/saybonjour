import React, { createContext, useContext, useState, useEffect } from 'react'

const I18nContext = createContext()

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}

const STRINGS = {
  en: {
    home: 'Home', quizzes: 'Quizzes', resources: 'Resources', progress: 'Progress',
    favorites: 'Favorites', signIn: 'Sign In', signOut: 'Sign Out', profile: 'My Profile',
    settings: 'Settings', learn: 'Learn', darkMode: 'Dark mode', language: 'Language',
    learningPath: 'Learning Path', studyHistory: 'Study History', accountSettings: 'Account Settings',
    saveChanges: 'Save Changes', cancel: 'Cancel', edit: 'Edit', deleteAccount: 'Delete Account',
    exportData: 'Export My Data', notifications: 'Notifications', accessibility: 'Accessibility',
    security: 'Security', data: 'Data & Privacy', preferences: 'Preferences',
    bio: 'About Me', learningGoal: 'Learning Goal', cefrLevel: 'CEFR Level',
    dailyGoal: 'Daily Goal', weeklyGoal: 'Weekly Goal', studyReminders: 'Study Reminders',
    learningStyle: 'Learning Style', visual: 'Visual', audio: 'Audio', reading: 'Reading',
    fontSize: 'Font Size', dyslexiaFont: 'Dyslexia-Friendly Font', highContrast: 'High Contrast',
    reduceMotion: 'Reduce Motion', changePassword: 'Change Password', currentPassword: 'Current Password',
    newPassword: 'New Password', confirmPassword: 'Confirm Password', uploadPhoto: 'Upload Photo',
    resumeLearning: 'Resume Learning', continueWhere: 'Continue where you left off',
    syncProgress: 'Sync Progress', lastSynced: 'Last synced',
  },
  fr: {
    home: 'Accueil', quizzes: 'Quiz', resources: 'Ressources', progress: 'Progrès',
    favorites: 'Favoris', signIn: 'Connexion', signOut: 'Déconnexion', profile: 'Mon profil',
    settings: 'Paramètres', learn: 'Apprendre', darkMode: 'Mode sombre', language: 'Langue',
    learningPath: 'Parcours', studyHistory: 'Historique', accountSettings: 'Paramètres du compte',
    saveChanges: 'Enregistrer', cancel: 'Annuler', edit: 'Modifier', deleteAccount: 'Supprimer le compte',
    exportData: 'Exporter mes données', notifications: 'Notifications', accessibility: 'Accessibilité',
    security: 'Sécurité', data: 'Données et confidentialité', preferences: 'Préférences',
    bio: 'À propos de moi', learningGoal: 'Objectif', cefrLevel: 'Niveau CECR',
    dailyGoal: 'Objectif quotidien', weeklyGoal: 'Objectif hebdomadaire', studyReminders: 'Rappels d\'étude',
    learningStyle: 'Style d\'apprentissage', visual: 'Visuel', audio: 'Audio', reading: 'Lecture',
    fontSize: 'Taille de police', dyslexiaFont: 'Police dyslexie', highContrast: 'Contraste élevé',
    reduceMotion: 'Réduire les animations', changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel', newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe', uploadPhoto: 'Changer la photo',
    resumeLearning: 'Reprendre', continueWhere: 'Continuez là où vous en étiez',
    syncProgress: 'Synchroniser', lastSynced: 'Dernière sync',
  },
  es: {
    home: 'Inicio', quizzes: 'Pruebas', resources: 'Recursos', progress: 'Progreso',
    favorites: 'Favoritos', signIn: 'Iniciar sesión', signOut: 'Cerrar sesión', profile: 'Mi perfil',
    settings: 'Ajustes', learn: 'Aprender', darkMode: 'Modo oscuro', language: 'Idioma',
    learningPath: 'Ruta de aprendizaje', studyHistory: 'Historial', accountSettings: 'Configuración de cuenta',
    saveChanges: 'Guardar cambios', cancel: 'Cancelar', edit: 'Editar', deleteAccount: 'Eliminar cuenta',
    exportData: 'Exportar mis datos', notifications: 'Notificaciones', accessibility: 'Accesibilidad',
    security: 'Seguridad', data: 'Datos y privacidad', preferences: 'Preferencias',
    bio: 'Sobre mí', learningGoal: 'Objetivo', cefrLevel: 'Nivel MCER',
    dailyGoal: 'Meta diaria', weeklyGoal: 'Meta semanal', studyReminders: 'Recordatorios',
    learningStyle: 'Estilo de aprendizaje', visual: 'Visual', audio: 'Audio', reading: 'Lectura',
    fontSize: 'Tamaño de fuente', dyslexiaFont: 'Fuente para dislexia', highContrast: 'Alto contraste',
    reduceMotion: 'Reducir animaciones', changePassword: 'Cambiar contraseña',
    currentPassword: 'Contraseña actual', newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar contraseña', uploadPhoto: 'Subir foto',
    resumeLearning: 'Continuar aprendiendo', continueWhere: 'Continúa donde lo dejaste',
    syncProgress: 'Sincronizar', lastSynced: 'Última sincronización',
  }
}

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('saybonjour_lang') || 'en')

  useEffect(() => {
    localStorage.setItem('saybonjour_lang', lang)
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const t = (key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key
  const toggleLang = () => setLang(l => l === 'en' ? 'fr' : l === 'fr' ? 'es' : 'en')

  return (
    <I18nContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}
