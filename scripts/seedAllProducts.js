const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Complete 418 Catalog Seeding into Prisma DB ---');

  // 1. Read BASE_PRODUCTS from data/products.ts
  const productsTsPath = path.join(__dirname, '..', 'data', 'products.ts');
  const productsTs = fs.readFileSync(productsTsPath, 'utf8');
  const start = productsTs.indexOf('const BASE_PRODUCTS: Product[] = [');
  const end = productsTs.indexOf('];\r\n\r\nexport const PRODUCTS', start) !== -1 
    ? productsTs.indexOf('];\r\n\r\nexport const PRODUCTS', start)
    : productsTs.indexOf('];\n\nexport const PRODUCTS', start);

  if (start === -1 || end === -1) {
    throw new Error('Failed to find BASE_PRODUCTS block in data/products.ts');
  }

  const baseJsonStr = productsTs.substring(start + 'const BASE_PRODUCTS: Product[] = '.length, end + 1);
  const baseProducts = JSON.parse(baseJsonStr);
  console.log(`Loaded ${baseProducts.length} BASE_PRODUCTS from products.ts`);

  // 2. Read Frontech products
  const frontechPath = path.join(__dirname, '..', 'data', 'frontechProducts.json');
  const frontechProducts = fs.existsSync(frontechPath) ? JSON.parse(fs.readFileSync(frontechPath, 'utf8')) : [];
  console.log(`Loaded ${frontechProducts.length} Frontech products`);

  // 3. Read Scraped Brand products
  const scrapedPath = path.join(__dirname, '..', 'data', 'scrapedBrandProducts.json');
  const scrapedProducts = fs.existsSync(scrapedPath) ? JSON.parse(fs.readFileSync(scrapedPath, 'utf8')) : [];
  console.log(`Loaded ${scrapedProducts.length} Scraped brand products`);

  const allProducts = [...baseProducts, ...frontechProducts, ...scrapedProducts];
  console.log(`Total catalog items to seed: ${allProducts.length}`);

  let upsertedCount = 0;
  let skippedCount = 0;

  for (const p of allProducts) {
    const sku = (p.sku || `LS-${p.id}`).trim();
    const id = (p.id || `prod-${p.numericId || Date.now()}`).trim();
    const slug = (p.slug || (
      (p.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + (p.numericId || sku.replace(/[^a-z0-9]/gi, ''))
    )).trim();

    let imageToStore = p.image || '';
    if (Array.isArray(p.images) && p.images.length > 0) {
      const cleanImgs = p.images
        .flatMap(s => typeof s === 'string' && s.includes('|||') ? s.split('|||') : [s])
        .map(s => String(s).trim())
        .filter(Boolean);
      if (cleanImgs.length > 0) imageToStore = cleanImgs.join('|||');
    }

    const price = Number(p.price) || 0;
    const mrp = Number(p.mrp) || price || 0;
    const discount = Number(p.discount) || (mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);

    const productData = {
      name: p.name || 'Product',
      category: p.category || 'Accessories',
      brand: p.brand || 'Lapiez',
      price,
      mrp,
      discount,
      specs: p.specs || '',
      description: p.description || p.specs || '',
      image: imageToStore || '/images/categories/laptop-adapters.png',
      inStock: p.inStock ?? true,
      stockQuantity: Number(p.stockQuantity) || 10,
      rating: Number(p.rating) || 4.5,
      featured: p.featured ?? false,
      status: 'active',
      gstRate: p.gstRate !== undefined ? Number(p.gstRate) : 18,
      hsnCode: p.hsnCode || '8471'
    };

    try {
      await prisma.product.upsert({
        where: { sku },
        update: {
          ...productData,
          slug,
        },
        create: {
          id,
          sku,
          slug,
          ...productData
        }
      });
      upsertedCount++;
    } catch (err) {
      // If error on slug collision or id, retry with fallback unique slug
      try {
        const uniqueSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
        await prisma.product.upsert({
          where: { sku },
          update: {
            ...productData,
            slug: uniqueSlug
          },
          create: {
            id,
            sku,
            slug: uniqueSlug,
            ...productData
          }
        });
        upsertedCount++;
      } catch (innerErr) {
        console.error(`Failed to upsert SKU "${sku}":`, innerErr.message);
        skippedCount++;
      }
    }
  }

  const finalCount = await prisma.product.count();
  console.log(`\n========================================`);
  console.log(`Seeding Finished!`);
  console.log(`Upserted: ${upsertedCount}, Skipped: ${skippedCount}`);
  console.log(`Total Products Now in Supabase Database: ${finalCount}`);
  console.log(`========================================\n`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
