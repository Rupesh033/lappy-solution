const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const newPass = 'Lapiez@2026#';
  const hashed = await bcrypt.hash(newPass, 12);
  console.log('New hash generated for', newPass);

  const updated = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: { adminPassword: hashed },
    create: { id: 'default', adminPassword: hashed }
  });

  console.log('Updated DB SiteSettings adminPassword successfully! ID:', updated.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
