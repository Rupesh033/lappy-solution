const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const lines = envFile.split('\n');

const envs = {};
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  let val = trimmed.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  envs[key] = val;
}

console.log('Target keys to add:', Object.keys(envs));

for (const [key, val] of Object.entries(envs)) {
  for (const env of ['production', 'development']) {
    try {
      console.log(`Setting ${key} on ${env}...`);
      execSync(`npx vercel env add ${key} ${env} --force --yes`, {
        input: val,
        stdio: ['pipe', 'inherit', 'inherit']
      });
    } catch (e) {
      console.error(`Failed on ${key} (${env}):`, e.message);
    }
  }
}
console.log('Done adding production and development environment variables!');
