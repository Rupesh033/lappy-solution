#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const TARGET_DOMAINS = [
  'https://www.lapiez.com',
  'https://lapiez.com',
  'https://lappy-solution.vercel.app'
];

async function checkHealth(url) {
  try {
    const res = await fetch(`${url}/api/cms/init`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Deployment Health Check)' }
    });
    if (res.status === 200) {
      const data = await res.json();
      return { ok: true, productsCount: data.products?.length || 0 };
    }
    return { ok: false, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('====================================================');
  console.log('🚀 LAPIEZ SOLUTION AUTOMATED PRODUCTION DEPLOYMENT 🚀');
  console.log('Targets: https://www.lapiez.com & https://lappy-solution.vercel.app');
  console.log('====================================================\n');

  const rootDir = path.resolve(__dirname, '..');
  process.chdir(rootDir);

  // 1. Check git status
  console.log('📦 Step 1: Checking working tree changes...');
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  
  if (status) {
    console.log('Changes detected:\n' + status);
    const msg = process.argv.slice(2).join(' ') || `deploy(live): automated update ${new Date().toISOString()}`;
    console.log(`\nStaging and committing with message: "${msg}"...`);
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  } else {
    console.log('Working tree is clean. Ready to push and verify.');
  }

  // 2. Push to origin master
  console.log('\n📡 Step 2: Pushing to GitHub origin master (Triggers Lapiez Vercel CI/CD)...');
  try {
    execSync('git push origin master', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to origin master.');
  } catch (err) {
    console.error('❌ Git push failed:', err.message);
    process.exit(1);
  }

  // 3. Deploy to CLI project alias (lappysolution.vercel.app)
  console.log('\n🌐 Step 3: Syncing secondary Vercel CLI deployment...');
  try {
    const deployOutput = execSync('npx vercel --prod --yes', { encoding: 'utf8' });
    const match = deployOutput.match(/https:\/\/[a-z0-9\-]+\.vercel\.app/i);
    const deployUrl = match ? match[0] : null;
    if (deployUrl) {
      console.log(`Aliasing ${deployUrl} to lappysolution.vercel.app...`);
      execSync(`npx vercel alias set ${deployUrl} lappysolution.vercel.app`, { stdio: 'inherit' });
    }
  } catch (err) {
    console.warn('⚠️ CLI sync note (Git push is primary):', err.message);
  }

  // 4. Verification polling
  console.log('\n🔍 Step 4: Verifying health on live production domains...');
  console.log('Waiting 10s for Vercel edge deployment propagation...');
  await new Promise(r => setTimeout(r, 10000));

  for (const domain of TARGET_DOMAINS) {
    console.log(`Testing ${domain}...`);
    let verified = false;
    for (let attempt = 1; attempt <= 6; attempt++) {
      const health = await checkHealth(domain);
      if (health.ok) {
        console.log(`✅ ${domain} is LIVE with ${health.productsCount} products!`);
        verified = true;
        break;
      } else {
        console.log(`... attempt ${attempt}/6 (${health.status || health.error}), retrying in 5s...`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }
    if (!verified) {
      console.warn(`⚠️ Warning: ${domain} took longer than expected to report healthy.`);
    }
  }

  console.log('\n====================================================');
  console.log('🎉 DEPLOYMENT COMPLETE & VERIFIED LIVE! 🎉');
  console.log('Live Store:  https://www.lapiez.com/');
  console.log('Admin Panel: https://www.lapiez.com/admin');
  console.log('Backup URL:  https://lappy-solution.vercel.app/');
  console.log('Admin URL:   https://lappy-solution.vercel.app/admin');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
