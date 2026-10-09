import { PrismaClient } from '@prisma/client';
import { PRODUCTS } from '../data/products';
import { STORE_INFO, INITIAL_ORDERS } from '../data/storeData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Lapiez CMS Database Seeding...');

  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: STORE_INFO.name,
      tagline: STORE_INFO.tagline,
      phone: STORE_INFO.phone,
      whatsapp: STORE_INFO.whatsapp,
      email: STORE_INFO.email,
      address: `${STORE_INFO.address}, ${STORE_INFO.city}, ${STORE_INFO.state} - ${STORE_INFO.pincode}`,
      timings: STORE_INFO.timings,
      announcementText: '100% Asli Samaan • 18% GST Bill • Garhwa & Palamu Delivery',
      maintenanceMode: false
    }
  });
  console.log('✅ Site Settings seeded.');

  // 2. Theme Settings
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
  console.log('✅ Theme Settings seeded.');

  // 3. Payment Settings
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
  console.log('✅ Payment Settings seeded.');

  // 4. Menus
  const menuCount = await prisma.menu.count();
  if (menuCount === 0) {
    const defaultMenus = [
      { title: 'All Categories', url: '/shop', position: 1 },
      { title: 'Laptops', url: '/shop?cat=Laptops', position: 2, isHot: true },
      { title: 'Desktops & Rigs', url: '/shop?cat=Computers', position: 3 },
      { title: 'CCTV Security', url: '/shop?cat=CCTV%20%26%20Security', position: 4 },
      { title: 'Laptop Spares', url: '/shop?cat=Accessories', position: 5 },
      { title: 'SSDs & RAM', url: '/shop?cat=Storage%20%26%20Parts', position: 6 },
      { title: 'Printers', url: '/shop?cat=Printers', position: 7 },
      { title: 'Festival Deals 🔥', url: '/shop?search=Deal', position: 8, isSpecial: true }
    ];

    for (const m of defaultMenus) {
      await prisma.menu.create({ data: m });
    }
    console.log('✅ Navigation Menus seeded.');
  }

  // 5. Banners
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    const banners = [
      {
        title: 'Upgrade to 12th & 13th Gen Laptops',
        titleHighlight: 'Save Up to 45% + 18% GST Bill',
        subtitle: 'HP 15s, Dell Inspiron, Lenovo ThinkPad & ASUS in stock with 16GB RAM + 512GB SSD. Ready for immediate counter pickup or same-day delivery.',
        badge: 'FESTIVAL DHAMAKA SALE • GARHWA SHOWROOM',
        desktopImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        buttonText: 'Shop Laptop Deals',
        buttonUrl: '/shop?cat=Laptops',
        whatsappMsg: 'Hello Lapiez Garhwa, I want to inquire about festival laptop offers and pricing.',
        bgGradient: 'from-[#0A1633] via-[#0F2960] to-[#1A56DB]',
        position: 1
      },
      {
        title: 'CP-PLUS 4-Camera 5MP Night-Vision Kit',
        titleHighlight: 'Full Color 24/7 Security @ ₹18,499',
        subtitle: 'Complete package with 4x 5MP cameras, 4-Channel AI DVR, 1TB Seagate Purple HDD, power supply & mobile live view app anywhere in the world.',
        badge: 'HOME & BUSINESS SECURITY SPECIAL',
        desktopImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
        buttonText: 'View CCTV Packages',
        buttonUrl: '/shop?cat=CCTV%20%26%20Security',
        whatsappMsg: 'Hello Lapiez Garhwa, I want a quote for 4-camera CP-PLUS CCTV security kit.',
        bgGradient: 'from-[#03241C] via-[#064E3B] to-[#047857]',
        position: 2
      },
      {
        title: 'Intel Core i5/i7 + RTX Graphics Workstations',
        titleHighlight: 'Zero Bottleneck • Towers from ₹38,999',
        subtitle: 'Engineered for 4K video rendering, AutoCAD, 3D animations, and high-FPS gaming. Tested on counter with live temperature & benchmark reports.',
        badge: 'CUSTOM WORKSTATIONS • BUILT & TESTED IN GARHWA',
        desktopImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
        buttonText: 'Explore Custom PCs',
        buttonUrl: '/shop?cat=Computers',
        whatsappMsg: 'Hello Lapiez Garhwa, I want to configure a custom PC for video editing / gaming.',
        bgGradient: 'from-[#171033] via-[#2E1065] to-[#4338CA]',
        position: 3
      },
      {
        title: 'Crucial & Kingston NVMe SSDs & Laptop Spares',
        titleHighlight: 'Genuine Adapters, Batteries & SSDs from ₹499',
        subtitle: 'Revive your slow laptop! Crucial, Kingston & WD NVMe M.2 SSDs starting at ₹1,299 with free showroom fitting and OS migration at our Chiniya Road lab.',
        badge: 'INSTANT 10X SPEED BOOST • FREE SHOWROOM FITTING',
        desktopImage: '/images/categories/laptop-ssd.png',
        buttonText: 'Explore Spares & SSDs',
        buttonUrl: '/shop?search=SSD',
        whatsappMsg: 'Hello Lapiez Garhwa, I want to upgrade my laptop SSD / buy original adapter.',
        bgGradient: 'from-[#381504] via-[#78350F] to-[#EA580C]',
        position: 4
      }
    ];

    for (const b of banners) {
      await prisma.banner.create({ data: b });
    }
    console.log('✅ Banners seeded.');
  }

  // 6. Categories
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    const cats = [
      { name: 'Laptop Adapters', slug: 'laptop-adapters', image: '/images/categories/laptop-adapters.png', startingPrice: 'From ₹899', position: 1 },
      { name: 'Laptop Keyboard', slug: 'laptop-keyboard', image: '/images/categories/laptop-keyboard.png', startingPrice: 'From ₹650', position: 2 },
      { name: 'Headsets & Audio', slug: 'headsets', image: '/images/categories/headsets.png', startingPrice: 'From ₹499', position: 3 },
      { name: 'Laptop Bags', slug: 'backpacks-and-carry-case', image: '/images/categories/backpacks.png', startingPrice: 'From ₹799', position: 4 },
      { name: 'Cables & HDMI', slug: 'cables-and-connectors', image: '/images/categories/cables-and-connectors.png', startingPrice: 'From ₹199', position: 5 },
      { name: 'Laptop Batteries', slug: 'laptop-batteries', image: '/images/categories/laptop-batteries.png', startingPrice: 'From ₹1,499', position: 6 },
      { name: 'Laptop Screens', slug: 'laptop-screen', image: '/images/categories/laptop-screen.png', startingPrice: 'From ₹2,800', position: 7 },
      { name: 'Wireless Mouse', slug: 'mouse', image: '/images/categories/mouse.png', startingPrice: 'From ₹299', position: 8 },
      { name: 'FHD Webcams', slug: 'web-cams', image: '/images/categories/web-cams.png', startingPrice: 'From ₹999', position: 9 },
      { name: 'NVMe SSDs & RAM', slug: 'laptop-ssd', image: '/images/categories/laptop-ssd.png', startingPrice: 'From ₹1,299', position: 10 }
    ];

    for (const c of cats) {
      await prisma.category.create({ data: c });
    }
    console.log('✅ Categories seeded.');
  }

  // 7. Homepage Sections (Order & Visibility)
  const sectionCount = await prisma.homepageSection.count();
  if (sectionCount === 0) {
    const defaultSections = [
      { sectionKey: 'banners', title: 'Top 4-Banner Interactive Carousel', position: 1, isVisible: true },
      { sectionKey: 'hero', title: 'Hero Festival Spotlight & Deal of the Day', position: 2, isVisible: true },
      { sectionKey: 'trust_bar', title: 'Indian E-Commerce 4 Trust Pillars', position: 3, isVisible: true },
      { sectionKey: 'categories', title: 'Shop by Hardware Category Grid', position: 4, isVisible: true },
      { sectionKey: 'featured', title: 'Trending Products', position: 5, isVisible: true },
      { sectionKey: 'promo', title: 'Dual Spotlight Promo Banners (SSD & Laptops)', position: 6, isVisible: true },
      { sectionKey: 'brands', title: 'Top Brands We Deal In', position: 7, isVisible: true },
      { sectionKey: 'catalog_cta', title: 'Complete Showroom Catalog Quick-Chips Card', position: 8, isVisible: true },
      { sectionKey: 'showroom', title: 'Garhwa Showroom Counter & Verification', position: 9, isVisible: true }
    ];

    for (const s of defaultSections) {
      await prisma.homepageSection.create({ data: s });
    }
    console.log('✅ Homepage Sections seeded.');
  }

  // 8. Products
  console.log(`📦 Upserting ${PRODUCTS.length} products into SQLite database...`);
  for (const p of PRODUCTS) {
    const slug = (p.sku || p.id).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + p.id;
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        mrp: p.mrp,
        discount: p.discount,
        specs: p.specs,
        description: p.description || p.specs,
        image: p.image,
        inStock: p.inStock,
        stockQuantity: p.stockQuantity || 10,
        rating: p.rating || 4.5,
        featured: p.featured || false,
        status: 'active'
      },
      create: {
        id: p.id,
        name: p.name,
        slug,
        category: p.category,
        brand: p.brand,
        price: p.price,
        mrp: p.mrp,
        discount: p.discount,
        specs: p.specs,
        description: p.description || p.specs,
        image: p.image,
        inStock: p.inStock,
        stockQuantity: p.stockQuantity || 10,
        sku: p.sku,
        rating: p.rating || 4.5,
        featured: p.featured || false,
        status: 'active'
      }
    });
  }
  console.log(`✅ ${PRODUCTS.length} Products synced successfully in DB.`);

  // 9. Initial Orders
  const orderCount = await prisma.order.count();
  if (orderCount === 0) {
    for (const o of INITIAL_ORDERS) {
      await prisma.order.create({
        data: {
          orderId: o.orderId,
          customerName: o.customerName,
          phone: o.phone,
          address: o.address,
          itemsJson: JSON.stringify(o.items),
          totalAmount: o.totalAmount,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          date: o.date
        }
      });
    }
    console.log('✅ Initial Orders seeded.');
  }

  // 10. Admin User
  await prisma.adminUser.upsert({
    where: { email: 'admin@lappysolution.com' },
    update: {},
    create: {
      email: 'admin@lappysolution.com',
      name: 'Lapiez Owner',
      role: 'SUPER_ADMIN'
    }
  });
  console.log('✅ Admin User seeded.');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
