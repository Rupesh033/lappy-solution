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
  BookOpen, Star, Crown, Laptop, Box, Award, AlertTriangle, MoreVertical,
  SlidersHorizontal, ArrowUpDown, Pencil, ChevronDown, Download, Upload, Tag
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
    updateStoreAndPaymentSettings,
    invoices,
    invoiceSettings,
    updateInvoiceSettings,
    createManualInvoice,
    deleteInvoice,
    updateInvoice,
    addProductToDb,
    updateProductInDb,
    deleteProductFromDb,
    syncWithDatabase,
    showToast,
    coupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    fetchCoupons
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'billing' | 'coupons' | 'banners' | 'homepage' | 'pages' | 'blogs' | 'theme' | 'settings' | 'leads'>('orders');
  
  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'verified' | 'packed' | 'shipped' | 'delivered'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Inventory Filters (Matching Image 2)
  const [inventoryCategory, setInventoryCategory] = useState<string>('All');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryBrand, setInventoryBrand] = useState<string>('All');
  const [inventoryStatus, setInventoryStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [inventoryStockLevel, setInventoryStockLevel] = useState<'all' | 'high' | 'low' | 'out'>('all');
  const [inventoryPriceRange, setInventoryPriceRange] = useState<'all' | 'under_1k' | '1k_10k' | '10k_50k' | 'above_50k'>('all');
  const [inventorySort, setInventorySort] = useState<'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'stock_asc'>('newest');
  const [inventorySelectedIds, setInventorySelectedIds] = useState<string[]>([]);

  // Live Inline Price Editing State
  const [inlineEditingPriceId, setInlineEditingPriceId] = useState<string | null>(null);
  const [inlineEditingPriceVal, setInlineEditingPriceVal] = useState<string>('');

  // Edit Product Modal State
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editStockQuantity, setEditStockQuantity] = useState(10);
  const [editInStock, setEditInStock] = useState(true);
  const [editImage, setEditImage] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editGstRate, setEditGstRate] = useState(18);
  const [editHsnCode, setEditHsnCode] = useState('8471');

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<string>('Laptops');
  const [newProductBrand, setNewProductBrand] = useState('HP');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductMrp, setNewProductMrp] = useState('');
  const [newProductStockQuantity, setNewProductStockQuantity] = useState(10);
  const [newProductSpecs, setNewProductSpecs] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80');
  const [newProductGstRate, setNewProductGstRate] = useState(18);
  const [newProductHsnCode, setNewProductHsnCode] = useState('8471');

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

  const [upiId, setUpiId] = useState(paymentSettings?.upiId || 'lappy.solution@ybl');
  const [upiName, setUpiName] = useState(paymentSettings?.upiName || 'LAPIEZ GARHWA');
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
  const [invBizName, setInvBizName] = useState(invoiceSettings?.businessName || 'Lapiez');
  const [invAddress, setInvAddress] = useState(invoiceSettings?.address || 'In front of G P Plaza, Chiniya Road');
  const [invGstin, setInvGstin] = useState(invoiceSettings?.gstin || '20AABCL1234F1Z5');
  const [invPan, setInvPan] = useState(invoiceSettings?.pan || 'AABCL1234F');
  const [invPhone, setInvPhone] = useState(invoiceSettings?.phone || '+91 9608828288');
  const [invEmail, setInvEmail] = useState(invoiceSettings?.email || 'lappysolution2018@gmail.com');
  const [invPrefix, setInvPrefix] = useState(invoiceSettings?.prefix || 'INV');
  const [invFinancialYear, setInvFinancialYear] = useState(invoiceSettings?.financialYear || '2026-27');
  const [invUpiId, setInvUpiId] = useState(invoiceSettings?.upiId || 'lappy.solution@ybl');
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

  // Inventory Toggle Stock (Persists directly to DB)
  const handleToggleStock = async (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const nextInStock = !prod.inStock;
    await updateProductInDb(productId, { inStock: nextInStock });
    showToast(`"${prod.name.slice(0, 22)}..." marked as ${nextInStock ? 'In Stock' : 'Out of Stock'}`);
  };

  // Live Inline Price Editing Handlers
  const handleStartInlineEdit = (p: Product) => {
    setInlineEditingPriceId(p.id);
    setInlineEditingPriceVal(String(p.price));
  };

  const handleSaveInlinePrice = async (productId: string) => {
    const val = Number(inlineEditingPriceVal);
    if (isNaN(val) || val <= 0) {
      showToast('Please enter a valid price amount');
      return;
    }
    const success = await updateProductInDb(productId, { price: val });
    if (success) {
      setInlineEditingPriceId(null);
      setInlineEditingPriceVal('');
      showToast(`Live price updated to ₹${val.toLocaleString('en-IN')}`);
    }
  };

  const handleCancelInlinePrice = () => {
    setInlineEditingPriceId(null);
    setInlineEditingPriceVal('');
  };

  // Full Edit Product Modal Handlers
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditCategory(p.category);
    setEditBrand(p.brand);
    setEditPrice(String(p.price));
    setEditMrp(String(p.mrp || p.price));
    setEditStockQuantity(p.stockQuantity ?? 10);
    setEditInStock(p.inStock ?? true);
    setEditImage(p.image || '');
    setEditSpecs(p.specs || '');
    setEditDescription(p.description || '');
    setEditGstRate(p.gstRate !== undefined ? Number(p.gstRate) : 18);
    setEditHsnCode(p.hsnCode || '8471');
    setIsEditProductModalOpen(true);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const priceNum = Number(editPrice);
    const mrpNum = Number(editMrp) || priceNum;
    if (!editName.trim() || isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter valid product title and price');
      return;
    }
    const discount = Math.round(((mrpNum - priceNum) / mrpNum) * 100);
    const success = await updateProductInDb(editingProduct.id, {
      name: editName.trim(),
      category: editCategory.trim() as any,
      brand: editBrand.trim(),
      price: priceNum,
      mrp: mrpNum,
      discount: discount > 0 ? discount : 0,
      stockQuantity: Number(editStockQuantity) || 0,
      inStock: editInStock,
      image: editImage.trim() || editingProduct.image,
      specs: editSpecs.trim(),
      description: editDescription.trim(),
      gstRate: Number(editGstRate) !== undefined && !isNaN(Number(editGstRate)) ? Number(editGstRate) : 18,
      hsnCode: editHsnCode.trim() || '8471',
    });
    if (success) {
      setIsEditProductModalOpen(false);
      setEditingProduct(null);
      showToast(`Product "${editName.slice(0, 20)}..." updated successfully!`);
    }
  };

  // Bulk Selection Handlers
  const handleToggleSelectAll = (visibleItems: Product[]) => {
    if (inventorySelectedIds.length === visibleItems.length && visibleItems.length > 0) {
      setInventorySelectedIds([]);
    } else {
      setInventorySelectedIds(visibleItems.map(p => p.id));
    }
  };

  const handleToggleSelectProduct = (id: string) => {
    setInventorySelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkToggleStock = async (inStock: boolean) => {
    if (inventorySelectedIds.length === 0) return;
    for (const id of inventorySelectedIds) {
      await updateProductInDb(id, { inStock });
    }
    showToast(`Updated stock status for ${inventorySelectedIds.length} products!`);
    setInventorySelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (inventorySelectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${inventorySelectedIds.length} selected products? This action cannot be undone.`)) return;
    for (const id of inventorySelectedIds) {
      await deleteProductFromDb(id);
    }
    showToast(`Deleted ${inventorySelectedIds.length} products!`);
    setInventorySelectedIds([]);
  };

  // Export Inventory CSV
  const handleExportInventoryCsv = (itemsToExport: Product[]) => {
    const headers = ['ID', 'SKU', 'Name', 'Brand', 'Category', 'Price', 'MRP', 'Stock', 'InStock', 'GST_Rate', 'HSN', 'Rating'];
    const rows = itemsToExport.map(p => [
      `"${p.id}"`,
      `"${p.sku || ''}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.brand || ''}"`,
      `"${p.category || ''}"`,
      p.price,
      p.mrp,
      p.stockQuantity ?? 10,
      p.inStock ? 'In Stock' : 'Out of Stock',
      `${p.gstRate ?? 18}%`,
      `"${p.hsnCode || '8471'}"`,
      p.rating || 4.5
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lapiez_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${itemsToExport.length} products to CSV!`);
  };

  // Add Product Submit (Persists to DB)
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice) {
      showToast('Please enter product name and price');
      return;
    }

    const priceNum = Number(newProductPrice);
    const mrpNum = Number(newProductMrp) || Math.round(priceNum * 1.2);
    const discount = Math.round(((mrpNum - priceNum) / mrpNum) * 100);

    const newProd: Partial<Product> = {
      name: newProductName.trim(),
      category: newProductCategory.trim() as any,
      brand: newProductBrand.trim(),
      price: priceNum,
      mrp: mrpNum,
      discount: discount > 0 ? discount : 10,
      specs: newProductSpecs.trim() || 'Genuine showroom sealed hardware with official manufacturer warranty.',
      description: newProductDescription.trim() || newProductSpecs.trim() || newProductName.trim(),
      image: newProductImage.trim() || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockQuantity: Number(newProductStockQuantity) || 10,
      sku: `LS-${newProductCategory.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 4.8,
      gstRate: Number(newProductGstRate) !== undefined && !isNaN(Number(newProductGstRate)) ? Number(newProductGstRate) : 18,
      hsnCode: newProductHsnCode.trim() || '8471',
    };

    await addProductToDb(newProd);
    setIsAddProductOpen(false);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductMrp('');
    setNewProductSpecs('');
    setNewProductDescription('');
    setNewProductGstRate(18);
    setNewProductHsnCode('8471');
    showToast('Product added successfully to catalog!');
  };

  // Image Upload Handlers (Device / Mobile Gallery)
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size should be less than 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setNewBannerImage(event.target.result);
        showToast('Banner image uploaded from gallery!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size should be less than 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        if (isEdit) {
          setEditImage(event.target.result);
        } else {
          setNewProductImage(event.target.result);
        }
        showToast('Product photo uploaded from gallery!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const count = files.length;
    let completed = 0;
    const urls: string[] = [];

    for (let i = 0; i < count; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          urls.push(event.target.result);
        }
        completed++;
        if (completed === count) {
          if (urls.length > 0) {
            setNewProductImage(urls[0]);
            showToast(`Loaded ${urls.length} images from gallery!`);
          }
        }
      };
      reader.readAsDataURL(file);
    }
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
      whatsappMsg: `Hello Lapiez Garhwa, I want to inquire about: ${newBannerTitle}`,
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
  const [blogAuthor, setBlogAuthor] = useState('Lapiez Tech Team');
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
    setBlogAuthor('Lapiez Tech Team');
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

  // Coupon Management States & Handlers
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponTitleInput, setCouponTitleInput] = useState('');
  const [couponDiscountType, setCouponDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponDiscountValue, setCouponDiscountValue] = useState('5');
  const [couponMinOrder, setCouponMinOrder] = useState('499');
  const [couponMaxDiscount, setCouponMaxDiscount] = useState('1000');
  const [couponAudience, setCouponAudience] = useState<'normal' | 'premium' | 'all'>('normal');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponValidUntil, setCouponValidUntil] = useState('2027-12-31');
  const [couponIsActive, setCouponIsActive] = useState(true);

  const handleOpenCreateCoupon = () => {
    setEditingCouponId(null);
    setCouponCodeInput('');
    setCouponTitleInput('');
    setCouponDiscountType('percentage');
    setCouponDiscountValue('5');
    setCouponMinOrder('499');
    setCouponMaxDiscount('1000');
    setCouponAudience('normal');
    setCouponDesc('');
    setCouponValidUntil('2027-12-31');
    setCouponIsActive(true);
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (c: any) => {
    setEditingCouponId(c.id);
    setCouponCodeInput(c.code);
    setCouponTitleInput(c.title || '');
    setCouponDiscountType(c.discountType);
    setCouponDiscountValue(String(c.discountValue));
    setCouponMinOrder(String(c.minOrder || 0));
    setCouponMaxDiscount(c.maxDiscount ? String(c.maxDiscount) : '');
    setCouponAudience(c.audience || 'normal');
    setCouponDesc(c.description || '');
    setCouponValidUntil(c.validUntil || '2027-12-31');
    setCouponIsActive(c.isActive !== false);
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim() || !couponDiscountValue) {
      showToast('Please enter coupon code and discount value');
      return;
    }

    const payload = {
      code: couponCodeInput.trim().toUpperCase(),
      title: couponTitleInput.trim() || couponCodeInput.trim().toUpperCase(),
      discountType: couponDiscountType,
      discountValue: Number(couponDiscountValue) || 0,
      minOrder: Number(couponMinOrder) || 0,
      maxDiscount: couponMaxDiscount ? Number(couponMaxDiscount) : undefined,
      audience: couponAudience,
      description: couponDesc.trim(),
      validUntil: couponValidUntil || undefined,
      isActive: couponIsActive,
    };

    if (editingCouponId) {
      await updateCoupon(editingCouponId, payload);
    } else {
      await createCoupon(payload);
    }
    setIsCouponModalOpen(false);
  };

  const handleToggleCouponStatus = async (coupon: any) => {
    await updateCoupon(coupon.id, { isActive: !coupon.isActive });
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon ${code}?`)) {
      await deleteCoupon(id);
    }
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

  // Save Settings Form State & Handler
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateStoreAndPaymentSettings(
        {
          siteName: storeName,
          tagline: storeTagline,
          phone: storePhone,
          whatsapp: storeWhatsapp,
          email: storeEmail,
          address: storeAddress,
          timings: storeTimings,
        },
        {
          upiId,
          upiName,
          gstRate: Number(gstRate),
          gstin,
          codEnabled,
        }
      );
    } catch (err: any) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Dynamic Categories and Department Counts (Matching Image 2)
  const distinctCategories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = p.category?.trim() || 'General';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Dynamic Brands (Matching Image 2)
  const distinctBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand?.trim()) set.add(p.brand.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  // Inventory KPI Counts (Matching Image 2)
  const inStockCount = useMemo(() => {
    return products.filter((p) => p.inStock && (p.stockQuantity ?? 10) > 0).length;
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.inStock && (p.stockQuantity ?? 10) <= 5 && (p.stockQuantity ?? 10) > 0).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => !p.inStock || (p.stockQuantity ?? 10) === 0).length;
  }, [products]);

  // Comprehensive Filtered & Sorted Inventory
  const filteredInventory = useMemo(() => {
    return products.filter((p) => {
      // 1. Department/Category Filter
      if (inventoryCategory !== 'All' && p.category !== inventoryCategory) {
        return false;
      }

      // 2. Brand Filter
      if (inventoryBrand !== 'All' && p.brand !== inventoryBrand) {
        return false;
      }

      // 3. Status Filter (In Stock, Low Stock, Out of Stock)
      const qty = p.stockQuantity ?? (p.inStock ? 10 : 0);
      const isActualInStock = p.inStock && qty > 0;
      if (inventoryStatus === 'in_stock' && (!isActualInStock || qty <= 5)) return false;
      if (inventoryStatus === 'low_stock' && (!isActualInStock || qty > 5)) return false;
      if (inventoryStatus === 'out_of_stock' && isActualInStock) return false;

      // 4. Stock Level Filter
      if (inventoryStockLevel === 'high' && qty < 10) return false;
      if (inventoryStockLevel === 'low' && (qty <= 0 || qty > 5)) return false;
      if (inventoryStockLevel === 'out' && qty > 0) return false;

      // 5. Price Range Filter
      if (inventoryPriceRange === 'under_1k' && p.price >= 1000) return false;
      if (inventoryPriceRange === '1k_10k' && (p.price < 1000 || p.price > 10000)) return false;
      if (inventoryPriceRange === '10k_50k' && (p.price < 10000 || p.price > 50000)) return false;
      if (inventoryPriceRange === 'above_50k' && p.price < 50000) return false;

      // 6. Search Bar Query
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesSku = (p.sku || '').toLowerCase().includes(q);
        const matchesCat = (p.category || '').toLowerCase().includes(q);
        const matchesSpecs = (p.specs || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSku && !matchesCat && !matchesSpecs) return false;
      }

      return true;
    }).sort((a, b) => {
      if (inventorySort === 'price_asc') return a.price - b.price;
      if (inventorySort === 'price_desc') return b.price - a.price;
      if (inventorySort === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (inventorySort === 'stock_asc') return (a.stockQuantity ?? 10) - (b.stockQuantity ?? 10);
      return 0;
    });
  }, [
    products, 
    inventoryCategory, 
    inventoryBrand, 
    inventoryStatus, 
    inventoryStockLevel, 
    inventoryPriceRange, 
    inventorySort, 
    inventorySearch
  ]);

  const categories = useMemo(() => ['All', ...distinctCategories.map((c) => c.name)], [distinctCategories]);

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
              {siteSettings?.siteName || 'Lapiez'} Console
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
                LP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Lapiez Merchant Console
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
              { id: 'coupons', label: 'Coupons & Discounts', count: coupons.length },
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
                            href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}, this is Lapiez Garhwa regarding your order ${order.orderId}.`)}`}
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
        {/* ========================================================= */}
        {/* TAB 2: ADVANCED ENTERPRISE INVENTORY DASHBOARD (IMAGE 2) */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            
            {/* 1. Header Toolbar (Title, Count Badge, Subtitle, Actions) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Inventory</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    {products.length.toLocaleString('en-IN')} Items
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage your products, stock, brands and categories — all in one place.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => handleExportInventoryCsv(filteredInventory)}
                  className="h-9 px-3.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  title="Export filtered items to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => {
                    const json = JSON.stringify(products, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `lapiez_catalog_backup_${Date.now()}.json`;
                    a.click();
                    showToast('Catalog backup JSON downloaded!');
                  }}
                  className="h-9 px-3.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  title="Export full catalog JSON"
                >
                  <Upload className="w-3.5 h-3.5 text-gray-500" />
                  <span>Backup JSON</span>
                </button>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="h-9 px-4 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Add Product</span>
                </button>
              </div>
            </div>

            {/* 2. Top 5 KPI Summary Cards (Matching Image 2) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              
              {/* Card 1: TOTAL PRODUCTS */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                    TOTAL PRODUCTS
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                    <Box className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900 tracking-tight">
                  {products.length.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span>↗ +100% active catalog</span>
                </div>
              </div>

              {/* Card 2: IN STOCK */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                    IN STOCK
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700 tracking-tight">
                  {inStockCount.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{Math.round((inStockCount / Math.max(products.length, 1)) * 100)}% of catalog</span>
                </div>
              </div>

              {/* Card 3: LOW STOCK */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                    LOW STOCK
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600 tracking-tight">
                  {lowStockCount.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{Math.round((lowStockCount / Math.max(products.length, 1)) * 100)}% of catalog</span>
                </div>
              </div>

              {/* Card 4: OUT OF STOCK */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                    OUT OF STOCK
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600 tracking-tight">
                  {outOfStockCount.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{Math.round((outOfStockCount / Math.max(products.length, 1)) * 100)}% of catalog</span>
                </div>
              </div>

              {/* Card 5: TOTAL BRANDS */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                    TOTAL BRANDS
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900 tracking-tight">
                  {distinctBrands.length.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Active brand partners</span>
                </div>
              </div>

            </div>

            {/* 3. Main Two-Column Layout (Left Categories Sidebar + Right Inventory Table) */}
            <div className="flex flex-col lg:flex-row gap-5 items-start">
              
              {/* LEFT COLUMN: Categories Sidebar (Matching Image 2) */}
              <div className="w-full lg:w-60 flex-shrink-0 bg-white border border-[#E5E7EB] rounded-2xl p-3.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between px-2 pt-1">
                  <span className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
                    Categories
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {distinctCategories.length} DEPTS
                  </span>
                </div>

                <div className="space-y-1">
                  {/* All Categories Button */}
                  <button
                    onClick={() => setInventoryCategory('All')}
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      inventoryCategory === 'All'
                        ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] shadow-2xs'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>All Categories</span>
                    </div>
                    <span className="text-[10.5px] font-bold opacity-80">
                      {products.length}
                    </span>
                  </button>

                  {/* Individual Categories List */}
                  {distinctCategories.map((cat) => {
                    const isSelected = inventoryCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setInventoryCategory(cat.name)}
                        className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EFF6FF] text-[#1A56DB] font-bold border border-blue-200 shadow-2xs'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {cat.name.toLowerCase().includes('laptop') ? (
                            <Laptop className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          ) : cat.name.toLowerCase().includes('cctv') || cat.name.toLowerCase().includes('security') ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          ) : cat.name.toLowerCase().includes('printer') ? (
                            <Printer className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                          ) : cat.name.toLowerCase().includes('part') || cat.name.toLowerCase().includes('storage') ? (
                            <Sliders className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          ) : (
                            <Package className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 ml-1.5 flex-shrink-0">
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Filter Toolbar, Bulk Actions & Products Table */}
              <div className="flex-1 min-w-0 space-y-3.5 w-full">
                
                {/* Search & Filter Controls Toolbar (Matching Image 2) */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-2xs space-y-3">
                  <div className="flex flex-col md:flex-row items-center gap-2.5">
                    
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search products by name, SKU, brand, specs..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="w-full h-9 bg-gray-50 border border-gray-200 rounded-xl pl-8.5 pr-8 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A56DB] focus:bg-white transition-all"
                      />
                      {inventorySearch && (
                        <button
                          onClick={() => setInventorySearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Dropdowns Grid */}
                    <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                      
                      {/* Brand Dropdown */}
                      <select
                        value={inventoryBrand}
                        onChange={(e) => setInventoryBrand(e.target.value)}
                        className="h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#1A56DB] cursor-pointer"
                      >
                        <option value="All">All Brands ({distinctBrands.length})</option>
                        {distinctBrands.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>

                      {/* Status Dropdown */}
                      <select
                        value={inventoryStatus}
                        onChange={(e) => setInventoryStatus(e.target.value as any)}
                        className="h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#1A56DB] cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="in_stock">In Stock (&gt;5)</option>
                        <option value="low_stock">Low Stock (1-5)</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>

                      {/* Stock Level Dropdown */}
                      <select
                        value={inventoryStockLevel}
                        onChange={(e) => setInventoryStockLevel(e.target.value as any)}
                        className="h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#1A56DB] cursor-pointer"
                      >
                        <option value="all">All Stock Levels</option>
                        <option value="high">High Stock (10+)</option>
                        <option value="low">Low Stock (1-5)</option>
                        <option value="out">Out of Stock (0)</option>
                      </select>

                      {/* Price Range Dropdown */}
                      <select
                        value={inventoryPriceRange}
                        onChange={(e) => setInventoryPriceRange(e.target.value as any)}
                        className="h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#1A56DB] cursor-pointer"
                      >
                        <option value="all">Price Range</option>
                        <option value="under_1k">Under ₹1,000</option>
                        <option value="1k_10k">₹1,000 - ₹10,000</option>
                        <option value="10k_50k">₹10,000 - ₹50,000</option>
                        <option value="above_50k">Above ₹50,000</option>
                      </select>

                      {/* Sort Dropdown */}
                      <select
                        value={inventorySort}
                        onChange={(e) => setInventorySort(e.target.value as any)}
                        className="h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#1A56DB] cursor-pointer"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name: A to Z</option>
                        <option value="stock_asc">Stock: Low to High</option>
                      </select>

                    </div>
                  </div>

                  {/* Sub-toolbar: Results count & Active Reset */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                    <div>
                      Showing <strong className="text-gray-900">{filteredInventory.length}</strong> of{' '}
                      <strong className="text-gray-900">{products.length}</strong> products
                    </div>

                    {(inventoryCategory !== 'All' || inventoryBrand !== 'All' || inventoryStatus !== 'all' || inventoryStockLevel !== 'all' || inventoryPriceRange !== 'all' || inventorySearch) && (
                      <button
                        onClick={() => {
                          setInventoryCategory('All');
                          setInventoryBrand('All');
                          setInventoryStatus('all');
                          setInventoryStockLevel('all');
                          setInventoryPriceRange('all');
                          setInventorySearch('');
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bulk Actions Floating Bar (When items selected) */}
                {inventorySelectedIds.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs flex-wrap gap-2 shadow-sm animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-blue-900">
                      <span>{inventorySelectedIds.length} items selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBulkToggleStock(true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark In Stock</span>
                      </button>
                      <button
                        onClick={() => handleBulkToggleStock(false)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Mark Out of Stock</span>
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Selected</span>
                      </button>
                      <button
                        onClick={() => setInventorySelectedIds([])}
                        className="px-2.5 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Data Table (Exact Table Styling from Image 2) */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-gray-100">
                      <thead className="bg-[#F8FAFC] text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">
                        <tr>
                          <th className="py-3 px-3.5 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={inventorySelectedIds.length === filteredInventory.length && filteredInventory.length > 0}
                              onChange={() => handleToggleSelectAll(filteredInventory)}
                              className="rounded border-gray-300 text-[#1A56DB] focus:ring-0 cursor-pointer"
                            />
                          </th>
                          <th className="py-3 px-3.5">PRODUCT</th>
                          <th className="py-3 px-3">BRAND</th>
                          <th className="py-3 px-3">CATEGORY</th>
                          <th className="py-3 px-3">STOCK LEVEL</th>
                          <th className="py-3 px-3">LIVE PRICE</th>
                          <th className="py-3 px-3">GST & HSN</th>
                          <th className="py-3 px-3">STATUS</th>
                          <th className="py-3 px-3">UPDATED</th>
                          <th className="py-3 px-3 text-right pr-4">ACTIONS</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredInventory.slice(0, 100).map((product) => {
                          const isSelected = inventorySelectedIds.includes(product.id);
                          const isInlineEditing = inlineEditingPriceId === product.id;
                          const qty = product.stockQuantity ?? (product.inStock ? 10 : 0);
                          const isLowStock = product.inStock && qty <= 5 && qty > 0;
                          const isOutOfStock = !product.inStock || qty === 0;

                          return (
                            <tr
                              key={product.id}
                              className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                            >
                              {/* Checkbox */}
                              <td className="py-3 px-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectProduct(product.id)}
                                  className="rounded border-gray-300 text-[#1A56DB] focus:ring-0 cursor-pointer"
                                />
                              </td>

                              {/* Product Info */}
                              <td className="py-3 px-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-gray-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={product.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'}
                                      alt={product.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className="min-w-0 max-w-xs sm:max-w-sm">
                                    <div className="font-bold text-gray-900 truncate hover:text-[#1A56DB] transition-colors" title={product.name}>
                                      {product.name}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10.5px] mt-0.5">
                                      <span className="font-mono text-gray-500 font-semibold">
                                        SKU: {product.sku || 'N/A'}
                                      </span>
                                      {product.featured && (
                                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[9px]">
                                          FEATURED
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Brand */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                  {product.brand || 'General'}
                                </span>
                              </td>

                              {/* Category */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="font-semibold text-gray-800 text-[11.5px]">
                                  {product.category}
                                </div>
                              </td>

                              {/* Stock Level with Visual Bar */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="space-y-1">
                                  <span className={`text-[11px] font-bold ${
                                    isOutOfStock 
                                      ? 'text-rose-600' 
                                      : isLowStock 
                                      ? 'text-amber-600' 
                                      : 'text-emerald-700'
                                  }`}>
                                    {isOutOfStock ? '0 in stock' : `${qty} in stock`}
                                  </span>
                                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        isOutOfStock 
                                          ? 'bg-rose-500 w-0' 
                                          : isLowStock 
                                          ? 'bg-amber-500' 
                                          : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${Math.min(100, Math.max(isOutOfStock ? 0 : 10, (qty / 20) * 100))}%` }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Price (LIVE INLINE EDITABLE) */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                {isInlineEditing ? (
                                  <div className="flex items-center gap-1">
                                    <div className="relative">
                                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[11px]">₹</span>
                                      <input
                                        type="number"
                                        value={inlineEditingPriceVal}
                                        onChange={(e) => setInlineEditingPriceVal(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveInlinePrice(product.id);
                                          if (e.key === 'Escape') handleCancelInlinePrice();
                                        }}
                                        className="w-24 h-7 pl-4.5 pr-1.5 text-xs font-extrabold border-2 border-blue-600 rounded-lg bg-white text-gray-900 focus:outline-none shadow-xs"
                                        autoFocus
                                      />
                                    </div>
                                    <button
                                      onClick={() => handleSaveInlinePrice(product.id)}
                                      className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                      title="Save live price"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={handleCancelInlinePrice}
                                      className="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                                      title="Cancel"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => handleStartInlineEdit(product)}
                                    className="group flex items-center gap-1.5 cursor-pointer py-1 px-1.5 -ml-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                    title="Click to edit live price immediately"
                                  >
                                    <div>
                                      <span className="font-black text-xs text-gray-900">
                                        ₹{product.price.toLocaleString('en-IN')}
                                      </span>
                                      {product.mrp > product.price && (
                                        <span className="text-[10px] text-gray-400 line-through block">
                                          ₹{product.mrp.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                    <Pencil className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                )}
                              </td>

                              {/* GST & HSN Rate Badge */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="flex flex-col gap-0.5">
                                  <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold w-fit border ${
                                    product.gstRate === 0 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                      : product.gstRate === 28 
                                      ? 'bg-rose-50 text-rose-800 border-rose-200' 
                                      : 'bg-blue-50 text-blue-800 border-blue-200'
                                  }`}>
                                    GST {product.gstRate ?? 18}%
                                  </span>
                                  {product.hsnCode && (
                                    <span className="text-[9.5px] text-gray-400 font-mono">
                                      HSN: {product.hsnCode}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Status Toggle Pill Button */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <button
                                  onClick={() => handleToggleStock(product.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                                    isOutOfStock
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                      : isLowStock
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  }`}
                                  title="Click to toggle stock status in database"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`}
                                  />
                                  <span>
                                    {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                                  </span>
                                </button>
                              </td>

                              {/* Updated */}
                              <td className="py-3 px-3 whitespace-nowrap text-[11px] text-gray-400">
                                Recently
                              </td>

                              {/* Actions Dropdown / Buttons */}
                              <td className="py-3 px-3 whitespace-nowrap text-right pr-4">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditProduct(product)}
                                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#1A56DB] flex items-center justify-center transition-colors cursor-pointer"
                                    title="Edit Product Details"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete "${product.name}" from database?`)) {
                                        deleteProductFromDb(product.id);
                                      }
                                    }}
                                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })}

                        {filteredInventory.length === 0 && (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-gray-500 text-xs">
                              <Box className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                              <div className="font-bold text-gray-800 text-sm">No products found</div>
                              <p className="text-gray-400 mt-1">Try changing category, search query, or status filters.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredInventory.length > 100 && (
                    <div className="p-3 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                      Showing first 100 of {filteredInventory.length} products. Use filters to narrow results.
                    </div>
                  )}
                </div>

              </div>

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
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.customerName}, this is Lapiez Garhwa regarding your ${lead.type} inquiry.`)}`}
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

              <div className="flex items-center gap-2 flex-wrap">
                <label className="cursor-pointer h-9 px-3.5 rounded-lg bg-blue-50 border border-blue-200 text-[#1A56DB] hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Banner Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleBannerFileUpload(e);
                      setIsAddBannerOpen(true);
                    }}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setIsAddBannerOpen(true)}
                  className="h-9 px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Banner</span>
                </button>
              </div>
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
        {/* TAB: COUPONS & DISCOUNT ENGINE                           */}
        {/* ========================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Header Bar */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-[#111827]">
                    Coupons & Promotional Discounts
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1A56DB] border border-blue-100">
                    {coupons.length} Configured
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-xl">
                  Manage promotional coupons for normal shoppers and exclusive discounts for premium VIP members. Customers can apply these codes during cart and checkout.
                </p>
              </div>

              <button
                onClick={handleOpenCreateCoupon}
                className="h-10 px-4 rounded-xl bg-[#1A56DB] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Total Codes</span>
                <span className="text-xl font-extrabold text-[#111827] mt-0.5 block">{coupons.length}</span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
                <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Active Codes</span>
                <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
                  {coupons.filter(c => c.isActive).length}
                </span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Normal Customers</span>
                <span className="text-xl font-extrabold text-blue-700 mt-0.5 block">
                  {coupons.filter(c => c.audience === 'normal').length}
                </span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
                <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">Premium / VIP</span>
                <span className="text-xl font-extrabold text-purple-700 mt-0.5 block">
                  {coupons.filter(c => c.audience === 'premium').length}
                </span>
              </div>
            </div>

            {/* Coupons List / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => {
                const isPremium = coupon.audience === 'premium';
                const isNormal = coupon.audience === 'normal';

                return (
                  <div
                    key={coupon.id}
                    className={`bg-white border rounded-2xl p-5 shadow-2xs relative flex flex-col justify-between transition-all ${
                      coupon.isActive
                        ? isPremium
                          ? 'border-purple-200 ring-1 ring-purple-100 hover:shadow-md'
                          : 'border-blue-100 hover:shadow-md'
                        : 'border-gray-200 opacity-60 bg-gray-50/70'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                            isPremium
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : isNormal
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {isPremium ? (
                            <>
                              <Crown className="w-3 h-3 text-purple-600" />
                              <span>Premium VIP</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>Normal Shoppers</span>
                            </>
                          )}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            coupon.isActive
                              ? 'bg-emerald-500/10 text-emerald-700'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      {/* Code Banner */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-between mb-3">
                        <div>
                          <div className="font-mono font-black text-lg tracking-wider text-gray-900">
                            {coupon.code}
                          </div>
                          <div className="text-[11px] font-semibold text-[#1A56DB] mt-0.5">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}% Instant OFF`
                              : `₹${coupon.discountValue} Flat Discount`}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(coupon.code, 'Coupon Code')}
                          className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-gray-700 border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-bold text-sm text-gray-900 leading-snug">
                        {coupon.title}
                      </h4>
                      {coupon.description && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {coupon.description}
                        </p>
                      )}

                      {/* Rules / Thresholds */}
                      <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-1 text-[11px] text-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Min Order Value:</span>
                          <span className="font-semibold text-gray-800">
                            {coupon.minOrder && coupon.minOrder > 0 ? `₹${coupon.minOrder.toLocaleString('en-IN')}` : 'No minimum'}
                          </span>
                        </div>
                        {coupon.maxDiscount && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Max Discount Cap:</span>
                            <span className="font-semibold text-gray-800">
                              ₹{coupon.maxDiscount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                        {coupon.validUntil && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Valid Until:</span>
                            <span className="font-semibold text-gray-800">{coupon.validUntil}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Bottom Bar */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCouponStatus(coupon)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          coupon.isActive
                            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {coupon.isActive ? 'Pause' : 'Activate'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCoupon(coupon)}
                          className="h-8 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                          className="h-8 w-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  disabled={isSavingSettings}
                  className="h-10 px-6 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingSettings ? 'Saving Settings...' : 'Save All Settings to Database'}</span>
                </button>
              </div>

            </div>

          </form>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD PRODUCT TO INVENTORY                          */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* MODAL: ADD PRODUCT TO INVENTORY                          */}
      {/* ========================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1A56DB] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#111827]">
                    Add New Product to Catalog
                  </h3>
                  <p className="text-[11px] text-gray-500">Persists immediately to database and storefront</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. HP 15s Intel Core i5 12th Gen (16GB / 512GB SSD)"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  >
                    {distinctCategories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                    {!distinctCategories.some(c => c.name === 'Laptops') && <option value="Laptops">Laptops</option>}
                    {!distinctCategories.some(c => c.name === 'CCTV & Security') && <option value="CCTV & Security">CCTV & Security</option>}
                    {!distinctCategories.some(c => c.name === 'Printers') && <option value="Printers">Printers</option>}
                    {!distinctCategories.some(c => c.name === 'Computers') && <option value="Computers">Computers</option>}
                    {!distinctCategories.some(c => c.name === 'Accessories') && <option value="Accessories">Accessories</option>}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Brand *</label>
                  <input
                    type="text"
                    placeholder="HP, Dell, CP-PLUS, Frontech, Epson..."
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 52999"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 font-bold focus:outline-none focus:border-[#1A56DB]"
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

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={newProductStockQuantity}
                    onChange={(e) => setNewProductStockQuantity(Number(e.target.value))}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              </div>

              {/* GST Tax Rate & Invoicing Slab */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">GST Tax Rate & HSN Code</span>
                    <span className="text-[11px] text-gray-500">Set specific GST slab & HSN for billing & invoices</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs">
                    {newProductGstRate}% GST
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[0, 5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setNewProductGstRate(rate)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        newProductGstRate === rate
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {rate}% {rate === 18 ? '(Standard)' : rate === 0 ? '(Exempt)' : ''}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Custom GST Rate (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="18"
                      value={newProductGstRate}
                      onChange={(e) => setNewProductGstRate(Number(e.target.value))}
                      className="w-full h-8 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">HSN / SAC Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 8471"
                      value={newProductHsnCode}
                      onChange={(e) => setNewProductHsnCode(e.target.value)}
                      className="w-full h-8 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
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
                <label className="font-bold text-gray-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter detailed features, warranty notes, box contents..."
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 block">Product Photo(s)</label>
                  <label className="cursor-pointer text-[#1A56DB] hover:text-[#1E40AF] font-bold text-xs flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Gallery (Single/Multiple)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleProductUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter image URL or pick from gallery above..."
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    className="flex-1 h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                  {newProductImage && (
                    <div className="w-9 h-9 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-0.5 flex-shrink-0">
                      <img src={newProductImage} alt="preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save to Catalog</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT PRODUCT DETAILS (FULL PRODUCT CONTROL)       */}
      {/* ========================================================= */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#111827]">
                    Edit Product Details
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono">SKU: {editingProduct.sku || editingProduct.id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-2 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  >
                    {distinctCategories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                    {!distinctCategories.some(c => c.name === editCategory) && (
                      <option value={editCategory}>{editCategory}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Brand *</label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Live Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full h-9 bg-gray-50 border-2 border-blue-500 rounded-lg px-3 text-xs text-gray-900 font-extrabold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={editMrp}
                    onChange={(e) => setEditMrp(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editStockQuantity}
                    onChange={(e) => setEditStockQuantity(Number(e.target.value))}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              </div>

              {/* GST Tax Rate & Invoicing Slab */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">GST Tax Rate & HSN Code</span>
                    <span className="text-[11px] text-gray-500">Edit specific GST rate slab & HSN code for this product</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs">
                    {editGstRate}% GST
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[0, 5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setEditGstRate(rate)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        editGstRate === rate
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {rate}% {rate === 18 ? '(Standard)' : rate === 0 ? '(Exempt)' : ''}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Custom GST Rate (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="18"
                      value={editGstRate}
                      onChange={(e) => setEditGstRate(Number(e.target.value))}
                      className="w-full h-8 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">HSN / SAC Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 8471"
                      value={editHsnCode}
                      onChange={(e) => setEditHsnCode(e.target.value)}
                      className="w-full h-8 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-[#1A56DB]"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock Status Toggle */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-800 block">Stock Availability Status</span>
                  <span className="text-[11px] text-gray-500">Toggle whether this product is orderable by customers</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditInStock(!editInStock)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    editInStock
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${editInStock ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  <span>{editInStock ? 'In Stock (Active)' : 'Out of Stock (Inactive)'}</span>
                </button>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Specifications</label>
                <input
                  type="text"
                  value={editSpecs}
                  onChange={(e) => setEditSpecs(e.target.value)}
                  className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 block">Product Image</label>
                  <label className="cursor-pointer text-[#1A56DB] hover:text-[#1E40AF] font-bold text-xs flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProductFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="flex-1 h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                  {editImage && (
                    <div className="w-9 h-9 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-0.5 flex-shrink-0">
                      <img src={editImage} alt="preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete "${editingProduct.name}" completely from database?`)) {
                      deleteProductFromDb(editingProduct.id);
                      setIsEditProductModalOpen(false);
                      setEditingProduct(null);
                    }
                  }}
                  className="px-3.5 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditProductModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 block">Banner Image</label>
                  <label className="cursor-pointer text-[#1A56DB] hover:text-[#1E40AF] font-bold text-xs flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Gallery / Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter image URL or upload from gallery above..."
                    value={newBannerImage}
                    onChange={(e) => setNewBannerImage(e.target.value)}
                    className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                  {newBannerImage && (
                    <div className="h-24 w-full rounded-xl border border-gray-200 overflow-hidden bg-slate-900/5 p-1 flex items-center justify-center">
                      <img src={newBannerImage} alt="Banner Preview" className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
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

      {/* 8. CREATE / EDIT COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden my-8">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1A56DB] flex items-center justify-center font-bold">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    {editingCouponId ? 'Edit Promotional Coupon' : 'Create New Promotional Coupon'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Set discount rules for normal shoppers or premium VIP members.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WELCOME5"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 font-mono font-bold text-sm text-gray-900 uppercase focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Audience *</label>
                  <select
                    value={couponAudience}
                    onChange={(e) => setCouponAudience(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 font-semibold text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  >
                    <option value="normal">Normal Shoppers (General)</option>
                    <option value="premium">Premium / VIP Customers</option>
                    <option value="all">All Shoppers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Coupon Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special 5% Welcome Discount"
                  value={couponTitleInput}
                  onChange={(e) => setCouponTitleInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Type *</label>
                  <select
                    value={couponDiscountType}
                    onChange={(e) => setCouponDiscountType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 font-semibold text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  >
                    <option value="percentage">Percentage OFF (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    {couponDiscountType === 'percentage' ? 'Percentage (e.g. 5 for 5%) *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5"
                    value={couponDiscountValue}
                    onChange={(e) => setCouponDiscountValue(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="499"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1000 (optional)"
                    value={couponMaxDiscount}
                    onChange={(e) => setCouponMaxDiscount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={couponValidUntil}
                    onChange={(e) => setCouponValidUntil(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={couponIsActive}
                      onChange={(e) => setCouponIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1A56DB] focus:ring-blue-500"
                    />
                    <span>Active & Redeemable</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description / Short Terms</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Valid on all laptops and electronics across Lapiez showroom."
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingCouponId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
