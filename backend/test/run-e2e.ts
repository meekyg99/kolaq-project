#!/usr/bin/env ts-node
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  suite: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const testSuites = [
  'auth.e2e-spec.ts',
  'catalog.e2e-spec.ts',
  'cart-checkout.e2e-spec.ts',
  'orders.e2e-spec.ts',
  'admin.e2e-spec.ts',
];

async function runTest(suite: string): Promise<TestResult> {
  const startTime = Date.now();
  console.log(`\n🧪 Running ${suite}...`);

  try {
    const { stdout, stderr } = await execAsync(
      `npx jest --config ./test/jest-e2e.json test/${suite} --runInBand --forceExit`,
      { cwd: __dirname + '/..' }
    );

    console.log(stdout);
    if (stderr) console.error(stderr);

    return {
      suite,
      passed: true,
      duration: Date.now() - startTime,
    };
  } catch (error: any) {
    console.error(`❌ ${suite} failed:`);
    console.error(error.stdout || error.message);

    return {
      suite,
      passed: false,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

async function main() {
  console.log('🚀 Starting E2E Test Suite\n');
  console.log('Testing against:', process.env.DATABASE_URL ? 'Database' : 'No DB URL set');
  console.log('===================================\n');

  const results: TestResult[] = [];

  for (const suite of testSuites) {
    const result = await runTest(suite);
    results.push(result);
  }

  console.log('\n\n📊 Test Summary');
  console.log('===================================');

  let passed = 0;
  let failed = 0;

  results.forEach((result) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const duration = (result.duration / 1000).toFixed(2);
    console.log(`${status} ${result.suite} (${duration}s)`);

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('\n-----------------------------------');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('===================================\n');

  if (failed > 0) {
    console.error('❌ Some tests failed. Please review the output above.');
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
