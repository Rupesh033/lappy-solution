'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Check, X, Clock, CheckCircle2, XCircle, 
  Search, Filter, ShoppingBag, Truck, Package, User, 
  Phone, MessageSquare, ExternalLink, MapPin, AlertCircle, 
  RefreshCw, Plus, Edit2, ArrowRight, BarChart3, Layers, 
  QrCode, Receipt, Store, Sparkles, Copy, Eye, EyeOff, 
  ArrowUp, ArrowDown, Palette, Sliders, Image as ImageIcon, 
  Trash2, Save, Lock, Key, FileText, Printer, Building2, Percent, DollarSign,
  BookOpen, Star, Crown, Laptop
} from 'lucide-react';
import { useStore, CMSBanner, CMSSection, CMSCustomPage, CMSBlogPost } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/storeData';
import { Product } from '../../data/products';

export default function AdminPage() {
  const { 
    orders, 
    updateOrders, 
    products, 
    updateProducts, 
    leads, 
    updateLeads, 
    banners,
    addBanner,
    editBanner,
    deleteBanner,
    homepageSections,
    updateHomepageSections,
    updateHomepageSectionDetails,
    updateHomepageSectionProducts,
    customPages,
    blogPosts,
    addCustomPage,
    editCustomPage,
    deleteCustomPage,
    addBlogPost,
    editBlogPost,
    deleteBlogPost,
    siteSettings,
    updateSiteSettings,
    themeSettings,
    updateThemeSettings,
    paymentSettings,
    updatePaymentSettings,
    invoices,
    invoiceSettings,
    updateInvoiceSettings,
    createManualInvoice,
    deleteInvoice,
    updateInvoice,
    addProductToDb,
    deleteProductFromDb,
    syncWithDatabase,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'billing' | 'banners' | 'homepage' | 'pages' | 'blogs' | 'theme' | 'settings' | 'leads'>('orders');
  
  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'verified' | 'packed' | 'shipped' | 'delivered'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Inventory Filter
  const [inventoryCategory, setInventoryCategory] = useState<string>('All');
  const [inventorySearch, setInventorySearch] = useState('');

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Laptops' | 'Computers' | 'CCTV & Security' | 'Printers' | 'Accessories' | 'Storage & Parts' | 'Networking'>('Laptops');
  const [newProductBrand, setNewProductBrand] = useState('HP');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductMrp, setNewProductMrp] = useState('');
  const [newProductSpecs, setNewProductSpecs] = useState('');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80');

  // New Banner Modal State
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerHighlight, setNewBannerHighlight] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('FESTIVAL SPECIAL • GARHWA SHOWROOM');
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80');
  const [newBannerBtnText, setNewBannerBtnText] = useState('Shop Now');
  const [newBannerBtnUrl, setNewBannerBtnUrl] = useState('/shop?cat=Laptops');
  const [newBannerGradient, setNewBannerGradient] = useState('from-[#0A1633] via-[#0F2960] to-[#1A56DB]');

  // Theme Form State
  const [themePrimary, setThemePrimary] = useState(themeSettings?.primaryColor || '#1A56DB');
  const [themeSecondary, setThemeSecondary] = useState(themeSettings?.secondaryColor || '#FB641B');
  const [themeDeal, setThemeDeal] = useState(themeSettings?.dealColor || '#15803D');
  const [announcementText, setAnnouncementText] = useState(siteSettings?.announcementText || '100% Asli Samaan • 18% GST Bill • Garhwa & Palamu Delivery');

  useEffect(() => {
    if (themeSettings) {
      setThemePrimary(themeSettings.primaryColor);
      setThemeSecondary(themeSettings.secondaryColor);
      setThemeDeal(themeSettings.dealColor);
    }
    if (siteSettings?.announcementText) {
      setAnnouncementText(siteSettings.announcementText);
    }
  }, [themeSettings, siteSettings]);

  // Store & Payment Settings Form State
  const [storeName, setStoreName] = useState(siteSettings?.siteName || STORE_INFO.name);
  const [storeTagline, setStoreTagline] = useState(siteSettings?.tagline || STORE_INFO.tagline);
  const [storePhone, setStorePhone] = useState(siteSettings?.phone || STORE_INFO.phone);
  const [storeWhatsapp, setStoreWhatsapp] = useState(siteSettings?.whatsapp || STORE_INFO.whatsapp);
  const [storeEmail, setStoreEmail] = useState(siteSettings?.email || STORE_INFO.email);
  const [storeAddress, setStoreAddress] = useState(siteSettings?.address || `${STORE_INFO.address}, ${STORE_INFO.city} - ${STORE_INFO.pincode}`);
  const [storeTimings, setStoreTimings] = useState(siteSettings?.timings || STORE_INFO.timings);

  const [upiId, setUpiId] = useState(paymentSettings?.upiId || '9608828288@okbizaxis');
  const [upiName, setUpiName] = useState(paymentSettings?.upiName || 'LAPPY SOLUTION GARHWA');
  const [gstRate, setGstRate] = useState(paymentSettings?.gstRate || 18);
  const [gstin, setGstin] = useState(paymentSettings?.gstin || '20AABCL1234F1Z5');
  const [codEnabled, setCodEnabled] = useState(paymentSettings?.codEnabled ?? true);

  useEffect(() => {
    if (siteSettings) {
      setStoreName(siteSettings.siteName);
      setStoreTagline(siteSettings.tagline);
      setStorePhone(siteSettings.phone);
      setStoreWhatsapp(siteSettings.whatsapp);
      setStoreEmail(siteSettings.email);
      setStoreAddress(siteSettings.address);
      setStoreTimings(siteSettings.timings);
    }
    if (paymentSettings) {
      setUpiId(paymentSettings.upiId);
      setUpiName(paymentSettings.upiName);
      setGstRate(paymentSettings.gstRate);
      setGstin(paymentSettings.gstin);
      setCodEnabled(paymentSettings.codEnabled);
    }
  }, [siteSettings, paymentSettings]);

  // Security Gatekeeper States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((data) => setIsAuthenticated(Boolean(data.authenticated)))
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setFailedAttempts(0);
            setAuthError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleUnlockPortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: authPassword }),
    });
    if (response.ok) {
      setIsAuthenticated(true);
      setAuthPassword('');
      setAuthError('');
      await syncWithDatabase();
      showToast('Welcome Store Owner! Console unlocked.');
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setIsLockedOut(true);
        setLockoutTimer(30);
        setAuthError('Too many failed attempts! Portal locked for 30s.');
      } else {
        const data = await response.json().catch(() => null);
        setAuthError(data?.error || `Invalid credentials. (${5 - attempts} attempts left)`);
      }
    }
  };

  // Invoicing & Billing Sub-Tab States
  const [billingSubTab, setBillingSubTab] = useState<'invoices' | 'create' | 'settings'>('invoices');
  const [billingSearch, setBillingSearch] = useState('');
  const [billingFilter, setBillingFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Manual Counter Billing Form State
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('Garhwa, Jharkhand');
  const [manualBuyerGstin, setManualBuyerGstin] = useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState('Cash on Counter');
  const [manualSelectedProductId, setManualSelectedProductId] = useState('');
  const [manualProductName, setManualProductName] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const [manualPrice, setManualPrice] = useState(0);
  const [manualDiscount, setManualDiscount] = useState(0);
  const [manualGstRate, setManualGstRate] = useState(18);

  // Invoice Settings Form State
  const [invBizName, setInvBizName] = useState(invoiceSettings?.businessName || 'Lappy Solution');
  const [invAddress, setInvAddress] = useState(invoiceSettings?.address || 'In front of G P Plaza, Chiniya Road');
  const [invGstin, setInvGstin] = useState(invoiceSettings?.gstin || '20AABCL1234F1Z5');
  const [invPan, setInvPan] = useState(invoiceSettings?.pan || 'AABCL1234F');
  const [invPhone, setInvPhone] = useState(invoiceSettings?.phone || '+91 9608828288');
  const [invEmail, setInvEmail] = useState(invoiceSettings?.email || 'lappysolution2018@gmail.com');
  const [invPrefix, setInvPrefix] = useState(invoiceSettings?.prefix || 'INV');
  const [invFinancialYear, setInvFinancialYear] = useState(invoiceSettings?.financialYear || '2026-27');
  const [invUpiId, setInvUpiId] = useState(invoiceSettings?.upiId || '9608828288@okbizaxis');
  const [invBankName, setInvBankName] = useState(invoiceSettings?.bankName || 'State Bank of India');
  const [invAccountNo, setInvAccountNo] = useState(invoiceSettings?.accountNumber || '38947291048');
  const [invIfsc, setInvIfsc] = useState(invoiceSettings?.ifscCode || 'SBIN0000080');

  useEffect(() => {
    if (invoiceSettings) {
      setInvBizName(invoiceSettings.businessName);
      setInvAddress(invoiceSettings.address);
      setInvGstin(invoiceSettings.gstin);
      setInvPan(invoiceSettings.pan);
      setInvPhone(invoiceSettings.phone);
      setInvEmail(invoiceSettings.email);
      setInvPrefix(invoiceSettings.prefix);
      setInvFinancialYear(invoiceSettings.financialYear);
      setInvUpiId(invoiceSettings.upiId);
      setInvBankName(invoiceSettings.bankName);
      setInvAccountNo(invoiceSettings.accountNumber);
      setInvIfsc(invoiceSettings.ifscCode);
    }
  }, [invoiceSettings]);


  // Stats Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const pendingVerificationOrders = useMemo(() => {
    return orders.filter(o => 
      o.paymentStatus === 'Verification Pending' || 
      o.paymentStatus === 'Pending' ||
      o.orderStatus === 'Confirmed'
    );
  }, [orders]);

  const deliveredOrdersCount = useMemo(() => {
    return orders.filter(o => o.orderStatus === 'Delivered').length;
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderFilter === 'pending') {
        if (o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled') return false;
      } else if (orderFilter === 'verified') {
        if (o.paymentStatus !== 'Paid' && o.paymentStatus !== 'Verified') return false;
      } else if (orderFilter === 'packed') {
        if (o.orderStatus !== 'Packed') return false;
      } else if (orderFilter === 'shipped') {
        if (o.orderStatus !== 'Shipped') return false;
      } else if (orderFilter === 'delivered') {
        if (o.orderStatus !== 'Delivered') return false;
      }

      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesId = (o.orderId || '').toLowerCase().includes(q);
        const matchesName = (o.customerName || '').toLowerCase().includes(q);
        const matchesPhone = (o.phone || '').includes(q);
        const matchesUtr = (o.utrNumber || '').toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesPhone && !matchesUtr) return false;
      }

      return true;
    });
  }, [orders, orderFilter, orderSearch]);

  // Order Actions
  const handleVerifyPayment = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          paymentStatus: 'Paid',
          orderStatus: o.orderStatus === 'Confirmed' ? 'Packed' : o.orderStatus
        };
      }
      return o;
    });
    updateOrders(updated);
    showToast(`Payment verified for order ${orderId}!`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          orderStatus: newStatus
        };
      }
      return o;
    });
    updateOrders(updated);
    showToast(`Order ${orderId} marked as ${newStatus}!`);
  };

  // Inventory Toggle Stock
  const handleToggleStock = (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    updateProducts(updated);
    showToast('Inventory stock status updated!');
  };

  // Inventory Quick Price Update
  const handleQuickPriceChange = (productId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, price: newPrice };
      }
      return p;
    });
    updateProducts(updated);
    showToast('Product price updated!');
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice) {
      showToast('Please enter product name and price');
      return;
    }

    const priceNum = Number(newProductPrice);
    const mrpNum = Number(newProductMrp) || Math.round(priceNum * 1.2);
    const discount = Math.round(((mrpNum - priceNum) / mrpNum) * 100);

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      brand: newProductBrand,
      price: priceNum,
      mrp: mrpNum,
      discount: discount > 0 ? discount : 10,
      specs: newProductSpecs.trim() || 'Genuine Garhwa showroom sealed hardware with official manufacturer warranty.',
      description: newProductSpecs.trim() || newProductName.trim(),
      image: newProductImage.trim(),
      images: [newProductImage.trim()],
      inStock: true,
      stockQuantity: 10,
      sku: `LS-${newProductCategory.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 4.8,
      reviewsCount: 12
    };

    addProductToDb(newProd);
    setIsAddProductOpen(false);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductMrp('');
    setNewProductSpecs('');
  };

  // Add Banner Submit
  const handleAddBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) {
      showToast('Please enter banner title');
      return;
    }
    await addBanner({
      title: newBannerTitle.trim(),
      titleHighlight: newBannerHighlight.trim(),
      subtitle: newBannerSubtitle.trim() || 'Authorized sales & repair center on Chiniya Road, Garhwa.',
      badge: newBannerBadge.trim(),
      desktopImage: newBannerImage.trim(),
      buttonText: newBannerBtnText.trim() || 'Shop Now',
      buttonUrl: newBannerBtnUrl.trim() || '/shop',
      whatsappMsg: `Hello Lappy Solution Garhwa, I want to inquire about: ${newBannerTitle}`,
      bgGradient: newBannerGradient,
      position: banners.length + 1,
      status: 'active',
    });
    setIsAddBannerOpen(false);
    setNewBannerTitle('');
    setNewBannerHighlight('');
    setNewBannerSubtitle('');
  };

  // Move Section Up/Down in Page Builder
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...homepageSections].sort((a, b) => a.position - b.position);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;
    const reindexed = sorted.map((s, idx) => ({ ...s, position: idx + 1 }));
    await updateHomepageSections(reindexed);
  };

  // Toggle Section Visibility
  const handleToggleSection = async (id: string) => {
    const updated = homepageSections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    await updateHomepageSections(updated);
  };

  // Section Editing Modal States
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editingSectionKey, setEditingSectionKey] = useState('');
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [editingSectionSubtitle, setEditingSectionSubtitle] = useState('');
  const [editingSectionBadge, setEditingSectionBadge] = useState('');

  const handleOpenEditSection = (section: CMSSection) => {
    setEditingSectionKey(section.sectionKey);
    setEditingSectionTitle(section.title);
    setEditingSectionSubtitle(section.subtitle || '');
    setEditingSectionBadge(section.badge || '');
    setIsEditSectionOpen(true);
  };

  const handleSaveSectionDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepageSectionDetails(editingSectionKey, {
      title: editingSectionTitle,
      subtitle: editingSectionSubtitle,
      badge: editingSectionBadge,
    });
    setIsEditSectionOpen(false);
  };

  // Section Products Management Modal States
  const [isManageSectionProductsOpen, setIsManageSectionProductsOpen] = useState(false);
  const [managingSectionKey, setManagingSectionKey] = useState('');
  const [managingSectionTitle, setManagingSectionTitle] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [sectionProductSearch, setSectionProductSearch] = useState('');
  const [sectionProductCategory, setSectionProductCategory] = useState('All');

  const handleOpenManageProducts = (section: CMSSection) => {
    setManagingSectionKey(section.sectionKey);
    setManagingSectionTitle(section.title);
    let ids: string[] = [];
    if (section.productIds) {
      if (Array.isArray(section.productIds)) {
        ids = section.productIds;
      } else if (typeof section.productIds === 'string') {
        try {
          ids = JSON.parse(section.productIds);
        } catch {
          ids = [];
        }
      }
    }
    setSelectedProductIds(ids);
    setSectionProductSearch('');
    setSectionProductCategory('All');
    setIsManageSectionProductsOpen(true);
  };

  const handleToggleProductForSection = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleSaveSectionProducts = async () => {
    await updateHomepageSectionProducts(managingSectionKey, selectedProductIds);
    setIsManageSectionProductsOpen(false);
  };

  // Custom Pages Management States
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageStatus, setPageStatus] = useState('published');
  const [pageMetaTitle, setPageMetaTitle] = useState('');
  const [pageMetaDesc, setPageMetaDesc] = useState('');

  const handleOpenCreatePage = () => {
    setEditingPageId(null);
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
    setPageStatus('published');
    setPageMetaTitle('');
    setPageMetaDesc('');
    setIsPageModalOpen(true);
  };

  const handleOpenEditPage = (page: CMSCustomPage) => {
    setEditingPageId(page.id);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageContent(page.content);
    setPageStatus(page.status);
    setPageMetaTitle(page.metaTitle || '');
    setPageMetaDesc(page.metaDesc || '');
    setIsPageModalOpen(true);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim() || !pageSlug.trim()) {
      alert('Please enter page title and slug');
      return;
    }
    const cleanSlug = pageSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    if (editingPageId) {
      await editCustomPage({
        id: editingPageId,
        title: pageTitle,
        slug: cleanSlug,
        content: pageContent,
        status: pageStatus,
        metaTitle: pageMetaTitle,
        metaDesc: pageMetaDesc,
      });
    } else {
      await addCustomPage({
        title: pageTitle,
        slug: cleanSlug,
        content: pageContent,
        status: pageStatus,
        metaTitle: pageMetaTitle,
        metaDesc: pageMetaDesc,
      });
    }
    setIsPageModalOpen(false);
  };

  // Blog Management States
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCategory, setBlogCategory] = useState('Refurbished Guides');
  const [blogCoverImage, setBlogCoverImage] = useState('/images/banners/refurbished-laptops-printers.png');
  const [blogAuthor, setBlogAuthor] = useState('Lappy Solution Tech Team');
  const [blogReadTime, setBlogReadTime] = useState('5 min');
  const [blogTags, setBlogTags] = useState('refurbished, laptops, garhwa');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogStatus, setBlogStatus] = useState('published');

  const handleOpenCreateBlog = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogCategory('Refurbished Guides');
    setBlogCoverImage('/images/banners/refurbished-laptops-printers.png');
    setBlogAuthor('Lappy Solution Tech Team');
    setBlogReadTime('5 min');
    setBlogTags('refurbished, laptops, garhwa');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogStatus('published');
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (blog: CMSBlogPost) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogSlug(blog.slug);
    setBlogCategory(blog.category);
    setBlogCoverImage(blog.coverImage);
    setBlogAuthor(blog.author);
    setBlogReadTime(blog.readTime);
    setBlogTags(blog.tags || '');
    setBlogExcerpt(blog.excerpt);
    setBlogContent(blog.content);
    setBlogStatus(blog.status);
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogSlug.trim()) {
      alert('Please enter blog title and slug');
      return;
    }
    const cleanSlug = blogSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    if (editingBlogId) {
      await editBlogPost({
        id: editingBlogId,
        title: blogTitle,
        slug: cleanSlug,
        category: blogCategory,
        coverImage: blogCoverImage,
        author: blogAuthor,
        readTime: blogReadTime,
        tags: blogTags,
        excerpt: blogExcerpt,
        content: blogContent,
        status: blogStatus,
      });
    } else {
      await addBlogPost({
        title: blogTitle,
        slug: cleanSlug,
        category: blogCategory,
        coverImage: blogCoverImage,
        author: blogAuthor,
        readTime: blogReadTime,
        tags: blogTags,
        excerpt: blogExcerpt,
        content: blogContent,
        status: blogStatus,
      });
    }
    setIsBlogModalOpen(false);
  };

  // Save Theme Form
  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateThemeSettings({
      primaryColor: themePrimary,
      secondaryColor: themeSecondary,
      dealColor: themeDeal,
    });
    await updateSiteSettings({
      announcementText: announcementText,
    });
    showToast('Theme & Announcement updated in database!');
  };

  // Save Settings Form
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({
      siteName: storeName,
      tagline: storeTagline,
      phone: storePhone,
      whatsapp: storeWhatsapp,
      email: storeEmail,
      address: storeAddress,
      timings: storeTimings,
    });
    await updatePaymentSettings({
      upiId,
      upiName,
      gstRate: Number(gstRate),
      gstin,
      codEnabled,
    });
    showToast('Store & Payment settings saved to database!');
  };

  // Filtered Products
  const filteredInventory = useMemo(() => {
    return products.filter(p => {
      if (inventoryCategory !== 'All' && p.category !== inventoryCategory) return false;
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSku = (p.sku || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSku) return false;
      }
      return true;
    });
  }, [products, inventoryCategory, inventorySearch]);

  const categories = ['All', 'Laptops', 'Computers', 'CCTV & Security', 'Printers', 'Accessories', 'Storage & Parts'];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070D1E] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -top-24 -left-24" />
        <div className="absolute w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -bottom-24 -right-24" />

        <div className="max-w-md w-full bg-[#0F1D3D] border border-blue-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10 text-white">
          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#0F2960] border border-blue-400/30 flex items-center justify-center mx-auto shadow-xl">
              <ShieldCheck className="w-9 h-9 text-[#4ADE80]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3 text-blue-400" />
              <span>Owner & Manager Clearance</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              {siteSettings?.siteName || 'Lappy Solution'} Console
            </h1>
            
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Showroom Inventory • 18% GST Invoicing • Order Settlement. Enter master passkey to unlock.
            </p>
          </div>

          <form onSubmit={handleUnlockPortal} className="space-y-4">
            <div>
              <label className="block text-[11.5px] font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                Showroom Master Passkey / PIN
              </label>
              <div className="relative">
                <input
                  type={showAuthPassword ? 'text' : 'password'}
                  placeholder="Enter master passkey..."
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  disabled={isLockedOut}
                  className="w-full bg-[#0A1633] border border-blue-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300/40 focus:outline-none focus:border-[#4ADE80] transition-colors pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/60 hover:text-white"
                >
                  {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{authError}</span>
                </p>
              )}

              {isLockedOut && (
                <p className="text-xs text-amber-300 font-semibold mt-1">
                  Retry in {lockoutTimer}s
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLockedOut || !authPassword}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#1A56DB] to-[#2563EB] hover:from-[#1E40AF] hover:to-[#1D4ED8] text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-1">
            <div className="text-[11px] text-blue-300/60 font-mono">
              Garhwa Showroom Server • IP & Hardware Verified
            </div>
            <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-block pt-1">
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F3F6] min-h-screen pb-20">
      
      {/* 1. TOP ADMIN CONTROL HEADER */}
      <div className="bg-[#0A1633] text-white border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A56DB] flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
                LS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Lappy Solution Merchant Portal
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Live Showroom
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  Chiniya Road, Garhwa, Jharkhand (822114) • Store Manager Console
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="h-9 px-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/15"
              >
                <span>View Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={async () => {
                  await syncWithDatabase();
                  showToast('Store data synchronized from SQLite database.');
                }}
                className="h-9 px-3.5 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync with Database</span>
              </button>

              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  setIsAuthenticated(false);
                  showToast('Admin Portal locked securely.');
                }}
                className="h-9 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Lock admin session immediately"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Portal</span>
              </button>
            </div>


          </div>

          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            
            {/* Total Revenue */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 backdrop-blur-xs">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                Total Store Revenue
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10.5px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                18% GST Invoices Included
              </span>
            </div>

            {/* Total Orders */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 backdrop-blur-xs">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {orders.length} Orders
              </div>
              <span className="text-[10.5px] text-blue-300 font-medium mt-1">
                {deliveredOrdersCount} Successfully Delivered
              </span>
            </div>

            {/* Pending Verifications */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 backdrop-blur-xs">
              <span className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider block">
                Pending UTR / Verification
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-[#FCD34D] mt-1">
                {pendingVerificationOrders.length} Pending
              </div>
              <span className="text-[10.5px] text-amber-300 font-medium mt-1">
                Requires Bank cross-check
              </span>
            </div>

            {/* Products In Stock */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 backdrop-blur-xs">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                Active Showroom SKUs
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {products.filter(p => p.inStock).length} In Stock
              </div>
              <span className="text-[10.5px] text-blue-300 font-medium mt-1">
                Out of {products.length} Total SKUs
              </span>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-white/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'orders', label: 'Orders & UTR', count: orders.length },
              { id: 'billing', label: 'GST Invoices & Billing', count: invoices.length },
              { id: 'inventory', label: `Inventory (${products.length} SKUs)`, count: products.length },
              { id: 'banners', label: 'Hero Banners', count: banners.length },
              { id: 'homepage', label: 'Page Builder & Sections', count: homepageSections.length },
              { id: 'pages', label: 'Custom Pages CMS', count: customPages.length },
              { id: 'blogs', label: 'Tech Blogs', count: blogPosts.length },
              { id: 'theme', label: 'Theme & Colors' },
              { id: 'settings', label: 'Store & UPI Settings' },
              { id: 'leads', label: 'Quotes & Inquiries', count: leads.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-[#FB641B] text-[#FB641B]'
                    : 'border-transparent text-gray-300 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    activeTab === tab.id ? 'bg-[#FB641B]/20 text-[#FB641B]' : 'bg-white/10 text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* ========================================================= */}
        {/* TAB 1: ORDERS & UPI UTR VERIFICATION                      */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Order Status Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'pending', label: 'Pending UTR Verification' },
                  { id: 'verified', label: 'Paid / Verified' },
                  { id: 'packed', label: 'Packed' },
                  { id: 'shipped', label: 'Dispatched' },
                  { id: 'delivered', label: 'Delivered' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      orderFilter === f.id
                        ? 'bg-[#1A56DB] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Order Search Input */}
              <div className="w-full sm:w-64 relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, name, UTR..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg pl-8.5 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-3.5">
                {filteredOrders.map((order) => {
                  const isPending = order.paymentStatus === 'Verification Pending' || order.paymentStatus === 'Pending';
                  const isPaid = order.paymentStatus === 'Paid';

                  return (
                    <div 
                      key={order.orderId}
                      className="bg-white border border-[#E5E7EB] hover:border-blue-200 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all space-y-4"
                    >
                      {/* Top Header of Order */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                        
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-sm sm:text-base text-[#111827]">
                            {order.orderId}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {order.date}
                          </span>
                          
                          {/* Payment Badge */}
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{order.paymentStatus || 'Pending'}</span>
                          </span>

                          {/* Order Status Badge */}
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1A56DB] border border-blue-200">
                            {order.orderStatus || 'Confirmed'}
                          </span>
                        </div>

                        {/* Customer Total Amount */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block uppercase font-bold">Total Bill (inc. GST)</span>
                            <span className="text-base sm:text-lg font-extrabold text-[#111827]">
                              ₹{(Number(order.totalAmount) || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Quick WhatsApp Contact to Customer */}
                          <a
                            href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}, this is Lappy Solution Garhwa regarding your order ${order.orderId}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                            title="Chat with Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                      </div>

                      {/* Middle Grid: Customer Details + Items + UTR Details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        
                        {/* Customer Information (4 cols) */}
                        <div className="md:col-span-4 space-y-1.5 text-xs text-gray-600 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer & Delivery</span>
                          <div className="font-bold text-sm text-[#111827]">{order.customerName}</div>
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Phone className="w-3 h-3 text-[#1A56DB]" />
                            <span>{order.phone}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-gray-700 pt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>{order.address}</span>
                          </div>
                          {order.paymentMethod && (
                            <div className="pt-1 text-[11px] text-gray-500">
                              Payment: <strong>{order.paymentMethod}</strong>
                            </div>
                          )}
                        </div>

                        {/* Order Items (5 cols) */}
                        <div className="md:col-span-5 space-y-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Ordered Hardware ({order.items?.length || 0} items)
                          </span>
                          <div className="space-y-1.5">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-white border border-gray-100 p-2 rounded-lg">
                                <div className="min-w-0 pr-2">
                                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                                  <p className="text-[10.5px] text-gray-500">Qty: {item.quantity} × ₹{(Number(item.price) || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <span className="font-bold text-gray-900 text-xs flex-shrink-0">
                                  ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* UPI UTR & Merchant Actions (3 cols) */}
                        <div className="md:col-span-3 space-y-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          <span className="text-[10px] font-bold text-[#1A56DB] uppercase tracking-wider block">
                            Bank Reference / UTR
                          </span>
                          
                          {order.utrNumber ? (
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-sm font-extrabold text-blue-900 tracking-wider">
                                  {order.utrNumber}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(order.utrNumber, 'UTR Number')}
                                  className="p-1 text-[#1A56DB] hover:bg-blue-100 rounded"
                                  title="Copy UTR"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="text-[10px] text-gray-500 block mt-0.5">
                                Cross-check with SBI/Axis Bank statement
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 italic block">
                              Cash / Pay on Pickup
                            </span>
                          )}

                          {/* Merchant Action Buttons */}
                          <div className="space-y-1.5 pt-2 border-t border-blue-100/60">
                            {isPending && (
                              <button
                                onClick={() => handleVerifyPayment(order.orderId)}
                                className="w-full h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve Payment</span>
                              </button>
                            )}

                            {order.orderStatus !== 'Shipped' && order.orderStatus !== 'Delivered' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, 'Shipped')}
                                className="w-full h-8 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Dispatch Order</span>
                              </button>
                            )}

                            {order.orderStatus === 'Shipped' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, 'Delivered')}
                                className="w-full h-8 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Delivered</span>
                              </button>
                            )}
                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-2xs">
                <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 text-base">No orders found</h3>
                <p className="text-xs text-gray-500 mt-1">
                  No customer orders match the current filter or search criteria.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: GST TAX INVOICES & BILLING MANAGEMENT                */}
        {/* ========================================================= */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            
            {/* 1. Billing Top Bar & Sub-Tabs */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {[
                  { id: 'invoices', label: `All Invoices (${invoices.length})`, icon: FileText },
                  { id: 'create', label: '+ Counter Billing / New Invoice', icon: Plus },
                  { id: 'settings', label: '⚙️ GST & Invoice Configuration', icon: Sliders }
                ].map((st) => {
                  const Icon = st.icon;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setBillingSubTab(st.id as any)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        billingSubTab === st.id
                          ? 'bg-[#1A56DB] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {billingSubTab === 'invoices' && (
                <div className="w-full sm:w-64 relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search invoice or customer..."
                    value={billingSearch}
                    onChange={(e) => setBillingSearch(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg pl-8.5 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              )}
            </div>

            {/* 2. SUBTAB: ALL INVOICES LIST */}
            {billingSubTab === 'invoices' && (
              <div className="space-y-4">
                
                {/* Stats Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Total Invoices
                    </span>
                    <div className="text-xl font-extrabold text-gray-900 mt-1">
                      {invoices.length} Bills
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
                      Rule 46 CBIC Compliant
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Total Billed Value
                    </span>
                    <div className="text-xl font-extrabold text-blue-700 mt-1">
                      ₹{invoices.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0).toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">
                      Gross Settlement Value
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Total GST Collected
                    </span>
                    <div className="text-xl font-extrabold text-emerald-700 mt-1">
                      ₹{invoices.reduce((sum, i) => sum + (Number(i.totalTax) || 0), 0).toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
                      CGST (9%) + SGST (9%)
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Showroom State Code
                    </span>
                    <div className="text-xl font-extrabold text-gray-900 mt-1">
                      Jharkhand (20)
                    </div>
                    <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">
                      GSTIN: {invoiceSettings?.gstin || '20AABCL1234F1Z5'}
                    </span>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2">
                  {(['all', 'paid', 'pending'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setBillingFilter(st)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                        billingFilter === st 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {st === 'all' ? 'All Invoices' : `${st} Invoices`}
                    </button>
                  ))}
                </div>

                {/* Invoices Table */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-gray-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Invoice No</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-4">Customer Details</th>
                          <th className="py-3 px-3">Items</th>
                          <th className="py-3 px-3 text-right">Taxable</th>
                          <th className="py-3 px-3 text-right">GST (18%)</th>
                          <th className="py-3 px-4 text-right">Grand Total</th>
                          <th className="py-3 px-3 text-center">Payment</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoices
                          .filter((inv) => {
                            if (billingFilter === 'paid' && inv.paymentStatus !== 'Paid') return false;
                            if (billingFilter === 'pending' && inv.paymentStatus === 'Paid') return false;
                            if (billingSearch.trim()) {
                              const q = billingSearch.toLowerCase();
                              const matchesInv = inv.invoiceNumber.toLowerCase().includes(q);
                              const matchesName = (inv.buyerName || '').toLowerCase().includes(q);
                              const matchesPhone = (inv.buyerPhone || '').toLowerCase().includes(q);
                              if (!matchesInv && !matchesName && !matchesPhone) return false;
                            }
                            return true;
                          })
                          .map((inv) => (
                            <tr key={inv.id || inv.invoiceNumber} className="hover:bg-blue-50/40 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-[#1A56DB]">
                                {inv.invoiceNumber}
                                {inv.orderId && (
                                  <span className="block text-[10px] text-gray-400 font-mono">
                                    Ord: #{inv.orderId}
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">
                                {inv.date}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-900">{inv.buyerName}</div>
                                <div className="text-[11px] text-gray-500">{inv.buyerPhone}</div>
                                {inv.buyerGstin && (
                                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded">
                                    GSTIN: {inv.buyerGstin}
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="font-semibold text-gray-800">
                                  {inv.items?.length || 1} Item(s)
                                </span>
                                <span className="block text-[10px] text-gray-400 truncate max-w-[140px]">
                                  {inv.items?.[0]?.productName || 'Hardware'}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-right font-mono text-gray-700">
                                ₹{inv.taxableAmount?.toLocaleString('en-IN') || '—'}
                              </td>
                              <td className="py-3.5 px-3 text-right font-mono text-emerald-700">
                                ₹{inv.totalTax?.toLocaleString('en-IN') || '—'}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-extrabold text-gray-900 text-sm">
                                ₹{inv.grandTotal?.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  inv.paymentStatus === 'Paid' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {inv.paymentStatus}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Link
                                    href={`/invoice/${encodeURIComponent(inv.invoiceNumber)}`}
                                    target="_blank"
                                    className="px-2.5 py-1 rounded bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs"
                                    title="View & Print A4 Tax Invoice"
                                  >
                                    <Printer className="w-3 h-3" />
                                    <span>Print A4</span>
                                  </Link>

                                  <button
                                    onClick={() => deleteInvoice(inv.id || inv.invoiceNumber)}
                                    className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Delete invoice record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {invoices.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                      <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                      <p className="font-bold text-sm">No Invoices Generated Yet</p>
                      <p className="text-xs text-gray-400 mt-0.5">Click '+ Counter Billing' to create your first tax invoice.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 3. SUBTAB: CREATE COUNTER SALE INVOICE (Walk-in showroom billing) */}
            {billingSubTab === 'create' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-8 shadow-sm max-w-4xl mx-auto space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#1A56DB]" />
                    <span>Garhwa Showroom Counter Billing (GST Tax Invoice)</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Instantly bill walk-in customers or generate manual tax invoices with automatic CGST (9%) + SGST (9%) calculations and dynamic UPI QR code.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={manualCustomerName}
                      onChange={(e) => setManualCustomerName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Customer Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9431128941"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Billing & Delivery Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chiniya Road, Garhwa, Jharkhand - 822114"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Customer GSTIN (Optional for Business ITC)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20XXXXXXXXXXXXX"
                      value={manualBuyerGstin}
                      onChange={(e) => setManualBuyerGstin(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>

                {/* Product Selection from 282 SKUs */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    Product & Hardware Selection
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Select Item from Showroom Inventory ({products.length} Items)
                      </label>
                      <select
                        value={manualSelectedProductId}
                        onChange={(e) => {
                          const pId = e.target.value;
                          setManualSelectedProductId(pId);
                          const prod = products.find((p) => p.id === pId);
                          if (prod) {
                            setManualProductName(prod.name);
                            setManualPrice(prod.price);
                          }
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                      >
                        <option value="">-- Choose Showroom Product --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.category}] {p.name.slice(0, 50)}... - ₹{p.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Or Enter Custom Item Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HP 15s Laptop + Laptop Bag"
                        value={manualProductName}
                        onChange={(e) => setManualProductName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={manualQty}
                        onChange={(e) => setManualQty(Number(e.target.value) || 1)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Unit Rate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={manualPrice}
                        onChange={(e) => setManualPrice(Number(e.target.value) || 0)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Discount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={manualDiscount}
                        onChange={(e) => setManualDiscount(Number(e.target.value) || 0)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1A56DB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">GST Rate</label>
                      <select
                        value={manualGstRate}
                        onChange={(e) => setManualGstRate(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#1A56DB]"
                      >
                        <option value="18">18% (Laptops, CCTV, Spares)</option>
                        <option value="12">12% (Desktops, Accessories)</option>
                        <option value="5">5% (Paper, Basic Cables)</option>
                        <option value="28">28% (Luxury / Monitors &gt;32")</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Real-time Calculation Summary Box */}
                {(() => {
                  const gross = manualPrice * manualQty;
                  const net = Math.max(0, gross - manualDiscount);
                  const mult = 1 + manualGstRate / 100;
                  const taxable = Math.round((net / mult) * 100) / 100;
                  const tax = Math.round((net - taxable) * 100) / 100;
                  const cgst = Math.round((tax / 2) * 100) / 100;
                  const sgst = Math.round((tax - cgst) * 100) / 100;

                  return (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Gross Total:</span>
                        <span className="font-mono">₹{gross.toLocaleString('en-IN')}</span>
                      </div>
                      {manualDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Discount Applied:</span>
                          <span className="font-mono">-₹{manualDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-800 font-bold border-t border-gray-200 pt-1.5">
                        <span>Taxable Value (Base):</span>
                        <span className="font-mono">₹{taxable.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>CGST ({manualGstRate / 2}%):</span>
                        <span className="font-mono">₹{cgst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>SGST ({manualGstRate / 2}%):</span>
                        <span className="font-mono">₹{sgst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center border-t-2 border-gray-800 pt-2 text-sm font-black text-gray-900">
                        <span>Invoice Total Amount:</span>
                        <span className="text-[#1A56DB] font-mono text-base font-black">
                          ₹{net.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Payment Method & Submit */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-gray-700">Settlement:</span>
                    <select
                      value={manualPaymentMethod}
                      onChange={(e) => setManualPaymentMethod(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    >
                      <option value="Cash on Counter">Cash on Counter</option>
                      <option value="UPI (GPay / PhonePe / Paytm)">UPI (GPay / PhonePe / Paytm)</option>
                      <option value="Debit / Credit Card">Debit / Credit Card</option>
                      <option value="Net Banking / NEFT">Net Banking / NEFT</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!manualCustomerName || !manualProductName || manualPrice <= 0) {
                        showToast('Please enter customer name, product and price.');
                        return;
                      }

                      const gross = manualPrice * manualQty;
                      const net = Math.max(0, gross - manualDiscount);
                      const mult = 1 + manualGstRate / 100;
                      const taxable = Math.round((net / mult) * 100) / 100;
                      const tax = Math.round((net - taxable) * 100) / 100;
                      const cgst = Math.round((tax / 2) * 100) / 100;
                      const sgst = Math.round((tax - cgst) * 100) / 100;

                      const item = {
                        id: `item-${Date.now()}`,
                        productName: manualProductName,
                        hsn: '84713010',
                        quantity: manualQty,
                        unit: 'PCS',
                        unitPrice: manualPrice,
                        discount: manualDiscount,
                        taxableValue: taxable,
                        gstRate: manualGstRate,
                        cgstRate: manualGstRate / 2,
                        sgstRate: manualGstRate / 2,
                        igstRate: 0,
                        cgstAmount: cgst,
                        sgstAmount: sgst,
                        igstAmount: 0,
                        total: net
                      };

                      const newInv = createManualInvoice({
                        buyerName: manualCustomerName,
                        buyerPhone: manualPhone,
                        buyerAddress: manualAddress,
                        buyerGstin: manualBuyerGstin || undefined,
                        paymentMethod: manualPaymentMethod,
                        items: [item],
                        subtotal: gross,
                        discountTotal: manualDiscount,
                        taxableAmount: taxable,
                        cgstTotal: cgst,
                        sgstTotal: sgst,
                        totalTax: tax,
                        grandTotal: net
                      });

                      // Reset form
                      setManualCustomerName('');
                      setManualPhone('');
                      setManualProductName('');
                      setManualPrice(0);
                      setManualDiscount(0);
                      setBillingSubTab('invoices');

                      // Open newly created invoice in new window
                      if (typeof window !== 'undefined') {
                        window.open(`/invoice/${encodeURIComponent(newInv.invoiceNumber)}`, '_blank');
                      }
                    }}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Generate Tax Invoice & Print A4</span>
                  </button>
                </div>

              </div>
            )}

            {/* 4. SUBTAB: GST & INVOICE SETTINGS */}
            {billingSubTab === 'settings' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-8 shadow-sm max-w-4xl mx-auto space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#1A56DB]" />
                    <span>Tax Invoice & Business Particulars Configuration</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    CBIC Rule 46 compliance settings. Any updates made here will automatically update all newly generated tax invoices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Business Trade Name</label>
                    <input
                      type="text"
                      value={invBizName}
                      onChange={(e) => setInvBizName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Showroom Address</label>
                    <input
                      type="text"
                      value={invAddress}
                      onChange={(e) => setInvAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Registered GSTIN (15 Digits)</label>
                    <input
                      type="text"
                      value={invGstin}
                      onChange={(e) => setInvGstin(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#1A56DB] focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Income Tax PAN</label>
                    <input
                      type="text"
                      value={invPan}
                      onChange={(e) => setInvPan(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={invPhone}
                      onChange={(e) => setInvPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={invEmail}
                      onChange={(e) => setInvEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Invoice Prefix (e.g. INV)</label>
                    <input
                      type="text"
                      value={invPrefix}
                      onChange={(e) => setInvPrefix(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Financial Year</label>
                    <input
                      type="text"
                      value={invFinancialYear}
                      onChange={(e) => setInvFinancialYear(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Dynamic UPI VPA</label>
                    <input
                      type="text"
                      value={invUpiId}
                      onChange={(e) => setInvUpiId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-blue-700 focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={invBankName}
                      onChange={(e) => setInvBankName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={invAccountNo}
                      onChange={(e) => setInvAccountNo(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Bank IFSC Code</label>
                    <input
                      type="text"
                      value={invIfsc}
                      onChange={(e) => setInvIfsc(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      updateInvoiceSettings({
                        businessName: invBizName,
                        address: invAddress,
                        gstin: invGstin,
                        pan: invPan,
                        phone: invPhone,
                        email: invEmail,
                        prefix: invPrefix,
                        financialYear: invFinancialYear,
                        upiId: invUpiId,
                        bankName: invBankName,
                        accountNumber: invAccountNo,
                        ifscCode: invIfsc
                      });
                      showToast('Invoice settings saved successfully!');
                    }}
                    className="h-10 px-6 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Invoice Settings</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCT INVENTORY & PRICING MANAGER               */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Header with Search and Add Product Button */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setInventoryCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      inventoryCategory === c
                        ? 'bg-[#1A56DB] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Action and Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search catalog items..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg pl-8.5 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="h-9 px-3.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

            </div>

            {/* Inventory Table / Cards */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Products in Garhwa Showroom ({filteredInventory.length})
                </span>
                <span className="text-xs text-gray-500">
                  Click 'In Stock' to toggle immediate customer availability
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredInventory.slice(0, 50).map((product) => (
                  <div key={product.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors">
                    
                    {/* Left: Product Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-[#F8FAFC] border border-gray-100 p-1 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{product.brand}</span>
                          <span className="text-[10px] font-semibold text-gray-400">• SKU: {product.sku}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">{product.category}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate mt-0.5">{product.name}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{product.specs}</p>
                      </div>
                    </div>

                    {/* Right: Price & In-Stock Toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      
                      {/* Price Control */}
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-400">Price:</span>
                          <span className="font-extrabold text-sm text-[#111827]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {product.mrp > product.price && (
                          <span className="text-[10.5px] text-gray-400 line-through block">
                            MRP ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Stock Toggle Button */}
                      <button
                        onClick={() => handleToggleStock(product.id)}
                        className={`h-8.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                          product.inStock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>

                      {/* Delete Product Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${product.name}" from database?`)) {
                            deleteProductFromDb(product.id);
                          }
                        }}
                        className="w-8.5 h-8.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>

              {filteredInventory.length > 50 && (
                <div className="p-3 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                  Showing first 50 of {filteredInventory.length} items. Use category filters or search above to refine.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CUSTOMER LEADS & INQUIRIES                         */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-2xs">
              <h3 className="font-extrabold text-base text-[#111827] mb-1">
                Showroom Hardware & CCTV Inquiries ({leads.length})
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Customers who requested custom PC builds, bulk laptop quotes, or CP-PLUS CCTV installations in Garhwa.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {leads.map((lead: any) => (
                  <div key={lead.id} className="bg-gray-50/70 border border-gray-200 rounded-xl p-4 space-y-2.5 hover:border-blue-200 transition-colors">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">{lead.customerName}</span>
                        <span className="text-[11px] text-gray-500">{lead.location} • {lead.date}</span>
                      </div>
                      <span className="text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#1A56DB]">
                        {lead.type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100 leading-relaxed">
                      {lead.requirement}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Estimated Budget</span>
                        <span className="text-sm font-extrabold text-[#111827]">
                          ₹{(Number(lead.estimatedBudget) || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.customerName}, this is Lappy Solution Garhwa regarding your ${lead.type} inquiry.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white" />
                        <span>Send Quote</span>
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: HERO CAROUSEL BANNERS (Database Driven)             */}
        {/* ========================================================= */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-[#111827]">
                  Hero Carousel Banners ({banners.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage the high-impact banners displayed on the storefront top slider. Stored in SQLite database.
                </p>
              </div>

              <button
                onClick={() => setIsAddBannerOpen(true)}
                className="h-9 px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Banner</span>
              </button>
            </div>

            {banners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b, idx) => (
                  <div
                    key={b.id || idx}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          Position #{b.position || idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => editBanner({ ...b, status: b.status === 'active' ? 'inactive' : 'active' })}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              b.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {b.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete banner "${b.title}"?`)) {
                                deleteBanner(b.id);
                              }
                            }}
                            className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete banner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {b.desktopImage && (
                          <div className="w-20 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            <img src={b.desktopImage} alt={b.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          {b.badge && (
                            <span className="text-[9.5px] font-bold text-amber-600 uppercase block truncate">
                              {b.badge}
                            </span>
                          )}
                          <h4 className="font-extrabold text-sm text-gray-900 leading-snug line-clamp-1">
                            {b.title}
                          </h4>
                          {b.titleHighlight && (
                            <span className="text-xs font-bold text-blue-600 block line-clamp-1">
                              {b.titleHighlight}
                            </span>
                          )}
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                            {b.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-gray-700">CTA:</span>
                        <span>{b.buttonText}</span>
                        <span className="text-gray-400 font-mono text-[10px]">({b.buttonUrl})</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">
                        {b.bgGradient}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 text-sm">No custom banners yet</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Default showcase banners are running. Click "+ Add New Banner" to create a custom offer!
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: HOMEPAGE BUILDER & SECTION CUSTOMIZER               */}
        {/* ========================================================= */}
        {activeTab === 'homepage' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-[#111827]">
                  Homepage Sections & Product Curations ({homepageSections.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Rename any section (e.g. Trending Products, Best Seller, Premium Segment, Laptops), select custom products from inventory, or reorder sections live.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-time Live Sync</span>
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-2xs">
              {[...homepageSections]
                .sort((a, b) => a.position - b.position)
                .map((section, idx, arr) => {
                  let productCount = 0;
                  if (section.productIds) {
                    if (Array.isArray(section.productIds)) {
                      productCount = section.productIds.length;
                    } else if (typeof section.productIds === 'string') {
                      try {
                        productCount = JSON.parse(section.productIds).length;
                      } catch {
                        productCount = 0;
                      }
                    }
                  }

                  const isProductSection = [
                    'trending', 'bestsellers', 'premium', 'refurbished_laptops', 
                    'cctv_spotlight', 'featured'
                  ].includes(section.sectionKey) || !['banners', 'hero', 'trust_bar', 'categories', 'promo', 'brands', 'catalog_cta', 'showroom', 'blogs_preview'].includes(section.sectionKey);

                  return (
                    <div
                      key={section.id || section.sectionKey}
                      className={`p-3.5 sm:p-4.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-colors ${
                        section.isVisible ? 'bg-white' : 'bg-gray-50/70 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Position Badge */}
                        <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-extrabold text-xs text-gray-700 flex-shrink-0 mt-0.5">
                          #{idx + 1}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-sm text-gray-900">
                              {section.title}
                            </h4>
                            {section.badge && (
                              <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-[#1A56DB] border border-blue-200 px-2 py-0.5 rounded-full">
                                {section.badge}
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                              {section.sectionKey}
                            </span>
                          </div>

                          {section.subtitle && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {section.subtitle}
                            </p>
                          )}

                          {isProductSection && (
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                productCount > 0 
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                <ShoppingBag className="w-3 h-3" />
                                <span>{productCount > 0 ? `${productCount} Custom Products Selected` : 'Using Smart Fallback (No manual products)'}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        
                        {/* Edit Name & Details */}
                        <button
                          onClick={() => handleOpenEditSection(section)}
                          className="h-8 px-2.5 rounded-lg bg-blue-50 text-[#1A56DB] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 border border-blue-200 cursor-pointer transition-colors"
                          title="Rename section or change badge & subtitle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Rename & Edit</span>
                        </button>

                        {/* Select Products */}
                        {isProductSection && (
                          <button
                            onClick={() => handleOpenManageProducts(section)}
                            className="h-8 px-2.5 rounded-lg bg-purple-50 text-[#7C3AED] hover:bg-purple-100 text-xs font-bold flex items-center gap-1 border border-purple-200 cursor-pointer transition-colors"
                            title="Select which products appear in this section"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Select Products</span>
                          </button>
                        )}

                        {/* Move Up */}
                        <button
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === arr.length - 1}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Visibility Toggle */}
                        <button
                          onClick={() => handleToggleSection(section.id)}
                          className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                            section.isVisible
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {section.isVisible ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: CUSTOM PAGES BUILDER (CMS)                           */}
        {/* ========================================================= */}
        {activeTab === 'pages' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-[#111827]">
                  Custom Pages & Policies CMS ({customPages.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Create, edit, and publish store pages such as Terms and Conditions, Privacy Policy, Warranty Policy, About Us, or any custom content.
                </p>
              </div>

              <button
                onClick={handleOpenCreatePage}
                className="h-9 px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Page</span>
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-2xs">
              {customPages.map((page) => (
                <div
                  key={page.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1A56DB]" />
                      <h4 className="font-bold text-sm text-gray-900">{page.title}</h4>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        page.status === 'published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {page.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>URL: <code className="text-[#1A56DB] bg-blue-50/50 px-1 py-0.5 rounded">/pages/{page.slug}</code></span>
                      {page.updatedAt && <span>• Updated {new Date(page.updatedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/pages/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </a>

                    <button
                      onClick={() => handleOpenEditPage(page)}
                      className="h-8 px-3 rounded-lg bg-blue-50 text-[#1A56DB] hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Page</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the page "${page.title}"?`)) {
                          deleteCustomPage(page.id);
                        }
                      }}
                      className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: TECH BLOGS MANAGER (CMS)                             */}
        {/* ========================================================= */}
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-[#111827]">
                  Tech Blogs & Hardware Buying Guides ({blogPosts.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Publish expert tutorials, refurbished laptop reviews, and buying guides. They appear directly on the homepage and at <code className="text-[#1A56DB]">/blogs</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/blogs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Blog Page</span>
                </a>

                <button
                  onClick={handleOpenCreateBlog}
                  className="h-9 px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Blog</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogPosts.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-slate-900 relative overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#1A56DB] text-white">
                        {blog.category}
                      </span>
                      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        blog.status === 'published' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {blog.status}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                        {blog.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                      <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                        <span>{blog.author}</span>
                        <span>{blog.readTime} read</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <a
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#1A56DB] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Post</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditBlog(blog)}
                        className="h-7 px-2.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-[#1A56DB]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete article "${blog.title}"?`)) {
                            deleteBlogPost(blog.id);
                          }
                        }}
                        className="h-7 w-7 rounded-lg bg-white border border-gray-200 hover:bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                        title="Delete Blog"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: THEME & BRAND APPEARANCE                            */}
        {/* ========================================================= */}
        {activeTab === 'theme' && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-2xs max-w-3xl space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-[#111827]">
                Store Theme Colors & Announcement Bar
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize brand colors, button accents, and the top promotional marquee stored in the database.
              </p>
            </div>

            <form onSubmit={handleSaveTheme} className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Primary Brand Color */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <label className="font-bold text-gray-700 block">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themePrimary}
                      onChange={(e) => setThemePrimary(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={themePrimary}
                      onChange={(e) => setThemePrimary(e.target.value)}
                      className="h-9 w-full bg-white border border-gray-200 rounded-lg px-2.5 font-mono text-xs text-gray-800"
                    />
                  </div>
                  <span className="text-[10.5px] text-gray-400 block">Headers, badges, primary buttons</span>
                </div>

                {/* Secondary Accent Color */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <label className="font-bold text-gray-700 block">Accent / Deal Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSecondary}
                      onChange={(e) => setThemeSecondary(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={themeSecondary}
                      onChange={(e) => setThemeSecondary(e.target.value)}
                      className="h-9 w-full bg-white border border-gray-200 rounded-lg px-2.5 font-mono text-xs text-gray-800"
                    />
                  </div>
                  <span className="text-[10.5px] text-gray-400 block">Buy Now, Sale highlights (Flipkart orange)</span>
                </div>

                {/* Deal / Trust Color */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <label className="font-bold text-gray-700 block">Success / In-Stock Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeDeal}
                      onChange={(e) => setThemeDeal(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={themeDeal}
                      onChange={(e) => setThemeDeal(e.target.value)}
                      className="h-9 w-full bg-white border border-gray-200 rounded-lg px-2.5 font-mono text-xs text-gray-800"
                    />
                  </div>
                  <span className="text-[10.5px] text-gray-400 block">Verified badges, in-stock badges</span>
                </div>
              </div>

              {/* Announcement Bar Text */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">
                  Top Header Announcement Bar Text
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  placeholder="e.g. 100% Asli Samaan • 18% GST Bill • Garhwa & Palamu Delivery"
                />
                <span className="text-[11px] text-gray-400">
                  Displayed at the very top of all store pages next to phone helpline.
                </span>
              </div>

              {/* Live Preview Sample */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block">Live Palette Preview</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    style={{ backgroundColor: themePrimary }}
                    className="h-8 px-3 rounded-lg text-white font-bold text-xs"
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    style={{ backgroundColor: themeSecondary }}
                    className="h-8 px-3 rounded-lg text-white font-bold text-xs"
                  >
                    Buy Now
                  </button>
                  <span
                    style={{ backgroundColor: `${themeDeal}20`, color: themeDeal, borderColor: `${themeDeal}40` }}
                    className="px-2.5 py-1 rounded text-xs font-bold border"
                  >
                    Verified Showroom
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Theme to Database</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: STORE SETTINGS & UPI QR DETAILS (Full CMS Form)     */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl text-xs">
            
            {/* 1. Payment & Settlement Section */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#111827]">
                    Official Payment & UPI Settlement
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Controls customer QR code generation on checkout and payment instructions.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1A56DB] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Official UPI ID for QR *</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 font-mono text-xs text-blue-900 font-bold focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                  <span className="text-[10.5px] text-gray-400 mt-0.5 block">e.g. 9608828288@okbizaxis (generates live QR)</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">UPI Merchant Payee Name *</label>
                  <input
                    type="text"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                  <span className="text-[10.5px] text-gray-400 mt-0.5 block">Official merchant registered name</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                  <span className="text-[10.5px] text-gray-400 mt-0.5 block">18% standard for computer electronics</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Showroom GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 font-mono text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                  <span className="text-[10.5px] text-gray-400 mt-0.5 block">Printed on customer GST invoices</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="codEnabled"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1A56DB] cursor-pointer"
                />
                <label htmlFor="codEnabled" className="font-bold text-gray-700 cursor-pointer">
                  Enable Cash on Delivery / Counter Pickup (Pay at showroom in Garhwa)
                </label>
              </div>
            </div>

            {/* 2. Showroom Legal & Contact Details */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#111827]">
                    Showroom Legal Coordinates & Contact
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Physical location, customer support phone, and business timings.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-green-50 text-[#15803D] flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Showroom / Store Name *</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Marketing Tagline</label>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Customer Helpline Phone *</label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Official WhatsApp Number *</label>
                  <input
                    type="text"
                    value={storeWhatsapp}
                    onChange={(e) => setStoreWhatsapp(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Operating Hours / Timings</label>
                  <input
                    type="text"
                    value={storeTimings}
                    onChange={(e) => setStoreTimings(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Showroom Physical Address</label>
                  <input
                    type="text"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Settings to Database</span>
                </button>
              </div>

            </div>

          </form>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD PRODUCT TO INVENTORY                          */}
      {/* ========================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-[#111827]">
                Add New Product to Showroom Inventory
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dell Inspiron 15 (16GB RAM / 512GB SSD)"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="HP, Dell, CP-PLUS, Epson..."
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 52999"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 64999"
                    value={newProductMrp}
                    onChange={(e) => setNewProductMrp(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Key Specifications</label>
                <input
                  type="text"
                  placeholder="e.g. Intel Core i5 | 16GB RAM | 512GB NVMe SSD | Win 11"
                  value={newProductSpecs}
                  onChange={(e) => setNewProductSpecs(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs"
                >
                  Save to Inventory
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD HERO BANNER                                   */}
      {/* ========================================================= */}
      {isAddBannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-[#111827]">
                Create New Hero Carousel Banner
              </h3>
              <button
                onClick={() => setIsAddBannerOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBannerSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-gray-700 block mb-1">Banner Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Upgrade to 12th & 13th Gen Laptops"
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Highlight Offer Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Save Up to 45% + 18% GST Bill"
                  value={newBannerHighlight}
                  onChange={(e) => setNewBannerHighlight(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Subtitle / Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. HP 15s, Dell Inspiron, Lenovo in stock with 16GB RAM..."
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={newBannerBtnText}
                    onChange={(e) => setNewBannerBtnText(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Button Target Link</label>
                  <input
                    type="text"
                    value={newBannerBtnUrl}
                    onChange={(e) => setNewBannerBtnUrl(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Gradient Theme</label>
                  <select
                    value={newBannerGradient}
                    onChange={(e) => setNewBannerGradient(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  >
                    <option value="from-[#0A1633] via-[#0F2960] to-[#1A56DB]">Royal Navy Blue</option>
                    <option value="from-[#03241C] via-[#064E3B] to-[#047857]">Emerald Forest</option>
                    <option value="from-[#171033] via-[#2E1065] to-[#4338CA]">Cyber Purple</option>
                    <option value="from-[#381504] via-[#78350F] to-[#EA580C]">Sunset Amber</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={newBannerImage}
                  onChange={(e) => setNewBannerImage(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBannerOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs"
                >
                  Save Banner to Database
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: EDIT HOMEPAGE SECTION DETAILS                    */}
      {/* ========================================================= */}
      {isEditSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-[#111827]">
                  Rename & Customize Section
                </h3>
                <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                  Key: {editingSectionKey}
                </span>
              </div>
              <button
                onClick={() => setIsEditSectionOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSectionDetails} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Section Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Trending Products, Best Seller, Premium Segment, Laptops"
                  value={editingSectionTitle}
                  onChange={(e) => setEditingSectionTitle(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Badge Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 🔥 HOT TRENDING, ⭐ BESTSELLERS, 👑 PREMIUM"
                  value={editingSectionBadge}
                  onChange={(e) => setEditingSectionBadge(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  placeholder="Short tagline explaining what products are in this section..."
                  value={editingSectionSubtitle}
                  onChange={(e) => setEditingSectionSubtitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditSectionOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Section Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MANAGE PRODUCTS FOR SECTION                      */}
      {/* ========================================================= */}
      {isManageSectionProductsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <div>
                <h3 className="font-extrabold text-base text-[#111827] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#1A56DB]" />
                  <span>Select Products for &quot;{managingSectionTitle}&quot;</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose specific products from your 413-item inventory to display in this homepage section.
                </p>
              </div>
              <button
                onClick={() => setIsManageSectionProductsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200/80 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              
              {/* Selected Products Strip */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#1E3A8A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A56DB]" />
                    <span>Currently Assigned Products ({selectedProductIds.length})</span>
                  </h4>
                  {selectedProductIds.length > 0 && (
                    <button
                      onClick={() => setSelectedProductIds([])}
                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {selectedProductIds.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-1">
                    No custom products selected. This section will automatically use smart category fallbacks until you select products below.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                    {selectedProductIds.map((id) => {
                      const prod = products.find((p) => p.id === id);
                      if (!prod) return null;
                      return (
                        <div
                          key={id}
                          className="bg-white border border-blue-200 rounded-lg pl-2 pr-1.5 py-1 flex items-center gap-2 text-xs shadow-2xs"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-6 h-6 object-contain rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/products/laptop-dell.png';
                            }}
                          />
                          <span className="font-bold text-gray-800 max-w-[140px] truncate">{prod.name}</span>
                          <span className="text-[11px] font-extrabold text-[#1A56DB]">₹{prod.price.toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => handleToggleProductForSection(id)}
                            className="w-5 h-5 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center cursor-pointer ml-1"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, brand, or specs in 413 products..."
                    value={sectionProductSearch}
                    onChange={(e) => setSectionProductSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <select
                  value={sectionProductCategory}
                  onChange={(e) => setSectionProductCategory(e.target.value)}
                  className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1A56DB] w-full sm:w-48"
                >
                  <option value="All">All Categories ({products.length})</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Computers">Computers & Desktops</option>
                  <option value="CCTV & Security">CCTV & Security</option>
                  <option value="Printers">Printers & Inks</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Storage & Parts">Storage & Parts</option>
                </select>
              </div>

              {/* Available Products Grid */}
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {products
                  .filter((p) => {
                    if (sectionProductCategory !== 'All' && p.category !== sectionProductCategory) return false;
                    if (sectionProductSearch.trim()) {
                      const q = sectionProductSearch.toLowerCase();
                      const matchName = p.name.toLowerCase().includes(q);
                      const matchBrand = p.brand.toLowerCase().includes(q);
                      const matchSpecs = (p.specs || '').toLowerCase().includes(q);
                      if (!matchName && !matchBrand && !matchSpecs) return false;
                    }
                    return true;
                  })
                  .slice(0, 60)
                  .map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                          isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/products/laptop-dell.png';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase text-gray-400">{product.brand}</span>
                              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1 rounded">{product.category}</span>
                            </div>
                            <h5 className="font-bold text-xs text-gray-900 truncate max-w-md">{product.name}</h5>
                            <span className="text-xs font-black text-[#1A56DB]">₹{product.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleProductForSection(product.id)}
                          className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                              : 'bg-[#1A56DB] text-white hover:bg-[#1E40AF]'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Section</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <span className="text-xs font-bold text-gray-600">
                {selectedProductIds.length} Products Chosen for &quot;{managingSectionTitle}&quot;
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsManageSectionProductsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSectionProducts}
                  className="px-5 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Section Products
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CREATE / EDIT CUSTOM PAGE                        */}
      {/* ========================================================= */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <h3 className="font-extrabold text-base text-[#111827] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1A56DB]" />
                <span>{editingPageId ? 'Edit Custom Page' : 'Create New Custom Page'}</span>
              </h3>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200/80 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Page Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Terms and Conditions, Return Policy, Laptop Repairing"
                      value={pageTitle}
                      onChange={(e) => {
                        setPageTitle(e.target.value);
                        if (!editingPageId) {
                          setPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">URL Slug *</label>
                    <input
                      type="text"
                      placeholder="e.g. terms-and-conditions, return-policy"
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Status</label>
                    <select
                      value={pageStatus}
                      onChange={(e) => setPageStatus(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    >
                      <option value="published">Published (Live at /pages/[slug])</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Meta Title (SEO)</label>
                    <input
                      type="text"
                      placeholder="Title for Google and social sharing"
                      value={pageMetaTitle}
                      onChange={(e) => setPageMetaTitle(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700 block">Page Content (Markdown / Text) *</label>
                    <span className="text-[11px] text-gray-400">
                      Supports <code>## Heading</code>, <code>* Bullets</code>, <code>&gt; Notes</code>
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    placeholder="Write detailed policy text, warranty coverage terms, contact details, or company information..."
                    value={pageContent}
                    onChange={(e) => setPageContent(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-900 leading-relaxed focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>

              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0 bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save & Publish Page
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: CREATE / EDIT BLOG POST                          */}
      {/* ========================================================= */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <h3 className="font-extrabold text-base text-[#111827] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1A56DB]" />
                <span>{editingBlogId ? 'Edit Tech Blog' : 'Write New Tech Blog'}</span>
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200/80 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Article Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Best Refurbished Laptops Under ₹25,000 in Garhwa"
                      value={blogTitle}
                      onChange={(e) => {
                        setBlogTitle(e.target.value);
                        if (!editingBlogId) {
                          setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Slug *</label>
                    <input
                      type="text"
                      placeholder="e.g. best-refurbished-laptops-under-25000"
                      value={blogSlug}
                      onChange={(e) => setBlogSlug(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Category</label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    >
                      <option value="Refurbished Guides">Refurbished Guides</option>
                      <option value="Monitors & Displays">Monitors & Displays</option>
                      <option value="CCTV & Security">CCTV & Security</option>
                      <option value="Hardware Repair">Hardware Repair</option>
                      <option value="Buying Guides">Buying Guides</option>
                      <option value="Printers & Inks">Printers & Inks</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Author</label>
                    <input
                      type="text"
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Read Time</label>
                    <input
                      type="text"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      value={blogCoverImage}
                      onChange={(e) => setBlogCoverImage(e.target.value)}
                      placeholder="/images/banners/refurbished-laptops-printers.png"
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="refurbished, dell, hp, garhwa, warranty"
                      value={blogTags}
                      onChange={(e) => setBlogTags(e.target.value)}
                      className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Short Excerpt (Summary for preview) *</label>
                  <textarea
                    rows={2}
                    placeholder="Short 1-2 sentence preview for search engines and homepage cards..."
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700 block">Article Body (Markdown Formatted) *</label>
                    <span className="text-[11px] text-gray-400">
                      Use <code>## Heading</code>, <code>### Subhead</code>, <code>* Bullets</code>, <code>&gt; Quote</code>
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    placeholder="Write the full guide, technical analysis, comparisons, benchmark tests, or step-by-step tutorial..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-900 leading-relaxed focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>

              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0 bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
