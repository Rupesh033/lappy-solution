'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Truck, Store, Check, ArrowLeft, 
  ArrowRight, QrCode, CreditCard, Banknote, Smartphone, 
  Copy, CheckCircle2, Lock, Building, UploadCloud, AlertCircle, Tag,
  User, UserCheck, LogIn, LogOut, Clock, RotateCcw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/storeData';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cart, 
    placeOrder, 
    showToast, 
    paymentSettings,
    coupons,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    customer,
    isCustomerLoading,
    loginCustomerManually,
    signOutCustomer
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Fast Sign-In States (When Visitor is Not Logged In)
  const [fastSignInName, setFastSignInName] = useState('');
  const [fastSignInPhone, setFastSignInPhone] = useState('');
  const [fastSignInEmail, setFastSignInEmail] = useState('');
  const [fastSignInError, setFastSignInError] = useState('');

  // Customer & Shipping State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Garhwa');
  const [pincode, setPincode] = useState('822114');
  const [orderNotes, setOrderNotes] = useState('');

  // GST Invoice
  const [needGst, setNeedGst] = useState(false);
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'cod' | 'netbanking'>('upi_qr');
  const [utrNumber, setUtrNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempOrderId, setTempOrderId] = useState('');
  const [inputCouponCode, setInputCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // 1 min 30 sec (90s) Dynamic Transaction Countdown Timer State
  const [paymentTimerSeconds, setPaymentTimerSeconds] = useState(90);
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  // Generate unique order ID on mount
  useEffect(() => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    setTempOrderId(`LPZ-${randomDigits}`);
  }, []);

  // 90s Countdown Timer Effect for UPI QR Payment
  useEffect(() => {
    if (step !== 3 || paymentMethod !== 'upi_qr') return;
    
    if (paymentTimerSeconds <= 0) {
      setIsTimerExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setPaymentTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, paymentMethod, paymentTimerSeconds]);

  const handleRegenerateUpiSession = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    setTempOrderId(`LPZ-${randomDigits}`);
    setPaymentTimerSeconds(90);
    setIsTimerExpired(false);
    setUtrNumber('');
    showToast('UPI payment session refreshed! 1m 30s timer restarted.');
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const finalTotal = Math.max(0, subtotal - (couponDiscount || 0));

  // Official Merchant UPI URI from CMS Database
  const upiId = paymentSettings.upiId || 'lappy.solution@ybl';
  const upiName = paymentSettings.upiName || 'LAPIEZ GARHWA';
  const upiPaymentUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${finalTotal}&cu=INR&tn=Order%20${tempOrderId}`;

  const handleApplyCouponCode = (e?: React.FormEvent, codeToApply?: string) => {
    if (e) e.preventDefault();
    const code = (codeToApply || inputCouponCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponError('');
    const res = applyCoupon(code, subtotal);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCouponCode('');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Pre-fill shipping form when customer is logged in
  useEffect(() => {
    if (customer) {
      const fullName = (customer.user_metadata?.full_name || customer.user_metadata?.name || '').trim();
      if (fullName && !customerName) {
        setCustomerName(fullName);
      }
      if (customer.email && !email && !customer.email.includes('@customer.lapiez.in') && !customer.email.includes('@guest.')) {
        setEmail(customer.email);
      }
      const custPhone = customer.phone || customer.user_metadata?.phone;
      if (custPhone && !phone) {
        setPhone(custPhone);
      }
    }
  }, [customer]);

  // Google GSI Instant Sign-in for Checkout
  useEffect(() => {
    if (customer) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '825902095033-m9afrcqfcf63h0e0j6g2eb10811e5828.apps.googleusercontent.com';
    
    const parseJwt = (token: string) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch {
        return null;
      }
    };

    const initCheckoutGsi = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              if (response?.credential) {
                const payload = parseJwt(response.credential);
                if (payload?.email) {
                  loginCustomerManually({
                    id: payload.sub,
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                  });
                  setCustomerName(payload.name || '');
                  setEmail(payload.email || '');
                  showToast(`Welcome ${payload.name || payload.email}! Signed in successfully.`);
                }
              }
            },
          });

          const btnEl = document.getElementById('checkout-google-gsi');
          if (btnEl) {
            google.accounts.id.renderButton(btnEl, {
              theme: 'outline',
              size: 'large',
              width: '280',
              text: 'continue_with',
              shape: 'rectangular',
            });
          }
        } catch (err) {
          console.log('Google Identity checkout init note:', err);
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      initCheckoutGsi();
    } else {
      const timer = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(timer);
          initCheckoutGsi();
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, [customer, loginCustomerManually, showToast]);

  const handleFastCustomerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFastSignInError('');
    if (!fastSignInName.trim() || !fastSignInPhone.trim()) {
      setFastSignInError('Please enter your full name and 10-digit mobile number');
      return;
    }
    const cleanPhone = fastSignInPhone.trim().replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setFastSignInError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8 or 9)');
      return;
    }
    const emailToUse = fastSignInEmail.trim() || `${cleanPhone}@customer.lapiez.in`;
    loginCustomerManually({
      id: `usr-${Date.now()}`,
      name: fastSignInName.trim(),
      email: emailToUse,
    });
    setCustomerName(fastSignInName.trim());
    setPhone(cleanPhone);
    if (fastSignInEmail.trim()) setEmail(fastSignInEmail.trim());
    showToast(`Signed in as ${fastSignInName.trim()}! Please complete delivery details.`);
  };

  const handleValidateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      showToast('Please sign in to your customer account to continue checkout');
      return;
    }
    if (!customerName.trim() || !phone.trim()) {
      showToast('Please enter your full name and phone number');
      return;
    }
    if (deliveryType === 'delivery' && (!streetAddress.trim() || !pincode.trim())) {
      showToast('Please enter your delivery street address and pincode');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = () => {
    if (!customer) {
      showToast('Please sign in to your customer account to continue');
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalOrderSubmit = async () => {
    if (!customer) {
      showToast('Please sign in to your customer account before placing an order');
      return;
    }
    if (paymentMethod === 'upi_qr') {
      if (isTimerExpired) {
        showToast('UPI payment session timed out. Please tap "Regenerate QR & Restart Timer" to proceed.');
        return;
      }
      if (!utrNumber.trim()) {
        showToast('Please enter the 12-digit UPI UTR / Transaction Reference number after scanning the QR code');
        return;
      }
    }

    setIsSubmitting(true);

    const fullAddress = deliveryType === 'pickup'
      ? 'Showroom Counter Pickup (In front of G P Plaza, Chiniya Road, Garhwa)'
      : `${streetAddress}${landmark ? `, Near ${landmark}` : ''}, ${city}, Jharkhand - ${pincode}`;

    const newOrder = {
      orderId: tempOrderId,
      customerId: customer.id,
      customerName,
      phone,
      email: email || customer.email || 'customer@lapiez.in',
      address: fullAddress,
      deliveryType,
      items: cart.map(item => ({
        id: item.product.id,
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        category: item.product.category,
        sku: item.product.sku || item.product.id
      })),
      totalAmount: finalTotal,
      subtotalAmount: subtotal,
      couponCode: appliedCoupon?.code || null,
      couponDiscount: couponDiscount || 0,
      paymentMethod: paymentMethod === 'upi_qr' ? 'UPI Dynamic QR (GPay/PhonePe)' : paymentMethod === 'cod' ? 'Cash on Delivery / Pickup' : `NetBanking (${selectedBank})`,
      paymentStatus: paymentMethod === 'upi_qr' ? 'Verification In Progress' : 'Pending Payment',
      utrNumber: utrNumber || null,
      orderDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      gstin: needGst ? gstin : null,
      businessName: needGst ? businessName : null,
      notes: appliedCoupon 
        ? `${orderNotes ? orderNotes + ' | ' : ''}Coupon Applied: ${appliedCoupon.code} (₹${couponDiscount} OFF)`
        : orderNotes || null,
      trackingSteps: [
        { step: 'Order Placed', time: 'Just now', done: true },
        { step: 'Showroom Verification', time: 'Next 15 mins', done: true },
        { step: 'Hardware Testing & Pack', time: 'Pending', done: false },
        { step: 'Out for Delivery / Ready', time: 'Same-day', done: false },
        { step: 'Delivered / Handed Over', time: 'Today', done: false }
      ]
    };

    try {
      await placeOrder(newOrder);
      router.push(`/order-success/${tempOrderId}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to place the order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F1F3F6]">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB] mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Checkout is Empty</h1>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          You don't have any items in your checkout session. Select products from our catalog to begin checkout.
        </p>
        <Link
          href="/shop"
          className="h-11 px-6 rounded-xl bg-[#1A56DB] hover:bg-[#1E40AF] text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F3F6] py-6 sm:py-10 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Header Breadcrumbs & Security Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Official Garhwa 256-Bit Encrypted Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Express Checkout
            </h1>
          </div>

          <Link
            href="/cart"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
        </div>

        {/* Stepper Header (1. Details -> 2. Review -> 3. Payment) */}
        {/* Stepper Header (0. Sign-In -> 1. Details -> 2. Review -> 3. Payment) */}
        <div className="flex items-center justify-between max-w-xl mx-auto mb-10 pb-2">
          {[
            { num: 0, label: 'Sign-In Verification' },
            { num: 1, label: 'Delivery Details' },
            { num: 2, label: 'Order Review' },
            { num: 3, label: 'QR Payment & Confirmation' }
          ].map((s) => {
            const isCompleted = s.num === 0 ? Boolean(customer) : Boolean(customer && step > s.num);
            const isCurrent = s.num === 0 ? !customer : Boolean(customer && step === s.num);
            return (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num === 0 ? <Lock className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Payment Systems (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* If Customer is NOT Signed In: Mandatory Sign-In Gate */}
            {!customer ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB] flex-shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mb-1">
                      Mandatory Step
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900">
                      Sign In Required to Complete Purchase
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      To protect your order, enable showroom warranty verification, and receive genuine GST tax bills, customer authentication is strictly required before placing an order.
                    </p>
                  </div>
                </div>

                {/* Option 1: Google One-Tap / Identity Sign-In */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-700 block">
                    Instant 1-Click Verification:
                  </span>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3">
                    <div id="checkout-google-gsi" className="min-h-[44px] flex items-center justify-center"></div>
                    <span className="text-[11px] text-gray-400">
                      Sign in instantly with your verified Google Account
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Or Sign In with Mobile Number
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Option 2: Fast Mobile & Name Sign-In Form */}
                <form onSubmit={handleFastCustomerSignIn} className="space-y-4">
                  {fastSignInError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{fastSignInError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Singh"
                      value={fastSignInName}
                      onChange={(e) => setFastSignInName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">10-Digit Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={fastSignInPhone}
                      onChange={(e) => setFastSignInPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                    <span className="text-[10px] text-gray-400 block">
                      Order confirmations and tracking alerts will be sent to this number.
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Email Address (Optional for PDF Bill)</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={fastSignInEmail}
                      onChange={(e) => setFastSignInEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#1A56DB] hover:bg-[#1545B0] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-[0.99]"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In & Continue to Delivery Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Privacy Protected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    Garhwa Showroom Verified
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Verified Customer Status Bar */}
                <div className="rounded-2xl bg-white border border-emerald-200 p-4 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      {(customer.user_metadata?.full_name || customer.user_metadata?.name || customer.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">
                          {customer.user_metadata?.full_name || customer.user_metadata?.name || 'Verified Customer'}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Signed In
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {customer.email && !customer.email.includes('@customer.lapiez.in') ? customer.email : phone ? `Mobile: ${phone}` : 'Active Account'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOutCustomer()}
                    className="text-xs text-slate-500 hover:text-rose-600 font-semibold cursor-pointer transition-colors"
                  >
                    Switch Account
                  </button>
                </div>

                {/* STEP 1: Customer & Delivery Address Form */}
                {step === 1 && (
                  <form onSubmit={handleValidateStep1} className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Contact Information */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
                    <span>Customer Contact Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Kumar"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Email Address (for Digital GST Bill)</label>
                      <input
                        type="email"
                        placeholder="e.g. rajesh@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Preference */}
                <div className="pt-2">
                  <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
                    <span>Choose Delivery Method</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3 ${
                        deliveryType === 'delivery'
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <Truck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${deliveryType === 'delivery' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div>
                        <strong className="block text-xs font-bold text-slate-900">Same-Day Local Delivery</strong>
                        <span className="text-[11px] text-slate-500">Free door-to-door delivery in Garhwa & nearby villages.</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3 ${
                        deliveryType === 'pickup'
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <Store className={`w-5 h-5 flex-shrink-0 mt-0.5 ${deliveryType === 'pickup' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div>
                        <strong className="block text-xs font-bold text-slate-900">Showroom Pickup (30 Mins)</strong>
                        <span className="text-[11px] text-slate-500">Opposite G P Plaza, Chiniya Road. Test before taking home.</span>
                      </div>
                    </button>
                  </div>

                  {/* Physical Address Fields if Delivery */}
                  {deliveryType === 'delivery' ? (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Street Address / Mohalla / Village *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Near Bus Stand, Main Market, Ward No. 4"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Landmark</label>
                          <input
                            type="text"
                            placeholder="e.g. Near Shiv Mandir"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">City</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Pincode *</label>
                          <input
                            type="text"
                            required
                            placeholder="822114"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <strong className="block font-bold">Showroom Address for Counter Collection:</strong>
                      <p>Lapiez, In front of G P Plaza, Chiniya Road, Garhwa, Jharkhand - 822114</p>
                      <p className="text-[11px] text-amber-800 pt-1">
                        Timings: Monday to Saturday (10:00 AM - 8:30 PM). Your items will be packaged and ready with test certificates.
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional GST Invoicing Box */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needGst}
                      onChange={(e) => setNeedGst(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-900">
                      I require an official Business GST Tax Invoice (for ITC input credit)
                    </span>
                  </label>

                  {needGst && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Company / Firm Name *</label>
                        <input
                          type="text"
                          required={needGst}
                          placeholder="e.g. Maa Tara Enterprises"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">15-Digit GSTIN Number *</label>
                        <input
                          type="text"
                          required={needGst}
                          placeholder="20AAAAA0000A1Z5"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Order Notes (Optional instructions)</label>
                  <input
                    type="text"
                    placeholder="e.g. Call before coming, please install Windows 11 updates"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                {/* Next Step Button */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
                >
                  <span>Continue to Order Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

            {/* STEP 2: Order Review & Confirmation */}
            {step === 2 && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">
                    Review Your Order & Delivery Details
                  </h3>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Edit Details
                  </button>
                </div>

                {/* Customer Details Snapshot */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Customer:</span>
                    <strong className="text-slate-900">{customerName} ({phone})</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Email:</span>
                    <strong className="text-slate-900">{email || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Mode:</span>
                    <strong className="text-blue-700 uppercase">
                      {deliveryType === 'delivery' ? 'Home Delivery in Garhwa' : 'Showroom Pickup (Chiniya Road)'}
                    </strong>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-slate-600">
                      <span>Address:</span>
                      <strong className="text-slate-900 text-right max-w-xs">
                        {streetAddress}, {city} - {pincode}
                      </strong>
                    </div>
                  )}
                  {needGst && (
                    <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
                      <span>GST Invoicing:</span>
                      <strong className="text-slate-900">{businessName} ({gstin})</strong>
                    </div>
                  )}
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Items in This Package ({cart.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                    {cart.map((item) => (
                      <div key={item.product.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-contain rounded-lg border border-slate-100 p-1 flex-shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-slate-900 block truncate">{item.product.name}</span>
                            <span className="text-slate-500 font-mono text-[11px]">Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 font-mono">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
                  >
                    <span>Proceed to Payment (Select QR / Cash)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: Integrated Payment Systems (Dynamic QR Code + UPI + COD) */}
            {step === 3 && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                
                <div>
                  <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">3</span>
                    <span>Select Payment Option</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose dynamic UPI QR code scanning, Cash on Delivery, or NetBanking.
                  </p>
                </div>

                {/* 3 Payment Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi_qr')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === 'upi_qr'
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <QrCode className="w-6 h-6 text-blue-600" />
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Fastest</span>
                    </div>
                    <strong className="block text-xs font-bold text-slate-900">UPI Dynamic QR</strong>
                    <span className="text-[10px] text-slate-500">PhonePe, GPay, Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Banknote className="w-6 h-6 text-slate-700" />
                    </div>
                    <strong className="block text-xs font-bold text-slate-900">Cash on Delivery / Pickup</strong>
                    <span className="text-[10px] text-slate-500">Pay when receiving item</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Building className="w-6 h-6 text-slate-700" />
                    </div>
                    <strong className="block text-xs font-bold text-slate-900">Bank Transfer / IMPS</strong>
                    <span className="text-[10px] text-slate-500">Direct Showroom Account</span>
                  </button>
                </div>

                {/* PAYMENT METHOD A: DYNAMIC UPI QR CODE SYSTEM WITH 90s TRANSACTION TIMER */}
                {paymentMethod === 'upi_qr' && (
                  <div className="rounded-2xl border-2 border-blue-500 bg-gradient-to-b from-blue-50/30 to-white p-6 space-y-6">
                    
                    <div className="text-center space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                        Instant UPI Payment Gateway
                      </span>
                      <h4 className="text-lg font-black text-slate-900">
                        Scan to Pay ₹{finalTotal.toLocaleString('en-IN')}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Use PhonePe, Google Pay, Paytm, BHIM, or any banking UPI app.
                      </p>
                    </div>

                    {/* Dynamic 90-Second Transaction Countdown Bar */}
                    <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isTimerExpired
                        ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
                        : paymentTimerSeconds <= 20
                        ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-xs ${
                          isTimerExpired 
                            ? 'bg-rose-600 text-white' 
                            : paymentTimerSeconds <= 20 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-emerald-600 text-white'
                        }`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black flex items-center gap-2">
                            <span>{isTimerExpired ? 'Session Expired (1m 30s Time Limit)' : 'Transaction Timer Active'}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 border font-bold">
                              1 Min 30 Sec
                            </span>
                          </div>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            {isTimerExpired
                              ? 'Payment session expired for security. Tap regenerate to get a new QR code.'
                              : 'Complete UPI payment and enter UTR reference before timer expires.'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Time Left</span>
                        <span className={`text-xl font-mono font-black tracking-tight ${
                          isTimerExpired ? 'text-rose-700' : paymentTimerSeconds <= 20 ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {formatTimer(paymentTimerSeconds)}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic QR Code Card or Expired State */}
                    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-slate-200 shadow-md max-w-xs mx-auto text-center relative overflow-hidden">
                      
                      {isTimerExpired ? (
                        <div className="py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                          <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
                            <AlertCircle className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-sm font-black text-slate-900">QR Code Expired</h5>
                            <p className="text-xs text-slate-500 max-w-[240px] mx-auto">
                              The 1 min 30 sec payment window has ended to prevent duplicate or stalled transactions.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRegenerateUpiSession}
                            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Regenerate QR & Restart Timer (1:30)</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Merchant Logo Badge */}
                          <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-900">
                            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">LS</div>
                            <span>LAPIEZ GARHWA</span>
                          </div>

                          {/* Live Generated QR Code */}
                          <div className="p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-inner">
                            <QRCodeSVG
                              value={upiPaymentUri}
                              size={190}
                              level="H"
                              includeMargin={false}
                            />
                          </div>

                          <div className="mt-3 text-center space-y-1">
                            <span className="text-xs font-black text-slate-900 block font-mono">
                              Payable: ₹{finalTotal.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              Order Ref: {tempOrderId}
                            </span>
                          </div>

                          {/* Direct UPI Mobile Intent Link */}
                          <div className="mt-4 w-full">
                            <a
                              href={upiPaymentUri}
                              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Pay via PhonePe / GPay App</span>
                            </a>
                          </div>
                        </>
                      )}

                    </div>

                    {/* Copy UPI ID Box */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs max-w-md mx-auto">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Official Showroom UPI ID</span>
                        <strong className="text-slate-900 font-mono text-sm">{upiId}</strong>
                      </div>
                      <button
                        onClick={handleCopyUpi}
                        className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied' : 'Copy ID'}</span>
                      </button>
                    </div>

                    {/* Verification Step: Enter UTR / Transaction Ref */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Step 2: Enter 12-Digit UPI Transaction ID / UTR Number *</span>
                        </div>
                        {isTimerExpired && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Session Expired
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        After completing payment in your UPI app, enter the 12-digit UTR / UPI Reference Number shown on your transaction screen:
                      </p>
                      <input
                        type="text"
                        required
                        disabled={isTimerExpired}
                        placeholder="e.g. 428172918273"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.trim())}
                        className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm font-mono tracking-wider focus:outline-none ${
                          isTimerExpired 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
                        }`}
                      />
                    </div>

                  </div>
                )}

                {/* PAYMENT METHOD B: CASH ON DELIVERY / SHOWROOM PICKUP */}
                {paymentMethod === 'cod' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <span>Zero Advance Required • Pay When Product Reaches You</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      You can pay ₹{finalTotal.toLocaleString('en-IN')} by Cash, UPI QR on delivery agent's scanner, or card swipe when your order is delivered to your doorstep in Garhwa or when you inspect the hardware at our Chiniya Road showroom counter.
                    </p>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold pt-1">
                      <Check className="w-4 h-4" />
                      <span>Free unboxing & hardware test guaranteed before payment.</span>
                    </div>
                  </div>
                )}

                {/* PAYMENT METHOD C: NETBANKING / DIRECT IMPS */}
                {paymentMethod === 'netbanking' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium"
                      >
                        <option>State Bank of India (SBI)</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Bank of India (Garhwa Main Branch)</option>
                        <option>Punjab National Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-[11px] text-slate-600">
                      <strong className="block text-slate-900">Official Current Account Details:</strong>
                      <p>Account Name: <strong className="text-slate-900">LAPIEZ GARHWA</strong></p>
                      <p>Bank: <strong className="text-slate-900">Bank of India, Garhwa Branch</strong></p>
                      <p>Account No: <strong className="text-slate-900 font-mono">482020110001892</strong></p>
                      <p>IFSC Code: <strong className="text-slate-900 font-mono">BKID0004820</strong></p>
                    </div>
                  </div>
                )}

                {/* Final Order Confirmation CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalOrderSubmit}
                    className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                  >
                    {isSubmitting ? (
                      <span>Verifying & Placing Order...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Place Order #{tempOrderId} (₹{finalTotal.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}
          </>
        )}

          </div>

          {/* Right Column: Order Bill Summary (5 Cols Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
              
              {!customer && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Please sign in on the left to continue to delivery & payment.</span>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">
                  Order Summary
                </h3>
                <span className="text-xs font-mono text-blue-600 font-bold">
                  {tempOrderId}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-contain rounded-lg border border-slate-100 p-1 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate">{item.product.name}</span>
                        <span className="text-slate-400 font-mono text-[10px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 font-mono flex-shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    <span>Have a Coupon Code?</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {!appliedCoupon ? (
                  <div className="space-y-1.5">
                    <form onSubmit={(e) => handleApplyCouponCode(e)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Promo / Coupon Code"
                        value={inputCouponCode}
                        onChange={(e) => setInputCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono uppercase focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="font-mono font-bold text-emerald-900">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-emerald-700 block">{appliedCoupon.title} Applied</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700">
                      -₹{couponDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Invoice (18%)</span>
                  <span className="text-slate-900 font-medium">Included</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Grand Total</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Genuine Boxed Goods with Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Verified Garhwa Flagship Store Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Express Dispatch from Chiniya Road Lab</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
