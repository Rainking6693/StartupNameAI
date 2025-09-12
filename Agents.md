Repository Guidelines for StartupNamer.org
🎯 What This Repository Does
StartupNamer.org is an AI-powered startup naming platform that generates perfect business names using advanced artificial intelligence. The platform combines OpenAI's GPT technology with brandability analysis, domain availability checking, and trademark risk assessment to help entrepreneurs find memorable, brandable names for their startups.
Key responsibilities:

AI-powered startup name generation with industry-specific intelligence
Real-time domain availability checking across multiple extensions
Brandability scoring based on linguistic and psychological analysis
Trademark conflict assessment and legal guidance
Premium naming packages with comprehensive analysis and export capabilities

Project Structure & Module Organization
StartupNamer.org follows a modern full-stack architecture with React frontend and Node.js backend. The client is organized with /src/components for React components grouped by feature (landing-page, naming-tool, results, dashboard), /src/utils for API utilities and helper functions, /src/hooks for custom React hooks, and /src/context for state management. The server contains /routes for API endpoints, /services for business logic, /middleware for authentication and validation, and /config for database and external service configurations.
Build, Test, and Development Commands
bash# Start development servers
npm run dev                    # Concurrent client and server
npm run client                 # React frontend only
npm run server                 # Node.js backend only

# Production builds
npm run build                  # Build React app
npm run start                  # Start production server

# Install dependencies
npm run install-all           # Install both client and server deps

# Code quality
npm run lint                   # ESLint checks
npm run test                   # Run test suite
Coding Style & Naming Conventions

Indentation: 2 spaces (JavaScript/TypeScript)
File naming: PascalCase for components, camelCase for utilities
Function/variable naming: camelCase with descriptive names
Linting: ESLint with React configuration, strict mode enabled

Testing Guidelines

Framework: Jest for unit tests, Playwright for E2E testing
Test files: Located alongside components and services
Running tests: Use npm run test for comprehensive testing
Coverage: Focus on name generation logic, payment flows, and user journeys

Commit & Pull Request Guidelines

Commit format: Descriptive messages with emoji prefixes (🚀, 🎨, 🔧, 🐛)
PR process: Code review for production changes
Branch naming: Feature branches with descriptive names


Repository Tour
🏗️ Architecture Overview
System Context
[User Input/Keywords] → [StartupNamer.org Platform] → [Perfect Startup Names]
                                ↓
                        [OpenAI GPT Engine]
                                ↓
                    [Brandability Analysis] → [Domain Intelligence]
Key Components

Name Generation Engine - OpenAI GPT integration for creative name generation
Brandability Analyzer - Linguistic and psychological scoring algorithms
Domain Intelligence - Real-time availability checking and pricing insights
Payment Processing - Stripe integration for naming packages
Export System - PDF report generation and name delivery
User Management - Authentication, session management, and usage tracking

Data Flow

User completes naming wizard (industry, style, keywords)
AI generates names using industry-specific prompts
Brandability analysis scores each name
Domain availability checked across extensions
Results displayed with comprehensive analysis
Premium features unlocked via payment
Professional PDF reports generated and delivered

📁 Project Structure
StartupNamer.org/
├── client/                          # React frontend application
│   ├── public/                      # Static assets and favicon
│   ├── src/
│   │   ├── components/              # React components by feature
│   │   │   ├── LandingPage.js       # Homepage and marketing
│   │   │   ├── NamingTool.js        # Multi-step naming wizard
│   │   │   ├── NameResults.js       # Results display and analysis
│   │   │   ├── PaymentFlow.js       # Stripe checkout integration
│   │   │   └── Dashboard.js         # User account management
│   │   ├── utils/                   # API utilities and helpers
│   │   │   ├── api.js               # Axios API client
│   │   │   └── constants.js         # App constants
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # State management
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # React entry point
│   └── package.json                 # Client dependencies
├── server/                          # Node.js backend API
│   ├── routes/                      # API endpoint definitions
│   │   ├── names.js                 # Name generation endpoints
│   │   ├── auth.js                  # Authentication routes
│   │   ├── payments.js              # Stripe payment handling
│   │   └── users.js                 # User management
│   ├── services/                    # Business logic modules
│   │   ├── nameGenerator.js         # OpenAI integration
│   │   ├── domainChecker.js         # Domain availability
│   │   ├── paymentService.js        # Stripe operations
│   │   └── emailService.js          # Transactional emails
│   ├── middleware/                  # Request processing
│   │   ├── auth.js                  # JWT authentication
│   │   ├── validation.js            # Input validation
│   │   ├── rateLimit.js             # API rate limiting
│   │   └── errorHandler.js          # Error processing
│   ├── config/                      # Configuration files
│   │   ├── database.js              # PostgreSQL connection
│   │   ├── openai.js                # OpenAI API setup
│   │   └── stripe.js                # Stripe configuration
│   ├── models/                      # Database models
│   ├── index.js                     # Server entry point
│   └── package.json                 # Server dependencies
├── netlify.toml                     # Netlify deployment config
├── package.json                     # Root workspace config
└── README.md                        # Project documentation
Key Files to Know
FilePurposeWhen You'd Touch Itserver/services/nameGenerator.jsCore name generation logicAdding AI features, improving promptsclient/src/components/NamingTool.jsMain user interfaceEnhancing UX, adding wizard stepsserver/routes/payments.jsStripe payment processingPayment features, subscription managementclient/src/components/NameResults.jsResults display and analysisImproving result presentationserver/config/openai.jsOpenAI API configurationUpdating AI models, prompt templatesnetlify.tomlDeployment configurationBuild settings, redirects
🔧 Technology Stack
Core Technologies

Language: JavaScript (ES6+) - Full-stack development
Frontend: React 18 with Hooks - Modern component-based UI
Backend: Node.js + Express - RESTful API server
Database: PostgreSQL - Relational data with Supabase
Styling: Tailwind CSS - Utility-first styling system

Key Libraries
Frontend:

react-router-dom - Client-side routing
axios - HTTP client for API calls
framer-motion - Animations and interactions
react-hot-toast - Toast notifications
@stripe/stripe-js - Payment processing
lucide-react - Icon library

Backend:

openai - AI name generation
stripe - Payment processing
pg - PostgreSQL client
express-validator - Input validation
bcryptjs - Password hashing
jsonwebtoken - JWT authentication
nodemailer - Email delivery

Development Tools

Bundling: Create React App - Zero-config React setup
Linting: ESLint - Code quality enforcement
Testing: Jest - Unit and integration testing
Deployment: Netlify - Static site hosting with serverless functions

🌐 External Dependencies
Required Services

Netlify - Frontend hosting and deployment
OpenAI - GPT API for name generation
Stripe - Payment processing and subscriptions
Supabase - PostgreSQL database hosting
Gmail SMTP - Transactional email delivery

Optional Integrations

GoDaddy API - Domain availability and pricing
Namecheap API - Alternative domain checking
Google Analytics - User behavior tracking
Hotjar - User experience insights

Environment Variables
bash# Server-side (Required)
OPENAI_API_KEY=              # OpenAI GPT access
STRIPE_SECRET_KEY=           # Payment processing
DATABASE_URL=                # PostgreSQL connection
JWT_SECRET=                  # Authentication tokens
EMAIL_USER=                  # SMTP email account
EMAIL_PASS=                  # SMTP password

# Client-side (Required)
REACT_APP_API_URL=           # Backend API endpoint
REACT_APP_STRIPE_PUBLISHABLE_KEY=  # Stripe public key

# Optional
GODADDY_API_KEY=            # Domain checking
NAMECHEAP_API_KEY=          # Alternative domains
REACT_APP_GA_TRACKING_ID=   # Google Analytics
📄 Common Workflows
Name Generation Workflow

User completes 4-step naming wizard on /naming-tool
Form data sent to /api/names/generate endpoint
OpenAI generates names using industry-specific prompts
Brandability analysis scores each name (1-10)
Domain availability checked across extensions
Results stored in database with session ID
User redirected to /results/:sessionId for analysis

Code path: NamingTool.js → POST /api/names/generate → nameGenerator.js → domainChecker.js → NameResults.js
Payment Processing Workflow

User selects premium package on results page
Stripe checkout session created via /api/payments/create-intent
User completes payment on Stripe-hosted page
Webhook processes payment confirmation
User access upgraded to premium features
Email confirmation sent with premium results

Code path: PaymentFlow.js → POST /api/payments/create-intent → Stripe → /api/payments/webhook → emailService.js
Domain Analysis Workflow

Domain availability checked for each generated name
Multiple extensions (.com, .ai, .io, .org) queried
Pricing information retrieved from registrar APIs
Recommendations generated based on availability
Results cached to improve performance

Code path: domainChecker.js → External APIs → Database cache → NameResults.js
📈 Performance & Scale
Performance Considerations

API Optimization - Efficient OpenAI prompts and response caching
Domain Checking - Batched requests and intelligent caching
Database Queries - Indexed sessions and optimized PostgreSQL
Frontend - Code splitting and lazy loading for components

Cost Management

OpenAI Usage - ~$0.50-1.00 per 50-name generation
Domain APIs - Rate limiting and caching to minimize costs
Database - Efficient queries and automatic cleanup of old sessions
Monitoring - Real-time cost tracking and usage alerts

Scaling Limits

Name Generation - 100+ concurrent requests supported
Database - PostgreSQL handles thousands of naming sessions
Payment Processing - Stripe scales automatically
Frontend - Netlify CDN serves global traffic

🚨 Things to Be Careful About
🔒 Security Considerations

API Key Protection - All sensitive keys in environment variables only
Input Validation - Sanitize all user inputs to prevent injection
Rate Limiting - Prevent abuse of expensive AI generation endpoints
Payment Security - Never store card details, use Stripe tokens only

🤖 AI Content Management

Prompt Engineering - Carefully crafted prompts for quality names
Content Filtering - Avoid inappropriate or trademarked names
Cost Control - Monitor OpenAI usage and implement safeguards
Quality Assurance - Brandability scoring ensures name quality

💳 Payment & Subscription Processing

Webhook Security - Verify Stripe webhook signatures
Pricing Accuracy - Ensure package prices match Stripe configuration
Refund Handling - Clear policies and automated refund processing
Usage Limits - Enforce package limits and upgrade prompts

📊 Data & Privacy Management

User Data Protection - Encrypt sensitive information in database
Session Management - Automatic cleanup of expired naming sessions
GDPR Compliance - User data deletion and privacy controls
Analytics Tracking - Anonymized user behavior monitoring

🌐 Domain & Legal Considerations

Trademark Awareness - Provide guidance but not legal advice
Domain Accuracy - Real-time checking with fallback systems
Brand Guidelines - Consistent StartupNamer.org branding
Terms of Service - Clear usage policies and disclaimers

🚀 Development Best Practices
Code Quality

Component Structure - Modular, reusable React components
Error Handling - Comprehensive error boundaries and API error handling
Testing Coverage - Unit tests for business logic, E2E for user flows
Documentation - Clear code comments and API documentation

Deployment Strategy

Environment Separation - Development, staging, and production environments
Automated Testing - CI/CD pipeline with quality gates
Database Migrations - Version-controlled schema changes
Monitoring - Application health and performance monitoring

User Experience

Progressive Enhancement - Core functionality works without JavaScript
Mobile Responsiveness - Optimized for all device sizes
Loading States - Clear feedback during AI generation
Error Messages - User-friendly error handling and recovery

This documentation provides a comprehensive overview of the StartupNamer.org codebase, architecture, and development practices. Use it as a reference when contributing to the project or onboarding new team members.