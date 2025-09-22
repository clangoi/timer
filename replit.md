# FitTimer Pro - Smart Workout Timer

## Overview

FitTimer Pro is a comprehensive workout timer application designed for fitness enthusiasts who need precise timing during their training sessions. The application features two primary modes: a free-running chronometer for open-ended workouts and an advanced Tabata sequence system for high-intensity interval training (HIIT).

The application is built as a Progressive Web App (PWA) with offline capabilities, floating timer functionality, and comprehensive audio/visual feedback systems. It's designed to provide a seamless experience across mobile and desktop devices with persistent state management and customizable workout configurations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API with useReducer for global timer state management
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming support (light/dark modes)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints and static file serving
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: In-memory storage with extensible interface for future database integration
- **Development**: Hot module replacement and development middleware integration

### Data Storage Solutions
- **Local Storage**: Client-side persistence for timer state, user preferences, and session data
- **Database Schema**: User management system with username/password authentication ready for expansion
- **State Persistence**: Automatic saving and restoration of timer configurations and progress

### Authentication and Authorization
- **Current Implementation**: Basic user schema with username/password fields
- **Future Ready**: Extensible authentication system prepared for session management and user-specific data

### Core Timer System
- **Context-Based State**: Global timer context managing all timing operations, configurations, and session statistics
- **Multi-Mode Support**: Chronometer mode for free timing and Tabata mode for structured interval training
- **Phase Management**: Automatic progression through work, rest, and long rest phases in Tabata sequences
- **Floating Interface**: Minimizable timer that persists across different views for uninterrupted workouts

### Audio and Haptic Feedback
- **Web Audio API**: Custom audio manager for generating phase transition sounds and user action feedback
- **Vibration API**: Haptic feedback patterns for different timer events and phase changes
- **Configurable Feedback**: User-controllable audio and vibration settings with persistent preferences

### Progressive Web App Features
- **Service Worker**: Offline caching strategy for core application files and resources
- **Web App Manifest**: Native app-like installation and behavior on mobile devices
- **Responsive Design**: Mobile-first approach with touch-optimized controls and layouts

### Development and Build System
- **Development Server**: Vite dev server with Express backend integration for full-stack development
- **Production Build**: Optimized client bundle with separate server build for deployment
- **Code Organization**: Monorepo structure with shared types and schemas between client and server

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation and Hookform Resolvers

### UI and Styling
- **Component Library**: Radix UI primitives for accessible base components
- **Design System**: shadcn/ui components built on Radix primitives
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Utility Libraries**: clsx and tailwind-merge for conditional styling

### Database and Backend
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod for runtime type validation and schema generation
- **Session Storage**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Development Experience**: Replit-specific plugins for cartographer and dev banner
- **Error Handling**: Runtime error overlay for development debugging

### Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Command Interface**: cmdk for command palette functionality (future feature)
- **Carousel**: Embla Carousel React for potential sequence visualization
- **Class Utilities**: class-variance-authority for component variant management

### PWA and Web APIs
- **Service Worker**: Custom implementation for offline functionality
- **Web Audio**: Native Web Audio API for sound generation
- **Vibration**: Native Vibration API for haptic feedback
- **Local Storage**: Native browser storage for state persistence