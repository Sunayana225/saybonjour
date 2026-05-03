# SayBonjour! - French Learning Platform

## Overview
SayBonjour! is an interactive French learning platform designed to provide a comprehensive and engaging learning experience. It features a React/Vite frontend and an Express.js backend, offering user accounts, a full suite of learning tools, and gamified elements. The platform aims to guide users from beginner to advanced levels (A1-C2 CEFR) through daily challenges, mini-games, reading comprehension, and personalized learning paths. Its vision is to make French language acquisition accessible, fun, and effective, catering to a wide range of learners and supporting their progress with structured content and interactive exercises.

## User Preferences
- I prefer clear and concise explanations.
- I appreciate modular and organized code.
- I expect iterative development with regular updates.
- Please ask for confirmation before implementing major architectural changes.
- Ensure all new features have comprehensive dark mode support.
- Prioritize performance and a smooth user experience.
- Do not make changes to the `backend/DATABASE.md` file.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite 4
- **Routing**: `react-router-dom` v6
- **Styling**: Tailwind CSS for utility-first styling with full dark mode support via the `.dark` class on the `<html>` element.
- **Animations**: `Framer Motion` for declarative animations.
- **State Management**: Context API for global state (Theme, User, Auth, Accessibility, i18n).
- **Internationalization**: `i18nContext` for EN/FR/ES language toggling with persistent selection.
- **Accessibility**: `AccessibilityContext` provides font size adjustment, dyslexia-friendly font, high contrast mode, and reduced motion settings.
- **SEO**: `react-helmet-async` for managing document head tags.

### Backend
- **Framework**: Express.js
- **Database**: SQLite using `better-sqlite3` for local data persistence.
- **Authentication**: JWT-based authentication for users (`X-User-Token` header) and administrators (`Authorization: Bearer` header). Google OAuth integration for user login.
- **Security**: Implemented with Helmet, rate limiting, input validation, and PBKDF2 password hashing.
- **Data Storage**: Static JSON files for core learning content (articles, quizzes, sections) and SQLite for dynamic data (users, custom vocabulary, study history).

### Core Features
- **User Management**: Comprehensive user lifecycle including registration, login, profile management, avatar uploads, password changes, account deletion, and data export (GDPR compliant).
- **Learning Progression**: XP system, streaks, levels, badges, and rank tiers (Bronze to Diamond). Includes a daily login reward and spaced repetition (SM-2 algorithm) for vocabulary.
- **Personalization**: Onboarding flow to assess skill level, set learning goals, and define learning styles. Personalized learning paths aligned with CEFR levels (A1-C2).
- **Content Management System (CMS)**: Admin panel for CRUD operations on various content types, including articles, quizzes, custom vocabulary, daily challenges, and site settings.
- **PWA Capabilities**: Configured with a web manifest for installability.

### UI/UX Decisions
- **Theming**: Full dark mode support across all components and pages, toggled via a global context.
- **Navigation**: Persistent navbar with dropdowns for learning modules and resources, user avatar menu, and language selector.
- **Responsiveness**: Designed to be fully responsive across different devices.

## External Dependencies

- **Google OAuth**: Used for user authentication via Google Sign-In.
- **Multer**: Node.js middleware for handling `multipart/form-data`, primarily for avatar uploads.
- **better-sqlite3**: Node.js SQLite library for database interactions.
- **mlconjug3**: Python library used for populating the `verbs` database table (executed via `backend/populate_verbs.py`).
- **Framer Motion**: React library for production-ready animations.
- **Lucide React**: Icon library for consistent UI icons.
- **Tailwind CSS**: Utility-first CSS framework.
- **react-router-dom**: Declarative routing for React.
- **react-helmet-async**: Manages asynchronous updates to the document head.
- **Morgan**: HTTP request logger middleware for Node.js.
- **Helmet**: Express.js middleware for setting various HTTP headers to enhance security.