// Lapiez - Comprehensive Categories & Subcategories Taxonomy
// Scraped & Synchronized from lappysolution.com

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  itemCount?: number;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  title: string;
  shortDesc: string;
  imageUrl: string;
  iconName: string;
  startingPrice: string;
  subcategories: SubCategory[];
  isFeatured?: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-laptops',
    name: 'Computer & Laptops',
    slug: 'laptops',
    title: 'Laptops & Computers',
    shortDesc: 'Brand new, refurbished business laptops, desktops & custom rigs.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/242BcPaL.webp',
    iconName: 'Laptop',
    startingPrice: '₹14,999',
    isFeatured: true,
    subcategories: [
      {
        id: '6282342',
        name: 'Computer & Laptop',
        slug: 'computer-and-laptop',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/xs0h04dj.webp',
        itemCount: 45
      },
      {
        id: '6282546',
        name: 'Refurbished Laptops',
        slug: 'refurbished',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/xkKf6HNX.webp',
        itemCount: 28
      },
      {
        id: 'sub-gaming-pc',
        name: 'Custom Desktop PC Rigs',
        slug: 'custom-pcs',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/242BcPaL.webp',
        itemCount: 16
      }
    ]
  },
  {
    id: 'cat-laptop-parts',
    name: 'Laptop Parts & Spares',
    slug: 'laptop-parts',
    title: 'Original Laptop Spares',
    shortDesc: '100% genuine replacement batteries, adapters, keyboards, screens & hinges.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/cJZR0B6A.webp',
    iconName: 'Cpu',
    startingPrice: '₹650',
    isFeatured: true,
    subcategories: [
      {
        id: '6282354',
        name: 'Laptop Battery',
        slug: 'laptop-battery',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/eeFFVXks.webp',
        itemCount: 38
      },
      {
        id: '6282357',
        name: 'Laptop Adapter / Charger',
        slug: 'laptop-adapter',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/zIHC2Qpu.webp',
        itemCount: 42
      },
      {
        id: '6282356',
        name: 'Laptop Body & Panel',
        slug: 'laptop-body',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/z5NcNjVt.webp',
        itemCount: 20
      },
      {
        id: '6282347',
        name: 'Laptop Parts & Hinges',
        slug: 'laptop-parts',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/OwGeDQwz.webp',
        itemCount: 50
      },
      {
        id: '6282355',
        name: 'Laptop Peripherals & Keyboards',
        slug: 'laptop-peripherals',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/rX7OX8M8.webp',
        itemCount: 34
      }
    ]
  },
  {
    id: 'cat-peripherals',
    name: 'Computer Peripherals',
    slug: 'peripherals',
    title: 'Peripherals & Accessories',
    shortDesc: 'Gaming & office keyboards, wireless mice, speakers, cables and connectors.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/q1ZdCuDa.webp',
    iconName: 'Headphones',
    startingPrice: '₹199',
    isFeatured: true,
    subcategories: [
      {
        id: '6282351',
        name: 'Mouse & Keyboard',
        slug: 'mouse-keyboard',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/dOCQTeoY.webp',
        itemCount: 65
      },
      {
        id: '6283522',
        name: 'Speakers & Soundbars',
        slug: 'speakers',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/JyVfnons.webp',
        itemCount: 22
      },
      {
        id: '6282349',
        name: 'Computer Peripherals',
        slug: 'pc-peripherals',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/oQTjA0ON.webp',
        itemCount: 40
      },
      {
        id: '6282352',
        name: 'Cable & Connector (HDMI/VGA/Power)',
        slug: 'cables-connectors',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/lFlSylhj.webp',
        itemCount: 30
      }
    ]
  },
  {
    id: 'cat-printers',
    name: 'Printers & Parts',
    slug: 'printers',
    title: 'Printers & Consumables',
    shortDesc: 'LaserJet, InkTank printers, genuine ink bottles, toner cartridges and printing paper.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/ZIB6owYD.webp',
    iconName: 'Printer',
    startingPrice: '₹450',
    isFeatured: true,
    subcategories: [
      {
        id: '6282340',
        name: 'Printers (InkTank & Laser)',
        slug: 'printers-list',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/yxNuvhqL.webp',
        itemCount: 24
      },
      {
        id: '6282341',
        name: 'Toner & Ink Bottles',
        slug: 'toner-ink',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/0MLEw5kt.webp',
        itemCount: 41
      },
      {
        id: '6287242',
        name: 'Paper & Sticker Sheets',
        slug: 'paper-sticker',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/mnioCDmy.webp',
        itemCount: 15
      },
      {
        id: '5998950',
        name: 'Printer Spare Parts & Rollers',
        slug: 'printer-parts',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/BstOgDA9.webp',
        itemCount: 19
      }
    ]
  },
  {
    id: 'cat-cctv',
    name: 'CCTV & Security',
    slug: 'cctv-security',
    title: 'CCTV & Surveillance',
    shortDesc: 'CP-PLUS, Hikvision HD/IP cameras, DVRs, NVRs, power supplies & complete setups.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/YcXl0oyU.webp',
    iconName: 'Shield',
    startingPrice: '₹1,250',
    isFeatured: true,
    subcategories: [
      {
        id: '6282350',
        name: 'CCTV Cameras (Dome/Bullet/Wi-Fi)',
        slug: 'cctv-cameras',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/ODxRPjlK.webp',
        itemCount: 35
      },
      {
        id: '6282353',
        name: 'Biometric Attendance & Scanners',
        slug: 'biometric-scanners',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/zSnb5zim.webp',
        itemCount: 18
      }
    ]
  },
  {
    id: 'cat-storage',
    name: 'Storage & Memory',
    slug: 'storage',
    title: 'SSD, Hard Disks & RAM',
    shortDesc: 'High-speed NVMe M.2 SSDs, SATA drives, surveillance HDDs, and DDR4/DDR5 RAM.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/Yk0fk2IC.webp',
    iconName: 'HardDrive',
    startingPrice: '₹399',
    isFeatured: true,
    subcategories: [
      {
        id: '6282406',
        name: 'SSD & Hard Disk',
        slug: 'ssd-hard-disk',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/McOO3lrp.webp',
        itemCount: 30
      },
      {
        id: '6282407',
        name: 'Pendrive & SD Card',
        slug: 'pendrive-sd-card',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/2AZ4d8vt.webp',
        itemCount: 25
      }
    ]
  },
  {
    id: 'cat-software',
    name: 'Antivirus & Software',
    slug: 'antivirus',
    title: 'Antivirus & Security Software',
    shortDesc: 'Quick Heal, Net Protector, K7 & Total Security licenses with instant activation.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/M0Si0HDm.webp',
    iconName: 'Lock',
    startingPrice: '₹350',
    isFeatured: false,
    subcategories: [
      {
        id: '6282549',
        name: 'Antivirus (Quick Heal / Total Security)',
        slug: 'antivirus-keys',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/VH4tVZy3.webp',
        itemCount: 12
      }
    ]
  },
  {
    id: 'cat-electronics',
    name: 'Electronics & Audio',
    slug: 'electronics',
    title: 'Electronics & Audio',
    shortDesc: 'Power adapters, Bluetooth speakers, headphones, extension boards and tools.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/bYcAegxA.webp',
    iconName: 'Tv',
    startingPrice: '₹299',
    isFeatured: false,
    subcategories: [
      {
        id: '6282405',
        name: 'Electronics & Gadgets',
        slug: 'gadgets',
        imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/oenljVRM.webp',
        itemCount: 20
      }
    ]
  }
];

// Helper to get all categories
export const getAllCategories = (): Category[] => CATEGORIES;

// Helper to get category by slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
};
