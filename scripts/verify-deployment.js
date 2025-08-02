#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Verifies that the DSA Quiz Master deployment is properly configured and working
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 DSA Quiz Master - Deployment Verification\n');

let hasErrors = false;

function checkFile(filePath, description) {
  const fullPath = join(projectRoot, filePath);
  if (existsSync(fullPath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} - NOT FOUND`);
    hasErrors = true;
    return false;
  }
}

function checkFileContent(filePath, searchText, description) {
  const fullPath = join(projectRoot, filePath);
  if (existsSync(fullPath)) {
    const content = readFileSync(fullPath, 'utf8');
    if (content.includes(searchText)) {
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`❌ ${description} - Content not found`);
      hasErrors = true;
      return false;
    }
  } else {
    console.log(`❌ ${description} - File not found: ${filePath}`);
    hasErrors = true;
    return false;
  }
}

// Check GitHub Actions workflow
console.log('📋 Checking GitHub Actions Deployment Configuration:');
checkFile('.github/workflows/deploy.yml', 'GitHub Actions workflow');
checkFileContent('.github/workflows/deploy.yml', 'Deploy to GitHub Pages', 'Workflow name check');
checkFileContent('.github/workflows/deploy.yml', 'actions/deploy-pages@v4', 'Pages deployment action');

console.log('\n📋 Checking Vite Configuration:');
checkFile('vite.config.ts', 'Vite configuration');
checkFileContent('vite.config.ts', "/dsa-quiz-master/", 'GitHub Pages base path');
checkFileContent('vite.config.ts', "process.env.NODE_ENV === 'production'", 'Production base path condition');

console.log('\n📋 Checking Package Configuration:');
checkFile('package.json', 'Package.json');
checkFileContent('package.json', 'john-jepsen.github.io/dsa-quiz-master', 'Homepage URL');
checkFileContent('package.json', 'build:gh-pages', 'GitHub Pages build script');

console.log('\n📋 Checking Build Output:');
checkFile('dist/index.html', 'Built index.html');
checkFile('dist/404.html', 'SPA routing 404.html');
if (existsSync(join(projectRoot, 'dist/index.html'))) {
  checkFileContent('dist/index.html', '/dsa-quiz-master/assets/', 'Asset paths in built HTML');
}

console.log('\n📋 Checking SPA Routing Setup:');
checkFile('404.html', 'Source 404.html for SPA routing');
checkFileContent('404.html', "sessionStorage.redirect = location.href", 'SPA redirect script');
checkFileContent('index.html', 'sessionStorage.redirect', 'SPA redirect handler in main HTML');

console.log('\n📋 Checking Documentation:');
checkFile('docs/deployment.md', 'Deployment documentation');
checkFileContent('docs/deployment.md', 'GitHub Pages', 'GitHub Pages instructions');
checkFileContent('docs/README.md', 'deployment.md', 'Documentation reference');

// Display live URL information
console.log('\n🌐 Live Deployment Information:');
console.log('Live URL: https://john-jepsen.github.io/dsa-quiz-master/');
console.log('Repository: https://github.com/John-Jepsen/dsa-quiz-master');
console.log('Deployment Method: GitHub Actions → GitHub Pages');

// Summary
console.log('\n📊 Deployment Status Summary:');
if (hasErrors) {
  console.log('❌ Deployment verification found issues that need to be resolved.');
  process.exit(1);
} else {
  console.log('✅ All deployment checks passed! The DSA Quiz Master is properly configured for deployment.');
  console.log('\n🎉 Deployment & Hosting Requirements: COMPLETED');
}