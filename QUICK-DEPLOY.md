# Quick Deploy Guide 🚀

## Deploy Your DSA Quiz Master in 3 Steps

### 1. Update Repository Name
Edit `vite.config.ts` line 28:
```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```
Replace `YOUR-REPO-NAME` with your actual GitHub repository name.

### 2. Push to GitHub
```bash
git add .
git commit -m "Deploy DSA Quiz Master"
git push origin main
```

### 3. Enable GitHub Pages
1. Go to your repo → Settings → Pages
2. Source: "GitHub Actions"
3. Wait 2-3 minutes for deployment

## Your Live App
✅ Will be available at: `https://yourusername.github.io/repository-name/`

## Features Working Online:
- ✅ User registration & login
- ✅ Quiz topics & questions  
- ✅ Progress tracking
- ✅ Leaderboard
- ✅ Profile management
- ✅ Local data persistence

## Sharing with Friends:
Send them the GitHub Pages URL - they can register and compete on the leaderboard!

---
*Auto-deploys on every push to main branch* 🔄