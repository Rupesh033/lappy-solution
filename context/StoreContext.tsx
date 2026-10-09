'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { STORE_INFO, INITIAL_ORDERS, INITIAL_LEADS } from '../data/storeData';
import { CartItem } from '../components/CartDrawer';
import { 
  Invoice, 
  InvoiceSettings, 
  DEFAULT_INVOICE_SETTINGS, 
  buildInvoiceFromOrder, 
  formatInvoiceNumber 
} from '../lib/invoiceUtils';
import { supabase, signInWithGoogle, signOutCustomer, User } from '../lib/supabase';
import { Coupon, INITIAL_COUPONS, calculateCouponDiscount } from '../data/coupons';

export type { Coupon };


export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  timings: string;
  announcementText: string;
  maintenanceMode: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  dealColor: string;
  canvasBg: string;
  fontFamily: string;
  borderRadius: string;
}

export interface PaymentSettings {
  upiId: string;
  upiName: string;
  codEnabled: boolean;
  gstRate: number;
  gstin: string;
}

export interface CMSBanner {
  id: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  badge?: string;
  desktopImage: string;
  mobileImage?: string;
  buttonText: string;
  buttonUrl: string;
  whatsappMsg?: string;
  bgGradient: string;
  position: number;
  status: string;
}

export interface CMSSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  productIds?: string | string[] | null;
  position: number;
  isVisible: boolean;
}

export interface CMSCustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  tags?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlistIds: string[];
  orders: any[];
  leads: any[];
  siteSettings: SiteSettings;
  themeSettings: ThemeSettings;
  paymentSettings: PaymentSettings;
  banners: CMSBanner[];
  homepageSections: CMSSection[];
  customPages: CMSCustomPage[];
  blogPosts: CMSBlogPost[];
  invoices: Invoice[];
  invoiceSettings: InvoiceSettings;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  accountTab: 'orders' | 'wishlist';
  setAccountTab: (tab: 'orders' | 'wishlist') => void;
  toast: string | null;
  showToast: (msg: string) => void;
  addToCart: (p: Product) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (p: Product) => void;
  placeOrder: (order: any) => Promise<Invoice>;
  createLead: (lead: any) => void;
  updateProducts: (prods: Product[]) => void;
  updateOrders: (ords: any[]) => void;
  updateLeads: (lds: any[]) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateThemeSettings: (theme: Partial<ThemeSettings>) => Promise<void>;
  updatePaymentSettings: (payment: Partial<PaymentSettings>) => Promise<void>;
  updateStoreAndPaymentSettings: (site: Partial<SiteSettings>, payment: Partial<PaymentSettings>) => Promise<void>;
  updateInvoiceSettings: (settings: Partial<InvoiceSettings>) => void;
  createInvoiceFromOrder: (order: any, buyerGstin?: string, isInterstate?: boolean) => Invoice;
  createManualInvoice: (invoice: Partial<Invoice>) => Invoice;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (idOrNumber: string) => Invoice | undefined;
  getInvoiceByOrderId: (orderId: string) => Invoice | undefined;
  updateBanners: (banners: CMSBanner[]) => Promise<void>;
  addBanner: (banner: Partial<CMSBanner>) => Promise<void>;
  editBanner: (banner: CMSBanner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addProductToDb: (prod: Partial<Product>) => Promise<void>;
  updateProductInDb: (id: string, updatedFields: Partial<Product>) => Promise<boolean>;
  deleteProductFromDb: (id: string) => Promise<void>;
  updateHomepageSections: (sections: CMSSection[]) => Promise<void>;
  updateHomepageSectionDetails: (sectionKey: string, details: Partial<CMSSection>) => Promise<void>;
  updateHomepageSectionProducts: (sectionKey: string, productIds: string[]) => Promise<void>;
  addCustomPage: (page: Partial<CMSCustomPage>) => Promise<CMSCustomPage>;
  editCustomPage: (page: CMSCustomPage) => Promise<void>;
  deleteCustomPage: (id: string) => Promise<void>;
  addBlogPost: (post: Partial<CMSBlogPost>) => Promise<CMSBlogPost>;
  editBlogPost: (post: CMSBlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  syncWithDatabase: () => Promise<void>;
  customer: User | null;
  isCustomerLoading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  loginCustomerManually: (userData: { id?: string; email: string; name?: string; picture?: string }) => void;
  signOutCustomer: () => Promise<void>;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string, orderTotal: number) => { success: boolean; message: string; discount: number };
  removeCoupon: () => void;
  createCoupon: (couponData: any) => Promise<{ success: boolean; message?: string }>;
  updateCoupon: (id: string, couponData: any) => Promise<{ success: boolean; message?: string }>;
  deleteCoupon: (id: string) => Promise<{ success: boolean; message?: string }>;
  fetchCoupons: () => Promise<void>;
}


const defaultSiteSettings: SiteSettings = {
  siteName: STORE_INFO.name,
  tagline: STORE_INFO.tagline,
  logo: '/images/logo.png',
  favicon: '/favicon.ico',
  phone: STORE_INFO.phone,
  whatsapp: STORE_INFO.whatsapp,
  email: STORE_INFO.email,
  address: `${STORE_INFO.address}, ${STORE_INFO.city}, ${STORE_INFO.state} - ${STORE_INFO.pincode}`,
  timings: STORE_INFO.timings,
  announcementText: '100% Asli Samaan • 18% GST Bill • Garhwa & Palamu Delivery',
  maintenanceMode: false,
};

const defaultThemeSettings: ThemeSettings = {
  primaryColor: '#1A56DB',
  secondaryColor: '#FB641B',
  dealColor: '#15803D',
  canvasBg: '#F1F3F6',
  fontFamily: 'Plus Jakarta Sans',
  borderRadius: '12px',
};

const defaultPaymentSettings: PaymentSettings = {
  upiId: 'lappy.solution@ybl',
  upiName: 'LAPIEZ GARHWA',
  codEnabled: true,
  gstRate: 18,
  gstin: '20AABCL1234F1Z5',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings);
  const [banners, setBanners] = useState<CMSBanner[]>([]);
  const [homepageSections, setHomepageSections] = useState<CMSSection[]>([]);
  const [customPages, setCustomPages] = useState<CMSCustomPage[]>([]);
  const [blogPosts, setBlogPosts] = useState<CMSBlogPost[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(DEFAULT_INVOICE_SETTINGS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'orders' | 'wishlist'>('orders');
  const [toast, setToast] = useState<string | null>(null);
  const [customer, setCustomer] = useState<User | null>(null);
  const [isCustomerLoading, setIsCustomerLoading] = useState(true);

  // Monitor Supabase Customer Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCustomer(session.user);
      } else {
        try {
          const local = localStorage.getItem('ls_customer_session');
          if (local) setCustomer(JSON.parse(local));
        } catch (e) {}
      }
      setIsCustomerLoading(false);
    }).catch(() => {
      try {
        const local = localStorage.getItem('ls_customer_session');
        if (local) setCustomer(JSON.parse(local));
      } catch (e) {}
      setIsCustomerLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCustomer(session.user);
        try {
          localStorage.setItem('ls_customer_session', JSON.stringify(session.user));
        } catch (e) {}
      }
      setIsCustomerLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginCustomerManually = (userData: { id?: string; email: string; name?: string; picture?: string }) => {
    const userObj: any = {
      id: userData.id || `usr-${Date.now()}`,
      email: userData.email,
      user_metadata: {
        full_name: userData.name || userData.email.split('@')[0],
        name: userData.name || userData.email.split('@')[0],
        avatar_url: userData.picture || '',
        picture: userData.picture || '',
        email: userData.email,
      },
    };
    setCustomer(userObj);
    try {
      localStorage.setItem('ls_customer_session', JSON.stringify(userObj));
    } catch (e) {}
    showToast(`Welcome ${userObj.user_metadata.full_name}!`);
  };

  const handleSignInWithGoogle = async (redirectTo?: string) => {
    try {
      await signInWithGoogle(redirectTo);
    } catch (err: any) {
      showToast(err?.message || 'Google sign-in failed');
      throw err;
    }
  };

  const handleSignOutCustomer = async () => {
    try {
      await signOutCustomer().catch(() => {});
    } catch (err: any) {}
    setCustomer(null);
    try {
      localStorage.removeItem('ls_customer_session');
    } catch (e) {}
    showToast('Signed out of customer account');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };


  // Synchronize state with Database via CMS API routes
  const syncWithDatabase = useCallback(async () => {
    try {
      // 1. Settings
      const resSettings = await fetch('/api/cms/settings');
      if (resSettings.ok) {
        const data = await resSettings.json();
        if (data.siteSettings) {
          const site = {
            ...data.siteSettings,
            siteName: data.siteSettings.siteName || 'Lapiez',
          };
          setSiteSettings(site);
          try {
            localStorage.setItem('ls_site_settings', JSON.stringify(site));
          } catch (e) {}
        }
        if (data.paymentSettings) {
          const payment = {
            ...data.paymentSettings,
            upiId: data.paymentSettings.upiId || 'lappy.solution@ybl',
            upiName: data.paymentSettings.upiName || 'LAPIEZ GARHWA',
          };
          setPaymentSettings(payment);
          try {
            localStorage.setItem('ls_payment_settings', JSON.stringify(payment));
          } catch (e) {}
        }
      }

      // 2. Theme
      const resTheme = await fetch('/api/cms/theme');
      if (resTheme.ok) {
        const data = await resTheme.json();
        if (data.themeSettings) setThemeSettings(data.themeSettings);
      }

      // 3. Banners
      const resBanners = await fetch('/api/cms/banners');
      if (resBanners.ok) {
        const data = await resBanners.json();
        if (data.banners && data.banners.length > 0) setBanners(data.banners);
      }

      // 4. Homepage Sections
      const resSections = await fetch('/api/cms/homepage-sections');
      if (resSections.ok) {
        const data = await resSections.json();
        if (data.sections && data.sections.length > 0) setHomepageSections(data.sections);
      }

      // 5. Products
      const resProducts = await fetch('/api/cms/products');
      if (resProducts.ok) {
        const data = await resProducts.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          localStorage.setItem('ls_products', JSON.stringify(data.products));
        }
      }

      // 6. Orders
      const resOrders = await fetch('/api/cms/orders');
      if (resOrders.ok) {
        const data = await resOrders.json();
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
          localStorage.setItem('ls_orders', JSON.stringify(data.orders));
        }
      }

      // 7. Custom Pages
      const resPages = await fetch('/api/cms/pages');
      if (resPages.ok) {
        const data = await resPages.json();
        if (data.pages) {
          setCustomPages(data.pages);
          try {
            localStorage.setItem('ls_custom_pages', JSON.stringify(data.pages));
          } catch (e) {}
        }
      }

      // 8. Blog Posts
      const resBlogs = await fetch('/api/cms/blogs');
      if (resBlogs.ok) {
        const data = await resBlogs.json();
        if (data.blogs) {
          setBlogPosts(data.blogs);
          try {
            localStorage.setItem('ls_blog_posts', JSON.stringify(data.blogs));
          } catch (e) {}
        }
      }

      // 9. Coupons
      try {
        const resCoupons = await fetch('/api/cms/coupons');
        if (resCoupons.ok) {
          const data = await resCoupons.json();
          if (Array.isArray(data.coupons) && data.coupons.length > 0) {
            setCoupons(data.coupons);
          }
        }
      } catch (e) {}
    } catch (e) {
      console.warn('CMS DB sync fallback to local cache:', e);
    }
  }, []);

  // Initial Load from localStorage & trigger DB sync
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ls_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('ls_wishlist');
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem('ls_orders');
      if (savedOrders) {
        try {
          const parsed = JSON.parse(savedOrders);
          const realOrders = Array.isArray(parsed)
            ? parsed.filter((o: any) => !['LS-10248', 'LS-10247', 'LS-10246'].includes(o.orderId))
            : [];
          setOrders(realOrders);
          localStorage.setItem('ls_orders', JSON.stringify(realOrders));
        } catch {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }

      const savedLeads = localStorage.getItem('ls_leads');
      if (savedLeads) {
        try {
          const parsed = JSON.parse(savedLeads);
          const realLeads = Array.isArray(parsed)
            ? parsed.filter((l: any) => !['lead-101', 'lead-102', 'lead-103', 'lead-104'].includes(l.id))
            : [];
          setLeads(realLeads);
          localStorage.setItem('ls_leads', JSON.stringify(realLeads));
        } catch {
          setLeads([]);
        }
      } else {
        setLeads([]);
      }

      const savedProducts = localStorage.getItem('ls_products');
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          const hasFrontech = Array.isArray(parsed) && parsed.some((p: any) => p.brand === 'Frontech');
          if (hasFrontech && parsed.length >= PRODUCTS.length) {
            setProducts(parsed);
          } else {
            setProducts(PRODUCTS);
            try {
              localStorage.setItem('ls_products', JSON.stringify(PRODUCTS));
            } catch (e) {}
          }
        } catch {
          setProducts(PRODUCTS);
        }
      } else {
        setProducts(PRODUCTS);
      }

      const savedInvoices = localStorage.getItem('ls_invoices');
      if (savedInvoices) {
        try {
          const parsed = JSON.parse(savedInvoices);
          const realInvs = Array.isArray(parsed)
            ? parsed.filter((inv: any) => !['LS-10248', 'LS-10247', 'LS-10246'].includes(inv.orderId))
            : [];
          setInvoices(realInvs);
          localStorage.setItem('ls_invoices', JSON.stringify(realInvs));
        } catch {
          setInvoices([]);
        }
      } else {
        setInvoices([]);
      }

      const savedInvSettings = localStorage.getItem('ls_invoice_settings');
      if (savedInvSettings) {
        setInvoiceSettings(JSON.parse(savedInvSettings));
      }

      const savedPages = localStorage.getItem('ls_custom_pages');
      if (savedPages) setCustomPages(JSON.parse(savedPages));

      const savedBlogs = localStorage.getItem('ls_blog_posts');
      if (savedBlogs) setBlogPosts(JSON.parse(savedBlogs));

      const savedSiteSettings = localStorage.getItem('ls_site_settings');
      if (savedSiteSettings) {
        try {
          const parsed = JSON.parse(savedSiteSettings);
          if (parsed && typeof parsed === 'object') setSiteSettings(parsed);
        } catch (e) {}
      }

      const savedPaymentSettings = localStorage.getItem('ls_payment_settings');
      if (savedPaymentSettings) {
        try {
          const parsed = JSON.parse(savedPaymentSettings);
          if (parsed && typeof parsed === 'object') setPaymentSettings(parsed);
        } catch (e) {}
      }
    } catch (e) {
      console.error('LocalStorage load error:', e);
    }

    syncWithDatabase();
  }, [syncWithDatabase]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx].quantity += 1;
      } else {
        updated = [{ product, quantity: 1 }, ...prev];
      }
      try {
        localStorage.setItem('ls_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateQuantity = (id: string, qty: number) => {
    const updated = cart.map((item) => {
      if (item.product.id === id) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    setCart(updated);
    try {
      localStorage.setItem('ls_cart', JSON.stringify(updated));
    } catch (e) {}
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item.product.id !== id);
    setCart(updated);
    try {
      localStorage.setItem('ls_cart', JSON.stringify(updated));
    } catch (e) {}
    showToast('Item removed from cart');
  };

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      let updated: string[];
      if (prev.includes(product.id)) {
        updated = prev.filter((id) => id !== product.id);
        showToast('Removed from wishlist');
      } else {
        updated = [...prev, product.id];
        showToast('Added to wishlist');
      }
      try {
        localStorage.setItem('ls_wishlist', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const placeOrder = async (newOrder: any): Promise<Invoice> => {
    if (!customer) {
      showToast('Please sign in to your customer account before placing an order.');
      throw new Error('Customer sign-in is strictly required to place an order.');
    }
    try {
      const orderPayload = {
        ...newOrder,
        customerId: customer.id,
        customerEmail: customer.email || newOrder.email,
      };
      const response = await fetch('/api/cms/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Order could not be placed');

      const savedOrder = data.order;
      const updated = [savedOrder, ...orders];
      setOrders(updated);
      setCart([]);
      const newInvoice = createInvoiceFromOrder(savedOrder);
      localStorage.setItem('ls_orders', JSON.stringify(updated));
      localStorage.setItem('ls_last_order', JSON.stringify(savedOrder));
      localStorage.setItem('ls_last_invoice', JSON.stringify(newInvoice));
      localStorage.setItem('ls_cart', JSON.stringify([]));
      showToast(`Order #${savedOrder.orderId} placed. Payment verification is pending.`);
      return newInvoice;
    } catch (e) {
      console.error('Order save error:', e);
      throw e;
    }
  };

  const createLead = (leadData: any) => {
    const newLead = {
      id: `lead-${Date.now()}`,
      customerName: leadData.customerName,
      phone: leadData.phone,
      location: 'Garhwa / Palamu',
      type: leadData.type,
      requirement:
        leadData.requirement ||
        (leadData.type === 'CCTV Setup'
          ? `${leadData.cameraCount}x ${leadData.cameraType} for ${leadData.propertyType}, Storage: ${leadData.storage}`
          : `Custom PC: ${leadData.cpu} + ${leadData.gpu} + ${leadData.ram}`),
      estimatedBudget: leadData.estimatedBudget,
      date: leadData.date || new Date().toISOString().split('T')[0],
      status: 'New' as const,
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    try {
      localStorage.setItem('ls_leads', JSON.stringify(updated));
    } catch (e) {}
    showToast('Consultation request sent to Garhwa showroom!');
  };

  const updateProducts = async (prods: Product[]) => {
    setProducts(prods);
    try {
      localStorage.setItem('ls_products', JSON.stringify(prods));
      const changes = prods.filter((product) => {
        const previous = products.find((current) => current.id === product.id);
        return previous && (previous.inStock !== product.inStock || previous.stockQuantity !== product.stockQuantity);
      });
      await Promise.all(changes.map((product) => fetch('/api/cms/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, inStock: product.inStock, stockQuantity: product.stockQuantity }),
      })));
    } catch (e) {}
  };

  const updateOrders = async (ords: any[]) => {
    setOrders(ords);
    try {
      localStorage.setItem('ls_orders', JSON.stringify(ords));
      const changes = ords.filter((order) => {
        const previous = orders.find((current) => current.orderId === order.orderId);
        return previous && (previous.paymentStatus !== order.paymentStatus || previous.orderStatus !== order.orderStatus);
      });
      await Promise.all(changes.map((order) => fetch('/api/cms/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
        }),
      })));
    } catch (e) {}
  };

  const updateLeads = (lds: any[]) => {
    setLeads(lds);
    try {
      localStorage.setItem('ls_leads', JSON.stringify(lds));
    } catch (e) {}
  };

  // CMS Server Update Handlers
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);
    try {
      localStorage.setItem('ls_site_settings', JSON.stringify(updated));
    } catch (e) {}
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ siteSettings: updated }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      showToast('Store settings saved successfully!');
    } catch (e: any) {
      console.error('Failed to update site settings in DB:', e);
      showToast(`Saved locally! (DB: ${e.message || 'notice'})`);
    }
  };

  const updateThemeSettings = async (theme: Partial<ThemeSettings>) => {
    const updated = { ...themeSettings, ...theme };
    setThemeSettings(updated);
    try {
      const res = await fetch('/api/cms/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      showToast('Theme colors updated in database!');
    } catch (e: any) {
      console.error('Failed to update theme:', e);
      showToast(`Theme saved locally! (DB: ${e.message || 'notice'})`);
    }
  };

  const updatePaymentSettings = async (payment: Partial<PaymentSettings>) => {
    const updated = { ...paymentSettings, ...payment };
    setPaymentSettings(updated);
    try {
      localStorage.setItem('ls_payment_settings', JSON.stringify(updated));
    } catch (e) {}
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ paymentSettings: updated }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      showToast('Payment & UPI settings saved successfully!');
    } catch (e: any) {
      console.error('Failed to update payment settings in DB:', e);
      showToast(`Saved locally! (DB: ${e.message || 'notice'})`);
    }
  };

  const updateStoreAndPaymentSettings = async (
    site: Partial<SiteSettings>,
    payment: Partial<PaymentSettings>
  ) => {
    const updatedSite = { ...siteSettings, ...site };
    const updatedPayment = { ...paymentSettings, ...payment };
    setSiteSettings(updatedSite);
    setPaymentSettings(updatedPayment);
    try {
      localStorage.setItem('ls_site_settings', JSON.stringify(updatedSite));
      localStorage.setItem('ls_payment_settings', JSON.stringify(updatedPayment));
    } catch (e) {}
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ siteSettings: updatedSite, paymentSettings: updatedPayment }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      showToast('Store details & Payment settings saved permanently to database!');
    } catch (e: any) {
      console.error('Failed to update settings in DB:', e);
      showToast(`Settings saved locally! (DB: ${e.message || 'notice'})`);
    }
  };

  // Dynamically apply Theme CSS Variables to document root
  useEffect(() => {
    if (typeof document !== 'undefined' && themeSettings) {
      document.documentElement.style.setProperty('--primary-color', themeSettings.primaryColor || '#1A56DB');
      document.documentElement.style.setProperty('--secondary-color', themeSettings.secondaryColor || '#FB641B');
      document.documentElement.style.setProperty('--deal-color', themeSettings.dealColor || '#15803D');
    }
  }, [themeSettings]);

  const updateBanners = async (newBanners: CMSBanner[]) => {
    setBanners(newBanners);
    showToast('Banners updated!');
  };

  const addBanner = async (bannerData: Partial<CMSBanner>) => {
    try {
      const res = await fetch('/api/cms/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });
      if (res.ok) {
        const data = await res.json();
        setBanners((prev) => [...prev, data.banner]);
        showToast('New Banner added to database!');
      }
    } catch (e) {
      console.error('Failed to add banner:', e);
    }
  };

  const editBanner = async (bannerData: CMSBanner) => {
    try {
      const res = await fetch('/api/cms/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });
      if (res.ok) {
        setBanners((prev) => prev.map((b) => (b.id === bannerData.id ? bannerData : b)));
        showToast('Banner updated in database!');
      }
    } catch (e) {
      console.error('Failed to update banner:', e);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const res = await fetch(`/api/cms/banners?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        showToast('Banner deleted from database!');
      }
    } catch (e) {
      console.error('Failed to delete banner:', e);
    }
  };

  const addProductToDb = async (prod: Partial<Product>) => {
    try {
      const res = await fetch('/api/cms/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod),
      });
      if (res.ok) {
        const data = await res.json();
        const created = data.product;
        setProducts((prev) => [created, ...prev]);
        showToast(`Product "${created.name}" added to database!`);
      }
    } catch (e) {
      console.error('Failed to add product:', e);
    }
  };

  const deleteProductFromDb = async (id: string) => {
    try {
      const res = await fetch(`/api/cms/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('Product deleted from database!');
      }
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  };

  const updateProductInDb = async (id: string, updatedFields: Partial<Product>): Promise<boolean> => {
    try {
      // 1. Instant local state update
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === id || p.sku === id ? { ...p, ...updatedFields } : p));
        try {
          localStorage.setItem('ls_products', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // 2. Persist to Prisma DB
      const res = await fetch('/api/cms/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === data.product.id || p.sku === data.product.sku ? { ...p, ...data.product } : p))
          );
        }
        showToast('Product updated successfully!');
        return true;
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to update product in database');
        return false;
      }
    } catch (e) {
      console.error('Failed to update product:', e);
      showToast('Error saving product changes');
      return false;
    }
  };

  const updateHomepageSections = async (sections: CMSSection[]) => {
    setHomepageSections(sections);
    try {
      await fetch('/api/cms/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      showToast('Homepage section order saved to database!');
    } catch (e) {
      console.error('Failed to update homepage sections:', e);
    }
  };

  const updateHomepageSectionDetails = async (sectionKey: string, details: Partial<CMSSection>) => {
    setHomepageSections((prev) =>
      prev.map((s) => (s.sectionKey === sectionKey ? { ...s, ...details } : s))
    );
    try {
      await fetch('/api/cms/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, ...details }),
      });
      showToast(`Section "${details.title || sectionKey}" updated!`);
    } catch (e) {
      console.error('Failed to update section:', e);
    }
  };

  const updateHomepageSectionProducts = async (sectionKey: string, productIds: string[]) => {
    setHomepageSections((prev) =>
      prev.map((s) => (s.sectionKey === sectionKey ? { ...s, productIds } : s))
    );
    try {
      await fetch('/api/cms/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, productIds }),
      });
      showToast(`Products updated for section!`);
    } catch (e) {
      console.error('Failed to update section products:', e);
    }
  };

  const addCustomPage = async (page: Partial<CMSCustomPage>): Promise<CMSCustomPage> => {
    try {
      const res = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });
      const data = await res.json();
      if (data.page) {
        setCustomPages((prev) => [data.page, ...prev]);
        showToast('Page published successfully!');
        return data.page;
      }
    } catch (e) {
      console.error('Failed to create page:', e);
    }
    const fallback: CMSCustomPage = {
      id: `page-${Date.now()}`,
      slug: page.slug || 'custom-page',
      title: page.title || 'Untitled Page',
      content: page.content || '',
      status: page.status || 'published',
    };
    setCustomPages((prev) => [fallback, ...prev]);
    return fallback;
  };

  const editCustomPage = async (page: CMSCustomPage) => {
    setCustomPages((prev) => prev.map((p) => (p.id === page.id ? page : p)));
    try {
      await fetch('/api/cms/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });
      showToast('Page updated successfully!');
    } catch (e) {
      console.error('Failed to update page:', e);
    }
  };

  const deleteCustomPage = async (id: string) => {
    setCustomPages((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/cms/pages?id=${id}`, { method: 'DELETE' });
      showToast('Page deleted!');
    } catch (e) {
      console.error('Failed to delete page:', e);
    }
  };

  const addBlogPost = async (post: Partial<CMSBlogPost>): Promise<CMSBlogPost> => {
    try {
      const res = await fetch('/api/cms/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const data = await res.json();
      if (data.blog) {
        setBlogPosts((prev) => [data.blog, ...prev]);
        showToast('Blog article published!');
        return data.blog;
      }
    } catch (e) {
      console.error('Failed to create blog:', e);
    }
    const fallback: CMSBlogPost = {
      id: `blog-${Date.now()}`,
      slug: post.slug || 'tech-article',
      title: post.title || 'New Tech Article',
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000',
      category: post.category || 'Hardware Guide',
      author: post.author || 'Lapiez Team',
      readTime: post.readTime || '4 min read',
      status: post.status || 'published',
    };
    setBlogPosts((prev) => [fallback, ...prev]);
    return fallback;
  };

  const editBlogPost = async (post: CMSBlogPost) => {
    setBlogPosts((prev) => prev.map((b) => (b.id === post.id ? post : b)));
    try {
      await fetch('/api/cms/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      showToast('Blog article updated!');
    } catch (e) {
      console.error('Failed to update blog:', e);
    }
  };

  const deleteBlogPost = async (id: string) => {
    setBlogPosts((prev) => prev.filter((b) => b.id !== id));
    try {
      await fetch(`/api/cms/blogs?id=${id}`, { method: 'DELETE' });
      showToast('Blog article deleted!');
    } catch (e) {
      console.error('Failed to delete blog:', e);
    }
  };

  // Coupon Engine Methods
  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/coupons');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.coupons) && data.coupons.length > 0) {
          setCoupons(data.coupons);
        }
      }
    } catch (e) {
      console.error('Failed to fetch coupons:', e);
    }
  }, []);

  const applyCoupon = useCallback((code: string, orderTotal: number) => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code.', discount: 0 };
    }
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode);
    if (!found) {
      return { 
        success: false, 
        message: `Invalid or expired coupon code.`, 
        discount: 0 
      };
    }
    const result = calculateCouponDiscount(found, orderTotal);
    if (!result.isValid) {
      return { success: false, message: result.error || 'Coupon cannot be applied.', discount: 0 };
    }
    setAppliedCoupon(found);
    setCouponDiscount(result.discountAmount);
    showToast(`Coupon "${found.code}" applied! Saved ₹${result.discountAmount.toLocaleString('en-IN')}`);
    return { 
      success: true, 
      message: `Applied ${found.code}! Saved ₹${result.discountAmount.toLocaleString('en-IN')}`, 
      discount: result.discountAmount 
    };
  }, [coupons]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed');
  }, []);

  const createCoupon = useCallback(async (couponData: any) => {
    try {
      const res = await fetch('/api/cms/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon');
      await fetchCoupons();
      showToast(`Coupon ${couponData.code?.toUpperCase()} created successfully!`);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to create coupon' };
    }
  }, [fetchCoupons]);

  const updateCoupon = useCallback(async (id: string, couponData: any) => {
    try {
      const res = await fetch('/api/cms/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...couponData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update coupon');
      await fetchCoupons();
      showToast('Coupon updated successfully!');
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update coupon' };
    }
  }, [fetchCoupons]);

  const deleteCoupon = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/cms/coupons?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete coupon');
      await fetchCoupons();
      showToast('Coupon deleted!');
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to delete coupon' };
    }
  }, [fetchCoupons]);

  // Invoicing Engine Methods
  const createInvoiceFromOrder = (order: any, buyerGstin?: string, isInterstate: boolean = false): Invoice => {
    const currentSettings = { ...invoiceSettings };
    const nextSeq = currentSettings.nextNumber;
    currentSettings.nextNumber = nextSeq + 1;
    setInvoiceSettings(currentSettings);
    try {
      localStorage.setItem('ls_invoice_settings', JSON.stringify(currentSettings));
    } catch (e) {}

    const newInv = buildInvoiceFromOrder({
      order,
      settings: currentSettings,
      customBuyerGstin: buyerGstin,
      isInterstate
    });

    const updated = [newInv, ...invoices.filter((inv) => inv.orderId !== order.orderId && inv.id !== newInv.id)];
    setInvoices(updated);
    try {
      localStorage.setItem('ls_invoices', JSON.stringify(updated));
    } catch (e) {}

    return newInv;
  };

  const createManualInvoice = (manualData: Partial<Invoice>): Invoice => {
    const currentSettings = { ...invoiceSettings };
    const nextSeq = currentSettings.nextNumber;
    currentSettings.nextNumber = nextSeq + 1;
    setInvoiceSettings(currentSettings);
    try {
      localStorage.setItem('ls_invoice_settings', JSON.stringify(currentSettings));
    } catch (e) {}

    const invoiceNumber = formatInvoiceNumber(currentSettings.prefix, currentSettings.financialYear, nextSeq);
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      financialYear: currentSettings.financialYear,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      placeOfSupply: `${currentSettings.state} (${currentSettings.stateCode})`,
      reverseCharge: 'No',
      sellerName: currentSettings.businessName,
      sellerAddress: `${currentSettings.address}, ${currentSettings.city}, ${currentSettings.state} - ${currentSettings.pincode}`,
      sellerGstin: currentSettings.gstin,
      sellerPan: currentSettings.pan,
      sellerPhone: currentSettings.phone,
      sellerEmail: currentSettings.email,
      sellerState: currentSettings.state,
      sellerStateCode: currentSettings.stateCode,
      buyerName: manualData.buyerName || 'Walk-in Customer',
      buyerPhone: manualData.buyerPhone || '+91 9608828288',
      buyerEmail: manualData.buyerEmail,
      buyerAddress: manualData.buyerAddress || 'Garhwa, Jharkhand',
      buyerState: manualData.buyerState || currentSettings.state,
      buyerStateCode: manualData.buyerStateCode || currentSettings.stateCode,
      buyerGstin: manualData.buyerGstin,
      items: manualData.items || [],
      subtotal: manualData.subtotal || 0,
      discountTotal: manualData.discountTotal || 0,
      taxableAmount: manualData.taxableAmount || 0,
      cgstTotal: manualData.cgstTotal || 0,
      sgstTotal: manualData.sgstTotal || 0,
      igstTotal: manualData.igstTotal || 0,
      totalTax: manualData.totalTax || 0,
      shipping: manualData.shipping || 0,
      roundOff: manualData.roundOff || 0,
      grandTotal: manualData.grandTotal || 0,
      amountInWords: manualData.amountInWords || 'Zero Rupees',
      paymentMethod: manualData.paymentMethod || 'Cash on Counter',
      paymentStatus: manualData.paymentStatus || 'Paid',
      upiId: currentSettings.upiId,
      upiQrData: manualData.upiQrData || '',
      notes: manualData.notes || 'Counter sale invoice. 100% genuine guaranteed.',
      terms: currentSettings.termsAndConditions,
      declaration: currentSettings.declaration,
      signatoryTitle: currentSettings.signatoryTitle,
      createdAt: new Date().toISOString(),
      ...manualData
    };

    const updated = [newInv, ...invoices];
    setInvoices(updated);
    try {
      localStorage.setItem('ls_invoices', JSON.stringify(updated));
    } catch (e) {}
    showToast(`Invoice #${newInv.invoiceNumber} generated!`);
    return newInv;
  };

  const updateInvoice = (inv: Invoice) => {
    const updated = invoices.map((i) => (i.id === inv.id || i.invoiceNumber === inv.invoiceNumber ? inv : i));
    setInvoices(updated);
    try {
      localStorage.setItem('ls_invoices', JSON.stringify(updated));
    } catch (e) {}
    showToast(`Invoice #${inv.invoiceNumber} updated!`);
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter((i) => i.id !== id && i.invoiceNumber !== id);
    setInvoices(updated);
    try {
      localStorage.setItem('ls_invoices', JSON.stringify(updated));
    } catch (e) {}
    showToast('Invoice deleted.');
  };

  const updateInvoiceSettings = (settings: Partial<InvoiceSettings>) => {
    const updated = { ...invoiceSettings, ...settings };
    setInvoiceSettings(updated);
    try {
      localStorage.setItem('ls_invoice_settings', JSON.stringify(updated));
    } catch (e) {}
    showToast('Invoice settings saved!');
  };

  const getInvoiceById = (idOrNumber: string) => {
    return invoices.find((i) => i.id === idOrNumber || i.invoiceNumber === idOrNumber);
  };

  const getInvoiceByOrderId = (orderId: string) => {
    return invoices.find((i) => i.orderId === orderId);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlistIds,
        orders,
        leads,
        siteSettings,
        themeSettings,
        paymentSettings,
        banners,
        homepageSections,
        customPages,
        blogPosts,
        invoices,
        invoiceSettings,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        accountTab,
        setAccountTab,
        toast,
        showToast,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        placeOrder,
        createLead,
        updateProducts,
        updateOrders,
        updateLeads,
        updateSiteSettings,
        updateThemeSettings,
        updatePaymentSettings,
        updateStoreAndPaymentSettings,
        updateInvoiceSettings,
        createInvoiceFromOrder,
        createManualInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        getInvoiceByOrderId,
        updateBanners,
        addBanner,
        editBanner,
        deleteBanner,
        addProductToDb,
        updateProductInDb,
        deleteProductFromDb,
        updateHomepageSections,
        updateHomepageSectionDetails,
        updateHomepageSectionProducts,
        addCustomPage,
        editCustomPage,
        deleteCustomPage,
        addBlogPost,
        editBlogPost,
        deleteBlogPost,
        syncWithDatabase,
        customer,
        isCustomerLoading,
        signInWithGoogle: handleSignInWithGoogle,
        loginCustomerManually,
        signOutCustomer: handleSignOutCustomer,
        coupons,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        fetchCoupons,
      }}
    >

      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
