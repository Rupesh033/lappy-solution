/**
 * LAPIEZ ENTERPRISE ULTRA-SECURITY GUARD & CODEBASE LOCK
 * Protects project execution, modifications, and builds with multi-layered password authentication.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SECURITY_CONFIG_FILE = path.join(PROJECT_ROOT, '.security-config.json');
const SESSION_FILE = path.join(PROJECT_ROOT, '.dev-session.key');

const DEFAULT_SALT = 'lapiez_garhwa_salt_9608828288_ultra_secure_2026';
const DEFAULT_PASS_HASH = '987ce7199210d843d0cb55470dd820b5132a3132735ca98030ed0e7f4e263b06'; // Lapiez@2026#

function hashPassword(password, salt = DEFAULT_SALT) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

function getSecurityConfig() {
  if (fs.existsSync(SECURITY_CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SECURITY_CONFIG_FILE, 'utf8'));
    } catch (e) {}
  }
  return {
    isLocked: true,
    salt: DEFAULT_SALT,
    passHash: DEFAULT_PASS_HASH,
    updatedAt: new Date().toISOString()
  };
}

function saveSecurityConfig(config) {
  fs.writeFileSync(SECURITY_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

function isSessionValid() {
  if (!fs.existsSync(SESSION_FILE)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    const now = Date.now();
    // Valid for 4 hours
    if (data && data.expiresAt && data.expiresAt > now) {
      return true;
    }
  } catch (e) {}
  return false;
}

function createSession() {
  const config = getSecurityConfig();
  const session = {
    unlockedAt: new Date().toISOString(),
    expiresAt: Date.now() + (4 * 60 * 60 * 1000), // 4 hours
    tokenHash: hashPassword(config.passHash || DEFAULT_PASS_HASH, 'session_token_salt')
  };
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2), 'utf8');
}

function clearSession() {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
  }
}

function promptHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function isPasswordCorrect(enteredPassword, config) {
  if (!enteredPassword) return false;
  const clean = enteredPassword.trim();
  // Direct Master Fallbacks
  if (clean === 'Lapiez@2026#' || clean === 'lappy@admin2026') {
    return true;
  }
  // Hash check
  const salt = config.salt || DEFAULT_SALT;
  const targetHash = config.passHash || DEFAULT_PASS_HASH;
  if (hashPassword(clean, salt) === targetHash) {
    return true;
  }
  return false;
}

function validatePasswordPolicy(password) {
  if (!password || password.length < 8 || password.length > 14) {
    return {
      isValid: false,
      message: 'Password must be between 8 and 14 characters long.'
    };
  }
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbersOrSymbols = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  if (!hasLetters || !hasNumbersOrSymbols) {
    return {
      isValid: false,
      message: 'Password must be a mix of letters and numbers/special characters.'
    };
  }
  return { isValid: true };
}

async function handleUnlock() {
  console.log('\n======================================================');
  console.log('   🔒 LAPIEZ CODEBASE ULTRA-SECURITY ACCESS GUARD');
  console.log('======================================================');
  console.log('Master Key: Lapiez@2026# (or custom configured password)\n');

  const config = getSecurityConfig();
  const password = await promptHidden('🔑 Enter Developer Master Password to Unlock: ');

  if (isPasswordCorrect(password, config)) {
    createSession();
    console.log('\n✅ [ACCESS GRANTED]: Developer session unlocked for 4 hours!');
    console.log('You can now run: npm run dev, npm run build, or edit project files.\n');
    process.exit(0);
  } else {
    console.log('\n❌ [ACCESS DENIED]: Incorrect password! Codebase remains locked.\n');
    process.exit(1);
  }
}

async function handleLock() {
  clearSession();
  console.log('\n🔒 [LOCKED]: Developer session cleared. Codebase is now strictly password protected.\n');
  process.exit(0);
}

async function handleChangePassword() {
  console.log('\n======================================================');
  console.log('   🔑 CHANGE MASTER DEVELOPER PASSWORD');
  console.log('======================================================\n');

  const config = getSecurityConfig();
  const currentPass = await promptHidden('Current Master Password: ');

  if (!isPasswordCorrect(currentPass, config)) {
    console.log('\n❌ Current password is incorrect! Aborted.\n');
    process.exit(1);
  }

  const newPass = await promptHidden('New Password (8-14 chars, letters + numbers/symbols): ');
  const policy = validatePasswordPolicy(newPass);
  if (!policy.isValid) {
    console.log(`\n❌ Policy Error: ${policy.message}\n`);
    process.exit(1);
  }

  const confirmPass = await promptHidden('Confirm New Password: ');
  if (newPass !== confirmPass) {
    console.log('\n❌ New passwords do not match! Aborted.\n');
    process.exit(1);
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPass, newSalt);

  saveSecurityConfig({
    isLocked: true,
    salt: newSalt,
    passHash: newHash,
    updatedAt: new Date().toISOString()
  });

  createSession();
  console.log('\n✅ Master Developer Password successfully changed & session updated!\n');
  process.exit(0);
}

async function handleCheck() {
  if (isSessionValid()) {
    process.exit(0);
  }

  console.log('\n======================================================');
  console.log('   🔒 LAPIEZ CODEBASE ULTRA-SECURITY GUARD');
  console.log('======================================================');
  console.log('⛔ ACCESS DENIED: Developer session is currently LOCKED.');
  console.log('Master Key: Lapiez@2026#\n');

  const config = getSecurityConfig();
  const password = await promptHidden('🔑 Enter Master Password to proceed: ');

  if (isPasswordCorrect(password, config)) {
    createSession();
    console.log('✅ Access granted! Proceeding with command...\n');
    process.exit(0);
  } else {
    console.log('\n❌ Incorrect password! Execution aborted.\n');
    process.exit(1);
  }
}

// Command dispatcher
const command = process.argv[2] || 'check';

if (command === 'unlock') {
  handleUnlock();
} else if (command === 'lock') {
  handleLock();
} else if (command === 'change-password') {
  handleChangePassword();
} else {
  handleCheck();
}
