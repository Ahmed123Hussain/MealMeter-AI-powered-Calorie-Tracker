# AI-Powered Calorie Tracker

## Overview

This is a modern, responsive AI-powered calorie tracking web application built with React and Node.js. The app allows users to upload photos of their food, uses AI to identify the food and calculate nutritional information, and provides a comprehensive dashboard for tracking daily calorie intake and nutrition goals.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API for global state (auth, theme)
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Upload**: Multer for handling image uploads
- **AI Integration**: Mock AI food recognition service (ready for real AI API integration)

### Database Schema
- **Users Table**: Stores user profiles, goals, and preferences
- **Food Entries Table**: Stores individual food log entries with nutritional data
- **Relationships**: One-to-many relationship between users and food entries

## Key Components

### Authentication System
- JWT-based authentication with secure token storage
- Protected routes using AuthGuard component
- User registration and login with form validation
- Profile management with personal information and nutrition goals

### AI Food Recognition
- Image upload functionality for food photos
- Mock AI service that simulates food identification
- Nutritional data calculation (calories, protein, carbs, fat)
- Confidence scoring for AI predictions

### Dashboard & Analytics
- Daily calorie intake tracking with progress visualization
- Weekly progress charts using Recharts
- Nutrition goal tracking (calories, protein, carbs, fat)
- Food log with image previews and meal categorization

### UI/UX Features
- Dark/light theme toggle with system preference detection
- Responsive design for mobile and desktop
- Comprehensive UI component library (shadcn/ui)
- Toast notifications for user feedback
- Loading states and error handling

## Data Flow

1. **User Authentication**: Users register/login → JWT token stored → Protected routes accessible
2. **Food Logging**: User uploads food image → AI analyzes image → Nutritional data calculated → Entry saved to database
3. **Dashboard Updates**: New food entries trigger data refetch → Charts and stats update in real-time
4. **Profile Management**: User updates profile → Calorie goals recalculated → Dashboard reflects new targets

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI components for accessibility
- **wouter**: Lightweight routing library
- **recharts**: Chart library for data visualization
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework

### Backend Dependencies
- **drizzle-orm**: Type-safe SQL query builder
- **@neondatabase/serverless**: PostgreSQL database connection
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **multer**: File upload handling
- **express**: Web server framework

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tailwindcss**: CSS framework
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution with file watching
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)

### Production
- **Build Process**: 
  - Frontend: Vite build creates optimized static assets
  - Backend: esbuild bundles server code for Node.js
- **Deployment**: Single-server deployment with static file serving
- **Database**: PostgreSQL with Drizzle migrations

### Environment Configuration
- **Development**: Uses NODE_ENV=development
- **Production**: Uses NODE_ENV=production with optimized builds
- **Database**: Configured via DATABASE_URL environment variable
- **Authentication**: JWT_SECRET environment variable for token signing

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup