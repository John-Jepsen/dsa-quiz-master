# GitHub OAuth & Actions Guide

## GitHub OAuth Authentication
- Register a GitHub OAuth App (Settings → Developer settings → OAuth Apps)
- Set callback URL: `https://yourusername.github.io/dsa-quiz-master/auth/callback`
- Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` as repository secrets

## GitHub Actions Deployment
- Uses GitHub Actions for CI/CD and secure secret management
- Workflow auto-deploys to GitHub Pages on push to main
- Environment variables are set via repository secrets

## References
- See `.github/workflows/deploy.yml` for workflow config
- See `src/services/githubAuth.ts` for OAuth logic

For full details, see the original `github-actions-react-auth.md` or this summary for most contributors.
