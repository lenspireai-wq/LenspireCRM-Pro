const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'cloudflare-worker');
const recordsDir = path.join(root, 'release-records');
const checkOnly = process.argv.includes('--check-only');
const localOnly = process.argv.includes('--local-only');
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function run(executable, args, options = {}) {
  const isWindowsCommand = process.platform === 'win32' && /\.cmd$/i.test(executable);
  const resolvedExecutable = isWindowsCommand ? (process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe') : executable;
  const resolvedArgs = isWindowsCommand ? ['/d', '/s', '/c', executable, ...args] : args;
  const result = spawnSync(resolvedExecutable, resolvedArgs, {
    cwd: options.cwd || root,
    env: process.env,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit'
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = options.capture ? String(result.stderr || result.stdout || '').trim() : '';
    throw new Error(`${executable} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return String(result.stdout || '');
}

function deployments() {
  const output = run(command, ['wrangler', 'deployments', 'list', '--name', 'lenspirecrm-api', '--json'], { cwd: workerDir, capture: true });
  const start = output.indexOf('['), end = output.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('Wrangler did not return deployment JSON.');
  return JSON.parse(output.slice(start, end + 1)).sort((a, b) => String(a.created_on).localeCompare(String(b.created_on)));
}

function activeVersion(items) {
  const latest = items.at(-1);
  const active = latest?.versions?.find(item => Number(item.percentage) === 100) || latest?.versions?.[0];
  if (!active?.version_id) throw new Error('Could not determine the active Worker version.');
  return active.version_id;
}

function sourceDigest() {
  const hash = crypto.createHash('sha256');
  for (const relative of ['index.js', 'cloudflare-worker/index.js', 'cloudflare-worker/desktop-bundle.generated.js', 'cloudflare-worker/wrangler.toml']) {
    hash.update(relative); hash.update('\0'); hash.update(fs.readFileSync(path.join(root, relative))); hash.update('\0');
  }
  return hash.digest('hex');
}

function schemaVersion() {
  const source = fs.readFileSync(path.join(root, 'index.js'), 'utf8');
  return Number(source.match(/const CLOUD_SCHEMA_VERSION = (\d+)/)?.[1] || 0);
}

function recordRelease(record) {
  fs.mkdirSync(recordsDir, { recursive: true });
  const stamp = record.startedAt.replace(/[:.]/g, '-');
  const file = path.join(recordsDir, `${stamp}-${record.status}.json`);
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
  return file;
}

(async () => {
  const startedAt = new Date().toISOString();
  const previousVersion = activeVersion(deployments());
  const record = {
    kind: 'lenspirecrm-production-release',
    startedAt,
    completedAt: null,
    status: localOnly ? 'local-only' : checkOnly ? 'check-only' : 'running',
    worker: 'lenspirecrm-api',
    schemaVersion: schemaVersion(),
    sourceSha256: sourceDigest(),
    previousVersion,
    deployedVersion: null,
    checks: { build: false, tests: false, preDeploySmoke: false, postDeploySmoke: false },
    rollbackCommand: null
  };
  try {
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build:web']);
    record.checks.build = true;
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['test']);
    record.checks.tests = true;
    if (localOnly) {
      record.status = 'local-only-passed';
      record.completedAt = new Date().toISOString();
      const file = recordRelease(record);
      console.log(`release-local-check\tok=true\tactive=${previousVersion}\trecord=${file}`);
      return;
    }
    if (checkOnly) {
      run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'smoke:production']);
      record.checks.preDeploySmoke = true;
      record.status = 'check-only-passed';
      record.completedAt = new Date().toISOString();
      const file = recordRelease(record);
      console.log(`release-check\tok=true\tactive=${previousVersion}\trecord=${file}`);
      return;
    }
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'smoke:production']);
    record.checks.preDeploySmoke = true;
    const deployOutput = run(command, ['wrangler', 'deploy'], { cwd: workerDir, capture: true });
    process.stdout.write(deployOutput);
    record.deployedVersion = deployOutput.match(/Current Version ID:\s*([0-9a-f-]{36})/i)?.[1] || activeVersion(deployments());
    record.rollbackCommand = `npx wrangler rollback ${previousVersion} --name lenspirecrm-api --message "Rollback ${record.deployedVersion}"`;
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'smoke:production']);
    record.checks.postDeploySmoke = true;
    record.status = 'passed';
    record.completedAt = new Date().toISOString();
    const file = recordRelease(record);
    console.log(`release\tok=true\tversion=${record.deployedVersion}\trecord=${file}`);
  } catch (error) {
    record.status = 'failed';
    record.completedAt = new Date().toISOString();
    if (record.deployedVersion && !record.rollbackCommand) record.rollbackCommand = `npx wrangler rollback ${previousVersion} --name lenspirecrm-api --message "Rollback ${record.deployedVersion}"`;
    const file = recordRelease(record);
    console.error(error.message);
    console.error(`Release stopped. Evidence: ${file}`);
    if (record.rollbackCommand) console.error(`Review production, then roll back manually if required: ${record.rollbackCommand}`);
    process.exitCode = 1;
  }
})();
