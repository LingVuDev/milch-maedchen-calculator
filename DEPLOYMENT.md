# GitHub Pages Deployment Guide

## Quick Setup Instructions

### 1. Repository Setup

1. Create a new repository on GitHub with the name `milch-maedchen-calculator` (or your preferred name)
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/milch-maedchen-calculator.git
   git push -u origin main
   ```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy on the next push to main

### 3. Configure Repository Name (if needed)

If your repository name is different from `milch-maedchen-calculator`, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/your-actual-repo-name',
  assetPrefix: '/your-actual-repo-name/',
};
```

### 4. Deployment

**Automatic**: Push to main branch and GitHub Actions will deploy automatically

**Manual**: Run `npm run deploy` (requires gh-pages package)

### 5. Access Your Site

Your site will be available at:
`https://yourusername.github.io/milch-maedchen-calculator/`

## Troubleshooting

### Common Issues

1. **404 Error**: Check basePath configuration in `next.config.ts`
2. **Assets not loading**: Verify assetPrefix matches your repository name
3. **Build fails**: Check that all dependencies are in package.json, not just devDependencies

### Build Locally First

Always test the build locally before deploying:
```bash
npm run build
```

### Force Deployment

If you need to force redeploy, make a small change and push, or manually trigger the GitHub Action.

## Files Created/Modified for GitHub Pages

- `next.config.ts` - Static export configuration
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `package.json` - Added deploy scripts
- `README.md` - Updated with deployment instructions

The application is now ready for GitHub Pages deployment! 🚀