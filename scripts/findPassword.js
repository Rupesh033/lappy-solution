const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  const hash = settings?.adminPassword;
  console.log('Database hash:', hash);

  const candidates = [
    'Lapiez@2026#',
    'lapiez@admin2026',
    'Lapiez@admin',
    'admin123',
    'admin',
    'lapiez',
    'Lapiez',
    'Lapiez@123',
    'lappysolution',
    '9608828288',
    'Lapiez@9608',
    'Lapiez2026',
    'admin@lapiez',
    'admin@2026',
    'admin@123',
    'lapiez2026',
    'lapiez@2026',
    'lapiez@2024',
    'Lapiez_@2824',
    'Lapiez@2824'
  ];

  for (const c of candidates) {
    if (bcrypt.compareSync(c, hash)) {
      console.log('MATCH FOUND! The admin password is:', c);
      return;
    }
  }
  console.log('No match found in common candidate list.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
