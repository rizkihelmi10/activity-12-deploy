#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');

// NOTE: With Vercel, frontend and backend deploy together.
// Vercel handles both static files AND serverless functions (API routes)
// from a single project. No separate backend deployment needed!

console.log(chalk.blue('Quest Tracker Backend Deployment'));
console.log(chalk.gray('================================================'));
console.log('');
console.log(chalk.green('With Vercel, your backend deploys automatically!'));
console.log('');
console.log(chalk.gray('How it works:'));
console.log(chalk.gray('  1. Your Express server is in frontend/server.js'));
console.log(chalk.gray('  2. api/index.js exports it as a Vercel serverless function'));
console.log(chalk.gray('  3. vercel.json routes all requests to it'));
console.log(chalk.gray('  4. When you deploy, both frontend and backend go live together'));
console.log('');
console.log(chalk.yellow('To deploy everything:'));
console.log(chalk.white('  npm run deploy'));
console.log('');
console.log(chalk.yellow('Or deploy via the Vercel dashboard:'));
console.log(chalk.white('  1. Go to https://vercel.com/new'));
console.log(chalk.white('  2. Import your GitHub repository'));
console.log(chalk.white('  3. Click Deploy'));

// =============================================================================
// TODO 2: Build Process Setup (Medium)
// =============================================================================
// OBJECTIVE: Add pre-deployment checks
//
// WHAT TO DO:
// 1. Check that all required files exist (package.json, vercel.json, api/index.js)
// 2. Verify Node.js version is 18+
// 3. Run a basic syntax check on server.js
//
// SUCCESS CRITERIA:
// - Script checks for required files before suggesting deployment
// - Node.js version is validated
// - Clear error messages if something is missing
//
// HINT: Use fs.existsSync() to check files
// HINT: Use process.version to check Node.js version
// =============================================================================
