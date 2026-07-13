#!/usr/bin/env node
/**
 * Re-runs the full Cucumber suite up to RETRIES+1 times until it passes.
 * Usage: npm run test:retry
 */
const { spawnSync } = require('child_process');

const maxAttempts = parseInt(process.env.RETRIES || '2', 10) + 1;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  process.stdout.write(`\n=== Test attempt ${attempt}/${maxAttempts} ===\n\n`);

  const result = spawnSync('npx', ['cucumber-js'], {
    stdio: 'inherit',
    env: process.env,
    shell: true,
  });

  if (result.status === 0) {
    process.exit(0);
  }

  if (attempt < maxAttempts) {
    process.stdout.write('\nRetrying failed suite...\n');
  }
}

process.exit(1);
