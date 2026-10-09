const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedData() {
  console.log('Seeding Homepage Sections, Custom Pages & Blog Posts...');

  // Get sample products for default section productIds
  const allProds = await prisma.product.findMany({ select: { id: true, category: true, brand: true, name: true, price: true } });
  
  const monitors = allProds.filter(p => p.name.toLowerCase().includes('monitor')).slice(0, 6).map(p => p.id);
  const laptops = allProds.filter(p => p.category === 'Laptops').slice(0, 6).map(p => p.id);
  const bestsellers = allProds.filter(p => p.price < 4000).slice(0, 6).map(p => p.id);
  const premium = allProds.filter(p => p.price > 15000).slice(0, 6).map(p => p.id);
  const cctv = allProds.filter(p => p.category === 'CCTV & Security').slice(0, 6).map(p => p.id);
  const refurbished = laptops.slice(0, 4).concat(allProds.filter(p => p.category === 'Printers').slice(0, 2).map(p => p.id));

  const sections = [
    { sectionKey: 'banners', title: 'Top Hero Slider Banners', position: 1, isVisible: true, badge: 'HERO DEALS' },
    { sectionKey: 'trust_bar', title: 'Indian E-Commerce 4 Trust Pillars', position: 2, isVisible: true, badge: 'TRUST BADGES' },
    { sectionKey: 'categories', title: 'Shop by Hardware Category Grid', position: 3, isVisible: true, badge: 'DISCOVERY' },
    { 
      sectionKey: 'trending', 
      title: 'Trending Products', 
      subtitle: 'Top rated Frontech curved monitors, 12th/13th Gen laptops, and showroom verified hardware with instant counter pickup.',
      badge: '🔥 HOT & TRENDING',
      productIds: JSON.stringify(monitors.concat(laptops.slice(0, 2))),
      position: 4, 
      isVisible: true 
    },
    { 
      sectionKey: 'bestsellers', 
      title: 'Best Sellers', 
      subtitle: 'Most purchased computer accessories, genuine laptop spares, and bestselling hardware in Garhwa.',
      badge: '⭐ SHOWROOM FAVORITES',
      productIds: JSON.stringify(bestsellers),
      position: 5, 
      isVisible: true 
    },
    { 
      sectionKey: 'premium', 
      title: 'Premium Segment', 
      subtitle: 'High-end 200Hz IPS gaming displays, Intel Core i7/i9 workstation rigs, and certified power laptops.',
      badge: '👑 HIGH-PERFORMANCE RIGS',
      productIds: JSON.stringify(premium),
      position: 6, 
      isVisible: true 
    },
    { 
      sectionKey: 'refurbished_laptops', 
      title: 'Refurbished Laptops & Printers', 
      subtitle: 'Tested quality Dell Latitude, HP EliteBook, Lenovo ThinkPad & commercial printers with local warranty support.',
      badge: '🏷️ WORK SMARTER SPEND LESS',
      productIds: JSON.stringify(refurbished),
      position: 7, 
      isVisible: true 
    },
    { 
      sectionKey: 'cctv_spotlight', 
      title: 'CCTV Security & Surveillance', 
      subtitle: 'Turnkey 4-camera and 8-camera CP-PLUS & Frontech kits with night vision, mobile live view, and installation.',
      badge: '📹 24/7 SURVEILLANCE',
      productIds: JSON.stringify(cctv),
      position: 8, 
      isVisible: true 
    },
    { 
      sectionKey: 'blogs_preview', 
      title: 'Latest Tech Guides & Hardware News', 
      subtitle: 'Expert buying tips, laptop repair advice, and tech tutorials from Lapiez engineers.',
      badge: '📰 GARHWA TECH DIARY',
      position: 9, 
      isVisible: true 
    },
    { sectionKey: 'promo', title: 'Dual Spotlight Promo Banners (SSD & Laptops)', position: 10, isVisible: true, badge: 'PROMOS' },
    { sectionKey: 'brands', title: 'Top Brands We Deal In', position: 11, isVisible: true, badge: 'OFFICIAL BRANDS' },
    { sectionKey: 'catalog_cta', title: 'Complete Showroom Catalog Quick-Chips Card', position: 12, isVisible: true, badge: 'EXPLORE' },
    { sectionKey: 'showroom', title: 'Garhwa Showroom Counter & Verification', position: 13, isVisible: true, badge: 'STORE VISIT' }
  ];

  for (const s of sections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: s.sectionKey },
      update: {
        title: s.title,
        subtitle: s.subtitle,
        badge: s.badge,
        productIds: s.productIds,
        position: s.position,
        isVisible: s.isVisible
      },
      create: s
    });
  }
  console.log('✅ Sections seeded successfully.');

  // Custom Pages
  const pages = [
    {
      slug: 'terms-and-conditions',
      title: 'Terms & Conditions',
      metaTitle: 'Terms & Conditions | Lapiez Garhwa',
      metaDesc: 'Official terms and conditions for ordering, showroom pickup, GST invoicing, and warranty at Lapiez.',
      content: `## 1. Introduction & Store Overview
Welcome to **Lapiez** (Opposite G P Plaza, Near Old Bus Stand, Chiniya Road, Garhwa, Jharkhand - 822114). By placing an order, requesting an estimate, or purchasing products on this platform or at our physical showroom, you agree to comply with and be bound by the following terms and conditions.

## 2. 100% Genuine Hardware & 18% GST Invoicing
All products sold by Lapiez (Laptops, Frontech Monitors, CP-PLUS CCTV kits, Crucial/Kingston SSDs, original adapters, and laptop batteries) are **100% genuine and brand certified**. Every transaction includes a valid **CBIC Rule 46 compliant 18% GST Tax Invoice** bearing our legal GSTIN (20AABCL1234F1Z5) which allows legitimate Input Tax Credit (ITC) claims for business accounts.

## 3. Order Processing & Showroom Pickup
* **Showroom Pickup:** Ready within 30 minutes of placing the order. Customers can inspect the hardware live on our Chiniya Road testing bench before handover.
* **Local Delivery:** Orders across Garhwa and Palamu districts are dispatched within 2-4 hours via our local logistics team.
* **Interstate Delivery:** Shipped via DTDC, Bluedart, or India Post Express with live tracking numbers provided over WhatsApp and SMS.

## 4. Testing & Verification Warranty
Every new item carries the **official manufacturer brand warranty** (1 to 3 years depending on the brand like Frontech, HP, Dell, CP-PLUS). Certified refurbished laptops and commercial printers include a **7-day unconditional testing warranty** and up to **1-year local service warranty support** directly at our Garhwa tech lab.

## 5. Pricing & Payments
Prices listed on the website include applicable GST unless explicitly stated otherwise. We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking, RTGS/NEFT for wholesale orders, and Cash on Delivery for showroom pickup.

## 6. Contact & Grievance Redressal
For any inquiries, bill corrections, or service appointments:
* **Showroom Address:** Opposite G P Plaza, Near Old Bus Stand, Chiniya Road, Garhwa, Jharkhand - 822114
* **Phone / WhatsApp:** +91 9608828288
* **Email:** support@lappysolution.com`
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      metaTitle: 'Privacy Policy | Lapiez Garhwa',
      metaDesc: 'How Lapiez protects your personal information and transaction records.',
      content: `## 1. Information We Collect
We collect necessary customer details to fulfill orders, generate GST tax invoices, and provide warranty support. This includes your Name, Mobile/WhatsApp Number, Delivery Address, Pincode, and optional Business Name / GSTIN.

## 2. Use of Information
Your details are used exclusively for:
* Generating statutory GST bills and order tracking updates.
* WhatsApp notifications regarding order confirmation and dispatch.
* Manufacturer warranty registration and showroom service history.

## 3. Payment Data Security
Lapiez **never stores credit card, debit card, or UPI PINs**. Payments made through dynamic QR codes or payment links are processed directly by authorized NPCI-certified UPI applications (Axis Bank / BHIM / PhonePe / Google Pay).

## 4. Zero Data Selling Guarantee
We respect your privacy. Your personal information is never sold, leased, or distributed to third-party marketing companies.

## 5. Contact Us
If you have any questions regarding your data or wish to update your records, contact us at **+91 9608828288** or visit our showroom on Chiniya Road, Garhwa.`
    },
    {
      slug: 'warranty-policy',
      title: 'Warranty & Replacement Policy',
      metaTitle: 'Warranty & Replacement Policy | Lapiez Garhwa',
      metaDesc: 'Learn about our testing warranty, manufacturer claims, and refurbished laptop guarantees.',
      content: `## 1. Brand New Hardware Warranty
All brand new products purchased from Lapiez carry 100% genuine manufacturer warranties across India:
* **Frontech Monitors & Displays:** 3-Year all-India manufacturer warranty.
* **Frontech Keyboards, Mice, Audio:** 1-Year replacement warranty.
* **HP, Dell, Lenovo Laptops:** 1-Year on-site or depot brand warranty.
* **CP-PLUS CCTV Security:** 2-Year manufacturer replacement warranty.
* **Crucial & Kingston SSDs:** 3 to 5-Year manufacturer replacement warranty.

## 2. Certified Refurbished Hardware Guarantee
For certified refurbished laptops and printers:
* **7-Day Testing Window:** If any hardware defect is detected within 7 days, we offer immediate counter replacement or full repair.
* **Showroom Service Support:** 6 to 12 months comprehensive hardware support at our Garhwa facility.
* **Battery & Adapter Assurance:** All refurbished laptops are supplied with certified original batteries providing healthy backup and tested chargers.

## 3. How to Claim Warranty
Simply bring your hardware along with the **Lapiez GST Invoice** (PDF or printout) to our showroom counter at **Chiniya Road, Garhwa**, or message our dedicated support desk on WhatsApp at **+91 9608828288**.`
    },
    {
      slug: 'about-us',
      title: 'About Lapiez Garhwa',
      metaTitle: 'About Us | Lapiez - Leading IT & Hardware Showroom in Garhwa',
      metaDesc: 'Garhwa’s trusted technology hub for laptops, Frontech monitors, CCTV kits, and chip-level repairs.',
      content: `## Welcome to Lapiez
Established as Garhwa’s premier technology destination, **Lapiez** provides an end-to-end ecosystem for personal computers, business workstations, official Frontech displays, CCTV surveillance kits, and certified laptop repairs.

## Why Customers in Garhwa & Palamu Trust Us:
* **100% Genuine Sealed Products:** Direct distributor sourcing guarantees authenticity.
* **CBIC Rule 46 GST Invoicing:** Save up to 18% with legitimate B2B tax credits.
* **Official Frontech Brand Store:** Complete catalog of 131+ Frontech monitors, soundbars, keyboards, and accessories in stock.
* **Chip-Level Service Lab:** Microscopic soldering, motherboard repairs, screen replacements, and hinge rebuilds done in-house.
* **Fast Local Delivery:** Same-day dispatch throughout Garhwa, Daltonganj, and surrounding regions.

## Visit Our Showroom:
* **Address:** Opposite G P Plaza, Near Old Bus Stand, Chiniya Road, Garhwa, Jharkhand - 822114
* **Helpline:** +91 9608828288
* **Business Hours:** Monday to Saturday: 09:30 AM - 08:30 PM | Sunday: 10:00 AM - 04:00 PM`
    }
  ];

  for (const p of pages) {
    await prisma.customPage.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });
  }
  console.log('✅ Custom Pages seeded successfully.');

  // Blog Posts
  const blogs = [
    {
      slug: 'refurbished-vs-new-laptops-guide-2026',
      title: 'Refurbished vs Brand New Laptops: Why Certified Pre-Owned Saves You Up to 60%',
      excerpt: 'Discover why students, coaching institutes, and businesses in Garhwa are choosing Grade-A certified refurbished Dell Latitude and HP EliteBook laptops over cheap new laptops.',
      coverImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000&auto=format&fit=crop&q=80',
      category: 'Buying Guide',
      author: 'Rupesh Kumar (Lapiez Tech Team)',
      readTime: '5 min read',
      tags: 'refurbished,laptops,guide,dell,hp',
      content: `Buying a laptop today can be overwhelming. Brand-new budget laptops under ₹30,000 often cut corners with cheap plastic chassis, dim displays, and entry-level Celeron or Athlon processors that lag after a few months.

On the other hand, **Certified Refurbished Business Laptops** (such as Dell Latitude, Lenovo ThinkPad, and HP EliteBook) were originally built for corporate enterprises with starting prices upwards of ₹80,000. 

### 1. Magnesium-Alloy Military-Grade Durability
Enterprise laptops are built to withstand daily office transit, minor spills, and high workloads. Their metal hinges and cooling systems far outperform retail plastic models.

### 2. Powerful Core i5/i7 Processors + Fast NVMe SSDs
At Lapiez Garhwa, all refurbished laptops are upgraded with brand-new Crucial/Kingston NVMe SSDs and 8GB to 16GB of DDR4 RAM. They boot Windows 11 in under 10 seconds.

### 3. Rigorous 28-Point Showroom Testing Bench
Every machine undergoes:
* Battery cycle & capacity load test (minimum 2.5 to 4 hours backup).
* Display backlight uniformity and zero dead pixel verification.
* Full keyboard, trackpad, webcam, and port inspection.
* Thermal paste re-application and cooling fan ultrasonic cleaning.

Visit our Chiniya Road showroom to test any laptop with live benchmarks before making your decision!`
    },
    {
      slug: 'frontech-curved-gaming-monitors-review',
      title: 'Review: Frontech 100Hz & 200Hz Curved Frameless Monitors in Garhwa',
      excerpt: 'An in-depth look at Frontech’s Ultima & Gaming monitor series available at Lapiez with 3-year warranty and prices starting at ₹5,999.',
      coverImage: 'https://cdn.shopify.com/s/files/1/0854/3227/1149/files/24.5_inch_mon_0087v_01.jpg?v=1772186717',
      category: 'Display & Gaming',
      author: 'Lapiez Hardware Lab',
      readTime: '4 min read',
      tags: 'frontech,monitors,gaming,curved,review',
      content: `Frontech has revolutionized the Indian monitor market with their new **Ultima and Gaming series displays**. For users in Garhwa and Palamu looking for frameless designs, vibrant color accuracy, and high refresh rates without breaking the bank, Frontech offers unbeatable value.

### Key Highlights of Frontech Monitors:
* **100Hz to 200Hz Ultra-Smooth Refresh Rates:** Zero motion blur in competitive games like CS:GO, Valorant, and GTA V, and fluid scrolling for office work and coding.
* **Frameless Curved Panels (1500R Curvature):** Wraps around your field of view for deeply immersive gaming and panoramic Excel spreadsheets.
* **Dual HDMI & VGA Connectivity:** Plug in your laptop, desktop PC, CCTV DVR, or gaming console seamlessly.
* **3-Year All-India On-Site Warranty:** 100% peace of mind backed by official Frontech service centers.

Drop by our Garhwa showroom counter to witness the display clarity and contrast side-by-side!`
    },
    {
      slug: 'how-to-choose-cctv-camera-system-garhwa',
      title: 'Complete Guide: Choosing the Best CCTV Camera Setup for Your Shop or Home',
      excerpt: 'Learn the differences between 2MP, 5MP, and IP CCTV cameras, night vision requirements, and mobile app live view setup for Garhwa & Palamu properties.',
      coverImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1000&auto=format&fit=crop&q=80',
      category: 'Security & Surveillance',
      author: 'Lapiez Security Services',
      readTime: '6 min read',
      tags: 'cctv,cpplus,security,cameras,installation',
      content: `Security is essential for retail shops, godowns, schools, and residences across Jharkhand. Choosing the right surveillance setup prevents blind spots, captures clear number plates, and provides instant mobile access.

### 1. Analog HD vs IP Cameras
* **Analog HD (CP-PLUS / Frontech 2MP & 5MP):** Cost-effective, reliable coaxial cabling, ideal for small shops, jewelry counters, and homes.
* **IP Network Cameras (PoE):** Ultra high-definition, crystal-clear zoom, structured Cat6 network cabling, ideal for multi-storey buildings and warehouses.

### 2. Full-Color Night Vision vs Infrared
Traditional IR cameras switch to black and white in the dark. Modern **Full-Color LED cameras** illuminate the area with warm soft light and record vibrant, crystal-clear color video even in pitch darkness.

### 3. Remote Live View on Your Mobile Phone
Every CCTV package installed by Lapiez includes complete mobile app setup so you can watch live video, playback footage, and receive motion alerts on your Android or iPhone from anywhere in the world.

Contact our team at **+91 9608828288** for a free site inspection and instant quotation in Garhwa!`
    }
  ];

  for (const b of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b
    });
  }
  console.log('✅ Blog Posts seeded successfully.');

  process.exit(0);
}

seedData().catch(e => {
  console.error('Error seeding data:', e);
  process.exit(1);
});
