# Overview

Luna is a supportive AI companion app designed specifically for teenage girls, providing a safe, judgment-free space for discussing sensitive topics including mental health, relationships, menstrual health, and general wellness. The app features an intuitive chat interface with topic-based conversations, resource libraries, and conversation history management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring warm, approachable colors
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting light/dark modes with CSS variables

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas
- **API Design**: RESTful API with structured endpoints for chat, conversations, and resources
- **Request Handling**: Express middleware for JSON parsing, logging, and error handling
- **Development Setup**: Hot module replacement via Vite integration in development mode

## Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect configuration
- **Database**: PostgreSQL (Neon serverless) for production data persistence
- **Schema Management**: Shared TypeScript schemas with Zod validation
- **Storage Abstraction**: Interface-based storage layer with in-memory implementation for development
- **Data Models**: Conversations with message history, curated resources with categorization

## Key Features
- **AI Chat Interface**: Topic-based conversations with contextual AI responses
- **Resource Library**: Categorized wellness resources (mental health, body health, crisis support, apps)
- **Conversation History**: Persistent chat sessions with topic categorization
- **Responsive Design**: Mobile-first approach optimized for teenage users
- **Theme Customization**: Light/dark mode support with accessible color schemes

## Design Patterns
- **Component Architecture**: Modular UI components with clear separation of concerns
- **Schema Validation**: Zod schemas for runtime type checking and API validation
- **Error Handling**: Centralized error boundaries and user-friendly error messaging
- **Responsive Layout**: Mobile-optimized design with desktop scaling capabilities

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for API server
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Fast development server and build tool with HMR support

## UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Consistent icon library for UI elements
- **Class Variance Authority**: Type-safe component variant management

## Database and Storage
- **Drizzle ORM**: Type-safe database toolkit with schema management
- **Neon Database**: Serverless PostgreSQL for cloud data persistence
- **Connect PG Simple**: PostgreSQL session store for Express sessions

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation support
- **Zod**: Runtime schema validation and type inference

## AI Integration
- **OpenAI API**: GPT-based chat completion for AI companion responses
- **Custom AI Logic**: Topic-aware response generation with resource recommendations

## Development Tools
- **Replit Integration**: Development environment optimization with cartographer and error overlay
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins