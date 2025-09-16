# DSA Quiz Master

DSA Quiz Master is an interactive Data Structures and Algorithms quiz application built with React 19, TypeScript, and Vite. It features multi-topic quizzes, user authentication, progress tracking, and hands-on code practice exercises with IndexedDB for local data persistence.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Build Commands
- Install dependencies: `npm install` -- takes 18 seconds
- Build for production: `npm run build` -- takes 7 seconds. NEVER CANCEL. Set timeout to 30+ seconds
- Start development server: `npm run dev` -- starts immediately on http://localhost:5173
- Preview production build: `npm run preview` -- serves on http://localhost:4173/dsa-quiz-master/
- Lint code: `npm run lint` -- CURRENTLY FAILS due to missing ESLint config file

### Development Workflow
- ALWAYS run `npm install` first in a fresh clone
- Use `npm run dev` for development - server starts in under 1 second
- The app auto-initializes the IndexedDB database on first load
- Build process includes TypeScript compilation + Vite bundling + copying 404.html

### Critical Build Information
- **NEVER CANCEL**: All builds complete in under 10 seconds - extremely fast
- Build output goes to `dist/` directory  
- Production build includes GitHub Pages base path: `/dsa-quiz-master/`
- TypeScript compilation uses `--noCheck` flag for speed

## Validation Requirements

### Manual Testing Scenarios
After making ANY changes, ALWAYS validate by running through these complete scenarios:

1. **Quiz Flow Validation**:
   - Start dev server: `npm run dev`
   - Open http://localhost:5173 in browser
   - Click "Start Learning" on Arrays topic
   - Click "Array Fundamentals" module
   - Answer at least one quiz question and verify explanation appears
   - Check that score updates correctly

2. **Code Practice Validation**:
   - From main page, click "💻 Code Practice (Hands-on)"
   - Click "Start" on any coding exercise
   - Verify code editor loads with starter code
   - Type a few characters to confirm paste is disabled
   - Click "Run Code" to test the execution environment

3. **Database Functionality**:
   - Open browser dev tools console
   - Verify no critical errors (database init messages are normal)
   - Check Database Debug panel shows "Migrated: Yes"
   - Test user creation by interacting with quiz or creating profile

### Browser Testing
- Test in Chrome/Edge (primary target)
- Verify responsive design on mobile viewport
- Check that offline functionality works after first load
- Confirm IndexedDB data persists across browser sessions

## Build and Deployment

### Local Development
- Development server: `npm run dev` (instant startup)
- Hot reload: Changes auto-refresh in browser
- Environment: Development builds include debug tools and console logging

### Production Build
- Command: `npm run build`
- Output: `dist/` directory ready for static hosting
- GitHub Pages: Auto-deploys on push to main branch via `.github/workflows/deploy.yml`
- Build artifacts: 675KB JavaScript, 390KB CSS (with warnings about chunk size - this is normal)

### GitHub Actions Pipeline
- Triggers: Every push to main branch
- Node version: 20
- Build command: `npm run build`
- Deployment: GitHub Pages via actions/deploy-pages@v4
- Environment variables: `VITE_GITHUB_CLIENT_ID` from secrets

## Common Tasks and Troubleshooting

### Linting Issues
- **Problem**: `npm run lint` fails with "ESLint couldn't find an eslint.config.js file"
- **Solution**: ESLint config is missing - this is a known issue, not your responsibility to fix
- **Workaround**: Skip linting validation or manually review code for obvious syntax errors

### Database Issues  
- Database auto-initializes on app load
- Check browser console for initialization messages
- Use `testDatabase()` function in console for debugging
- Database tools available at `window.dbUtils` in development

### Build Warnings
- Large chunk size warnings (500KB+) are normal - application includes many UI components
- TypeScript compilation uses `--noCheck` for speed - type errors may not be caught at build time

## Key Project Structure

### Important Files and Directories
```
src/
├── components/           # React components (Quiz, UserAuth, etc.)
├── services/            # Database, authentication, migration services  
├── lib/                 # Quiz data, exercises, utilities
├── hooks/               # Custom React hooks for database operations
├── scripts/             # Database initialization and testing scripts
└── types/               # TypeScript type definitions

docs/                    # Project documentation
.github/workflows/       # GitHub Actions deployment
package.json             # Dependencies and scripts
vite.config.ts          # Vite configuration with GitHub Pages base path
```

### Core Components
- `App.tsx`: Main application router and state management
- `DatabaseProvider.tsx`: IndexedDB connection and context
- `Quiz.tsx`: Interactive quiz interface with explanations
- `CodePractice.tsx`: Hands-on coding exercises with disabled paste
- `UserAuth.tsx`: GitHub OAuth integration

### Database Schema
- `userProfiles`: User account information
- `userSessions`: Active user sessions  
- `quizProgress`: Completed quiz results
- `quizAttempts`: Individual question attempts

## Development Guidelines

### Making Changes
- ALWAYS test quiz and code practice flows after UI changes
- Run build before committing to catch TypeScript errors
- Test responsive design changes on mobile viewport
- Verify database operations work correctly

### Adding Features
- New quiz questions: Edit files in `src/lib/`
- New components: Add to `src/components/`
- Database changes: Update services in `src/services/`
- New routes: Modify state management in `App.tsx`

### Performance Considerations
- App uses IndexedDB for local storage - no external database required
- Large bundle size is acceptable for this type of educational application
- Code splitting not implemented - all features load upfront for offline usage

## Quick Reference Commands

### Essential Commands
```bash
# Fresh setup
npm install                    # 18 seconds

# Development  
npm run dev                   # Instant start → http://localhost:5173

# Production build
npm run build                 # 7 seconds total

# Testing build
npm run preview              # → http://localhost:4173/dsa-quiz-master/
```

### Repository Information
- Repository: https://github.com/John-Jepsen/dsa-quiz-master
- Live app: https://john-jepsen.github.io/dsa-quiz-master/
- Main branch auto-deploys to GitHub Pages
- No separate staging environment

This is a fully functional educational application with working quiz system, code practice, and local data persistence. All core features are operational and tested.