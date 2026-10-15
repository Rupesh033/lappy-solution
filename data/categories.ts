// Lapiez - Official Store Categories & Subcategories Taxonomy
// Synchronized directly with live database & showroom inventory

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  image?: string;
  itemCount?: number;
  description?: string;
  startingPrice?: string;
  position?: number;
  status?: string;
  parentId?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  title?: string;
  shortDesc?: string;
  imageUrl?: string;
  image?: string;
  iconName?: string;
  startingPrice?: string;
  position?: number;
  status?: string;
  subcategories: SubCategory[];
  isFeatured?: boolean;
}

export const CATEGORIES: Category[] = [
  // 1. Computer & Laptops
  {
    id: 'cat-laptops',
    name: 'Computer & Laptops',
    slug: 'laptops',
    title: 'Computer & Laptops',
    shortDesc: 'Refurbished business laptops, brand new computers and high performance desktop rigs.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/242BcPaL.webp',
    image: 'https://cdn.dotpe.in/longtail/item_collection/8473996/242BcPaL.webp',
    iconName: 'Laptop',
    startingPrice: '₹9,999',
    position: 0,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282348', name: 'Desktop & Laptops', slug: 'desktop-laptops', startingPrice: '', position: 0, status: 'active', parentId: 'cat-laptops' },
      { id: '6282546', name: 'Refurbished Laptops', slug: 'refurbished', startingPrice: '', position: 1, status: 'active', parentId: 'cat-laptops' },
      { id: 'sub-gaming-pc', name: 'Custom Desktop PC Rigs', slug: 'custom-pcs', startingPrice: '', position: 2, status: 'active', parentId: 'cat-laptops' },
    ],
  },

  // 2. Laptop Parts & Spares
  {
    id: 'cat-laptop-parts',
    name: 'Laptop Parts & Spares',
    slug: 'laptop-parts',
    title: 'Laptop Parts & Spares',
    shortDesc: 'Original laptop batteries, adapters, keyboards, display screens and spare parts.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/cJZR0B6A.webp',
    image: 'https://cdn.dotpe.in/longtail/item_collection/8473996/cJZR0B6A.webp',
    iconName: 'Cpu',
    startingPrice: '₹650',
    position: 1,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282354', name: 'Laptop Battery', slug: 'laptop-battery', startingPrice: '', position: 0, status: 'active', parentId: 'cat-laptop-parts' },
      { id: '6282357', name: 'Laptop Adaptor', slug: 'laptop-adaptor', startingPrice: '', position: 1, status: 'active', parentId: 'cat-laptop-parts' },
      { id: '6282356', name: 'Laptop Body', slug: 'laptop-body', startingPrice: '', position: 2, status: 'active', parentId: 'cat-laptop-parts' },
      { id: '6282347', name: 'Laptop Parts', slug: 'laptop-parts-4', startingPrice: '', position: 3, status: 'active', parentId: 'cat-laptop-parts' },
      { id: '6282355', name: 'Laptop Keyboards', slug: 'laptop-keyboards', startingPrice: '', position: 4, status: 'active', parentId: 'cat-laptop-parts' },
      { id: 'cmv8x80uh0000jp06usrkmxwk', name: 'Laptop Screen', slug: 'laptop--screen', startingPrice: '', position: 5, status: 'active', parentId: 'cat-laptop-parts' },
    ],
  },

  // 3. Computer Peripherals
  {
    id: 'cat-peripherals',
    name: 'Computer Peripherals',
    slug: 'peripherals',
    title: 'Computer Peripherals',
    shortDesc: 'Keyboards, wireless mice, webcams, speakers and connectivity accessories.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/q1ZdCuDa.webp',
    image: 'https://cdn.dotpe.in/longtail/item_collection/8473996/q1ZdCuDa.webp',
    iconName: 'Mouse',
    startingPrice: '₹199',
    position: 2,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282351', name: 'Mouse & Keyboard', slug: 'mouse-keyboard', startingPrice: '', position: 0, status: 'active', parentId: 'cat-peripherals' },
      { id: '6283522', name: 'Speakers & Soundbars', slug: 'speakers', startingPrice: '', position: 1, status: 'active', parentId: 'cat-peripherals' },
      { id: '6282349', name: 'Computer Peripherals', slug: 'pc-peripherals', startingPrice: '', position: 2, status: 'active', parentId: 'cat-peripherals' },
      { id: '6282352', name: 'Cable & Connector (HDMI/VGA/Power)', slug: 'cables-connectors', startingPrice: '', position: 3, status: 'active', parentId: 'cat-peripherals' },
    ],
  },

  // 4. Printers
  {
    id: 'cat-printers',
    name: 'Printers',
    slug: 'printers',
    title: 'Printers',
    shortDesc: 'All-in-one WiFi InkTank and laser printers with official warranty.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/ZIB6owYD.webp',
    image: 'https://cdn.dotpe.in/longtail/item_collection/8473996/ZIB6owYD.webp',
    iconName: 'Printer',
    startingPrice: '9999',
    position: 3,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282340', name: 'Printers (InkTank & Laser)', slug: 'printers-list', startingPrice: '', position: 0, status: 'active', parentId: 'cat-printers' },
      { id: '6282341', name: 'Toner & Ink Bottles', slug: 'toner-ink', startingPrice: '', position: 1, status: 'active', parentId: 'cat-printers' },
      { id: '6287242', name: 'Paper & Sticker Sheets', slug: 'paper-sticker', startingPrice: '', position: 2, status: 'active', parentId: 'cat-printers' },
      { id: '5998950', name: 'Printer Spare Parts & Rollers', slug: 'printer-parts', startingPrice: '', position: 3, status: 'active', parentId: 'cat-printers' },
    ],
  },

  // 5. CCTV & Security
  {
    id: 'cat-cctv',
    name: 'CCTV & Security',
    slug: 'cctv-security',
    title: 'CCTV & Security',
    shortDesc: 'HD CCTV cameras, biometric scanners, DVR/NVR surveillance equipment.',
    imageUrl: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792034738/lapiez/categories/tmqqbyejjsmmmogqlwlh.jpg',
    image: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792034738/lapiez/categories/tmqqbyejjsmmmogqlwlh.jpg',
    iconName: 'Shield',
    startingPrice: '₹1,250',
    position: 4,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282350', name: 'CCTV Cameras (Dome/Bullet/Wi-Fi)', slug: 'cctv-cameras', startingPrice: '', position: 0, status: 'active', parentId: 'cat-cctv' },
      { id: '6282353', name: 'Biometric Attendance & Scanners', slug: 'biometric-scanners', startingPrice: '', position: 1, status: 'active', parentId: 'cat-cctv' },
    ],
  },

  // 6. Storage & Memory
  {
    id: 'cat-storage',
    name: 'Storage & Memory',
    slug: 'storage',
    title: 'Storage & Memory',
    shortDesc: 'High-speed NVMe/SATA SSDs, DDR4/DDR5 RAM, pendrives and external drives.',
    imageUrl: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792034503/lapiez/categories/eqqtzkb1o6r7ctxzz3a3.jpg',
    image: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792034503/lapiez/categories/eqqtzkb1o6r7ctxzz3a3.jpg',
    iconName: 'HardDrive',
    startingPrice: '₹399',
    position: 5,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282406', name: 'SSD & Hard Disk', slug: 'ssd-hard-disk', startingPrice: '', position: 0, status: 'active', parentId: 'cat-storage' },
      { id: '6282407', name: 'Pendrive & SD Card', slug: 'pendrive-sd-card', startingPrice: '', position: 1, status: 'active', parentId: 'cat-storage' },
    ],
  },

  // 7. Antivirus & Software
  {
    id: 'cat-software',
    name: 'Antivirus & Software',
    slug: 'antivirus',
    title: 'Antivirus & Software',
    shortDesc: 'Original Quick Heal, Kaspersky, Total Security licenses and office software.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/M0Si0HDm.webp',
    image: 'https://cdn.dotpe.in/longtail/item_collection/8473996/M0Si0HDm.webp',
    iconName: 'Lock',
    startingPrice: '₹350',
    position: 6,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282549', name: 'Antivirus (Quick Heal / Total Security)', slug: 'antivirus-keys', startingPrice: '', position: 0, status: 'active', parentId: 'cat-software' },
    ],
  },

  // 8. Electronics & Audio
  {
    id: 'cat-electronics',
    name: 'Electronics & Audio',
    slug: 'electronics',
    title: 'Electronics & Audio',
    shortDesc: 'Earphones, Bluetooth speakers, headphones, power adapters and gadgets.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/bYcAegxA.webp',
    image: 'https://cdn.dotpe.in/longtail/item_collection/8473996/bYcAegxA.webp',
    iconName: 'Headphones',
    startingPrice: '₹299',
    position: 7,
    status: 'active',
    isFeatured: true,
    subcategories: [
      { id: '6282405', name: 'Electronics & Gadgets', slug: 'gadgets', startingPrice: '', position: 0, status: 'active', parentId: 'cat-electronics' },
    ],
  },

  // 9. Toner & ink
  {
    id: 'cmv8xmqla0000ld06okzims12',
    name: 'Toner & ink',
    slug: 'toner---ink',
    title: 'Toner & ink',
    shortDesc: 'Original toner cartridges, refill bottles and printer ink supplies.',
    imageUrl: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792032072/lapiez/categories/nk41zet4lmioaljhedb8.jpg',
    image: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792032072/lapiez/categories/nk41zet4lmioaljhedb8.jpg',
    iconName: 'Package',
    startingPrice: 'Starting ₹499',
    position: 8,
    status: 'active',
    isFeatured: true,
    subcategories: [],
  },

  // 10. Printer Parts
  {
    id: 'cmv8xxzob0001ky0633l9qsg0',
    name: 'Printer Parts',
    slug: 'printer-parts-1',
    title: 'Printer Parts',
    shortDesc: 'Pick up rollers, teflon sleeves, pressure rollers, gear assemblies and logic boards.',
    imageUrl: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792032587/lapiez/categories/juhkokvaxtgsjtzehzch.jpg',
    image: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792032587/lapiez/categories/juhkokvaxtgsjtzehzch.jpg',
    iconName: 'Wrench',
    startingPrice: 'Starting ₹100',
    position: 9,
    status: 'active',
    isFeatured: true,
    subcategories: [],
  },

  // 11. Refurbished
  {
    id: 'cmv8y3vbf0002ky06z8rhpygf',
    name: 'Refurbished',
    slug: 'refurbished-1',
    title: 'Refurbished',
    shortDesc: 'Fully tested, showroom certified refurbished laptops, monitors and systems with warranty.',
    imageUrl: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792032874/lapiez/categories/soygmudbo94aeuoxchrb.jpg',
    image: 'https://res.cloudinary.com/ydugu2xq/image/upload/v1792032874/lapiez/categories/soygmudbo94aeuoxchrb.jpg',
    iconName: 'RefreshCw',
    startingPrice: 'Starting ₹100',
    position: 10,
    status: 'active',
    isFeatured: true,
    subcategories: [],
  },
];
