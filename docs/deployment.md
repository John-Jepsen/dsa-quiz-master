# Deployment Guide

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Steps
1. **Update Repository Name**
   - In `vite.config.ts`, set the `base` to your repo name:
     ```typescript
     base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
     ```
2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy DSA Quiz Master"
   git push origin main
   ```
3. **Enable GitHub Pages**
   - Go to your repo → Settings → Pages
   - Source: "GitHub Actions"
   - Wait 2-3 minutes for deployment

### Live App
Your app will be available at: `https://yourusername.github.io/repository-name/`

### Troubleshooting
- **Build fails**: Check the Actions tab for logs
- **App not loading**: Verify the base path in `vite.config.ts`
- **Assets missing**: Ensure all imports use correct paths

### Alternative Hosting
- GitHub Pages (primary deployment method)
- Static hosting platforms like Surge.sh or similar

*Auto-deploys on every push to main branch* 🔄
