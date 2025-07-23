# Deployment Guide

## GitHub Pages Deployment

Your DSA Quiz Master app is now configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Steps

1. **Push to GitHub Repository**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy on pushes to main/master branch

3. **Update Repository Name in Vite Config**
   - Open `vite.config.ts`
   - Change `/spark-template/` to `/your-repository-name/` in the base path
   - Or set the `GITHUB_REPOSITORY` environment variable

### Deployment Process

- **Automatic**: Every push to main/master triggers deployment
- **Build Time**: ~2-3 minutes
- **URL**: `https://yourusername.github.io/repository-name/`

### Configuration Details

The deployment includes:
- ✅ Node.js 18 build environment
- ✅ NPM dependency caching
- ✅ TypeScript compilation
- ✅ Vite production build
- ✅ GitHub Pages artifact upload
- ✅ Automatic deployment

### Troubleshooting

**Build Fails**: Check the Actions tab for error logs
**App Not Loading**: Verify the base path in vite.config.ts matches your repo name
**Assets Missing**: Ensure all imports use proper paths with @ alias

### Alternative Hosting Options

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import project from GitHub with zero config
- **Firebase Hosting**: Use `firebase deploy` after building

Your app will be live at: `https://yourusername.github.io/repository-name/`