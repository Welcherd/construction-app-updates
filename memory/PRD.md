# ConstructionConnection App - PRD

## Original Problem Statement
Merge a 3D global background with the ConstructionConnection app from GitHub repository (https://github.com/Welcherd/construction-app-updates), integrating Google Maps API for project/equipment locations with satellite view. Add user management system with registration, login, and user directory.

## Architecture
- **Frontend**: React 18 with Tailwind CSS, @vis.gl/react-google-maps
- **Backend**: FastAPI with MongoDB, JWT authentication
- **Styling**: Glass-morphism, dark theme, CSS animations for 3D globe

## User Personas
1. **Construction Workers** - Browse jobs, connect with peers globally
2. **Equipment Owners** - List equipment for rent
3. **Project Managers** - Track projects, hire workers
4. **General Contractors** - Find equipment and subcontractors

## Core Requirements (Static)
- [x] 3D animated globe background
- [x] Desktop landing page (Hero, Stats, Map, Users, Projects, Services, Contact)
- [x] Mobile app with 5 tabs (Home, Equipment, Projects, Messages, Profile)
- [x] Google Maps integration with project/equipment markers
- [x] User registration with multi-step form
- [x] User authentication with JWT tokens
- [x] Registered users directory with search/filter
- [x] Responsive design (mobile < 768px)
- [x] Dark/light theme support

## What's Been Implemented (Jan 2026)
- [x] CSS-based 3D Earth animation with stars and orbital effects
- [x] Interactive Google Maps with satellite view (API key configured)
- [x] Desktop landing page sections
- [x] Mobile app with tabbed navigation
- [x] Social feed with global posts
- [x] Equipment rental listings with filters
- [x] Project cards with progress tracking
- [x] Messaging interface
- [x] User profile with settings
- [x] User registration (3-step form: credentials, role/experience, skills)
- [x] User login with JWT authentication
- [x] Registered Users section with search, role filter, pagination
- [x] User cards with country flags, expertise badges, specializations

## Prioritized Backlog

### P0 - Critical
- [x] User registration and authentication ✅
- [x] User directory ✅
- [ ] Backend API for projects/equipment CRUD

### P1 - High Priority
- [ ] Real project data from MongoDB
- [ ] Equipment booking system
- [ ] Push notifications

### P2 - Nice to Have
- [ ] Real-time messaging with WebSockets
- [ ] Project bidding system
- [ ] Equipment availability calendar
- [ ] Worker verification badges

## Next Tasks
1. Implement backend endpoints for projects/equipment
2. Add user connection/messaging features
3. Implement equipment booking flow
