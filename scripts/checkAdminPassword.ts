import { prisma } from '../lib/prisma';

async function main() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' }
  });
  console.log('SiteSettings in DB:', {
    id: settings?.id,
    adminPassword: settings?.adminPassword,
    siteName: settings?.siteName
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
