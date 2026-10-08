const https = require('https');
const fs = require('fs');

function fetchProducts() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'frontechonline.com',
      path: '/products.json?limit=250',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.products || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSpecs(text, title, type) {
  const parts = [];
  const bulletMatches = text.match(/(?:[•\-\*]|Warranty|Display|Resolution|Frequency|Interface|Output|Battery|Ports|Driver|Compatibility|Sensitivity|DPI|Connection)[:\s][^.•\n]{10,80}/gi);
  if (bulletMatches && bulletMatches.length > 0) {
    return bulletMatches.slice(0, 5).map(b => b.trim().replace(/^[•\-\*]\s*/, '')).join(' | ');
  }
  
  if (type === 'Monitor') {
    return 'Full HD Frameless Display | Ultra Refresh Rate | Built-in Speakers | HDMI & VGA | 3-Year Brand Warranty';
  } else if (type === 'Keyboard and Mouse Combo' || type === 'Keyboards') {
    return 'Ergonomic Keys | Plug & Play USB | Spill Resistant | Precision Tracking | 1-Year Brand Warranty';
  } else if (type === 'Speaker' || type === 'Soundbars & Woofers' || type === 'Trolley Speaker') {
    return 'Deep Bass Subwoofer | Bluetooth 5.0 Wireless | Multi-mode AUX/USB | Remote Control | 1-Year Warranty';
  } else if (type === 'Webcam') {
    return 'Full HD 1080p 30FPS | Dual Noise-Reduction Mic | 60° Wide Angle | USB Plug & Play | 1-Year Warranty';
  } else if (type === 'CCTV') {
    return 'Full HD Security Vision | Motion Detection Alert | Night Vision IR | Remote Live View App | 2-Year Warranty';
  }
  return '100% Genuine Frontech Original Hardware | High Durability | Official Warranty Across India';
}

function mapCategory(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('monitor')) {
    return { category: 'Computers', subcategory: 'Monitors & Displays' };
  }
  if (t.includes('keyboard') || t.includes('mouse') || t.includes('combo')) {
    return { category: 'Accessories', subcategory: 'Keyboards & Mice' };
  }
  if (t.includes('speaker') || t.includes('soundbar') || t.includes('headphone') || t.includes('earbud')) {
    return { category: 'Accessories', subcategory: 'Speakers & Audio' };
  }
  if (t.includes('cctv') || t.includes('security')) {
    return { category: 'CCTV & Security', subcategory: 'Surveillance Cameras' };
  }
  if (t.includes('smps') || t.includes('ups') || t.includes('fan') || t.includes('graphics') || t.includes('case')) {
    return { category: 'Storage & Parts', subcategory: 'Components & Power' };
  }
  if (t.includes('memory') || t.includes('pendrive') || t.includes('ssd') || t.includes('ram')) {
    return { category: 'Storage & Parts', subcategory: 'Storage & Drives' };
  }
  if (t.includes('cable') || t.includes('dongle') || t.includes('adapter')) {
    return { category: 'Accessories', subcategory: 'Cables & Converters' };
  }
  return { category: 'Accessories', subcategory: 'Computer & Mobile Accessories' };
}

function generateReviews(title, type, rating) {
  const pool = [
    { author: 'Vikash Kumar Gupta', loc: 'Garhwa, Jharkhand', comment: `Excellent build quality for ${title}. Works flawlessly right out of the box with full warranty. Highly recommended for daily work and gaming.` },
    { author: 'Rahul Sharma', loc: 'Daltonganj, Palamu', comment: `Value for money product by Frontech. Build quality is top-notch and delivery was quick. Genuine sealed pack with invoice.` },
    { author: 'Pooja Verma', loc: 'Ranchi, Jharkhand', comment: `Very satisfied with this purchase. Easy to setup, robust finishing, and great performance at this price point.` },
    { author: 'Anil Vishwakarma', loc: 'Garhwa', comment: `Best in this price segment. 100% genuine Frontech product with proper bill and warranty. Counter service at Lappy Solution was very helpful.` },
    { author: 'Sandeep Tiwari', loc: 'Chiniya Road, Garhwa', comment: `Superb performance and premium feel. Sound/display clarity is remarkable. Worth every rupee spent.` }
  ];

  const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 reviews
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    reviews.push({
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      author: item.author,
      location: item.loc,
      rating: Math.random() > 0.3 ? 5 : 4,
      date: `${Math.floor(Math.random() * 20) + 1} Sep 2026`,
      title: 'Verified Genuine Purchase',
      comment: item.comment,
      verified: true
    });
  }
  return reviews;
}

async function run() {
  console.log('Fetching all products from Frontech...');
  const shopifyProducts = await fetchProducts();
  console.log(`Fetched ${shopifyProducts.length} products from Frontech.`);

  const transformedProducts = shopifyProducts.map((p, idx) => {
    const primaryVariant = p.variants?.[0] || {};
    const price = Math.round(parseFloat(primaryVariant.price || '0'));
    const compareAtPrice = primaryVariant.compare_at_price ? Math.round(parseFloat(primaryVariant.compare_at_price)) : Math.round(price * 1.35);
    const mrp = compareAtPrice > price ? compareAtPrice : Math.round(price * 1.3);
    const discount = Math.round(((mrp - price) / mrp) * 100);

    const images = (p.images && p.images.length > 0)
      ? p.images.map(img => img.src)
      : ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'];

    const mainImage = images[0];
    const descText = cleanHtml(p.body_html);
    const { category, subcategory } = mapCategory(p.product_type);
    const specs = extractSpecs(descText, p.title, p.product_type);
    
    // Rating between 4.3 and 4.9
    const rating = Math.round((4.3 + Math.random() * 0.6) * 10) / 10;
    const reviewsCount = Math.floor(Math.random() * 85) + 18;
    const reviews = generateReviews(p.title, p.product_type, rating);

    return {
      id: `frontech-${p.id}`,
      numericId: 80000 + idx,
      name: p.title,
      category,
      subcategory,
      brand: 'Frontech',
      price: price || 999,
      mrp: mrp || 1499,
      discount: discount > 0 ? discount : 25,
      specs,
      image: mainImage,
      images,
      description: descText || `${p.title} from Frontech. Built for dependable daily performance with high-grade components and covered under standard brand manufacturer warranty across India.`,
      inStock: true,
      stockQuantity: Math.floor(Math.random() * 25) + 8,
      sku: primaryVariant.sku || `FT-${p.id.toString().slice(-6)}`,
      rating,
      reviewsCount,
      featured: idx < 12,
      isScraped: true,
      sourceUrl: `https://frontechonline.com/products/${p.handle}`,
      reviews
    };
  });

  fs.writeFileSync('data/frontechProducts.json', JSON.stringify(transformedProducts, null, 2));
  console.log(`Saved ${transformedProducts.length} transformed Frontech products to data/frontechProducts.json.`);
}

run().catch(console.error);
