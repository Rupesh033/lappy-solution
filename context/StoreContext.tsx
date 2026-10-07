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
  position: number;
  isVisible: boolean;
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
  deleteProductFromDb: (id: string) => Promise<void>;
  updateHomepageSections: (sections: CMSSection[]) => Promise<void>;
  syncWithDatabase: () => Promise<void>;
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
  upiId: '9608828288@okbizaxis',
  upiName: 'LAPPY SOLUTION GARHWA',
  codEnabled: true,
  gstRate: 18,
  gstin: '20AABCL1234F1Z5',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<any[]>(INITIAL_ORDERS);
  const [leads, setLeads] = useState<any[]>(INITIAL_LEADS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings);
  const [banners, setBanners] = useState<CMSBanner[]>([]);
  const [homepageSections, setHomepageSections] = useState<CMSSection[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(DEFAULT_INVOICE_SETTINGS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'orders' | 'wishlist'>('orders');
  const [toast, setToast] = useState<string | null>(null);

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
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (data.paymentSettings) setPaymentSettings(data.paymentSettings);
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
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedLeads = localStorage.getItem('ls_leads');
      if (savedLeads) setLeads(JSON.parse(savedLeads));

      const savedProducts = localStorage.getItem('ls_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedInvoices = localStorage.getItem('ls_invoices');
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices));
      } else {
        const initialInvs = INITIAL_ORDERS.map((ord, idx) => {
          const cfg = { ...DEFAULT_INVOICE_SETTINGS, nextNumber: 10245 + idx };
          return buildInvoiceFromOrder({ order: ord, settings: cfg });
        });
        setInvoices(initialInvs);
        try {
          localStorage.setItem('ls_invoices', JSON.stringify(initialInvs));
        } catch (e) {}
      }

      const savedInvSettings = localStorage.getItem('ls_invoice_settings');
      if (savedInvSettings) {
        setInvoiceSettings(JSON.parse(savedInvSettings));
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
    const updated = [newOrder, ...orders];
    setOrders(updated);
    setCart([]);
    
    // Automatically generate dynamic GST tax invoice
    const newInvoice = createInvoiceFromOrder(newOrder);

    try {
      localStorage.setItem('ls_orders', JSON.stringify(updated));
      localStorage.setItem('ls_last_order', JSON.stringify(newOrder));
      localStorage.setItem('ls_last_invoice', JSON.stringify(newInvoice));
      localStorage.setItem('ls_cart', JSON.stringify([]));
      
      // Persist to SQLite Database via Server API
      await fetch('/api/cms/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch (e) {
      console.error('Order save error:', e);
    }
    showToast(`Order #${newOrder.orderId} placed & Invoice #${newInvoice.invoiceNumber} generated!`);
    return newInvoice;
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
    } catch (e) {}
  };

  const updateOrders = async (ords: any[]) => {
    setOrders(ords);
    try {
      localStorage.setItem('ls_orders', JSON.stringify(ords));
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
      await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteSettings: updated }),
      });
      showToast('Site settings updated in database!');
    } catch (e) {
      console.error('Failed to update site settings:', e);
    }
  };

  const updateThemeSettings = async (theme: Partial<ThemeSettings>) => {
    const updated = { ...themeSettings, ...theme };
    setThemeSettings(updated);
    try {
      await fetch('/api/cms/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast('Theme colors updated in database!');
    } catch (e) {
      console.error('Failed to update theme:', e);
    }
  };

  const updatePaymentSettings = async (payment: Partial<PaymentSettings>) => {
    const updated = { ...paymentSettings, ...payment };
    setPaymentSettings(updated);
    try {
      await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentSettings: updated }),
      });
      showToast('Payment & UPI settings updated in database!');
    } catch (e) {
      console.error('Failed to update payment settings:', e);
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
        deleteProductFromDb,
        updateHomepageSections,
        syncWithDatabase,
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
