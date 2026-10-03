#!/usr/bin/env node

const chalk = require('chalk');
const fetch = require('node-fetch');

console.log(chalk.blue('Quest Tracker Health Check'));
console.log(chalk.gray('============================'));

class HealthChecker {
  constructor() {
    this.appUrl = process.env.APP_URL || 'https://your-app.vercel.app';
    this.apiKey = process.env.API_KEY || 'demo_key_12345';
  }

  async checkFrontend() {
    console.log(chalk.yellow('\nChecking Frontend...'));

    try {
      const startTime = Date.now();
      const response = await fetch(this.appUrl, { timeout: 10000 });
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        console.log(chalk.green('  Frontend is accessible'));
        console.log(chalk.gray(`  Status: ${response.status}`));
        console.log(chalk.gray(`  Response time: ${responseTime}ms`));
        console.log(chalk.gray(`  URL: ${this.appUrl}`));
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(chalk.red('  Frontend check failed'));
      console.log(chalk.red(`  Error: ${error.message}`));
      return false;
    }
  }

  async checkAPIHealth() {
    console.log(chalk.yellow('\nChecking API Health...'));

    try {
      const startTime = Date.now();
      const response = await fetch(`${this.appUrl}/health`, { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.status === 'healthy') {
        console.log(chalk.green('  API is healthy'));
        console.log(chalk.gray(`  Response time: ${responseTime}ms`));
        return true;
      } else {
        throw new Error(`Health check failed: ${data.status || 'unknown'}`);
      }
    } catch (error) {
      console.log(chalk.red('  API health check failed'));
      console.log(chalk.red(`  Error: ${error.message}`));
      return false;
    }
  }

  async checkAPIEndpoints() {
    console.log(chalk.yellow('\nChecking API Endpoints...'));

    const endpoints = [
      { path: '/api/quests', description: 'Quest list' },
      { path: '/api/quests/1', description: 'Quest details' },
      { path: '/api/players/alex', description: 'Player profile' },
      { path: '/api/categories', description: 'Categories list' }
    ];

    let passedCount = 0;

    for (const endpoint of endpoints) {
      try {
        const url = `${this.appUrl}${endpoint.path}?api_key=${this.apiKey}`;
        const startTime = Date.now();
        const response = await fetch(url, { method: 'GET', timeout: 10000 });
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          console.log(chalk.green(`  ${endpoint.description} (${responseTime}ms)`));
          passedCount++;
        } else {
          console.log(chalk.red(`  ${endpoint.description}: ${response.status}`));
        }
      } catch (error) {
        console.log(chalk.red(`  ${endpoint.description}: ${error.message}`));
      }
    }

    const success = passedCount === endpoints.length;
    if (success) {
      console.log(chalk.green(`All ${endpoints.length} API endpoints working`));
    } else {
      console.log(chalk.red(`${endpoints.length - passedCount}/${endpoints.length} endpoints failed`));
    }

    return success;
  }

  // =============================================================================
  // TODO 4: Error Monitoring Setup (Hard)
  // =============================================================================
  // OBJECTIVE: Add error tracking and performance monitoring
  //
  // WHAT TO DO:
  // 1. Add a checkPerformance() method that measures response times
  // 2. Track if any response takes longer than 2 seconds
  // 3. Log results to a health-history.json file
  //
  // SUCCESS CRITERIA:
  // - Performance check runs after endpoint checks
  // - Slow responses (> 2s) trigger a warning
  // - Results are saved to health-history.json
  //
  // HINT: Use Date.now() for timing, fs.writeFileSync() for saving
  // =============================================================================

  async runAllChecks() {
    console.log(chalk.white('\nRunning health checks...\n'));

    const results = {
      frontend: await this.checkFrontend(),
      apiHealth: await this.checkAPIHealth(),
      apiEndpoints: await this.checkAPIEndpoints()
    };

    const totalChecks = Object.keys(results).length;
    const passedChecks = Object.values(results).filter(Boolean).length;

    console.log(chalk.blue('\nHealth Check Summary'));
    console.log(chalk.gray('========================'));

    Object.entries(results).forEach(([check, passed]) => {
      const icon = passed ? 'PASS' : 'FAIL';
      const color = passed ? chalk.green : chalk.red;
      console.log(color(`${icon} - ${check}`));
    });

    console.log(chalk.blue(`\nScore: ${passedChecks}/${totalChecks} checks passed`));

    if (passedChecks === totalChecks) {
      console.log(chalk.green('All systems working! Your app is ready.'));
      return true;
    } else {
      console.log(chalk.red('Some issues found. Review the failed checks above.'));
      return false;
    }
  }
}

async function main() {
  const checker = new HealthChecker();

  // Allow overriding URL via command line
  if (process.argv[2]) checker.appUrl = process.argv[2];

  const success = await checker.runAllChecks();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Health check failed:', error));
    process.exit(1);
  });
}

module.exports = { HealthChecker };
