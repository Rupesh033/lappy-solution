// Lapiez - Coupon & Promotional Code System

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 5 for 5%, 500 for ₹500
  minOrder: number;
  maxDiscount?: number; // Cap for percentage discount in INR
  audience: 'normal' | 'premium' | 'all';
  description: string;
  isActive: boolean;
  validUntil?: string;
  usageLimit?: number;
  timesUsed?: number;
  createdAt?: string;
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coupon-norm-welcome5',
    code: 'WELCOME5',
    title: 'Normal Customer Special',
    discountType: 'percentage',
    discountValue: 5,
    minOrder: 499,
    maxDiscount: 1500,
    audience: 'normal',
    description: 'Instant 5% OFF on all hardware, spares, displays & accessories for regular buyers.',
    isActive: true,
    validUntil: '2027-12-31',
    timesUsed: 14,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coupon-prem-lapiezvip',
    code: 'LAPIEZVIP',
    title: 'Premium VIP Club Special',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 2499,
    maxDiscount: 5000,
    audience: 'premium',
    description: 'Exclusive 10% OFF for VIP & Premium Customers on laptops, custom PCs & CCTV kits.',
    isActive: true,
    validUntil: '2027-12-31',
    timesUsed: 38,
    createdAt: new Date().toISOString()
  }
];

// Helper to compute discount for a coupon given an order amount
export function calculateCouponDiscount(coupon: Coupon, orderAmount: number): {
  isValid: boolean;
  discountAmount: number;
  error?: string;
} {
  if (!coupon.isActive) {
    return { isValid: false, discountAmount: 0, error: 'This coupon is currently inactive.' };
  }

  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
    return { isValid: false, discountAmount: 0, error: 'This coupon code has expired.' };
  }

  if (orderAmount < coupon.minOrder) {
    return { 
      isValid: false, 
      discountAmount: 0, 
      error: `Minimum order amount to apply ${coupon.code} is ₹${coupon.minOrder.toLocaleString('en-IN')}.` 
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((orderAmount * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = Math.min(coupon.discountValue, orderAmount);
  }

  return {
    isValid: true,
    discountAmount: discount
  };
}
