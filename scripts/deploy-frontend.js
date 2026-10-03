#!/usr/bin/env node

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');

// CONCEPT: Platform-as-a-Service (PaaS) Deployment
// Vercel handles building, hosting, and scaling for you.
// You push code to GitHub, and Vercel deploys automatically.
// This script is an alternative to the Vercel dashboard UI.

console.log(chalk.blue('Quest Tracker Deployment Script'));
console.log(chalk.gray('================================================'));

async function deploy() {
  try {
    // Step 1: Check prerequisites
    console.log(chalk.yellow('\nStep 1: Checking prerequisites...'));

    if (!fs.existsSync('vercel.json')) {
      throw new Error('vercel.json not found. Run this script from the project root.');
    }

    // Check if Vercel CLI is available
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log(chalk.green('Vercel CLI found'));
    } catch (error) {
      console.log(chalk.red('Vercel CLI not found'));
      console.log(chalk.gray('Install it with: npm install -g vercel'));
      console.log(chalk.gray(''));
      console.log(chalk.blue('Or deploy without CLI:'));
      console.log(chalk.gray('1. Go to https://vercel.com/new'));
      console.log(chalk.gray('2. Import your GitHub repository'));
      console.log(chalk.gray('3. Click Deploy'));
      return;
    }

    // =============================================================================
    // TODO 3: Deployment Script Creation (Medium)
    // =============================================================================
    // OBJECTIVE: Add deployment safety checks before deploying
    //
    // WHAT TO DO:
    // 1. Before deploying, log the current git commit hash and branch
    // 2. Check if there are uncommitted changes (warn if yes)
    // 3. After deploying, verify the site is accessible
    //
    // SUCCESS CRITERIA:
    // - Git commit hash is logged before deploy
    // - Warning shows if there are uncommitted changes
    // - Post-deploy check confirms site loads
    //
    // HINT: Use execSync('git rev-parse HEAD') for commit hash
    // HINT: Use execSync('git status --porcelain') to check for changes
    // =============================================================================

    // Step 2: Deploy to Vercel
    console.log(chalk.yellow('\nStep 2: Deploying to Vercel...'));

    try {
      execSync('vercel --prod --yes', { stdio: 'inherit' });
      console.log(chalk.green('Deployed to Vercel successfully!'));
    } catch (error) {
      console.log(chalk.red('Deployment failed'));
      console.log(chalk.gray('Check the error above, or deploy manually at vercel.com'));
      return;
    }

    // Step 3: Done
    console.log(chalk.green('\nDeployment complete!'));
    console.log(chalk.gray('================================================'));
    console.log(chalk.gray('Your app is live on Vercel.'));
    console.log(chalk.gray('Check your Vercel dashboard for the URL.'));

  } catch (error) {
    console.log(chalk.red('\nDeployment failed:'));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

if (require.main === module) {
  deploy();
}

module.exports = { deploy };
