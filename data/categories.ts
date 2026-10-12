// Lapiez - Comprehensive Categories & Subcategories Taxonomy
// Synchronized with Indian IT Hardware Ecosystem (Lapcare, Prodot, Frontech, Fingers, Lappy Solution)

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
  // 1. Bluetooth Speaker
  {
    id: 'cat-bluetooth-speaker',
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    title: 'Bluetooth Speakers',
    shortDesc: 'Portable, waterproof and high-bass wireless bluetooth speakers.',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80',
    iconName: 'Speaker',
    startingPrice: '₹499',
    isFeatured: true,
    subcategories: [
      { id: 'sub-bt-portable', name: 'Portable Bluetooth', slug: 'portable-bluetooth', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80', itemCount: 18 },
      { id: 'sub-bt-mini', name: 'Mini Pocket Speaker', slug: 'mini-speaker', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80', itemCount: 12 },
      { id: 'sub-bt-outdoor', name: 'Waterproof Outdoor', slug: 'waterproof-outdoor', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80', itemCount: 10 },
      { id: 'sub-bt-rgb', name: 'RGB Light Speaker', slug: 'rgb-speaker', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80', itemCount: 14 }
    ]
  },

  // 2. Party Speaker
  {
    id: 'cat-party-speaker',
    name: 'Party Speaker',
    slug: 'party-speaker',
    title: 'Party & DJ Speakers',
    shortDesc: 'High-power party sound with karaoke mics, dual bass and RGB flame lights.',
    imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&auto=format&fit=crop&q=80',
    iconName: 'Volume2',
    startingPrice: '₹1,999',
    isFeatured: true,
    subcategories: [
      { id: 'sub-party-trolley', name: 'Trolley Party Speaker', slug: 'trolley-speaker', imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&auto=format&fit=crop&q=80', itemCount: 8 },
      { id: 'sub-party-double-woofer', name: 'Double Woofer 40W+', slug: 'double-woofer', imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&auto=format&fit=crop&q=80', itemCount: 12 },
      { id: 'sub-party-karaoke', name: 'Karaoke with Mic', slug: 'karaoke-mic', imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&auto=format&fit=crop&q=80', itemCount: 9 },
      { id: 'sub-party-tower', name: 'Tower Speaker', slug: 'tower-speaker', imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&auto=format&fit=crop&q=80', itemCount: 6 }
    ]
  },

  // 3. Projector
  {
    id: 'cat-projector',
    name: 'Projector',
    slug: 'projector',
    title: 'Smart LED Projectors',
    shortDesc: 'Cinema quality home theater projectors and portable business presentations.',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80',
    iconName: 'Tv',
    startingPrice: '₹4,999',
    isFeatured: true,
    subcategories: [
      { id: 'sub-proj-smart-led', name: 'Smart Android Projector', slug: 'smart-projector', imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80', itemCount: 6 },
      { id: 'sub-proj-mini', name: 'Portable Mini Pocket', slug: 'portable-mini', imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80', itemCount: 8 },
      { id: 'sub-proj-4k', name: 'Home Cinema 1080p/4K', slug: 'home-cinema-4k', imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80', itemCount: 5 }
    ]
  },

  // 4. Battery
  {
    id: 'cat-battery',
    name: 'Battery',
    slug: 'battery',
    title: 'Laptop Replacement Batteries',
    shortDesc: '100% compatible OEM replacement batteries for Dell, HP, Lenovo, Asus & Acer.',
    imageUrl: '/images/categories/laptop-batteries.png',
    iconName: 'BatteryCharging',
    startingPrice: '₹1,299',
    isFeatured: true,
    subcategories: [
      { id: 'sub-bat-dell', name: 'Dell Batteries', slug: 'dell-batteries', imageUrl: '/images/categories/laptop-batteries.png', itemCount: 24 },
      { id: 'sub-bat-hp', name: 'HP Batteries', slug: 'hp-batteries', imageUrl: '/images/categories/laptop-batteries.png', itemCount: 28 },
      { id: 'sub-bat-lenovo', name: 'Lenovo ThinkPad Batteries', slug: 'lenovo-batteries', imageUrl: '/images/categories/laptop-batteries.png', itemCount: 19 },
      { id: 'sub-bat-asus-acer', name: 'Asus & Acer Batteries', slug: 'asus-acer-batteries', imageUrl: '/images/categories/laptop-batteries.png', itemCount: 16 }
    ]
  },

  // 5. Power Bank
  {
    id: 'cat-power-bank',
    name: 'Power Bank',
    slug: 'power-bank',
    title: 'Fast Charging Power Banks',
    shortDesc: 'High-capacity 10000mAh to 20000mAh power banks with 65W PD fast charging.',
    imageUrl: 'https://images.unsplash.com/photo-1609592424367-17551fa0d7a0?w=400&auto=format&fit=crop&q=80',
    iconName: 'Zap',
    startingPrice: '₹699',
    isFeatured: true,
    subcategories: [
      { id: 'sub-pb-10000', name: '10000mAh Fast Charge', slug: '10000mah-power-bank', imageUrl: 'https://images.unsplash.com/photo-1609592424367-17551fa0d7a0?w=400&auto=format&fit=crop&q=80', itemCount: 14 },
      { id: 'sub-pb-20000', name: '20000mAh 65W PD', slug: '20000mah-power-bank', imageUrl: 'https://images.unsplash.com/photo-1609592424367-17551fa0d7a0?w=400&auto=format&fit=crop&q=80', itemCount: 10 },
      { id: 'sub-pb-transparent', name: 'Cyberpunk Transparent', slug: 'cyberpunk-power-bank', imageUrl: 'https://images.unsplash.com/photo-1609592424367-17551fa0d7a0?w=400&auto=format&fit=crop&q=80', itemCount: 6 }
    ]
  },

  // 6. Data Cable
  {
    id: 'cat-data-cable',
    name: 'Data Cable',
    slug: 'data-cable',
    title: 'Fast Charging Data Cables',
    shortDesc: 'Braided Type-C to Type-C 100W, Lightning and durable 3-in-1 multi-cables.',
    imageUrl: '/images/categories/cables-and-connectors.png',
    iconName: 'Cable',
    startingPrice: '₹149',
    isFeatured: true,
    subcategories: [
      { id: 'sub-cable-typec', name: 'Type-C to Type-C 100W', slug: 'type-c-cable', imageUrl: '/images/categories/cables-and-connectors.png', itemCount: 22 },
      { id: 'sub-cable-lightning', name: 'iPhone Lightning Cable', slug: 'lightning-cable', imageUrl: '/images/categories/cables-and-connectors.png', itemCount: 15 },
      { id: 'sub-cable-3in1', name: '3-in-1 Fast Cable', slug: '3-in-1-cable', imageUrl: '/images/categories/cables-and-connectors.png', itemCount: 18 }
    ]
  },

  // 7. Wall Charger
  {
    id: 'cat-wall-charger',
    name: 'Wall Charger',
    slug: 'wall-charger',
    title: 'GaN Fast Wall Chargers',
    shortDesc: 'Compact GaN chargers, 30W to 65W dual-port adapters for phone and laptop.',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    iconName: 'Plug',
    startingPrice: '₹299',
    isFeatured: true,
    subcategories: [
      { id: 'sub-charger-gan', name: '65W GaN Charger', slug: '65w-gan-charger', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80', itemCount: 8 },
      { id: 'sub-charger-30w', name: '30W Dual Port Type-C', slug: '30w-charger', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80', itemCount: 12 },
      { id: 'sub-charger-qc3', name: 'Quick Charge 3.0 Adapter', slug: 'qc3-charger', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80', itemCount: 15 }
    ]
  },

  // 8. Adapter
  {
    id: 'cat-adapter',
    name: 'Adapter',
    slug: 'adapter',
    title: 'Laptop Power Adapters',
    shortDesc: 'Original & compatible 65W, 90W chargers for Dell, HP, Lenovo and MacBooks.',
    imageUrl: '/images/categories/laptop-adapters.png',
    iconName: 'Laptop',
    startingPrice: '₹650',
    isFeatured: true,
    subcategories: [
      { id: 'sub-adapt-dell', name: 'Dell 65W/90W Adapter', slug: 'dell-adapter', imageUrl: '/images/categories/laptop-adapters.png', itemCount: 30 },
      { id: 'sub-adapt-hp', name: 'HP Blue Pin Adapter', slug: 'hp-adapter', imageUrl: '/images/categories/laptop-adapters.png', itemCount: 32 },
      { id: 'sub-adapt-lenovo', name: 'Lenovo Square & Type-C', slug: 'lenovo-adapter', imageUrl: '/images/categories/laptop-adapters.png', itemCount: 25 },
      { id: 'sub-adapt-universal', name: 'Universal Laptop Charger', slug: 'universal-adapter', imageUrl: '/images/categories/laptop-adapters.png', itemCount: 14 }
    ]
  },

  // 9. TWS
  {
    id: 'cat-tws',
    name: 'TWS',
    slug: 'tws',
    title: 'True Wireless Earbuds (TWS)',
    shortDesc: 'Active noise cancellation earbuds, ultra-low gaming latency & 40hr battery.',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    iconName: 'Headphones',
    startingPrice: '₹799',
    isFeatured: true,
    subcategories: [
      { id: 'sub-tws-anc', name: 'Active Noise Cancellation (ANC)', slug: 'anc-tws', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80', itemCount: 14 },
      { id: 'sub-tws-gaming', name: 'Low Latency Gaming TWS', slug: 'gaming-tws', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80', itemCount: 16 },
      { id: 'sub-tws-calling', name: 'ENC Quad Mic Calling', slug: 'calling-tws', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80', itemCount: 11 }
    ]
  },

  // 10. Headset
  {
    id: 'cat-headset',
    name: 'Headset',
    slug: 'headset',
    title: 'Over-Ear Headphones & Headsets',
    shortDesc: 'Wireless Bluetooth headsets, RGB gaming headphones and studio monitors.',
    imageUrl: '/images/categories/headsets.png',
    iconName: 'Headphones',
    startingPrice: '₹599',
    isFeatured: true,
    subcategories: [
      { id: 'sub-head-wireless', name: 'Over-Ear Wireless', slug: 'wireless-headset', imageUrl: '/images/categories/headsets.png', itemCount: 15 },
      { id: 'sub-head-gaming', name: 'RGB Gaming Headset with Mic', slug: 'gaming-headset', imageUrl: '/images/categories/headsets.png', itemCount: 18 },
      { id: 'sub-head-office', name: 'Office Call Headset', slug: 'office-headset', imageUrl: '/images/categories/headsets.png', itemCount: 10 }
    ]
  },

  // 11. Neck Band
  {
    id: 'cat-neck-band',
    name: 'Neck Band',
    slug: 'neck-band',
    title: 'Wireless Bluetooth Neckbands',
    shortDesc: 'Magnetic earbuds, fast charge 40+ hours playtime, sweatproof sports neckbands.',
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop&q=80',
    iconName: 'Headphones',
    startingPrice: '₹499',
    isFeatured: true,
    subcategories: [
      { id: 'sub-neck-sports', name: 'Magnetic Sports Neckband', slug: 'sports-neckband', imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop&q=80', itemCount: 16 },
      { id: 'sub-neck-battery', name: '40-Hour Ultra Battery', slug: 'long-battery-neckband', imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop&q=80', itemCount: 12 },
      { id: 'sub-neck-bass', name: 'Deep Bass Boost', slug: 'bass-neckband', imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop&q=80', itemCount: 14 }
    ]
  },

  // 12. Car Accessories
  {
    id: 'cat-car-accessories',
    name: 'Car Accessories',
    slug: 'car-accessories',
    title: 'Car Chargers & Tech Accessories',
    shortDesc: 'Fast USB car chargers, magnetic phone holders and FM audio transmitters.',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&auto=format&fit=crop&q=80',
    iconName: 'Car',
    startingPrice: '₹249',
    isFeatured: true,
    subcategories: [
      { id: 'sub-car-charger', name: 'Dual USB Fast Car Charger', slug: 'car-charger', imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&auto=format&fit=crop&q=80', itemCount: 10 },
      { id: 'sub-car-mount', name: 'Magnetic Phone Mount', slug: 'car-phone-mount', imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&auto=format&fit=crop&q=80', itemCount: 8 },
      { id: 'sub-car-fm', name: 'Bluetooth FM Transmitter', slug: 'car-fm-transmitter', imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&auto=format&fit=crop&q=80', itemCount: 7 }
    ]
  },

  // 13. Monitor
  {
    id: 'cat-monitor',
    name: 'Monitor',
    slug: 'monitor',
    title: 'Frameless & Gaming Monitors',
    shortDesc: 'Full HD IPS monitors, 100Hz/165Hz gaming displays and borderless office screens.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
    iconName: 'Monitor',
    startingPrice: '₹4,499',
    isFeatured: true,
    subcategories: [
      { id: 'sub-mon-24ips', name: '24-inch IPS 75Hz/100Hz', slug: '24-inch-monitor', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80', itemCount: 14 },
      { id: 'sub-mon-gaming', name: '27-inch 165Hz Gaming Monitor', slug: 'gaming-monitor-165hz', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80', itemCount: 9 },
      { id: 'sub-mon-curved', name: 'Curved Frameless Display', slug: 'curved-monitor', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80', itemCount: 6 }
    ]
  },

  // 14. Cooling Pad
  {
    id: 'cat-cooling-pad',
    name: 'Cooling Pad',
    slug: 'cooling-pad',
    title: 'Laptop Cooling Pads & Stands',
    shortDesc: 'Dual and 5-fan RGB cooling stands with adjustable height for thermal protection.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    iconName: 'Fan',
    startingPrice: '₹499',
    isFeatured: true,
    subcategories: [
      { id: 'sub-cool-dual', name: 'Dual 140mm Silent Fan', slug: 'dual-fan-pad', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80', itemCount: 11 },
      { id: 'sub-cool-5fan', name: '5-Fan High Speed RGB Cooler', slug: '5-fan-rgb-cooler', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80', itemCount: 8 },
      { id: 'sub-cool-stand', name: 'Ergonomic Aluminum Riser', slug: 'laptop-riser', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80', itemCount: 10 }
    ]
  },

  // 15. Docks And Hubs
  {
    id: 'cat-docks-and-hubs',
    name: 'Docks And Hubs',
    slug: 'docks-and-hubs',
    title: 'USB-C Docks & Multiport Hubs',
    shortDesc: 'Type-C hubs with 4K HDMI, Gigabit Ethernet, SD card readers and fast USB 3.0.',
    imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&auto=format&fit=crop&q=80',
    iconName: 'Cpu',
    startingPrice: '₹449',
    isFeatured: true,
    subcategories: [
      { id: 'sub-hub-8in1', name: '8-in-1 Type-C Multiport Dock', slug: '8-in-1-type-c-hub', imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&auto=format&fit=crop&q=80', itemCount: 12 },
      { id: 'sub-hub-usb4', name: '4-Port High Speed USB 3.0 Hub', slug: '4-port-usb-hub', imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&auto=format&fit=crop&q=80', itemCount: 16 },
      { id: 'sub-hub-ethernet', name: 'Gigabit Ethernet LAN Dongle', slug: 'ethernet-dongle', imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&auto=format&fit=crop&q=80', itemCount: 9 }
    ]
  },

  // 16. Smart Gadgets
  {
    id: 'cat-smart-gadgets',
    name: 'Smart Gadgets',
    slug: 'smart-gadgets',
    title: 'Smart Gadgets & Repair Tools',
    shortDesc: 'Precision screwdrivers, electric air dusters, cleaning kits and desk accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    iconName: 'Wrench',
    startingPrice: '₹199',
    isFeatured: true,
    subcategories: [
      { id: 'sub-gadget-screwdriver', name: 'Precision Electric Screwdriver', slug: 'electric-screwdriver', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80', itemCount: 7 },
      { id: 'sub-gadget-thermal', name: 'Thermal Paste & Service Kits', slug: 'thermal-paste-kits', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80', itemCount: 14 },
      { id: 'sub-gadget-duster', name: 'Compressed Air Duster Vacuum', slug: 'air-duster', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80', itemCount: 6 }
    ]
  },

  // 17. Keyboard And Mouse
  {
    id: 'cat-keyboard-and-mouse',
    name: 'Keyboard And Mouse',
    slug: 'keyboard-and-mouse',
    title: 'Keyboard & Mouse Combos',
    shortDesc: 'Wireless desktop sets, whisper-quiet office keyboards and ergonomic mice.',
    imageUrl: '/images/categories/laptop-keyboard.png',
    iconName: 'Keyboard',
    startingPrice: '₹349',
    isFeatured: true,
    subcategories: [
      { id: 'sub-km-wireless', name: 'Wireless Desktop Combo', slug: 'wireless-combo', imageUrl: '/images/categories/laptop-keyboard.png', itemCount: 22 },
      { id: 'sub-km-silent', name: 'Silent Keyboard Mouse Set', slug: 'silent-combo', imageUrl: '/images/categories/laptop-keyboard.png', itemCount: 15 },
      { id: 'sub-km-standard', name: 'USB Standard Wired Combo', slug: 'wired-combo', imageUrl: '/images/categories/laptop-keyboard.png', itemCount: 26 }
    ]
  },

  // 18. Gaming Keyboard Mouse
  {
    id: 'cat-gaming-keyboard-mouse',
    name: 'Gaming Keyboard Mouse',
    slug: 'gaming-keyboard-mouse',
    title: 'Gaming Keyboards & RGB Mice',
    shortDesc: 'Blue mechanical switch keyboards, 7200DPI precision optical mice with RGB.',
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=80',
    iconName: 'Gamepad2',
    startingPrice: '₹699',
    isFeatured: true,
    subcategories: [
      { id: 'sub-gkm-mech', name: 'RGB Mechanical Blue Switch', slug: 'mechanical-keyboard', imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=80', itemCount: 14 },
      { id: 'sub-gkm-mouse', name: 'RGB Optical Gaming Mouse', slug: 'rgb-gaming-mouse', imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=80', itemCount: 18 },
      { id: 'sub-gkm-tkl', name: 'Tenkeyless (TKL) RGB Combo', slug: 'tkl-rgb-combo', imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=80', itemCount: 11 }
    ]
  },

  // 19. Gaming Cabinet
  {
    id: 'cat-gaming-cabinet',
    name: 'Gaming Cabinet',
    slug: 'gaming-cabinet',
    title: 'PC Gaming Cabinets & Cases',
    shortDesc: 'Tempered glass RGB gaming cabinets with high airflow mesh front and ARGB fans.',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    iconName: 'Box',
    startingPrice: '₹1,899',
    isFeatured: true,
    subcategories: [
      { id: 'sub-cab-glass', name: 'Mid-Tower Panoramic Glass', slug: 'panoramic-glass-cabinet', imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80', itemCount: 10 },
      { id: 'sub-cab-mesh', name: 'High Airflow Mesh Front', slug: 'mesh-airflow-cabinet', imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80', itemCount: 12 },
      { id: 'sub-cab-dual', name: 'Dual Chamber RGB Showcase', slug: 'dual-chamber-case', imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80', itemCount: 7 }
    ]
  },

  // 20. Extension Board
  {
    id: 'cat-extension-board',
    name: 'Extension Board',
    slug: 'extension-board',
    title: 'Spike Guard & Extension Boards',
    shortDesc: 'Heavy-duty 4-way to 6-way surge protectors with individual switches and USB.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    iconName: 'PlugZap',
    startingPrice: '₹299',
    isFeatured: true,
    subcategories: [
      { id: 'sub-ext-4way', name: '4-Way Spike Guard Surge Protector', slug: '4-way-spike-guard', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80', itemCount: 15 },
      { id: 'sub-ext-6way', name: '6-Socket Board with Dual USB', slug: '6-socket-usb-board', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80', itemCount: 12 },
      { id: 'sub-ext-heavy', name: 'Heavy Duty Master Switch Board', slug: 'heavy-duty-board', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80', itemCount: 8 }
    ]
  },

  // 21. Home Theater
  {
    id: 'cat-home-theater',
    name: 'Home Theater',
    slug: 'home-theater',
    title: 'Soundbars & Home Theaters',
    shortDesc: '2.1 and 5.1 Bluetooth soundbars with dedicated wired/wireless subwoofers.',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80',
    iconName: 'Tv2',
    startingPrice: '₹1,999',
    isFeatured: true,
    subcategories: [
      { id: 'sub-ht-soundbar', name: '2.1 Soundbar with Subwoofer', slug: '2.1-soundbar', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80', itemCount: 9 },
      { id: 'sub-ht-surround', name: '5.1 Dolby Surround Rigs', slug: '5.1-surround', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80', itemCount: 5 },
      { id: 'sub-ht-bluetooth', name: 'Bluetooth Home Audio Bar', slug: 'bluetooth-audio-bar', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80', itemCount: 8 }
    ]
  },

  // 22. Webcam
  {
    id: 'cat-webcam',
    name: 'Webcam',
    slug: 'webcam',
    title: 'Full HD Webcams for PC & Laptop',
    shortDesc: '1080p and 2K webcams with noise-canceling dual microphones and privacy shutter.',
    imageUrl: '/images/categories/web-cams.png',
    iconName: 'Camera',
    startingPrice: '₹799',
    isFeatured: true,
    subcategories: [
      { id: 'sub-web-1080p', name: '1080p FHD Clip-on Webcam', slug: '1080p-webcam', imageUrl: '/images/categories/web-cams.png', itemCount: 14 },
      { id: 'sub-web-2k', name: '2K/4K Streaming Camera', slug: '2k-streaming-webcam', imageUrl: '/images/categories/web-cams.png', itemCount: 7 },
      { id: 'sub-web-privacy', name: 'Privacy Shutter Dual Mic Cam', slug: 'privacy-shutter-webcam', imageUrl: '/images/categories/web-cams.png', itemCount: 9 }
    ]
  },

  // 23. Smart Watch
  {
    id: 'cat-smart-watch',
    name: 'Smart Watch',
    slug: 'smart-watch',
    title: 'Smartwatches & Fitness Bands',
    shortDesc: 'Bluetooth calling smartwatches, AMOLED displays, sports tracking & long battery.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    iconName: 'Watch',
    startingPrice: '₹999',
    isFeatured: true,
    subcategories: [
      { id: 'sub-watch-calling', name: 'Bluetooth Calling Smartwatch', slug: 'bluetooth-calling-watch', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80', itemCount: 15 },
      { id: 'sub-watch-amoled', name: 'AMOLED Always-On Display', slug: 'amoled-smartwatch', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80', itemCount: 10 },
      { id: 'sub-watch-sports', name: 'Rugged Sports Fitness Watch', slug: 'sports-fitness-watch', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80', itemCount: 12 }
    ]
  },

  // 24. Home Appliances
  {
    id: 'cat-home-appliances',
    name: 'Home Appliances',
    slug: 'home-appliances',
    title: 'Kitchen & Smart Home Appliances',
    shortDesc: '2000W induction cooktops, electric kettles and smart home automated sockets.',
    imageUrl: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=400&auto=format&fit=crop&q=80',
    iconName: 'Home',
    startingPrice: '₹699',
    isFeatured: true,
    subcategories: [
      { id: 'sub-app-induction', name: '2000W Induction Cooktop', slug: 'induction-cooktop', imageUrl: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=400&auto=format&fit=crop&q=80', itemCount: 8 },
      { id: 'sub-app-kettle', name: 'Electric Stainless Steel Kettle', slug: 'electric-kettle', imageUrl: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=400&auto=format&fit=crop&q=80', itemCount: 10 },
      { id: 'sub-app-smart-plug', name: 'Smart WiFi Socket & Timer', slug: 'smart-wifi-socket', imageUrl: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=400&auto=format&fit=crop&q=80', itemCount: 7 }
    ]
  },

  // 25. Computer & Laptops (Core)
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
      { id: 'sub-lap-new', name: 'Brand New Laptops', slug: 'new-laptops', imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/xs0h04dj.webp', itemCount: 45 },
      { id: 'sub-lap-refurb', name: 'Refurbished Business Laptops', slug: 'refurbished-laptops', imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/xkKf6HNX.webp', itemCount: 28 },
      { id: 'sub-lap-desktop', name: 'Custom Desktop PC Rigs', slug: 'desktop-pcs', imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/242BcPaL.webp', itemCount: 16 }
    ]
  },

  // 26. Laptop Parts & Spares (Core)
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
      { id: 'sub-lp-screen', name: 'Laptop Screens & Panels', slug: 'laptop-screens', imageUrl: '/images/categories/laptop-screen.png', itemCount: 35 },
      { id: 'sub-lp-hinges', name: 'Laptop Hinges & Covers', slug: 'laptop-hinges', imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/OwGeDQwz.webp', itemCount: 22 },
      { id: 'sub-lp-dcjack', name: 'DC Power Jacks & Connectors', slug: 'laptop-dc-jacks', imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/z5NcNjVt.webp', itemCount: 18 }
    ]
  },

  // 27. Storage, SSD & RAM (Core)
  {
    id: 'cat-storage',
    name: 'Storage & Parts',
    slug: 'storage-and-parts',
    title: 'NVMe SSDs, RAM & Internal Storage',
    shortDesc: 'High-speed NVMe M.2 SSDs, 2.5-inch SATA SSDs, DDR4/DDR5 laptop & desktop RAM.',
    imageUrl: '/images/categories/laptop-ssd.png',
    iconName: 'HardDrive',
    startingPrice: '₹899',
    isFeatured: true,
    subcategories: [
      { id: 'sub-ssd-nvme', name: 'NVMe M.2 High-Speed SSD', slug: 'nvme-ssd', imageUrl: '/images/categories/laptop-ssd.png', itemCount: 32 },
      { id: 'sub-ssd-sata', name: '2.5-inch SATA Internal SSD', slug: 'sata-ssd', imageUrl: '/images/categories/laptop-ssd.png', itemCount: 24 },
      { id: 'sub-ram-ddr4', name: 'Laptop & Desktop RAM (DDR4/DDR5)', slug: 'ram-modules', imageUrl: '/images/categories/laptop-ssd.png', itemCount: 28 }
    ]
  },

  // 28. Printers & Inks (Core)
  {
    id: 'cat-printers',
    name: 'Printers',
    slug: 'printers',
    title: 'Laser Printers, Inks & Toner Cartridges',
    shortDesc: 'Canon, HP, Brother laser printers, compatible toner cartridges and ink refills.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/mdA1IsmY.webp',
    iconName: 'Printer',
    startingPrice: '₹140',
    isFeatured: true,
    subcategories: [
      { id: 'sub-print-toner', name: 'Laser Toner Cartridges (12A/88A/78A)', slug: 'toner-cartridges', imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/mdA1IsmY.webp', itemCount: 26 },
      { id: 'sub-print-powder', name: 'Toner Refill Powder & Ribbons', slug: 'toner-powder-ribbons', imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/mdA1IsmY.webp', itemCount: 18 },
      { id: 'sub-print-gears', name: 'Printer Spare Rollers & Gears', slug: 'printer-parts', imageUrl: 'https://cdn.dotpe.in/longtail/item_category/8473996/E5hi5myU.webp', itemCount: 15 }
    ]
  },

  // 29. CCTV & Security (Core)
  {
    id: 'cat-cctv',
    name: 'CCTV & Security',
    slug: 'cctv-and-security',
    title: 'CCTV Cameras, DVRs & Security Surveillance',
    shortDesc: 'CP-PLUS, Hikvision HD night-vision cameras, 4CH/8CH DVR kits, SMPS & wire bundles.',
    imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/cJZR0B6A.webp',
    iconName: 'Shield',
    startingPrice: '₹850',
    isFeatured: true,
    subcategories: [
      { id: 'sub-cctv-bullet', name: 'Outdoor Waterproof Bullet Cameras', slug: 'bullet-cctv', imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/cJZR0B6A.webp', itemCount: 16 },
      { id: 'sub-cctv-dome', name: 'Indoor Wide-Angle Dome Cameras', slug: 'dome-cctv', imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/cJZR0B6A.webp', itemCount: 14 },
      { id: 'sub-cctv-dvr', name: '4CH & 8CH DVR Surveillance Kits', slug: 'dvr-kits', imageUrl: 'https://cdn.dotpe.in/longtail/item_collection/8473996/cJZR0B6A.webp', itemCount: 8 }
    ]
  }
];
