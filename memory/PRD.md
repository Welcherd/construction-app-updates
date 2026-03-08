# ConstructionConnection App - PRD

## Original Problem Statement
Merge a 3D global background with the ConstructionConnection app from GitHub repository (https://github.com/Welcherd/construction-app-updates), integrating Google Maps API for project/equipment locations with satellite view.

## Architecture
- **Frontend**: React 18 with Tailwind CSS, @vis.gl/react-google-maps
- **Backend**: FastAPI with MongoDB
- **Styling**: Glass-morphism, dark theme, CSS animations for 3D globe

## User Personas
1. **Construction Workers** - Browse jobs, connect with peers globally
2. **Equipment Owners** - List equipment for rent
3. **Project Managers** - Track projects, hire workers
4. **General Contractors** - Find equipment and subcontractors

## Core Requirements (Static)
- [x] 3D animated globe background
- [x] Desktop landing page (Hero, Stats, Map, Projects, Services, Contact)
- [x] Mobile app with 5 tabs (Home, Equipment, Projects, Messages, Profile)
- [x] Google Maps integration with project/equipment markers
- [x] Responsive design (mobile < 768px)
- [x] Dark/light theme support

## What's Been Implemented (Jan 2026)
- [x] CSS-based 3D Earth animation with stars and orbital effects
- [x] Interactive Google Maps placeholder (awaiting API key)
- [x] Desktop landing page sections
- [x] Mobile app with tabbed navigation
- [x] Social feed with global posts
- [x] Equipment rental listings with filters
- [x] Project cards with progress tracking
- [x] Messaging interface
- [x] User profile with settings

## Prioritized Backlog

### P0 - Critical
- [ ] Connect Google Maps API key
- [ ] Backend API for projects/equipment CRUD
- [ ] User authentication

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
1. User provides Google Maps API key
2. Implement backend endpoints for projects/equipment
3. Add user authentication (JWT or Google OAuth)
4. Connect frontend to real backend data
