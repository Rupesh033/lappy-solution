const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Complete Catalog & Settings Seeding ---');

  // 1. SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Lapiez',
      tagline: 'Technology • Security • Solutions',
      logo: '/images/logo.png',
      favicon: '/favicon.ico',
      phone: '+91 9608828288',
      whatsapp: '919608828288',
      email: 'lappysolution2018@gmail.com',
      address: 'In front of G P Plaza, Chiniya Road, Garhwa, Jharkhand - 822114',
      timings: 'Monday - Saturday: 10:00 AM - 8:30 PM',
      announcementText: '100% Asli Samaan • 18% GST Bill • Garhwa & Palamu Delivery',
      maintenanceMode: false
    }
  });
  console.log('✅ SiteSettings seeded.');

  // 2. ThemeSettings
  await prisma.themeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#1A56DB',
      secondaryColor: '#FB641B',
      dealColor: '#15803D',
      canvasBg: '#F1F3F6',
      fontFamily: 'Plus Jakarta Sans',
      borderRadius: '12px'
    }
  });
  console.log('✅ ThemeSettings seeded.');

  // 3. PaymentSettings
  await prisma.paymentSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      upiId: '9608828288@okbizaxis',
      upiName: 'LAPIEZ GARHWA',
      codEnabled: true,
      gstRate: 18,
      gstin: '20AABCL1234F1Z5'
    }
  });
  console.log('✅ PaymentSettings seeded.');

  // 4. Products from frontechProducts.json
  const frontechPath = path.join(__dirname, '..', 'data', 'frontechProducts.json');
  if (fs.existsSync(frontechPath)) {
    const products = JSON.parse(fs.readFileSync(frontechPath, 'utf8'));
    console.log(`Seeding ${products.length} products into Supabase...`);
    let count = 0;
    for (const p of products) {
      const slug = (p.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + (p.sku || Math.floor(Math.random() * 100000));

      await prisma.product.upsert({
        where: { sku: p.sku || `LS-${p.id}` },
        update: {
          name: p.name,
          category: p.category || 'Accessories',
          brand: p.brand || 'Frontech',
          price: Number(p.price) || 999,
          mrp: Number(p.mrp) || Number(p.price) || 1499,
          discount: Number(p.discount) || 0,
          specs: p.specs || '',
          description: p.description || '',
          image: p.image || (p.images && p.images[0]) || '/images/placeholder.png',
          inStock: p.inStock ?? true,
          stockQuantity: Number(p.stockQuantity) || 10,
          rating: Number(p.rating) || 4.5,
          featured: p.featured ?? false,
          status: 'active'
        },
        create: {
          name: p.name,
          slug,
          category: p.category || 'Accessories',
          brand: p.brand || 'Frontech',
          price: Number(p.price) || 999,
          mrp: Number(p.mrp) || Number(p.price) || 1499,
          discount: Number(p.discount) || 0,
          specs: p.specs || '',
          description: p.description || '',
          image: p.image || (p.images && p.images[0]) || '/images/placeholder.png',
          inStock: p.inStock ?? true,
          stockQuantity: Number(p.stockQuantity) || 10,
          sku: p.sku || `LS-${p.id}`,
          rating: Number(p.rating) || 4.5,
          featured: p.featured ?? false,
          status: 'active'
        }
      });
      count++;
    }
    console.log(`✅ ${count} Products seeded successfully.`);
  }

  // 5. Initial Orders
  const initialOrders = [
    {
      orderId: 'LS-10248',
      customerName: 'Rahul Kumar',
      phone: '+91 94311 28941',
      email: 'rahul.k.garhwa@gmail.com',
      address: 'Near Gandhi Maidan, Chiniya Road, Garhwa - 822114',
      itemsJson: JSON.stringify([{ id: 'prod-flagship-1', name: 'HP 15s Intel Core i5 12th Gen', quantity: 1, price: 52999 }]),
      totalAmount: 52999,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Packed',
      date: '2026-10-05'
    },
    {
      orderId: 'LS-10247',
      customerName: 'Amit Verma',
      phone: '+91 97092 11442',
      email: 'amit.verma@gmail.com',
      address: 'Station Road, Garhwa - 822114',
      itemsJson: JSON.stringify([{ id: 'prod-flagship-7', name: 'CP-PLUS 4-Camera 5MP Full HD Security System Kit', quantity: 1, price: 18499 }]),
      totalAmount: 18499,
      paymentMethod: 'Cash on Delivery (Store Pickup)',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      date: '2026-10-05'
    },
    {
      orderId: 'LS-10246',
      customerName: 'Pankaj Mishra',
      phone: '+91 99345 67890',
      email: 'pankaj.m@yahoo.com',
      address: 'Hospital Road, Garhwa - 822114',
      itemsJson: JSON.stringify([
        { id: 'prod-flagship-9', name: 'Epson EcoTank L3210 All-in-One Printer', quantity: 1, price: 12999 },
        { id: 'prod-33095033', name: 'Epson Ink 003 Black Color', quantity: 2, price: 320 }
      ]),
      totalAmount: 13639,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      date: '2026-10-04'
    }
  ];

  for (const o of initialOrders) {
    await prisma.order.upsert({
      where: { orderId: o.orderId },
      update: {},
      create: o
    });
  }
  console.log('✅ Initial Orders seeded.');

  console.log('--- All Seeding Complete! ---');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
